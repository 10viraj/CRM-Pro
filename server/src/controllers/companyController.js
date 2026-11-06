import { Company } from '../models/Company.js';

let memoryCompanies = [
  {
    id: 'company-acme',
    name: 'Acme Technologies',
    industry: 'Enterprise Software & SaaS',
    employees: '50-200',
    annualRevenue: '₹12,48,00,000',
    website: 'https://acmetech.in',
    location: 'Mumbai, India',
    status: 'Active Customer',
    ownerName: 'Viraj Somani'
  },
  {
    id: 'company-vanguard',
    name: 'Vanguard FinTech Group',
    industry: 'Financial Technology & Banking',
    employees: '250-500',
    annualRevenue: '₹45,00,00,000',
    website: 'https://vanguardfin.com',
    location: 'London, UK & Bangalore',
    status: 'Active Customer',
    ownerName: 'Alex Rivera'
  },
  {
    id: 'company-pulse',
    name: 'Pulse Health AI',
    industry: 'Digital Health & Biotech',
    employees: '20-50',
    annualRevenue: '₹8,50,00,000',
    website: 'https://pulsehealth.ai',
    location: 'Boston, MA & Hyderabad',
    status: 'Prospect',
    ownerName: 'Priya Sharma'
  },
  {
    id: 'company-nexus',
    name: 'Nexus Cloud Systems',
    industry: 'Cloud Infrastructure & DevOps',
    employees: '100-250',
    annualRevenue: '₹22,00,00,000',
    website: 'https://nexuscloud.com',
    location: 'San Francisco, CA & Pune',
    status: 'Prospect',
    ownerName: 'Rahul Mehta'
  }
];

export const getCompanies = async (req, res, next) => {
  try {
    try {
      const companies = await Company.find().sort({ createdAt: -1 });
      if (companies.length > 0) return res.status(200).json({ success: true, count: companies.length, data: companies });
    } catch {}

    res.status(200).json({ success: true, count: memoryCompanies.length, data: memoryCompanies });
  } catch (err) {
    next(err);
  }
};

export const createCompany = async (req, res, next) => {
  try {
    try {
      const company = await Company.create(req.body);
      return res.status(201).json({ success: true, data: company });
    } catch {}

    const newCompany = { id: `company-${Date.now()}`, ...req.body };
    memoryCompanies.unshift(newCompany);
    res.status(201).json({ success: true, data: newCompany });
  } catch (err) {
    next(err);
  }
};

export const updateCompany = async (req, res, next) => {
  try {
    const { id } = req.params;
    try {
      const company = await Company.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
      if (company) return res.status(200).json({ success: true, data: company });
    } catch {}

    const idx = memoryCompanies.findIndex(c => c.id === id);
    if (idx === -1) return res.status(404).json({ success: false, error: 'Company not found' });
    memoryCompanies[idx] = { ...memoryCompanies[idx], ...req.body };
    res.status(200).json({ success: true, data: memoryCompanies[idx] });
  } catch (err) {
    next(err);
  }
};

export const deleteCompany = async (req, res, next) => {
  try {
    const { id } = req.params;
    try {
      await Company.findByIdAndDelete(id);
    } catch {}

    memoryCompanies = memoryCompanies.filter(c => c.id !== id);
    res.status(200).json({ success: true, message: 'Company deleted successfully' });
  } catch (err) {
    next(err);
  }
};

