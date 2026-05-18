import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { leadsApi } from '@/api/leads.api';
import { getErrorMessage } from '@/api/client';
import { LeadForm, type LeadFormValues } from '@/components/leads/LeadForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';

export const CreateLeadPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: LeadFormValues) => leadsApi.create(data),
    onSuccess: () => {
      toast('Lead created', 'success');
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      navigate('/leads');
    },
    onError: (err) => toast(getErrorMessage(err), 'destructive'),
  });

  return (
    <div className="mx-auto max-w-xl animate-fade-in">
      <Card className="surface-panel">
        <CardHeader className="border-b bg-muted/20">
          <CardTitle className="text-xl font-semibold">Create Lead</CardTitle>
          <p className="text-sm text-muted-foreground">Add a new lead to your pipeline</p>
        </CardHeader>
        <CardContent>
          <LeadForm onSubmit={(d) => mutation.mutate(d)} loading={mutation.isPending} />
        </CardContent>
      </Card>
    </div>
  );
};
