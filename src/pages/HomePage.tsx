import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from '@/animations/gsapConfig';
import { ArrowRight, ChevronRight, Download, CheckCircle2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { staggerContainer, staggerItem, fadeInUp } from '@/animations/pageTransitions';
import { useClientLogos } from '@/hooks/useClientLogos';
import { useSiteContent, useStats, useCertifications, useTestimonials, useCaseStudies, useServices } from '@/hooks/useCMS';
import { ROUTES } from '@/constants/routes';
import { contactService } from '@/api/services/contactService';
import { BUDGET_RANGES } from '@/constants/appConstants';
import { useState } from 'react';
import type { ContactFormData } from '@/types/contact.types';
import './HomePage.css';

const HomePage = () => {
  const { clientLogos } = useClientLogos();
  const { company, contactInfo } = useSiteContent();
  const { stats } = useStats();
  const { certifications } = useCertifications();
  const { testimonials } = useTestimonials();
  const { caseStudies } = useCaseStudies();
  const { serviceCategories } = useServices();

  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  /* GSAP Animations */
  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Hero text reveal */
      gsap.fromTo('.hero__title-line', { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: 'power3.out', delay: 0.3 });
      gsap.fromTo('.hero__subtitle', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.9 });
      gsap.fromTo('.hero__actions', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, delay: 1.1 });

      /* Stats counter */
      const counters = document.querySelectorAll('.stat__number');
      counters.forEach((counter) => {
        const target = parseInt(counter.getAttribute('data-target') || '0', 10);
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2.5,
          ease: 'power2.out',
          scrollTrigger: { trigger: statsRef.current, start: 'top 80%', toggleActions: 'play none none none' },
          onUpdate: () => {
            if (target >= 1000) {
              counter.textContent = (obj.val / 100000).toFixed(1);
            } else {
              counter.textContent = Math.round(obj.val).toString();
            }
          },
        });
      });

      /* Scroll-triggered sections */
      gsap.utils.toArray<HTMLElement>('.animate-on-scroll').forEach((el) => {
        gsap.fromTo(el, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' } });
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

  const topServices = serviceCategories.flatMap((c) => c.services).slice(0, 6);

  return (
    <>
      {/* ═══ HERO ═══ */}
      <section className="hero" ref={heroRef} id="hero-section">
        <div className="hero__bg">
          <div className="hero__gradient" />
          <div className="hero__particles" />
        </div>
        <div className="container hero__content">
          <div className="hero__text">
            <p className="hero__label">Welcome to {company.name}</p>
            <h1 className="hero__title">
              <span className="hero__title-line">Revolutionizing</span>
              <span className="hero__title-line">Business with <span className="text-orange">Smart</span></span>
              <span className="hero__title-line"><span className="text-orange">IT Solutions</span></span>
            </h1>
            <p className="hero__subtitle">{company.vision}</p>
            <div className="hero__actions">
              <Link to={ROUTES.SERVICES} className="btn btn--primary">
                Explore Services <ArrowRight size={18} />
              </Link>
              <Link to={ROUTES.CONTACT} className="btn btn--outline">
                Get a Quote <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </div>
        <div className="hero__scroll-indicator">
          <div className="hero__scroll-line" />
        </div>
      </section>

      {/* ═══ CLIENT LOGOS MARQUEE ═══ */}
      <section className="clients-section section--light" id="clients-section">
        <div className="container">
          <p className="clients__label">Trusted by leading companies worldwide</p>
        </div>
        <div className="clients__marquee overflow-hidden">
          <div className="clients__track" ref={marqueeRef}>
            {[...clientLogos, ...clientLogos].map((logo, i) => (
              <div key={i} className="clients__logo-item">
                <img src={logo.url} alt={logo.name} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SERVICES ═══ */}
      <section className="section" id="services-section">
        <div className="container">
          <div className="section-heading animate-on-scroll">
            <span className="section-heading__label">What We Do</span>
            <h2 className="section-heading__title">Our <span>Services</span></h2>
            <p className="section-heading__subtitle">Comprehensive IT solutions to transform your business</p>
          </div>
          <motion.div className="services-grid" variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true, margin: '-100px' }}>
            {topServices.map((service) => {
              const IconComponent = (LucideIcons as any)[service.icon] || LucideIcons.Cog;
              return (
                <motion.div key={service.id} variants={staggerItem}>
                  <Link to={`/services/${service.slug}`} className="service-card">
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
            <Link to={ROUTES.SERVICES} className="btn btn--orange">View All Services <ArrowRight size={18} /></Link>
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="stats-section section--dark" ref={statsRef} id="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, i) => (
              <div key={i} className="stat">
                <div className="stat__number" data-target={stat.value}>0</div>
                <div className="stat__suffix">{stat.suffix}</div>
                <p className="stat__label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="section" id="testimonials-section">
        <div className="container">
          <div className="section-heading animate-on-scroll">
            <span className="section-heading__label">Testimonials</span>
            <h2 className="section-heading__title">What Our <span>Clients</span> Say</h2>
          </div>
          {testimonials.length > 0 && (
            <motion.div className="testimonials" variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
              <div className="testimonial-card">
                <div className="testimonial-card__quote">
                  "{testimonials[activeTestimonial % testimonials.length]?.quote || ''}"
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
            <span className="section-heading__label">Our Work</span>
            <h2 className="section-heading__title">Case <span>Studies</span></h2>
          </div>
          <motion.div className="case-studies-grid" variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }}>
            {caseStudies.slice(0, 3).map((cs) => (
              <motion.div key={cs.id} variants={staggerItem} className="case-study-card">
                <div className="case-study-card__img">
                  <img src={cs.thumbnail} alt={cs.title} loading="lazy" />
                  <span className="case-study-card__category">{cs.category}</span>
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
            <Link to={ROUTES.CASE_STUDIES} className="btn btn--primary">View All Case Studies <ArrowRight size={18} /></Link>
          </div>
        </div>
      </section>

      {/* ═══ CERTIFICATIONS ═══ */}
      <section className="section" id="certifications-section">
        <div className="container">
          <div className="section-heading animate-on-scroll">
            <span className="section-heading__label">Certifications</span>
            <h2 className="section-heading__title">Our <span>Credentials</span></h2>
          </div>
          <div className="certifications-grid animate-on-scroll">
            {certifications.map((cert, i) => (
              <div key={i} className="certification-badge">
                <img src={cert.url} alt={cert.name} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CONTACT CTA ═══ */}
      <section className="section section--dark" id="contact-cta-section">
        <div className="container">
          <div className="contact-cta-grid">
            <div className="contact-cta__info animate-on-scroll">
              <span className="section-heading__label">Get Started</span>
              <h2 style={{ color: 'white', fontSize: 'clamp(2rem,4vw,2.5rem)', marginBottom: '1rem' }}>
                Let's Build Something <span className="text-orange">Great Together</span>
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2rem', lineHeight: 1.7 }}>
                Have a project in mind? We'd love to hear about it. Drop us a message and we'll get back to you as soon as possible.
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
            <form className="contact-form animate-on-scroll" onSubmit={handleFormSubmit}>
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
              <button type="submit" className="btn btn--orange" style={{ width: '100%' }} disabled={formStatus === 'loading'}>
                {formStatus === 'loading' ? 'Sending...' : formStatus === 'success' ? '✓ Sent Successfully!' : 'Send a Request'}
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
