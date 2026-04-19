interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Logo = ({ size = 'md', className = '' }: LogoProps) => {
  const sizeMap = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  return (
    <div className={`font-display font-extrabold tracking-tightest ${sizeMap[size]} ${className}`}>
      <span className="text-ink-50">gigabyte</span>
      <span className="text-electric">.</span>
    </div>
  );
};
