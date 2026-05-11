import { supabase } from '@/lib/supabase';
import { SUPABASE_TABLES } from '@/constants/appConstants';
import type { ContactFormData, ContactSubmission } from '@/types/contact.types';

export const contactService = {
  /** Submit a contact form */
  submit: async (formData: ContactFormData): Promise<void> => {
    const { error } = await supabase
      .from(SUPABASE_TABLES.CONTACT_SUBMISSIONS)
      .insert({
        ...formData,
        is_read: false,
      });

    if (error) throw error;
  },

  /** Fetch all submissions (admin only) */
  fetchAll: async (): Promise<ContactSubmission[]> => {
    const { data, error } = await supabase
      .from(SUPABASE_TABLES.CONTACT_SUBMISSIONS)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /** Mark submission as read */
  markAsRead: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from(SUPABASE_TABLES.CONTACT_SUBMISSIONS)
      .update({ is_read: true })
      .eq('id', id);

    if (error) throw error;
  },

  /** Delete submission */
  deleteSubmission: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from(SUPABASE_TABLES.CONTACT_SUBMISSIONS)
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
