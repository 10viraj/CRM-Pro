import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'rounded';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rounded',
  ...props
}) => {
  const variantClasses = {
    rectangular: 'rounded-none',
    circular: 'rounded-full',
    rounded: 'rounded-xl'
  };

  return (
    <div
      className={`animate-pulse bg-slate-200/80 ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
};

export const SkeletonText: React.FC<{
  lines?: number;
  className?: string;
}> = ({ lines = 3, className = '' }) => {
  const widths = ['w-full', 'w-11/12', 'w-4/5', 'w-3/4', 'w-2/3'];

  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, idx) => (
        <Skeleton
          key={idx}
          className={`h-3.5 ${widths[idx % widths.length]}`}
        />
      ))}
    </div>
  );
};

export const SkeletonAvatar: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12'
  };

  return <Skeleton className={`${sizeClasses[size]} rounded-xl ${className}`} />;
};

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`p-5 rounded-2xl border border-slate-200 bg-white space-y-4 ${className}`}>
      <div className="flex items-center gap-3">
        <SkeletonAvatar size="md" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <SkeletonText lines={2} />
      <div className="pt-2 flex items-center justify-between">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-6 w-16 rounded-lg" />
      </div>
    </div>
  );
};

export const SkeletonTable: React.FC<{
  rows?: number;
  columns?: number;
  className?: string;
}> = ({ rows = 5, columns = 5, className = '' }) => {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white overflow-hidden ${className}`}>
      <div className="p-3 bg-slate-50 border-b border-slate-100 flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      <div className="divide-y divide-slate-100 p-2">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="py-3 px-2 flex gap-4 items-center">
            {Array.from({ length: columns }).map((_, c) => (
              <Skeleton key={c} className="h-3.5 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

