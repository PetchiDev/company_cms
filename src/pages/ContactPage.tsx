import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin } from 'lucide-react';
import { useSiteContent } from '@/hooks/useCMS';
import { BUDGET_RANGES } from '@/constants/appConstants';
import { contactService } from '@/api/services/contactService';
import type { ContactFormData } from '@/types/contact.types';
import { fadeInUp } from '@/animations/pageTransitions';

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

  return (
    <div>
      <section className="page-hero">
        <div className="page-hero__bg" />
        <div className="container page-hero__content">
          <motion.span className="page-hero__label" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>Get in Touch</motion.span>
          <motion.h1 className="page-hero__title" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>Contact <span className="text-orange">Us</span></motion.h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-cta-grid" style={{ color: 'var(--dark-text)' }}>
            <motion.div variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
              <h2 style={{ marginBottom: '1.5rem' }}>Let's <span className="text-orange">Talk</span></h2>
              <p style={{ color: 'var(--muted-text)', marginBottom: '2rem', lineHeight: 1.7 }}>We'd love to hear about your project. Reach out and let's build something great.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <a href={`tel:${contactInfo.phone}`} className="contact-cta__detail" style={{ color: 'var(--dark-text)' }}><Phone size={20} className="text-orange" />{contactInfo.phone}</a>
                <a href={`mailto:${contactInfo.email}`} className="contact-cta__detail" style={{ color: 'var(--dark-text)' }}><Mail size={20} className="text-orange" />{contactInfo.email}</a>
                <div style={{ marginTop: '1rem' }}>
                  <h4 style={{ marginBottom: '0.5rem' }}>{contactInfo.usOffice.label}</h4>
                  <p style={{ color: 'var(--muted-text)', fontSize: '0.9rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}><MapPin size={18} className="text-orange" style={{ flexShrink: 0, marginTop: 2 }} />{contactInfo.usOffice.address}</p>
                </div>
                <div>
                  <h4 style={{ marginBottom: '0.5rem' }}>{contactInfo.indiaOffice.label}</h4>
                  <p style={{ color: 'var(--muted-text)', fontSize: '0.9rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}><MapPin size={18} className="text-orange" style={{ flexShrink: 0, marginTop: 2 }} />{contactInfo.indiaOffice.address}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  {Object.entries(socialLinks).map(([name, url]) => (
                    url ? (
                      <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="footer__social-link">{name[0].toUpperCase()}</a>
                    ) : null
                  ))}
                </div>
              </div>
            </motion.div>

            <form className="contact-form" onSubmit={handleSubmit} style={{ background: 'var(--bg-light)', padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
              <div className="contact-form__row">
                <input type="text" placeholder="Your Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="contact-form__input" style={{ background: 'white', color: 'var(--dark-text)', border: '1px solid rgba(0,0,0,0.1)' }} />
                <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="contact-form__input" style={{ background: 'white', color: 'var(--dark-text)', border: '1px solid rgba(0,0,0,0.1)' }} />
              </div>
              <div className="contact-form__row">
                <input type="tel" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="contact-form__input" style={{ background: 'white', color: 'var(--dark-text)', border: '1px solid rgba(0,0,0,0.1)' }} />
                <input type="text" placeholder="Company" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="contact-form__input" style={{ background: 'white', color: 'var(--dark-text)', border: '1px solid rgba(0,0,0,0.1)' }} />
              </div>
              <textarea placeholder="Project description" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required className="contact-form__textarea" rows={4} style={{ background: 'white', color: 'var(--dark-text)', border: '1px solid rgba(0,0,0,0.1)' }} />
              <select value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value as ContactFormData['budget'] })} className="contact-form__select" style={{ background: 'white', color: 'var(--dark-text)', border: '1px solid rgba(0,0,0,0.1)' }}>
                {BUDGET_RANGES.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
              <label className="contact-form__checkbox" style={{ color: 'var(--dark-text)' }}>
                <input type="checkbox" checked={formData.wants_nda} onChange={(e) => setFormData({ ...formData, wants_nda: e.target.checked })} />
                I want an NDA to protect my idea
              </label>
              <button type="submit" className="btn btn--orange" style={{ width: '100%' }} disabled={status === 'loading'}>
                {status === 'loading' ? 'Sending...' : status === 'success' ? '✓ Sent!' : 'Send a Request'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
