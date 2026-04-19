import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const ThemeToggle = ({ className = '' }: { className?: string }) => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className={`w-10 h-10 bg-surface-2 rounded-full border border-border hover:border-border-strong flex items-center justify-center transition-colors ${className}`}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun size={16} className="text-text" strokeWidth={2.5} />
      ) : (
        <Moon size={16} className="text-text" strokeWidth={2.5} />
      )}
    </button>
  );
};
