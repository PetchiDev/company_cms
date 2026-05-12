import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useSiteContent, useCultureHighlights } from '@/hooks/useCMS';
import { staggerContainer, staggerItem } from '@/animations/pageTransitions';
import ParticleField from '@/components/ui/ParticleField/ParticleField';
import { useSEO } from '@/hooks/useSEO';
import './CareersPage.css';

const CareersPage = () => {
  const { company, jobPortalUrl } = useSiteContent();
  const { cultureHighlights } = useCultureHighlights();

  useSEO({
    title: 'Careers',
    description: `Join our team at ${company.name || 'Kryptos InfoSys'}. Learn more about our company culture and explore career opportunities.`,
    keywords: 'Kryptos InfoSys careers, join our team, job openings, developer jobs, IT recruitment'
  });

  return (
    <div className="careers-page">
      <section className="page-hero">
        <div className="page-hero__bg" />
        <div className="floating-shape floating-shape--1" />
        <div className="floating-shape floating-shape--2" />
        <div className="container page-hero__content">
          <motion.span className="page-hero__label" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>Join Our Team</motion.span>
          <motion.h1 className="page-hero__title" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>Build Your <span className="text-gradient-animated">Career</span></motion.h1>
          <motion.p className="page-hero__subtitle" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            Discover exciting opportunities at {company.name}
          </motion.p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <span className="section-heading__label">Why {company.name}?</span>
            <h2 className="section-heading__title">Our <span>Culture</span></h2>
          </div>
          <motion.div className="culture-grid perspective-1000" variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }}>
            {cultureHighlights.map((item, i) => {
              const IconComponent = (LucideIcons as any)[item.icon] || LucideIcons.Star;
              return (
                <motion.div key={i} variants={staggerItem} className="culture-card">
                  <div className="culture-card__icon"><IconComponent size={28} /></div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="section section--dark careers-cta-section">
        <ParticleField count={30} color="rgba(238,79,41,0.2)" lineColor="rgba(238,79,41,0.05)" interactive={false} />
        <div className="container text-center" style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ color: 'white', marginBottom: '1rem' }}>Ready to Join <span className="text-gradient-animated">{company.name}</span>?</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2rem', maxWidth: 500, margin: '0 auto 2rem' }}>
            Explore our current openings and find the perfect role for you.
          </p>
          <a href={jobPortalUrl} target="_blank" rel="noopener noreferrer" className="magnetic-btn magnetic-btn--orange magnetic-btn--lg">
            <span className="magnetic-btn__text">View Open Positions <ExternalLink size={16} /></span>
            <span className="magnetic-btn__glow" />
          </a>
        </div>
      </section>
    </div>
  );
};

export default CareersPage;
