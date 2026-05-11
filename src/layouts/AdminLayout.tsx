import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ROUTES } from '@/constants/routes';
import {
  Images,
  MessageSquare,
  LayoutDashboard,
  LogOut,
  ArrowLeft,
  Globe,
  BarChart,
  Award,
  Quote,
  Briefcase,
  FileText,
  Settings,
  Heart,
} from 'lucide-react';
import './AdminLayout.css';

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: ROUTES.ADMIN, icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: ROUTES.ADMIN_CONTENT, icon: Globe, label: 'Site Content' },
    { path: ROUTES.ADMIN_SERVICES, icon: Settings, label: 'Expertise & Services' },
    { path: ROUTES.ADMIN_BLOG, icon: FileText, label: 'Blog Articles' },
    { path: ROUTES.ADMIN_CASE_STUDIES, icon: Briefcase, label: 'Case Studies' },
    { path: ROUTES.ADMIN_TESTIMONIALS, icon: Quote, label: 'Testimonials' },
    { path: ROUTES.ADMIN_STATS, icon: BarChart, label: 'Homepage Stats' },
    { path: ROUTES.ADMIN_CERTS, icon: Award, label: 'Certifications' },
    { path: ROUTES.ADMIN_CULTURE, icon: Heart, label: 'Careers Culture' },
    { path: ROUTES.ADMIN_IMAGES, icon: Images, label: 'Image Manager' },
    { path: ROUTES.ADMIN_CONTACTS, icon: MessageSquare, label: 'Contact Submissions' },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__header">
          <h2 className="admin-sidebar__title">Admin Panel</h2>
          <p className="admin-sidebar__email">{user?.email}</p>
        </div>

        <nav className="admin-sidebar__nav">
          {navItems.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`admin-sidebar__link ${isActive ? 'admin-sidebar__link--active' : ''}`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar__footer">
          <Link to={ROUTES.HOME} className="admin-sidebar__link">
            <ArrowLeft size={18} />
            Back to Site
          </Link>
          <button onClick={logout} className="admin-sidebar__link admin-sidebar__link--danger">
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
