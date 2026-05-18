import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, AlertTriangle, Share2, MessageSquare } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { blogService } from '@/api/services/cmsService';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useSEO } from '@/hooks/useSEO';
import './BlogDetailPage.css';

const BlogDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data: article, isLoading, isError } = useQuery({
    queryKey: [QUERY_KEYS.BLOG_ARTICLES, id],
    queryFn: () => {
      if (!id) throw new Error('No ID');
      return blogService.fetchById(id);
    },
    enabled: !!id,
  });

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useSEO({
    title: article ? article.title : 'Blog Detail',
    description: article ? article.excerpt : 'Read this article from Kryptos InfoSys insights blog.',
    keywords: article ? `Kryptos InfoSys blog, ${article.title}` : 'Kryptos InfoSys insights'
  });

  if (isLoading) {
    return (
      <div className="flex-center" style={{ minHeight: '80vh' }}>
        <div className="spin" style={{ width: 50, height: 50, border: '4px solid var(--bg-light)', borderTopColor: 'var(--primary-orange)', borderRadius: '50%' }} />
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="section flex-center" style={{ minHeight: '60vh', flexDirection: 'column', gap: '1.5rem' }}>
        <AlertTriangle className="text-orange" size={64} />
        <h2 style={{ fontSize: '2rem', color: 'var(--dark-navy)' }}>Article Not Found</h2>
        <Link to={ROUTES.BLOG} className="btn btn--primary"><ArrowLeft size={16} /> Back to Insights</Link>
      </div>
    );
  }

  return (
    <div className="blog-detail-page">
      {/* Reading Progress Bar */}
      <motion.div className="reading-progress-bar" style={{ scaleX, transformOrigin: '0%' }} />

      {/* Hero Section */}
      <section className="blog-hero">
        <div className="container">
          <div className="blog-hero__content">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link to={ROUTES.BLOG} className="btn" style={{ padding: 0, color: 'var(--primary-orange)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                <ArrowLeft size={16} /> BACK TO INSIGHTS
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <div className="blog-hero__meta">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={16} /> {new Date(article.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={16} /> 6 MIN READ</span>
              </div>
              <h1 className="blog-hero__title">{article.title}</h1>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="blog-main-container">
        <div className="container" style={{ maxWidth: '1000px' }}>
          <div className="blog-content-card">
            {/* Side Sticky Actions (Desktop only) */}
            <div className="blog-side-actions">
              <button className="side-action-btn share" title="Share Article"><Share2 size={18} /></button>
              <div style={{ height: '30px', width: '1px', background: '#eee', margin: '0.5rem auto' }} />
              <button className="side-action-btn" title="Comments"><MessageSquare size={18} /></button>
            </div>

            {/* Featured Image */}
            <motion.div 
              className="blog-featured-image-wrapper"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <img src={article.image} alt={article.title} className="blog-featured-image" />
            </motion.div>

            {/* Article Text Content */}
            <motion.article 
              className="blog-article-body ql-editor"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
              dangerouslySetInnerHTML={{ __html: (article.content || '').replace(/&nbsp;/g, ' ') }}
            />

            <footer style={{ marginTop: '6rem', paddingTop: '4rem', borderTop: '1px solid rgba(0,0,0,0.05)', textAlign: 'center' }}>
              <h4 style={{ marginBottom: '2rem', color: 'var(--dark-navy)', fontWeight: 800 }}>Thanks for reading!</h4>
              <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginBottom: '3rem' }}>
                <Link to={ROUTES.BLOG} className="btn" style={{ 
                  background: 'var(--primary-orange)', 
                  color: 'white', 
                  padding: '1rem 3.5rem', 
                  borderRadius: '50px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  boxShadow: '0 10px 20px rgba(238, 79, 41, 0.2)'
                }}>
                  <ArrowLeft size={18} /> EXPLORE MORE INSIGHTS
                </Link>
              </div>
              <p style={{ color: 'var(--muted-text)', fontSize: '0.9rem' }}>
                Stay updated with our latest thoughts on technology and business innovation.
              </p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
