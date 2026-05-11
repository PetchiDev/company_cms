import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/* Register GSAP plugins */
gsap.registerPlugin(ScrollTrigger);

/* Global GSAP defaults */
gsap.defaults({
  ease: 'power3.out',
  duration: 0.8,
});

/* ScrollTrigger defaults */
ScrollTrigger.defaults({
  toggleActions: 'play none none reverse',
  start: 'top 85%',
  end: 'bottom 15%',
});

export { gsap, ScrollTrigger };
