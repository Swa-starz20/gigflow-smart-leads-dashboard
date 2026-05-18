import { z } from 'zod';
import { LEAD_SOURCES, LEAD_STATUSES, SORT_OPTIONS } from '../constants/enums';

export const createLeadSchema = z.object({
  name: z.string().min(2).max(150),
  email: z.string().email(),
  status: z.enum(LEAD_STATUSES).optional(),
  source: z.enum(LEAD_SOURCES),
});

export const updateLeadSchema = createLeadSchema.partial();

export const leadIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid lead ID'),
});

export const leadsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  status: z.enum(LEAD_STATUSES).optional(),
  source: z.enum(LEAD_SOURCES).optional(),
  search: z.string().optional(),
  sort: z.enum(SORT_OPTIONS).optional(),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
export type LeadsQueryInput = z.infer<typeof leadsQuerySchema>;
