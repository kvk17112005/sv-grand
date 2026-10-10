import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !phone || !password || !confirmPassword) {
      alert("Please fill in all the details.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    localStorage.setItem("svGrandCustomerName", name);
    localStorage.setItem("svGrandCustomerEmail", email);
    localStorage.setItem("svGrandCustomerPhone", phone);
    localStorage.setItem("svGrandCustomerPassword", password);

    alert("Account created successfully!");

    navigate("/login");
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
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

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
              <label>Phone Number</label>

              <input
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="login-field">
              <label>Password</label>

              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="login-field">
              <label>Confirm Password</label>

              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
              />
            </div>

            <button
              type="submit"
              className="login-submit-btn"
            >
              CREATE ACCOUNT →
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