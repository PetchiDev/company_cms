import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import {
  siteContentService,
  statsService,
  certificationService,
  testimonialService,
  caseStudyService,
  blogService,
  cultureService,
  servicesService,
  mediaService,
} from '@/api/services/cmsService';
import {
  SUPABASE_TABLES,
  IMAGE_CATEGORIES,
} from '@/constants/appConstants';
import {
  COMPANY as STATIC_COMPANY,
  CONTACT_INFO as STATIC_CONTACT,
  SOCIAL_LINKS as STATIC_SOCIAL,
  STATS as STATIC_STATS,
  CERTIFICATIONS as STATIC_CERTIFICATIONS,
  TESTIMONIALS as STATIC_TESTIMONIALS,
  CASE_STUDIES as STATIC_CASE_STUDIES,
  BLOG_ARTICLES as STATIC_BLOG_ARTICLES,
  CLIENT_LOGOS as STATIC_CLIENT_LOGOS,
  CULTURE_HIGHLIGHTS as STATIC_CULTURE_HIGHLIGHTS,
  JOB_PORTAL_URL as STATIC_JOB_PORTAL,
} from '@/constants/companyData';
import { SERVICE_CATEGORIES as STATIC_SERVICE_CATEGORIES } from '@/features/services/data/servicesData';
import type {
  Testimonial,
  CaseStudy,
  BlogArticle,
} from '@/types/contact.types';
import type { ServiceCategoryGroup, ServiceItem, ServiceCategory } from '@/types/service.types';

/* ─── 1. SITE CONTENT HOOK ─── */
export const useSiteContent = () => {
  const { data: content = [], isLoading } = useQuery({
    queryKey: [QUERY_KEYS.SITE_CONTENT],
    queryFn: siteContentService.fetchAll,
  });

  const contentMap = new Map(content.map((item) => [item.key, item.value]));

  const getText = (key: string, fallback: string): string => {
    return contentMap.get(key) || fallback;
  };

  /* Unified Company Data Object matching COMPANY constant */
  const company = {
    name: getText('company_name', STATIC_COMPANY.name),
    legalName: getText('company_legal_name', STATIC_COMPANY.legalName),
    website: getText('company_website', STATIC_COMPANY.website),
    tagline: getText('company_tagline', STATIC_COMPANY.tagline),
    motto: getText('company_motto', STATIC_COMPANY.motto),
    vision: getText('company_vision', STATIC_COMPANY.vision),
    mission: getText('company_mission', STATIC_COMPANY.mission),
    logo: STATIC_COMPANY.logo, /* use useClientLogos hook for main dynamic logos */
    copyright: `© ${new Date().getFullYear()} ${getText('company_name', STATIC_COMPANY.name)}`,
  };

  /* Unified Contact Info Object matching CONTACT_INFO constant */
  const contactInfo = {
    phone: getText('contact_phone', STATIC_CONTACT.phone),
    email: getText('contact_email', STATIC_CONTACT.email),
    usOffice: {
      label: getText('office_us_label', STATIC_CONTACT.usOffice.label),
      address: getText('office_us_address', STATIC_CONTACT.usOffice.address),
    },
    indiaOffice: {
      label: getText('office_india_label', STATIC_CONTACT.indiaOffice.label),
      address: getText('office_india_address', STATIC_CONTACT.indiaOffice.address),
    },
  };

  /* Unified Social Links Object matching SOCIAL_LINKS constant */
  const socialLinks = {
    linkedin: getText('social_linkedin', STATIC_SOCIAL.linkedin),
    facebook: getText('social_facebook', STATIC_SOCIAL.facebook),
    instagram: getText('social_instagram', STATIC_SOCIAL.instagram),
    twitter: getText('social_twitter', STATIC_SOCIAL.twitter),
  };

  const jobPortalUrl = getText('job_portal_url', STATIC_JOB_PORTAL);

  return { company, contactInfo, socialLinks, jobPortalUrl, isLoading, getText };
};

/* ─── 2. STATS HOOK ─── */
export const useStats = () => {
  const { data: dbStats = [], isLoading } = useQuery({
    queryKey: [QUERY_KEYS.STATS],
    queryFn: statsService.fetchAll,
  });

  const stats = dbStats.length > 0
    ? dbStats.map((s) => ({
        label: s.label,
        value: Number(s.value),
        suffix: s.suffix,
        display: s.display,
      }))
    : STATIC_STATS;

  return { stats, isLoading };
};

/* ─── 3. CERTIFICATIONS HOOK ─── */
export const useCertifications = () => {
  const { data: dbCerts = [], isLoading } = useQuery({
    queryKey: [QUERY_KEYS.CERTIFICATIONS],
    queryFn: certificationService.fetchAll,
  });

  const certifications = dbCerts.length > 0
    ? dbCerts.map((c) => ({
        name: c.name,
        url: c.url,
      }))
    : STATIC_CERTIFICATIONS;

  return { certifications, isLoading };
};

/* ─── 4. TESTIMONIALS HOOK ─── */
export const useTestimonials = () => {
  const { data: dbTestimonials = [], isLoading } = useQuery({
    queryKey: [QUERY_KEYS.TESTIMONIALS],
    queryFn: testimonialService.fetchAll,
  });

  const testimonials: Testimonial[] = dbTestimonials.length > 0
    ? dbTestimonials.map((t) => ({
        id: t.id,
        clientName: t.client_name,
        clientTitle: t.client_title || '',
        company: t.company,
        quote: t.quote,
        logo: t.logo_url,
      }))
    : STATIC_TESTIMONIALS;

  return { testimonials, isLoading };
};

/* ─── 5. CASE STUDIES HOOK ─── */
export const useCaseStudies = () => {
  const { data: dbCaseStudies = [], isLoading } = useQuery({
    queryKey: [QUERY_KEYS.CASE_STUDIES],
    queryFn: caseStudyService.fetchAll,
  });

  const caseStudies: CaseStudy[] = dbCaseStudies.length > 0
    ? dbCaseStudies.map((cs) => ({
        id: cs.id,
        title: cs.title,
        category: cs.category,
        description: cs.description,
        thumbnail: cs.thumbnail,
        pdfLink: cs.pdf_link || undefined,
      }))
    : STATIC_CASE_STUDIES;

  return { caseStudies, isLoading };
};

/* ─── 6. BLOG ARTICLES HOOK ─── */
export const useBlogArticles = () => {
  const { data: dbBlogs = [], isLoading } = useQuery({
    queryKey: [QUERY_KEYS.BLOG_ARTICLES],
    queryFn: blogService.fetchAll,
  });

  const blogArticles: BlogArticle[] = dbBlogs.length > 0
    ? dbBlogs.map((b) => ({
        id: b.id,
        title: b.title,
        excerpt: b.excerpt,
        image: b.image,
        link: b.content ? `/blog/${b.id}` : (b.link || '/blog'),
        date: b.date,
      }))
    : STATIC_BLOG_ARTICLES;

  return { blogArticles, isLoading };
};

/* ─── 7. CULTURE HIGHLIGHTS HOOK ─── */
export const useCultureHighlights = () => {
  const { data: dbCulture = [], isLoading } = useQuery({
    queryKey: [QUERY_KEYS.CULTURE_HIGHLIGHTS],
    queryFn: cultureService.fetchAll,
  });

  const cultureHighlights = dbCulture.length > 0
    ? dbCulture.map((ch) => ({
        icon: ch.icon,
        title: ch.title,
        description: ch.description,
      }))
    : STATIC_CULTURE_HIGHLIGHTS;

  return { cultureHighlights, isLoading };
};

/* ─── 8. SERVICES HOOK ─── */
export const useServices = () => {
  const { data: dbCategories = [], isLoading: isLoadingCats } = useQuery({
    queryKey: [QUERY_KEYS.SERVICE_CATEGORIES],
    queryFn: servicesService.fetchCategories,
  });

  const { data: dbServices = [], isLoading: isLoadingServices } = useQuery({
    queryKey: [QUERY_KEYS.SERVICES],
    queryFn: servicesService.fetchAll,
  });

  const isLoading = isLoadingCats || isLoadingServices;

  let serviceCategories: ServiceCategoryGroup[] = STATIC_SERVICE_CATEGORIES;

  if (dbCategories.length > 0) {
    serviceCategories = dbCategories.map((cat) => {
      const servicesForCat: ServiceItem[] = dbServices
        .filter((s) => s.category_id === cat.id)
        .map((s) => ({
          id: s.id,
          slug: s.slug,
          title: s.title,
          shortDescription: s.short_description,
          fullDescription: s.full_description,
          icon: s.icon,
          category: s.category_id as ServiceCategory,
          features: s.features,
          technologies: s.technologies,
        }));

      return {
        id: cat.id as ServiceCategory,
        title: cat.title,
        services: servicesForCat,
      };
    });
  }

  const allServices = serviceCategories.flatMap((cat) => cat.services);

  const getServiceBySlug = (slug: string): ServiceItem | undefined => {
    return allServices.find((s) => s.slug === slug);
  };

  return { serviceCategories, allServices, getServiceBySlug, isLoading };
};

/* ─── 9. CLIENT LOGOS HOOK ─── */
export const useClientLogos = () => {
  const { data: dbLogos = [], isLoading } = useQuery({
    queryKey: [QUERY_KEYS.IMAGES, IMAGE_CATEGORIES.CLIENTS],
    queryFn: () => mediaService.fetchByCategory(IMAGE_CATEGORIES.CLIENTS),
  });

  const clientLogos = dbLogos.length > 0
    ? dbLogos.map((img) => ({
        name: img.name,
        url: img.url,
      }))
    : STATIC_CLIENT_LOGOS;

  return { clientLogos, isLoading };
};

/* ─── 10. SITE LOGO HOOK ─── */
export const useSiteLogo = () => {
  const { data: dbLogos = [], isLoading } = useQuery({
    queryKey: [QUERY_KEYS.IMAGES, IMAGE_CATEGORIES.LOGO],
    queryFn: () => mediaService.fetchByCategory(IMAGE_CATEGORIES.LOGO),
  });

  const logo = dbLogos.length > 0 ? dbLogos[0].url : STATIC_COMPANY.logo;

  return { logo, isLoading };
};
