import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowUp } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useState } from 'react';
import { useSiteContent, useServices, useSiteLogo } from '@/hooks/useCMS';
import { newsletterService } from '@/api/services/newsletterService';
import './Footer.css';

const SocialIcon = ({ name }: { name: string }) => {
  const icons: Record<string, string> = {
    linkedin: 'in',
    facebook: 'f',
    instagram: 'ig',
    twitter: '𝕏',
  };
  return <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{icons[name] || name[0]}</span>;
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

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

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
              <img src={logo} alt={company.name} className="footer__logo" loading="lazy" />
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
                <a href={`tel:${contactInfo.phone}`} className="footer__contact-item"><Phone size={16} /><span>{contactInfo.phone}</span></a>
                <a href={`mailto:${contactInfo.email}`} className="footer__contact-item"><Mail size={16} /><span>{contactInfo.email}</span></a>
                <div className="footer__contact-item"><MapPin size={16} /><span>{contactInfo.usOffice.address}</span></div>
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

      <button className="footer__scroll-top" onClick={scrollToTop} aria-label="Scroll to top"><ArrowUp size={20} /></button>
    </footer>
  );
};

export default Footer;
