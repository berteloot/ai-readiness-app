import React from 'react';
import Logo from './Logo';
import IconChevron from './IconChevron';

// Primary Button Component
interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  onClick,
  disabled = false,
  className = '',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        bg-lean-blue text-white font-semibold rounded-lg
        hover:bg-momentum-blue transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        lsg-emphasize
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

// Accent Chip Component
interface AccentChipProps {
  children: React.ReactNode;
  variant?: 'aqua' | 'lavender' | 'orange' | 'sandstone';
  className?: string;
}

export const AccentChip: React.FC<AccentChipProps> = ({
  children,
  variant = 'aqua',
  className = ''
}) => {
  const variantClasses = {
    aqua: 'bg-aqua-breeze text-trust-navy',
    lavender: 'bg-lavender-mist text-trust-navy',
    orange: 'bg-solar-orange text-white',
    sandstone: 'bg-sandstone text-trust-navy'
  };

  return (
    <span
      className={`
        inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

// Card Component
interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  className?: string;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
  style
}) => {
  const variantClasses = {
    default: 'bg-white border border-soft-slate',
    elevated: 'bg-white shadow-lg',
    outlined: 'bg-white border-2 border-lean-blue'
  };

  return (
    <div
      className={`
        rounded-lg p-6
        ${variantClasses[variant]}
        ${className}
      `}
      style={style}
    >
      {children}
    </div>
  );
};

// Navigation Item Component
interface NavItemProps {
  children: React.ReactNode;
  active?: boolean;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export const NavItem: React.FC<NavItemProps> = ({
  children,
  active = false,
  href,
  onClick,
  className = ''
}) => {
  const baseClasses = `
    px-4 py-2 rounded-md font-medium transition-colors duration-200
    ${active 
      ? 'bg-lean-blue text-white' 
      : 'text-midnight-core hover:bg-soft-slate'
    }
  `;

  if (href) {
    return (
      <a href={href} className={`${baseClasses} ${className}`}>
        {children}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${className}`}
    >
      {children}
    </button>
  );
};

// Header Component
interface HeaderProps {
  title: string;
  subtitle?: string;
  showLogo?: boolean;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showLogo = true,
  className = ''
}) => {
  return (
    <header className={`lsg-reveal ${className}`}>
      <div className="flex items-center justify-between">
        {showLogo && (
          <Logo variant="main" size={40} className="mr-8" />
        )}
        <div>
          <h1 className="text-3xl font-bold text-midnight-core">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg text-trust-navy mt-2">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </header>
  );
};

// Feature Grid Component
interface FeatureGridProps {
  features: Array<{
    title: string;
    description: string;
    icon?: React.ReactNode;
  }>;
  className?: string;
}

export const FeatureGrid: React.FC<FeatureGridProps> = ({
  features,
  className = ''
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {features.map((feature, index) => (
        <Card
          key={index}
          className="lsg-stagger"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {feature.icon && (
            <div className="mb-4 text-lean-blue">
              {feature.icon}
            </div>
          )}
          <h3 className="text-xl font-semibold text-midnight-core mb-2">
            {feature.title}
          </h3>
          <p className="text-trust-navy">
            {feature.description}
          </p>
        </Card>
      ))}
    </div>
  );
};

// Usage Examples Component
export const UsageExamples: React.FC = () => {
  const features = [
    {
      title: 'Brand Colors',
      description: 'Use our carefully crafted color palette for consistent branding.',
      icon: <div className="w-8 h-8 bg-lean-blue rounded"></div>
    },
    {
      title: 'Typography',
      description: 'FormaDJR font with Inter fallback for optimal readability.',
      icon: <div className="w-8 h-8 bg-aqua-breeze rounded"></div>
    },
    {
      title: 'Motion',
      description: 'Subtle animations that enhance user experience.',
      icon: <div className="w-8 h-8 bg-solar-orange rounded"></div>
    }
  ];

  return (
    <div className="space-y-8 p-8">
      <Header
        title="LSG Brand System"
        subtitle="Components and examples for consistent design"
      />
      
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-midnight-core">Buttons</h2>
        <div className="flex gap-4">
          <PrimaryButton size="sm">Small Button</PrimaryButton>
          <PrimaryButton size="md">Medium Button</PrimaryButton>
          <PrimaryButton size="lg">Large Button</PrimaryButton>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-midnight-core">Accent Chips</h2>
        <div className="flex gap-4">
          <AccentChip variant="aqua">Aqua Breeze</AccentChip>
          <AccentChip variant="lavender">Lavender Mist</AccentChip>
          <AccentChip variant="orange">Solar Orange</AccentChip>
          <AccentChip variant="sandstone">Sandstone</AccentChip>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-midnight-core">Logo Variants</h2>
        <div className="flex items-center gap-8">
          <Logo variant="main" size={32} />
          <Logo variant="stacked" size={32} />
          <Logo variant="shorthand" size={32} />
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-midnight-core">Icons</h2>
        <div className="flex items-center gap-4">
          <IconChevron direction="up" size={24} color="var(--c-lean-blue)" />
          <IconChevron direction="down" size={24} color="var(--c-lean-blue)" />
          <IconChevron direction="left" size={24} color="var(--c-lean-blue)" />
          <IconChevron direction="right" size={24} color="var(--c-lean-blue)" />
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-midnight-core">Feature Grid</h2>
        <FeatureGrid features={features} />
      </div>
    </div>
  );
};

export default UsageExamples;
