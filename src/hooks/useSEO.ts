import { useEffect } from 'react';

interface SEOMetadata {
  title: string;
  description?: string;
  keywords?: string;
  canonicalPath?: string;
}

export const useSEO = ({ title, description, keywords, canonicalPath }: SEOMetadata) => {
  useEffect(() => {
    // 1. Title Tag
    const defaultTitle = 'Kryptos InfoSys | Smart IT Solutions';
    document.title = title ? `${title} | Kryptos InfoSys` : defaultTitle;

    // 2. Meta Description
    if (description) {
      let descMeta = document.querySelector('meta[name="description"]');
      if (!descMeta) {
        descMeta = document.createElement('meta');
        descMeta.setAttribute('name', 'description');
        document.head.appendChild(descMeta);
      }
      descMeta.setAttribute('content', description);
    }

    // 3. Meta Keywords
    if (keywords) {
      let keywordsMeta = document.querySelector('meta[name="keywords"]');
      if (!keywordsMeta) {
        keywordsMeta = document.createElement('meta');
        keywordsMeta.setAttribute('name', 'keywords');
        document.head.appendChild(keywordsMeta);
      }
      keywordsMeta.setAttribute('content', keywords);
    }

    // 4. Canonical Link
    const baseDomain = window.location.origin;
    const path = canonicalPath || window.location.pathname;
    const fullUrl = `${baseDomain}${path}`;
    
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', fullUrl);
  }, [title, description, keywords, canonicalPath]);
};
