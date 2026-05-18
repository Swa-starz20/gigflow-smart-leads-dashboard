import type { Request, Response } from 'express';
import { MESSAGES } from '../constants/messages';
import { leadService } from '../services/lead.service';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import type { LeadsQueryInput } from '../validators/lead.validator';

export const getLeads = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as LeadsQueryInput;
  const { leads, meta } = await leadService.getLeads(query);
  sendSuccess(res, 200, MESSAGES.LEADS.FETCHED, { leads }, meta);
});

export const exportLeadsCsv = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as LeadsQueryInput;
  const csv = await leadService.exportLeadsCsv(query);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="leads-export.csv"');
  res.status(200).send(csv);
});

export const getLeadById = asyncHandler(async (req: Request, res: Response) => {
  const lead = await leadService.getLeadById(req.params.id as string);
  sendSuccess(res, 200, MESSAGES.LEADS.FETCHED_ONE, { lead });
});

export const createLead = asyncHandler(async (req: Request, res: Response) => {
  const lead = await leadService.createLead(req.body, req.user!);
  sendSuccess(res, 201, MESSAGES.LEADS.CREATED, { lead });
});

export const updateLead = asyncHandler(async (req: Request, res: Response) => {
  const lead = await leadService.updateLead(req.params.id as string, req.body);
  sendSuccess(res, 200, MESSAGES.LEADS.UPDATED, { lead });
});

export const deleteLead = asyncHandler(async (req: Request, res: Response) => {
  await leadService.deleteLead(req.params.id as string, req.user!);
  sendSuccess(res, 200, MESSAGES.LEADS.DELETED, null);
});
