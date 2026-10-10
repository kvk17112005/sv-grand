import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/api";

function getLocalDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getBookingStatus(booking) {
  if (booking.status === "pending") return "Pending Approval";
  if (booking.status === "cancelled") return "Cancelled";

  const today = getLocalDate();

  if (booking.checkOut < today) {
    return "Expired";
  }

  if (booking.checkIn > today) {
    return "Upcoming";
  }

  return "Ongoing";
}

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    apiRequest("/api/bookings?scope=mine")
      .then((payload) => {
        if (!Array.isArray(payload?.bookings)) {
          throw new Error("The account service returned an invalid bookings response.");
        }
        if (active) setBookings(payload.bookings);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(`${date}T00:00:00`).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatAmount = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN")}`;

  return (
    <main className="my-bookings-page">
      <section className="my-bookings-header">
        <p className="section-label">SV GRAND LUXURY ROOMS</p>
        <h1>My Bookings</h1>
        <p>View your reservations and previous stays.</p>
      </section>

      <section className="my-bookings-content">
        <div className="my-bookings-summary">
          <div>
            <span>Total Bookings</span>
            <strong>{bookings.length}</strong>
          </div>

          <div>
            <span>Upcoming</span>
            <strong>
              {bookings.filter(
                (booking) => getBookingStatus(booking) === "Upcoming"
              ).length}
            </strong>
          </div>

          <div>
            <span>Expired</span>
            <strong>
              {bookings.filter(
                (booking) => getBookingStatus(booking) === "Expired"
              ).length}
            </strong>
          </div>
        </div>

        {error ? (
          <div className="no-bookings">
            <h2>Could not load your bookings</h2>
            <p role="alert">{error}</p>
          </div>
        ) : loading ? (
          <div className="no-bookings"><p>Loading your bookings…</p></div>
        ) : bookings.length === 0 ? (
          <div className="no-bookings">
            <h2>No bookings yet</h2>
            <p>Your room reservations will appear here after booking.</p>
            <Link to="/rooms" className="gold-button">
              EXPLORE ROOMS
            </Link>
          </div>
        ) : (
          <div className="my-bookings-list">
            {bookings.map((booking) => {
              const status = getBookingStatus(booking);

              return (
                <article
                  className="my-booking-card"
                  key={booking.bookingId}
                >
                  <div className="my-booking-top">
                    <div>
                      <p className="section-label">BOOKING ID</p>
                      <h3>{booking.bookingId}</h3>
                    </div>

                    <span
                      className={`booking-status status-${status.toLowerCase().replaceAll(" ", "-")}`}
                    >
                      {status}
                    </span>
                  </div>

                  <div className="my-booking-details">
                    <div>
                      <span>Room</span>
                      <strong>{booking.roomName}</strong>
                    </div>

                    <div>
                      <span>Check-in</span>
                      <strong>{formatDate(booking.checkIn)}</strong>
                    </div>

                    <div>
                      <span>Check-out</span>
                      <strong>{formatDate(booking.checkOut)}</strong>
                    </div>

                    <div>
                      <span>Guests</span>
                      <strong>{booking.totalGuests}</strong>
                    </div>

                    <div>
                      <span>Nights</span>
                      <strong>{booking.nights}</strong>
                    </div>

                    <div>
                      <span>Total Amount</span>
                      <strong>{formatAmount(booking.grandTotal)}</strong>
                    </div>
                  </div>

                  {status === "Expired" && (
                    <p className="expired-note">
                      This stay has ended. Your booking record is retained
                      in your booking history.
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default MyBookings;
