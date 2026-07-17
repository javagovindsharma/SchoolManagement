import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import schoolConfig from '../config/schoolConfig';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About Us' },
  { path: '/academics', label: 'Academics' },
  { path: '/admissions', label: 'Admissions' },
  { path: '/achievements', label: 'Achievements' },
  { path: '/facilities', label: 'Facilities' },
  { path: '/gallery', label: 'Gallery' },
  { path: '/events', label: 'Events' },
  { path: '/news', label: 'News' },
  { path: '/careers', label: 'Careers' },
  { path: '/branches', label: 'Branches' },
  { path: '/contact', label: 'Contact Us' },
];

export default function PublicLayout() {
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="public-layout">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="container top-bar-content">
          <div className="top-bar-left">
            <span>📞 {schoolConfig.phone}</span>
            <span>✉️ {schoolConfig.email}</span>
          </div>
          <div className="top-bar-right">
            <Link to="/login" className="btn-erp-login">🔐 ERP Login</Link>
            <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="main-header">
        <div className="container header-content">
          <Link to="/" className="logo">
            <div className="logo-icon">{schoolConfig.logo}</div>
            <div className="logo-text">
              <h1>{schoolConfig.name}</h1>
              <span>Affiliated to {schoolConfig.board}, {schoolConfig.city}</span>
            </div>
          </Link>

          <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            {mobileOpen ? '✕' : '☰'}
          </button>

          <nav className={`main-nav ${mobileOpen ? 'open' : ''}`}>
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${pathname === link.path ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Page Content */}
      <main className="public-main">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-col">
            <div className="footer-logo">
              <div className="logo-icon">{schoolConfig.logo}</div>
              <h3>{schoolConfig.name}</h3>
            </div>
            <p>Nurturing young minds with academic excellence, character building, and a spirit of inquiry since {schoolConfig.establishedYear}.</p>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/academics">Academics</Link></li>
              <li><Link to="/admissions">Admissions</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/careers">Careers</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>ERP Portals</h4>
            <ul>
              <li><Link to="/login">Admin Portal</Link></li>
              <li><Link to="/login">Teacher Portal</Link></li>
              <li><Link to="/login">Student Portal</Link></li>
              <li><Link to="/login">Parent Portal</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contact Info</h4>
            <ul>
              <li>📍 {schoolConfig.address}</li>
              <li>📞 {schoolConfig.phone}</li>
              <li>✉️ {schoolConfig.email}</li>
              <li>🌐 {schoolConfig.website}</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="container">
            <p>© {new Date().getFullYear()} {schoolConfig.name}. All Rights Reserved.</p>
            <p>Affiliated to {schoolConfig.board} | Affiliation No: {schoolConfig.affiliationNo}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
