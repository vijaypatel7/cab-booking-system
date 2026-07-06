import { motion } from 'framer-motion';
import { MapPin, Navigation, Clock, IndianRupee, Star, X } from 'lucide-react';
import { formatDate, formatTime } from '../utils/formatDate';
import { formatCurrency } from '../utils/calculateFare';

const statusColors = {
  pending: { bg: '#fef3c7', color: '#d97706', label: '⏳ Pending' },
  accepted: { bg: '#dbeafe', color: '#2563eb', label: '✅ Accepted' },
  ongoing: { bg: '#d1fae5', color: '#059669', label: '🚗 Ongoing' },
  completed: { bg: '#ede9fe', color: '#7c3aed', label: '🎉 Completed' },
  cancelled: { bg: '#fee2e2', color: '#dc2626', label: '❌ Cancelled' },
};

const rideTypeIcons = {
  economy: '🚗',
  comfort: '🚙',
  premium: '🏎️',
};

const RideCard = ({ ride, onCancel, onRate, showActions = true }) => {
  const status = statusColors[ride.status] || statusColors.pending;

  return (
    <motion.div
      className="ride-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
      transition={{ duration: 0.3 }}
    >
      <div className="ride-card-header">
        <div className="ride-type-badge">
          {rideTypeIcons[ride.rideType]} {ride.rideType}
        </div>
        <span className="ride-status" style={{ background: status.bg, color: status.color }}>
          {status.label}
        </span>
      </div>

      <div className="ride-card-route">
        <div className="route-point pickup">
          <div className="route-dot green" />
          <div>
            <span className="route-label">Pickup</span>
            <span className="route-address">{ride.pickup?.address}</span>
          </div>
        </div>
        <div className="route-line" />
        <div className="route-point dropoff">
          <div className="route-dot red" />
          <div>
            <span className="route-label">Drop-off</span>
            <span className="route-address">{ride.dropoff?.address}</span>
          </div>
        </div>
      </div>

      <div className="ride-card-meta">
        <div className="meta-item">
          <IndianRupee size={14} />
          <span>{formatCurrency(ride.fare)}</span>
        </div>
        {ride.distance && (
          <div className="meta-item">
            <Navigation size={14} />
            <span>{ride.distance} km</span>
          </div>
        )}
        {ride.duration && (
          <div className="meta-item">
            <Clock size={14} />
            <span>{ride.duration} min</span>
          </div>
        )}
        <div className="meta-item">
          <MapPin size={14} />
          <span>{formatDate(ride.createdAt)}</span>
        </div>
      </div>

      {ride.rating && (
        <div className="ride-card-rating">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={16}
              fill={i < ride.rating ? '#f59e0b' : 'none'}
              stroke={i < ride.rating ? '#f59e0b' : '#d1d5db'}
            />
          ))}
        </div>
      )}

      {showActions && (
        <div className="ride-card-actions">
          {(ride.status === 'pending' || ride.status === 'accepted') && onCancel && (
            <motion.button
              className="btn btn-sm btn-danger-outline"
              onClick={() => onCancel(ride._id)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <X size={14} /> Cancel
            </motion.button>
          )}
          {ride.status === 'completed' && !ride.rating && onRate && (
            <motion.button
              className="btn btn-sm btn-primary"
              onClick={() => onRate(ride._id)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Star size={14} /> Rate
            </motion.button>
          )}
        </div>
      )}

      <style>{`
        .ride-card {
          background: white;
          border-radius: 16px;
          padding: 1.25rem;
          border: 1px solid var(--gray-100);
          transition: all 0.3s;
        }
        .ride-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .ride-type-badge {
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--gray-700);
        }
        .ride-status {
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.78rem;
          font-weight: 600;
        }
        .ride-card-route {
          margin-bottom: 1rem;
        }
        .route-point {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          padding: 0.25rem 0;
        }
        .route-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          margin-top: 4px;
          flex-shrink: 0;
        }
        .route-dot.green { background: #22c55e; }
        .route-dot.red { background: #ef4444; }
        .route-line {
          width: 2px;
          height: 20px;
          background: var(--gray-200);
          margin-left: 5px;
        }
        .route-label {
          display: block;
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--gray-400);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .route-address {
          display: block;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--gray-800);
        }
        .ride-card-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid var(--gray-100);
        }
        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.8rem;
          color: var(--gray-500);
          font-weight: 500;
        }
        .ride-card-rating {
          display: flex;
          gap: 0.15rem;
          padding-top: 0.75rem;
        }
        .ride-card-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid var(--gray-100);
        }
      `}</style>
    </motion.div>
  );
};

export default RideCard;
