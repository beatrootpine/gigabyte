import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSearch,
  placeholder = 'Search events...',
}) => {
  return (
    <div className="relative w-full">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gigabyte-text-muted">
        <Search size={20} />
      </div>
      
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            onSearch?.(value);
          }
        }}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-3 bg-gigabyte-surface text-gigabyte-text placeholder-gigabyte-text-muted rounded-lg border border-gigabyte-dark focus:border-gigabyte-primary focus:outline-none transition-colors"
      />
      
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gigabyte-text-muted hover:text-gigabyte-text"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
};
