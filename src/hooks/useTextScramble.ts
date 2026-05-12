import { useState, useEffect, useRef, useCallback } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';

interface UseTextScrambleOptions {
  /** Final resolved text */
  text: string;
  /** Speed of character cycling in ms (default: 30) */
  speed?: number;
  /** Delay before starting in ms (default: 0) */
  delay?: number;
  /** Number of cycles per character before resolving (default: 5) */
  cycles?: number;
  /** Whether to trigger the effect (default: true) */
  trigger?: boolean;
}

/**
 * Text scramble/decode effect — characters shuffle randomly
 * before resolving to the final string. Fits the "Kryptos" branding.
 */
export const useTextScramble = (options: UseTextScrambleOptions) => {
  const {
    text,
    speed = 30,
    delay = 0,
    cycles = 5,
    trigger = true,
  } = options;

  const [displayText, setDisplayText] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const scramble = useCallback(() => {
    let iteration = 0;
    const totalIterations = text.length * cycles;

    intervalRef.current = setInterval(() => {
      const resolved = Math.floor(iteration / cycles);

      const result = text
        .split('')
        .map((char, index) => {
          if (char === ' ') return ' ';
          if (index < resolved) return text[index];
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join('');

      setDisplayText(result);
      iteration++;

      if (iteration > totalIterations) {
        setDisplayText(text);
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, speed);
  }, [text, speed, cycles]);

  useEffect(() => {
    if (!trigger) return;

    setDisplayText(
      text
        .split('')
        .map((c) =>
          c === ' ' ? ' ' : CHARS[Math.floor(Math.random() * CHARS.length)]
        )
        .join('')
    );

    timeoutRef.current = setTimeout(scramble, delay);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [trigger, scramble, delay, text]);

  return displayText;
};
