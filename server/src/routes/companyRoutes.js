import express from 'express';
import {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany
} from '../controllers/companyController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getCompanies)
  .post(createCompany);

router.route('/:id')
  .put(updateCompany)
  .delete(authorize('admin', 'manager'), deleteCompany);

export default router;

