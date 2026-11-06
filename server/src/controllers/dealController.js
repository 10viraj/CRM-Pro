import { Deal } from '../models/Deal.js';

let memoryDeals = [
  {
    id: 'deal-acme',
    title: 'Acme Technologies — Website Development & Cloud Migration',
    companyName: 'Acme Technologies',
    contactName: 'Rohit Verma',
    value: 180000,
    stage: 'negotiation',
    probability: 80,
    priority: 'high',
    ownerName: 'Viraj Somani',
    expectedCloseDate: '2026-11-20'
  },
  {
    id: 'deal-vanguard',
    title: 'Vanguard FinTech — Microservices & Security Compliance Engine',
    companyName: 'Vanguard FinTech Group',
    contactName: 'Elena Rostova',
    value: 1200000,
    stage: 'won',
    probability: 100,
    priority: 'urgent',
    ownerName: 'Alex Rivera',
    expectedCloseDate: '2026-11-02'
  },
  {
    id: 'deal-pulse',
    title: 'Pulse Health AI — HIPAA Analytics Pipeline Integration',
    companyName: 'Pulse Health AI',
    contactName: 'Dr. Clara Thorne',
    value: 850000,
    stage: 'proposal',
    probability: 65,
    priority: 'high',
    ownerName: 'Priya Sharma',
    expectedCloseDate: '2026-11-25'
  },
  {
    id: 'deal-nexus',
    title: 'Nexus Cloud — Kubernetes Managed Services Retainer',
    companyName: 'Nexus Cloud Systems',
    contactName: 'Sarah Williams',
    value: 420000,
    stage: 'qualified',
    probability: 40,
    priority: 'medium',
    ownerName: 'Rahul Mehta',
    expectedCloseDate: '2026-11-15'
  },
  {
    id: 'deal-omniflow',
    title: 'OmniFlow Global — Enterprise Supply Chain Telemetry',
    companyName: 'OmniFlow Global',
    contactName: 'David Chen',
    value: 260000,
    stage: 'new_lead',
    probability: 20,
    priority: 'low',
    ownerName: 'Viraj Somani',
    expectedCloseDate: '2026-12-05'
  }
];

export const getDeals = async (req, res, next) => {
  try {
    try {
      const deals = await Deal.find().sort({ createdAt: -1 });
      if (deals.length > 0) return res.status(200).json({ success: true, count: deals.length, data: deals });
    } catch {}

    res.status(200).json({ success: true, count: memoryDeals.length, data: memoryDeals });
  } catch (err) {
    next(err);
  }
};

export const getDealById = async (req, res, next) => {
  try {
    const { id } = req.params;
    try {
      const deal = await Deal.findById(id);
      if (deal) return res.status(200).json({ success: true, data: deal });
    } catch {}

    const memDeal = memoryDeals.find(d => d.id === id);
    if (!memDeal) return res.status(404).json({ success: false, error: 'Deal not found' });
    res.status(200).json({ success: true, data: memDeal });
  } catch (err) {
    next(err);
  }
};

export const createDeal = async (req, res, next) => {
  try {
    try {
      const deal = await Deal.create(req.body);
      return res.status(201).json({ success: true, data: deal });
    } catch {}

    const newDeal = {
      id: `deal-${Date.now()}`,
      ...req.body,
      createdAt: new Date().toISOString()
    };
    memoryDeals.unshift(newDeal);
    res.status(201).json({ success: true, data: newDeal });
  } catch (err) {
    next(err);
  }
};

export const updateDeal = async (req, res, next) => {
  try {
    const { id } = req.params;
    try {
      const deal = await Deal.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
      if (deal) return res.status(200).json({ success: true, data: deal });
    } catch {}

    const idx = memoryDeals.findIndex(d => d.id === id);
    if (idx === -1) return res.status(404).json({ success: false, error: 'Deal not found' });
    memoryDeals[idx] = { ...memoryDeals[idx], ...req.body };
    res.status(200).json({ success: true, data: memoryDeals[idx] });
  } catch (err) {
    next(err);
  }
};

export const updateDealStage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { stage } = req.body;

    const probabilities = {
      new_lead: 20,
      contacted: 30,
      qualified: 40,
      proposal: 65,
      negotiation: 80,
      won: 100,
      lost: 0
    };

    const probability = probabilities[stage] || 20;

    try {
      const deal = await Deal.findByIdAndUpdate(id, { stage, probability }, { new: true });
      if (deal) return res.status(200).json({ success: true, data: deal });
    } catch {}

    const idx = memoryDeals.findIndex(d => d.id === id);
    if (idx === -1) return res.status(404).json({ success: false, error: 'Deal not found' });
    memoryDeals[idx] = { ...memoryDeals[idx], stage, probability };
    res.status(200).json({ success: true, data: memoryDeals[idx] });
  } catch (err) {
    next(err);
  }
};

export const deleteDeal = async (req, res, next) => {
  try {
    const { id } = req.params;
    try {
      await Deal.findByIdAndDelete(id);
    } catch {}

    memoryDeals = memoryDeals.filter(d => d.id !== id);
    res.status(200).json({ success: true, message: 'Deal deleted successfully' });
  } catch (err) {
    next(err);
  }
};

