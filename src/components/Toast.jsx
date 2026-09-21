import React from 'react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const typeStyles = {
    success: {
      bg: 'bg-emerald-900/90 border-emerald-700/80 text-emerald-100',
      icon: 'check_circle',
      iconColor: 'text-emerald-400',
    },
    info: {
      bg: 'bg-slate-900/95 border-slate-700/80 text-slate-100',
      icon: 'info',
      iconColor: 'text-blue-400',
    },
  };

  const style = typeStyles[toast.type] || typeStyles.info;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 animate-slideUp flex items-center gap-3 px-4 py-3 rounded-2xl shadow-floating backdrop-blur-md border text-body-sm font-medium transition-all max-w-sm">
      <div className={`flex items-center gap-2.5 ${style.bg} px-3.5 py-2.5 rounded-xl border w-full`}>
        <span className={`material-symbols-outlined text-[20px] shrink-0 ${style.iconColor}`}>
          {toast.icon || style.icon}
        </span>
        <span className="flex-1 text-[13px] leading-snug">{toast.message}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-0.5 rounded-md transition-colors shrink-0"
            aria-label="Close notification"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        )}
      </div>
    </div>
  );
}
