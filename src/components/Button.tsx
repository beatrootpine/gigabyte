import type { ReactNode } from 'react';

interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'electric';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
}

export const Button = ({
  onClick,
  disabled = false,
  className = '',
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  fullWidth = false,
}: ButtonProps) => {
  const base = 'font-sans font-semibold rounded-full transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]';

  const sizes = {
    sm: 'px-4 text-sm h-9',
    md: 'px-6 text-sm h-11',
    lg: 'px-8 text-base h-14',
  };

  const variants = {
    primary: 'bg-inverse text-inverse-text hover:opacity-90',
    secondary: 'bg-surface-2 text-text hover:bg-surface-3',
    ghost: 'bg-transparent text-text hover:bg-surface-2',
    outline: 'bg-transparent text-text border border-border-strong hover:bg-surface-2',
    electric: 'bg-electric text-white hover:bg-electric-deep',
  };

  const width = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${width} ${className}`}
    >
      {children}
    </button>
  );
};
