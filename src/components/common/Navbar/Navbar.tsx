import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Phone, User, Shield, Briefcase } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useSiteContent, useServices, useSiteLogo } from '@/hooks/useCMS';
import { mobileMenuVariants, dropdownVariants } from '@/animations/pageTransitions';
import './Navbar.css';

const Navbar = () => {
  const { logo } = useSiteLogo();
  const { company } = useSiteContent();
  const { serviceCategories } = useServices();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const isMobile = useMediaQuery('DESKTOP');
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.navbar__profile-container')) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  /* Close mobile menu on route change */
  useEffect(() => {
    setIsMobileOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  const toggleDropdown = useCallback((name: string) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  }, []);

  const navLinks = [
    { label: 'Home', path: ROUTES.HOME },
    { label: 'Business & Services', path: ROUTES.SERVICES, hasDropdown: true, dropdownId: 'services' },
    { label: 'About Us', path: ROUTES.ABOUT },
    { label: 'Careers', path: ROUTES.CAREERS },
    { label: 'Blog', path: ROUTES.BLOG },
    { label: 'Case Studies', path: ROUTES.CASE_STUDIES },
  ];

  return (
    <header className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`} id="main-navbar">
      <div className="navbar__container container">
        {/* Logo */}
        <Link to={ROUTES.HOME} className="navbar__logo" aria-label="Kryptos InfoSys Home">
          <img
            src={logo || undefined}
            alt={company.name}
            className="navbar__logo-img"
            loading="eager"
          />
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && (
          <nav className="navbar__nav" aria-label="Main navigation">
            <ul className="navbar__list">
              {navLinks.map((link) => (
                <li
                  key={link.path}
                  className="navbar__item"
                  onMouseEnter={() => link.hasDropdown && setActiveDropdown(link.dropdownId!)}
                  onMouseLeave={() => link.hasDropdown && setActiveDropdown(null)}
                >
                  {link.hasDropdown ? (
                    <>
                      <Link
                        to={link.path}
                        className={`navbar__link ${location.pathname.startsWith('/services') ? 'navbar__link--active' : ''}`}
                      >
                        {link.label}
                        <ChevronDown size={14} className="navbar__chevron" />
                      </Link>

                      <AnimatePresence>
                        {activeDropdown === link.dropdownId && (
                          <motion.div
                            className="navbar__mega-menu"
                            variants={dropdownVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                          >
                            <div className="mega-menu__grid">
                              {serviceCategories.map((cat) => (
                                <div key={cat.id} className="mega-menu__category">
                                  <h4 className="mega-menu__category-title">{cat.title}</h4>
                                  <ul className="mega-menu__list">
                                    {cat.services.map((service) => (
                                      <li key={service.id}>
                                        <Link
                                          to={`/services/${service.slug}`}
                                          className="mega-menu__link"
                                        >
                                          {service.title}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      to={link.path}
                      className={`navbar__link ${location.pathname === link.path ? 'navbar__link--active' : ''}`}
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* CTA + Mobile Toggle */}
        <div className="navbar__actions">
          <Link to={ROUTES.CONTACT} className="navbar__cta-btn">
            <Phone size={16} />
            Contact Us
          </Link>

          <div className="navbar__profile-container">
            <button 
              className={`navbar__profile-trigger ${isProfileOpen ? 'navbar__profile-trigger--active' : ''}`}
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              aria-label="User account"
            >
              <User size={20} />
            </button>
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div 
                  className="navbar__profile-dropdown"
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <button 
                    onClick={() => window.location.href = window.location.origin + '/login'} 
                    className="profile-dropdown__item"
                  >
                    <div className="profile-dropdown__icon profile-dropdown__icon--admin">
                      <Shield size={16} />
                    </div>
                    <div className="profile-dropdown__text">
                      <p>Login as Admin</p>
                      <span>Manage site content</span>
                    </div>
                  </button>
                  <button 
                    onClick={() => window.location.href = 'https://hitayu.live/en/login'} 
                    className="profile-dropdown__item"
                  >
                    <div className="profile-dropdown__icon profile-dropdown__icon--employee">
                      <Briefcase size={16} />
                    </div>
                    <div className="profile-dropdown__text">
                      <p>Login as Employee</p>
                      <span>Employee portal</span>
                    </div>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {isMobile && (
            <button
              className="navbar__toggle"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileOpen}
            >
              {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobile && isMobileOpen && (
          <motion.div
            className="navbar__mobile"
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <nav className="navbar__mobile-nav" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <div key={link.path} className="navbar__mobile-item">
                  {link.hasDropdown ? (
                    <>
                      <button
                        className="navbar__mobile-link navbar__mobile-link--dropdown"
                        onClick={() => toggleDropdown(link.dropdownId!)}
                      >
                        {link.label}
                        <ChevronDown
                          size={16}
                          className={`navbar__chevron ${activeDropdown === link.dropdownId ? 'navbar__chevron--open' : ''}`}
                        />
                      </button>

                      <AnimatePresence>
                        {activeDropdown === link.dropdownId && (
                          <motion.div
                            className="navbar__mobile-dropdown"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            {serviceCategories.map((cat) => (
                              <div key={cat.id} className="navbar__mobile-category">
                                <p className="navbar__mobile-category-title">{cat.title}</p>
                                {cat.services.map((service) => (
                                  <Link
                                    key={service.id}
                                    to={`/services/${service.slug}`}
                                    className="navbar__mobile-sublink"
                                  >
                                    {service.title}
                                  </Link>
                                ))}
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link to={link.path} className="navbar__mobile-link">
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
