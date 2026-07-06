import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  MapPin,
  Clock,
  User,
  Settings,
  HelpCircle,
  Car,
  Shield,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/book', label: 'Book a Ride', icon: MapPin },
    { to: '/history', label: 'Ride History', icon: Clock },
    ...(user?.role === 'admin' ? [{ to: '/admin', label: 'Admin Panel', icon: Shield }] : []),
  ];

  const bottomItems = [
    { to: '/profile', label: 'Profile', icon: User },
    { to: '/settings', label: 'Settings', icon: Settings },
    { to: '/help', label: 'Help', icon: HelpCircle },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-user">
        <div className="sidebar-avatar">
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div className="sidebar-user-info">
          <span className="sidebar-name">{user?.name || 'Guest'}</span>
          <span className="sidebar-role">
            <Car size={12} /> {user?.role || 'Rider'}
          </span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section">
          <span className="sidebar-section-title">MENU</span>
          {menuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`sidebar-link ${isActive(item.to) ? 'active' : ''}`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
              {isActive(item.to) && (
                <motion.div
                  className="sidebar-active-indicator"
                  layoutId="sidebar-active"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
            </Link>
          ))}
        </div>

        <div className="sidebar-section sidebar-bottom">
          <span className="sidebar-section-title">SUPPORT</span>
          {bottomItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className={`sidebar-link ${isActive(item.to) ? 'active' : ''}`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      <style>{`
        .sidebar {
          width: 260px;
          min-height: calc(100vh - 70px);
          background: var(--surface);
          border-right: 1px solid var(--border);
          padding: 1.5rem 1rem;
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 70px;
          height: calc(100vh - 70px);
          transition: background 0.3s, border-color 0.3s;
        }
        .sidebar-user {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: linear-gradient(135deg, var(--primary-light), var(--surface));
          border-radius: 16px;
          margin-bottom: 1.5rem;
        }
        .sidebar-avatar {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.1rem;
        }
        .sidebar-user-info {
          display: flex;
          flex-direction: column;
        }
        .sidebar-name {
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--text-primary);
        }
        .sidebar-role {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 500;
        }
        .sidebar-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .sidebar-section {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .sidebar-section-title {
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 0.1em;
          padding: 0 1rem;
          margin-bottom: 0.5rem;
        }
        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.7rem 1rem;
          border-radius: 12px;
          text-decoration: none;
          color: var(--text-muted);
          font-weight: 500;
          font-size: 0.9rem;
          position: relative;
          transition: all 0.2s;
        }
        .sidebar-link:hover {
          background: var(--surface-muted);
          color: var(--text-primary);
        }
        .sidebar-link.active {
          color: var(--primary);
          background: var(--primary-light);
          font-weight: 600;
        }
        .sidebar-active-indicator {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 24px;
          background: var(--primary);
          border-radius: 0 4px 4px 0;
        }
        .sidebar-bottom {
          margin-top: auto;
          padding-top: 1rem;
          border-top: 1px solid var(--border);
        }

        @media (max-width: 1024px) {
          .sidebar { display: none; }
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
