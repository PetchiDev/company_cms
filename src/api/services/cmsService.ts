import { supabase } from '@/lib/supabase';
import { SUPABASE_TABLES } from '@/constants/appConstants';
import { QUERY_KEYS } from '@/constants/queryKeys';
import type {
  SiteContent,
  StatRecord,
  CertificationRecord,
  TestimonialRecord,
  CaseStudyRecord,
  BlogArticleRecord,
  CultureHighlightRecord,
  ServiceCategoryRecord,
  ServiceRecord,
  ImageRecord,
} from '@/types/cms.types';

// Browser-native cross-tab broadcast synchronization trigger
const broadcastInvalidation = (queryKey: string) => {
  try {
    const channel = new BroadcastChannel('kryptos-cms-realtime-sync');
    channel.postMessage({ type: 'invalidate', queryKey });
    channel.close();
  } catch (e) {
    // Fail silently in non-browser environments
  }
};

/* ─── 1. SITE CONTENT SERVICE ─── */
export const siteContentService = {
  fetchAll: async (): Promise<SiteContent[]> => {
    const { data, error } = await supabase
      .from(SUPABASE_TABLES.SITE_CONTENT)
      .select('*');
    if (error) throw error;
    return data || [];
  },
  update: async (key: string, value: string): Promise<SiteContent> => {
    /* Determine the section based on the key prefix to satisfy the NOT NULL constraint */
    let section = 'company';
    if ((key.startsWith('contact_phone') || key.startsWith('contact_email') || key.startsWith('office_'))) {
      section = 'contact';
    } else if (key.startsWith('social_')) {
      section = 'social';
    } else if (key === 'job_portal_url') {
      section = 'careers';
    } else if (key.startsWith('stats_')) {
      section = 'stats';
    }

    const { data, error } = await supabase
      .from(SUPABASE_TABLES.SITE_CONTENT)
      .upsert({ key, value, section, updated_at: new Date().toISOString() })
      .select()
      .single();
    if (error) throw error;

    // Trigger local cross-tab sync
    broadcastInvalidation(QUERY_KEYS.SITE_CONTENT);

    return data;
  },
};

/* ─── 2. STATS SERVICE ─── */
export const statsService = {
  fetchAll: async (): Promise<StatRecord[]> => {
    const { data, error } = await supabase
      .from(SUPABASE_TABLES.STATS)
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },
  upsert: async (record: Partial<StatRecord>): Promise<StatRecord> => {
    const { data, error } = await supabase
      .from(SUPABASE_TABLES.STATS)
      .upsert(record)
      .select()
      .single();
    if (error) throw error;

    broadcastInvalidation(QUERY_KEYS.STATS);

    return data;
  },
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from(SUPABASE_TABLES.STATS)
      .delete()
      .eq('id', id);
    if (error) throw error;

    broadcastInvalidation(QUERY_KEYS.STATS);
  },
};

/* ─── 3. CERTIFICATIONS SERVICE ─── */
export const certificationService = {
  fetchAll: async (): Promise<CertificationRecord[]> => {
    const { data, error } = await supabase
      .from(SUPABASE_TABLES.CERTIFICATIONS)
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },
  upsert: async (record: Partial<CertificationRecord>): Promise<CertificationRecord> => {
    const { data, error } = await supabase
      .from(SUPABASE_TABLES.CERTIFICATIONS)
      .upsert(record)
      .select()
      .single();
    if (error) throw error;

    broadcastInvalidation(QUERY_KEYS.CERTIFICATIONS);

    return data;
  },
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from(SUPABASE_TABLES.CERTIFICATIONS)
      .delete()
      .eq('id', id);
    if (error) throw error;

    broadcastInvalidation(QUERY_KEYS.CERTIFICATIONS);
  },
};

/* ─── 4. TESTIMONIALS SERVICE ─── */
export const testimonialService = {
  fetchAll: async (): Promise<TestimonialRecord[]> => {
    const { data, error } = await supabase
      .from(SUPABASE_TABLES.TESTIMONIALS)
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },
  upsert: async (record: Partial<TestimonialRecord>): Promise<TestimonialRecord> => {
    const { data, error } = await supabase
      .from(SUPABASE_TABLES.TESTIMONIALS)
      .upsert(record)
      .select()
      .single();
    if (error) throw error;

    broadcastInvalidation(QUERY_KEYS.TESTIMONIALS);

    return data;
  },
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from(SUPABASE_TABLES.TESTIMONIALS)
      .delete()
      .eq('id', id);
    if (error) throw error;

    broadcastInvalidation(QUERY_KEYS.TESTIMONIALS);
  },
};

/* ─── 5. CASE STUDIES SERVICE ─── */
export const caseStudyService = {
  fetchAll: async (): Promise<CaseStudyRecord[]> => {
    const { data, error } = await supabase
      .from(SUPABASE_TABLES.CASE_STUDIES)
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },
  upsert: async (record: Partial<CaseStudyRecord>): Promise<CaseStudyRecord> => {
    const { data, error } = await supabase
      .from(SUPABASE_TABLES.CASE_STUDIES)
      .upsert(record)
      .select()
      .single();
    if (error) throw error;

    broadcastInvalidation(QUERY_KEYS.CASE_STUDIES);

    return data;
  },
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from(SUPABASE_TABLES.CASE_STUDIES)
      .delete()
      .eq('id', id);
    if (error) throw error;

    broadcastInvalidation(QUERY_KEYS.CASE_STUDIES);
  },
};

/* ─── 6. BLOG SERVICE ─── */
export const blogService = {
  fetchAll: async (): Promise<BlogArticleRecord[]> => {
    const { data, error } = await supabase
      .from(SUPABASE_TABLES.BLOG_ARTICLES)
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },
  fetchById: async (id: string): Promise<BlogArticleRecord> => {
    const { data, error } = await supabase
      .from(SUPABASE_TABLES.BLOG_ARTICLES)
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },
  upsert: async (record: Partial<BlogArticleRecord>): Promise<BlogArticleRecord> => {
    const { data, error } = await supabase
      .from(SUPABASE_TABLES.BLOG_ARTICLES)
      .upsert(record)
      .select()
      .single();
    if (error) throw error;

    broadcastInvalidation(QUERY_KEYS.BLOG_ARTICLES);

    return data;
  },
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from(SUPABASE_TABLES.BLOG_ARTICLES)
      .delete()
      .eq('id', id);
    if (error) throw error;

    broadcastInvalidation(QUERY_KEYS.BLOG_ARTICLES);
  },
};

/* ─── 7. CULTURE SERVICE ─── */
export const cultureService = {
  fetchAll: async (): Promise<CultureHighlightRecord[]> => {
    const { data, error } = await supabase
      .from(SUPABASE_TABLES.CULTURE_HIGHLIGHTS)
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },
  upsert: async (record: Partial<CultureHighlightRecord>): Promise<CultureHighlightRecord> => {
    const { data, error } = await supabase
      .from(SUPABASE_TABLES.CULTURE_HIGHLIGHTS)
      .upsert(record)
      .select()
      .single();
    if (error) throw error;

    broadcastInvalidation(QUERY_KEYS.CULTURE_HIGHLIGHTS);

    return data;
  },
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from(SUPABASE_TABLES.CULTURE_HIGHLIGHTS)
      .delete()
      .eq('id', id);
    if (error) throw error;

    broadcastInvalidation(QUERY_KEYS.CULTURE_HIGHLIGHTS);
  },
};

/* ─── 8. SERVICES & CATEGORIES SERVICE ─── */
export const servicesService = {
  fetchCategories: async (): Promise<ServiceCategoryRecord[]> => {
    const { data, error } = await supabase
      .from(SUPABASE_TABLES.SERVICE_CATEGORIES)
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },
  upsertCategory: async (record: Partial<ServiceCategoryRecord>): Promise<ServiceCategoryRecord> => {
    const { data, error } = await supabase
      .from(SUPABASE_TABLES.SERVICE_CATEGORIES)
      .upsert(record)
      .select()
      .single();
    if (error) throw error;

    broadcastInvalidation(QUERY_KEYS.SERVICE_CATEGORIES);

    return data;
  },
  deleteCategory: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from(SUPABASE_TABLES.SERVICE_CATEGORIES)
      .delete()
      .eq('id', id);
    if (error) throw error;

    broadcastInvalidation(QUERY_KEYS.SERVICE_CATEGORIES);
    broadcastInvalidation(QUERY_KEYS.SERVICES); // Cascade delete impact
  },
  fetchAll: async (): Promise<ServiceRecord[]> => {
    const { data, error } = await supabase
      .from(SUPABASE_TABLES.SERVICES)
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },
  upsertService: async (record: Partial<ServiceRecord>): Promise<ServiceRecord> => {
    const { data, error } = await supabase
      .from(SUPABASE_TABLES.SERVICES)
      .upsert(record)
      .select()
      .single();
    if (error) throw error;

    broadcastInvalidation(QUERY_KEYS.SERVICES);

    return data;
  },
  deleteService: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from(SUPABASE_TABLES.SERVICES)
      .delete()
      .eq('id', id);
    if (error) throw error;

    broadcastInvalidation(QUERY_KEYS.SERVICES);
  },
};

/* ─── 9. MEDIA SERVICE ─── */
export const mediaService = {
  fetchByCategory: async (category: string): Promise<ImageRecord[]> => {
    const { data, error } = await supabase
      .from(SUPABASE_TABLES.IMAGES)
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
};
