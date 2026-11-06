import React, { forwardRef } from 'react';
import { Search as SearchIcon, X, Loader2 } from 'lucide-react';

export interface SearchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  placeholder?: string;
  isLoading?: boolean;
  shortcut?: string;
  resultCount?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const Search = forwardRef<HTMLInputElement, SearchProps>(({
  value,
  onChange,
  onClear,
  placeholder = 'Search records, leads, companies...',
  isLoading = false,
  shortcut = '⌘K',
  resultCount,
  size = 'md',
  className = '',
  ...props
}, ref) => {
  const sizeClasses = {
    sm: 'text-xs py-1.5 pl-8 pr-16',
    md: 'text-xs py-2 pl-9 pr-20',
    lg: 'text-sm py-2.5 pl-10 pr-24'
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5 left-2.5',
    md: 'w-4 h-4 left-3',
    lg: 'w-4.5 h-4.5 left-3.5'
  };

  return (
    <div className={`relative flex items-center w-full ${className}`}>
      {/* Search Icon or Loading Spinner */}
      <div className={`absolute top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none ${iconSizes[size]}`}>
        {isLoading ? (
          <Loader2 className="w-full h-full animate-spin text-blue-600" />
        ) : (
          <SearchIcon className="w-full h-full" />
        )}
      </div>

      <input
        ref={ref}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-xl border border-slate-200/90 bg-white font-medium text-slate-900 placeholder-slate-400 shadow-2xs transition-all duration-150 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${sizeClasses[size]}`}
        {...props}
      />

      {/* Trailing Controls: Clear Button, Result Count Badge, Shortcut Pill */}
      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
        {resultCount !== undefined && (
          <span className="text-2xs font-semibold px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-500">
            {resultCount}
          </span>
        )}

        {value && onClear ? (
          <button
            type="button"
            onClick={onClear}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : shortcut ? (
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 select-none">
            {shortcut}
          </kbd>
        ) : null}
      </div>
    </div>
  );
});

Search.displayName = 'Search';

