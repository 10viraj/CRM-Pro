import express from 'express';
import {
  getEvents,
  createEvent,
  deleteEvent
} from '../controllers/eventController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getEvents)
  .post(createEvent);

router.route('/:id')
  .delete(authorize('admin', 'manager'), deleteEvent);

export default router;

