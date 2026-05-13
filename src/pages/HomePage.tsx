import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from '@/animations/gsapConfig';
import { ArrowRight, ChevronRight, Download, CheckCircle2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { staggerContainer, staggerItem, fadeInUp } from '@/animations/pageTransitions';
import {
  useSiteContent,
  useStats,
  useCertifications,
  useTestimonials,
  useCaseStudies,
  useBlogArticles,
  useServices,
  useClientLogos,
} from '@/hooks/useCMS';
import { ROUTES } from '@/constants/routes';
import { useSEO } from '@/hooks/useSEO';
import { contactService } from '@/api/services/contactService';
import { BUDGET_RANGES } from '@/constants/appConstants';
import type { ContactFormData } from '@/types/contact.types';
import ParticleField from '@/components/ui/ParticleField/ParticleField';
import AnimatedCounter from '@/components/ui/AnimatedCounter/AnimatedCounter';
import MagneticButton from '@/components/ui/MagneticButton/MagneticButton';
import './HomePage.css';

const HeroScene3D = lazy(() => import('@/components/ui/HeroScene3D/HeroScene3D'));

const HomePage = () => {
  const { company, contactInfo, getText } = useSiteContent();
  const { stats } = useStats();
  const { certifications } = useCertifications();
  const { testimonials } = useTestimonials();
  const { caseStudies } = useCaseStudies();
  const { blogArticles } = useBlogArticles();
  const { clientLogos } = useClientLogos();
  const { serviceCategories } = useServices();

  useSEO({
    title: 'Smart IT Solutions',
    description: 'Kryptos InfoSys - Revolutionizing Business with Smart IT Solutions. Leading provider of Application Modernization, Cloud Consulting, AI/ML, DevOps, and more.',
    keywords: 'Kryptos InfoSys, Smart IT Solutions, cloud consulting, Application Modernization, artificial intelligence, machine learning, DevOps, IT services'
  });

  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const heroScrollProgress = useTransform(scrollY, [0, 800], [0, 1]);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    return heroScrollProgress.onChange(v => setScrollProgress(v));
  }, [heroScrollProgress]);

  /* GSAP Animations */
  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Hero text reveal — split text with 3D perspective */
      gsap.fromTo('.hero__title-line', 
        { opacity: 0, y: 80, rotateX: 15, transformPerspective: 1000 }, 
        { opacity: 1, y: 0, rotateX: 0, duration: 1.2, stagger: 0.2, ease: 'power4.out', delay: 0.3 }
      );
      gsap.fromTo('.hero__subtitle', 
        { opacity: 0, y: 30, filter: 'blur(4px)' }, 
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, delay: 0.9 }
      );

      /* Hero label scramble animation */
      gsap.fromTo('.hero__label',
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.6, delay: 0.1, ease: 'back.out(1.5)' }
      );

      /* Scroll-triggered sections with 3D perspective */
      gsap.utils.toArray<HTMLElement>('.animate-on-scroll').forEach((el) => {
        gsap.fromTo(el, 
          { opacity: 0, y: 50, rotateX: 5, transformPerspective: 1000 }, 
          { 
            opacity: 1, y: 0, rotateX: 0, duration: 0.8, 
            scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' } 
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  /* Marquee animation */
  useEffect(() => {
    if (!marqueeRef.current || clientLogos.length === 0) return;
    const track = marqueeRef.current;
    
    /* Reset position before starting animation */
    gsap.set(track, { x: 0 });
    
    const totalWidth = track.scrollWidth / 2;
    const tween = gsap.to(track, { x: -totalWidth, duration: 20, ease: 'none', repeat: -1 });
    
    const onMouseEnter = () => tween.pause();
    const onMouseLeave = () => tween.resume();
    
    track.addEventListener('mouseenter', onMouseEnter);
    track.addEventListener('mouseleave', onMouseLeave);
    
    return () => {
      track.removeEventListener('mouseenter', onMouseEnter);
      track.removeEventListener('mouseleave', onMouseLeave);
      tween.kill();
    };
  }, [clientLogos]);

  /* Contact form state */
  const [formData, setFormData] = useState<ContactFormData>({
    name: '', email: '', phone: '', company: '', message: '', budget: '$20,000–$50,000', wants_nda: false,
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('loading');
    try {
      await contactService.submit(formData);
      setFormStatus('success');
      setFormData({ name: '', email: '', phone: '', company: '', message: '', budget: '$20,000–$50,000', wants_nda: false });
    } catch {
      setFormStatus('error');
    }
  };

  /* Testimonial state */
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  /* Auto-advance testimonials */
  useEffect(() => {
    if (testimonials.length === 0) return;
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const topServices = serviceCategories.flatMap((c) => c.services).slice(0, 6);

  return (
    <>
      {/* ═══ HERO ═══ */}
      <section className="hero" ref={heroRef} id="hero-section">
        <div className="hero__bg">
          <div className="hero__gradient mesh-gradient" />
          <div className="hero__particles" />
          <div className="hero__floating-shapes">
            <div className="floating-shape floating-shape--1" />
            <div className="floating-shape floating-shape--2" />
            <div className="floating-shape floating-shape--3" />
          </div>
        </div>
        <Suspense fallback={<div className="hero-scene-3d-loader" />}>
          <HeroScene3D scrollProgress={scrollProgress} />
        </Suspense>
        <ParticleField count={40} color="rgba(238,79,41,0.15)" lineColor="rgba(238,79,41,0.05)" interactive={false} />
        <div className="container hero__content">
          <div className="hero__text">
            <p className="hero__label">Welcome to {company.name}</p>
            <h1 className="hero__title">
              <span className="hero__title-line">{getText('hero_title_line1', 'Revolutionizing')}</span>
              <span className="hero__title-line">{getText('hero_title_line2', 'Business with Smart')}</span>
              <span className="hero__title-line"><span className="text-gradient-animated">{getText('hero_title_line3', 'IT Solutions')}</span></span>
            </h1>
            <motion.div className="hero__actions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>
              <MagneticButton to={ROUTES.SERVICES} variant="orange" size="xl">
                Explore Services <ArrowRight size={20} />
              </MagneticButton>
              <MagneticButton to={ROUTES.CONTACT} variant="outline" size="xl">
                Get a Quote <ChevronRight size={20} />
              </MagneticButton>
            </motion.div>
          </div>
        </div>
        <div className="hero__scroll-indicator">
          <div className="hero__scroll-line glow-pulse" />
        </div>
      </section>

      {/* ═══ CLIENT LOGOS MARQUEE ═══ */}
      <section className="clients-section section--light" id="clients-section">
        <div className="container">
          <div className="clients__layout">
            <div className="clients__info">
              <h2 className="clients__heading">
                {getText('clients_heading', 'Elevating Experiences for Our Esteemed Clients')}
              </h2>
              <p className="clients__subheading">
                {getText('clients_subheading', 'Trusted by global industry leaders to deliver excellence and innovation.')}
              </p>
            </div>
            
            <div className="clients__slider">
              <div className="clients__marquee overflow-hidden">
                <div className="clients__track" ref={marqueeRef}>
                  {clientLogos.map((logo, i) => (
                    <div key={i} className="clients__logo-item">
                      <img src={logo.url} alt={logo.name} loading="lazy" />
                    </div>
                  ))}
                  {/* Duplicate for infinite effect */}
                  {clientLogos.map((logo, i) => (
                    <div key={`dup-${i}`} className="clients__logo-item">
                      <img src={logo.url} alt={logo.name} loading="lazy" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SERVICES ═══ */}
      <section className="section" id="services-section">
        <div className="container">
          <div className="section-heading animate-on-scroll">
            <span className="section-heading__label">{getText('services_section_label', 'What We Do')}</span>
            <h2 className="section-heading__title">{getText('services_section_title', 'Our Services')}</h2>
            <p className="section-heading__subtitle">{getText('services_section_subtitle', 'Comprehensive IT solutions to transform your business')}</p>
          </div>
          <motion.div className="services-grid perspective-1000" variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true, margin: '-100px' }}>
            {topServices.map((service) => {
              const IconComponent = (LucideIcons as any)[service.icon] || LucideIcons.Cog;
              return (
                <motion.div key={service.id} variants={staggerItem}>
                  <Link to={`/services/${service.slug}`} className="service-card glass-card--service">
                    <div className="service-card__icon">
                      <IconComponent size={28} />
                    </div>
                    <h3 className="service-card__title">{service.title}</h3>
                    <p className="service-card__desc">{service.shortDescription}</p>
                    <span className="service-card__link">Learn More <ArrowRight size={14} /></span>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
          <div className="text-center animate-on-scroll" style={{ marginTop: '2.5rem' }}>
            <Link to={ROUTES.SERVICES} className="magnetic-btn magnetic-btn--orange magnetic-btn--md">
              <span className="magnetic-btn__text">View All Services <ArrowRight size={18} /></span>
              <span className="magnetic-btn__glow" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      {stats.length > 0 && (
        <section className="stats-section section--dark" ref={statsRef} id="stats-section">
          <ParticleField count={30} color="rgba(238,79,41,0.25)" lineColor="rgba(238,79,41,0.06)" interactive={false} />
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            {getText('stats_section_active', 'true') === 'true' && getText('stats_section_title', 'IT excellence in the | USA and India').trim() !== '' && (
              <div className="stats-heading text-center" style={{ marginBottom: '3rem' }}>
                <h2 className="stats-heading__title" style={{ 
                  color: 'white', 
                  fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', 
                  fontWeight: 800,
                  letterSpacing: '0.5px',
                  fontFamily: "'Outfit', sans-serif",
                  textAlign: 'center'
                }}>
                  {(() => {
                    const titleText = getText('stats_section_title', 'IT excellence in the | USA and India');
                    const parts = titleText.split('|').map(p => p.trim());
                    if (parts.length > 1) {
                      return (
                        <>
                          {parts[0]}{' '}
                          <span style={{ background: 'linear-gradient(135deg, var(--primary-orange) 0%, #ff8c42 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            {parts[1]}
                          </span>
                        </>
                      );
                    }
                    return titleText;
                  })()}
                </h2>
                <div style={{ width: '60px', height: '3px', background: 'var(--primary-orange)', margin: '1rem auto 0', borderRadius: 'var(--radius-full)' }} />
              </div>
            )}

            <div className="stats-grid">
              {stats.map((stat, i) => (
                <div key={i} className="stat glass-stat">
                  <AnimatedCounter
                    target={stat.value}
                    suffix={stat.suffix}
                    formatLakh={stat.value >= 1000}
                    className="stat__counter"
                  />
                  <p className="stat__label">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="section" id="testimonials-section">
        <div className="container">
          <div className="section-heading animate-on-scroll">
            <span className="section-heading__label">{getText('testimonials_section_label', 'Testimonials')}</span>
            <h2 className="section-heading__title">{getText('testimonials_section_title', 'What Our Clients Say')}</h2>
          </div>
          {testimonials.length > 0 && (
            <motion.div className="testimonials" variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
              <div className="testimonial-card perspective-1000">
                <div className="testimonial-card__quote-mark">"</div>
                <div className="testimonial-card__quote">
                  {testimonials[activeTestimonial % testimonials.length]?.quote || ''}
                </div>
                <div className="testimonial-card__author">
                  <img
                    src={testimonials[activeTestimonial % testimonials.length]?.logo || ''}
                    alt={testimonials[activeTestimonial % testimonials.length]?.company || ''}
                    className="testimonial-card__logo"
                    loading="lazy"
                  />
                  <div>
                    <p className="testimonial-card__name">
                      {testimonials[activeTestimonial % testimonials.length]?.clientName || ''}
                    </p>
                    <p className="testimonial-card__company">
                      {testimonials[activeTestimonial % testimonials.length]?.clientTitle && `${testimonials[activeTestimonial % testimonials.length]?.clientTitle}, `}
                      {testimonials[activeTestimonial % testimonials.length]?.company || ''}
                    </p>
                  </div>
                </div>
              </div>
              <div className="testimonials__dots">
                {testimonials.map((_, i) => (
                  <button key={i} className={`testimonials__dot ${i === activeTestimonial ? 'testimonials__dot--active' : ''}`} onClick={() => setActiveTestimonial(i)} aria-label={`Testimonial ${i + 1}`} />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ═══ CASE STUDIES ═══ */}
      <section className="section section--light" id="case-studies-section">
        <div className="container">
          <div className="section-heading animate-on-scroll">
            <span className="section-heading__label">{getText('casestudies_section_label', 'Our Work')}</span>
            <h2 className="section-heading__title">{getText('casestudies_section_title', 'Case Studies')}</h2>
          </div>
          <motion.div className="case-studies-grid perspective-1000" variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }}>
            {caseStudies.slice(0, 3).map((cs) => (
              <motion.div key={cs.id} variants={staggerItem} className="case-study-card">
                <div className="case-study-card__img">
                  <img src={cs.thumbnail} alt={cs.title} loading="lazy" />
                  <span className="case-study-card__category glow-pulse">{cs.category}</span>
                </div>
                <div className="case-study-card__body">
                  <h3 className="case-study-card__title">{cs.title}</h3>
                  <p className="case-study-card__desc">{cs.description}</p>
                  {cs.pdfLink && (
                    <a href={cs.pdfLink} target="_blank" rel="noopener noreferrer" className="case-study-card__download">
                      <Download size={14} /> Download PDF
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
          <div className="text-center animate-on-scroll" style={{ marginTop: '2.5rem' }}>
            <Link to={ROUTES.CASE_STUDIES} className="magnetic-btn magnetic-btn--primary magnetic-btn--md">
              <span className="magnetic-btn__text">View All Case Studies <ArrowRight size={18} /></span>
              <span className="magnetic-btn__glow" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ CERTIFICATIONS & CAREERS DUAL SECTION ═══ */}
      <section className="section section--light dual-grid-section" id="credentials-section">
        <div className="container">
          <div className="dual-grid">
            {/* Left Card: Certifications */}
            <motion.div 
              className="dual-card dual-card--dark animate-on-scroll"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="dual-card__content">
                <span className="dual-card__label">Certifications</span>
                <h2 className="dual-card__title">Certifications that Validate Excellence</h2>
                <div className="dual-card__badges">
                  {certifications.slice(0, 3).map((cert, i) => (
                    <div key={i} className="mini-badge-glass">
                      <img src={cert.url} alt={cert.name} />
                    </div>
                  ))}
                </div>
                <Link to={ROUTES.CERTIFICATES} className="magnetic-btn magnetic-btn--orange magnetic-btn--md">
                  <span className="magnetic-btn__text">View Certifications</span>
                  <span className="magnetic-btn__glow" />
                </Link>
              </div>
              <div className="dual-card__bg-pattern" />
            </motion.div>

            {/* Right Card: Careers */}
            <motion.div 
              className="dual-card dual-card--white animate-on-scroll"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="dual-card__content">
                <span className="dual-card__label">Careers</span>
                <h2 className="dual-card__title">Create a great career and grow your future with Kryptos</h2>
                <div className="dual-card__image-box">
                  <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" alt="Team working" className="dual-card__main-img" />
                  <div className="dual-card__floating-box glow-pulse">
                    <span className="text-orange font-bold">Join Us</span>
                  </div>
                </div>
                <a href={getText('job_portal_url', '#')} target="_blank" rel="noopener noreferrer" className="magnetic-btn magnetic-btn--primary magnetic-btn--md">
                  <span className="magnetic-btn__text">View Openings</span>
                  <span className="magnetic-btn__glow" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ BLOG SECTION ═══ */}
      <section className="section blog-section" id="blog-section">
        <div className="container">
          <div className="section-heading animate-on-scroll">
            <span className="section-heading__label">{getText('blog_section_label', 'Insights')}</span>
            <h2 className="section-heading__title">{getText('blog_section_title', 'Latest from our Blog')}</h2>
            <p className="section-heading__subtitle">{getText('blog_section_subtitle', 'Expert perspectives on the future of technology')}</p>
          </div>
          <div className="blog-home-grid">
            {blogArticles.slice(0, 3).map((article) => (
              <motion.div 
                key={article.id} 
                className="blog-home-card glass-card--service"
                whileHover={{ y: -10 }}
              >
                <div className="blog-home-card__img">
                  <img src={article.image} alt={article.title} />
                  <div className="blog-home-card__date">
                    {new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <div className="blog-home-card__body">
                  <h3 className="blog-home-card__title">{article.title}</h3>
                  <p className="blog-home-card__excerpt">{article.excerpt}</p>
                  <Link to={article.link} className="blog-home-card__link">
                    Read More <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="blog-section__actions animate-on-scroll">
            <Link to={ROUTES.BLOG} className="magnetic-btn magnetic-btn--outline magnetic-btn--md">
              <span className="magnetic-btn__text">View All Articles</span>
              <span className="magnetic-btn__glow" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ CONTACT CTA ═══ */}
      <section className="section section--dark contact-cta-section" id="contact-cta-section">
        <ParticleField count={25} color="rgba(238,79,41,0.2)" lineColor="rgba(238,79,41,0.04)" interactive={false} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="contact-cta-grid">
            <div className="contact-cta__info animate-on-scroll">
              <span className="section-heading__label">{getText('contact_cta_label', 'Get Started')}</span>
              <h2 style={{ color: 'white', fontSize: 'clamp(2rem,4vw,2.5rem)', marginBottom: '1rem' }}>
                {getText('contact_cta_title', "Let's Build Something Great Together")}
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2rem', lineHeight: 1.7 }}>
                {getText('contact_cta_desc', "Have a project in mind? We'd love to hear about it. Drop us a message and we'll get back to you as soon as possible.")}
              </p>
              <div className="contact-cta__details">
                <div className="contact-cta__detail">
                  <CheckCircle2 size={20} className="text-orange" />
                  <span>Phone: {contactInfo.phone}</span>
                </div>
                <div className="contact-cta__detail">
                  <CheckCircle2 size={20} className="text-orange" />
                  <span>Email: {contactInfo.email}</span>
                </div>
              </div>
            </div>
            <form className="contact-form contact-form--glass animate-on-scroll" onSubmit={handleFormSubmit}>
              <div className="contact-form__row">
                <input type="text" placeholder="Your Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="contact-form__input" />
                <input type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="contact-form__input" />
              </div>
              <div className="contact-form__row">
                <input type="tel" placeholder="Phone Number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="contact-form__input" />
                <input type="text" placeholder="Company Name" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="contact-form__input" />
              </div>
              <textarea placeholder="Describe your project briefly" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required className="contact-form__textarea" rows={4} />
              <select value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value as ContactFormData['budget'] })} className="contact-form__select">
                {BUDGET_RANGES.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
              <label className="contact-form__checkbox">
                <input type="checkbox" checked={formData.wants_nda} onChange={(e) => setFormData({ ...formData, wants_nda: e.target.checked })} />
                <span>I want an NDA to protect my idea</span>
              </label>
              <button type="submit" className="magnetic-btn magnetic-btn--orange magnetic-btn--md" style={{ width: '100%' }} disabled={formStatus === 'loading'}>
                <span className="magnetic-btn__text">
                  {formStatus === 'loading' ? 'Sending...' : formStatus === 'success' ? '✓ Sent Successfully!' : 'Send a Request'}
                </span>
                <span className="magnetic-btn__glow" />
              </button>
              {formStatus === 'error' && <p style={{ color: '#ff6b6b', fontSize: '0.85rem', marginTop: '0.5rem' }}>Something went wrong. Please try again.</p>}
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
