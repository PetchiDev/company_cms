import { useRef, type ReactNode, type CSSProperties, memo } from 'react';
import { useMouse3D } from '@/hooks/useMouse3D';
import './GlassCard.css';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** 3D tilt intensity (default: 6) */
  tiltIntensity?: number;
  /** Whether to show glow border on hover (default: true) */
  glowBorder?: boolean;
  /** onClick handler */
  onClick?: () => void;
  /** HTML element to render as */
  as?: 'div' | 'article' | 'section';
}

/**
 * Glassmorphism card with mouse-tracked 3D tilt and animated glow border.
 */
const GlassCard = memo(({
  children,
  className = '',
  style,
  tiltIntensity = 6,
  glowBorder = true,
  onClick,
  as: Tag = 'div',
}: GlassCardProps) => {
  const { ref, rotateX, rotateY, mouseX, mouseY } = useMouse3D({
    intensity: tiltIntensity,
    smoothing: 0.08,
  });

  const glowRef = useRef<HTMLDivElement>(null);

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement>}
      className={`glass-card ${glowBorder ? 'glass-card--glow' : ''} ${className}`}
      style={{
        ...style,
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        '--glow-x': `${(mouseX + 1) * 50}%`,
        '--glow-y': `${(mouseY + 1) * 50}%`,
      } as CSSProperties}
      onClick={onClick}
    >
      {glowBorder && <div ref={glowRef} className="glass-card__glow" />}
      <div className="glass-card__content">{children}</div>
    </Tag>
  );
});

GlassCard.displayName = 'GlassCard';

export default GlassCard;
