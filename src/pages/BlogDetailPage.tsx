import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Clock, AlertTriangle } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { blogService } from '@/api/services/cmsService';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useSEO } from '@/hooks/useSEO';
import './BlogPage.css';

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

  useSEO({
    title: article ? article.title : 'Blog Detail',
    description: article ? article.excerpt : 'Read this article from Kryptos InfoSys insights blog.',
    keywords: article ? `Kryptos InfoSys blog, ${article.title}` : 'Kryptos InfoSys insights'
  });

  if (isLoading) {
    return (
      <div className="flex-center" style={{ minHeight: '60vh' }}>
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
  }

  if (isError || !article) {
    return (
      <div className="section flex-center" style={{ minHeight: '60vh', flexDirection: 'column', gap: '1rem', color: 'var(--dark-navy)' }}>
        <AlertTriangle className="text-orange" size={48} />
        <h2>Article Not Found</h2>
        <p style={{ color: 'var(--muted-text)', fontSize: '0.9rem' }}>The article you are looking for does not exist or was unpublished.</p>
        <Link to={ROUTES.BLOG} className="btn btn--primary"><ArrowLeft size={16} /> Back to Blogs</Link>
      </div>
    );
  }

  return (
    <div className="blog-detail-page" style={{ paddingBottom: '4rem' }}>
      <section className="page-hero" style={{ padding: '8rem 0 4rem' }}>
        <div className="page-hero__bg" />
        <div className="floating-shape floating-shape--1" />
        <div className="floating-shape floating-shape--3" />
        <div className="container page-hero__content" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
          <Link to={ROUTES.BLOG} className="page-hero__back" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            <ArrowLeft size={16} /> All Articles
          </Link>
          <motion.h1
            className="page-hero__title"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', margin: 0, textAlign: 'left', lineHeight: 1.1 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {article.title}
          </motion.h1>
          
          <motion.div
            style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginTop: '1rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar size={14} />
              <span>{new Date(article.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <User size={14} />
              <span>By Administrator</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Clock size={14} />
              <span>5 min read</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ width: '100%', maxHeight: '450px', overflow: 'hidden', borderRadius: 'var(--radius-xl)', marginBottom: '3rem', boxShadow: 'var(--shadow-md)' }}>
            <img src={article.image} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <div
            className="blog-content-renderer"
            dangerouslySetInnerHTML={{ __html: article.content || '' }}
            style={{
              fontSize: '1.1rem',
              lineHeight: 1.8,
              color: 'var(--dark-text)',
            }}
          />

          <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to={ROUTES.BLOG} className="magnetic-btn magnetic-btn--outline magnetic-btn--md">
              <span className="magnetic-btn__text"><ArrowLeft size={16} /> Back to Blog</span>
              <span className="magnetic-btn__glow" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogDetailPage;
