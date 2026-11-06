import express from 'express';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask
} from '../controllers/taskController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateTask } from '../middleware/validate.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getTasks)
  .post(validateTask, createTask);

router.route('/:id')
  .put(updateTask)
  .delete(authorize('admin', 'manager'), deleteTask);

export default router;

