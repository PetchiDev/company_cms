import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

const NotFoundPage = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, var(--bg-navy), #080c3a)', color: 'white', textAlign: 'center', padding: '2rem' }}>
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <h1 style={{ fontSize: 'clamp(5rem, 15vw, 10rem)', fontWeight: 900, background: 'linear-gradient(135deg, var(--primary-blue), var(--primary-orange))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>404</h1>
      <h2 style={{ marginBottom: '1rem' }}>Page Not Found</h2>
      <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}>The page you're looking for doesn't exist or has been moved.</p>
      <Link to={ROUTES.HOME} className="btn btn--orange"><Home size={18} /> Back to Home</Link>
    </motion.div>
  </div>
);

export default NotFoundPage;
