import React from 'react';
import './Skeleton.css';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rect' | 'circle';
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
}

const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  variant = 'rect', 
  width, 
  height,
  borderRadius
}) => {
  const styles: React.CSSProperties = {
    width,
    height,
    borderRadius: borderRadius ?? (variant === 'circle' ? '50%' : variant === 'text' ? '4px' : '1rem')
  };

  return (
    <div 
      className={`skeleton skeleton--${variant} ${className}`} 
      style={styles}
      aria-hidden="true"
    />
  );
};

export default Skeleton;
