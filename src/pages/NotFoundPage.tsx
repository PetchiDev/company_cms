import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useMouse3D } from '@/hooks/useMouse3D';
import ParticleField from '@/components/ui/ParticleField/ParticleField';

const NotFoundPage = () => {
  const { ref, rotateX, rotateY } = useMouse3D({ intensity: 15, global: true });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(-45deg, #1a1a2e, #16213e, #1a1028, #0f1923)', backgroundSize: '400% 400%', animation: 'meshGradient 20s ease infinite', color: 'white', textAlign: 'center', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
      <ParticleField count={50} color="rgba(238,79,41,0.3)" lineColor="rgba(238,79,41,0.08)" />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ position: 'relative', zIndex: 1 }}>
        <div
          ref={ref}
          style={{
            transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            willChange: 'transform',
          }}
        >
          <h1 style={{
            fontSize: 'clamp(5rem, 15vw, 10rem)',
            fontWeight: 900,
            background: 'linear-gradient(135deg, var(--primary-orange), #ff6b3d, #ff9a76, var(--primary-orange))',
            backgroundSize: '300% 300%',
            animation: 'textGradientFlow 4s ease infinite',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1,
            textShadow: '0 0 60px rgba(238, 79, 41, 0.3)',
            filter: 'drop-shadow(0 0 30px rgba(238, 79, 41, 0.2))',
          }}>404</h1>
        </div>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Page Not Found</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>The page you're looking for doesn't exist or has been moved.</p>
        <Link to={ROUTES.HOME} className="magnetic-btn magnetic-btn--orange magnetic-btn--md">
          <span className="magnetic-btn__text"><Home size={18} /> Back to Home</span>
          <span className="magnetic-btn__glow" />
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
