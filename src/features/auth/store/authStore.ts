import { create } from 'zustand';
import type { UserProfile } from '@/types/auth.types';

interface AuthStore {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  setUser: (user: UserProfile | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  isAdmin: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    }),

  setIsAdmin: (isAdmin) => set({ isAdmin }),

  setIsLoading: (isLoading) => set({ isLoading }),

  reset: () =>
    set({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      isAdmin: false,
    }),
}));
