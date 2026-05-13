import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useCertifications } from '@/hooks/useCMS';
import { staggerContainer } from '@/animations/pageTransitions';
import { useSEO } from '@/hooks/useSEO';
import ParticleField from '@/components/ui/ParticleField/ParticleField';
import Skeleton from '@/components/ui/Skeleton/Skeleton';
import CertificateCard from './CertificateCard';
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
                  <div className="cert-card__inner">
                    <Skeleton height={160} width={160} borderRadius="2rem" className="mx-auto mb-8" />
                    <Skeleton height={24} width="80%" className="mx-auto mb-4" />
                    <Skeleton height={20} width="40%" className="mx-auto" />
                  </div>
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
                <CertificateCard key={i} cert={cert} />
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
