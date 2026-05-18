import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Users, UserCheck, UserX, TrendingUp, ArrowRight } from 'lucide-react';
import { leadsApi } from '@/api/leads.api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCardSkeleton } from '@/components/ui/skeleton';
import { ErrorFallback } from '@/components/shared/ErrorFallback';
import { PageHeader } from '@/components/shared/PageHeader';
import { Badge, statusBadgeVariant } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/api/client';
import { cn } from '@/lib/utils';
import type { Lead } from '@/types';
import { LEAD_STATUSES } from '@/types';

const statConfig = [
  {
    key: 'total' as const,
    title: 'Total Leads',
    description: 'In current view',
    icon: Users,
    gradient: 'from-blue-500/20 to-blue-600/5',
    iconBg: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
  },
  {
    key: 'qualified' as const,
    title: 'Qualified',
    description: 'Ready to convert',
    icon: UserCheck,
    gradient: 'from-emerald-500/20 to-emerald-600/5',
    iconBg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  },
  {
    key: 'contacted' as const,
    title: 'Contacted',
    description: 'In progress',
    icon: TrendingUp,
    gradient: 'from-amber-500/20 to-amber-600/5',
    iconBg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  },
  {
    key: 'lost' as const,
    title: 'Lost',
    description: 'Closed lost',
    icon: UserX,
    gradient: 'from-rose-500/20 to-rose-600/5',
    iconBg: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
  },
];

const getInitials = (name: string): string =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export const DashboardPage = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['dashboard-leads'],
    queryFn: async () => {
      const res = await leadsApi.getAll({ limit: 100, sort: 'latest' });
      return res.data.data.leads;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="space-y-2">
          <div className="h-9 w-48 rounded-lg bg-muted animate-pulse" />
          <div className="h-5 w-64 rounded-lg bg-muted animate-pulse" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return <ErrorFallback message={getErrorMessage(error)} onRetry={() => refetch()} />;
  }

  const leads = data ?? [];
  const stats = {
    total: leads.length,
    qualified: leads.filter((l: Lead) => l.status === 'Qualified').length,
    contacted: leads.filter((l: Lead) => l.status === 'Contacted').length,
    lost: leads.filter((l: Lead) => l.status === 'Lost').length,
  };

  const statusCounts = LEAD_STATUSES.map((status) => ({
    status,
    count: leads.filter((l) => l.status === status).length,
  }));
  const maxCount = Math.max(...statusCounts.map((s) => s.count), 1);

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Dashboard"
        description="Overview of your leads pipeline and performance"
      >
        <Button variant="outline" size="sm" asChild className="gap-2">
          <Link to="/leads">
            View all leads
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statConfig.map(({ key, title, description, icon: Icon, gradient, iconBg }) => (
          <Card
            key={key}
            className={cn(
              'group glass-card overflow-hidden border-0 bg-gradient-to-br',
              gradient
            )}
          >
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
              <span className={cn('stat-icon-wrap', iconBg)}>
                <Icon className="h-5 w-5" />
              </span>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold tracking-tight tabular-nums">{stats[key]}</p>
              <p className="mt-1 text-xs text-muted-foreground">{description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="surface-panel lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Pipeline breakdown</CardTitle>
            <p className="text-sm text-muted-foreground">Leads by status</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {statusCounts.map(({ status, count }) => (
              <div key={status} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{status}</span>
                  <span className="tabular-nums text-muted-foreground">{count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {leads.length === 0 && (
              <p className="py-4 text-center text-sm text-muted-foreground">No data yet</p>
            )}
          </CardContent>
        </Card>

        <Card className="surface-panel lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Recent leads</CardTitle>
              <p className="text-sm text-muted-foreground">Latest activity in your pipeline</p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/leads" className="gap-1 text-primary">
                See all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-border/60">
              {leads.slice(0, 6).map((lead) => (
                <li key={lead._id}>
                  <Link
                    to={`/leads/${lead._id}`}
                    className="group flex items-center gap-4 py-3.5 transition-colors hover:bg-muted/30 -mx-2 px-2 rounded-lg"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary ring-2 ring-background transition-transform group-hover:scale-105">
                      {getInitials(lead.name)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{lead.name}</p>
                      <p className="truncate text-sm text-muted-foreground">{lead.email}</p>
                    </div>
                    <Badge variant={statusBadgeVariant(lead.status)} className="shrink-0">
                      {lead.status}
                    </Badge>
                  </Link>
                </li>
              ))}
              {leads.length === 0 && (
                <li className="py-12 text-center text-sm text-muted-foreground">
                  No leads yet. Create your first lead to get started.
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
