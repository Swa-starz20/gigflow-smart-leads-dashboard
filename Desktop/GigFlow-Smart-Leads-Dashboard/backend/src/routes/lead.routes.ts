import { Router } from 'express';
import * as leadController from '../controllers/lead.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createLeadSchema,
  leadIdParamSchema,
  leadsQuerySchema,
  updateLeadSchema,
} from '../validators/lead.validator';

const router = Router();

router.use(authenticate);

router.get('/export/csv', validate(leadsQuerySchema, 'query'), leadController.exportLeadsCsv);
router.get('/', validate(leadsQuerySchema, 'query'), leadController.getLeads);
router.get('/:id', validate(leadIdParamSchema, 'params'), leadController.getLeadById);
router.post('/', validate(createLeadSchema), leadController.createLead);
router.put(
  '/:id',
  validate(leadIdParamSchema, 'params'),
  validate(updateLeadSchema),
  leadController.updateLead
);
router.delete('/:id', validate(leadIdParamSchema, 'params'), leadController.deleteLead);

export default router;
