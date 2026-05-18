import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PaginationMeta } from '@/types';

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ meta, onPageChange }: PaginationProps) => (
  <div className="flex flex-col items-center justify-between gap-4 rounded-xl border bg-card/50 px-4 py-3 sm:flex-row sm:px-5">
    <p className="text-sm text-muted-foreground">
      Page <span className="font-medium text-foreground">{meta.currentPage}</span> of{' '}
      <span className="font-medium text-foreground">{meta.totalPages}</span>
      <span className="hidden sm:inline"> · {meta.total} total leads</span>
    </p>
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={!meta.hasPrevPage}
        onClick={() => onPageChange(meta.currentPage - 1)}
        className="gap-1"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>
      <Button
        variant="outline"
        size="sm"
        disabled={!meta.hasNextPage}
        onClick={() => onPageChange(meta.currentPage + 1)}
        className="gap-1"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  </div>
);
