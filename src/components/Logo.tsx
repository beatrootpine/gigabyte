interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  color?: 'default' | 'electric' | 'white' | 'black';
}

export const Logo = ({ size = 'md', className = '', color = 'default' }: LogoProps) => {
  const sizeMap = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-6xl',
  };

  const colorMap = {
    default: 'text-text',
    electric: 'text-electric',
    white: 'text-white',
    black: 'text-ink-950',
  };

  return (
    <span
      className={`inline-block font-display font-bold tracking-tight leading-none ${sizeMap[size]} ${colorMap[color]} ${className}`}
      style={{ letterSpacing: '-0.02em' }}
    >
      Gigabyte
    </span>
  );
};
