import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  Shield,
  Zap,
  Clock,
  ArrowRight,
  Star,
  Users,
  Navigation,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const stagger = {
  animate: {
    transition: { staggerChildren: 0.1 },
  },
};

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg-shapes">
          <div className="shape shape-1" />
          <div className="shape shape-2" />
          <div className="shape shape-3" />
        </div>

        <motion.div
          className="hero-content"
          variants={stagger}
          initial="initial"
          animate="animate"
        >
          <motion.div className="hero-badge" variants={fadeInUp}>
            🚕 #1 Cab Booking App
          </motion.div>

          <motion.h1 className="hero-title" variants={fadeInUp}>
            Your Ride,
            <br />
            <span className="gradient-text">Our Way.</span>
          </motion.h1>

          <motion.p className="hero-subtitle" variants={fadeInUp}>
            Book a cab in seconds. Affordable fares, reliable drivers, and
            real-time tracking — all from the palm of your hand.
          </motion.p>

          <motion.div className="hero-actions" variants={fadeInUp}>
            {user ? (
              <Link to="/book" className="btn btn-primary btn-lg">
                <MapPin size={20} /> Book a Ride Now
                <ArrowRight size={18} />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Get Started <ArrowRight size={18} />
                </Link>
                <Link to="/login" className="btn btn-outline btn-lg">
                  Sign In
                </Link>
              </>
            )}
          </motion.div>

          <motion.div className="hero-stats" variants={fadeInUp}>
            <div className="stat">
              <Users size={20} />
              <div>
                <span className="stat-number">50K+</span>
                <span className="stat-label">Happy Riders</span>
              </div>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <Navigation size={20} />
              <div>
                <span className="stat-number">1M+</span>
                <span className="stat-label">Rides Completed</span>
              </div>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <Star size={20} />
              <div>
                <span className="stat-number">4.9</span>
                <span className="stat-label">Average Rating</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="phone-mockup">
            <div className="phone-screen">
              <div className="phone-header">
                <MapPin size={14} />
                <span>Where to?</span>
              </div>
              <div className="phone-map">
                <div className="map-pin pickup-pin">🟢</div>
                <div className="map-route" />
                <div className="map-pin drop-pin">🔴</div>
                <div className="car-emoji">🚕</div>
              </div>
              <div className="phone-ride-options">
                <div className="phone-ride-opt selected">
                  🚗 <span>Economy</span> <strong>₹150</strong>
                </div>
                <div className="phone-ride-opt">
                  🚙 <span>Comfort</span> <strong>₹250</strong>
                </div>
                <div className="phone-ride-opt">
                  🏎️ <span>Premium</span> <strong>₹400</strong>
                </div>
              </div>
              <div className="phone-book-btn">Book Ride</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <motion.span
            className="section-badge"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Why RideNow?
          </motion.span>
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Everything you need for a
            <span className="gradient-text"> perfect ride</span>
          </motion.h2>
        </div>

        <motion.div
          className="features-grid"
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.div className="feature-card" variants={fadeInUp}>
            <div className="feature-icon" style={{ background: '#dbeafe' }}>
              <Zap size={28} color="#2563eb" />
            </div>
            <h3>Instant Booking</h3>
            <p>Book your ride in under 10 seconds. No waiting, no hassle.</p>
          </motion.div>

          <motion.div className="feature-card" variants={fadeInUp}>
            <div className="feature-icon" style={{ background: '#d1fae5' }}>
              <Shield size={28} color="#059669" />
            </div>
            <h3>Safe & Secure</h3>
            <p>Verified drivers, real-time tracking, and SOS button for emergencies.</p>
          </motion.div>

          <motion.div className="feature-card" variants={fadeInUp}>
            <div className="feature-icon" style={{ background: '#fef3c7' }}>
              <Clock size={28} color="#d97706" />
            </div>
            <h3>On-Time Pickup</h3>
            <p>Our drivers arrive within minutes. Track them live on the map.</p>
          </motion.div>

          <motion.div className="feature-card" variants={fadeInUp}>
            <div className="feature-icon" style={{ background: '#ede9fe' }}>
              <Star size={28} color="#7c3aed" />
            </div>
            <h3>Best Drivers</h3>
            <p>Top-rated drivers with clean records and comfortable vehicles.</p>
          </motion.div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <motion.div
          className="cta-content"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>Ready to ride?</h2>
          <p>Join thousands of happy riders and experience the difference.</p>
          <Link to={user ? '/book' : '/register'} className="btn btn-primary btn-lg">
            {user ? 'Book Your Ride' : 'Create Free Account'}
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="brand-emoji">🚕</span>
            <span className="brand-name">RideNow</span>
          </div>
          <p className="footer-copy">© 2026 RideNow. Made with ❤️ for riders everywhere.</p>
        </div>
      </footer>

      <style>{`
        .home-page {
          overflow-x: hidden;
        }

        /* Hero */
        .hero {
          min-height: 90vh;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4rem;
          max-width: 1200px;
          margin: 0 auto;
          padding: 3rem 1.5rem;
          position: relative;
        }
        .hero-bg-shapes {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }
        .shape {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.15;
        }
        .shape-1 {
          width: 500px; height: 500px;
          background: var(--primary);
          top: -100px; left: -100px;
        }
        .shape-2 {
          width: 400px; height: 400px;
          background: #a855f7;
          bottom: -50px; right: -50px;
        }
        .shape-3 {
          width: 300px; height: 300px;
          background: #06b6d4;
          top: 50%; left: 50%;
        }
        .hero-content {
          flex: 1;
          position: relative;
          z-index: 1;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--primary-light);
          color: var(--primary);
          padding: 0.5rem 1.2rem;
          border-radius: 30px;
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }
        .hero-title {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 900;
          line-height: 1.1;
          color: var(--gray-900);
          margin-bottom: 1.5rem;
        }
        .gradient-text {
          background: linear-gradient(135deg, var(--primary), #a855f7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-subtitle {
          font-size: 1.15rem;
          color: var(--gray-500);
          line-height: 1.7;
          max-width: 500px;
          margin-bottom: 2rem;
        }
        .hero-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 2.5rem;
        }
        .hero-stats {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }
        .stat {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--gray-400);
        }
        .stat div {
          display: flex;
          flex-direction: column;
        }
        .stat-number {
          font-size: 1.3rem;
          font-weight: 800;
          color: var(--gray-800);
        }
        .stat-label {
          font-size: 0.75rem;
          font-weight: 500;
        }
        .stat-divider {
          width: 1px;
          height: 40px;
          background: var(--gray-200);
        }

        /* Phone Mockup */
        .hero-visual {
          flex: 0.8;
          display: flex;
          justify-content: center;
          position: relative;
          z-index: 1;
        }
        .phone-mockup {
          width: 280px;
          background: #111;
          border-radius: 36px;
          padding: 12px;
          box-shadow: 0 25px 60px rgba(0,0,0,0.2);
        }
        .phone-screen {
          background: white;
          border-radius: 26px;
          overflow: hidden;
        }
        .phone-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          background: var(--gray-50);
          color: var(--gray-400);
          font-size: 0.85rem;
          font-weight: 500;
        }
        .phone-map {
          height: 160px;
          background: linear-gradient(135deg, #e0f2fe, #dbeafe, #ede9fe);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .map-pin {
          position: absolute;
          font-size: 1rem;
        }
        .pickup-pin { left: 25%; top: 35%; }
        .drop-pin { right: 20%; bottom: 30%; }
        .map-route {
          width: 60%;
          height: 2px;
          background: var(--primary);
          transform: rotate(-25deg);
          border-top: 2px dashed var(--primary);
        }
        .car-emoji {
          position: absolute;
          font-size: 1.5rem;
          animation: driveCar 3s ease-in-out infinite;
        }
        @keyframes driveCar {
          0%, 100% { transform: translateX(-30px); }
          50% { transform: translateX(30px); }
        }
        .phone-ride-options {
          padding: 0.5rem;
        }
        .phone-ride-opt {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          border-radius: 10px;
          font-size: 0.8rem;
          color: var(--gray-600);
        }
        .phone-ride-opt span { flex: 1; }
        .phone-ride-opt.selected {
          background: var(--primary-light);
          color: var(--primary);
          font-weight: 600;
        }
        .phone-book-btn {
          margin: 0.5rem;
          padding: 0.75rem;
          text-align: center;
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: white;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.85rem;
        }

        /* Features */
        .features-section {
          padding: 6rem 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        .section-badge {
          display: inline-block;
          background: var(--primary-light);
          color: var(--primary);
          padding: 0.4rem 1rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }
        .section-title {
          font-size: clamp(1.8rem, 4vw, 2.5rem);
          font-weight: 800;
          color: var(--gray-900);
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }
        .feature-card {
          background: white;
          border: 1px solid var(--gray-100);
          border-radius: 20px;
          padding: 2rem;
          transition: all 0.3s;
        }
        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.08);
        }
        .feature-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
        }
        .feature-card h3 {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--gray-800);
          margin-bottom: 0.5rem;
        }
        .feature-card p {
          font-size: 0.9rem;
          color: var(--gray-500);
          line-height: 1.6;
        }

        /* CTA */
        .cta-section {
          background: linear-gradient(135deg, var(--primary), #7c3aed);
          padding: 5rem 1.5rem;
          text-align: center;
        }
        .cta-content h2 {
          font-size: 2.5rem;
          font-weight: 900;
          color: white;
          margin-bottom: 1rem;
        }
        .cta-content p {
          font-size: 1.1rem;
          color: rgba(255,255,255,0.8);
          margin-bottom: 2rem;
        }
        .cta-section .btn-primary {
          background: white;
          color: var(--primary);
        }
        .cta-section .btn-primary:hover {
          background: rgba(255,255,255,0.9);
        }

        /* Footer */
        .home-footer {
          background: var(--gray-900);
          padding: 2rem 1.5rem;
        }
        .footer-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .footer-brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .brand-emoji { font-size: 1.5rem; }
        .brand-name {
          font-size: 1.2rem;
          font-weight: 800;
          color: white;
        }
        .footer-copy {
          font-size: 0.85rem;
          color: var(--gray-500);
        }

        @media (max-width: 768px) {
          .hero {
            flex-direction: column;
            text-align: center;
            min-height: auto;
            padding-top: 3rem;
          }
          .hero-subtitle { margin-left: auto; margin-right: auto; }
          .hero-actions { justify-content: center; }
          .hero-stats { justify-content: center; }
          .hero-visual { width: 100%; max-width: 280px; }
          .footer-inner { justify-content: center; text-align: center; }
        }
      `}</style>
    </div>
  );
};

export default Home;
