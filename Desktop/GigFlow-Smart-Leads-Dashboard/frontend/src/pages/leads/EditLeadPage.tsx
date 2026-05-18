import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { leadsApi } from '@/api/leads.api';
import { getErrorMessage } from '@/api/client';
import { LeadForm, type LeadFormValues } from '@/components/leads/LeadForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorFallback } from '@/components/shared/ErrorFallback';
import { useToast } from '@/components/ui/toast';

export const EditLeadPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['lead', id],
    queryFn: async () => {
      const res = await leadsApi.getById(id!);
      return res.data.data.lead;
    },
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: (formData: LeadFormValues) => leadsApi.update(id!, formData),
    onSuccess: () => {
      toast('Lead updated', 'success');
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['lead', id] });
      navigate(`/leads/${id}`);
    },
    onError: (err) => toast(getErrorMessage(err), 'destructive'),
  });

  if (isLoading) return <Skeleton className="h-96 max-w-xl" />;
  if (isError || !data) {
    return <ErrorFallback message={getErrorMessage(error)} onRetry={() => refetch()} />;
  }

  return (
    <div className="mx-auto max-w-xl animate-fade-in">
      <Card className="surface-panel">
        <CardHeader className="border-b bg-muted/20">
          <CardTitle className="text-xl font-semibold">Edit Lead</CardTitle>
          <p className="text-sm text-muted-foreground">Update lead information</p>
        </CardHeader>
        <CardContent>
          <LeadForm
            defaultValues={data}
            onSubmit={(d) => mutation.mutate(d)}
            loading={mutation.isPending}
            submitLabel="Update Lead"
          />
        </CardContent>
      </Card>
    </div>
  );
};
