"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertTriangle, Info, X, XCircle } from "lucide-react";

/* ─── Types ─── */
type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextValue {
    toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

/* ─── Toast Config ─── */
const toastConfig: Record<ToastType, { icon: typeof CheckCircle; bg: string; border: string; text: string }> = {
    success: {
        icon: CheckCircle,
        bg: "bg-emerald-50 dark:bg-emerald-950/50",
        border: "border-emerald-200 dark:border-emerald-800",
        text: "text-emerald-700 dark:text-emerald-300",
    },
    error: {
        icon: XCircle,
        bg: "bg-red-50 dark:bg-red-950/50",
        border: "border-red-200 dark:border-red-800",
        text: "text-red-700 dark:text-red-300",
    },
    warning: {
        icon: AlertTriangle,
        bg: "bg-amber-50 dark:bg-amber-950/50",
        border: "border-amber-200 dark:border-amber-800",
        text: "text-amber-700 dark:text-amber-300",
    },
    info: {
        icon: Info,
        bg: "bg-blue-50 dark:bg-blue-950/50",
        border: "border-blue-200 dark:border-blue-800",
        text: "text-blue-700 dark:text-blue-300",
    },
};

/* ─── Provider ─── */
export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType = "success") => {
        const id = crypto.randomUUID();
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toast: addToast }}>
            {children}

            {/* Toast container */}
            <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
                <AnimatePresence>
                    {toasts.map((t) => {
                        const config = toastConfig[t.type];
                        const Icon = config.icon;
                        return (
                            <motion.div
                                key={t.id}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 80, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-lg backdrop-blur-sm ${config.bg} ${config.border}`}
                            >
                                <Icon className={`h-[18px] w-[18px] shrink-0 ${config.text}`} />
                                <p className={`text-sm font-medium ${config.text}`}>{t.message}</p>
                                <button
                                    onClick={() => removeToast(t.id)}
                                    className={`ml-2 rounded-full p-0.5 opacity-50 transition-opacity hover:opacity-100 ${config.text}`}
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

/* ─── Hook ─── */
export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) return { toast: () => { } };
    return ctx;
}
