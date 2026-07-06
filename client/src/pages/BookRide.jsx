import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Navigation,
  Clock,
  IndianRupee,
  CreditCard,
  Wallet,
  Banknote,
  ArrowRight,
  Check,
  Car,
} from 'lucide-react';
import { rideApi } from '../api/rideApi';
import { calculateFare, formatCurrency } from '../utils/calculateFare';
import toast from 'react-hot-toast';

const PRESET_LOCATIONS = [
  'Morbi Bus Stand',
  'Morbi Railway Station',
  'Rajkot Airport',
  'Rajkot Junction',
  'Wankaner',
  'Tankara',
  'Maliya',
  'Halvad',
  'Dhoraji',
  'Jetpur',
];

const rideTypes = [
  { id: 'economy', label: 'Economy', icon: '🚗', desc: 'Affordable rides' },
  { id: 'comfort', label: 'Comfort', icon: '🚙', desc: 'Extra comfort' },
  { id: 'premium', label: 'Premium', icon: '🏎️', desc: 'Luxury experience' },
];

const paymentMethods = [
  { id: 'cash', label: 'Cash', icon: Banknote },
  { id: 'card', label: 'Card', icon: CreditCard },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
];

const BookRide = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    pickup: '',
    dropoff: '',
    rideType: 'economy',
    paymentMethod: 'cash',
  });

  // Simulated distance/duration based on input
  const distance = 12; // km
  const duration = 25; // minutes
  const fareData = calculateFare(distance, duration, form.rideType);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleBookRide = async () => {
    if (!form.pickup || !form.dropoff) {
      toast.error('Please enter pickup and drop-off locations');
      return;
    }
    if (form.pickup === form.dropoff) {
      toast.error('Pickup and drop-off cannot be the same');
      return;
    }

    setLoading(true);

    // Optimistic: show success immediately
    const optimisticRide = {
      _id: 'temp_' + Date.now(),
      pickup: { address: form.pickup },
      dropoff: { address: form.dropoff },
      rideType: form.rideType,
      fare: fareData.totalFare,
      distance,
      duration,
      paymentMethod: form.paymentMethod,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    toast.success('🎉 Ride booked! Finding a driver...');

    try {
      const res = await rideApi.bookRide({
        pickup: { address: form.pickup },
        dropoff: { address: form.dropoff },
        rideType: form.rideType,
        paymentMethod: form.paymentMethod,
        fare: fareData.totalFare,
        distance,
        duration,
      });

      const ride = res.data.data;
      if (ride.status === 'accepted') {
        toast.success('🚗 Driver found! Your ride is on the way!');
      }
      navigate('/history');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to book ride');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-page">
      <div className="book-header">
        <h1>Book a Ride</h1>
        <p>Enter your details and we'll find the best ride for you</p>
      </div>

      {/* Step indicator */}
      <div className="steps-indicator">
        {[1, 2, 3].map((s) => (
          <div key={s} className="step-item">
            <div className={`step-dot ${step >= s ? 'active' : ''} ${step > s ? 'done' : ''}`}>
              {step > s ? <Check size={14} /> : s}
            </div>
            <span className="step-label">
              {s === 1 ? 'Route' : s === 2 ? 'Ride Type' : 'Confirm'}
            </span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Route */}
        {step === 1 && (
          <motion.div
            key="step1"
            className="book-card"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <h2>📍 Where are you going?</h2>

            <div className="location-inputs">
              <div className="location-field">
                <div className="location-dot green" />
                <div className="location-input-wrap">
                  <label>Pickup Location</label>
                  <select
                    value={form.pickup}
                    onChange={(e) => handleChange('pickup', e.target.value)}
                    className="location-select"
                  >
                    <option value="">Select pickup point</option>
                    {PRESET_LOCATIONS.filter((loc) => loc !== form.dropoff).map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="location-connector" />
              <div className="location-field">
                <div className="location-dot red" />
                <div className="location-input-wrap">
                  <label>Drop-off Location</label>
                  <select
                    value={form.dropoff}
                    onChange={(e) => handleChange('dropoff', e.target.value)}
                    className="location-select"
                  >
                    <option value="">Select drop-off point</option>
                    {PRESET_LOCATIONS.filter((loc) => loc !== form.pickup).map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="quick-locations">
              <span className="quick-label">Quick Select:</span>
              {PRESET_LOCATIONS.slice(0, 5).map((loc) => (
                <button
                  key={loc}
                  className={`quick-chip ${form.pickup === loc || form.dropoff === loc ? 'selected' : ''}`}
                  onClick={() =>
                    !form.pickup
                      ? handleChange('pickup', loc)
                      : !form.dropoff
                        ? handleChange('dropoff', loc)
                        : handleChange('dropoff', loc)
                  }
                >
                  <MapPin size={12} /> {loc}
                </button>
              ))}
            </div>

            <button
              className="btn btn-primary btn-full btn-lg"
              onClick={() => {
                if (!form.pickup || !form.dropoff) {
                  toast.error('Please enter both locations');
                  return;
                }
                setStep(2);
              }}
            >
              Continue <ArrowRight size={18} />
            </button>
          </motion.div>
        )}

        {/* Step 2: Ride Type */}
        {step === 2 && (
          <motion.div
            key="step2"
            className="book-card"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <h2>🚗 Choose Your Ride</h2>

            <div className="ride-type-cards">
              {rideTypes.map((type) => {
                const fare = calculateFare(distance, duration, type.id);
                return (
                  <motion.div
                    key={type.id}
                    className={`ride-type-card ${form.rideType === type.id ? 'selected' : ''}`}
                    onClick={() => handleChange('rideType', type.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="ride-type-emoji">{type.icon}</span>
                    <div className="ride-type-info">
                      <span className="ride-type-name">{type.label}</span>
                      <span className="ride-type-desc">{type.desc}</span>
                    </div>
                    <div className="ride-type-fare">
                      <span className="fare-amount">{formatCurrency(fare.totalFare)}</span>
                      <span className="fare-estimate">~{duration} min</span>
                    </div>
                    {form.rideType === type.id && (
                      <div className="ride-type-check">
                        <Check size={18} />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            <div className="fare-breakdown">
              <h3>Fare Breakdown</h3>
              <div className="fare-row">
                <span>Base Fare</span>
                <span>{formatCurrency(fareData.baseFare)}</span>
              </div>
              <div className="fare-row">
                <span>Distance ({distance} km)</span>
                <span>{formatCurrency(fareData.distanceFare)}</span>
              </div>
              <div className="fare-row">
                <span>Time ({duration} min)</span>
                <span>{formatCurrency(fareData.timeFare)}</span>
              </div>
              <div className="fare-row total">
                <span>Total</span>
                <span>{formatCurrency(fareData.totalFare)}</span>
              </div>
            </div>

            <div className="step-actions">
              <button className="btn btn-outline" onClick={() => setStep(1)}>
                Back
              </button>
              <button className="btn btn-primary" onClick={() => setStep(3)}>
                Continue <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && (
          <motion.div
            key="step3"
            className="book-card"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <h2>✅ Confirm Your Ride</h2>

            <div className="confirm-summary">
              <div className="confirm-route">
                <div className="confirm-point">
                  <div className="confirm-dot green" />
                  <div>
                    <span className="confirm-label">Pickup</span>
                    <span className="confirm-value">{form.pickup}</span>
                  </div>
                </div>
                <div className="confirm-line" />
                <div className="confirm-point">
                  <div className="confirm-dot red" />
                  <div>
                    <span className="confirm-label">Drop-off</span>
                    <span className="confirm-value">{form.dropoff}</span>
                  </div>
                </div>
              </div>

              <div className="confirm-details">
                <div className="confirm-row">
                  <Car size={16} /> <span>Ride Type: <strong>{form.rideType}</strong></span>
                </div>
                <div className="confirm-row">
                  <Navigation size={16} /> <span>Distance: <strong>{distance} km</strong></span>
                </div>
                <div className="confirm-row">
                  <Clock size={16} /> <span>Est. Time: <strong>{duration} min</strong></span>
                </div>
                <div className="confirm-row total-fare">
                  <IndianRupee size={16} /> <span>Total: <strong>{formatCurrency(fareData.totalFare)}</strong></span>
                </div>
              </div>
            </div>

            <div className="payment-section">
              <h3>Payment Method</h3>
              <div className="payment-options">
                {paymentMethods.map((pm) => (
                  <button
                    key={pm.id}
                    className={`payment-opt ${form.paymentMethod === pm.id ? 'selected' : ''}`}
                    onClick={() => handleChange('paymentMethod', pm.id)}
                  >
                    <pm.icon size={18} />
                    <span>{pm.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="step-actions">
              <button className="btn btn-outline" onClick={() => setStep(2)}>
                Back
              </button>
              <motion.button
                className="btn btn-primary btn-lg"
                onClick={handleBookRide}
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <span className="btn-loading" />
                ) : (
                  <>🚕 Book Ride — {formatCurrency(fareData.totalFare)}</>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .book-page {
          padding: 2rem;
          max-width: 600px;
          margin: 0 auto;
        }
        .book-header {
          margin-bottom: 2rem;
        }
        .book-header h1 {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--gray-900);
        }
        .book-header p {
          color: var(--gray-400);
          font-size: 0.9rem;
        }
        .steps-indicator {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 2rem;
        }
        .step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.3rem;
        }
        .step-dot {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--gray-200);
          color: var(--gray-400);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 700;
          transition: all 0.3s;
        }
        .step-dot.active {
          background: var(--primary);
          color: white;
        }
        .step-dot.done {
          background: #22c55e;
          color: white;
        }
        .step-label {
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--gray-400);
          text-transform: uppercase;
        }
        .book-card {
          background: white;
          border: 1px solid var(--gray-100);
          border-radius: 20px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .book-card h2 {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--gray-800);
        }
        .location-inputs {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .location-field {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.75rem 0;
        }
        .location-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          margin-top: 1.5rem;
          flex-shrink: 0;
        }
        .location-dot.green { background: #22c55e; }
        .location-dot.red { background: #ef4444; }
        .location-connector {
          width: 2px;
          height: 15px;
          background: var(--gray-200);
          margin-left: 6px;
        }
        .location-input-wrap {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        .location-input-wrap label {
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--gray-400);
          text-transform: uppercase;
        }
        .location-select {
          width: 100%;
          padding: 0.7rem 2.5rem 0.7rem 1rem;
          border: 2px solid var(--gray-200);
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 500;
          outline: none;
          background: var(--gray-50);
          transition: all 0.2s;
          cursor: pointer;
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
          background-size: 18px;
          font-family: inherit;
          color: var(--text-primary);
        }
        .location-select:focus {
          border-color: var(--primary);
          background-color: var(--surface);
          box-shadow: 0 0 0 4px var(--primary-light);
        }
        .location-select option[value=""] {
          color: var(--gray-400);
        }
        .location-select option {
          padding: 0.5rem;
          color: var(--text-primary);
          background: var(--surface);
        }
        .quick-locations {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .quick-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--gray-400);
        }
        .quick-chip {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.4rem 0.8rem;
          background: var(--gray-50);
          border: 1px solid var(--gray-200);
          border-radius: 20px;
          font-size: 0.78rem;
          font-weight: 500;
          color: var(--gray-600);
          cursor: pointer;
          transition: all 0.2s;
        }
        .quick-chip:hover {
          background: var(--primary-light);
          border-color: var(--primary);
          color: var(--primary);
        }
        .quick-chip.selected {
          background: var(--primary-light);
          border-color: var(--primary);
          color: var(--primary);
          font-weight: 600;
        }
        .ride-type-cards {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .ride-type-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.25rem;
          border: 2px solid var(--gray-200);
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }
        .ride-type-card:hover {
          border-color: var(--gray-300);
        }
        .ride-type-card.selected {
          border-color: var(--primary);
          background: var(--primary-light);
        }
        .ride-type-emoji { font-size: 2rem; }
        .ride-type-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .ride-type-name {
          font-weight: 700;
          color: var(--gray-800);
        }
        .ride-type-desc {
          font-size: 0.8rem;
          color: var(--gray-400);
        }
        .ride-type-fare {
          text-align: right;
          display: flex;
          flex-direction: column;
        }
        .fare-amount {
          font-weight: 800;
          color: var(--gray-800);
          font-size: 1.1rem;
        }
        .fare-estimate {
          font-size: 0.75rem;
          color: var(--gray-400);
        }
        .ride-type-check {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .fare-breakdown {
          background: var(--gray-50);
          border-radius: 14px;
          padding: 1.25rem;
        }
        .fare-breakdown h3 {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--gray-600);
          margin-bottom: 0.75rem;
        }
        .fare-row {
          display: flex;
          justify-content: space-between;
          padding: 0.4rem 0;
          font-size: 0.85rem;
          color: var(--gray-500);
        }
        .fare-row.total {
          border-top: 1px solid var(--gray-200);
          margin-top: 0.5rem;
          padding-top: 0.75rem;
          font-weight: 800;
          font-size: 1rem;
          color: var(--gray-800);
        }
        .confirm-summary {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .confirm-route {
          display: flex;
          flex-direction: column;
        }
        .confirm-point {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 0;
        }
        .confirm-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .confirm-dot.green { background: #22c55e; }
        .confirm-dot.red { background: #ef4444; }
        .confirm-label {
          display: block;
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--gray-400);
          text-transform: uppercase;
        }
        .confirm-value {
          display: block;
          font-weight: 600;
          color: var(--gray-800);
          font-size: 0.95rem;
        }
        .confirm-line {
          width: 2px;
          height: 18px;
          background: var(--gray-200);
          margin-left: 5px;
        }
        .confirm-details {
          background: var(--gray-50);
          border-radius: 14px;
          padding: 1rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .confirm-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          color: var(--gray-600);
        }
        .confirm-row.total-fare {
          margin-top: 0.5rem;
          padding-top: 0.5rem;
          border-top: 1px solid var(--gray-200);
          font-size: 1.1rem;
          color: var(--primary);
          font-weight: 700;
        }
        .payment-section h3 {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--gray-700);
          margin-bottom: 0.75rem;
        }
        .payment-options {
          display: flex;
          gap: 0.75rem;
        }
        .payment-opt {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          padding: 0.75rem;
          border: 2px solid var(--gray-200);
          border-radius: 12px;
          background: white;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.85rem;
          color: var(--gray-600);
          transition: all 0.2s;
        }
        .payment-opt:hover { border-color: var(--gray-300); }
        .payment-opt.selected {
          border-color: var(--primary);
          background: var(--primary-light);
          color: var(--primary);
        }
        .step-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 0.5rem;
        }
        .btn-loading {
          width: 22px;
          height: 22px;
          border: 3px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 768px) {
          .book-page { padding: 1.5rem 1rem; }
          .payment-options { flex-direction: column; }
        }
      `}</style>
    </div>
  );
};

export default BookRide;
