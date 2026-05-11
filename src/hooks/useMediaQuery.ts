import { useState, useEffect } from 'react';
import { BREAKPOINTS } from '@/constants/appConstants';

type Breakpoint = keyof typeof BREAKPOINTS;

export const useMediaQuery = (breakpoint: Breakpoint): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const query = `(max-width: ${BREAKPOINTS[breakpoint]}px)`;
    const media = window.matchMedia(query);

    setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [breakpoint]);

  return matches;
};
