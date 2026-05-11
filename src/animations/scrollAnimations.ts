import { gsap, ScrollTrigger } from './gsapConfig';

/**
 * Fade in elements from bottom when scrolled into view
 */
export const fadeInOnScroll = (
  elements: string | Element | Element[],
  options?: {
    y?: number;
    duration?: number;
    stagger?: number;
    delay?: number;
    trigger?: string | Element;
  }
) => {
  const { y = 50, duration = 0.8, stagger = 0.15, delay = 0, trigger } = options || {};

  return gsap.fromTo(
    elements,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration,
      delay,
      stagger,
      scrollTrigger: {
        trigger: trigger || (typeof elements === 'string' ? elements : undefined),
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    }
  );
};

/**
 * Parallax background effect on scroll
 */
export const parallaxEffect = (
  element: string | Element,
  options?: { speed?: number; trigger?: string | Element }
) => {
  const { speed = 0.3, trigger } = options || {};

  return gsap.to(element, {
    yPercent: -30 * speed,
    ease: 'none',
    scrollTrigger: {
      trigger: trigger || element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
};

/**
 * Counter animation — counts from 0 to target value
 */
export const animateCounter = (
  element: Element,
  targetValue: number,
  options?: { duration?: number; trigger?: string | Element }
) => {
  const { duration = 2, trigger } = options || {};
  const counter = { value: 0 };

  return gsap.to(counter, {
    value: targetValue,
    duration,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: trigger || element,
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
    onUpdate: () => {
      if (targetValue >= 1000) {
        element.textContent = Math.round(counter.value).toLocaleString();
      } else {
        element.textContent = Math.round(counter.value).toString();
      }
    },
  });
};

/**
 * Text reveal animation — characters appear one by one
 */
export const textReveal = (
  element: string | Element,
  options?: { duration?: number; stagger?: number }
) => {
  const { duration = 0.6, stagger = 0.02 } = options || {};
  const el = typeof element === 'string' ? document.querySelector(element) : element;
  if (!el || !el.textContent) return;

  const text = el.textContent;
  el.textContent = '';
  const chars = text.split('').map((char) => {
    const span = document.createElement('span');
    span.textContent = char;
    span.style.display = 'inline-block';
    span.style.opacity = '0';
    el.appendChild(span);
    return span;
  });

  return gsap.to(chars, {
    opacity: 1,
    y: 0,
    duration,
    stagger,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
  });
};

/**
 * Infinite marquee / horizontal scroll
 */
export const createMarquee = (
  container: string | Element,
  options?: { speed?: number; direction?: 'left' | 'right' }
) => {
  const { speed = 30, direction = 'left' } = options || {};
  const el =
    typeof container === 'string' ? document.querySelector(container) : container;
  if (!el) return;

  const scrollWidth = (el as HTMLElement).scrollWidth;
  const distance = scrollWidth / 2;

  return gsap.to(el, {
    x: direction === 'left' ? -distance : distance,
    duration: distance / speed,
    ease: 'none',
    repeat: -1,
    modifiers: {
      x: gsap.utils.unitize((x: number) => {
        return parseFloat(String(x)) % distance;
      }),
    },
  });
};

/**
 * Cleanup all ScrollTrigger instances (call on unmount)
 */
export const cleanupScrollTriggers = () => {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
};
