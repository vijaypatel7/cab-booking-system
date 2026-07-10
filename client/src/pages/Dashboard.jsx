import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Clock,
  IndianRupee,
  TrendingUp,
  Navigation,
  Car,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { userApi } from '../api/userApi';
import { rideApi } from '../api/rideApi';
import { useAuth } from '../hooks/useAuth';
import { formatCurrency } from '../utils/calculateFare';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentRides, setRecentRides] = useState([]);
  const [loading, setLoading] = useState(true);

  // Prevent overlapping fetches
  const [fetching, setFetching] = useState(false);
  useEffect(() => {
    if (!fetching) {
      setFetching(true);
      const fetchData = async () => {
        try {
          const [statsRes, ridesRes] = await Promise.all([
            userApi.getStats(),
            rideApi.getRides({ limit: 5 }),
          ]);
          setStats(statsRes.data.data);
          setRecentRides(ridesRes.data.data.rides || []);
        } catch (err) {
          // Show optimistic/placeholder data on error
          setStats({
            totalRides: 0,
            completedRides: 0,
            cancelledRides: 0,
            totalSpent: 0,
          });
          setRecentRides([]);
          if (err.response?.status !== 401) {
            toast.error('Could not load dashboard data');
          }
        } finally {
          setLoading(false);
          setFetching(false);
        }
      };
      fetchData();
    }
  }, []);

  if (loading) {
    return (
      <div className="dashboard-page">
        <Loader size="lg" text="Loading your dashboard..." />
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Rides',
      value: stats?.totalRides || 0,
      icon: Car,
      color: '#3b82f6',
      bg: '#dbeafe',
    },
    {
      label: 'Completed',
      value: stats?.completedRides || 0,
      icon: Navigation,
      color: '#22c55e',
      bg: '#dcfce7',
    },
    {
      label: 'Cancelled',
      value: stats?.cancelledRides || 0,
      icon: Clock,
      color: '#f59e0b',
      bg: '#fef3c7',
    },
    {
      label: 'Total Spent',
      value: formatCurrency(stats?.totalSpent || 0),
      icon: IndianRupee,
      color: '#a855f7',
      bg: '#ede9fe',
    },
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>
            Hey, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p>Here's your ride overview</p>
        </div>
        <Link to="/book" className="btn btn-primary">
          <MapPin size={18} /> Book Ride
        </Link>
      </div>

      <div className="stats-grid">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="stat-card-icon" style={{ background: card.bg }}>
              <card.icon size={22} color={card.color} />
            </div>
            <div className="stat-card-info">
              <span className="stat-card-value" style={{ color: card.color }}>
                {card.value}
              </span>
              <span className="stat-card-label">{card.label}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="dashboard-section">
        <div className="section-header-row">
          <h2>Recent Rides</h2>
          <Link to="/history" className="view-all-link">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {recentRides.length > 0 ? (
          <div className="recent-rides-list">
            {recentRides.map((ride) => (
              <motion.div
                key={ride._id}
                className="recent-ride-item"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="recent-ride-route">
                  <span className="ride-pickup">{ride.pickup?.address}</span>
                  <ArrowRight size={14} className="route-arrow" />
                  <span className="ride-dropoff">{ride.dropoff?.address}</span>
                </div>
                <div className="recent-ride-meta">
                  <span className={`ride-status-badge ${ride.status}`}>
                    {ride.status}
                  </span>
                  <span className="ride-fare">{formatCurrency(ride.fare)}</span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Car size={48} />
            <h3>No rides yet</h3>
            <p>Book your first ride and it will appear here!</p>
            <Link to="/book" className="btn btn-primary">
              <MapPin size={18} /> Book Your First Ride
            </Link>
          </div>
        )}
      </div>

      <style>{`
        .dashboard-page {
          padding: 2rem;
          max-width: 900px;
          margin: 0 auto;
        }
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .dashboard-header h1 {
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--gray-900);
        }
        .dashboard-header p {
          color: var(--gray-400);
          font-size: 0.9rem;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
          gap: 1rem;
          margin-bottom: 2.5rem;
        }
        .stat-card {
          background: white;
          border: 1px solid var(--gray-100);
          border-radius: 16px;
          padding: 1.25rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: all 0.2s;
        }
        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
        }
        .stat-card-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .stat-card-info {
          display: flex;
          flex-direction: column;
        }
        .stat-card-value {
          font-size: 1.4rem;
          font-weight: 800;
        }
        .stat-card-label {
          font-size: 0.8rem;
          color: var(--gray-400);
          font-weight: 500;
        }
        .section-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .section-header-row h2 {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--gray-800);
        }
        .view-all-link {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          color: var(--primary);
          font-weight: 600;
          font-size: 0.85rem;
          text-decoration: none;
        }
        .recent-rides-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .recent-ride-item {
          background: white;
          border: 1px solid var(--gray-100);
          border-radius: 14px;
          padding: 1rem 1.25rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.5rem;
          transition: all 0.2s;
        }
        .recent-ride-item:hover {
          border-color: var(--primary-light);
        }
        .recent-ride-route {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--gray-700);
        }
        .route-arrow { color: var(--gray-300); }
        .recent-ride-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .ride-status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: capitalize;
        }
        .ride-status-badge.completed { background: #ede9fe; color: #7c3aed; }
        .ride-status-badge.pending { background: #fef3c7; color: #d97706; }
        .ride-status-badge.cancelled { background: #fee2e2; color: #dc2626; }
        .ride-status-badge.ongoing { background: #d1fae5; color: #059669; }
        .ride-fare {
          font-weight: 700;
          color: var(--gray-800);
          font-size: 0.9rem;
        }
        .empty-state {
          text-align: center;
          padding: 3rem 2rem;
          background: white;
          border-radius: 20px;
          border: 2px dashed var(--gray-200);
          color: var(--gray-400);
        }
        .empty-state h3 {
          color: var(--gray-700);
          margin-top: 1rem;
          font-weight: 700;
        }
        .empty-state p {
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .dashboard-page { padding: 1.5rem 1rem; }
          .recent-ride-route { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
