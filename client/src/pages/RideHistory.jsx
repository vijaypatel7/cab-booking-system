import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Filter, Star, X, Search } from 'lucide-react';
import { rideApi } from '../api/rideApi';
import RideCard from '../components/RideCard';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const statusFilters = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const RideHistory = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('');
  const [ratingRide, setRatingRide] = useState(null);
  const [rating, setRating] = useState(0);

  const fetchRides = useCallback(async (status = '') => {
    setLoading(true);
    try {
      const params = {};
      if (status) params.status = status;
      const res = await rideApi.getRides(params);
      setRides(res.data.data.rides || []);
    } catch (err) {
      // Optimistic: show empty state on error
      setRides([]);
      if (err.response?.status !== 401) {
        toast.error('Could not load rides');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRides(activeFilter);
  }, [activeFilter, fetchRides]);

  const handleCancel = async (rideId) => {
    // Optimistic update
    setRides((prev) =>
      prev.map((r) =>
        r._id === rideId ? { ...r, status: 'cancelled' } : r
      )
    );
    toast.success('Ride cancelled');

    try {
      await rideApi.cancelRide(rideId, { reason: 'Cancelled by user' });
    } catch (err) {
      // Revert on error
      toast.error('Failed to cancel ride');
      fetchRides(activeFilter);
    }
  };

  const handleRate = (rideId) => {
    setRatingRide(rideId);
    setRating(0);
  };

  const submitRating = async () => {
    if (!rating) return;

    // Optimistic update
    setRides((prev) =>
      prev.map((r) => (r._id === ratingRide ? { ...r, rating } : r))
    );
    setRatingRide(null);
    toast.success('Rating submitted! ⭐');

    try {
      await rideApi.rateRide(ratingRide, { rating });
    } catch (err) {
      toast.error('Failed to submit rating');
      fetchRides(activeFilter);
    }
  };

  return (
    <div className="history-page">
      <div className="history-header">
        <div>
          <h1>Ride History</h1>
          <p>{rides.length} ride{rides.length !== 1 ? 's' : ''} found</p>
        </div>
      </div>

      <div className="filter-bar">
        <Filter size={18} className="filter-icon" />
        {statusFilters.map((f) => (
          <button
            key={f.value}
            className={`filter-chip ${activeFilter === f.value ? 'active' : ''}`}
            onClick={() => setActiveFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader text="Loading your rides..." />
      ) : rides.length > 0 ? (
        <div className="rides-grid">
          <AnimatePresence>
            {rides.map((ride) => (
              <RideCard
                key={ride._id}
                ride={ride}
                onCancel={handleCancel}
                onRate={handleRate}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="empty-state">
          <Clock size={56} />
          <h3>No rides found</h3>
          <p>
            {activeFilter
              ? `No ${activeFilter} rides yet. Try a different filter.`
              : "You haven't taken any rides yet. Book one now!"}
          </p>
        </div>
      )}

      {/* Rating Modal */}
      <AnimatePresence>
        {ratingRide && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setRatingRide(null)}
          >
            <motion.div
              className="rating-modal"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="modal-close"
                onClick={() => setRatingRide(null)}
              >
                <X size={20} />
              </button>
              <h2>Rate Your Ride</h2>
              <p>How was your experience?</p>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    className={`star-btn ${rating >= star ? 'filled' : ''}`}
                    onClick={() => setRating(star)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Star
                      size={36}
                      fill={rating >= star ? '#f59e0b' : 'none'}
                      stroke={rating >= star ? '#f59e0b' : '#d1d5db'}
                    />
                  </motion.button>
                ))}
              </div>
              <button
                className="btn btn-primary btn-full"
                onClick={submitRating}
                disabled={!rating}
              >
                Submit Rating
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .history-page {
          padding: 2rem;
          max-width: 900px;
          margin: 0 auto;
        }
        .history-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .history-header h1 {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--gray-900);
        }
        .history-header p {
          color: var(--gray-400);
          font-size: 0.85rem;
        }
        .filter-bar {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }
        .filter-icon { color: var(--gray-400); }
        .filter-chip {
          padding: 0.4rem 1rem;
          border-radius: 20px;
          border: 1px solid var(--gray-200);
          background: white;
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--gray-500);
          cursor: pointer;
          transition: all 0.2s;
        }
        .filter-chip:hover {
          border-color: var(--primary);
          color: var(--primary);
        }
        .filter-chip.active {
          background: var(--primary);
          border-color: var(--primary);
          color: white;
        }
        .rides-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1rem;
        }
        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: var(--gray-400);
        }
        .empty-state h3 {
          color: var(--gray-700);
          margin-top: 1rem;
          font-weight: 700;
        }
        .empty-state p {
          margin-top: 0.5rem;
          font-size: 0.9rem;
        }
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 200;
          padding: 1rem;
        }
        .rating-modal {
          background: white;
          border-radius: 24px;
          padding: 2.5rem;
          text-align: center;
          max-width: 380px;
          width: 100%;
          position: relative;
        }
        .rating-modal h2 {
          font-size: 1.3rem;
          font-weight: 800;
          color: var(--gray-900);
        }
        .rating-modal p {
          color: var(--gray-400);
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
        }
        .modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--gray-400);
          padding: 0.3rem;
          border-radius: 8px;
        }
        .modal-close:hover { color: var(--gray-700); }
        .star-rating {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 2rem;
        }
        .star-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.3rem;
          transition: all 0.2s;
        }

        @media (max-width: 768px) {
          .history-page { padding: 1.5rem 1rem; }
          .rides-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default RideHistory;
