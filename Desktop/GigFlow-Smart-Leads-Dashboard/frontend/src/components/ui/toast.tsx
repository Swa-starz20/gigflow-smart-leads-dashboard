import * as React from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastVariant = 'default' | 'success' | 'destructive';

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export const useToast = (): ToastContextValue => {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [variant, setVariant] = React.useState<ToastVariant>('default');

  const toast = React.useCallback((msg: string, v: ToastVariant = 'default') => {
    setMessage(msg);
    setVariant(v);
    setOpen(true);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      <ToastPrimitive.Provider swipeDirection="right">
        {children}
        <ToastPrimitive.Root
          open={open}
          onOpenChange={setOpen}
          className={cn(
            'fixed bottom-4 right-4 z-[100] flex w-full max-w-sm items-center justify-between gap-4 rounded-xl border bg-card/95 p-4 shadow-elevated backdrop-blur-sm animate-fade-in-scale',
            variant === 'success' && 'border-emerald-500/40 bg-emerald-500/5',
            variant === 'destructive' && 'border-destructive/40 bg-destructive/5'
          )}
        >
          <ToastPrimitive.Description className="text-sm">{message}</ToastPrimitive.Description>
          <ToastPrimitive.Close>
            <X className="h-4 w-4 opacity-70" />
          </ToastPrimitive.Close>
        </ToastPrimitive.Root>
        <ToastPrimitive.Viewport />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
};
