import { randomBytes, timingSafeEqual } from "node:crypto";
import bcrypt from "bcryptjs";
import connectPgSimple from "connect-pg-simple";
import cors from "cors";
import express from "express";
import { rateLimit } from "express-rate-limit";
import session from "express-session";
import helmet from "helmet";
import { z } from "zod";
import { pool } from "./db.js";

const app = express();
const port = Number(process.env.PORT || 3001);
const frontendOrigin = process.env.FRONTEND_ORIGIN;
const sessionSecret = process.env.SESSION_SECRET;
const sameSite = process.env.COOKIE_SAME_SITE || "lax";
const isProduction = process.env.NODE_ENV === "production";
const allowedOrigins = new Set([frontendOrigin]);

if (!isProduction) {
  allowedOrigins.add("http://localhost:5173");
  allowedOrigins.add("http://127.0.0.1:5173");
}

if (!frontendOrigin) {
  throw new Error("FRONTEND_ORIGIN must be set to the deployed frontend origin.");
}

if (!sessionSecret || sessionSecret.length < 32) {
  throw new Error("SESSION_SECRET must contain at least 32 characters.");
}

if (!["lax", "none"].includes(sameSite)) {
  throw new Error("COOKIE_SAME_SITE must be either lax or none.");
}

if (sameSite === "none" && !isProduction) {
  throw new Error("SameSite=None cookies require NODE_ENV=production and HTTPS.");
}

const PgSession = connectPgSimple(session);
const sessionStore = new PgSession({
  pool,
  tableName: "user_sessions",
  createTableIfMissing: false,
  pruneSessionInterval: 15 * 60,
});

const userInput = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(7).max(30),
  password: z.string().min(10).max(128),
});

const credentialsInput = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(128),
});

const profileInput = z.object({
  name: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(7).max(30),
});

const bookingInput = z.object({
  bookingId: z.string().trim().min(8).max(64),
  roomName: z.enum([
    "Deluxe AC Room",
    "Premium AC Room",
    "Standard Non-AC Room",
    "Non-AC Family Room",
  ]),
  name: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(7).max(30),
  email: z.string().trim().email().max(254),
  checkIn: z.iso.date(),
  checkOut: z.iso.date(),
  adults: z.number().int().min(1).max(20),
  children: z.number().int().min(0).max(20),
  children13Plus: z.number().int().min(0).max(20),
  childrenBelow13: z.number().int().min(0).max(20),
  totalGuests: z.number().int().min(1).max(40),
});

const roomCatalog = {
  "Deluxe AC Room": { roomType: "AC ROOM", price: 1500 },
  "Premium AC Room": { roomType: "AC ROOM", price: 1500 },
  "Standard Non-AC Room": { roomType: "NON-AC ROOM", price: 1000 },
  "Non-AC Family Room": { roomType: "NON-AC ROOM", price: 1000 },
};

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error("This frontend origin is not allowed."));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "OPTIONS"],
  allowedHeaders: ["Content-Type", "X-CSRF-Token"],
}));
app.use(express.json({ limit: "20kb" }));
app.use(session({
  name: "svgrand.sid",
  store: sessionStore,
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite,
    maxAge: 14 * 24 * 60 * 60 * 1000,
  },
}));

function sendValidationError(res, error) {
  return res.status(400).json({
    message: error.issues[0]?.message || "Invalid request.",
  });
}

function csrfTokenFor(req) {
  if (!req.session.csrfToken) {
    req.session.csrfToken = randomBytes(32).toString("hex");
  }
  return req.session.csrfToken;
}

function requireCsrf(req, res, next) {
  const sentToken = req.get("X-CSRF-Token") || "";
  const sessionToken = req.session.csrfToken || "";
  const sent = Buffer.from(sentToken);
  const expected = Buffer.from(sessionToken);

  if (
    sent.length !== expected.length ||
    sent.length === 0 ||
    !timingSafeEqual(sent, expected)
  ) {
    return res.status(403).json({ message: "Your security token expired. Please retry." });
  }

  return next();
}

async function authenticated(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Please sign in to continue." });
  }

  try {
    const result = await pool.query(
      `SELECT id, name, email, phone, role, created_at AS "createdAt"
       FROM users WHERE id = $1`,
      [req.session.userId]
    );

    if (result.rowCount !== 1) {
      return req.session.destroy(() => {
        res.clearCookie("svgrand.sid");
        res.status(401).json({ message: "Your session is no longer valid." });
      });
    }

    req.user = result.rows[0];
    return next();
  } catch (error) {
    return next(error);
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You do not have permission to view this data." });
    }
    return next();
  };
}

function regenerateSession(req) {
  return new Promise((resolve, reject) => {
    req.session.regenerate((error) => error ? reject(error) : resolve());
  });
}

function destroySession(req) {
  return new Promise((resolve, reject) => {
    req.session.destroy((error) => error ? reject(error) : resolve());
  });
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt,
  };
}

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Too many attempts. Please wait and try again." },
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/auth/csrf", (req, res) => {
  res.json({ csrfToken: csrfTokenFor(req) });
});

app.get("/api/auth/session", (req, res, next) => {
  if (!req.session.userId) {
    return res.json({ user: null });
  }
  return authenticated(req, res, next);
}, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

app.post("/api/auth/register", authLimiter, requireCsrf, async (req, res, next) => {
  const parsed = userInput.safeParse(req.body);
  if (!parsed.success) return sendValidationError(res, parsed.error);

  try {
    const email = parsed.data.email.toLowerCase();
    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    const result = await pool.query(
      `INSERT INTO users (name, email, phone, password_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, phone, role, created_at AS "createdAt"`,
      [parsed.data.name, email, parsed.data.phone, passwordHash]
    );
    const user = result.rows[0];

    await regenerateSession(req);
    req.session.userId = user.id;
    return req.session.save((error) => {
      if (error) return next(error);
      return res.status(201).json({ user: publicUser(user) });
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ message: "An account already exists for that email." });
    }
    return next(error);
  }
});

app.post("/api/auth/login", authLimiter, requireCsrf, async (req, res, next) => {
  const parsed = credentialsInput.safeParse(req.body);
  if (!parsed.success) return sendValidationError(res, parsed.error);

  try {
    const result = await pool.query(
      `SELECT id, name, email, phone, role, password_hash,
              created_at AS "createdAt"
       FROM users WHERE email = $1`,
      [parsed.data.email.toLowerCase()]
    );
    const user = result.rows[0];
    const passwordMatches = user
      ? await bcrypt.compare(parsed.data.password, user.password_hash)
      : false;

    if (!passwordMatches) {
      return res.status(401).json({ message: "Email or password is incorrect." });
    }

    await regenerateSession(req);
    req.session.userId = user.id;
    return req.session.save((error) => {
      if (error) return next(error);
      return res.json({ user: publicUser(user) });
    });
  } catch (error) {
    return next(error);
  }
});

app.post("/api/auth/logout", requireCsrf, async (req, res, next) => {
  try {
    await destroySession(req);
    res.clearCookie("svgrand.sid", {
      httpOnly: true,
      secure: isProduction,
      sameSite,
    });
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
});

app.put("/api/account/profile", requireCsrf, authenticated, async (req, res, next) => {
  const parsed = profileInput.safeParse(req.body);
  if (!parsed.success) return sendValidationError(res, parsed.error);

  try {
    const result = await pool.query(
      `UPDATE users
       SET name = $1, phone = $2, updated_at = now()
       WHERE id = $3
       RETURNING id, name, email, phone, role, created_at AS "createdAt"`,
      [parsed.data.name, parsed.data.phone, req.user.id]
    );
    return res.json({ user: publicUser(result.rows[0]) });
  } catch (error) {
    return next(error);
  }
});

app.get("/api/bookings", authenticated, async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT booking_id AS "bookingId", room_type AS "roomType",
              room_name AS "roomName", price, guest_name AS "name",
              guest_phone AS phone, guest_email AS email,
              check_in::text AS "checkIn", check_out::text AS "checkOut",
              adults, children, children_13_plus AS "children13Plus",
              children_below_13 AS "childrenBelow13", total_guests AS "totalGuests",
              nights, room_total AS "roomTotal",
              extra_guest_total AS "extraGuestTotal", grand_total AS "grandTotal",
              status, created_at AS "createdAt"
       FROM bookings
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    );
    return res.json({ bookings: result.rows });
  } catch (error) {
    return next(error);
  }
});

app.post("/api/bookings", requireCsrf, authenticated, async (req, res, next) => {
  const parsed = bookingInput.safeParse(req.body);
  if (!parsed.success) return sendValidationError(res, parsed.error);

  const booking = parsed.data;
  const room = roomCatalog[booking.roomName];
  const checkIn = new Date(`${booking.checkIn}T00:00:00Z`);
  const checkOut = new Date(`${booking.checkOut}T00:00:00Z`);
  const nights = (checkOut.getTime() - checkIn.getTime()) / 86400000;
  const expectedTotalGuests =
    booking.adults + booking.childrenBelow13 + booking.children13Plus;

  if (
    !room ||
    !Number.isInteger(nights) ||
    nights <= 0 ||
    booking.checkIn < new Date().toISOString().slice(0, 10) ||
    booking.children !== booking.childrenBelow13 + booking.children13Plus ||
    booking.totalGuests !== expectedTotalGuests
  ) {
    return res.status(400).json({ message: "The booking details are invalid." });
  }

  const roomTotal = room.price * nights;
  const extraGuestTotal = booking.children13Plus * 500 * nights;
  const grandTotal = roomTotal + extraGuestTotal;

  try {
    const result = await pool.query(
      `INSERT INTO bookings (
         booking_id, user_id, room_type, room_name, price, guest_name,
         guest_phone, guest_email, check_in, check_out, adults, children,
         children_13_plus, children_below_13, total_guests, nights,
         room_total, extra_guest_total, grand_total
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,
               $14, $15, $16, $17, $18, $19)
       RETURNING booking_id AS "bookingId", room_type AS "roomType",
                 room_name AS "roomName", price, guest_name AS "name",
                 guest_phone AS phone, guest_email AS email,
                 check_in::text AS "checkIn", check_out::text AS "checkOut",
                 adults, children, children_13_plus AS "children13Plus",
                 children_below_13 AS "childrenBelow13", total_guests AS "totalGuests",
                 nights, room_total AS "roomTotal",
                 extra_guest_total AS "extraGuestTotal", grand_total AS "grandTotal",
                 status, created_at AS "createdAt"`,
      [
        booking.bookingId,
        req.user.id,
        room.roomType,
        booking.roomName,
        room.price,
        booking.name,
        booking.phone,
        req.user.email,
        booking.checkIn,
        booking.checkOut,
        booking.adults,
        booking.children,
        booking.children13Plus,
        booking.childrenBelow13,
        booking.totalGuests,
        nights,
        roomTotal,
        extraGuestTotal,
        grandTotal,
      ]
    );

    return res.status(201).json({ booking: result.rows[0] });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ message: "This booking reference already exists. Please retry." });
    }
    return next(error);
  }
});

app.get("/api/admin/overview", authenticated, requireRole("admin", "super_admin"), async (req, res, next) => {
  try {
    const [statsResult, bookingsResult, customersResult] = await Promise.all([
      pool.query(
        `SELECT count(*)::int AS bookings,
                (SELECT count(*)::int FROM users WHERE role = 'customer') AS customers,
                count(*) FILTER (WHERE check_in >= CURRENT_DATE)::int AS "upcomingBookings",
                coalesce(sum(grand_total) FILTER (WHERE status <> 'cancelled'), 0)::int AS revenue
         FROM bookings`
      ),
      pool.query(
        `SELECT b.booking_id AS "bookingId", b.guest_name AS "guestName",
                b.guest_email AS email, b.room_name AS "roomName",
                b.check_in::text AS "checkIn", b.check_out::text AS "checkOut",
                b.status, b.grand_total AS "grandTotal"
         FROM bookings b
         ORDER BY b.created_at DESC
         LIMIT 100`
      ),
      pool.query(
        `SELECT u.id, u.name, u.email, u.phone,
                count(b.id)::int AS "bookingCount",
                u.created_at AS "createdAt"
         FROM users u
         LEFT JOIN bookings b ON b.user_id = u.id
         WHERE u.role = 'customer'
         GROUP BY u.id
         ORDER BY u.created_at DESC
         LIMIT 100`
      ),
    ]);

    const response = {
      stats: statsResult.rows[0],
      bookings: bookingsResult.rows,
      customers: customersResult.rows,
    };

    if (req.user.role === "super_admin") {
      const staffResult = await pool.query(
        `SELECT id, name, email, role, created_at AS "createdAt"
         FROM users
         WHERE role IN ('admin', 'super_admin')
         ORDER BY created_at DESC`
      );
      response.staff = staffResult.rows;
    }

    return res.json(response);
  } catch (error) {
    return next(error);
  }
});

app.use((error, _req, res, _next) => {
  console.error("API request failed:", error.message);
  if (res.headersSent) return;
  return res.status(500).json({ message: "The server could not complete that request." });
});

try {
  await pool.query("SELECT 1");
  app.listen(port, () => {
    console.info(`SV Grand API listening on port ${port}.`);
  });
} catch (error) {
  console.error("Could not connect to the database:", error.message);
  process.exitCode = 1;
}
