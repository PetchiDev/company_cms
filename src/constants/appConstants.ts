export const APP_NAME = 'Kryptos InfoSys';
export const APP_TAGLINE = 'Revolutionizing Business with Smart IT Solutions';
export const APP_TAGLINE_SHORT = 'Make IT Simple';

export const SUPABASE_TABLES = {
  ADMINS: 'admins',
  IMAGES: 'images',
  CONTACT_SUBMISSIONS: 'contact_submissions',
  NEWSLETTER_SUBSCRIBERS: 'newsletter_subscribers',
  SITE_CONTENT: 'site_content',
  STATS: 'stats',
  CERTIFICATIONS: 'certifications',
  TESTIMONIALS: 'testimonials',
  CASE_STUDIES: 'case_studies',
  BLOG_ARTICLES: 'blog_articles',
  CULTURE_HIGHLIGHTS: 'culture_highlights',
  SERVICE_CATEGORIES: 'service_categories',
  SERVICES: 'services',
} as const;

export const SUPABASE_BUCKETS = {
  IMAGES: 'images',
} as const;

export const IMAGE_CATEGORIES = {
  BANNER: 'banner',
  CLIENT_LOGO: 'client_logo',
  GALLERY: 'gallery',
  TEAM: 'team',
  CASE_STUDY: 'case_study',
  CERTIFICATION: 'certification',
} as const;

export const BUDGET_RANGES = [
  '$20,000–$50,000',
  '$50,000–$100,000',
  '$100,000+',
] as const;

export const BREAKPOINTS = {
  MOBILE: 480,
  TABLET: 768,
  DESKTOP: 1024,
  WIDE: 1440,
} as const;
