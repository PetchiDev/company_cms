import { gsap } from './gsapConfig';

/**
 * Apply a 3D tilt effect to an element based on mouse movement.
 * The element will rotate in 3D space following the cursor.
 */
export const tilt3DEffect = (
  element: HTMLElement,
  options?: {
    intensity?: number;
    perspective?: number;
    duration?: number;
  }
) => {
  const { intensity = 10, perspective = 1000, duration = 0.5 } = options || {};

  element.style.perspective = `${perspective}px`;
  element.style.transformStyle = 'preserve-3d';

  const handleMouseMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

    gsap.to(element, {
      rotateX: -y * intensity,
      rotateY: x * intensity,
      duration,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    gsap.to(element, {
      rotateX: 0,
      rotateY: 0,
      duration: duration * 1.5,
      ease: 'elastic.out(1, 0.5)',
    });
  };

  element.addEventListener('mousemove', handleMouseMove);
  element.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    element.removeEventListener('mousemove', handleMouseMove);
    element.removeEventListener('mouseleave', handleMouseLeave);
  };
};

/**
 * Parallax effect that moves elements based on mouse position.
 * Elements at different depths move at different speeds.
 */
export const parallaxMouseMove = (
  container: HTMLElement,
  layers: { element: HTMLElement; speed: number }[]
) => {
  const handleMouseMove = (e: MouseEvent) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;

    layers.forEach(({ element, speed }) => {
      gsap.to(element, {
        x: x * speed * 30,
        y: y * speed * 30,
        duration: 0.8,
        ease: 'power2.out',
      });
    });
  };

  container.addEventListener('mousemove', handleMouseMove);
  return () => container.removeEventListener('mousemove', handleMouseMove);
};

/**
 * Split text into individual characters/words and animate their reveal.
 */
export const splitTextReveal = (
  element: HTMLElement,
  options?: {
    type?: 'chars' | 'words';
    stagger?: number;
    duration?: number;
    y?: number;
    trigger?: HTMLElement | string;
  }
) => {
  const {
    type = 'words',
    stagger = 0.05,
    duration = 0.8,
    y = 60,
    trigger,
  } = options || {};

  const text = element.textContent || '';
  element.textContent = '';
  element.style.overflow = 'hidden';

  const units =
    type === 'chars' ? text.split('') : text.split(' ');

  const spans = units.map((unit, i) => {
    const wrapper = document.createElement('span');
    wrapper.style.display = 'inline-block';
    wrapper.style.overflow = 'hidden';
    wrapper.style.verticalAlign = 'top';

    const inner = document.createElement('span');
    inner.textContent = unit + (type === 'words' && i < units.length - 1 ? '\u00A0' : '');
    inner.style.display = 'inline-block';
    inner.style.transform = `translateY(${y}px)`;
    inner.style.opacity = '0';

    wrapper.appendChild(inner);
    element.appendChild(wrapper);
    return inner;
  });

  return gsap.to(spans, {
    y: 0,
    opacity: 1,
    duration,
    stagger,
    ease: 'power3.out',
    scrollTrigger: trigger
      ? {
          trigger,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        }
      : undefined,
  });
};

/**
 * Creates an animated glow border effect on hover.
 */
export const glowBorderEffect = (element: HTMLElement) => {
  const handleMouseMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    element.style.setProperty('--glow-x', `${x}px`);
    element.style.setProperty('--glow-y', `${y}px`);
  };

  element.addEventListener('mousemove', handleMouseMove);
  return () => element.removeEventListener('mousemove', handleMouseMove);
};

/**
 * Staggered 3D entrance — cards rotate in from below with depth.
 */
export const stagger3DEntrance = (
  elements: HTMLElement[] | NodeListOf<HTMLElement>,
  options?: {
    stagger?: number;
    duration?: number;
    rotateX?: number;
    trigger?: HTMLElement | string;
  }
) => {
  const {
    stagger = 0.1,
    duration = 0.8,
    rotateX = 15,
    trigger,
  } = options || {};

  return gsap.fromTo(
    elements,
    {
      opacity: 0,
      y: 60,
      rotateX,
      transformPerspective: 1000,
      filter: 'blur(4px)',
    },
    {
      opacity: 1,
      y: 0,
      rotateX: 0,
      filter: 'blur(0px)',
      duration,
      stagger,
      ease: 'power3.out',
      scrollTrigger: trigger
        ? {
            trigger,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          }
        : undefined,
    }
  );
};
