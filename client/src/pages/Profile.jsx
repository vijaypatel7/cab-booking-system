import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Camera,
  Edit3,
  Save,
  X,
  Shield,
  Calendar,
  Car,
  IndianRupee,
  Check,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { authApi } from '../api/authApi';
import { userApi } from '../api/userApi';
import { formatDate } from '../utils/formatDate';
import { formatCurrency } from '../utils/calculateFare';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [stats, setStats] = useState(null);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  // Fetch user stats on mount
  // Prevent overlapping fetches
  const [fetching, setFetching] = useState(false);
  useEffect(() => {
    if (!fetching) {
      setFetching(true);
      const fetchStats = async () => {
        setLoadingStats(true);
        try {
          const res = await userApi.getStats();
          setStats(res.data.data);
        } catch {
          setStats(null);
        } finally {
          setLoadingStats(false);
          setFetching(false);
        }
      };
      fetchStats();
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    setSaving(true);
    try {
      const res = await authApi.updateProfile(form);
      const updatedUser = res.data.data;
      updateUser(updatedUser);
      toast.success('Profile updated successfully ✨');
      setIsEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({ name: user?.name || '', phone: user?.phone || '' });
    setIsEditing(false);
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('avatar', file);

    // Optimistic preview
    const previewUrl = URL.createObjectURL(file);
    updateUser({ avatar: previewUrl });

    try {
      const res = await authApi.updateProfile(formData);
      const updatedUser = res.data.data;
      updateUser(updatedUser);
      toast.success('Avatar updated! 📸');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload avatar');
      // Revert optimistic update
      updateUser({ avatar: user?.avatar });
    } finally {
      setUploading(false);
    }
  };

  const statCards = [
    {
      label: 'Total Rides',
      value: stats?.totalRides ?? 0,
      icon: Car,
      color: '#3b82f6',
      bg: '#dbeafe',
    },
    {
      label: 'Completed',
      value: stats?.completedRides ?? 0,
      icon: Check,
      color: '#22c55e',
      bg: '#dcfce7',
    },
    {
      label: 'Cancelled',
      value: stats?.cancelledRides ?? 0,
      icon: X,
      color: '#f59e0b',
      bg: '#fef3c7',
    },
    {
      label: 'Total Spent',
      value: formatCurrency(stats?.totalSpent ?? 0),
      icon: IndianRupee,
      color: '#a855f7',
      bg: '#ede9fe',
    },
  ];

  return (
    <div className="profile-page">
      {/* Profile Header Card */}
      <motion.div
        className="profile-hero"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="profile-hero-bg" />
        <div className="profile-hero-content">
          <div className="avatar-section">
            <div className="avatar-wrapper">
              {user?.avatar ? (
                <img
                  src={user.avatar.startsWith('blob:') ? user.avatar : user.avatar}
                  alt={user.name}
                  className="avatar-img"
                />
              ) : (
                <div className="avatar-placeholder">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}

              <motion.button
                className="avatar-edit-btn"
                onClick={() => fileInputRef.current?.click()}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                disabled={uploading}
              >
                {uploading ? (
                  <span className="avatar-upload-spinner" />
                ) : (
                  <Camera size={14} />
                )}
              </motion.button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
              />
            </div>

            <div className="profile-hero-info">
              <h1>{user?.name || 'User'}</h1>
              <p className="profile-email">{user?.email}</p>
              <div className="profile-badges">
                <span className="badge badge-role">
                  <Shield size={12} /> {user?.role || 'Rider'}
                </span>
                <span className="badge badge-date">
                  <Calendar size={12} /> Joined {formatDate(user?.createdAt, { year: 'numeric', month: 'short' })}
                </span>
              </div>
            </div>
          </div>

          <motion.button
            className={`btn ${isEditing ? 'btn-danger-outline' : 'btn-primary'}`}
            onClick={() => (isEditing ? handleCancel() : setIsEditing(true))}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {isEditing ? <X size={16} /> : <Edit3 size={16} />}
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="profile-stats-grid">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            className="profile-stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <div
              className="profile-stat-icon"
              style={{ background: card.bg }}
            >
              <card.icon size={20} color={card.color} />
            </div>
            <div className="profile-stat-info">
              <span className="profile-stat-value" style={{ color: card.color }}>
                {loadingStats ? '—' : card.value}
              </span>
              <span className="profile-stat-label">{card.label}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Profile Details */}
      <motion.div
        className="profile-details-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="details-header">
          <h2>Personal Information</h2>
          {isEditing && (
            <motion.button
              className="btn btn-primary btn-sm"
              onClick={handleSave}
              disabled={saving}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {saving ? (
                <span className="btn-loading-sm" />
              ) : (
                <>
                  <Save size={14} /> Save Changes
                </>
              )}
            </motion.button>
          )}
        </div>

        <div className="details-grid">
          <div className="detail-item">
            <label>
              <User size={15} /> Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="detail-input"
                placeholder="Your name"
              />
            ) : (
              <span className="detail-value">{user?.name || '—'}</span>
            )}
          </div>

          <div className="detail-item">
            <label>
              <Mail size={15} /> Email Address
            </label>
            <span className="detail-value detail-muted">{user?.email || '—'}</span>
            <span className="detail-hint">Email cannot be changed</span>
          </div>

          <div className="detail-item">
            <label>
              <Phone size={15} /> Phone Number
            </label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="detail-input"
                placeholder="+91 98765 43210"
              />
            ) : (
              <span className="detail-value">{user?.phone || 'Not provided'}</span>
            )}
          </div>

          <div className="detail-item">
            <label>
              <Shield size={15} /> Account Role
            </label>
            <span className="detail-value">
              <span className="role-badge">{user?.role || 'user'}</span>
            </span>
          </div>

          <div className="detail-item">
            <label>
              <Calendar size={15} /> Member Since
            </label>
            <span className="detail-value">{formatDate(user?.createdAt) || '—'}</span>
          </div>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        className="danger-zone-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2>⚠️ Danger Zone</h2>
        <p>These actions are irreversible. Please be certain.</p>
        <div className="danger-actions">
          <button
            className="btn btn-danger-outline"
            onClick={() => toast('Account deletion is disabled in demo mode', { icon: '🔒' })}
          >
            Delete Account
          </button>
        </div>
      </motion.div>

      <style>{`
        .profile-page {
          padding: 2rem;
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        /* ===== Hero Card ===== */
        .profile-hero {
          position: relative;
          background: white;
          border-radius: 24px;
          border: 1px solid var(--gray-100);
          overflow: hidden;
        }
        .profile-hero-bg {
          height: 100px;
          background: linear-gradient(135deg, var(--primary), #a855f7, #06b6d4);
          position: relative;
        }
        .profile-hero-bg::after {
          content: '';
          position: absolute;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        .profile-hero-content {
          padding: 0 2rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 1rem;
          margin-top: -40px;
          position: relative;
          z-index: 1;
        }
        .avatar-section {
          display: flex;
          align-items: flex-end;
          gap: 1.25rem;
        }
        .avatar-wrapper {
          position: relative;
          flex-shrink: 0;
        }
        .avatar-img {
          width: 88px;
          height: 88px;
          border-radius: 22px;
          object-fit: cover;
          border: 4px solid white;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          background: white;
        }
        .avatar-placeholder {
          width: 88px;
          height: 88px;
          border-radius: 22px;
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 900;
          border: 4px solid white;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        .avatar-edit-btn {
          position: absolute;
          bottom: -4px;
          right: -4px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: white;
          border: 2px solid var(--gray-100);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: all 0.2s;
        }
        .avatar-edit-btn:hover {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }
        .avatar-edit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .avatar-upload-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid var(--gray-200);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        .profile-hero-info h1 {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--gray-900);
          margin-bottom: 0.15rem;
        }
        .profile-email {
          font-size: 0.9rem;
          color: var(--gray-400);
          margin-bottom: 0.6rem;
        }
        .profile-badges {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.25rem 0.7rem;
          border-radius: 20px;
          font-size: 0.72rem;
          font-weight: 600;
        }
        .badge-role {
          background: var(--primary-light);
          color: var(--primary);
        }
        .badge-date {
          background: #f3f4f6;
          color: var(--gray-500);
        }

        /* ===== Stats ===== */
        .profile-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 1rem;
        }
        .profile-stat-card {
          background: white;
          border: 1px solid var(--gray-100);
          border-radius: 16px;
          padding: 1.1rem;
          display: flex;
          align-items: center;
          gap: 0.85rem;
          transition: all 0.2s;
        }
        .profile-stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.06);
        }
        .profile-stat-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .profile-stat-info {
          display: flex;
          flex-direction: column;
        }
        .profile-stat-value {
          font-size: 1.2rem;
          font-weight: 800;
        }
        .profile-stat-label {
          font-size: 0.72rem;
          color: var(--gray-400);
          font-weight: 500;
        }

        /* ===== Details Card ===== */
        .profile-details-card {
          background: white;
          border: 1px solid var(--gray-100);
          border-radius: 20px;
          padding: 1.75rem;
        }
        .details-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .details-header h2 {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--gray-800);
        }
        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }
        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .detail-item label {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--gray-400);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .detail-value {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--gray-800);
        }
        .detail-muted {
          color: var(--gray-400);
        }
        .detail-hint {
          font-size: 0.7rem;
          color: var(--gray-300);
          font-style: italic;
        }
        .detail-input {
          padding: 0.65rem 1rem;
          border: 2px solid var(--gray-200);
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 500;
          outline: none;
          background: var(--gray-50);
          transition: all 0.2s;
          font-family: inherit;
        }
        .detail-input:focus {
          border-color: var(--primary);
          background: white;
          box-shadow: 0 0 0 4px var(--primary-light);
        }
        .role-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.3rem 0.8rem;
          background: var(--primary-light);
          color: var(--primary);
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: capitalize;
        }
        .btn-loading-sm {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
          display: inline-block;
        }

        /* ===== Danger Zone ===== */
        .danger-zone-card {
          background: white;
          border: 2px dashed #fecaca;
          border-radius: 20px;
          padding: 1.75rem;
        }
        .danger-zone-card h2 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #dc2626;
          margin-bottom: 0.4rem;
        }
        .danger-zone-card p {
          font-size: 0.85rem;
          color: var(--gray-400);
          margin-bottom: 1rem;
        }
        .danger-actions {
          display: flex;
          gap: 0.75rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .profile-page { padding: 1.5rem 1rem; }
          .profile-hero-content {
            flex-direction: column;
            align-items: flex-start;
            padding: 0 1.25rem 1.5rem;
          }
          .avatar-section { flex-direction: column; align-items: center; text-align: center; }
          .profile-badges { justify-content: center; }
          .profile-hero-info h1 { text-align: center; }
          .profile-email { text-align: center; }
          .details-grid { grid-template-columns: 1fr; }
          .profile-stats-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  );
};

export default Profile;
