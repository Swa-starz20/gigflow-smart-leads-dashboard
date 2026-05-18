import { cn } from '@/lib/utils';

export const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('shimmer rounded-lg', className)} {...props} />
);

export const TableSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <div className="surface-panel overflow-hidden p-4 space-y-3">
    <Skeleton className="h-10 w-full rounded-lg" />
    {Array.from({ length: rows }).map((_, i) => (
      <Skeleton key={i} className="h-14 w-full rounded-lg" />
    ))}
  </div>
);

export const StatCardSkeleton = () => (
  <div className="glass-card p-6 space-y-4">
    <div className="flex justify-between">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-10 rounded-xl" />
    </div>
    <Skeleton className="h-8 w-16" />
    <Skeleton className="h-3 w-32" />
  </div>
);

