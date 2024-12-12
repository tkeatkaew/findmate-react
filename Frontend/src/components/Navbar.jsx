import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const isAuthenticated = !!localStorage.getItem("user");
  const location = useLocation();

  // Check if the current page is the Dashboard
  const isDashboard = location.pathname === "/dashboard";

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">Find Mate</Link>
      </div>

      <ul className="menu">
        {isAuthenticated ? (
          isDashboard ? (
            // Only show the Logout button on the Dashboard
            <li>
              <Link
                to="/"
                onClick={() => {
                  localStorage.removeItem("user");
                }}
                className="logout-btn"
              >
                Logout
              </Link>
            </li>
          ) : (
            // Show Dashboard link and Logout on other authenticated pages
            <>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link
                  to="/"
                  onClick={() => {
                    localStorage.removeItem("user");
                  }}
                  className="logout-btn"
                >
                  Logout
                </Link>
              </li>
            </>
          )
        ) : (
          // Show Login and Register buttons for non-authenticated users
          <>
            <li>
              <Link to="/login" className="login-btn">
                Login
              </Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
