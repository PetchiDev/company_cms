import { useRef, useCallback, useEffect } from 'react';
import { gsap } from '@/animations/gsapConfig';

interface MagneticOptions {
  /** How far the element follows the cursor (default: 0.3) */
  strength?: number;
  /** Detection radius in pixels (default: 100) */
  radius?: number;
  /** Animation duration (default: 0.4) */
  duration?: number;
}

/**
 * Creates a magnetic pull effect — the element subtly follows
 * the cursor when hovering nearby, then springs back.
 */
export const useMagneticEffect = (options: MagneticOptions = {}) => {
  const { strength = 0.3, radius = 100, duration = 0.4 } = options;
  const ref = useRef<HTMLElement>(null);

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const distance = Math.sqrt(distX * distX + distY * distY);

      if (distance < radius) {
        gsap.to(el, {
          x: distX * strength,
          y: distY * strength,
          duration,
          ease: 'power2.out',
        });
      }
    },
    [strength, radius, duration]
  );

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    gsap.to(el, {
      x: 0,
      y: 0,
      duration: duration * 1.5,
      ease: 'elastic.out(1, 0.3)',
    });
  }, [duration]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const parent = el.parentElement || document;
    parent.addEventListener('mousemove', onMouseMove as EventListener);
    el.addEventListener('mouseleave', onMouseLeave);

    return () => {
      parent.removeEventListener(
        'mousemove',
        onMouseMove as EventListener
      );
      el.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [onMouseMove, onMouseLeave]);

  return ref;
};
