import { useEffect, useRef, memo } from 'react';
import { gsap } from '@/animations/gsapConfig';

interface AnimatedCounterProps {
  /** Target value to count to */
  target: number;
  /** Suffix to display after the number */
  suffix?: string;
  /** Duration of count animation in seconds (default: 2.5) */
  duration?: number;
  /** Whether to format as Lakh (divide by 100000) */
  formatLakh?: boolean;
  /** Additional CSS class */
  className?: string;
}

/**
 * Animated counter that counts up when scrolled into view.
 * Uses GSAP for smooth interpolation.
 */
const AnimatedCounter = memo(({
  target,
  suffix = '',
  duration = 2.5,
  formatLakh = false,
  className = '',
}: AnimatedCounterProps) => {
  const numberRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = numberRef.current;
    if (!el || hasAnimated.current) return;

    const obj = { val: 0 };

    gsap.to(obj, {
      val: target,
      duration,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
        onEnter: () => {
          hasAnimated.current = true;
        },
      },
      onUpdate: () => {
        if (formatLakh) {
          el.textContent = (obj.val / 100000).toFixed(1);
        } else {
          el.textContent = Math.round(obj.val).toString();
        }
      },
    });
  }, [target, duration, formatLakh]);

  return (
    <div className={`animated-counter ${className}`}>
      <span ref={numberRef} className="animated-counter__number">
        0
      </span>
      {suffix && (
        <span className="animated-counter__suffix">{suffix}</span>
      )}
    </div>
  );
});

AnimatedCounter.displayName = 'AnimatedCounter';

export default AnimatedCounter;
