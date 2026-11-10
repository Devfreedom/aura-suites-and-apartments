"use client";

import { useCallback, useState } from "react";
import { AlertCircle, CheckCircle, X } from "lucide-react";

type ToastType = "success" | "error";

interface Toast {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
}

const typeStyles: Record<ToastType, string> = {
  success: "border border-emerald-200 bg-emerald-50 text-emerald-800",
  error: "border border-red-200 bg-red-50 text-red-800",
};

const typeIcons: Record<ToastType, typeof CheckCircle> = {
  success: CheckCircle,
  error: AlertCircle,
};

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, showToast, dismissToast };
}

export function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none px-4 sm:px-6 sm:w-[calc(100%-2rem)]">
      {toasts.map((toast) => {
        const Icon = typeIcons[toast.type];
        const bgClass = typeStyles[toast.type];

        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg ${bgClass} animate-in fade-in slide-in-from-right-2 duration-300`}
            role="alert"
          >
            <div className="flex-shrink-0 w-5 h-5">
              <Icon />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-semibold">{toast.title}</h4>
              {toast.description && (
                <p className="text-xs mt-1 opacity-90">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="flex-shrink-0 min-h-[44px] min-w-[44px] p-2 rounded-full hover:bg-black/10 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
