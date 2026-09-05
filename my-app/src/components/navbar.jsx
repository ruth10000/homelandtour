import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaPlaneDeparture, FaBars, FaTimes } from "react-icons/fa";
import "./Navbar.css";

const LINKS = [
  { to: "/home", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/tours", label: "Tours" },
  { to: "/packages", label: "Packages" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      {/* Logo */}
      <div className="logo">
        <FaPlaneDeparture className="logo-icon" />
        <span className="logo-text">Travel</span>
      </div>

      {/* Hamburger Button */}
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      {/* Navigation Links */}
      <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
        {LINKS.map(({ to, label }) => (
          <li key={to}>
            <Link
              to={to}
              className={location.pathname === to ? "active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

