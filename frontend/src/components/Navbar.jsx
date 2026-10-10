import { useEffect, useRef, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  FaUser,
  FaChevronDown,
  FaMoon,
  FaSun,
  FaBell,
  FaCog,
  FaSuitcase,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("svGrandLoggedIn") === "true"
  );

  const [menuOpen, setMenuOpen] = useState(false);

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("svGrandDarkMode") === "true"
  );

  const userName =
    localStorage.getItem("svGrandCustomerName") || "Guest";

  const userEmail =
    localStorage.getItem("svGrandCustomerEmail") || "";

  /*
    Sync login status whenever the route changes.
    This makes BOOK NOW change to the user icon immediately
    after login.
  */
  useEffect(() => {
    setIsLoggedIn(
      localStorage.getItem("svGrandLoggedIn") === "true"
    );
  }, [location]);

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
  const handleLogout = () => {
    localStorage.removeItem("svGrandLoggedIn");

    setIsLoggedIn(false);
    setMenuOpen(false);

    navigate("/");
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
        {!isLoggedIn && (
          <Link
            to="/login"
            className="nav-book-btn"
          >
            BOOK NOW
            <span>→</span>
          </Link>
        )}


        {/* LOGGED IN → USER ICON */}
        {isLoggedIn && (
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
                      {userName}
                    </strong>

                    <span>
                      {userEmail}
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
                    navigate("/account");
                  }}
                >
                  <FaUserCircle />
                  <span>
                    My Account
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


                {/* NOTIFICATIONS */}
                <button
                  type="button"
                  className="user-dropdown-item"
                  onClick={() => {
                    setMenuOpen(false);
                    alert(
                      "Notifications will be available soon."
                    );
                  }}
                >
                  <FaBell />
                  <span>
                    Notifications
                  </span>
                </button>


                {/* SETTINGS */}
                <button
                  type="button"
                  className="user-dropdown-item"
                  onClick={() => {
                    setMenuOpen(false);
                    alert(
                      "Account settings will be available soon."
                    );
                  }}
                >
                  <FaCog />
                  <span>
                    Settings
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