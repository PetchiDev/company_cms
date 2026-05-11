import { useEffect } from 'react';
import { useAuthStore } from '@/features/auth/store/authStore';
import { supabase } from '@/lib/supabase';
import { authService } from '@/api/services/authService';
import type { Session } from '@supabase/supabase-js';

export const useAuth = () => {
  const { user, isLoading, isAuthenticated, isAdmin, setUser, setIsAdmin, setIsLoading, reset } =
    useAuthStore();

  useEffect(() => {
    /* Get initial session */
    const initAuth = async () => {
      try {
        const session = await authService.getSession();
        if (session?.user) {
          const profile = {
            id: session.user.id,
            email: session.user.email || '',
            isAdmin: false,
            createdAt: session.user.created_at || '',
          };

          /* Check admin status */
          const adminStatus = await authService.checkAdmin(session.user.id);
          setIsAdmin(adminStatus);
          setUser(profile);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };

    initAuth();

    /* Listen for auth changes */
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event: string, session: Session | null) => {
        if (session?.user) {
          const profile = {
            id: session.user.id,
            email: session.user.email || '',
            isAdmin: false,
            createdAt: session.user.created_at || '',
          };

          const adminStatus = await authService.checkAdmin(session.user.id);
          setIsAdmin(adminStatus);
          setUser(profile);
        } else {
          reset();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setIsAdmin, setIsLoading, reset]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await authService.signIn(email, password);
      if (data?.user) {
        const profile = {
          id: data.user.id,
          email: data.user.email || '',
          isAdmin: false,
          createdAt: data.user.created_at || '',
        };

        const adminStatus = await authService.checkAdmin(data.user.id);
        if (!adminStatus) {
          throw new Error('You do not have administrator privileges.');
        }

        setIsAdmin(true);
        setUser(profile);
      }
    } catch (err) {
      reset();
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authService.signOut();
    reset();
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    isAdmin,
    login,
    logout,
  };
};
