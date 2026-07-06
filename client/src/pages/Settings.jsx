import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Moon,
  Globe,
  Shield,
  Smartphone,
  ChevronRight,
  MapPin,
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import toast from 'react-hot-toast';

const settingsSections = [
  {
    title: 'Notifications',
    icon: Bell,
    settings: [
      {
        id: 'push_notif',
        label: 'Push Notifications',
        desc: 'Get notified about ride updates',
        type: 'toggle',
        default: true,
      },
      {
        id: 'email_notif',
        label: 'Email Notifications',
        desc: 'Receive ride receipts via email',
        type: 'toggle',
        default: true,
      },
      {
        id: 'sms_notif',
        label: 'SMS Notifications',
        desc: 'Get ride status via SMS',
        type: 'toggle',
        default: false,
      },
      {
        id: 'promo_notif',
        label: 'Promotional Offers',
        desc: 'Receive discounts and offers',
        type: 'toggle',
        default: false,
      },
    ],
  },
  {
    title: 'App Preferences',
    icon: Smartphone,
    settings: [
      {
        id: 'dark_mode',
        label: 'Dark Mode',
        desc: 'Switch to dark theme',
        type: 'theme-toggle',
      },
      {
        id: 'sound',
        label: 'Sound Effects',
        desc: 'Play sounds for ride events',
        type: 'toggle',
        default: true,
      },
      {
        id: 'language',
        label: 'Language',
        desc: 'English (India)',
        type: 'link',
        value: 'English',
      },
      {
        id: 'distance_unit',
        label: 'Distance Unit',
        desc: 'Kilometers / Miles',
        type: 'link',
        value: 'Kilometers',
      },
    ],
  },
  {
    title: 'Privacy & Security',
    icon: Shield,
    settings: [
      {
        id: 'location',
        label: 'Location Access',
        desc: 'Allow app to access your location',
        type: 'toggle',
        default: true,
      },
      {
        id: 'ride_history',
        label: 'Save Ride History',
        desc: 'Keep a record of your rides',
        type: 'toggle',
        default: true,
      },
      {
        id: 'visibility',
        label: 'Profile Visibility',
        desc: 'Who can see your profile',
        type: 'link',
        value: 'Only me',
      },
    ],
  },
  {
    title: 'Maps',
    icon: MapPin,
    settings: [
      {
        id: 'satellite_view',
        label: 'Satellite View',
        desc: 'Use satellite maps instead of default',
        type: 'toggle',
        default: false,
      },
      {
        id: 'traffic',
        label: 'Show Traffic',
        desc: 'Display traffic conditions on map',
        type: 'toggle',
        default: true,
      },
    ],
  },
];

const Settings = () => {
  const { dark, toggleTheme } = useTheme();

  const [toggleStates, setToggleStates] = useState(() => {
    const initial = {};
    settingsSections.forEach((section) => {
      section.settings.forEach((s) => {
        if (s.type === 'toggle') initial[s.id] = s.default;
      });
    });
    return initial;
  });

  const handleToggle = (id) => {
    const newValue = !toggleStates[id];
    toast.success(`${id.replace(/_/g, ' ')} ${newValue ? 'enabled' : 'disabled'}`, {
      icon: newValue ? '✅' : '❌',
    });
    setToggleStates((prev) => ({ ...prev, [id]: newValue }));
  };

  const handleDarkModeToggle = () => {
    const newValue = !dark;
    toast.success(`Dark mode ${newValue ? 'enabled' : 'disabled'}`, {
      icon: newValue ? '🌙' : '☀️',
    });
    toggleTheme();
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>⚙️ Settings</h1>
        <p>Customize your RideNow experience</p>
      </div>

      <div className="settings-sections">
        {settingsSections.map((section, si) => (
          <motion.div
            key={section.title}
            className="settings-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: si * 0.08 }}
          >
            <div className="section-title-row">
              <section.icon size={18} />
              <h2>{section.title}</h2>
            </div>

            <div className="settings-items">
              {section.settings.map((setting) => {
                // Dark mode — special toggle driven by ThemeContext
                if (setting.type === 'theme-toggle') {
                  return (
                    <div key={setting.id} className="setting-item">
                      <div className="setting-info">
                        <span className="setting-label">
                          <Moon size={14} style={{ marginRight: 6, verticalAlign: -2 }} />
                          {setting.label}
                        </span>
                        <span className="setting-desc">{setting.desc}</span>
                      </div>
                      <motion.button
                        className={`toggle-btn ${dark ? 'on' : 'off'}`}
                        onClick={handleDarkModeToggle}
                        whileTap={{ scale: 0.9 }}
                      >
                        <div className="toggle-track">
                          <motion.div
                            className="toggle-thumb"
                            layout
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        </div>
                      </motion.button>
                    </div>
                  );
                }

                // Regular toggles
                if (setting.type === 'toggle') {
                  return (
                    <div key={setting.id} className="setting-item">
                      <div className="setting-info">
                        <span className="setting-label">{setting.label}</span>
                        <span className="setting-desc">{setting.desc}</span>
                      </div>
                      <motion.button
                        className={`toggle-btn ${toggleStates[setting.id] ? 'on' : 'off'}`}
                        onClick={() => handleToggle(setting.id)}
                        whileTap={{ scale: 0.9 }}
                      >
                        <div className="toggle-track">
                          <motion.div
                            className="toggle-thumb"
                            layout
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        </div>
                      </motion.button>
                    </div>
                  );
                }

                // Link-type settings
                return (
                  <div key={setting.id} className="setting-item">
                    <div className="setting-info">
                      <span className="setting-label">{setting.label}</span>
                      <span className="setting-desc">{setting.desc}</span>
                    </div>
                    <button
                      className="setting-link-btn"
                      onClick={() => toast('Coming soon!', { icon: '🔧' })}
                    >
                      <span>{setting.value}</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="settings-footer">
        <p>RideNow v1.0.0 • Made with ❤️</p>
      </div>

      <style>{`
        .settings-page {
          padding: 2rem;
          max-width: 700px;
          margin: 0 auto;
        }
        .settings-header {
          margin-bottom: 2rem;
        }
        .settings-header h1 {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--text-primary);
        }
        .settings-header p {
          color: var(--text-muted);
          font-size: 0.9rem;
          margin-top: 0.2rem;
        }
        .settings-sections {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .settings-section {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 20px;
          overflow: hidden;
          transition: background 0.3s, border-color 0.3s;
        }
        .section-title-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          background: var(--surface-muted);
          border-bottom: 1px solid var(--border);
          color: var(--text-secondary);
          transition: background 0.3s, border-color 0.3s;
        }
        .section-title-row h2 {
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .settings-items {
          display: flex;
          flex-direction: column;
        }
        .setting-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--border);
          gap: 1rem;
          transition: border-color 0.3s;
        }
        .setting-item:last-child {
          border-bottom: none;
        }
        .setting-info {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          min-width: 0;
        }
        .setting-label {
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .setting-desc {
          font-size: 0.78rem;
          color: var(--text-muted);
        }
        .toggle-btn {
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          flex-shrink: 0;
        }
        .toggle-track {
          width: 48px;
          height: 26px;
          border-radius: 13px;
          background: var(--toggle-off);
          position: relative;
          transition: background 0.3s;
        }
        .toggle-btn.on .toggle-track {
          background: var(--primary);
        }
        .toggle-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 1px 4px rgba(0,0,0,0.15);
          position: absolute;
          top: 2px;
          left: 2px;
        }
        .toggle-btn.on .toggle-thumb {
          left: 24px;
        }
        .setting-link-btn {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-muted);
          font-size: 0.85rem;
          font-weight: 500;
          padding: 0.4rem 0.6rem;
          border-radius: 8px;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .setting-link-btn:hover {
          background: var(--surface-muted);
          color: var(--text-secondary);
        }
        .settings-footer {
          text-align: center;
          padding: 2rem 0;
          color: var(--text-muted);
          font-size: 0.8rem;
        }

        @media (max-width: 768px) {
          .settings-page { padding: 1.5rem 1rem; }
          .setting-item { padding: 0.85rem 1.15rem; }
        }
      `}</style>
    </div>
  );
};

export default Settings;
