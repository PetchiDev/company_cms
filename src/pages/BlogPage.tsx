import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { useBlogArticles } from '@/hooks/useCMS';
import { staggerContainer, staggerItem } from '@/animations/pageTransitions';
import './BlogPage.css';

const BlogPage = () => {
  const { blogArticles: articles, isLoading } = useBlogArticles();

  return (
    <div>
      <section className="page-hero">
        <div className="page-hero__bg" />
        <div className="floating-shape floating-shape--1" />
        <div className="floating-shape floating-shape--3" />
        <div className="container page-hero__content">
          <motion.span className="page-hero__label" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>Insights</motion.span>
          <motion.h1 className="page-hero__title" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>Our <span className="text-gradient-animated">Blog</span></motion.h1>
          <motion.p className="page-hero__subtitle typewriter-cursor" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>Stay updated with the latest in technology and IT solutions</motion.p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {isLoading ? (
            <div className="blog-grid">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="blog-card" style={{ opacity: 0.7 }}>
                  <div className="skeleton" style={{ height: '200px', width: '100%' }} />
                  <div className="blog-card__body">
                    <div className="skeleton" style={{ width: '80px', height: '12px', marginBottom: '1rem' }} />
                    <div className="skeleton" style={{ width: '100%', height: '20px', marginBottom: '0.75rem' }} />
                    <div className="skeleton" style={{ width: '90%', height: '14px', marginBottom: '0.5rem' }} />
                    <div className="skeleton" style={{ width: '40%', height: '14px' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div className="blog-grid perspective-1000" variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }}>
              {articles.map((article: any) => {
                const isExternal = !!article.link && article.link.startsWith('http');
                const CardWrapper = isExternal ? motion.a : motion.create(Link);
                const wrapperProps = isExternal
                  ? { href: article.link, target: '_blank', rel: 'noopener noreferrer' }
                  : { to: article.link };

                return (
                  <CardWrapper
                    key={article.id}
                    {...wrapperProps}
                    className="blog-card"
                    variants={staggerItem}
                  >
                    <div className="blog-card__img">
                      <img src={article.image} alt={article.title} loading="lazy" />
                    </div>
                    <div className="blog-card__body">
                      <p className="blog-card__date">
                        {new Date(article.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                      <h3 className="blog-card__title">{article.title}</h3>
                      <p className="blog-card__excerpt">{article.excerpt}</p>
                      <span className="blog-card__link">
                        {isExternal ? 'Read External' : 'Read Article'}{' '}
                        {isExternal ? <ExternalLink size={14} /> : <ArrowRight size={14} />}
                      </span>
                    </div>
                  </CardWrapper>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};


export default BlogPage;
