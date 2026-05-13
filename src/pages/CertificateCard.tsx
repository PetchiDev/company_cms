import React from 'react';
import { motion } from 'framer-motion';
import { useMouseTilt } from '@/hooks/useMouseTilt';
import { staggerItem } from '@/animations/pageTransitions';

interface CertificateCardProps {
  cert: {
    url: string;
    name: string;
  };
}

const CertificateCard: React.FC<CertificateCardProps> = ({ cert }) => {
  const tilt = useMouseTilt({ max: 12, perspective: 1000 });

  return (
    <motion.div 
      className="cert-card glass-card"
      variants={staggerItem}
      style={tilt.style}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      whileHover={{ scale: 1.02 }}
    >
      <div className="cert-card__inner">
        <div className="cert-card__image-container">
          <img src={cert.url} alt={cert.name} loading="lazy" />
        </div>
        <div className="cert-card__info">
          <h3 className="cert-card__name">{cert.name}</h3>
          <div className="cert-card__badge">Verified</div>
        </div>
      </div>
      <div className="cert-card__glow" />
    </motion.div>
  );
};

export default CertificateCard;
