import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { useServices } from '@/hooks/useCMS';
import { staggerContainer, staggerItem } from '@/animations/pageTransitions';
import './ServicesPage.css';

const ServicesPage = () => {
  const { serviceCategories } = useServices();

  return (
    <div className="services-page">
      <section className="page-hero">
        <div className="page-hero__bg" />
        <div className="floating-shape floating-shape--1" />
        <div className="floating-shape floating-shape--3" />
        <div className="container page-hero__content">
          <motion.span className="page-hero__label" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>Our Expertise</motion.span>
          <motion.h1 className="page-hero__title" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            Business & <span className="text-gradient-animated">Services</span>
          </motion.h1>
          <motion.p className="page-hero__subtitle" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            Comprehensive IT solutions to transform your business and accelerate digital growth
          </motion.p>
        </div>
      </section>

      {serviceCategories.map((category, catIndex) => (
        <section key={category.id} className={`section ${catIndex % 2 === 1 ? 'section--light' : ''}`}>
          <div className="container">
            <div className="section-heading">
              <span className="section-heading__label">{category.title}</span>
              <h2 className="section-heading__title">{category.title}</h2>
            </div>
            <motion.div className="services-grid perspective-1000" variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true, margin: '-50px' }}>
              {category.services.map((service) => {
                const IconComponent = (LucideIcons as any)[service.icon] || LucideIcons.Cog;
                return (
                  <motion.div key={service.id} variants={staggerItem}>
                    <Link to={`/services/${service.slug}`} className="service-card">
                      <div className="service-card__icon"><IconComponent size={28} /></div>
                      <h3 className="service-card__title">{service.title}</h3>
                      <p className="service-card__desc">{service.shortDescription}</p>
                      <span className="service-card__link">Learn More <ArrowRight size={14} /></span>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>
      ))}
    </div>
  );
};

export default ServicesPage;
