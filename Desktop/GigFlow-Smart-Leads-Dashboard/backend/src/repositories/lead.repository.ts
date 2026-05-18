import { FilterQuery, SortOrder } from 'mongoose';
import { Lead, type ILeadDocument } from '../models/Lead.model';
import type { LeadSource, LeadStatus, SortOption } from '../constants/enums';
import type { PaginationMeta } from '../types/api.types';

export interface LeadQueryFilters {
  page: number;
  limit: number;
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  sort: SortOption;
}

export interface PaginatedLeadsResult {
  leads: ILeadDocument[];
  meta: PaginationMeta;
}

const buildFilter = (filters: LeadQueryFilters): FilterQuery<ILeadDocument> => {
  const query: FilterQuery<ILeadDocument> = {};

  if (filters.status) {
    query.status = filters.status;
  }
  if (filters.source) {
    query.source = filters.source;
  }
  if (filters.search?.trim()) {
    const escaped = filters.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'i');
    query.$or = [{ name: regex }, { email: regex }];
  }

  return query;
};

const getSortOrder = (sort: SortOption): Record<string, SortOrder> => ({
  createdAt: sort === 'latest' ? -1 : 1,
});

export const leadRepository = {
  findPaginated: async (filters: LeadQueryFilters): Promise<PaginatedLeadsResult> => {
    const filter = buildFilter(filters);
    const skip = (filters.page - 1) * filters.limit;
    const sort = getSortOrder(filters.sort);

    const [leads, total] = await Promise.all([
      Lead.find(filter).sort(sort).skip(skip).limit(filters.limit).populate('createdBy', 'name email').exec(),
      Lead.countDocuments(filter).exec(),
    ]);

    const totalPages = Math.ceil(total / filters.limit) || 1;

    return {
      leads,
      meta: {
        total,
        currentPage: filters.page,
        totalPages,
        hasNextPage: filters.page < totalPages,
        hasPrevPage: filters.page > 1,
        limit: filters.limit,
      },
    };
  },

  findAllForExport: (filters: Pick<LeadQueryFilters, 'status' | 'source' | 'search' | 'sort'>): Promise<ILeadDocument[]> => {
    const filter = buildFilter({ ...filters, page: 1, limit: 10, sort: filters.sort });
    return Lead.find(filter).sort(getSortOrder(filters.sort)).exec();
  },

  findById: (id: string): Promise<ILeadDocument | null> =>
    Lead.findById(id).populate('createdBy', 'name email').exec(),

  create: (data: {
    name: string;
    email: string;
    status: LeadStatus;
    source: LeadSource;
    createdBy: string;
  }): Promise<ILeadDocument> => Lead.create(data),

  updateById: (
    id: string,
    data: Partial<Pick<ILeadDocument, 'name' | 'email' | 'status' | 'source'>>
  ): Promise<ILeadDocument | null> =>
    Lead.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate('createdBy', 'name email')
      .exec(),

  deleteById: (id: string): Promise<ILeadDocument | null> => Lead.findByIdAndDelete(id).exec(),
};
