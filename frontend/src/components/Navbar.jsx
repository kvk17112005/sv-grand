import { useEffect, useRef, useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  FaUser,
  FaChevronDown,
  FaMoon,
  FaSun,
  FaSuitcase,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { getDashboardPath } from "../context/authRoles";
import { useAuth } from "../context/useAuth";

function Navbar() {
  const navigate = useNavigate();
  const { user, status, signOut } = useAuth();
  const menuRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("svGrandDarkMode") === "true"
  );

  const isStaff = user?.role === "admin" || user?.role === "super_admin";

  /*
    Dark / Light mode
  */
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("svGrandDarkMode", "true");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("svGrandDarkMode", "false");
    }
  }, [darkMode]);

  /*
    Close dropdown when clicking outside
  */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /*
    Logout
  */
  const handleLogout = async () => {
    setLogoutError("");
    try {
      await signOut();
      setMenuOpen(false);
      navigate("/", { replace: true });
    } catch (error) {
      setLogoutError(error.message);
    }
  };

  /*
    Dark / Light mode
  */
  const handleThemeToggle = () => {
    setDarkMode((previous) => !previous);
  };

  return (
    <header className="navbar">

      {/* OLD LOGO - DO NOT CHANGE */}
      <Link to="/" className="hotel-logo">

        <img
          src="/hotel/sv-logo-mark.png"
          alt="SV Grand Luxury Rooms"
        />

        <div className="hotel-logo-text">
          <span className="hotel-logo-main">
            SV GRAND
          </span>

          <span className="hotel-logo-sub">
            LUXURY ROOMS
          </span>
        </div>

      </Link>

      {/* NAVIGATION */}
      <nav className="nav-links">

        <Link to="/">
          HOME
        </Link>

        <Link to="/rooms">
          ROOMS
        </Link>

        <Link to="/about">
          ABOUT
        </Link>

        <Link to="/contact">
          CONTACT
        </Link>


        {/* NOT LOGGED IN → BOOK NOW */}
        {status === "ready" && !user && (
          <Link
            to="/login"
            className="nav-book-btn"
          >
            BOOK NOW
            <span>→</span>
          </Link>
        )}


        {/* LOGGED IN → USER ICON */}
        {status === "ready" && user && (
          <div
            className="navbar-user"
            ref={menuRef}
          >

            <button
              type="button"
              className="user-menu-button"
              onClick={() =>
                setMenuOpen(
                  (previous) => !previous
                )
              }
              aria-label="User menu"
            >
              <FaUser />

              <FaChevronDown
                className={`user-chevron ${
                  menuOpen ? "open" : ""
                }`}
              />
            </button>


            {/* USER DROPDOWN */}
            {menuOpen && (
              <div className="user-dropdown">

                {/* USER DETAILS */}
                <div className="user-dropdown-header">

                  <div className="user-avatar">
                    <FaUser />
                  </div>

                  <div className="user-info">
                    <strong>
                      {user.name || user.fullName || user.email}
                    </strong>

                    <span>
                      {user.email}
                    </span>
                  </div>

                </div>


                <div className="user-dropdown-divider"></div>


                {/* MY ACCOUNT */}
                <button
                  type="button"
                  className="user-dropdown-item"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate(getDashboardPath(user.role));
                  }}
                >
                  <FaUserCircle />
                  <span>
                    {isStaff ? "Management Dashboard" : "My Account"}
                  </span>
                </button>


                {/* MY BOOKINGS */}
                <button
                  type="button"
                  className="user-dropdown-item"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/my-bookings");
                  }}
                >
                  <FaSuitcase />
                  <span>
                    My Bookings
                  </span>
                </button>


                {/* DARK / LIGHT MODE */}
                <button
                  type="button"
                  className="user-dropdown-item"
                  onClick={handleThemeToggle}
                >
                  {darkMode ? (
                    <FaSun />
                  ) : (
                    <FaMoon />
                  )}

                  <span>
                    {darkMode
                      ? "Light Mode"
                      : "Dark Mode"}
                  </span>
                </button>
                {logoutError && (
                  <p className="navbar-error" role="alert">{logoutError}</p>
                )}


                <div className="user-dropdown-divider"></div>


                {/* LOGOUT */}
                <button
                  type="button"
                  className="user-dropdown-item logout-item"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt />

                  <span>
                    Logout
                  </span>
                </button>

              </div>
            )}

          </div>
        )}

      </nav>

    </header>
  );
}

export default Navbar;