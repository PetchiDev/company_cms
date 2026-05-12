import { type ReactNode, type CSSProperties, memo } from 'react';
import { Link } from 'react-router-dom';
import { useMagneticEffect } from '@/hooks/useMagneticEffect';
import './MagneticButton.css';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  variant?: 'primary' | 'orange' | 'outline' | 'ghost' | 'premium';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Magnetic pull strength (default: 0.3) */
  strength?: number;
  disabled?: boolean;
  type?: 'button' | 'submit';
  onClick?: () => void;
  /** Render as React Router Link */
  to?: string;
  /** Render as external link */
  href?: string;
  target?: string;
  rel?: string;
}

/**
 * Button with magnetic pull effect and glowing hover state.
 */
const MagneticButton = memo(({
  children,
  className = '',
  style,
  variant = 'primary',
  size = 'md',
  strength = 0.3,
  disabled = false,
  type = 'button',
  onClick,
  to,
  href,
  target,
  rel,
}: MagneticButtonProps) => {
  const magneticRef = useMagneticEffect({ strength, radius: 100 });

  const commonProps = {
    ref: magneticRef as any,
    className: `magnetic-btn magnetic-btn--${variant} magnetic-btn--${size} ${className}`,
    style,
    onClick,
  };

  const content = (
    <>
      <span className="magnetic-btn__text">{children}</span>
      <span className="magnetic-btn__glow" />
      <span className="magnetic-btn__shimmer" />
    </>
  );

  if (to) {
    return (
      <Link {...commonProps} to={to}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a {...commonProps} href={href} target={target} rel={rel}>
        {content}
      </a>
    );
  }

  return (
    <button {...commonProps} type={type} disabled={disabled}>
      {content}
    </button>
  );
});

MagneticButton.displayName = 'MagneticButton';

export default MagneticButton;
