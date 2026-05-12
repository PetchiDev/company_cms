import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download } from 'lucide-react';
import { useCaseStudies } from '@/hooks/useCMS';
import { useSEO } from '@/hooks/useSEO';
import { staggerContainer, staggerItem } from '@/animations/pageTransitions';

const CaseStudiesPage = () => {
  const { caseStudies } = useCaseStudies();
  const [activeFilter, setActiveFilter] = useState('All');

  useSEO({
    title: 'Case Studies',
    description: 'Explore the portfolio and real-world success stories of Kryptos InfoSys. Read our deep-dive case studies on modernizing applications, deploying clouds, and developing customized IT solutions.',
    keywords: 'Kryptos InfoSys case studies, cloud success stories, client portfolio, IT solutions real world application'
  });

  const categories = ['All', ...new Set(caseStudies.map((cs) => cs.category))];
  const filtered = activeFilter === 'All' ? caseStudies : caseStudies.filter((cs) => cs.category === activeFilter);

  return (
    <div>
      <section className="page-hero">
        <div className="page-hero__bg" />
        <div className="floating-shape floating-shape--1" />
        <div className="container page-hero__content">
          <motion.span className="page-hero__label" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>Our Work</motion.span>
          <motion.h1 className="page-hero__title" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>Case <span className="text-gradient-animated">Studies</span></motion.h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className="magnetic-btn"
                style={{
                  padding: '0.5rem 1.2rem',
                  fontSize: '0.85rem',
                  background: activeFilter === cat ? 'var(--primary-orange)' : 'rgba(238,79,41,0.06)',
                  color: activeFilter === cat ? 'white' : 'var(--dark-text)',
                  borderRadius: 'var(--radius-full)',
                  border: `1px solid ${activeFilter === cat ? 'var(--primary-orange)' : 'rgba(238,79,41,0.1)'}`,
                  boxShadow: activeFilter === cat ? '0 5px 20px rgba(238,79,41,0.2)' : 'none',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <motion.div className="case-studies-grid perspective-1000" variants={staggerContainer} initial="initial" animate="animate" key={activeFilter}>
            <AnimatePresence mode="popLayout">
              {filtered.map((cs) => (
                <motion.div key={cs.id} variants={staggerItem} layout initial={{ opacity: 0, scale: 0.9, rotateX: 10 }} animate={{ opacity: 1, scale: 1, rotateX: 0 }} exit={{ opacity: 0, scale: 0.9, rotateX: -10 }} transition={{ duration: 0.4 }} className="case-study-card">
                  <div className="case-study-card__img">
                    <img src={cs.thumbnail} alt={cs.title} loading="lazy" />
                    <span className="case-study-card__category">{cs.category}</span>
                  </div>
                  <div className="case-study-card__body">
                    <h3 className="case-study-card__title">{cs.title}</h3>
                    <p className="case-study-card__desc">{cs.description}</p>
                    {cs.pdfLink && <a href={cs.pdfLink} target="_blank" rel="noopener noreferrer" className="case-study-card__download"><Download size={14} /> Download PDF</a>}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CaseStudiesPage;
