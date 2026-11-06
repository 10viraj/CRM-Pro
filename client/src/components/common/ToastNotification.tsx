import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export interface ToastNotificationProps {
  id?: string;
  title: string;
  message?: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  onClose?: () => void;
  className?: string;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  title,
  message,
  type = 'success',
  onClose,
  className = ''
}) => {
  const config = {
    success: {
      icon: CheckCircle2,
      iconColor: 'text-emerald-500',
      borderColor: 'border-emerald-200/80',
      bgColor: 'bg-white',
      badgeBg: 'bg-emerald-50 text-emerald-700'
    },
    error: {
      icon: AlertCircle,
      iconColor: 'text-rose-500',
      borderColor: 'border-rose-200/80',
      bgColor: 'bg-white',
      badgeBg: 'bg-rose-50 text-rose-700'
    },
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-amber-500',
      borderColor: 'border-amber-200/80',
      bgColor: 'bg-white',
      badgeBg: 'bg-amber-50 text-amber-700'
    },
    info: {
      icon: Info,
      iconColor: 'text-blue-500',
      borderColor: 'border-blue-200/80',
      bgColor: 'bg-white',
      badgeBg: 'bg-blue-50 text-blue-700'
    }
  }[type];

  const Icon = config.icon;

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-2xl border ${config.borderColor} ${config.bgColor} shadow-lg shadow-slate-900/5 transition-all ${className}`}
    >
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${config.iconColor}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-xs font-bold text-slate-900">{title}</p>
          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase tracking-wider ${config.badgeBg}`}>
            {type}
          </span>
        </div>
        {message && (
          <p className="mt-1 text-xs text-slate-600 leading-relaxed">{message}</p>
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 p-1 -mr-1 -mt-1 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

