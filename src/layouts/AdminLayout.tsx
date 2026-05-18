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
  UserPlus,
  Menu,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import './AdminLayout.css';

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    // Force immediate scroll to top on tab change in admin panel
    const htmlEl = document.documentElement;
    const originalScrollBehavior = htmlEl.style.scrollBehavior;
    htmlEl.style.scrollBehavior = 'auto';
    window.scrollTo({ top: 0, left: 0 });
    
    // Restore smooth scroll behavior
    requestAnimationFrame(() => {
      htmlEl.style.scrollBehavior = originalScrollBehavior;
    });

    // Close mobile sidebar on route change
    setMobileSidebarOpen(false);
  }, [location.pathname]);

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
    { path: ROUTES.ADMIN_USERS, icon: UserPlus, label: 'Add Admin' },
  ];

  return (
    <div className="admin-layout">
      {/* Mobile Top Header */}
      <div className="admin-mobile-header">
        <button onClick={() => setMobileSidebarOpen(true)} className="mobile-menu-btn" aria-label="Open Menu">
          <Menu size={24} />
        </button>
        <h2 className="admin-mobile-title">Admin Panel</h2>
        <div style={{ width: 24 }} /> {/* Visual spacer to balance the menu button */}
      </div>

      {/* Sidebar Overlay Backdrop */}
      {mobileSidebarOpen && (
        <div className="admin-sidebar-overlay" onClick={() => setMobileSidebarOpen(false)} />
      )}

      <aside className={`admin-sidebar ${mobileSidebarOpen ? 'admin-sidebar--open' : ''}`}>
        <div className="admin-sidebar__header">
          <div className="sidebar-header-flex">
            <h2 className="admin-sidebar__title">Admin Panel</h2>
            <button onClick={() => setMobileSidebarOpen(false)} className="mobile-close-btn" aria-label="Close Menu">
              <X size={20} />
            </button>
          </div>
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
