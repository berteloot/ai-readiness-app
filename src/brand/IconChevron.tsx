import React from 'react';

interface IconChevronProps {
  direction?: 'up' | 'down' | 'left' | 'right';
  size?: number;
  color?: string;
  className?: string;
  strokeWidth?: number;
}

const IconChevron: React.FC<IconChevronProps> = ({
  direction = 'right',
  size = 32,
  color = 'currentColor',
  className = '',
  strokeWidth = 2
}) => {
  const baseClasses = 'inline-block';
  const combinedClasses = `${baseClasses} ${className}`;

  const getPath = () => {
    switch (direction) {
      case 'up':
        return 'M8 14l8-8 8 8';
      case 'down':
        return 'M8 10l8 8 8-8';
      case 'left':
        return 'M14 8l-8 8 8 8';
      case 'right':
      default:
        return 'M10 8l8 8-8 8';
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={combinedClasses}
    >
      <path d={getPath()} />
    </svg>
  );
};

export default IconChevron;
