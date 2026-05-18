import { Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = ({
  title = 'No leads found',
  description = 'Try adjusting your filters or create a new lead to get started.',
  actionLabel,
  onAction,
}: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/20 px-6 py-20 text-center animate-fade-in">
    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
      <Inbox className="h-8 w-8 text-primary" />
    </div>
    <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
    <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">{description}</p>
    {actionLabel && onAction && (
      <Button className="mt-8 shadow-sm" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </div>
);
