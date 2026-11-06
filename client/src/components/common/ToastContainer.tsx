import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useCRM();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        let Icon = CheckCircle2;
        let iconColor = 'text-emerald-500';
        let borderColor = 'border-emerald-200/90';
        let iconBg = 'bg-emerald-50';
        let progressBg = 'bg-emerald-500';

        if (toast.type === 'error') {
          Icon = AlertCircle;
          iconColor = 'text-rose-500';
          borderColor = 'border-rose-200/90';
          iconBg = 'bg-rose-50';
          progressBg = 'bg-rose-500';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          iconColor = 'text-amber-500';
          borderColor = 'border-amber-200/90';
          iconBg = 'bg-amber-50';
          progressBg = 'bg-amber-500';
        } else if (toast.type === 'info') {
          Icon = Info;
          iconColor = 'text-blue-500';
          borderColor = 'border-blue-200/90';
          iconBg = 'bg-blue-50';
          progressBg = 'bg-blue-500';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto relative overflow-hidden flex items-start gap-3 p-4 rounded-2xl border ${borderColor} bg-white shadow-xl shadow-slate-900/10 animate-slide-in-right transition-all group`}
          >
            <div className={`p-1.5 rounded-xl ${iconBg} shrink-0`}>
              <Icon className={`w-4 h-4 ${iconColor}`} />
            </div>

            <div className="flex-1 min-w-0 pr-1">
              <p className="text-xs font-bold text-slate-900 leading-snug">{toast.title}</p>
              {toast.message && (
                <p className="mt-0.5 text-2xs text-slate-600 leading-relaxed font-medium">
                  {toast.message}
                </p>
              )}

              {toast.action && (
                <button
                  type="button"
                  onClick={() => {
                    toast.action?.onClick();
                    removeToast(toast.id);
                  }}
                  className="mt-2 inline-flex items-center text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors underline underline-offset-2"
                >
                  {toast.action.label}
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors shrink-0"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Subtle duration timer line */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-100">
              <div
                className={`h-full ${progressBg} origin-left animate-[shrink_4.5s_linear_forwards]`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
