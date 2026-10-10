import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    // Temporary login
    // Customer authentication will be connected later.
    localStorage.setItem("svGrandLoggedIn", "true");
    localStorage.setItem("svGrandCustomerEmail", email);

    navigate(location.state?.redirectTo || "/rooms");
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
              continue your stay with us.
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
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="login-field">
              <label>Password</label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="login-options">
              <label>
                <input type="checkbox" />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                className="forgot-password"
                onClick={() =>
                  alert("Password reset will be available soon.")
                }
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="login-submit-btn"
            >
              SIGN IN →
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