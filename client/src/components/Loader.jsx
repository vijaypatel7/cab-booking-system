import { motion } from 'framer-motion';
import { Car } from 'lucide-react';

const Loader = ({ size = 'md', text = 'Loading...' }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div className="loader-container">
      <motion.div
        className="loader-icon"
        animate={{ x: [0, 20, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Car className={sizes[size]} />
      </motion.div>
      <p className="loader-text">{text}</p>

      <style>{`
        .loader-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          gap: 1rem;
        }
        .loader-icon {
          color: var(--primary);
        }
        .loader-text {
          color: var(--gray-500);
          font-size: 0.9rem;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default Loader;
