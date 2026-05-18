import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Pencil } from 'lucide-react';
import { leadsApi } from '@/api/leads.api';
import { getErrorMessage } from '@/api/client';
import { Badge, statusBadgeVariant } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorFallback } from '@/components/shared/ErrorFallback';

export const LeadDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['lead', id],
    queryFn: async () => {
      const res = await leadsApi.getById(id!);
      return res.data.data.lead;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-2xl">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return <ErrorFallback message={getErrorMessage(error)} onRetry={() => refetch()} />;
  }

  const createdBy =
    typeof data.createdBy === 'object' && data.createdBy !== null
      ? data.createdBy.name
      : 'Unknown';

  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <Button variant="ghost" asChild className="gap-2">
          <Link to="/leads">
            <ArrowLeft className="h-4 w-4" />
            Back to leads
          </Link>
        </Button>
        <Button asChild className="gap-2">
          <Link to={`/leads/${data._id}/edit`}>
            <Pencil className="h-4 w-4" />
            Edit
          </Link>
        </Button>
      </div>

      <Card className="surface-panel overflow-hidden">
        <CardHeader className="border-b bg-muted/20">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-semibold tracking-tight">{data.name}</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">{data.email}</p>
            </div>
            <Badge variant={statusBadgeVariant(data.status)} className="shrink-0">
              {data.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-1 pt-6">
          <DetailRow label="Source" value={data.source} />
          <DetailRow label="Created by" value={createdBy} />
          <DetailRow
            label="Created at"
            value={new Date(data.createdAt).toLocaleString()}
          />
          <DetailRow
            label="Updated at"
            value={new Date(data.updatedAt).toLocaleString()}
          />
        </CardContent>
      </Card>
    </div>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-1 rounded-lg px-3 py-3 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between">
    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
    <span className="text-sm font-medium">{value}</span>
  </div>
);
