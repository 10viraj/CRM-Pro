import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  action
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white border border-dashed border-slate-200 rounded-2xl my-2">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-3 shadow-xs">
        {icon || <Inbox className="w-6 h-6" />}
      </div>
      <h3 className="text-sm sm:text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 max-w-sm text-xs text-slate-500 leading-relaxed">
        {description}
      </p>
      {action ? (
        <div className="mt-4">{action}</div>
      ) : actionLabel && onAction ? (
        <div className="mt-4">
          <Button onClick={onAction} variant="primary" size="sm">
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
};
