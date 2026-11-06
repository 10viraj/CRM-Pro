import React from 'react';

export interface AvatarProps {
  name: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'busy' | 'away' | 'offline';
  className?: string;
  bg?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  src,
  size = 'md',
  status,
  className = '',
  bg
}) => {
  const initials = name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-7 h-7 text-xs',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm',
    xl: 'w-12 h-12 text-base'
  };

  const statusDotSizes = {
    xs: 'w-1.5 h-1.5 ring-1',
    sm: 'w-2 h-2 ring-1.5',
    md: 'w-2.5 h-2.5 ring-2',
    lg: 'w-3 h-3 ring-2',
    xl: 'w-3.5 h-3.5 ring-2'
  };

  const statusColors = {
    online: 'bg-emerald-500',
    busy: 'bg-rose-500',
    away: 'bg-amber-500',
    offline: 'bg-slate-400'
  };

  const defaultBg = bg || 'bg-blue-600 text-white';

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={`rounded-xl object-cover border border-slate-200/80 shadow-2xs ${sizeClasses[size]}`}
        />
      ) : (
        <div
          className={`rounded-xl font-bold flex items-center justify-center border border-white/20 shadow-2xs select-none ${defaultBg} ${sizeClasses[size]}`}
        >
          {initials}
        </div>
      )}

      {status && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 rounded-full ring-white ${statusColors[status]} ${statusDotSizes[size]}`}
          title={`Status: ${status}`}
        />
      )}
    </div>
  );
};

export interface AvatarGroupProps {
  children: React.ReactNode;
  max?: number;
  className?: string;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  children,
  max = 4,
  className = ''
}) => {
  const childrenArray = React.Children.toArray(children);
  const visibleAvatars = childrenArray.slice(0, max);
  const remainingCount = childrenArray.length - max;

  return (
    <div className={`flex items-center -space-x-2 overflow-hidden ${className}`}>
      {visibleAvatars.map((child, index) => (
        <div key={index} className="inline-block ring-2 ring-white rounded-xl">
          {child}
        </div>
      ))}
      {remainingCount > 0 && (
        <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 ring-2 ring-white text-slate-600 font-bold text-2xs flex items-center justify-center select-none shrink-0">
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

