import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  ChevronDown,
  ChevronRight,
  MessageCircle,
  Phone,
  Mail,
  FileText,
  Car,
  CreditCard,
  Shield,
  MapPin,
  Clock,
} from 'lucide-react';
import toast from 'react-hot-toast';

const faqs = [
  {
    category: 'Booking & Rides',
    icon: Car,
    questions: [
      {
        q: 'How do I book a ride?',
        a: 'Go to the "Book Ride" page, enter your pickup and drop-off locations, choose your ride type (Economy, Comfort, or Premium), select a payment method, and confirm your booking. A nearby driver will be assigned automatically.',
      },
      {
        q: 'Can I schedule a ride in advance?',
        a: 'Currently, RideNow supports instant bookings only. Scheduled rides are coming soon in our next update!',
      },
      {
        q: 'How do I cancel a ride?',
        a: 'Go to "Ride History", find your pending or accepted ride, and click "Cancel". Please note that cancellation may be restricted once the driver is en route.',
      },
      {
        q: 'What ride types are available?',
        a: 'We offer three ride types: Economy (affordable, sedan), Comfort (spacious, SUV/sedan), and Premium (luxury vehicles with top-rated drivers).',
      },
    ],
  },
  {
    category: 'Fares & Payments',
    icon: CreditCard,
    questions: [
      {
        q: 'How is the fare calculated?',
        a: 'Fares are calculated based on a base fare + per-km charge + per-minute charge. Each ride type has different rates. Premium rides also include a surge multiplier during peak hours.',
      },
      {
        q: 'What payment methods are accepted?',
        a: 'We accept Cash, Credit/Debit Cards, and in-app Wallet. You can choose your preferred method before confirming a ride.',
      },
      {
        q: 'Is there a cancellation fee?',
        a: 'No cancellation fee is charged if you cancel within 2 minutes of booking. After that, a small fee may apply depending on the ride type and driver proximity.',
      },
    ],
  },
  {
    category: 'Safety & Security',
    icon: Shield,
    questions: [
      {
        q: 'Are the drivers verified?',
        a: 'Yes! All drivers go through a thorough background check, license verification, and vehicle inspection before being approved on our platform.',
      },
      {
        q: 'How do I report an issue with a ride?',
        a: 'You can rate your ride after completion and leave feedback. For serious issues, contact our 24/7 support team via phone or email.',
      },
      {
        q: 'Is my personal data safe?',
        a: 'Absolutely. We use industry-standard encryption and never share your personal data with third parties. You can manage your privacy settings in the Settings page.',
      },
    ],
  },
  {
    category: 'Location & Maps',
    icon: MapPin,
    questions: [
      {
        q: 'Why is my location not detected?',
        a: 'Make sure you have granted location permission to the app. Go to your browser or device settings and enable location access for RideNow.',
      },
      {
        q: 'Can I add multiple stops?',
        a: 'Currently, only one pickup and one drop-off point are supported per ride. Multi-stop rides are on our roadmap!',
      },
    ],
  },
];

const Help = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [openQ, setOpenQ] = useState(null);

  const toggleCategory = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
    setOpenQ(null);
  };

  const toggleQuestion = (qIdx) => {
    setOpenQ(openQ === qIdx ? null : qIdx);
  };

  return (
    <div className="help-page">
      <div className="help-header">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          💬 Help & Support
        </motion.h1>
        <p>Find answers to common questions or reach out to us</p>
      </div>

      {/* Contact Cards */}
      <div className="contact-grid">
        {[
          { icon: MessageCircle, label: 'Live Chat', value: 'Available 24/7', color: '#3b82f6', bg: '#dbeafe' },
          { icon: Phone, label: 'Call Us', value: '+91 1800-RIDENOW', color: '#22c55e', bg: '#dcfce7' },
          { icon: Mail, label: 'Email', value: 'support@ridenow.in', color: '#a855f7', bg: '#ede9fe' },
        ].map((c, i) => (
          <motion.div
            key={c.label}
            className="contact-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => toast(`${c.label} — Coming soon!`, { icon: '🔧' })}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.97 }}
          >
            <div className="contact-icon" style={{ background: c.bg }}>
              <c.icon size={22} color={c.color} />
            </div>
            <div className="contact-info">
              <span className="contact-label">{c.label}</span>
              <span className="contact-value">{c.value}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* FAQ Accordion */}
      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>

        <div className="faq-list">
          {faqs.map((cat, catIdx) => (
            <motion.div
              key={cat.category}
              className="faq-category"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIdx * 0.08 }}
            >
              <button
                className={`faq-category-btn ${openIndex === catIdx ? 'open' : ''}`}
                onClick={() => toggleCategory(catIdx)}
              >
                <div className="faq-cat-left">
                  <cat.icon size={18} />
                  <span>{cat.category}</span>
                  <span className="faq-count">{cat.questions.length}</span>
                </div>
                <motion.div
                  animate={{ rotate: openIndex === catIdx ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <ChevronDown size={18} />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === catIdx && (
                  <motion.div
                    className="faq-questions"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {cat.questions.map((item, qIdx) => (
                      <div key={qIdx} className="faq-item">
                        <button
                          className={`faq-q ${openQ === `${catIdx}-${qIdx}` ? 'open' : ''}`}
                          onClick={() => toggleQuestion(`${catIdx}-${qIdx}`)}
                        >
                          <ChevronRight
                            size={16}
                            className={`faq-q-arrow ${openQ === `${catIdx}-${qIdx}` ? 'rotated' : ''}`}
                          />
                          <span>{item.q}</span>
                        </button>

                        <AnimatePresence>
                          {openQ === `${catIdx}-${qIdx}` && (
                            <motion.div
                              className="faq-a"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                            >
                              <p>{item.a}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .help-page {
          padding: 2rem;
          max-width: 750px;
          margin: 0 auto;
        }
        .help-header {
          margin-bottom: 2rem;
        }
        .help-header h1 {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--gray-900);
        }
        .help-header p {
          color: var(--gray-400);
          font-size: 0.9rem;
          margin-top: 0.2rem;
        }

        /* Contact Cards */
        .contact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2.5rem;
        }
        .contact-card {
          background: white;
          border: 1px solid var(--gray-100);
          border-radius: 16px;
          padding: 1.25rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .contact-card:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.06);
        }
        .contact-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .contact-info {
          display: flex;
          flex-direction: column;
        }
        .contact-label {
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--gray-800);
        }
        .contact-value {
          font-size: 0.8rem;
          color: var(--gray-400);
        }

        /* FAQ */
        .faq-section h2 {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--gray-800);
          margin-bottom: 1rem;
        }
        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .faq-category {
          background: white;
          border: 1px solid var(--gray-100);
          border-radius: 16px;
          overflow: hidden;
        }
        .faq-category-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--gray-700);
          transition: all 0.2s;
        }
        .faq-category-btn:hover,
        .faq-category-btn.open {
          background: var(--gray-50);
        }
        .faq-cat-left {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .faq-count {
          background: var(--gray-100);
          color: var(--gray-500);
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.15rem 0.5rem;
          border-radius: 10px;
        }
        .faq-questions {
          overflow: hidden;
          border-top: 1px solid var(--gray-100);
        }
        .faq-item {
          border-bottom: 1px solid var(--gray-50);
        }
        .faq-item:last-child {
          border-bottom: none;
        }
        .faq-q {
          width: 100%;
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          padding: 0.85rem 1.25rem 0.85rem 1.5rem;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.88rem;
          font-weight: 500;
          color: var(--gray-700);
          text-align: left;
          transition: all 0.2s;
        }
        .faq-q:hover {
          color: var(--primary);
        }
        .faq-q.open {
          color: var(--primary);
          font-weight: 600;
        }
        .faq-q-arrow {
          flex-shrink: 0;
          margin-top: 2px;
          transition: transform 0.25s;
          color: var(--gray-300);
        }
        .faq-q-arrow.rotated {
          transform: rotate(90deg);
          color: var(--primary);
        }
        .faq-a {
          overflow: hidden;
          padding: 0 1.25rem 1rem 2.5rem;
        }
        .faq-a p {
          font-size: 0.85rem;
          color: var(--gray-500);
          line-height: 1.7;
        }

        @media (max-width: 768px) {
          .help-page { padding: 1.5rem 1rem; }
          .contact-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default Help;
