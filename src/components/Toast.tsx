import React from 'react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'danger' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success' }) => {
  if (!message) return null;

  const dotColor =
    type === 'danger'
      ? 'bg-rose-500'
      : type === 'info'
      ? 'bg-blue-400'
      : 'bg-emerald-400';

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#162035] text-white border border-slate-700/80 px-4 py-2.5 rounded-full text-xs font-semibold shadow-2xl transition-all duration-300 transform translate-y-0 flex items-center space-x-2 animate-in fade-in slide-in-from-top-2">
      <span className={`w-2 h-2 rounded-full ${dotColor} animate-pulse`}></span>
      <span className="tracking-wide">{message}</span>
    </div>
  );
};
