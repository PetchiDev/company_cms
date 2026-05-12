import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useServices } from '@/hooks/useCMS';
import { ROUTES } from '@/constants/routes';
import { fadeInUp, staggerContainer, staggerItem } from '@/animations/pageTransitions';
import './ServicesPage.css';

const ServiceDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { serviceCategories } = useServices();
  const service = serviceCategories
    .flatMap((c) => c.services)
    .find((s) => s.slug === slug);

  if (!service) {
    return (
      <div className="section flex-center" style={{ minHeight: '60vh', flexDirection: 'column', gap: '1rem' }}>
        <h2>Service Not Found</h2>
        <Link to={ROUTES.SERVICES} className="magnetic-btn magnetic-btn--primary magnetic-btn--md">
          <span className="magnetic-btn__text"><ArrowLeft size={16} /> Back to Services</span>
          <span className="magnetic-btn__glow" />
        </Link>
      </div>
    );
  }

  const IconComponent = (LucideIcons as any)[service.icon] || LucideIcons.Cog;

  return (
    <div className="service-detail-page">
      <section className="page-hero">
        <div className="page-hero__bg" />
        <div className="floating-shape floating-shape--1" />
        <div className="floating-shape floating-shape--2" />
        <div className="container page-hero__content">
          <Link to={ROUTES.SERVICES} className="page-hero__back"><ArrowLeft size={16} /> All Services</Link>
          <motion.div className="service-detail__icon-large" initial={{ scale: 0, rotateY: -180 }} animate={{ scale: 1, rotateY: 0 }} transition={{ type: 'spring', delay: 0.2, duration: 0.8 }}>
            <IconComponent size={48} />
          </motion.div>
          <motion.h1 className="page-hero__title" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>{service.title}</motion.h1>
          <motion.p className="page-hero__subtitle" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>{service.fullDescription}</motion.p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <motion.div className="service-detail__features" variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }}>
            <h2 className="section-heading__title" style={{ marginBottom: '2rem' }}>Key <span>Features</span></h2>
            <div className="service-detail__features-grid">
              {service.features.map((feature, i) => (
                <motion.div key={i} variants={staggerItem} className="feature-item">
                  <CheckCircle2 size={20} className="text-orange" />
                  <span>{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {service.technologies && service.technologies.length > 0 && (
            <motion.div className="service-detail__tech" variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true }} style={{ marginTop: '3rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Technologies We Use</h3>
              <div className="tech-tags">
                {service.technologies.map((tech, i) => (
                  <span key={i} className="tech-tag">{tech}</span>
                ))}
              </div>
            </motion.div>
          )}

          <div className="text-center" style={{ marginTop: '3rem' }}>
            <Link to={ROUTES.CONTACT} className="magnetic-btn magnetic-btn--primary magnetic-btn--md">
              <span className="magnetic-btn__text">Get Started with {service.title}</span>
              <span className="magnetic-btn__glow" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetailPage;
