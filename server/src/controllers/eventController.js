import { Event } from '../models/Event.js';

let memoryEvents = [
  {
    id: 'ev-1',
    title: 'Client Meeting with Acme Technologies CTO',
    date: '2026-11-04',
    startTime: '10:00',
    endTime: '11:00',
    type: 'Client Meeting',
    participants: ['Viraj Somani', 'Rohit Verma'],
    relatedContact: 'Rohit Verma',
    relatedDeal: 'Acme Technologies',
    meetingLink: 'https://meet.google.com/abc-crm-pro',
    notes: 'Architecture signoff meeting'
  },
  {
    id: 'ev-2',
    title: 'Follow-up Call with Nexus Cloud',
    date: '2026-11-04',
    startTime: '14:30',
    endTime: '15:15',
    type: 'Follow-up Call',
    participants: ['Rahul Mehta', 'Sarah Williams'],
    relatedContact: 'Sarah Williams',
    meetingLink: 'https://meet.google.com/nex-call-pro',
    notes: 'Q4 deployment schedule review'
  },
  {
    id: 'ev-3',
    title: 'Product Demo for Pulse Health AI Team',
    date: '2026-11-05',
    startTime: '15:00',
    endTime: '16:00',
    type: 'Product Demo',
    participants: ['Dr. Clara Thorne', 'Priya Sharma'],
    relatedContact: 'Dr. Clara Thorne',
    meetingLink: 'https://meet.google.com/pul-demo-pro',
    notes: 'Demonstrating HIPAA compliant audit trails'
  }
];

export const getEvents = async (req, res, next) => {
  try {
    try {
      const events = await Event.find().sort({ date: 1, startTime: 1 });
      if (events.length > 0) return res.status(200).json({ success: true, count: events.length, data: events });
    } catch {}

    res.status(200).json({ success: true, count: memoryEvents.length, data: memoryEvents });
  } catch (err) {
    next(err);
  }
};

export const createEvent = async (req, res, next) => {
  try {
    try {
      const event = await Event.create(req.body);
      return res.status(201).json({ success: true, data: event });
    } catch {}

    const newEv = { id: `ev-${Date.now()}`, ...req.body };
    memoryEvents.push(newEv);
    res.status(201).json({ success: true, data: newEv });
  } catch (err) {
    next(err);
  }
};

export const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    try {
      await Event.findByIdAndDelete(id);
    } catch {}

    memoryEvents = memoryEvents.filter(e => e.id !== id);
    res.status(200).json({ success: true, message: 'Event deleted successfully' });
  } catch (err) {
    next(err);
  }
};

