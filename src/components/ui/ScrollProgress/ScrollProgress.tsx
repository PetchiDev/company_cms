import { useEffect, useRef, memo } from 'react';
import { gsap, ScrollTrigger } from '@/animations/gsapConfig';
import './ScrollProgress.css';

/**
 * Fixed top progress bar showing page scroll position.
 * Uses GSAP ScrollTrigger for smooth tracking.
 */
const ScrollProgress = memo(() => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const trigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        gsap.set(bar, { scaleX: self.progress });
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <div className="scroll-progress" aria-hidden="true">
      <div ref={barRef} className="scroll-progress__bar" />
    </div>
  );
});

ScrollProgress.displayName = 'ScrollProgress';

export default ScrollProgress;
