import { DEFAULT_PAGE_LIMIT, MAX_PAGE_LIMIT } from '../constants/enums';
import { MESSAGES } from '../constants/messages';
import { leadRepository, type LeadQueryFilters } from '../repositories/lead.repository';
import { ApiError } from '../utils/ApiError';
import type { LeadSource, LeadStatus } from '../constants/enums';
import type { AuthUserPayload } from '../types/express';

export interface CreateLeadInput {
  name: string;
  email: string;
  status?: LeadStatus;
  source: LeadSource;
}

export interface UpdateLeadInput {
  name?: string;
  email?: string;
  status?: LeadStatus;
  source?: LeadSource;
}

export const leadService = {
  getLeads: async (query: Partial<LeadQueryFilters>) => {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(MAX_PAGE_LIMIT, Math.max(1, query.limit ?? DEFAULT_PAGE_LIMIT));

    const filters: LeadQueryFilters = {
      page,
      limit,
      status: query.status,
      source: query.source,
      search: query.search,
      sort: query.sort ?? 'latest',
    };

    const { leads, meta } = await leadRepository.findPaginated(filters);
    return { leads, meta };
  },

  exportLeadsCsv: async (query: Omit<Partial<LeadQueryFilters>, 'page' | 'limit'>) => {
    const leads = await leadRepository.findAllForExport({
      status: query.status,
      source: query.source,
      search: query.search,
      sort: query.sort ?? 'latest',
    });

    const header = 'Name,Email,Status,Source,Created At\n';
    const rows = leads
      .map(
        (lead) =>
          `"${lead.name.replace(/"/g, '""')}","${lead.email}","${lead.status}","${lead.source}","${lead.createdAt.toISOString()}"`
      )
      .join('\n');

    return header + rows;
  },

  getLeadById: async (id: string) => {
    const lead = await leadRepository.findById(id);
    if (!lead) {
      throw new ApiError(404, MESSAGES.LEADS.NOT_FOUND);
    }
    return lead;
  },

  createLead: async (input: CreateLeadInput, user: AuthUserPayload) => {
    return leadRepository.create({
      ...input,
      status: input.status ?? 'New',
      createdBy: user.id,
    });
  },

  updateLead: async (id: string, input: UpdateLeadInput) => {
    const lead = await leadRepository.updateById(id, input);
    if (!lead) {
      throw new ApiError(404, MESSAGES.LEADS.NOT_FOUND);
    }
    return lead;
  },

  deleteLead: async (id: string, user: AuthUserPayload) => {
    if (user.role !== 'admin') {
      throw new ApiError(403, MESSAGES.LEADS.DELETE_FORBIDDEN);
    }
    const lead = await leadRepository.deleteById(id);
    if (!lead) {
      throw new ApiError(404, MESSAGES.LEADS.NOT_FOUND);
    }
    return lead;
  },
};
