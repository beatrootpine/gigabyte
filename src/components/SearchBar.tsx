import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
}

export const SearchBar = ({
  value,
  onChange,
  onSearch,
  placeholder = 'Search events, venues, artists...',
}: SearchBarProps) => {
  return (
    <div className="relative w-full group">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-text transition-colors pointer-events-none">
        <Search size={18} strokeWidth={2} />
      </div>
      
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && onSearch?.(value)}
        placeholder={placeholder}
        className="w-full h-12 pl-14 pr-12 bg-surface-2 text-text placeholder-text-subtle rounded-full border border-border focus:border-border-strong focus:outline-none transition-all text-sm font-medium"
      />
      
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text p-1 transition-colors"
        >
          <X size={18} strokeWidth={2} />
        </button>
      )}
    </div>
  );
};
