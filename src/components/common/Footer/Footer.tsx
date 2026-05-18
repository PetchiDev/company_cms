import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useState } from 'react';
import { useSiteContent, useServices, useSiteLogo } from '@/hooks/useCMS';
import { newsletterService } from '@/api/services/newsletterService';
import './Footer.css';

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

const Footer = () => {
  const { logo } = useSiteLogo();
  const { company, contactInfo, socialLinks } = useSiteContent();
  const { serviceCategories } = useServices();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await newsletterService.subscribe(email);
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    } catch (err) {
      console.error('Newsletter signup failed:', err);
    }
  };


  return (
    <footer className="footer" id="site-footer">
      <div className="footer__cta">
        <div className="container">
          <div className="footer__cta-content">
            <div className="footer__cta-text">
              <h3>Start your journey to better business</h3>
              <p>Subscribe to our newsletter for insights and updates.</p>
            </div>
            <form className="footer__newsletter" onSubmit={handleNewsletter}>
              <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="footer__newsletter-input" required aria-label="Email for newsletter" />
              <button type="submit" className="footer__newsletter-btn" disabled={subscribed}>{subscribed ? '✓ Subscribed!' : 'Send'}</button>
            </form>
          </div>
        </div>
      </div>

      <div className="footer__main">
        <div className="container">
          <div className="footer__grid">
            <div className="footer__col">
              <img src={logo || undefined} alt={company.name} className="footer__logo" loading="lazy" />
              <p className="footer__tagline">{company.motto}</p>
              <div className="footer__social">
                {Object.entries(socialLinks).map(([name, url]) => (
                  url ? (
                    <a key={name} href={url} target="_blank" rel="noopener noreferrer" aria-label={name} className="footer__social-link">
                      <SocialIcon name={name} />
                    </a>
                  ) : null
                ))}
              </div>
            </div>
            <div className="footer__col">
              <h4 className="footer__col-title">Solutions</h4>
              <ul className="footer__links">
                {serviceCategories.slice(0, 3).flatMap((cat) => cat.services.slice(0, 2).map((s) => (
                  <li key={s.id}><Link to={`/services/${s.slug}`} className="footer__link">{s.title}</Link></li>
                )))}
              </ul>
            </div>
            <div className="footer__col">
              <h4 className="footer__col-title">Company</h4>
              <ul className="footer__links">
                <li><Link to={ROUTES.ABOUT} className="footer__link">About Us</Link></li>
                <li><Link to={ROUTES.CAREERS} className="footer__link">Careers</Link></li>
                <li><Link to={ROUTES.CONTACT} className="footer__link">Contact Us</Link></li>
                <li><Link to={ROUTES.CASE_STUDIES} className="footer__link">Case Studies</Link></li>
                <li><Link to={ROUTES.BLOG} className="footer__link">Blog</Link></li>
              </ul>
            </div>
            <div className="footer__col">
              <h4 className="footer__col-title">Get in Touch</h4>
              <div className="footer__contact-info">
                <a href={`tel:${contactInfo.phone}`} className="footer__contact-item">
                  <Phone size={16} />
                  <span>{contactInfo.phone}</span>
                </a>
                <a href={`mailto:${contactInfo.email}`} className="footer__contact-item">
                  <Mail size={16} />
                  <span>{contactInfo.email}</span>
                </a>
                
                <div className="footer__office-group">
                  <div className="footer__contact-item">
                    <MapPin size={16} />
                    <strong>{contactInfo.usOffice.label}:</strong>
                  </div>
                  <div className="footer__office-address">{contactInfo.usOffice.address}</div>
                </div>

                <div className="footer__office-group">
                  <div className="footer__contact-item">
                    <MapPin size={16} />
                    <strong>{contactInfo.indiaOffice.label}:</strong>
                  </div>
                  <div className="footer__office-address">{contactInfo.indiaOffice.address}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-content">
          <p>{company.copyright}. All rights reserved.</p>
          <div className="footer__legal">
            <a href="#" className="footer__legal-link">Terms & Conditions</a>
            <a href="#" className="footer__legal-link">Privacy Policy</a>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
