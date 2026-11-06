import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'flat' | 'interactive';
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  children,
  className = '',
  ...props
}) => {
  const variantClasses = {
    default: 'bg-white border border-slate-200/90 shadow-2xs',
    elevated: 'bg-white border border-slate-200/80 shadow-card',
    flat: 'bg-slate-50 border border-slate-200',
    interactive: 'bg-white border border-slate-200/90 shadow-2xs hover:shadow-card hover:border-slate-300 transition-all duration-150 cursor-pointer'
  };

  return (
    <div
      className={`rounded-2xl overflow-hidden ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}> = ({ title, subtitle, action, className = '', children }) => {
  if (children) {
    return (
      <div className={`p-5 pb-3 border-b border-slate-100 ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <div className={`p-5 pb-3 border-b border-slate-100 flex items-center justify-between gap-4 ${className}`}>
      <div className="min-w-0">
        {title && <h3 className="text-sm font-bold text-slate-900 tracking-tight truncate">{title}</h3>}
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

export const CardContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return <div className={`p-5 ${className}`}>{children}</div>;
};

export const CardFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`p-4 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between gap-3 text-xs ${className}`}>
      {children}
    </div>
  );
};

