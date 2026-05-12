import { useState, useEffect, useCallback, useRef } from 'react';

interface Mouse3DValues {
  rotateX: number;
  rotateY: number;
  translateX: number;
  translateY: number;
  mouseX: number;
  mouseY: number;
}

interface UseMouse3DOptions {
  /** Max rotation in degrees (default: 8) */
  intensity?: number;
  /** Smoothing factor 0-1 (default: 0.1) */
  smoothing?: number;
  /** Whether to track globally or only within a ref element */
  global?: boolean;
}

/**
 * Hook that tracks mouse position and calculates 3D tilt values.
 * Used for perspective card tilts and parallax effects.
 */
export const useMouse3D = (options: UseMouse3DOptions = {}) => {
  const { intensity = 8, smoothing = 0.1, global = false } = options;
  const ref = useRef<HTMLDivElement>(null);
  const animationFrame = useRef<number>(0);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  const [values, setValues] = useState<Mouse3DValues>({
    rotateX: 0,
    rotateY: 0,
    translateX: 0,
    translateY: 0,
    mouseX: 0,
    mouseY: 0,
  });

  const lerp = useCallback(
    (start: number, end: number, factor: number) =>
      start + (end - start) * factor,
    []
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const element = ref.current;
      if (!element && !global) return;

      let normalizedX: number;
      let normalizedY: number;

      if (global) {
        normalizedX = (e.clientX / window.innerWidth - 0.5) * 2;
        normalizedY = (e.clientY / window.innerHeight - 0.5) * 2;
      } else if (element) {
        const rect = element.getBoundingClientRect();
        normalizedX =
          ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        normalizedY =
          ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      } else {
        return;
      }

      target.current = { x: normalizedX, y: normalizedY };
    },
    [global]
  );

  const handleMouseLeave = useCallback(() => {
    target.current = { x: 0, y: 0 };
  }, []);

  const animate = useCallback(() => {
    current.current.x = lerp(
      current.current.x,
      target.current.x,
      smoothing
    );
    current.current.y = lerp(
      current.current.y,
      target.current.y,
      smoothing
    );

    setValues({
      rotateX: -current.current.y * intensity,
      rotateY: current.current.x * intensity,
      translateX: current.current.x * intensity * 2,
      translateY: current.current.y * intensity * 2,
      mouseX: current.current.x,
      mouseY: current.current.y,
    });

    animationFrame.current = requestAnimationFrame(animate);
  }, [intensity, smoothing, lerp]);

  useEffect(() => {
    const el = global ? window : ref.current;
    if (!el) return;

    el.addEventListener('mousemove', handleMouseMove as EventListener);

    if (!global && ref.current) {
      ref.current.addEventListener('mouseleave', handleMouseLeave);
    }

    animationFrame.current = requestAnimationFrame(animate);

    return () => {
      el.removeEventListener(
        'mousemove',
        handleMouseMove as EventListener
      );
      if (!global && ref.current) {
        ref.current.removeEventListener(
          'mouseleave',
          handleMouseLeave
        );
      }
      cancelAnimationFrame(animationFrame.current);
    };
  }, [global, handleMouseMove, handleMouseLeave, animate]);

  return { ref, ...values };
};
