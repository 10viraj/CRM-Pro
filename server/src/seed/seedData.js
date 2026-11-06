import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { Lead } from '../models/Lead.js';
import { Deal } from '../models/Deal.js';
import { Contact } from '../models/Contact.js';
import { Company } from '../models/Company.js';
import { Task } from '../models/Task.js';
import { Activity } from '../models/Activity.js';

dotenv.config();

const seedDatabase = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/crm_pro';

  try {
    console.log('[Seed] Connecting to MongoDB at', uri);
    await mongoose.connect(uri);
    console.log('[Seed] Connected to MongoDB.');

    // Clear existing collections
    await User.deleteMany();
    await Lead.deleteMany();
    await Deal.deleteMany();
    await Contact.deleteMany();
    await Company.deleteMany();
    await Task.deleteMany();
    await Activity.deleteMany();
    console.log('[Seed] Existing collections cleared.');

    // 1. Seed Users
    const adminUser = await User.create({
      name: 'Viraj Somani',
      email: 'viraj@crmpro.io',
      password: 'password123',
      role: 'admin',
      title: 'Developer / Admin',
      company: 'CRM Pro Technologies'
    });

    const managerUser = await User.create({
      name: 'Maya Patel',
      email: 'maya@crmpro.io',
      password: 'password123',
      role: 'manager',
      title: 'Sales Manager',
      company: 'CRM Pro Technologies'
    });

    const repUser = await User.create({
      name: 'Rahul Mehta',
      email: 'rahul@crmpro.io',
      password: 'password123',
      role: 'rep',
      title: 'Senior Account Executive',
      company: 'CRM Pro Technologies'
    });

    console.log('[Seed] Users seeded successfully.');

    // 2. Seed Companies
    await Company.create([
      {
        name: 'TechNova Solutions',
        industry: 'Enterprise AI & Cloud Consulting',
        employees: '250-500 employees',
        annualRevenue: '₹3,80,00,000',
        website: 'https://technovasolutions.in',
        location: 'Bangalore, KA, India',
        status: 'Prospect',
        ownerName: adminUser.name
      },
      {
        name: 'Acme Technologies',
        industry: 'Enterprise Technology & Services',
        employees: '100-250 employees',
        annualRevenue: '₹2,40,00,000',
        website: 'https://acmetechnologies.com',
        location: 'Bangalore, KA, India',
        status: 'Prospect',
        ownerName: adminUser.name
      },
      {
        name: 'BrightLabs',
        industry: 'Design Systems & Product Engineering',
        employees: '50-100 employees',
        annualRevenue: '₹1,90,00,000',
        website: 'https://brightlabs.design',
        location: 'Mumbai, MH, India',
        status: 'Prospect',
        ownerName: repUser.name
      },
      {
        name: 'CloudCore Systems',
        industry: 'Cloud Infrastructure & DevOps',
        employees: '250-500 employees',
        annualRevenue: '₹6,50,00,000',
        website: 'https://cloudcoresystems.com',
        location: 'Pune, MH, India',
        status: 'Prospect',
        ownerName: adminUser.name
      },
      {
        name: 'PixelWorks',
        industry: 'Digital Media & Interactive 3D Web',
        employees: '50-100 employees',
        annualRevenue: '₹1,40,00,000',
        website: 'https://pixelworks.studio',
        location: 'Gurgaon, HR, India',
        status: 'Prospect',
        ownerName: managerUser.name
      },
      {
        name: 'InnovateX',
        industry: 'FinTech Orchestration & RegTech',
        employees: '100-250 employees',
        annualRevenue: '₹4,20,00,000',
        website: 'https://innovatex.io',
        location: 'New Delhi, DL, India',
        status: 'Prospect',
        ownerName: adminUser.name
      },
      {
        name: 'Vanguard FinTech Labs',
        industry: 'Financial Technology',
        employees: '100-250 employees',
        annualRevenue: '₹2,80,00,000',
        website: 'https://vanguardfintech.com',
        location: 'New York, NY, USA',
        status: 'Active Customer',
        ownerName: repUser.name
      },
      {
        name: 'Nexus Cloud Systems',
        industry: 'Cloud Infrastructure',
        employees: '250-500 employees',
        annualRevenue: '₹4,50,00,000',
        website: 'https://nexuscloud.io',
        location: 'San Francisco, CA, USA',
        status: 'Prospect',
        ownerName: adminUser.name
      },
      {
        name: 'Pulse Health AI',
        industry: 'Healthcare Technology',
        employees: '50-100 employees',
        annualRevenue: '₹1,50,00,000',
        website: 'https://pulsehealth.ai',
        location: 'Boston, MA, USA',
        status: 'Prospect',
        ownerName: adminUser.name
      }
    ]);
    console.log('[Seed] Companies seeded successfully.');

    // 3. Seed Contacts
    await Contact.create([
      {
        name: 'Aarav Singhania',
        email: 'aarav.singhania@technovasolutions.in',
        phone: '+91 98200 45123',
        companyName: 'TechNova Solutions',
        title: 'VP of Engineering & AI Initiatives',
        stage: 'prospect',
        ownerName: adminUser.name
      },
      {
        name: 'Rohit Verma',
        email: 'rohit.verma@acmetechnologies.com',
        phone: '+91 98450 12890',
        companyName: 'Acme Technologies',
        title: 'Head of Digital Delivery',
        stage: 'prospect',
        ownerName: adminUser.name
      },
      {
        name: 'Meera Krishnan',
        email: 'meera.k@brightlabs.design',
        phone: '+91 99201 88340',
        companyName: 'BrightLabs',
        title: 'Chief Design Officer',
        stage: 'prospect',
        ownerName: repUser.name
      },
      {
        name: 'Rohan Malhotra',
        email: 'rohan.malhotra@cloudcoresystems.com',
        phone: '+91 98190 77412',
        companyName: 'CloudCore Systems',
        title: 'Head of Cloud Architecture & DevOps',
        stage: 'prospect',
        ownerName: adminUser.name
      },
      {
        name: 'Pooja Sundaram',
        email: 'pooja.s@pixelworks.studio',
        phone: '+91 97110 33890',
        companyName: 'PixelWorks',
        title: 'VP of Creative Technology',
        stage: 'lead',
        ownerName: managerUser.name
      },
      {
        name: 'Aditya Sen',
        email: 'aditya.sen@innovatex.io',
        phone: '+91 98112 66780',
        companyName: 'InnovateX',
        title: 'CTO & Co-founder',
        stage: 'prospect',
        ownerName: adminUser.name
      },
      {
        name: 'David Sterling',
        email: 'd.sterling@vanguardfintech.com',
        phone: '+1 (212) 555-8840',
        companyName: 'Vanguard FinTech Labs',
        title: 'Chief Technology Officer',
        stage: 'customer',
        ownerName: repUser.name
      },
      {
        name: 'Elena Rostova',
        email: 'elena.rostova@nexuscloud.io',
        phone: '+1 (415) 890-1204',
        companyName: 'Nexus Cloud Systems',
        title: 'VP of Engineering',
        stage: 'prospect',
        ownerName: adminUser.name
      },
      {
        name: 'Dr. Clara Thorne',
        email: 'cthorne@pulsehealth.ai',
        phone: '+1 (617) 449-2115',
        companyName: 'Pulse Health AI',
        title: 'Director of Clinical Operations',
        stage: 'prospect',
        ownerName: adminUser.name
      }
    ]);
    console.log('[Seed] Contacts seeded successfully.');

    // 4. Seed Deals
    await Deal.create([
      {
        title: 'TechNova Solutions — Enterprise AI Knowledge Graph & Agents',
        companyName: 'TechNova Solutions',
        contactName: 'Aarav Singhania',
        value: 1450000,
        stage: 'proposal',
        probability: 65,
        priority: 'high',
        expectedCloseDate: new Date('2026-12-18'),
        ownerId: adminUser._id,
        ownerName: adminUser.name
      },
      {
        title: 'Acme Technologies — Website Development & Corporate Portal',
        companyName: 'Acme Technologies',
        contactName: 'Rohit Verma',
        value: 180000,
        stage: 'negotiation',
        probability: 85,
        priority: 'high',
        expectedCloseDate: new Date('2026-11-28'),
        ownerId: adminUser._id,
        ownerName: adminUser.name
      },
      {
        title: 'CloudCore Systems — Multi-Cloud Transit Mesh & VPC Peering',
        companyName: 'CloudCore Systems',
        contactName: 'Rohan Malhotra',
        value: 1800000,
        stage: 'negotiation',
        probability: 85,
        priority: 'high',
        expectedCloseDate: new Date('2026-11-25'),
        ownerId: adminUser._id,
        ownerName: adminUser.name
      },
      {
        title: 'InnovateX — Automated FinTech Compliance Core & API Gateway',
        companyName: 'InnovateX',
        contactName: 'Aditya Sen',
        value: 1120000,
        stage: 'proposal',
        probability: 65,
        priority: 'high',
        expectedCloseDate: new Date('2026-12-10'),
        ownerId: adminUser._id,
        ownerName: adminUser.name
      },
      {
        title: 'BrightLabs — UI/UX Design System & React Component Library',
        companyName: 'BrightLabs',
        contactName: 'Meera Krishnan',
        value: 620000,
        stage: 'qualified',
        probability: 40,
        priority: 'medium',
        expectedCloseDate: new Date('2026-12-22'),
        ownerId: repUser._id,
        ownerName: repUser.name
      },
      {
        title: 'PixelWorks — Interactive 3D Web Experience & Digital Showcase',
        companyName: 'PixelWorks',
        contactName: 'Pooja Sundaram',
        value: 480000,
        stage: 'new_lead',
        probability: 10,
        priority: 'medium',
        expectedCloseDate: new Date('2027-01-15'),
        ownerId: managerUser._id,
        ownerName: managerUser.name
      },
      {
        title: 'Vanguard FinTech — Global Expansion & API Seats',
        companyName: 'Vanguard FinTech Labs',
        contactName: 'David Sterling',
        value: 1248000,
        stage: 'won',
        probability: 100,
        priority: 'high',
        expectedCloseDate: new Date('2026-10-28'),
        ownerId: repUser._id,
        ownerName: repUser.name
      },
      {
        title: 'Pulse Health — HIPAA Certified Workflow Rollout',
        companyName: 'Pulse Health AI',
        contactName: 'Dr. Clara Thorne',
        value: 580000,
        stage: 'qualified',
        probability: 40,
        priority: 'medium',
        expectedCloseDate: new Date('2026-12-05'),
        ownerId: adminUser._id,
        ownerName: adminUser.name
      },
      {
        title: 'Nexus Cloud — Enterprise Infrastructure License',
        companyName: 'Nexus Cloud Systems',
        contactName: 'Elena Rostova',
        value: 750000,
        stage: 'negotiation',
        probability: 85,
        priority: 'high',
        expectedCloseDate: new Date('2026-11-20'),
        ownerId: adminUser._id,
        ownerName: adminUser.name
      }
    ]);
    console.log('[Seed] Deals seeded successfully.');

    // 5. Seed Leads
    await Lead.create([
      {
        name: 'Aarav Singhania',
        company: 'TechNova Solutions',
        title: 'VP of Engineering',
        email: 'aarav.singhania@technovasolutions.in',
        phone: '+91 98200 45123',
        status: 'qualified',
        value: 1450000,
        score: 95,
        source: 'Website',
        assignedTo: adminUser._id,
        assignedToName: adminUser.name
      },
      {
        name: 'Rohit Verma',
        company: 'Acme Technologies',
        title: 'Head of Digital Delivery',
        email: 'rohit.verma@acmetechnologies.com',
        phone: '+91 98450 12890',
        status: 'proposal',
        value: 180000,
        score: 92,
        source: 'Website',
        assignedTo: adminUser._id,
        assignedToName: adminUser.name
      },
      {
        name: 'Rohan Malhotra',
        company: 'CloudCore Systems',
        title: 'Head of Cloud Architecture',
        email: 'rohan.malhotra@cloudcoresystems.com',
        phone: '+91 98190 77412',
        status: 'qualified',
        value: 1800000,
        score: 96,
        source: 'Referral',
        assignedTo: adminUser._id,
        assignedToName: adminUser.name
      },
      {
        name: 'Aditya Sen',
        company: 'InnovateX',
        title: 'CTO & Co-founder',
        email: 'aditya.sen@innovatex.io',
        phone: '+91 98112 66780',
        status: 'proposal',
        value: 1120000,
        score: 91,
        source: 'LinkedIn',
        assignedTo: adminUser._id,
        assignedToName: adminUser.name
      },
      {
        name: 'Meera Krishnan',
        company: 'BrightLabs',
        title: 'Chief Design Officer',
        email: 'meera.k@brightlabs.design',
        phone: '+91 99201 88340',
        status: 'contacted',
        value: 620000,
        score: 88,
        source: 'LinkedIn',
        assignedTo: repUser._id,
        assignedToName: repUser.name
      },
      {
        name: 'Pooja Sundaram',
        company: 'PixelWorks',
        title: 'VP of Creative Technology',
        email: 'pooja.s@pixelworks.studio',
        phone: '+91 97110 33890',
        status: 'new',
        value: 480000,
        score: 78,
        source: 'Google Ads',
        assignedTo: managerUser._id,
        assignedToName: managerUser.name
      },
      {
        name: 'Siddharth Rao',
        company: 'RazorSecure Cyber Labs',
        title: 'Chief Information Security Officer',
        email: 'siddharth@razorsecure.com',
        phone: '+91 98200 11234',
        status: 'won',
        value: 1250000,
        score: 96,
        source: 'Referral',
        assignedTo: adminUser._id,
        assignedToName: adminUser.name
      },
      {
        name: 'Rachel Adams',
        company: 'Apex Data Networks',
        title: 'Director of IT Infrastructure',
        email: 'radams@apexdatanets.com',
        phone: '+1 (415) 332-9011',
        status: 'qualified',
        value: 480000,
        score: 94,
        source: 'Website',
        assignedTo: adminUser._id,
        assignedToName: adminUser.name
      }
    ]);
    console.log('[Seed] Leads seeded successfully.');

    // 6. Seed Tasks
    await Task.create([
      {
        title: 'Finalize Enterprise AI Architecture for TechNova Solutions',
        description: 'Review multi-agent LLM orchestration specifications and compute cluster sizing with Aarav Singhania.',
        status: 'in_progress',
        priority: 'urgent',
        dueDate: new Date('2026-11-06'),
        assigneeName: adminUser.name,
        relatedTo: { type: 'deal', name: 'TechNova Solutions — Enterprise AI Knowledge Graph' }
      },
      {
        title: 'Draft Master Services Agreement (MSA) for Acme Technologies',
        description: 'Prepare standard commercial contract and delivery milestones for Rohit Verma signature.',
        status: 'in_progress',
        priority: 'urgent',
        dueDate: new Date('2026-11-05'),
        assigneeName: adminUser.name,
        relatedTo: { type: 'deal', name: 'Acme Technologies — Website Development' }
      },
      {
        title: 'Review UI/UX Design System Component Library with BrightLabs',
        description: 'Align on 24 accessible React components and Figma token integration pipeline with Meera Krishnan.',
        status: 'todo',
        priority: 'high',
        dueDate: new Date('2026-11-07'),
        assigneeName: repUser.name,
        relatedTo: { type: 'deal', name: 'BrightLabs — UI/UX Design System' }
      },
      {
        title: 'Executive Multi-Cloud Pricing Review for CloudCore Systems',
        description: 'Review proposed multi-region VPC peering discount matrix with VP of Sales before Friday call.',
        status: 'todo',
        priority: 'urgent',
        dueDate: new Date('2026-11-04'),
        assigneeName: adminUser.name,
        relatedTo: { type: 'deal', name: 'CloudCore Systems — Multi-Cloud Transit Mesh' }
      },
      {
        title: 'Interactive 3D WebGL Proof of Concept Review for PixelWorks',
        description: 'Validate frame rates and compressed glTF asset loading speeds on mobile viewports.',
        status: 'review',
        priority: 'medium',
        dueDate: new Date('2026-11-08'),
        assigneeName: managerUser.name,
        relatedTo: { type: 'deal', name: 'PixelWorks — Interactive 3D Web Experience' }
      },
      {
        title: 'Deliver Regulatory Compliance Annexure to Aditya Sen at InnovateX',
        description: 'Email signed compliance framework document and API SLA response commitments.',
        status: 'todo',
        priority: 'high',
        dueDate: new Date('2026-11-06'),
        assigneeName: adminUser.name,
        relatedTo: { type: 'deal', name: 'InnovateX — Automated FinTech Compliance Core' }
      },
      {
        title: 'PoC Telemetry Ingress Review with Vikram Mehta',
        description: 'Confirm MQTT telemetry ingress specifications and cloud broker throughput benchmarks.',
        status: 'in_progress',
        priority: 'high',
        dueDate: new Date('2026-11-06'),
        assigneeName: managerUser.name,
        relatedTo: { type: 'deal', name: 'Aether Robotics — Fleet Telemetry Integration' }
      },
      {
        title: 'Customer Onboarding Kickoff: Vanguard FinTech Labs',
        description: 'Introduce lead Customer Success Architect and initialize API production keys.',
        status: 'completed',
        priority: 'medium',
        dueDate: new Date('2026-10-29'),
        assigneeName: repUser.name,
        relatedTo: { type: 'company', name: 'Vanguard FinTech Labs' }
      }
    ]);
    console.log('[Seed] Tasks seeded successfully.');

    // 7. Seed Activities
    await Activity.create([
      {
        type: 'call',
        title: 'Called Rohit Verma from Acme Technologies',
        description: 'Reviewed Website Development SOW delivery milestones and agreed on ₹54,000 milestone invoice advance.',
        timestamp: new Date('2026-11-04T10:30:00Z'),
        contactName: 'Rohit Verma',
        companyName: 'Acme Technologies',
        dealTitle: 'Acme Technologies — Website Development',
        performedBy: adminUser.name,
        completed: true
      },
      {
        type: 'email',
        title: 'Sent proposal to Aarav Singhania at TechNova Solutions',
        description: 'Sent formal enterprise proposal for Enterprise AI Knowledge Graph (₹14,50,000) with custom cluster sizing.',
        timestamp: new Date('2026-11-04T11:45:00Z'),
        contactName: 'Aarav Singhania',
        companyName: 'TechNova Solutions',
        dealTitle: 'TechNova Solutions — Enterprise AI Knowledge Graph & Agents',
        performedBy: adminUser.name,
        completed: true
      },
      {
        type: 'deal_update',
        title: 'Deal Stage Updated: Moved CloudCore Systems to Negotiation',
        description: 'Pipeline stage updated from Qualified to Negotiation. Deal value ₹18,00,000 with 85% probability.',
        timestamp: new Date('2026-11-04T14:15:00Z'),
        companyName: 'CloudCore Systems',
        dealTitle: 'CloudCore Systems — Multi-Cloud Transit Mesh',
        performedBy: adminUser.name,
        completed: true
      },
      {
        type: 'note',
        title: 'Added strategic note on InnovateX Compliance Core',
        description: 'Aditya Sen verified payment gateway sandbox compliance. Financial regulatory audit report successfully validated.',
        timestamp: new Date('2026-11-04T15:30:00Z'),
        companyName: 'InnovateX',
        dealTitle: 'InnovateX — Automated FinTech Compliance Core & API Gateway',
        performedBy: adminUser.name,
        completed: true
      },
      {
        type: 'task',
        title: 'Completed task: Finalize Design System sprint scope for BrightLabs',
        description: 'Agreed on 24 core React components and Figma design token synchronization pipeline with CDO Meera Krishnan.',
        timestamp: new Date('2026-11-04T16:45:00Z'),
        companyName: 'BrightLabs',
        dealTitle: 'BrightLabs — UI/UX Design System',
        performedBy: repUser.name,
        completed: true
      },
      {
        type: 'meeting',
        title: 'Interactive 3D Demo Walkthrough with Pooja Sundaram',
        description: 'Showcased WebGL 3D rendering pipeline and asset streaming benchmarks for PixelWorks creative showcase.',
        timestamp: new Date('2026-11-04T17:15:00Z'),
        contactName: 'Pooja Sundaram',
        companyName: 'PixelWorks',
        dealTitle: 'PixelWorks — Interactive 3D Web Experience',
        performedBy: managerUser.name,
        completed: true
      },
      {
        type: 'meeting',
        title: 'Product demo completed with Dr. Clara Thorne',
        description: 'Detailed walkthrough of HIPAA compliant telemetry pipeline, audit trail retention, and granular RBAC permissions.',
        timestamp: new Date('2026-11-03T16:30:00Z'),
        contactName: 'Dr. Clara Thorne',
        companyName: 'Pulse Health AI',
        dealTitle: 'Pulse Health — HIPAA Certified Workflow Rollout',
        performedBy: adminUser.name,
        completed: true
      },
      {
        type: 'deal_update',
        title: 'Deal Won: Vanguard FinTech Labs (₹12,48,000)',
        description: 'Executed master service agreement and received countersigned contract for global cloud expansion rollout.',
        timestamp: new Date('2026-11-03T10:00:00Z'),
        companyName: 'Vanguard FinTech Labs',
        dealTitle: 'Vanguard FinTech — Global Expansion & API Seats',
        performedBy: repUser.name,
        completed: true
      }
    ]);
    console.log('[Seed] Activities seeded successfully.');

    console.log('[Seed] All realistic demo collections seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]', err.message);
    process.exit(1);
  }
};

seedDatabase();
