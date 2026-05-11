export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  budget: BudgetRange;
  wants_nda: boolean;
}

export type BudgetRange =
  | '$20,000–$50,000'
  | '$50,000–$100,000'
  | '$100,000+';

export interface ContactSubmission extends ContactFormData {
  id: string;
  is_read: boolean;
  created_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  created_at: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  clientTitle: string;
  company: string;
  quote: string;
  logo: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  category: string;
  description: string;
  thumbnail: string;
  pdfLink?: string;
}

export interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  link: string;
  date: string;
}
