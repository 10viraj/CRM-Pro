import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  options: SelectOption[];
  helperText?: string;
  error?: string;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  options,
  helperText,
  error,
  icon,
  size = 'md',
  placeholder,
  className = '',
  disabled,
  id,
  ...props
}, ref) => {
  const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  const sizeClasses = {
    sm: 'text-xs py-2 sm:py-1.5 pl-3 pr-8',
    md: 'text-xs py-2.5 sm:py-2 pl-3.5 pr-8 min-h-[42px] sm:min-h-0',
    lg: 'text-sm py-3 sm:py-2.5 pl-4 pr-9 min-h-[46px]'
  };

  const hasIconPadding = icon ? 'pl-9' : '';

  return (
    <div className="w-full space-y-1">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-semibold text-slate-700 select-none"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center justify-center">
            {icon}
          </div>
        )}

        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          className={`w-full appearance-none rounded-xl border bg-white font-medium text-slate-900 transition-all duration-150 focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed cursor-pointer ${
            error
              ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
              : 'border-slate-200/90 focus:border-blue-500 focus:ring-blue-500/20 shadow-2xs'
          } ${sizeClasses[size]} ${hasIconPadding} ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map(opt => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {error ? (
        <p className="text-2xs font-medium text-rose-600 animate-in fade-in duration-150">
          {error}
        </p>
      ) : helperText ? (
        <p className="text-2xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
});

Select.displayName = 'Select';

