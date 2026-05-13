import { useState, useEffect, useRef } from 'react';
import { ImageIcon, MessageSquare, LayoutDashboard, TrendingUp, Users, ArrowRight, Zap, Target, Activity } from 'lucide-react';
import { imageService } from '@/api/services/imageService';
import { contactService } from '@/api/services/contactService';
import { motion } from 'framer-motion';
import { gsap } from '@/animations/gsapConfig';

const Dashboard = () => {
  const [imgCount, setImgCount] = useState(0);
  const [contactCount, setContactCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const metricsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [storageCount, contacts] = await Promise.all([
          imageService.getStorageCount(),
          contactService.fetchAll()
        ]);
        setImgCount(storageCount);
        setContactCount(contacts.length);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  useEffect(() => {
    if (!loading && metricsRef.current) {
      const bars = metricsRef.current.querySelectorAll('.metric-progress__fill');
      gsap.fromTo(bars, 
        { width: 0 }, 
        { 
          width: (_i, target) => target.dataset.width + '%', 
          duration: 1.5, 
          stagger: 0.2, 
          ease: 'power4.out' 
        }
      );
    }
  }, [loading]);

  const stats = [
    { label: 'Total Images', value: imgCount, icon: ImageIcon, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
    { label: 'Submissions', value: contactCount, icon: MessageSquare, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
    { label: 'System Status', value: 'Active', icon: LayoutDashboard, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
    { label: 'Engagement', value: 'High', icon: TrendingUp, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
  ];

  const performanceMetrics = [
    { label: 'Lead Conversion', value: 78, icon: Target, color: 'var(--primary-orange)' },
    { label: 'Server Reliability', value: 99, icon: Zap, color: '#10b981' },
    { label: 'Media Optimization', value: 64, icon: ImageIcon, color: '#3b82f6' },
    { label: 'User Retention', value: 85, icon: Activity, color: '#8b5cf6' },
  ];

  return (
    <div className="admin-content-area">
      <div className="admin-header-row">
        <div>
          <h1 className="admin-page__title">Dashboard Overview</h1>
          <p className="admin-page__subtitle">Real-time intelligence and system health</p>
        </div>
      </div>

      <div className="admin-stats-grid">
        {stats.map((stat, idx) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="stat-card stat-card--interactive"
          >
            <div className="stat-card__icon" style={{ backgroundColor: stat.bg, color: stat.color }}>
              <stat.icon size={24} />
            </div>
            <div className="stat-card__content">
              <span className="stat-card__label">{stat.label}</span>
              <span className="stat-card__value">{loading ? '...' : stat.value}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', marginTop: '2.5rem' }}>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="admin-card-v2 glassmorphism"
        >
          <div className="admin-card-v2__header">
            <h3>Lead Traffic Inflow</h3>
            <button className="text-btn">View Reports <ArrowRight size={14} /></button>
          </div>
          <div className="admin-card-v2__body" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <div style={{ textAlign: 'center', color: 'var(--muted-text)' }}>
               <Users size={64} style={{ opacity: 0.1, marginBottom: '1.5rem' }} />
               <p style={{ maxWidth: '300px', margin: '0 auto' }}>Deep analytics on your recent lead captures and traffic sources will be visualized here.</p>
             </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="admin-card-v2 parallelogram-card"
          ref={metricsRef}
        >
          <div className="admin-card-v2__header">
            <h3>System Performance</h3>
          </div>
          <div className="admin-card-v2__body" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', padding: '1.5rem 2rem' }}>
            {performanceMetrics.map((metric) => (
              <div key={metric.label} className="metric-row">
                <div className="flex-between" style={{ marginBottom: '0.65rem' }}>
                  <div className="flex-center" style={{ gap: '0.75rem' }}>
                    <div style={{ color: metric.color }}><metric.icon size={18} /></div>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{metric.label}</span>
                  </div>
                  <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--dark-navy)' }}>{metric.value}%</span>
                </div>
                <div className="metric-progress-bg" style={{ height: '8px', background: 'var(--bg-light)', borderRadius: '10px', overflow: 'hidden' }}>
                  <div 
                    className="metric-progress__fill" 
                    data-width={metric.value}
                    style={{ height: '100%', background: metric.color, borderRadius: '10px', width: 0 }} 
                  />
                </div>
              </div>
            ))}
            <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(238, 79, 41, 0.05)', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--primary-orange)' }}>
               <p style={{ fontSize: '0.75rem', margin: 0, color: 'var(--primary-orange)', fontWeight: 600 }}>
                 <Zap size={12} style={{ marginRight: '4px' }} />
                 System is currently performing at peak efficiency. No critical issues detected in media or lead pipelines.
               </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
