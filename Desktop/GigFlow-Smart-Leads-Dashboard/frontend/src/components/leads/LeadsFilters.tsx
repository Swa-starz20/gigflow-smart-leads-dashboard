import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LEAD_SOURCES, LEAD_STATUSES, type LeadSource, type LeadStatus, type SortOption } from '@/types';

export interface LeadsFilterState {
  search: string;
  status: LeadStatus | 'all';
  source: LeadSource | 'all';
  sort: SortOption;
}

interface LeadsFiltersProps {
  filters: LeadsFilterState;
  onChange: (filters: LeadsFilterState) => void;
}

export const LeadsFilters = ({ filters, onChange }: LeadsFiltersProps) => {
  const update = (partial: Partial<LeadsFilterState>) => onChange({ ...filters, ...partial });

  const hasActiveFilters =
    filters.search !== '' || filters.status !== 'all' || filters.source !== 'all';

  return (
    <div className="surface-panel overflow-hidden">
      <div className="flex items-center justify-between border-b bg-muted/30 px-5 py-3.5">
        <div className="flex items-center gap-2 text-sm font-medium">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          Filters & search
        </div>
        {hasActiveFilters && (
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            Active
          </span>
        )}
      </div>
      <div className="grid gap-5 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2 sm:col-span-2 lg:col-span-1">
          <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Search
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9 bg-background"
              placeholder="Name or email..."
              value={filters.search}
              onChange={(e) => update({ search: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Status
          </Label>
          <Select
            value={filters.status}
            onValueChange={(v) => update({ status: v as LeadsFilterState['status'] })}
          >
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {LEAD_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Source
          </Label>
          <Select
            value={filters.source}
            onValueChange={(v) => update({ source: v as LeadsFilterState['source'] })}
          >
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="All sources" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sources</SelectItem>
              {LEAD_SOURCES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Sort
          </Label>
          <Select value={filters.sort} onValueChange={(v) => update({ sort: v as SortOption })}>
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
