import express from 'express';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  bulkDeleteLeads
} from '../controllers/leadController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateLead } from '../middleware/validate.js';

const router = express.Router();

router.use(protect); // All lead routes require valid JWT

router.route('/')
  .get(getLeads)
  .post(validateLead, createLead);

router.post('/bulk-delete', authorize('admin', 'manager'), bulkDeleteLeads);

router.route('/:id')
  .get(getLeadById)
  .put(updateLead)
  .delete(authorize('admin', 'manager'), deleteLead);

export default router;

