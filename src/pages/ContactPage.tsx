import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin } from 'lucide-react';
import { useSiteContent } from '@/hooks/useCMS';
import { BUDGET_RANGES } from '@/constants/appConstants';
import { contactService } from '@/api/services/contactService';
import type { ContactFormData } from '@/types/contact.types';
import { fadeInUp, staggerContainer, staggerItem } from '@/animations/pageTransitions';

const ContactPage = () => {
  const { contactInfo, socialLinks } = useSiteContent();
  const [formData, setFormData] = useState<ContactFormData>({
    name: '', email: '', phone: '', company: '', message: '', budget: '$20,000–$50,000', wants_nda: false,
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await contactService.submit(formData);
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', company: '', message: '', budget: '$20,000–$50,000', wants_nda: false });
    } catch { setStatus('error'); }
  };

  const contactItems = [
    { icon: Phone, label: contactInfo.phone, href: `tel:${contactInfo.phone}` },
    { icon: Mail, label: contactInfo.email, href: `mailto:${contactInfo.email}` },
  ];

  return (
    <div>
      <section className="page-hero">
        <div className="page-hero__bg" />
        <div className="floating-shape floating-shape--1" />
        <div className="floating-shape floating-shape--2" />
        <div className="container page-hero__content">
          <motion.span className="page-hero__label" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>Get in Touch</motion.span>
          <motion.h1 className="page-hero__title" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>Contact <span className="text-gradient-animated">Us</span></motion.h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-cta-grid" style={{ color: 'var(--dark-text)' }}>
            <motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }}>
              <motion.h2 variants={staggerItem} style={{ marginBottom: '1.5rem' }}>Let's <span className="text-gradient-animated">Talk</span></motion.h2>
              <motion.p variants={staggerItem} style={{ color: 'var(--muted-text)', marginBottom: '2rem', lineHeight: 1.7 }}>We'd love to hear about your project. Reach out and let's build something great.</motion.p>
              <motion.div variants={staggerItem} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {contactItems.map((item) => (
                  <a key={item.href} href={item.href} className="contact-info-card">
                    <item.icon size={20} className="text-orange" />
                    <span>{item.label}</span>
                  </a>
                ))}
                <div className="contact-office-card">
                  <h4 style={{ marginBottom: '0.5rem' }}>{contactInfo.usOffice.label}</h4>
                  <p style={{ color: 'var(--muted-text)', fontSize: '0.9rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}><MapPin size={18} className="text-orange" style={{ flexShrink: 0, marginTop: 2 }} />{contactInfo.usOffice.address}</p>
                </div>
                <div className="contact-office-card">
                  <h4 style={{ marginBottom: '0.5rem' }}>{contactInfo.indiaOffice.label}</h4>
                  <p style={{ color: 'var(--muted-text)', fontSize: '0.9rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}><MapPin size={18} className="text-orange" style={{ flexShrink: 0, marginTop: 2 }} />{contactInfo.indiaOffice.address}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  {Object.entries(socialLinks).map(([name, url]) => (
                    url ? (
                      <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="footer__social-link">
                        {name[0].toUpperCase()}
                      </a>
                    ) : null
                  ))}
                </div>
              </motion.div>
            </motion.div>

            <motion.form
              className="contact-form contact-form--light-glass"
              onSubmit={handleSubmit}
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <div className="contact-form__row">
                <input type="text" placeholder="Your Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="contact-form__input contact-form__input--light" />
                <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="contact-form__input contact-form__input--light" />
              </div>
              <div className="contact-form__row">
                <input type="tel" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="contact-form__input contact-form__input--light" />
                <input type="text" placeholder="Company" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="contact-form__input contact-form__input--light" />
              </div>
              <textarea placeholder="Project description" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required className="contact-form__textarea contact-form__input--light" rows={4} />
              <select value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value as ContactFormData['budget'] })} className="contact-form__select contact-form__input--light">
                {BUDGET_RANGES.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
              <label className="contact-form__checkbox" style={{ color: 'var(--dark-text)' }}>
                <input type="checkbox" checked={formData.wants_nda} onChange={(e) => setFormData({ ...formData, wants_nda: e.target.checked })} />
                I want an NDA to protect my idea
              </label>
              <button type="submit" className="magnetic-btn magnetic-btn--orange magnetic-btn--md" style={{ width: '100%' }} disabled={status === 'loading'}>
                <span className="magnetic-btn__text">
                  {status === 'loading' ? 'Sending...' : status === 'success' ? '✓ Sent!' : 'Send a Request'}
                </span>
                <span className="magnetic-btn__glow" />
              </button>
            </motion.form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
