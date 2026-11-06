import React, { useEffect } from 'react';
import { AlertTriangle, AlertCircle, Info, X, Trash2 } from 'lucide-react';
import { Button } from './Button';

export interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const iconConfig = {
    danger: {
      icon: Trash2,
      bg: 'bg-rose-50 text-rose-600 border-rose-200',
      buttonVariant: 'danger' as const
    },
    warning: {
      icon: AlertTriangle,
      bg: 'bg-amber-50 text-amber-600 border-amber-200',
      buttonVariant: 'primary' as const
    },
    info: {
      icon: Info,
      bg: 'bg-blue-50 text-blue-600 border-blue-200',
      buttonVariant: 'primary' as const
    }
  }[variant];

  const Icon = iconConfig.icon;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={() => !isLoading && onClose()}
      />

      <div className="flex min-h-full items-end sm:items-center justify-center p-0 sm:p-4 text-center">
        <div
          className="relative transform overflow-hidden rounded-t-3xl sm:rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 w-full max-w-md border-t sm:border border-slate-200 animate-slide-down sm:animate-scale-up p-5 sm:p-6"
          onClick={e => e.stopPropagation()}
        >
          {/* Mobile Drag Indicator */}
          <div className="sm:hidden w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-3" />

          <div className="flex items-start gap-3.5">
            <div
              className={`p-2.5 sm:p-3 rounded-2xl border flex items-center justify-center shrink-0 ${iconConfig.bg}`}
            >
              <Icon className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-slate-900">{title}</h3>
              <div className="text-xs text-slate-500 mt-1 leading-relaxed">{message}</div>
            </div>

            <button
              onClick={onClose}
              disabled={isLoading}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading} className="w-full sm:w-auto">
              {cancelText}
            </Button>
            <Button
              variant={iconConfig.buttonVariant}
              size="sm"
              onClick={onConfirm}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? 'Processing...' : confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

