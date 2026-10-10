import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getDashboardPath } from "../context/authRoles";
import { useAuth } from "../context/useAuth";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, serviceError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const user = await signIn({ email, password });
      const isStaff = user.role === "admin" || user.role === "super_admin";
      navigate(
        isStaff
          ? getDashboardPath(user.role)
          : location.state?.redirectTo || "/account",
        { replace: true }
      );
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

            <h1>Welcome Back</h1>

            <p>
              Sign in to manage your bookings and
              continue your stay with us. Accounts created
              before shared sign-in was enabled need to be
              registered again here.
            </p>
          </div>

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >

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
              <label>Password</label>

              <input
                type="password"
                required
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {(error || serviceError) && (
              <p className="form-error" role="alert">{error || serviceError}</p>
            )}

            <button
              type="submit"
              className="login-submit-btn"
              disabled={submitting}
            >
              {submitting ? "SIGNING IN…" : "SIGN IN →"}
            </button>

          </form>

          <div className="login-divider">
            <span>OR</span>
          </div>

          <div className="login-register">
            <p>
              Don't have an account?
            </p>

            <Link to="/register">
              CREATE ACCOUNT
            </Link>
          </div>

        </div>

      </section>
    </main>
  );
}

export default Login;