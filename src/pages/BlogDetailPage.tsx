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
    <div className="blog-detail-page">
      <section className="section" style={{ paddingTop: '8rem', paddingBottom: '4rem' }}>
        <div className="container" style={{ maxWidth: '1200px' }}>
          {/* Back Button */}
          <Link to={ROUTES.BLOG} className="btn btn--outline" style={{ marginBottom: '2rem', border: 'none', padding: 0, color: 'var(--muted-text)' }}>
            <ArrowLeft size={16} /> Back to Insights
          </Link>

          {/* Title Header */}
          <header style={{ marginBottom: '3rem' }}>
            <motion.h1
              style={{ 
                fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', 
                color: 'var(--dark-navy)', 
                fontWeight: 800,
                lineHeight: 1.1,
                marginBottom: '1.5rem'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {article.title}
            </motion.h1>

            <div style={{ display: 'flex', gap: '2rem', color: 'var(--muted-text)', fontSize: '0.9rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={14} /> {new Date(article.date).toLocaleDateString()}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={14} /> 6 min read</span>
            </div>
          </header>

          {/* Featured Image */}
          <motion.div 
            style={{ 
              width: '100%', 
              borderRadius: '1.5rem', 
              overflow: 'hidden', 
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
              marginBottom: '4rem'
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <img src={article.image} alt={article.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
          </motion.div>

          {/* Content Body */}
          <article 
            className="blog-content-renderer ql-editor"
            dangerouslySetInnerHTML={{ __html: (article.content || '').replace(/&nbsp;/g, ' ') }}
          />

          {/* Footer Back */}
          <footer style={{ marginTop: '5rem', paddingTop: '3rem', borderTop: '1px solid #eee' }}>
            <Link to={ROUTES.BLOG} className="btn btn--primary" style={{ borderRadius: '50px', padding: '1rem 2.5rem' }}>
              <ArrowLeft size={16} style={{ marginRight: '0.5rem' }} /> Back to Blog
            </Link>
          </footer>
        </div>
      </section>
    </div>
  );
};

export default BlogDetailPage;
