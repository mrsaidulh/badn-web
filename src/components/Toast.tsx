import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toast: {
    success: (message: string, title?: string) => void;
    error: (message: string, title?: string) => void;
    info: (message: string, title?: string) => void;
    warning: (message: string, title?: string) => void;
    show: (item: Omit<ToastItem, 'id'>) => void;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context.toast;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    ({ type, title, message, duration = 4000 }: Omit<ToastItem, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastItem = { id, type, title, message, duration };
      
      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const toast = {
    success: (message: string, title?: string) => show({ type: 'success', title, message }),
    error: (message: string, title?: string) => show({ type: 'error', title, message }),
    info: (message: string, title?: string) => show({ type: 'info', title, message }),
    warning: (message: string, title?: string) => show({ type: 'warning', title, message }),
    show,
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      
      {/* Toast Render Portal */}
      <div className="fixed top-4 md:top-6 right-4 left-4 md:left-auto md:w-96 z-[9999] pointer-events-none flex flex-col gap-3 font-sans">
        <AnimatePresence>
          {toasts.map((t) => {
            let bgColor = 'bg-white';
            let borderCls = 'border-gray-100';
            let progressColor = 'bg-gray-400';
            let Icon = Info;
            let iconColor = 'text-blue-500';

            switch (t.type) {
              case 'success':
                bgColor = 'bg-[#f4faf4]';
                borderCls = 'border-emerald-200';
                progressColor = 'bg-emerald-500';
                Icon = CheckCircle2;
                iconColor = 'text-emerald-600';
                break;
              case 'error':
                bgColor = 'bg-red-50/70';
                borderCls = 'border-red-200';
                progressColor = 'bg-red-500';
                Icon = AlertCircle;
                iconColor = 'text-red-600';
                break;
              case 'warning':
                bgColor = 'bg-amber-50/70';
                borderCls = 'border-amber-200';
                progressColor = 'bg-amber-500';
                Icon = AlertTriangle;
                iconColor = 'text-amber-600';
                break;
              case 'info':
                bgColor = 'bg-blue-50/70';
                borderCls = 'border-blue-200';
                progressColor = 'bg-blue-500';
                Icon = Info;
                iconColor = 'text-blue-600';
                break;
            }

            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className={`pointer-events-auto relative overflow-hidden rounded-2xl border ${borderCls} ${bgColor} p-4 shadow-xl flex gap-3.5 items-start text-left`}
              >
                {/* Visual Feedback Icon */}
                <div className={`p-1.5 rounded-xl bg-white shadow-sm shrink-0`}>
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>

                {/* Message Context */}
                <div className="flex-1 min-w-0 pr-2 pt-0.5">
                  {t.title && (
                    <h4 className="text-xs font-bold text-gray-900 leading-tight mb-0.5">
                      {t.title}
                    </h4>
                  )}
                  <p className="text-xs text-gray-700 font-semibold leading-relaxed">
                    {t.message}
                  </p>
                </div>

                {/* Dismiss Trigger */}
                <button
                  onClick={() => removeToast(t.id)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100/50 transition-colors shrink-0 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                {/* Micro Animated Progress Line */}
                {t.duration && t.duration > 0 && (
                  <motion.div
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: t.duration / 1000, ease: 'linear' }}
                    className={`absolute bottom-0 left-0 h-0.5 ${progressColor}`}
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
