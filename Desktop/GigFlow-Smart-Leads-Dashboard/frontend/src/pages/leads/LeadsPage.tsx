import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Download, Plus } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { leadsApi } from '@/api/leads.api';
import { getErrorMessage } from '@/api/client';
import { useDebounce } from '@/hooks/useDebounce';
import { useAuthStore } from '@/store/authStore';
import { LeadsFilters, type LeadsFilterState } from '@/components/leads/LeadsFilters';
import { LeadsTable } from '@/components/leads/LeadsTable';
import { Pagination } from '@/components/leads/Pagination';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorFallback } from '@/components/shared/ErrorFallback';
import { TableSkeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import type { Lead, LeadsQueryParams } from '@/types';

const defaultFilters: LeadsFilterState = {
  search: '',
  status: 'all',
  source: 'all',
  sort: 'latest',
};

export const LeadsPage = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<LeadsFilterState>(defaultFilters);
  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null);
  const debouncedSearch = useDebounce(filters.search);
  const { user } = useAuthStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const queryParams: LeadsQueryParams = {
    page,
    limit: 10,
    sort: filters.sort,
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(filters.status !== 'all' && { status: filters.status }),
    ...(filters.source !== 'all' && { source: filters.source }),
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['leads', queryParams],
    queryFn: async () => {
      const res = await leadsApi.getAll(queryParams);
      return { leads: res.data.data.leads, meta: res.data.meta! };
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => leadsApi.delete(id),
    onSuccess: () => {
      toast('Lead deleted', 'success');
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      setDeleteTarget(null);
    },
    onError: (err) => toast(getErrorMessage(err), 'destructive'),
  });

  const handleExport = async () => {
    try {
      const res = await leadsApi.exportCsv({
        sort: filters.sort,
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(filters.status !== 'all' && { status: filters.status }),
        ...(filters.source !== 'all' && { source: filters.source }),
      });
      const url = window.URL.createObjectURL(new Blob([res.data as BlobPart]));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'leads-export.csv';
      link.click();
      window.URL.revokeObjectURL(url);
      toast('CSV exported', 'success');
    } catch (err) {
      toast(getErrorMessage(err), 'destructive');
    }
  };

  const handleFilterChange = (next: LeadsFilterState) => {
    setFilters(next);
    setPage(1);
  };

  const canDelete = user?.role === 'admin';

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Leads" description="Manage and track your sales pipeline">
        <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
        <Button size="sm" onClick={() => navigate('/leads/new')} className="gap-2">
          <Plus className="h-4 w-4" />
          New Lead
        </Button>
      </PageHeader>

      <LeadsFilters filters={filters} onChange={handleFilterChange} />

      {isLoading && <TableSkeleton rows={8} />}
      {isError && <ErrorFallback message={getErrorMessage(error)} onRetry={() => refetch()} />}

      {!isLoading && !isError && data && (
        <>
          {data.leads.length === 0 ? (
            <EmptyState
              actionLabel="Create Lead"
              onAction={() => navigate('/leads/new')}
            />
          ) : (
            <>
              <LeadsTable
                leads={data.leads}
                canDelete={canDelete}
                onDelete={setDeleteTarget}
              />
              <Pagination meta={data.meta} onPageChange={setPage} />
            </>
          )}
        </>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete lead"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget._id)}
      />
    </div>
  );
};
