import { useLocation } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

import SiteContentManager from '@/features/admin/components/SiteContentManager';
import ServicesManager from '@/features/admin/components/ServicesManager';
import BlogManager from '@/features/admin/components/BlogManager';
import CaseStudyManager from '@/features/admin/components/CaseStudyManager';
import TestimonialManager from '@/features/admin/components/TestimonialManager';
import StatsManager from '@/features/admin/components/StatsManager';
import CertificationManager from '@/features/admin/components/CertificationManager';
import CultureManager from '@/features/admin/components/CultureManager';
import ImageManager from '@/features/admin/components/ImageManager';
import ContactManager from '@/features/admin/components/ContactManager';
import Dashboard from '@/features/admin/components/Dashboard';

import './AdminPage.css';

const AdminPage = () => {
  const location = useLocation();
  const path = location.pathname;

  if (path === ROUTES.ADMIN) return <Dashboard />;
  if (path.includes('content')) return <SiteContentManager />;
  if (path.includes('services')) return <ServicesManager />;
  if (path.includes('blog')) return <BlogManager />;
  if (path.includes('case-studies')) return <CaseStudyManager />;
  if (path.includes('testimonials')) return <TestimonialManager />;
  if (path.includes('stats')) return <StatsManager />;
  if (path.includes('certs')) return <CertificationManager />;
  if (path.includes('culture')) return <CultureManager />;
  if (path.includes('images')) return <ImageManager />;
  if (path.includes('contacts')) return <ContactManager />;
  
  return <Dashboard />;
};

export default AdminPage;
