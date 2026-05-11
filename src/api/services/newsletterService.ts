import { supabase } from '@/lib/supabase';
import { SUPABASE_TABLES } from '@/constants/appConstants';

export const newsletterService = {
  /** Subscribe to newsletter */
  subscribe: async (email: string): Promise<void> => {
    const { error } = await supabase
      .from(SUPABASE_TABLES.NEWSLETTER_SUBSCRIBERS)
      .upsert({ email }, { onConflict: 'email' });

    if (error) throw error;
  },

  /** Fetch all subscribers (admin) */
  fetchAll: async () => {
    const { data, error } = await supabase
      .from(SUPABASE_TABLES.NEWSLETTER_SUBSCRIBERS)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },
};
