import React from 'react';
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose }) => {
  if (!message) return null;

  const styles = {
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    info: 'bg-sky-50 text-sky-800 border-sky-200'
  };

  const Icons = {
    success: CheckCircle2,
    error: XCircle,
    info: AlertCircle
  };

  const Icon = Icons[type];

  return (
    <div className={`fixed top-4 right-4 left-4 md:left-auto md:w-80 z-50 p-4 rounded-xl border shadow-lg flex items-start space-x-3 transition-all ${styles[type]}`}>
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1 text-sm font-medium">{message}</div>
      {onClose && (
        <button onClick={onClose} className="opacity-70 hover:opacity-100">
          ×
        </button>
      )}
    </div>
  );
};
