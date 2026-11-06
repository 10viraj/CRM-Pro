import express from 'express';
import {
  getActivities,
  createActivity,
  deleteActivity
} from '../controllers/activityController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getActivities)
  .post(createActivity);

router.route('/:id')
  .delete(authorize('admin', 'manager'), deleteActivity);

export default router;

