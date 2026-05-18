import { Link } from 'react-router-dom';
import { MoreHorizontal, Pencil, Eye, Trash2 } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Badge, statusBadgeVariant } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Lead } from '@/types';
import { cn } from '@/lib/utils';

interface LeadsTableProps {
  leads: Lead[];
  canDelete: boolean;
  onDelete: (lead: Lead) => void;
}

const formatDate = (date: string): string =>
  new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

const getInitials = (name: string): string =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const sourceStyles: Record<string, string> = {
  Website: 'text-blue-600 dark:text-blue-400',
  Instagram: 'text-pink-600 dark:text-pink-400',
  Referral: 'text-violet-600 dark:text-violet-400',
};

export const LeadsTable = ({ leads, canDelete, onDelete }: LeadsTableProps) => (
  <>
    <div className="surface-panel hidden overflow-hidden md:block">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="table-header border-b">
              <th className="px-5 py-3.5 text-left">Lead</th>
              <th className="px-5 py-3.5 text-left">Status</th>
              <th className="px-5 py-3.5 text-left">Source</th>
              <th className="px-5 py-3.5 text-left">Created</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {leads.map((lead) => (
              <tr
                key={lead._id}
                className="group transition-colors hover:bg-muted/40"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {getInitials(lead.name)}
                    </span>
                    <div>
                      <p className="font-medium">{lead.name}</p>
                      <p className="text-muted-foreground">{lead.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <Badge variant={statusBadgeVariant(lead.status)}>{lead.status}</Badge>
                </td>
                <td className="px-5 py-4">
                  <span className={cn('font-medium', sourceStyles[lead.source])}>{lead.source}</span>
                </td>
                <td className="px-5 py-4 text-muted-foreground tabular-nums">
                  {formatDate(lead.createdAt)}
                </td>
                <td className="px-5 py-4 text-right">
                  <LeadActions lead={lead} canDelete={canDelete} onDelete={onDelete} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <div className="grid gap-3 md:hidden">
      {leads.map((lead) => (
        <div
          key={lead._id}
          className="surface-panel p-4 transition-shadow hover:shadow-card-hover"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex gap-3 min-w-0">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {getInitials(lead.name)}
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold">{lead.name}</p>
                <p className="truncate text-sm text-muted-foreground">{lead.email}</p>
              </div>
            </div>
            <LeadActions lead={lead} canDelete={canDelete} onDelete={onDelete} />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/60 pt-3">
            <Badge variant={statusBadgeVariant(lead.status)}>{lead.status}</Badge>
            <span className={cn('text-xs font-medium', sourceStyles[lead.source])}>{lead.source}</span>
            <span className="text-xs text-muted-foreground">· {formatDate(lead.createdAt)}</span>
          </div>
        </div>
      ))}
    </div>
  </>
);

const LeadActions = ({
  lead,
  canDelete,
  onDelete,
}: {
  lead: Lead;
  canDelete: boolean;
  onDelete: (lead: Lead) => void;
}) => (
  <DropdownMenu.Root>
    <DropdownMenu.Trigger asChild>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 opacity-70 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100"
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        className={cn(
          'z-50 min-w-[11rem] overflow-hidden rounded-xl border bg-card p-1.5 shadow-elevated animate-fade-in-scale'
        )}
        align="end"
        sideOffset={4}
      >
        <DropdownMenu.Item asChild>
          <Link
            to={`/leads/${lead._id}`}
            className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm outline-none transition-colors hover:bg-accent"
          >
            <Eye className="h-4 w-4 text-muted-foreground" /> View details
          </Link>
        </DropdownMenu.Item>
        <DropdownMenu.Item asChild>
          <Link
            to={`/leads/${lead._id}/edit`}
            className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm outline-none transition-colors hover:bg-accent"
          >
            <Pencil className="h-4 w-4 text-muted-foreground" /> Edit lead
          </Link>
        </DropdownMenu.Item>
        {canDelete && (
          <>
            <DropdownMenu.Separator className="my-1 h-px bg-border" />
            <DropdownMenu.Item
              className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-destructive outline-none transition-colors hover:bg-destructive/10"
              onSelect={() => onDelete(lead)}
            >
              <Trash2 className="h-4 w-4" /> Delete
            </DropdownMenu.Item>
          </>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
);
