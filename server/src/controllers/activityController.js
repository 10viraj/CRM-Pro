import { Activity } from '../models/Activity.js';

let memoryActivities = [
  {
    id: 'act-1',
    type: 'call',
    title: 'Called John Smith from Acme Technologies',
    description: 'Discussed cloud migration timelines and technical requirements for AWS multi-zone deployment.',
    timestamp: '2026-11-04T10:30:00.000Z',
    contactName: 'John Smith',
    companyName: 'Acme Technologies',
    performedBy: 'Viraj Somani',
    completed: true
  },
  {
    id: 'act-2',
    type: 'email',
    title: 'Sent proposal to Sarah Williams',
    description: 'Dispatched formal quotation with volume tier discounts and enterprise SLA details.',
    timestamp: '2026-11-04T09:15:00.000Z',
    contactName: 'Sarah Williams',
    companyName: 'Nexus Cloud Systems',
    performedBy: 'Rahul Mehta',
    completed: true
  },
  {
    id: 'act-3',
    type: 'meeting',
    title: 'Product demo completed',
    description: 'Presented live dashboard observability and REST integration capabilities to executive committee.',
    timestamp: '2026-11-03T16:00:00.000Z',
    contactName: 'Dr. Clara Thorne',
    companyName: 'Pulse Health AI',
    performedBy: 'Priya Sharma',
    completed: true
  }
];

export const getActivities = async (req, res, next) => {
  try {
    try {
      const activities = await Activity.find().sort({ timestamp: -1 });
      if (activities.length > 0) return res.status(200).json({ success: true, count: activities.length, data: activities });
    } catch {}

    res.status(200).json({ success: true, count: memoryActivities.length, data: memoryActivities });
  } catch (err) {
    next(err);
  }
};

export const createActivity = async (req, res, next) => {
  try {
    try {
      const activity = await Activity.create(req.body);
      return res.status(201).json({ success: true, data: activity });
    } catch {}

    const newActivity = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
      completed: true,
      ...req.body
    };
    memoryActivities.unshift(newActivity);
    res.status(201).json({ success: true, data: newActivity });
  } catch (err) {
    next(err);
  }
};

export const deleteActivity = async (req, res, next) => {
  try {
    const { id } = req.params;
    try {
      await Activity.findByIdAndDelete(id);
    } catch {}

    memoryActivities = memoryActivities.filter(a => a.id !== id);
    res.status(200).json({ success: true, message: 'Activity deleted successfully' });
  } catch (err) {
    next(err);
  }
};

