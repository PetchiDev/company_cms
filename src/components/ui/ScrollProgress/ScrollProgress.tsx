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

    // Reset bar
    gsap.set(bar, { scaleX: 0 });

    const trigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        // Hide bar if not scrollable (total height <= viewport height)
        const isScrollable = document.documentElement.scrollHeight > window.innerHeight;
        gsap.set(bar.parentElement, { opacity: isScrollable ? 1 : 0 });

        // Use gsap.to for smoother catching up if the page height jumps
        gsap.to(bar, { 
          scaleX: self.progress, 
          duration: 0.2, 
          ease: 'none',
          overwrite: 'auto'
        });
      },
    });

    // Refresh ScrollTrigger when images or dynamic content load
    const refreshHandler = () => ScrollTrigger.refresh();
    window.addEventListener('load', refreshHandler);
    window.addEventListener('resize', refreshHandler);

    // Watch for DOM changes (body height) to refresh trigger
    const resizeObserver = new ResizeObserver(() => {
      ScrollTrigger.refresh();
    });
    resizeObserver.observe(document.body);

    return () => {
      trigger.kill();
      window.removeEventListener('load', refreshHandler);
      window.removeEventListener('resize', refreshHandler);
      resizeObserver.disconnect();
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
