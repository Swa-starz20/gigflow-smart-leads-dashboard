import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorFallbackProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorFallback = ({
  message = 'Something went wrong while loading data.',
  onRetry,
}: ErrorFallbackProps) => (
  <div className="flex flex-col items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 px-6 py-16 text-center animate-fade-in">
    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10">
      <AlertTriangle className="h-7 w-7 text-destructive" />
    </div>
    <h3 className="text-base font-semibold">Unable to load</h3>
    <p className="mt-2 max-w-md text-sm text-muted-foreground">{message}</p>
    {onRetry && (
      <Button variant="outline" className="mt-6" onClick={onRetry}>
        Try again
      </Button>
    )}
  </div>
);
