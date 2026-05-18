import { useEffect } from 'react';

export const useScrollLock = (lock: boolean) => {
  useEffect(() => {
    if (lock) {
      document.body.style.overflow = 'hidden';
      /* Optional: Add padding-right to body to prevent content jump if scrollbar disappears */
      document.body.style.paddingRight = 'var(--scrollbar-width, 0px)';
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [lock]);
};
