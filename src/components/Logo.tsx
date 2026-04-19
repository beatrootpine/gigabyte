import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl',
  };

  return (
    <div className={`flex items-center gap-1 font-display font-bold ${sizeClasses[size]} ${className}`}>
      {/* Main text with gradient */}
      <span className="bg-gradient-to-r from-gigabyte-primary via-gigabyte-accent to-gigabyte-primary bg-clip-text text-transparent">
        Gigabyte
      </span>
      
      {/* Optional accent dot */}
      <span className="text-gigabyte-accent animate-pulse">●</span>
    </div>
  );
};

// Full wordmark version
export const LogoWordmark: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  return (
    <div className={`font-display font-bold ${sizeClasses[size]} tracking-tight ${className}`}>
      <span className="bg-gradient-to-r from-gigabyte-primary to-gigabyte-primary bg-clip-text text-transparent">
        Gigabyte
      </span>
    </div>
  );
};

// Icon version (single letter G)
export const LogoIcon: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-12 h-12 rounded-lg bg-gigabyte-primary flex items-center justify-center ${className}`}>
      <span className="font-display font-bold text-xl text-gigabyte-dark">G</span>
    </div>
  );
};
