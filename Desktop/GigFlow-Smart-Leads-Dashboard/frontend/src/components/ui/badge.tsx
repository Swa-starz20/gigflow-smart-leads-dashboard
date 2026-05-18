import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import type { LeadStatus } from '@/types';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary/10 text-primary ring-primary/20',
        secondary: 'bg-secondary text-secondary-foreground ring-border',
        success: 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-400',
        warning: 'bg-amber-500/10 text-amber-700 ring-amber-500/20 dark:text-amber-400',
        danger: 'bg-destructive/10 text-destructive ring-destructive/20',
        muted: 'bg-muted text-muted-foreground ring-border',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export const Badge = ({ className, variant, ...props }: BadgeProps) => (
  <span className={cn(badgeVariants({ variant }), className)} {...props} />
);

export const statusBadgeVariant = (status: LeadStatus): VariantProps<typeof badgeVariants>['variant'] => {
  const map: Record<LeadStatus, VariantProps<typeof badgeVariants>['variant']> = {
    New: 'default',
    Contacted: 'warning',
    Qualified: 'success',
    Lost: 'danger',
  };
  return map[status];
};
