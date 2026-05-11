import { useEffect, useRef, useCallback } from 'react';
import { gsap } from '@/animations/gsapConfig';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Hook to create GSAP scroll-triggered animations
 * Handles cleanup automatically on unmount
 */
export const useScrollAnimation = () => {
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const createTimeline = useCallback(
    (triggerElement: string | Element, options?: ScrollTrigger.Vars) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
          ...options,
        },
      });

      timelineRef.current = tl;
      return tl;
    },
    []
  );

  const fadeInUp = useCallback(
    (
      elements: string | Element | Element[],
      options?: {
        trigger?: string | Element;
        y?: number;
        stagger?: number;
        duration?: number;
      }
    ) => {
      const { trigger, y = 50, stagger = 0.15, duration = 0.8 } = options || {};

      return gsap.fromTo(
        elements,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          stagger,
          scrollTrigger: {
            trigger: trigger || (typeof elements === 'string' ? elements : undefined),
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    },
    []
  );

  useEffect(() => {
    return () => {
      timelineRef.current?.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return { createTimeline, fadeInUp, gsap };
};
