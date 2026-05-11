import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useSiteContent, useCultureHighlights } from '@/hooks/useCMS';
import { staggerContainer, staggerItem } from '@/animations/pageTransitions';
import './CareersPage.css';

const CareersPage = () => {
  const { company, jobPortalUrl } = useSiteContent();
  const { cultureHighlights } = useCultureHighlights();

  return (
    <div className="careers-page">
      <section className="page-hero">
        <div className="page-hero__bg" />
        <div className="container page-hero__content">
          <motion.span className="page-hero__label" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>Join Our Team</motion.span>
          <motion.h1 className="page-hero__title" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>Build Your <span className="text-orange">Career</span></motion.h1>
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
          <motion.div className="culture-grid" variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }}>
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

      <section className="section section--dark">
        <div className="container text-center">
          <h2 style={{ color: 'white', marginBottom: '1rem' }}>Ready to Join <span className="text-orange">{company.name}</span>?</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2rem', maxWidth: 500, margin: '0 auto 2rem' }}>
            Explore our current openings and find the perfect role for you.
          </p>
          <a href={jobPortalUrl} target="_blank" rel="noopener noreferrer" className="btn btn--orange">
            View Open Positions <ExternalLink size={16} />
          </a>
        </div>
      </section>
    </div>
  );
};

export default CareersPage;
