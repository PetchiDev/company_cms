import { motion } from 'framer-motion';
import { Target, Eye, Handshake, Lightbulb, Users, Zap } from 'lucide-react';
import { useSiteContent } from '@/hooks/useCMS';
import { staggerContainer, staggerItem, fadeInUp } from '@/animations/pageTransitions';
import './AboutPage.css';

const coreValues = [
  { icon: Target, title: 'Customer Focus', desc: 'Value customers with quality of work.' },
  { icon: Handshake, title: 'Transparency', desc: 'Be the partner of choice by being transparent & ethical.' },
  { icon: Lightbulb, title: 'Innovation', desc: 'Constantly explore new technologies and methodologies.' },
  { icon: Users, title: 'Team Work', desc: 'Value employees for their quality of work.' },
  { icon: Zap, title: 'Agility', desc: 'Adapt quickly to changing business needs.' },
  { icon: Eye, title: 'Fun Place To Work', desc: 'Creating an enjoyable and engaging work environment.' },
];

const approach = [
  { step: '01', title: 'Listen', desc: 'Listen to your concerns, needs, challenges, and goals.' },
  { step: '02', title: 'Understand', desc: 'Understand your business, market sector, and competitors.' },
  { step: '03', title: 'Deliver', desc: 'Combine with technical expertise to deliver optimal, cost-effective solutions.' },
];

const AboutPage = () => {
  const { company } = useSiteContent();

  return (
    <div className="about-page">
      <section className="page-hero">
        <div className="page-hero__bg" />
        <div className="container page-hero__content">
          <motion.span className="page-hero__label" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>Who We Are</motion.span>
          <motion.h1 className="page-hero__title" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>About <span className="text-orange">{company.name}</span></motion.h1>
          <motion.p className="page-hero__subtitle" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>{company.tagline}</motion.p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="about-grid">
            <motion.div className="about-card" variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
              <Eye size={32} className="text-blue" />
              <h3>Our Vision</h3>
              <p>{company.vision}</p>
            </motion.div>
            <motion.div className="about-card" variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
              <Target size={32} className="text-orange" />
              <h3>Our Mission</h3>
              <p>{company.mission}</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section section--light">
      <div className="container">
        <div className="section-heading">
          <span className="section-heading__label">What Drives Us</span>
          <h2 className="section-heading__title">Core <span>Values</span></h2>
        </div>
        <motion.div className="values-grid" variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }}>
          {coreValues.map((val, i) => (
            <motion.div key={i} variants={staggerItem} className="value-card">
              <val.icon size={28} className="value-card__icon" />
              <h4>{val.title}</h4>
              <p>{val.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    <section className="section">
      <div className="container">
        <div className="section-heading">
          <span className="section-heading__label">How We Work</span>
          <h2 className="section-heading__title">Our <span>Approach</span></h2>
        </div>
        <div className="approach-timeline">
          {approach.map((item, i) => (
            <motion.div key={i} className="approach-step" variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
              <div className="approach-step__number">{item.step}</div>
              <div className="approach-step__content">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </div>
);
};

export default AboutPage;
