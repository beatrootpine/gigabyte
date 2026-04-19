import React from 'react';

interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  disabled = false,
  className = '',
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
}) => {
  const baseClass = 'font-semibold rounded transition-all duration-200 flex items-center justify-center gap-2';
  
  const sizeClass = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg',
  }[size];

  const variantClass = {
    primary: 'bg-gigabyte-primary text-gigabyte-dark hover:opacity-90 disabled:opacity-50',
    secondary: 'bg-gigabyte-accent text-gigabyte-dark hover:opacity-90 disabled:opacity-50',
    ghost: 'bg-transparent text-gigabyte-primary border-2 border-gigabyte-primary hover:bg-gigabyte-primary hover:text-gigabyte-dark',
  }[variant];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${sizeClass} ${variantClass} ${className}`}
    >
      {children}
    </button>
  );
};
