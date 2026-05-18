import { apiClient } from './client';
import type {
  ApiSuccessResponse,
  Lead,
  LeadsQueryParams,
  LeadSource,
  LeadStatus,
  PaginationMeta,
} from '@/types';

export interface CreateLeadPayload {
  name: string;
  email: string;
  status?: LeadStatus;
  source: LeadSource;
}

export interface UpdateLeadPayload extends Partial<CreateLeadPayload> {}

export const leadsApi = {
  getAll: (params: LeadsQueryParams) =>
    apiClient.get<ApiSuccessResponse<{ leads: Lead[] }> & { meta: PaginationMeta }>('/leads', {
      params,
    }),

  getById: (id: string) =>
    apiClient.get<ApiSuccessResponse<{ lead: Lead }>>(`/leads/${id}`),

  create: (data: CreateLeadPayload) =>
    apiClient.post<ApiSuccessResponse<{ lead: Lead }>>('/leads', data),

  update: (id: string, data: UpdateLeadPayload) =>
    apiClient.put<ApiSuccessResponse<{ lead: Lead }>>(`/leads/${id}`, data),

  delete: (id: string) => apiClient.delete<ApiSuccessResponse<null>>(`/leads/${id}`),

  exportCsv: (params: LeadsQueryParams) =>
    apiClient.get('/leads/export/csv', {
      params,
      responseType: 'blob',
    }),
};
