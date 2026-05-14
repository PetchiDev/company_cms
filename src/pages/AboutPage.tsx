import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Eye, Handshake, Lightbulb, Users, Zap, X } from 'lucide-react';
import { useSiteContent, useTeamImages } from '@/hooks/useCMS';
import { staggerContainer, staggerItem, fadeInUp } from '@/animations/pageTransitions';
import { useTextScramble } from '@/hooks/useTextScramble';
import { useSEO } from '@/hooks/useSEO';
import visionImg from '@/assets/images/vision.png';
import missionImg from '@/assets/images/mission.png';
import './AboutPage.css';

const VALUE_ICONS = [Target, Handshake, Lightbulb, Users, Zap, Eye];

const AboutPage = () => {
  const { company, getText } = useSiteContent();
  const { teamImages } = useTeamImages();
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const scrambledName = useTextScramble({ text: company.name, delay: 500, speed: 40, cycles: 6 });

  const visionImageUrl = getText('about_vision_image', visionImg);
  const missionImageUrl = getText('about_mission_image', missionImg);

  useSEO({
    title: 'About Us',
    description: `Learn more about ${company.name || 'Kryptos InfoSys'}. Our vision is: ${company.vision}. Our mission is: ${company.mission}.`,
    keywords: 'Kryptos InfoSys, about us, corporate values, business vision, corporate mission, IT expertise'
  });

  /* Dynamic core values from CMS */
  const coreValues = [1, 2, 3, 4, 5, 6].map((n, i) => ({
    icon: VALUE_ICONS[i],
    title: getText(`about_value_${n}_title`, ['Customer Focus', 'Transparency', 'Innovation', 'Team Work', 'Agility', 'Fun Place To Work'][i]),
    desc: getText(`about_value_${n}_desc`, ['Value customers with quality of work.', 'Be the partner of choice by being transparent & ethical.', 'Constantly explore new technologies and methodologies.', 'Value employees for their quality of work.', 'Adapt quickly to changing business needs.', 'Creating an enjoyable and engaging work environment.'][i]),
  }));

  /* Dynamic approach steps from CMS */
  const approach = [1, 2, 3].map((n, i) => ({
    step: `0${n}`,
    title: getText(`about_approach_${n}_title`, ['Listen', 'Understand', 'Deliver'][i]),
    desc: getText(`about_approach_${n}_desc`, ['Listen to your concerns, needs, challenges, and goals.', 'Understand your business, market sector, and competitors.', 'Combine with technical expertise to deliver optimal, cost-effective solutions.'][i]),
  }));

  return (
    <div className="about-page">
      <section className="page-hero">
        <div className="page-hero__bg" />
        <div className="floating-shape floating-shape--1" />
        <div className="floating-shape floating-shape--2" />
        <div className="container page-hero__content">
          <motion.span className="page-hero__label" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>{getText('about_hero_label', 'Who We Are')}</motion.span>
          <motion.h1 className="page-hero__title" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            About <span className="text-gradient-animated">{scrambledName}</span>
          </motion.h1>
          <motion.p className="page-hero__subtitle" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>{company.tagline}</motion.p>
        </div>
      </section>

      {/* ═══ VISION & MISSION SECTION ═══ */}
      <section className="section vision-mission-section" style={{ overflow: 'hidden' }}>
        <div className="container">
          {/* Vision Block */}
          <div className="about-row">
            <motion.div
              className="about-image-wrapper"
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <div className="about-image-glow about-image-glow--blue" />
              <img src={visionImageUrl} alt="Kryptos Vision" className="about-premium-image" />
              <div className="about-image-overlay-card">
                <Eye size={20} className="text-blue animate-pulse" />
                <span>{getText('about_vision_badge', 'Future-Focused')}</span>
              </div>
            </motion.div>

            <motion.div
              className="about-text-content"
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            >
              <span className="about-section-subtitle">{getText('about_vision_subtitle', 'Aspiration & Direction')}</span>
              <h2 className="about-section-heading">Our <span>Vision</span></h2>
              <p className="about-section-text">{company.vision}</p>

              <div className="about-pillar-list">
                <div className="about-pillar-item">
                  <span className="pillar-dot pillar-dot--blue" />
                  <div>
                    <h4>{getText('about_vision_pillar1_title', 'Integrated Growth Partnership')}</h4>
                    <p>{getText('about_vision_pillar1_desc', 'Delivering mutual success with a strong emphasis on client trust and transparency.')}</p>
                  </div>
                </div>
                <div className="about-pillar-item">
                  <span className="pillar-dot pillar-dot--blue" />
                  <div>
                    <h4>{getText('about_vision_pillar2_title', 'Ethical & Transparent Standards')}</h4>
                    <p>{getText('about_vision_pillar2_desc', 'Setting the gold standard of partnership by prioritizing corporate ethics and honesty.')}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Mission Block (Alternating Layout) */}
          <div className="about-row about-row--alt">
            <motion.div
              className="about-text-content"
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <span className="about-section-subtitle">{getText('about_mission_subtitle', 'Execution & Deliverables')}</span>
              <h2 className="about-section-heading">Our <span>Mission</span></h2>
              <p className="about-section-text">{company.mission}</p>

              <div className="about-pillar-list">
                <div className="about-pillar-item">
                  <span className="pillar-dot pillar-dot--orange" />
                  <div>
                    <h4>{getText('about_mission_pillar1_title', 'Value with Quality of Work')}</h4>
                    <p>{getText('about_mission_pillar1_desc', 'Creating highly robust application portfolios using top-tier, modern software standards.')}</p>
                  </div>
                </div>
                <div className="about-pillar-item">
                  <span className="pillar-dot pillar-dot--orange" />
                  <div>
                    <h4>{getText('about_mission_pillar2_title', 'Empowering Employee Quality')}</h4>
                    <p>{getText('about_mission_pillar2_desc', 'Fostering an inclusive workspace environment where premium talent can thrive and innovate.')}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="about-image-wrapper"
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            >
              <div className="about-image-glow about-image-glow--orange" />
              <img src={missionImageUrl} alt="Kryptos Mission" className="about-premium-image" />
              <div className="about-image-overlay-card about-image-overlay-card--orange">
                <Target size={20} className="text-orange animate-pulse" />
                <span>{getText('about_mission_badge', 'Action-Oriented')}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section section--light">
        <div className="container">
          <div className="section-heading">
            <span className="section-heading__label">{getText('about_values_label', 'What Drives Us')}</span>
            <h2 className="section-heading__title">{getText('about_values_title', 'Core Values')}</h2>
          </div>
          <motion.div className="values-grid perspective-1000" variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }}>
            {coreValues.map((val, i) => (
              <motion.div key={i} variants={staggerItem} className="value-card">
                <div className="value-card__icon-wrap">
                  <val.icon size={28} className="value-card__icon" />
                </div>
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
            <span className="section-heading__label">{getText('about_approach_label', 'How We Work')}</span>
            <h2 className="section-heading__title">{getText('about_approach_title', 'Our Approach')}</h2>
          </div>
          <div className="approach-timeline">
            {approach.map((item, i) => (
              <motion.div
                key={i}
                className="approach-step"
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                custom={i}
              >
                <div className="approach-step__number">{item.step}</div>
                <div className="approach-step__line" />
                <div className="approach-step__content">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MOMENTS BEYOND WORK SECTION ═══ */}
      {teamImages.length > 0 && (
        <section className="section team-moments-section section--light">
          <div className="container">
            <div className="section-heading">
              <span className="section-heading__label">{getText('about_team_label', 'Moments Beyond Work')}</span>
              <h2 className="section-heading__title">{getText('about_team_title', 'Our Team Culture')}</h2>
              <p className="section-heading__subtitle" style={{ maxWidth: '700px', margin: '1rem auto' }}>
                {getText('about_team_desc', 'At Kryptos, we believe in fostering a vibrant community where our team can thrive both professionally and personally.')}
              </p>
            </div>

            <motion.div
              className="team-gallery"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {teamImages.map((img, index) => (
                <motion.div
                  key={img.id}
                  className={`team-gallery__item team-gallery__item--${(index % 5) + 1}`}
                  variants={staggerItem}
                  whileHover={{ scale: 1.05, rotate: index % 2 === 0 ? 2 : -2 }}
                  onClick={() => setSelectedImg(img.url)}
                >
                  <div className="team-gallery__card">
                    <img src={img.url} alt={img.name} loading="lazy" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══ Lightbox ═══ */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImg(null)}
          >
            <motion.button
              className="lightbox__close"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedImg(null)}
            >
              <X size={32} />
            </motion.button>
            <motion.img
              src={selectedImg}
              alt="Team Moment"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AboutPage;
