import { Contact } from '../models/Contact.js';

let memoryContacts = [
  {
    id: 'contact-1',
    name: 'Sarah Williams',
    email: 'sarah.williams@nexuscloud.com',
    phone: '+1 415 555 0192',
    companyName: 'Nexus Cloud Systems',
    title: 'Head of Infrastructure',
    stage: 'lead',
    ownerName: 'Rahul Mehta'
  },
  {
    id: 'contact-2',
    name: 'Elena Rostova',
    email: 'elena.rostova@vanguardfin.com',
    phone: '+44 20 7946 0912',
    companyName: 'Vanguard FinTech Group',
    title: 'VP of Product Engineering',
    stage: 'customer',
    ownerName: 'Alex Rivera'
  },
  {
    id: 'contact-3',
    name: 'Dr. Clara Thorne',
    email: 'clara.thorne@pulsehealth.ai',
    phone: '+1 617 555 0184',
    companyName: 'Pulse Health AI',
    title: 'Director of Healthcare Partnerships',
    stage: 'prospect',
    ownerName: 'Priya Sharma'
  },
  {
    id: 'contact-4',
    name: 'Rohit Verma',
    email: 'rohit.verma@acmetech.in',
    phone: '+91 98201 12345',
    companyName: 'Acme Technologies',
    title: 'Chief Technology Officer',
    stage: 'customer',
    ownerName: 'Viraj Somani'
  }
];

export const getContacts = async (req, res, next) => {
  try {
    try {
      const contacts = await Contact.find().sort({ createdAt: -1 });
      if (contacts.length > 0) return res.status(200).json({ success: true, count: contacts.length, data: contacts });
    } catch {}

    res.status(200).json({ success: true, count: memoryContacts.length, data: memoryContacts });
  } catch (err) {
    next(err);
  }
};

export const createContact = async (req, res, next) => {
  try {
    try {
      const contact = await Contact.create(req.body);
      return res.status(201).json({ success: true, data: contact });
    } catch {}

    const newContact = { id: `contact-${Date.now()}`, ...req.body };
    memoryContacts.unshift(newContact);
    res.status(201).json({ success: true, data: newContact });
  } catch (err) {
    next(err);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    try {
      const contact = await Contact.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
      if (contact) return res.status(200).json({ success: true, data: contact });
    } catch {}

    const idx = memoryContacts.findIndex(c => c.id === id);
    if (idx === -1) return res.status(404).json({ success: false, error: 'Contact not found' });
    memoryContacts[idx] = { ...memoryContacts[idx], ...req.body };
    res.status(200).json({ success: true, data: memoryContacts[idx] });
  } catch (err) {
    next(err);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    try {
      await Contact.findByIdAndDelete(id);
    } catch {}

    memoryContacts = memoryContacts.filter(c => c.id !== id);
    res.status(200).json({ success: true, message: 'Contact deleted successfully' });
  } catch (err) {
    next(err);
  }
};

