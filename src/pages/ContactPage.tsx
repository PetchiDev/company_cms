import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin } from 'lucide-react';
import { useSiteContent } from '@/hooks/useCMS';
import MagneticButton from '@/components/ui/MagneticButton/MagneticButton';
import { BUDGET_RANGES } from '@/constants/appConstants';
import { contactService } from '@/api/services/contactService';
import type { ContactFormData } from '@/types/contact.types';

import { useSEO } from '@/hooks/useSEO';
import './ContactPage.css';

const SocialIcon = ({ name }: { name: string }) => {
  const n = name.toLowerCase();
  if (n.includes('linkedin')) return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
  );
  if (n.includes('facebook')) return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
  );
  if (n.includes('instagram')) return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
  );
  if (n.includes('twitter') || n.includes('x')) return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
  );
  return <span>{name[0].toUpperCase()}</span>;
};

const ContactPage = () => {
  const { contactInfo, socialLinks, getText } = useSiteContent();
  const [formData, setFormData] = useState<ContactFormData>({
    name: '', email: '', phone: '', company: '', message: '', budget: '$20,000–$50,000', wants_nda: false,
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useSEO({
    title: 'Contact Us',
    description: 'Get in touch with Kryptos InfoSys. Reach out to us via email, phone, or by submitting a project request directly. We are ready to collaborate!',
    keywords: 'Kryptos InfoSys contact, IT consulting inquiry, software request, get a quote, business collaboration'
  });

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
    <div className="contact-page">
      <section className="page-hero">
        <div className="page-hero__bg" />
        <div className="container page-hero__content">
          <motion.span className="page-hero__label" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {getText('contact_hero_label', 'Get in Touch')}
          </motion.span>
          <motion.h1 className="page-hero__title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {getText('contact_hero_title', 'Contact Us')}
          </motion.h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-cta-grid">
            {/* Left Column: Info */}
            <div className="contact-info-col">
              <h2 className="section-title">{getText('contact_section_title', "Let's Talk")}</h2>
              <p className="section-subtitle" style={{ textAlign: 'left', marginLeft: 0 }}>
                {getText('contact_section_desc', "We'd love to hear about your project. Reach out and let's build something great together.")}
              </p>
              
              <div className="contact-details-list" style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className="contact-detail-item">
                  <div className="contact-detail-icon"><Phone size={22} /></div>
                  <div className="contact-detail-content">
                    <p className="contact-detail-label">Call Us</p>
                    <a href={`tel:${contactInfo.phone}`} className="contact-detail-value">{contactInfo.phone}</a>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-detail-icon"><Mail size={22} /></div>
                  <div className="contact-detail-content">
                    <p className="contact-detail-label">Email Us</p>
                    <a href={`mailto:${contactInfo.email}`} className="contact-detail-value">{contactInfo.email}</a>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-detail-icon"><MapPin size={22} /></div>
                  <div className="contact-detail-content">
                    <p className="contact-detail-label">{contactInfo.usOffice.label}</p>
                    <p className="contact-detail-value" style={{ fontSize: '0.9rem' }}>{contactInfo.usOffice.address}</p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-detail-icon"><MapPin size={22} /></div>
                  <div className="contact-detail-content">
                    <p className="contact-detail-label">{contactInfo.indiaOffice.label}</p>
                    <p className="contact-detail-value" style={{ fontSize: '0.9rem' }}>{contactInfo.indiaOffice.address}</p>
                  </div>
                </div>
              </div>

              <div className="footer__social" style={{ marginTop: '3rem' }}>
                {Object.entries(socialLinks).map(([name, url]) => (
                  url ? (
                    <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="footer__social-link" aria-label={name}>
                      <SocialIcon name={name} />
                    </a>
                  ) : null
                ))}
              </div>
            </div>

            {/* Right Column: Form */}
            <div className="contact-form-col">
              <form className="contact-form contact-form--light-glass" onSubmit={handleSubmit}>
                <div className="contact-form__row">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input type="text" placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="contact-form__input contact-form__input--light" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input type="email" placeholder="john@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="contact-form__input contact-form__input--light" />
                  </div>
                </div>

                <div className="contact-form__row">
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input type="tel" placeholder="+1 (201) 000-0000" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="contact-form__input contact-form__input--light" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Company</label>
                    <input type="text" placeholder="Company Name" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="contact-form__input contact-form__input--light" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Project Details</label>
                  <textarea placeholder="Tell us about your project goals..." value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required className="contact-form__textarea contact-form__input--light" rows={5} />
                </div>

                <div className="form-group">
                  <label className="form-label">Estimated Budget</label>
                  <select value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value as ContactFormData['budget'] })} className="contact-form__select contact-form__input--light">
                    {BUDGET_RANGES.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                <label className="contact-form__checkbox" style={{ color: 'var(--dark-text)', margin: '0.5rem 0 1.5rem' }}>
                  <input type="checkbox" checked={formData.wants_nda} onChange={(e) => setFormData({ ...formData, wants_nda: e.target.checked })} />
                  I want an NDA to protect my idea
                </label>

                <MagneticButton 
                  type="submit" 
                  variant="orange" 
                  size="md" 
                  style={{ width: '100%', height: '54px' }} 
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? 'Sending...' : status === 'success' ? '✓ Message Sent!' : 'Send a Request'}
                </MagneticButton>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
