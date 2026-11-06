import { Lead } from '../models/Lead.js';

// In-memory fallback dataset
let memoryLeads = [
  {
    id: '1',
    name: 'Rohit Verma',
    company: 'Acme Technologies',
    title: 'Chief Technology Officer',
    email: 'rohit.verma@acmetech.in',
    phone: '+91 98201 12345',
    status: 'negotiation',
    value: 180000,
    score: 92,
    source: 'Website',
    assignedToName: 'Viraj Somani'
  },
  {
    id: '2',
    name: 'Sarah Williams',
    company: 'Nexus Cloud Systems',
    title: 'Head of Infrastructure',
    email: 'sarah.w@nexuscloud.com',
    phone: '+1 415 555 0192',
    status: 'qualified',
    value: 420000,
    score: 85,
    source: 'LinkedIn',
    assignedToName: 'Rahul Mehta'
  },
  {
    id: '3',
    name: 'Elena Rostova',
    company: 'Vanguard FinTech Group',
    title: 'VP of Product Engineering',
    email: 'elena.rostova@vanguardfin.com',
    phone: '+44 20 7946 0912',
    status: 'won',
    value: 1200000,
    score: 98,
    source: 'Referral',
    assignedToName: 'Alex Rivera'
  },
  {
    id: '4',
    name: 'Dr. Clara Thorne',
    company: 'Pulse Health AI',
    title: 'Director of Healthcare Partnerships',
    email: 'clara.thorne@pulsehealth.ai',
    phone: '+1 617 555 0184',
    status: 'proposal',
    value: 850000,
    score: 89,
    source: 'Google Ads',
    assignedToName: 'Priya Sharma'
  },
  {
    id: '5',
    name: 'David Chen',
    company: 'OmniFlow Global',
    title: 'VP of Digital Operations',
    email: 'david.chen@omniflow.com',
    phone: '+65 6712 3456',
    status: 'contacted',
    value: 260000,
    score: 72,
    source: 'Website',
    assignedToName: 'Viraj Somani'
  }
];

export const getLeads = async (req, res, next) => {
  try {
    try {
      const leads = await Lead.find().sort({ createdAt: -1 });
      if (leads.length > 0) {
        return res.status(200).json({ success: true, count: leads.length, data: leads });
      }
    } catch {}

    res.status(200).json({ success: true, count: memoryLeads.length, data: memoryLeads });
  } catch (err) {
    next(err);
  }
};

export const getLeadById = async (req, res, next) => {
  try {
    const { id } = req.params;
    try {
      const lead = await Lead.findById(id);
      if (lead) return res.status(200).json({ success: true, data: lead });
    } catch {}

    const memLead = memoryLeads.find(l => l.id === id);
    if (!memLead) return res.status(404).json({ success: false, error: 'Lead not found' });
    res.status(200).json({ success: true, data: memLead });
  } catch (err) {
    next(err);
  }
};

export const createLead = async (req, res, next) => {
  try {
    try {
      const lead = await Lead.create(req.body);
      return res.status(201).json({ success: true, data: lead });
    } catch {}

    const newLead = {
      id: `lead-${Date.now()}`,
      ...req.body,
      createdAt: new Date().toISOString()
    };
    memoryLeads.unshift(newLead);
    res.status(201).json({ success: true, data: newLead });
  } catch (err) {
    next(err);
  }
};

export const updateLead = async (req, res, next) => {
  try {
    const { id } = req.params;
    try {
      const lead = await Lead.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
      if (lead) return res.status(200).json({ success: true, data: lead });
    } catch {}

    const index = memoryLeads.findIndex(l => l.id === id);
    if (index === -1) return res.status(404).json({ success: false, error: 'Lead not found' });
    memoryLeads[index] = { ...memoryLeads[index], ...req.body };
    res.status(200).json({ success: true, data: memoryLeads[index] });
  } catch (err) {
    next(err);
  }
};

export const deleteLead = async (req, res, next) => {
  try {
    const { id } = req.params;
    try {
      await Lead.findByIdAndDelete(id);
    } catch {}

    memoryLeads = memoryLeads.filter(l => l.id !== id);
    res.status(200).json({ success: true, message: 'Lead deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export const bulkDeleteLeads = async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ success: false, error: 'Please provide an array of lead IDs' });
    }

    try {
      await Lead.deleteMany({ _id: { $in: ids } });
    } catch {}

    memoryLeads = memoryLeads.filter(l => !ids.includes(l.id));
    res.status(200).json({ success: true, message: `Successfully deleted ${ids.length} leads` });
  } catch (err) {
    next(err);
  }
};

