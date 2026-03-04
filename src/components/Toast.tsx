import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, X } from 'lucide-react';
import type { ToastMessage } from '../types';

interface ToastProps {
    toasts: ToastMessage[];
    onDismiss: (id: string) => void;
}

const icons = {
    success: <CheckCircle className="w-4 h-4 text-emerald-400" />,
    error: <XCircle className="w-4 h-4 text-red-400" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-400" />,
};

const styles = {
    success: 'border-emerald-500/30 bg-emerald-900/80 dark:bg-emerald-900/90',
    error: 'border-red-500/30 bg-red-900/80 dark:bg-red-900/90',
    warning: 'border-amber-500/30 bg-amber-900/80 dark:bg-amber-900/90',
};

const ToastItem: React.FC<{
    toast: ToastMessage;
    onDismiss: (id: string) => void;
}> = ({ toast, onDismiss }) => {
    useEffect(() => {
        const timer = setTimeout(() => onDismiss(toast.id), 4500);
        return () => clearTimeout(timer);
    }, [toast.id, onDismiss]);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 80, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={`flex items-start gap-3 px-4 py-3 rounded-xl border shadow-xl backdrop-blur-md text-white text-sm max-w-sm ${styles[toast.type]}`}
        >
            <span className="mt-0.5 shrink-0">{icons[toast.type]}</span>
            <p className="flex-1 leading-snug text-white/90">{toast.message}</p>
            <button
                onClick={() => onDismiss(toast.id)}
                className="shrink-0 text-white/50 hover:text-white/90 transition-colors"
            >
                <X className="w-3.5 h-3.5" />
            </button>
        </motion.div>
    );
};

const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
    return (
        <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 items-end pointer-events-none">
            <AnimatePresence mode="popLayout">
                {toasts.map(t => (
                    <div key={t.id} className="pointer-events-auto">
                        <ToastItem toast={t} onDismiss={onDismiss} />
                    </div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default Toast;
