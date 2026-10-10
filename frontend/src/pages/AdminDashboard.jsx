import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { apiRequest } from "../services/api";

function formatAmount(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function AdminDashboard() {
  const { user } = useAuth();
  const role = user.role;
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    apiRequest("/api/admin/overview")
      .then((payload) => {
        if (
          !payload?.stats ||
          !Array.isArray(payload.bookings) ||
          !Array.isArray(payload.customers) ||
          (role === "super_admin" && !Array.isArray(payload.staff))
        ) {
          throw new Error("The account service returned an invalid management response.");
        }
        if (active) setOverview(payload);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      });

    return () => {
      active = false;
    };
  }, [role]);

  const stats = overview?.stats;

  return (
    <main className="admin-page">
      <section className="admin-heading">
        <div>
          <p className="section-label">SV GRAND · MANAGEMENT</p>
          <h1>{role === "super_admin" ? "Super Admin" : "Admin"} Dashboard</h1>
          <p>Track hotel bookings and customer activity.</p>
        </div>
        <span className="admin-role-badge">
          {role === "super_admin" ? "SUPER ADMIN" : "ADMIN"}
        </span>
      </section>

      {error && <p className="admin-error" role="alert">{error}</p>}

      {stats ? (
        <>
          <section className="admin-stats">
            <article><span>Total bookings</span><strong>{stats.bookings}</strong></article>
            <article><span>Customers</span><strong>{stats.customers}</strong></article>
            <article><span>Upcoming stays</span><strong>{stats.upcomingBookings}</strong></article>
            <article><span>Booking revenue</span><strong>{formatAmount(stats.revenue)}</strong></article>
          </section>

          <section className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <p className="section-label">RESERVATIONS</p>
                <h2>Recent bookings</h2>
              </div>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr><th>Booking</th><th>Guest</th><th>Room</th><th>Stay</th><th>Status</th><th>Total</th></tr>
                </thead>
                <tbody>
                  {(overview.bookings || []).map((booking) => (
                    <tr key={booking.bookingId}>
                      <td>{booking.bookingId}</td>
                      <td>{booking.guestName}<span>{booking.email}</span></td>
                      <td>{booking.roomName}</td>
                      <td>{booking.checkIn} – {booking.checkOut}</td>
                      <td><span className="admin-status">{booking.status}</span></td>
                      <td>{formatAmount(booking.grandTotal)}</td>
                    </tr>
                  ))}
                  {overview.bookings?.length === 0 && (
                    <tr><td colSpan="6" className="admin-empty">No bookings have been recorded yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <p className="section-label">CUSTOMER DIRECTORY</p>
                <h2>Registered customers</h2>
              </div>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Bookings</th><th>Joined</th></tr></thead>
                <tbody>
                  {(overview.customers || []).map((customer) => (
                    <tr key={customer.id}>
                      <td>{customer.name}</td><td>{customer.email}</td><td>{customer.phone || "—"}</td>
                      <td>{customer.bookingCount}</td><td>{customer.createdAt}</td>
                    </tr>
                  ))}
                  {overview.customers?.length === 0 && (
                    <tr><td colSpan="5" className="admin-empty">No customer accounts have been recorded yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {role === "super_admin" && (
            <section className="admin-panel">
              <div className="admin-panel-heading">
                <div>
                  <p className="section-label">ACCESS CONTROL</p>
                  <h2>Staff accounts</h2>
                </div>
                <p>Only super admins can view staff access.</p>
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Created</th></tr></thead>
                  <tbody>
                    {(overview.staff || []).map((staff) => (
                      <tr key={staff.id}>
                        <td>{staff.name}</td><td>{staff.email}</td><td>{staff.role}</td><td>{staff.createdAt}</td>
                      </tr>
                    ))}
                    {overview.staff?.length === 0 && (
                      <tr><td colSpan="4" className="admin-empty">No staff accounts are available.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </>
      ) : !error ? (
        <div className="admin-loading">Loading management data…</div>
      ) : null}
    </main>
  );
}

export default AdminDashboard;
