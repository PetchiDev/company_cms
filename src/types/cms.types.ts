export interface SiteContent {
  key: string;
  value: string;
  section: string;
  updated_at: string;
}

export interface StatRecord {
  id: string;
  label: string;
  value: number;
  suffix: string;
  display: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface CertificationRecord {
  id: string;
  name: string;
  url: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface TestimonialRecord {
  id: string;
  client_name: string;
  client_title: string;
  company: string;
  quote: string;
  logo_url: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface CaseStudyRecord {
  id: string;
  title: string;
  category: string;
  description: string;
  thumbnail: string;
  pdf_link: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface BlogArticleRecord {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  content: string | null;
  link: string | null;
  date: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface CultureHighlightRecord {
  id: string;
  icon: string;
  title: string;
  description: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface ServiceCategoryRecord {
  id: string;
  title: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface ServiceRecord {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  full_description: string;
  icon: string;
  category_id: string;
  features: string[];
  technologies: string[];
  sort_order: number;
  is_active: boolean;
  created_at: string;
}
