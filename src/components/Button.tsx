import type { ReactNode } from 'react';

interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
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
    sm: 'px-4 py-2 text-sm h-9',
    md: 'px-6 py-3 text-sm h-11',
    lg: 'px-8 py-4 text-base h-14',
  };

  const variants = {
    primary: 'bg-ink-50 text-ink-950 hover:bg-white',
    secondary: 'bg-electric text-ink-50 hover:bg-electric-soft',
    ghost: 'bg-ink-900 text-ink-50 hover:bg-ink-800 border border-ink-800',
    outline: 'bg-transparent text-ink-50 hover:bg-ink-900 border border-ink-700',
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
