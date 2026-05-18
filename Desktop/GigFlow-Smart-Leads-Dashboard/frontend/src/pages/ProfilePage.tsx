import { useQuery } from '@tanstack/react-query';
import { authApi } from '@/api/auth.api';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/PageHeader';

export const ProfilePage = () => {
  const { user, setUser } = useAuthStore();

  const { isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await authApi.me();
      setUser(res.data.data.user);
      return res.data.data.user;
    },
  });

  if (isLoading) return <Skeleton className="h-48 max-w-md" />;

  return (
    <div className="mx-auto max-w-md space-y-6 animate-fade-in">
      <PageHeader title="Profile" description="Manage your account settings" />
      <Card className="surface-panel overflow-hidden">
        <CardHeader className="border-b bg-muted/20 pb-4">
          <CardTitle className="text-base font-semibold">Account information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 pt-6">
          <ProfileRow label="Name" value={user?.name ?? '—'} />
          <ProfileRow label="Email" value={user?.email ?? '—'} />
          <div className="flex flex-col gap-2 rounded-lg px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Role</span>
            <Badge className="w-fit capitalize">{user?.role}</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ProfileRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-1 rounded-lg px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
    <span className="text-sm font-medium">{value}</span>
  </div>
);
