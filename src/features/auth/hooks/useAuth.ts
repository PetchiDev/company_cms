import { useEffect } from 'react';
import { useAuthStore } from '@/features/auth/store/authStore';
import { supabase } from '@/lib/supabase';
import { authService } from '@/api/services/authService';
import type { Session } from '@supabase/supabase-js';

export const useAuth = () => {
  const { user, isLoading, isAuthenticated, isAdmin, setUser, setIsAdmin, setIsLoading, reset } =
    useAuthStore();

  useEffect(() => {
    const timeoutPromise = (ms: number) => new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timed out')), ms)
    );

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

          /* Check admin status with timeout */
          const adminStatus = await Promise.race([
            authService.checkAdmin(session.user.id),
            timeoutPromise(10000)
          ]) as boolean;

          setIsAdmin(adminStatus);
          setUser(profile);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
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

          try {
            const adminStatus = await Promise.race([
              authService.checkAdmin(session.user.id),
              timeoutPromise(10000)
            ]) as boolean;
            setIsAdmin(adminStatus);
            setUser(profile);
          } catch (err) {
            console.error('Auth state change admin check error:', err);
            /* On timeout/error, we don't necessarily want to kick them out, 
               but we can't confirm admin status */
          }
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
    
    /* Create a timeout promise */
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Login request timed out. Please check your connection.')), 15000)
    );

    try {
      /* Race the login request against the timeout */
      const data = await Promise.race([
        authService.signIn(email, password),
        timeout
      ]) as any;

      if (data?.user) {
        const profile = {
          id: data.user.id,
          email: data.user.email || '',
          isAdmin: false,
          createdAt: data.user.created_at || '',
        };

        const adminStatus = await Promise.race([
          authService.checkAdmin(data.user.id),
          timeout
        ]) as boolean;

        if (!adminStatus) {
          throw new Error('Access Denied: You do not have administrator privileges.');
        }

        setIsAdmin(true);
        setUser(profile);
      }
    } catch (err: any) {
      reset();
      /* Specifically handle common Supabase errors */
      if (err?.message?.includes('Invalid login credentials')) {
        throw new Error('Invalid email or password.');
      }
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
