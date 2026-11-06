import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'lg'
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
      />

      <div className="flex min-h-full items-end sm:items-center justify-center p-0 sm:p-4 text-center">
        <div
          className={`relative transform overflow-hidden rounded-t-3xl sm:rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 w-full max-sm:max-h-[92vh] flex flex-col ${maxWidthClasses[maxWidth]} border-t sm:border border-slate-200 animate-slide-down sm:animate-scale-up`}
          onClick={e => e.stopPropagation()}
        >
          {/* Mobile Bottom-Sheet Drag Handle */}
          <div className="sm:hidden w-12 h-1.5 bg-slate-300 rounded-full mx-auto my-2.5 shrink-0" />

          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-5 sm:px-6 py-3.5 sm:py-4.5 shrink-0">
            <div className="min-w-0 pr-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">{title}</h3>
              {description && (
                <p className="mt-0.5 text-xs text-slate-500 truncate">{description}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors shrink-0"
              title="Close (Esc)"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-5 sm:px-6 py-4 sm:py-5 overflow-y-auto flex-1 max-h-[calc(90vh-100px)] sm:max-h-[calc(85vh-120px)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

