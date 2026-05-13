import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useCertifications } from '@/hooks/useCMS';
import { staggerContainer, staggerItem } from '@/animations/pageTransitions';
import { useSEO } from '@/hooks/useSEO';
import ParticleField from '@/components/ui/ParticleField/ParticleField';
import './CertificatesPage.css';

const CertificatesPage = () => {
  const { certifications, isLoading } = useCertifications();
  const galleryRef = useRef<HTMLDivElement>(null);

  useSEO({
    title: 'Our Certifications',
    description: 'Explore the professional certifications and credentials that validate the excellence of Kryptos InfoSys.',
    keywords: 'Kryptos certifications, IT credentials, Microsoft certified, AWS certified, professional IT services'
  });


  return (
    <div className="certificates-page">
      <section className="page-hero">
        <div className="page-hero__bg" />
        <ParticleField count={30} color="rgba(238,79,41,0.15)" lineColor="rgba(238,79,41,0.05)" interactive={false} />
        <div className="container page-hero__content">
          <motion.span 
            className="page-hero__label" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }}
          >
            Credentials
          </motion.span>
          <motion.h1 
            className="page-hero__title" 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.4 }}
          >
            Our <span className="text-gradient-animated">Certifications</span>
          </motion.h1>
          <motion.p 
            className="page-hero__subtitle" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.6 }}
          >
            Validating our commitment to excellence through global standards
          </motion.p>
        </div>
      </section>

      <section className="section certificates-section">
        <div className="container">
          {isLoading ? (
            <div className="certificates-gallery">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="cert-card skeleton-card">
                  <div className="skeleton" style={{ height: '200px', width: '100%', borderRadius: '1rem' }} />
                </div>
              ))}
            </div>
          ) : certifications.length > 0 ? (
            <motion.div 
              className="certificates-gallery" 
              ref={galleryRef}
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-50px' }}
            >
              {certifications.map((cert, i) => (
                <motion.div 
                  key={i} 
                  className="cert-card glass-card"
                  variants={staggerItem}
                  whileHover={{ y: -10, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
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
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted">No certifications found.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CertificatesPage;
