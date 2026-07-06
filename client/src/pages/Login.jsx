import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      toast.success('Welcome back! 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-shapes">
        <div className="auth-shape s1" />
        <div className="auth-shape s2" />
      </div>

      <motion.div
        className="auth-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="auth-header">
          <span className="auth-emoji">🚕</span>
          <h1>Welcome Back</h1>
          <p>Sign in to continue your journey</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="input-action"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <span className="btn-loading" />
            ) : (
              <>
                Sign In <ArrowRight size={18} />
              </>
            )}
          </motion.button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">
              Sign Up
            </Link>
          </p>
        </div>
      </motion.div>

      <style>{`
        .auth-page {
          min-height: calc(100vh - 70px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1.5rem;
          position: relative;
          overflow: hidden;
        }
        .auth-bg-shapes {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .auth-shape {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.12;
        }
        .s1 { width: 400px; height: 400px; background: var(--primary); top: -100px; right: -100px; }
        .s2 { width: 300px; height: 300px; background: #a855f7; bottom: -80px; left: -80px; }
        .auth-container {
          width: 100%;
          max-width: 420px;
          background: white;
          border-radius: 24px;
          padding: 2.5rem;
          border: 1px solid var(--gray-100);
          box-shadow: 0 4px 40px rgba(0,0,0,0.06);
          position: relative;
          z-index: 1;
        }
        .auth-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .auth-emoji { font-size: 2.5rem; display: block; margin-bottom: 0.5rem; }
        .auth-header h1 {
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--gray-900);
        }
        .auth-header p {
          color: var(--gray-400);
          font-size: 0.9rem;
          margin-top: 0.3rem;
        }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .form-group label {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--gray-600);
          margin-bottom: 0.4rem;
        }
        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-icon {
          position: absolute;
          left: 1rem;
          color: var(--gray-400);
          pointer-events: none;
        }
        .input-wrapper input {
          width: 100%;
          padding: 0.8rem 1rem 0.8rem 2.8rem;
          border: 2px solid var(--gray-200);
          border-radius: 14px;
          font-size: 0.9rem;
          transition: all 0.2s;
          background: var(--gray-50);
          outline: none;
        }
        .input-wrapper input:focus {
          border-color: var(--primary);
          background: white;
          box-shadow: 0 0 0 4px var(--primary-light);
        }
        .input-action {
          position: absolute;
          right: 0.75rem;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--gray-400);
          padding: 0.3rem;
          border-radius: 8px;
          display: flex;
        }
        .input-action:hover { color: var(--gray-600); }
        .btn-loading {
          width: 22px;
          height: 22px;
          border: 3px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .auth-footer {
          text-align: center;
          margin-top: 1.5rem;
        }
        .auth-footer p {
          color: var(--gray-400);
          font-size: 0.9rem;
        }
        .auth-link {
          color: var(--primary);
          font-weight: 600;
          text-decoration: none;
        }
        .auth-link:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
};

export default Login;
