import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import MainLayout from '@/layouts/MainLayout';
import AdminLayout from '@/layouts/AdminLayout';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';

/* Lazy-loaded pages */
const HomePage = lazy(() => import('@/pages/HomePage'));
const ServicesPage = lazy(() => import('@/pages/ServicesPage'));
const ServiceDetailPage = lazy(() => import('@/pages/ServiceDetailPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const CareersPage = lazy(() => import('@/pages/CareersPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const BlogPage = lazy(() => import('@/pages/BlogPage'));
const BlogDetailPage = lazy(() => import('@/pages/BlogDetailPage'));
const CaseStudiesPage = lazy(() => import('@/pages/CaseStudiesPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const AdminPage = lazy(() => import('@/pages/AdminPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

const Loader = () => (
  <div className="flex-center" style={{ height: '100vh' }}>
    <div
      className="spin"
      style={{
        width: 40,
        height: 40,
        border: '3px solid var(--bg-light)',
        borderTopColor: 'var(--primary-blue)',
        borderRadius: '50%',
      }}
    />
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Suspense fallback={<Loader />}><HomePage /></Suspense> },
      { path: 'services', element: <Suspense fallback={<Loader />}><ServicesPage /></Suspense> },
      { path: 'services/:slug', element: <Suspense fallback={<Loader />}><ServiceDetailPage /></Suspense> },
      { path: 'about', element: <Suspense fallback={<Loader />}><AboutPage /></Suspense> },
      { path: 'careers', element: <Suspense fallback={<Loader />}><CareersPage /></Suspense> },
      { path: 'contact', element: <Suspense fallback={<Loader />}><ContactPage /></Suspense> },
      { path: 'blog', element: <Suspense fallback={<Loader />}><BlogPage /></Suspense> },
      { path: 'blog/:id', element: <Suspense fallback={<Loader />}><BlogDetailPage /></Suspense> },
      { path: 'case-studies', element: <Suspense fallback={<Loader />}><CaseStudiesPage /></Suspense> },
      { path: '*', element: <Suspense fallback={<Loader />}><NotFoundPage /></Suspense> },
    ],
  },
  {
    path: ROUTES.LOGIN,
    element: <Suspense fallback={<Loader />}><LoginPage /></Suspense>,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute requireAdmin>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Suspense fallback={<Loader />}><AdminPage /></Suspense> },
      { path: 'images', element: <Suspense fallback={<Loader />}><AdminPage /></Suspense> },
      { path: 'contacts', element: <Suspense fallback={<Loader />}><AdminPage /></Suspense> },
      { path: 'content', element: <Suspense fallback={<Loader />}><AdminPage /></Suspense> },
      { path: 'stats', element: <Suspense fallback={<Loader />}><AdminPage /></Suspense> },
      { path: 'certs', element: <Suspense fallback={<Loader />}><AdminPage /></Suspense> },
      { path: 'testimonials', element: <Suspense fallback={<Loader />}><AdminPage /></Suspense> },
      { path: 'case-studies', element: <Suspense fallback={<Loader />}><AdminPage /></Suspense> },
      { path: 'blog', element: <Suspense fallback={<Loader />}><AdminPage /></Suspense> },
      { path: 'services', element: <Suspense fallback={<Loader />}><AdminPage /></Suspense> },
      { path: 'culture', element: <Suspense fallback={<Loader />}><AdminPage /></Suspense> },
    ],
  },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
