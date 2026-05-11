import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useClientLogos } from '@/hooks/useClientLogos';
import { ROUTES } from '@/constants/routes';
import { COMPANY } from '@/constants/companyData';
import { fadeInUp } from '@/animations/pageTransitions';
import './LoginForm.css';

const LoginForm = () => {
  const { logoUrl } = useClientLogos();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate(ROUTES.ADMIN);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-page__bg" />
      <motion.div className="login-card" variants={fadeInUp} initial="initial" animate="animate">
        <div className="login-card__header">
          <img src={logoUrl} alt={COMPANY.name} className="login-card__logo" />
          <h1 className="login-card__title">Admin Login</h1>
          <p className="login-card__subtitle">Sign in to manage your website</p>
        </div>

        <form className="login-card__form" onSubmit={handleSubmit}>
          {error && <div className="login-card__error">{error}</div>}

          <div className="login-card__field">
            <label htmlFor="email" className="login-card__label">Email</label>
            <div className="login-card__input-wrap">
              <Mail size={18} className="login-card__icon" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@kryptosinfosys.com"
                className="login-card__input"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="login-card__field">
            <label htmlFor="password" className="login-card__label">Password</label>
            <div className="login-card__input-wrap">
              <Lock size={18} className="login-card__icon" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="login-card__input"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="login-card__toggle-pw"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="login-card__submit" disabled={loading}>
            {loading ? (
              <div className="spin" style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }} />
            ) : (
              <>
                <LogIn size={18} />
                Sign In
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginForm;
