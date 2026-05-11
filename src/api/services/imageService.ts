import { supabase } from '@/lib/supabase';
import { SUPABASE_TABLES, SUPABASE_BUCKETS } from '@/constants/appConstants';
import type { ImageRecord, ImageCategory, ImageUploadPayload } from '@/types/image.types';

export const imageService = {
  /** Fetch all images */
  fetchAll: async (): Promise<ImageRecord[]> => {
    const { data, error } = await supabase
      .from(SUPABASE_TABLES.IMAGES)
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  /** Fetch images by category */
  fetchByCategory: async (category: ImageCategory): Promise<ImageRecord[]> => {
    const { data, error } = await supabase
      .from(SUPABASE_TABLES.IMAGES)
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  /** Fetch all images for admin (including inactive) */
  fetchAllAdmin: async (): Promise<ImageRecord[]> => {
    const { data, error } = await supabase
      .from(SUPABASE_TABLES.IMAGES)
      .select('*')
      .order('category')
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  /** Upload image to storage and save metadata */
  upload: async (payload: ImageUploadPayload): Promise<ImageRecord> => {
    const { file, name, category, alt_text } = payload;
    const fileExt = file.name.split('.').pop();
    const fileName = `${category}/${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;

    /* Upload to storage */
    const { error: uploadError } = await supabase.storage
      .from(SUPABASE_BUCKETS.IMAGES)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) throw uploadError;

    /* Get public URL */
    const { data: urlData } = supabase.storage
      .from(SUPABASE_BUCKETS.IMAGES)
      .getPublicUrl(fileName);

    /* Get current user */
    const {
      data: { user },
    } = await supabase.auth.getUser();

    /* Get max sort order for category */
    const { data: maxOrderData } = await supabase
      .from(SUPABASE_TABLES.IMAGES)
      .select('sort_order')
      .eq('category', category)
      .order('sort_order', { ascending: false })
      .limit(1);

    const nextOrder = maxOrderData && maxOrderData.length > 0
      ? (maxOrderData[0].sort_order || 0) + 1
      : 0;

    /* Save metadata to DB */
    const { data, error: dbError } = await supabase
      .from(SUPABASE_TABLES.IMAGES)
      .insert({
        url: urlData.publicUrl,
        name,
        category,
        alt_text,
        sort_order: nextOrder,
        is_active: true,
        uploaded_by: user?.id,
      })
      .select()
      .single();

    if (dbError) throw dbError;
    return data;
  },

  /** Delete image from storage and DB */
  delete: async (image: ImageRecord): Promise<void> => {
    /* Extract file path from URL */
    const urlParts = image.url.split('/storage/v1/object/public/images/');
    if (urlParts.length > 1) {
      await supabase.storage
        .from(SUPABASE_BUCKETS.IMAGES)
        .remove([urlParts[1]]);
    }

    /* Delete from DB */
    const { error } = await supabase
      .from(SUPABASE_TABLES.IMAGES)
      .delete()
      .eq('id', image.id);

    if (error) throw error;
  },

  /** Toggle image active status */
  toggleActive: async (id: string, isActive: boolean): Promise<void> => {
    const { error } = await supabase
      .from(SUPABASE_TABLES.IMAGES)
      .update({ is_active: isActive })
      .eq('id', id);

    if (error) throw error;
  },

  /** Update image sort order */
  updateOrder: async (id: string, sortOrder: number): Promise<void> => {
    const { error } = await supabase
      .from(SUPABASE_TABLES.IMAGES)
      .update({ sort_order: sortOrder })
      .eq('id', id);

    if (error) throw error;
  },

  /** Upload direct raw file and return public URL string */
  uploadDirectFile: async (file: File, category: string = 'general'): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${category}/${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(SUPABASE_BUCKETS.IMAGES)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from(SUPABASE_BUCKETS.IMAGES)
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  },
};
