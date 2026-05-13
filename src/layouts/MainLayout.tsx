import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/common/Navbar/Navbar';
import Footer from '@/components/common/Footer/Footer';
import ScrollProgress from '@/components/ui/ScrollProgress/ScrollProgress';
import ScrollToTop from '@/components/ui/ScrollToTop/ScrollToTop';

const MainLayout = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const htmlEl = document.documentElement;
    const originalScrollBehavior = htmlEl.style.scrollBehavior;
    htmlEl.style.scrollBehavior = 'auto';
    
    // 1. Immediate scroll
    window.scrollTo({ top: 0, left: 0 });
    
    // 2. Delayed scrolls to handle React Suspense dynamic chunks loading latency
    const t1 = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0 });
    }, 50);
    
    const t2 = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0 });
    }, 150);
    
    // Restore smooth scroll behavior for in-page anchors
    requestAnimationFrame(() => {
      htmlEl.style.scrollBehavior = originalScrollBehavior;
    });

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname]);

  return (
    <div className="main-layout">
      <ScrollProgress />
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default MainLayout;
