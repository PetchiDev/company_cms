import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { useBlogArticles } from '@/hooks/useCMS';
import { staggerContainer, staggerItem } from '@/animations/pageTransitions';
import './BlogPage.css';

const BlogPage = () => {
  const { blogArticles: articles } = useBlogArticles();

  return (
    <div>
      <section className="page-hero">
        <div className="page-hero__bg" />
        <div className="container page-hero__content">
          <motion.span className="page-hero__label" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>Insights</motion.span>
          <motion.h1 className="page-hero__title" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>Our <span className="text-orange">Blog</span></motion.h1>
          <motion.p className="page-hero__subtitle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>Stay updated with the latest in technology and IT solutions</motion.p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <motion.div className="blog-grid" variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }}>
            {articles.map((article: any) => {
              const isExternal = !!article.link;
              const CardWrapper = isExternal ? motion.a : motion.create(Link);
              const wrapperProps = isExternal
                ? { href: article.link, target: '_blank', rel: 'noopener noreferrer' }
                : { to: `/blog/${article.id}` };

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
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
