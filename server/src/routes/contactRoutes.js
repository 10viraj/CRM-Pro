import express from 'express';
import {
  getContacts,
  createContact,
  updateContact,
  deleteContact
} from '../controllers/contactController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateContact } from '../middleware/validate.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getContacts)
  .post(validateContact, createContact);

router.route('/:id')
  .put(updateContact)
  .delete(authorize('admin', 'manager'), deleteContact);

export default router;

