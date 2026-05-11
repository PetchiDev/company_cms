import { create } from 'zustand';

interface UIStore {
  isMobileMenuOpen: boolean;
  isScrolled: boolean;
  activeDropdown: string | null;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  setIsScrolled: (isScrolled: boolean) => void;
  setActiveDropdown: (dropdown: string | null) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isMobileMenuOpen: false,
  isScrolled: false,
  activeDropdown: null,

  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

  closeMobileMenu: () => set({ isMobileMenuOpen: false }),

  setIsScrolled: (isScrolled) => set({ isScrolled }),

  setActiveDropdown: (dropdown) => set({ activeDropdown: dropdown }),
}));
