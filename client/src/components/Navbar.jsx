import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car,
  Menu,
  X,
  LogOut,
  User,
  LayoutDashboard,
  Clock,
  MapPin,
  Settings,
  HelpCircle,
  ChevronDown,
  Shield,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    setMobileOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = user
    ? [
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/book', label: 'Book Ride', icon: MapPin },
        { to: '/history', label: 'History', icon: Clock },
        ...(user.role === 'admin' ? [{ to: '/admin', label: 'Admin', icon: Shield }] : []),
      ]
    : [
        { to: '/login', label: 'Login', icon: User },
        { to: '/register', label: 'Sign Up', icon: Car },
      ];

  const accountLinks = [
    { to: '/profile', label: 'Profile', icon: User },
    { to: '/settings', label: 'Settings', icon: Settings },
    { to: '/help', label: 'Help & Support', icon: HelpCircle },
    ...(user?.role === 'admin' ? [{ to: '/admin', label: 'Admin Panel', icon: Shield }] : []),
  ];

  const closeMobile = () => setMobileOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <motion.div
            className="brand-icon"
            whileHover={{ rotate: 10, scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            🚕
          </motion.div>
          <span className="brand-text">RideNow</span>
        </Link>

        {/* Desktop Nav */}
        <div className="navbar-links">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link ${isActive(link.to) ? 'active' : ''}`}
            >
              <link.icon size={18} />
              <span>{link.label}</span>
            </Link>
          ))}

          {user && (
            <div className="navbar-user-wrapper">
              <button
                className={`navbar-user ${profileOpen ? 'open' : ''}`}
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <div className="user-avatar">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="user-name">{user.name?.split(' ')[0]}</span>
                <ChevronDown
                  size={16}
                  className={`user-chevron ${profileOpen ? 'rotated' : ''}`}
                />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    className="profile-dropdown"
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="dropdown-header">
                      <div className="dropdown-avatar">
                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div className="dropdown-user-info">
                        <span className="dropdown-name">{user.name}</span>
                        <span className="dropdown-email">{user.email}</span>
                      </div>
                    </div>

                    <div className="dropdown-divider" />

                    {accountLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className={`dropdown-item ${isActive(link.to) ? 'active' : ''}`}
                        onClick={() => setProfileOpen(false)}
                      >
                        <link.icon size={16} />
                        <span>{link.label}</span>
                      </Link>
                    ))}

                    <div className="dropdown-divider" />

                    <button className="dropdown-item logout" onClick={handleLogout}>
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`mobile-link ${isActive(link.to) ? 'active' : ''}`}
                onClick={closeMobile}
              >
                <link.icon size={18} />
                <span>{link.label}</span>
              </Link>
            ))}

            {/* Account section in mobile */}
            {user && (
              <>
                <div className="mobile-divider" />
                <span className="mobile-section-label">ACCOUNT</span>
                {accountLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`mobile-link ${isActive(link.to) ? 'active' : ''}`}
                    onClick={closeMobile}
                  >
                    <link.icon size={18} />
                    <span>{link.label}</span>
                  </Link>
                ))}
                <div className="mobile-divider" />
                <button className="mobile-link logout" onClick={handleLogout}>
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close dropdown */}
      {profileOpen && (
        <div
          className="dropdown-overlay"
          onClick={() => setProfileOpen(false)}
        />
      )}

      <style>{`
        .navbar {
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
          position: sticky;
          top: 0;
          z-index: 100;
          transition: background 0.3s, border-color 0.3s;
        }
        .navbar-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 70px;
        }
        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
        }
        .brand-icon {
          font-size: 1.8rem;
        }
        .brand-text {
          font-size: 1.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .navbar-links {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.5rem 1rem;
          border-radius: 12px;
          text-decoration: none;
          color: var(--text-secondary);
          font-weight: 500;
          font-size: 0.9rem;
          transition: all 0.2s;
        }
        .nav-link:hover {
          background: var(--surface-muted);
          color: var(--primary);
        }
        .nav-link.active {
          background: var(--primary-light);
          color: var(--primary);
        }

        /* User dropdown */
        .navbar-user-wrapper {
          position: relative;
          margin-left: 1rem;
          padding-left: 1rem;
          border-left: 1px solid var(--border);
        }
        .navbar-user {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.4rem 0.6rem;
          border-radius: 12px;
          transition: all 0.2s;
        }
        .navbar-user:hover,
        .navbar-user.open {
          background: var(--surface-muted);
        }
        .user-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.85rem;
        }
        .user-name {
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        .user-chevron {
          color: var(--gray-400);
          transition: transform 0.2s;
        }
        .user-chevron.rotated {
          transform: rotate(180deg);
        }

        /* Dropdown panel */
        .profile-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 240px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.12);
          padding: 0.5rem;
          z-index: 200;
          overflow: hidden;
        }
        .dropdown-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
        }
        .dropdown-avatar {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1rem;
          flex-shrink: 0;
        }
        .dropdown-user-info {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .dropdown-name {
          font-weight: 700;
          font-size: 0.88rem;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .dropdown-email {
          font-size: 0.72rem;
          color: var(--text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .dropdown-divider {
          height: 1px;
          background: var(--border);
          margin: 0.25rem 0.5rem;
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.65rem 0.75rem;
          border-radius: 10px;
          text-decoration: none;
          color: var(--text-secondary);
          font-weight: 500;
          font-size: 0.85rem;
          transition: all 0.15s;
          background: none;
          border: none;
          cursor: pointer;
          width: 100%;
          text-align: left;
        }
        .dropdown-item:hover {
          background: var(--surface-muted);
          color: var(--primary);
        }
        .dropdown-item.active {
          background: var(--primary-light);
          color: var(--primary);
          font-weight: 600;
        }
        .dropdown-item.logout {
          color: #ef4444;
        }
        .dropdown-item.logout:hover {
          background: #fee2e2;
          color: #dc2626;
        }

        /* Overlay to close dropdown on outside click */
        .dropdown-overlay {
          position: fixed;
          inset: 0;
          z-index: 150;
        }

        /* Mobile */
        .mobile-toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-primary);
          padding: 0.5rem;
        }
        .mobile-menu {
          overflow: hidden;
          padding: 0.5rem 1.5rem 1rem;
          border-top: 1px solid var(--border);
        }
        .mobile-link {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          text-decoration: none;
          color: var(--text-secondary);
          font-weight: 500;
          font-size: 0.95rem;
          transition: all 0.2s;
          background: none;
          border: none;
          cursor: pointer;
          width: 100%;
          text-align: left;
        }
        .mobile-link:hover, .mobile-link.active {
          background: var(--primary-light);
          color: var(--primary);
        }
        .mobile-link.logout {
          color: #ef4444;
          margin-top: 0.25rem;
        }
        .mobile-divider {
          height: 1px;
          background: var(--border);
          margin: 0.5rem 0;
        }
        .mobile-section-label {
          display: block;
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 0.1em;
          padding: 0.5rem 1rem 0.25rem;
          text-transform: uppercase;
        }

        @media (max-width: 768px) {
          .navbar-links { display: none; }
          .mobile-toggle { display: flex; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
