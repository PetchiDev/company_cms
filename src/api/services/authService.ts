import { supabase } from '@/lib/supabase';
import { SUPABASE_TABLES } from '@/constants/appConstants';

export const authService = {
  /** Sign in with email and password */
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  /** Sign up with email and password */
  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  /** Sign out */
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /** Get current session */
  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  /** Check if user is admin */
  checkAdmin: async (userId: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from(SUPABASE_TABLES.ADMINS)
      .select('id')
      .eq('id', userId)
      .single();

    if (error) return false;
    return !!data;
  },

  /** Listen to auth state changes */
  onAuthStateChange: (callback: (event: string, session: unknown) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};
