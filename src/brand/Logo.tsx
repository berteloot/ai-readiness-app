import React from 'react';
import Image from 'next/image';

interface LogoProps {
  variant?: 'main' | 'stacked' | 'shorthand';
  size?: number;
  color?: string;
  className?: string;
  showChevron?: boolean;
}

const Logo: React.FC<LogoProps> = ({
  variant = 'main',
  size = 32,
  color = 'var(--c-lean-blue)',
  className = '',
  showChevron = true
}) => {
  const baseClasses = 'inline-flex items-center';
  const combinedClasses = `${baseClasses} ${className}`;

  // Main logo with full text and chevron
  if (variant === 'main') {
    return (
      <div className={combinedClasses} style={{ color }}>
        <div className="flex items-center">
          {/* Chevron icon */}
          {showChevron && (
            <svg
              width={size * 0.6}
              height={size * 0.6}
              viewBox="0 0 32 32"
              fill="currentColor"
              className="mr-2"
            >
              <path d="M2 8h12v2H2V8zm0 4h12v2H2v-2zm0 4h12v2H2v-2zm0 4h12v2H2v-2z" />
            </svg>
          )}
          
          {/* Logo image */}
          <Image
            src="/LSG_Logo_Horizontal_RGB_Lean Blue.png"
            alt="Lean Solutions Group"
            width={size * 3}
            height={size}
            className="h-auto"
            priority
          />
        </div>
      </div>
    );
  }

  // Stacked version (two lines)
  if (variant === 'stacked') {
    return (
      <div className={combinedClasses} style={{ color }}>
        <div className="flex flex-col items-center">
          {/* Chevron icon */}
          {showChevron && (
            <svg
              width={size * 0.5}
              height={size * 0.5}
              viewBox="0 0 32 32"
              fill="currentColor"
              className="mb-1"
            >
              <path d="M2 8h12v2H2V8zm0 4h12v2H2v-2zm0 4h12v2H2v-2zm0 4h12v2H2v-2z" />
            </svg>
          )}
          
          {/* Logo image - stacked */}
          <Image
            src="/LSG_Logo_Horizontal_RGB_Lean Blue.png"
            alt="Lean Solutions Group"
            width={size * 2.5}
            height={size * 0.8}
            className="h-auto"
            priority
          />
        </div>
      </div>
    );
  }

  // Shorthand version (LSG only)
  if (variant === 'shorthand') {
    return (
      <div className={combinedClasses} style={{ color }}>
        <div className="flex items-center">
          {/* Chevron icon */}
          {showChevron && (
            <svg
              width={size * 0.6}
              height={size * 0.6}
              viewBox="0 0 32 32"
              fill="currentColor"
              className="mr-1"
            >
              <path d="M2 8h12v2H2V8zm0 4h12v2H2v-2zm0 4h12v2H2v-2zm0 4h12v2H2v-2z" />
            </svg>
          )}
          
          {/* LSG text */}
          <span 
            className="font-bold tracking-wide"
            style={{ fontSize: `${size}px` }}
          >
            LSG
          </span>
        </div>
      </div>
    );
  }

  return null;
};

export default Logo;
