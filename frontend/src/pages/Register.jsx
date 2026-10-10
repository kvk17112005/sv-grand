import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getDashboardPath } from "../context/authRoles";
import { useAuth } from "../context/useAuth";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const user = await register({ name, email, phone, password });
      navigate(getDashboardPath(user.role), { replace: true });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-container">
        <div className="login-card">

          <div className="login-header">
            <p className="section-label">
              SV GRAND LUXURY ROOMS
            </p>

            <h1>Create Account</h1>

            <p>
              Create your account to manage your
              bookings and reservations.
            </p>
          </div>

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >

            <div className="login-field">
              <label>Full Name</label>

              <input
                type="text"
                required
                autoComplete="name"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="login-field">
              <label>Email Address</label>

              <input
                type="email"
                required
                autoComplete="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="login-field">
              <label>Phone Number</label>

              <input
                type="tel"
                required
                autoComplete="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="login-field">
              <label>Password</label>

              <input
                type="password"
                required
                autoComplete="new-password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="login-field">
              <label>Confirm Password</label>

              <input
                type="password"
                required
                autoComplete="new-password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
              />
            </div>

            {error && <p className="form-error" role="alert">{error}</p>}

            <button
              type="submit"
              className="login-submit-btn"
              disabled={submitting}
            >
              {submitting ? "CREATING ACCOUNT…" : "CREATE ACCOUNT →"}
            </button>

          </form>

          <div className="login-divider">
            <span>OR</span>
          </div>

          <div className="login-register">
            <p>
              Already have an account?
            </p>

            <Link to="/login">
              SIGN IN
            </Link>
          </div>

        </div>
      </section>
    </main>
  );
}

export default Register;