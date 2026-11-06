import express from 'express';
import {
  getDeals,
  getDealById,
  createDeal,
  updateDeal,
  updateDealStage,
  deleteDeal
} from '../controllers/dealController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateDeal } from '../middleware/validate.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getDeals)
  .post(validateDeal, createDeal);

router.patch('/:id/stage', updateDealStage);

router.route('/:id')
  .get(getDealById)
  .put(updateDeal)
  .delete(authorize('admin', 'manager'), deleteDeal);

export default router;

