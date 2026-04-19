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
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-ink-400 group-focus-within:text-ink-50 transition-colors pointer-events-none">
        <Search size={18} strokeWidth={2} />
      </div>
      
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && onSearch?.(value)}
        placeholder={placeholder}
        className="w-full h-12 pl-14 pr-12 bg-ink-900 text-ink-50 placeholder-ink-500 rounded-full border border-ink-800 focus:border-ink-600 focus:outline-none transition-all text-sm font-medium"
      />
      
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-50 p-1 transition-colors"
        >
          <X size={18} strokeWidth={2} />
        </button>
      )}
    </div>
  );
};
