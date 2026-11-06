import { Company, Contact, Deal, Lead, PipelineStageConfig, User, Activity, AppNotification, TaskItem, CalendarEvent, CalendarEventType, NotificationPreferences } from '../types';

export const USERS: User[] = [
  {
    id: 'user-0',
    name: 'Viraj Somani',
    email: 'viraj@crmpro.io',
    role: 'Developer / Admin',
    initials: 'VS'
  },
  {
    id: 'user-1',
    name: 'Alex Rivera',
    email: 'alex.rivera@crmpro.io',
    role: 'Account Executive',
    initials: 'AR'
  },
  {
    id: 'user-2',
    name: 'Maya Patel',
    email: 'maya.patel@crmpro.io',
    role: 'Sales Manager',
    initials: 'MP'
  },
  {
    id: 'user-3',
    name: 'Marcus Vance',
    email: 'marcus.vance@crmpro.io',
    role: 'SDR',
    initials: 'MV'
  },
  {
    id: 'user-4',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@crmpro.io',
    role: 'Admin',
    initials: 'SJ'
  }
];

export const CURRENT_USER: User = USERS[0];

export const PIPELINE_STAGES: PipelineStageConfig[] = [
  {
    key: 'new_lead',
    label: 'New Lead',
    color: '#3b82f6',
    probability: 10,
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700'
  },
  {
    key: 'qualified',
    label: 'Qualified',
    color: '#06b6d4',
    probability: 40,
    badgeBg: 'bg-cyan-50',
    badgeText: 'text-cyan-700'
  },
  {
    key: 'proposal',
    label: 'Proposal',
    color: '#f59e0b',
    probability: 65,
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-700'
  },
  {
    key: 'negotiation',
    label: 'Negotiation',
    color: '#ec4899',
    probability: 85,
    badgeBg: 'bg-pink-50',
    badgeText: 'text-pink-700'
  },
  {
    key: 'won',
    label: 'Won',
    color: '#10b981',
    probability: 100,
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700'
  },
  {
    key: 'lost',
    label: 'Lost',
    color: '#64748b',
    probability: 0,
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-600'
  }
];

export const MOCK_COMPANIES: Company[] = [
  {
    id: 'comp-technova',
    name: 'TechNova Solutions',
    domain: 'technovasolutions.in',
    industry: 'Enterprise AI & Cloud Consulting',
    size: '250-500 employees',
    annualRevenue: 38000000,
    location: 'Bangalore, KA',
    phone: '+91 80 4910 7700',
    website: 'https://technovasolutions.in',
    status: 'Prospect',
    owner: USERS[0],
    description: 'Premier enterprise AI consultancy delivering agentic automation, cloud modernization, and custom LLM applications.',
    notes: [
      {
        id: 'cn-technova-1',
        author: USERS[0],
        content: 'Aarav Singhania reviewed the Enterprise AI Knowledge Graph proposal for ₹14,50,000. Executive committee presentation scheduled.',
        createdAt: '2026-11-02T11:00:00Z'
      }
    ],
    documents: [
      {
        id: 'doc-technova-1',
        name: 'TechNova_AI_Knowledge_Graph_Architecture.pdf',
        size: '3.8 MB',
        type: 'pdf',
        uploadedAt: '2026-11-01T14:30:00Z',
        uploadedBy: USERS[0]
      },
      {
        id: 'doc-technova-2',
        name: 'Enterprise_SLA_and_Security_Annexure.pdf',
        size: '1.9 MB',
        type: 'pdf',
        uploadedAt: '2026-11-02T10:15:00Z',
        uploadedBy: USERS[0]
      }
    ],
    createdAt: '2026-09-10T10:00:00Z'
  },
  {
    id: 'comp-acme',
    name: 'Acme Technologies',
    domain: 'acmetechnologies.com',
    industry: 'Enterprise Technology & Services',
    size: '100-250 employees',
    annualRevenue: 24000000,
    location: 'Bangalore, KA',
    phone: '+91 80 4122 8900',
    website: 'https://acmetechnologies.com',
    status: 'Prospect',
    owner: USERS[0],
    description: 'Premier enterprise software integration partner delivering modern digital portals, microservices, and cloud apps.',
    notes: [
      {
        id: 'cn-acme-1',
        author: USERS[0],
        content: 'Acme Technologies evaluated custom React portal delivery. Rohit Verma requested formal statement of work.',
        createdAt: '2026-10-28T10:00:00Z'
      }
    ],
    documents: [
      {
        id: 'doc-acme-1',
        name: 'Acme_Technologies_MSA_v2.pdf',
        size: '2.4 MB',
        type: 'pdf',
        uploadedAt: '2026-10-25T14:30:00Z',
        uploadedBy: USERS[0]
      },
      {
        id: 'doc-acme-2',
        name: 'React_Portal_Technical_Architecture.pdf',
        size: '4.8 MB',
        type: 'pdf',
        uploadedAt: '2026-10-22T11:15:00Z',
        uploadedBy: USERS[0]
      },
      {
        id: 'doc-acme-3',
        name: 'Commercial_Pricing_Quote_Q4.xlsx',
        size: '420 KB',
        type: 'sheet',
        uploadedAt: '2026-11-01T09:45:00Z',
        uploadedBy: USERS[0]
      }
    ],
    createdAt: '2026-09-01T10:00:00Z'
  },
  {
    id: 'comp-brightlabs',
    name: 'BrightLabs',
    domain: 'brightlabs.design',
    industry: 'Design Systems & Product Engineering',
    size: '50-100 employees',
    annualRevenue: 19000000,
    location: 'Mumbai, MH',
    phone: '+91 22 6150 4420',
    website: 'https://brightlabs.design',
    status: 'Prospect',
    owner: USERS[1],
    description: 'Award-winning UX studio and design engineering laboratory building scalable SaaS design systems and cross-platform mobile apps.',
    notes: [
      {
        id: 'cn-brightlabs-1',
        author: USERS[1],
        content: 'Meera Krishnan approved initial sprint scope for React component library & Figma token pipeline.',
        createdAt: '2026-11-01T15:20:00Z'
      }
    ],
    documents: [
      {
        id: 'doc-brightlabs-1',
        name: 'BrightLabs_Design_Tokens_Specification.pdf',
        size: '2.8 MB',
        type: 'pdf',
        uploadedAt: '2026-10-29T11:00:00Z',
        uploadedBy: USERS[1]
      }
    ],
    createdAt: '2026-08-20T11:30:00Z'
  },
  {
    id: 'comp-cloudcore',
    name: 'CloudCore Systems',
    domain: 'cloudcoresystems.com',
    industry: 'Cloud Infrastructure & DevOps',
    size: '250-500 employees',
    annualRevenue: 65000000,
    location: 'Pune, MH',
    phone: '+91 20 6790 1200',
    website: 'https://cloudcoresystems.com',
    status: 'Prospect',
    owner: USERS[0],
    description: 'Multi-region hybrid cloud infrastructure provider specializing in Kubernetes clusters, secure VPC meshes, and observability pipelines.',
    notes: [
      {
        id: 'cn-cloudcore-1',
        author: USERS[0],
        content: 'Rohan Malhotra confirmed negotiation on multi-cloud transit contract (₹18,00,000) with 85% probability.',
        createdAt: '2026-11-03T14:45:00Z'
      }
    ],
    documents: [
      {
        id: 'doc-cloudcore-1',
        name: 'Multi_Cloud_Transit_Mesh_Proposal.pdf',
        size: '5.1 MB',
        type: 'pdf',
        uploadedAt: '2026-10-30T16:00:00Z',
        uploadedBy: USERS[0]
      }
    ],
    createdAt: '2026-07-15T09:00:00Z'
  },
  {
    id: 'comp-pixelworks',
    name: 'PixelWorks',
    domain: 'pixelworks.studio',
    industry: 'Digital Media & Interactive 3D Web',
    size: '50-100 employees',
    annualRevenue: 14000000,
    location: 'Gurgaon, HR',
    phone: '+91 124 456 8900',
    website: 'https://pixelworks.studio',
    status: 'Prospect',
    owner: USERS[2],
    description: 'Creative engineering studio building high-performance WebGL, immersive 3D digital twins, and interactive brand experiences.',
    notes: [
      {
        id: 'cn-pixelworks-1',
        author: USERS[2],
        content: 'Pooja Sundaram requested technical demo on real-time 3D product showcase and asset streaming.',
        createdAt: '2026-11-02T16:15:00Z'
      }
    ],
    documents: [
      {
        id: 'doc-pixelworks-1',
        name: 'PixelWorks_Interactive_3D_Scope.pdf',
        size: '4.2 MB',
        type: 'pdf',
        uploadedAt: '2026-11-01T12:00:00Z',
        uploadedBy: USERS[2]
      }
    ],
    createdAt: '2026-09-05T13:45:00Z'
  },
  {
    id: 'comp-innovatex',
    name: 'InnovateX',
    domain: 'innovatex.io',
    industry: 'FinTech Orchestration & RegTech',
    size: '100-250 employees',
    annualRevenue: 42000000,
    location: 'New Delhi, DL',
    phone: '+91 11 4980 5500',
    website: 'https://innovatex.io',
    status: 'Prospect',
    owner: USERS[0],
    description: 'Algorithmic payment orchestration engine and automated regulatory compliance platform for high-volume banking institutions.',
    notes: [
      {
        id: 'cn-innovatex-1',
        author: USERS[0],
        content: 'Aditya Sen verified API compliance requirements for payment gateway integration. SOW submitted for ₹11,20,000.',
        createdAt: '2026-11-03T11:30:00Z'
      }
    ],
    documents: [
      {
        id: 'doc-innovatex-1',
        name: 'InnovateX_Compliance_Engine_SOW.pdf',
        size: '3.4 MB',
        type: 'pdf',
        uploadedAt: '2026-11-02T15:00:00Z',
        uploadedBy: USERS[0]
      }
    ],
    createdAt: '2026-08-11T10:00:00Z'
  },
  {
    id: 'comp-1',
    name: 'Nexus Cloud Systems',
    domain: 'nexuscloud.io',
    industry: 'Cloud Infrastructure',
    size: '250-500 employees',
    annualRevenue: 45000000,
    location: 'San Francisco, CA',
    phone: '+1 (415) 890-1200',
    website: 'https://nexuscloud.io',
    status: 'Prospect',
    owner: USERS[0],
    description: 'Enterprise multi-cloud orchestration and observability platform.',
    notes: [
      {
        id: 'cn-nexus-1',
        author: USERS[0],
        content: 'Elena Rostova confirmed budget approval for enterprise infrastructure rollout.',
        createdAt: '2026-10-20T14:30:00Z'
      }
    ],
    documents: [
      {
        id: 'doc-nexus-1',
        name: 'Nexus_Cloud_Enterprise_License.pdf',
        size: '3.1 MB',
        type: 'pdf',
        uploadedAt: '2026-10-25T11:00:00Z',
        uploadedBy: USERS[0]
      }
    ],
    createdAt: '2026-09-12T10:00:00Z'
  },
  {
    id: 'comp-2',
    name: 'Vanguard FinTech Labs',
    domain: 'vanguardfintech.com',
    industry: 'Financial Technology',
    size: '100-250 employees',
    annualRevenue: 28000000,
    location: 'New York, NY',
    phone: '+1 (212) 555-8832',
    website: 'https://vanguardfintech.com',
    status: 'Active Customer',
    owner: USERS[1],
    description: 'Next-generation compliance and algorithmic payments gateway.',
    notes: [
      {
        id: 'cn-vanguard-1',
        author: USERS[1],
        content: 'Flagship enterprise client signed global expansion agreement for ₹12.48L.',
        createdAt: '2026-10-28T18:00:00Z'
      }
    ],
    documents: [
      {
        id: 'doc-vanguard-1',
        name: 'Vanguard_Master_Services_Agreement_Signed.pdf',
        size: '1.9 MB',
        type: 'pdf',
        uploadedAt: '2026-10-28T17:45:00Z',
        uploadedBy: USERS[1]
      }
    ],
    createdAt: '2026-08-01T09:30:00Z'
  },
  {
    id: 'comp-3',
    name: 'Pulse Health AI',
    domain: 'pulsehealth.ai',
    industry: 'Healthcare Technology',
    size: '50-100 employees',
    annualRevenue: 15000000,
    location: 'Boston, MA',
    phone: '+1 (617) 449-2100',
    website: 'https://pulsehealth.ai',
    status: 'Prospect',
    owner: USERS[0],
    description: 'AI-assisted clinical workflow automation for hospital networks.',
    notes: [
      {
        id: 'cn-pulse-1',
        author: USERS[0],
        content: 'Awaiting BAA and clinical data security questionnaire review.',
        createdAt: '2026-10-25T16:00:00Z'
      }
    ],
    documents: [
      {
        id: 'doc-pulse-1',
        name: 'HIPAA_BAA_Agreement_Draft.docx',
        size: '860 KB',
        type: 'doc',
        uploadedAt: '2026-10-26T14:00:00Z',
        uploadedBy: USERS[0]
      }
    ],
    createdAt: '2026-10-04T14:15:00Z'
  },
  {
    id: 'comp-4',
    name: 'Aether Robotics',
    domain: 'aetherrobotics.co',
    industry: 'Industrial Automation',
    size: '500-1000 employees',
    annualRevenue: 95000000,
    location: 'Austin, TX',
    phone: '+1 (512) 782-9900',
    website: 'https://aetherrobotics.co',
    status: 'Prospect',
    owner: USERS[2],
    description: 'Warehouse automation software and autonomous mobile robots.',
    notes: [],
    documents: [
      {
        id: 'doc-aether-1',
        name: 'Robotics_Telemetry_Integration_Spec.pdf',
        size: '6.2 MB',
        type: 'pdf',
        uploadedAt: '2026-10-28T09:30:00Z',
        uploadedBy: USERS[2]
      }
    ],
    createdAt: '2026-07-19T11:00:00Z'
  }
];

export const MOCK_CONTACTS: Contact[] = [
  {
    id: 'cont-aarav',
    name: 'Aarav Singhania',
    email: 'aarav.singhania@technovasolutions.in',
    phone: '+91 98200 45123',
    title: 'VP of Engineering & AI Initiatives',
    companyId: 'comp-technova',
    companyName: 'TechNova Solutions',
    lifecycleStage: 'opportunity',
    owner: USERS[0],
    tags: ['Decision Maker', 'Enterprise AI', 'High Value'],
    notes: [
      {
        id: 'n-aarav-1',
        author: USERS[0],
        content: 'Aarav is championing the AI Knowledge Graph pilot. Requested custom benchmark report on LLM inference latency.',
        createdAt: '2026-11-02T11:30:00Z'
      }
    ],
    createdAt: '2026-10-12T10:00:00Z',
    lastActivityDate: '2026-11-04T11:45:00Z'
  },
  {
    id: 'cont-rohit',
    name: 'Rohit Verma',
    email: 'rohit.verma@acmetechnologies.com',
    phone: '+91 98450 12890',
    title: 'Head of Digital Delivery',
    companyId: 'comp-acme',
    companyName: 'Acme Technologies',
    lifecycleStage: 'opportunity',
    owner: USERS[0],
    tags: ['Decision Maker', 'Digital Transformation', 'High Priority'],
    notes: [
      {
        id: 'n-rohit-1',
        author: USERS[0],
        content: 'Rohit reviewed the commercial proposal for Website Development (₹1,80,000). Wants React portal deployed before Q1.',
        createdAt: '2026-11-01T11:00:00Z'
      }
    ],
    createdAt: '2026-10-10T10:00:00Z',
    lastActivityDate: '2026-11-04T10:30:00Z'
  },
  {
    id: 'cont-meera',
    name: 'Meera Krishnan',
    email: 'meera.k@brightlabs.design',
    phone: '+91 99201 88340',
    title: 'Chief Design Officer',
    companyId: 'comp-brightlabs',
    companyName: 'BrightLabs',
    lifecycleStage: 'opportunity',
    owner: USERS[1],
    tags: ['Design Systems', 'Mobile App', 'Key Stakeholder'],
    notes: [
      {
        id: 'n-meera-1',
        author: USERS[1],
        content: 'Meera confirmed design sprint milestones. Evaluated design token exports and Tailwind theme integration.',
        createdAt: '2026-11-01T15:20:00Z'
      }
    ],
    createdAt: '2026-09-20T11:00:00Z',
    lastActivityDate: '2026-11-04T16:45:00Z'
  },
  {
    id: 'cont-rohan',
    name: 'Rohan Malhotra',
    email: 'rohan.malhotra@cloudcoresystems.com',
    phone: '+91 98190 77412',
    title: 'Head of Cloud Architecture & DevOps',
    companyId: 'comp-cloudcore',
    companyName: 'CloudCore Systems',
    lifecycleStage: 'opportunity',
    owner: USERS[0],
    tags: ['Cloud Mesh', 'VPC Architecture', 'Technical Buyer'],
    notes: [
      {
        id: 'n-rohan-1',
        author: USERS[0],
        content: 'Rohan completed the technical diligence call. Negotiating payment schedules on the ₹18,00,000 transit mesh agreement.',
        createdAt: '2026-11-03T14:45:00Z'
      }
    ],
    createdAt: '2026-09-01T14:00:00Z',
    lastActivityDate: '2026-11-04T14:15:00Z'
  },
  {
    id: 'cont-pooja',
    name: 'Pooja Sundaram',
    email: 'pooja.s@pixelworks.studio',
    phone: '+91 97110 33890',
    title: 'VP of Creative Technology',
    companyId: 'comp-pixelworks',
    companyName: 'PixelWorks',
    lifecycleStage: 'lead',
    owner: USERS[2],
    tags: ['Interactive 3D', 'WebGL Experience'],
    notes: [
      {
        id: 'n-pooja-1',
        author: USERS[2],
        content: 'Introductory call scheduled to review high-fidelity WebGL 3D showcase scope.',
        createdAt: '2026-11-02T16:15:00Z'
      }
    ],
    createdAt: '2026-10-15T12:00:00Z',
    lastActivityDate: '2026-11-04T17:15:00Z'
  },
  {
    id: 'cont-aditya',
    name: 'Aditya Sen',
    email: 'aditya.sen@innovatex.io',
    phone: '+91 98112 66780',
    title: 'CTO & Co-founder',
    companyId: 'comp-innovatex',
    companyName: 'InnovateX',
    lifecycleStage: 'opportunity',
    owner: USERS[0],
    tags: ['FinTech Core', 'Compliance Engine', 'Executive Sponsor'],
    notes: [
      {
        id: 'n-aditya-1',
        author: USERS[0],
        content: 'Aditya confirmed regulatory sandbox testing passed. Requested final commercial proposal for ₹11,20,000.',
        createdAt: '2026-11-03T11:30:00Z'
      }
    ],
    createdAt: '2026-09-18T10:00:00Z',
    lastActivityDate: '2026-11-04T15:30:00Z'
  },
  {
    id: 'cont-sarah',
    name: 'Sarah Williams',
    email: 'sarah.williams@technovasolutions.in',
    phone: '+91 98201 99400',
    title: 'Director of Product Operations',
    companyId: 'comp-technova',
    companyName: 'TechNova Solutions',
    lifecycleStage: 'opportunity',
    owner: USERS[0],
    tags: ['Product Strategy', 'Q4 Budget'],
    notes: [],
    createdAt: '2026-10-18T14:00:00Z',
    lastActivityDate: '2026-11-03T09:15:00Z'
  },
  {
    id: 'cont-1',
    name: 'Elena Rostova',
    email: 'elena.rostova@nexuscloud.io',
    phone: '+1 (415) 890-1204',
    title: 'VP of Engineering',
    companyId: 'comp-1',
    companyName: 'Nexus Cloud Systems',
    lifecycleStage: 'opportunity',
    owner: USERS[0],
    tags: ['Decision Maker', 'Technical Evaluator', 'High Value'],
    notes: [],
    createdAt: '2026-09-15T10:00:00Z',
    lastActivityDate: '2026-11-01T15:20:00Z'
  },
  {
    id: 'cont-2',
    name: 'David Sterling',
    email: 'd.sterling@vanguardfintech.com',
    phone: '+1 (212) 555-8840',
    title: 'Chief Technology Officer',
    companyId: 'comp-2',
    companyName: 'Vanguard FinTech Labs',
    lifecycleStage: 'customer',
    owner: USERS[1],
    tags: ['Key Account', 'Enterprise'],
    notes: [],
    createdAt: '2026-08-05T09:30:00Z',
    lastActivityDate: '2026-10-29T16:00:00Z'
  },
  {
    id: 'cont-3',
    name: 'Dr. Clara Thorne',
    email: 'cthorne@pulsehealth.ai',
    phone: '+1 (617) 449-2115',
    title: 'Director of Clinical Operations',
    companyId: 'comp-3',
    companyName: 'Pulse Health AI',
    lifecycleStage: 'opportunity',
    owner: USERS[0],
    tags: ['Healthcare', 'Procurement'],
    notes: [],
    createdAt: '2026-10-04T14:15:00Z',
    lastActivityDate: '2026-11-03T16:30:00Z'
  },
  {
    id: 'cont-4',
    name: 'Vikram Mehta',
    email: 'vmehta@aetherrobotics.co',
    phone: '+1 (512) 782-9912',
    title: 'Director of Systems Engineering',
    companyId: 'comp-4',
    companyName: 'Aether Robotics',
    lifecycleStage: 'opportunity',
    owner: USERS[2],
    tags: ['Robotics', 'Evaluating'],
    notes: [],
    createdAt: '2026-07-22T11:00:00Z',
    lastActivityDate: '2026-10-28T09:45:00Z'
  }
];

export const MOCK_LEADS: Lead[] = [
  {
    id: 'lead-technova',
    name: 'Aarav Singhania',
    company: 'TechNova Solutions',
    title: 'VP of Engineering',
    email: 'aarav.singhania@technovasolutions.in',
    phone: '+91 98200 45123',
    status: 'qualified',
    score: 95,
    source: 'Inbound Demo',
    estimatedValue: 1450000,
    owner: USERS[0],
    tags: ['Enterprise AI', 'High Value', 'Decision Maker'],
    notes: [
      {
        id: 'ln-technova-1',
        author: USERS[0],
        content: 'Attended product architecture demonstration. Evaluating enterprise agent orchestration across 4 business units.',
        createdAt: '2026-11-01T14:00:00Z'
      }
    ],
    createdAt: '2026-10-25T10:00:00Z',
    lastContactedAt: '2026-11-04T11:45:00Z'
  },
  {
    id: 'lead-acme',
    name: 'Rohit Verma',
    company: 'Acme Technologies',
    title: 'Head of Digital Delivery',
    email: 'rohit.verma@acmetechnologies.com',
    phone: '+91 98450 12890',
    status: 'proposal',
    score: 92,
    source: 'Website',
    estimatedValue: 180000,
    owner: USERS[0],
    tags: ['Corporate Portal', 'React/Next.js', 'Fast Track'],
    notes: [
      {
        id: 'ln-acme-1',
        author: USERS[0],
        content: 'Commercial proposal delivered for ₹1,80,000. Scope includes 8 custom portal modules and OAuth2 RBAC.',
        createdAt: '2026-11-01T11:00:00Z'
      }
    ],
    createdAt: '2026-10-15T09:30:00Z',
    lastContactedAt: '2026-11-04T10:30:00Z'
  },
  {
    id: 'lead-cloudcore',
    name: 'Rohan Malhotra',
    company: 'CloudCore Systems',
    title: 'Head of Cloud Architecture',
    email: 'rohan.malhotra@cloudcoresystems.com',
    phone: '+91 98190 77412',
    status: 'qualified',
    score: 96,
    source: 'Referral',
    estimatedValue: 1800000,
    owner: USERS[0],
    tags: ['Multi-Cloud', 'Transit Mesh', 'Q4 Target'],
    notes: [
      {
        id: 'ln-cloudcore-1',
        author: USERS[0],
        content: 'Confirmed approved budget of ₹18,00,000. Advancing to final contract execution.',
        createdAt: '2026-11-03T15:00:00Z'
      }
    ],
    createdAt: '2026-10-20T11:00:00Z',
    lastContactedAt: '2026-11-04T14:15:00Z'
  },
  {
    id: 'lead-innovatex',
    name: 'Aditya Sen',
    company: 'InnovateX',
    title: 'CTO & Co-founder',
    email: 'aditya.sen@innovatex.io',
    phone: '+91 98112 66780',
    status: 'proposal',
    score: 91,
    source: 'Inbound Demo',
    estimatedValue: 1120000,
    owner: USERS[0],
    tags: ['FinTech Core', 'Compliance Engine', 'Annual Pre-pay'],
    notes: [],
    createdAt: '2026-10-22T14:00:00Z',
    lastContactedAt: '2026-11-04T15:30:00Z'
  },
  {
    id: 'lead-brightlabs',
    name: 'Meera Krishnan',
    company: 'BrightLabs',
    title: 'Chief Design Officer',
    email: 'meera.k@brightlabs.design',
    phone: '+91 99201 88340',
    status: 'contacted',
    score: 88,
    source: 'LinkedIn',
    estimatedValue: 620000,
    owner: USERS[1],
    tags: ['Design System', 'UI Library'],
    notes: [],
    createdAt: '2026-10-28T16:00:00Z',
    lastContactedAt: '2026-11-04T16:45:00Z'
  },
  {
    id: 'lead-pixelworks',
    name: 'Pooja Sundaram',
    company: 'PixelWorks',
    title: 'VP of Creative Technology',
    email: 'pooja.s@pixelworks.studio',
    phone: '+91 97110 33890',
    status: 'new',
    score: 78,
    source: 'Google Ads',
    estimatedValue: 480000,
    owner: USERS[2],
    tags: ['3D WebGL', 'Interactive Showcase'],
    notes: [],
    createdAt: '2026-11-02T10:15:00Z',
    lastContactedAt: '2026-11-04T17:15:00Z'
  },
  {
    id: 'lead-1',
    name: 'Rachel Adams',
    company: 'Apex Data Networks',
    title: 'Director of IT Infrastructure',
    email: 'radams@apexdatanets.com',
    phone: '+1 (415) 332-9011',
    status: 'qualified',
    score: 94,
    source: 'Inbound Demo',
    estimatedValue: 480000,
    owner: USERS[0],
    tags: ['High Intent', 'Q4 Budget', 'Enterprise'],
    notes: [],
    createdAt: '2026-10-25T11:20:00Z',
    lastContactedAt: '2026-11-02T14:10:00Z'
  },
  {
    id: 'lead-2',
    name: 'Jonathan Burke',
    company: 'Cobalt Logistics',
    title: 'Chief Operating Officer',
    email: 'jburke@cobaltlogistics.net',
    phone: '+1 (312) 774-8821',
    status: 'contacted',
    score: 82,
    source: 'Website',
    estimatedValue: 360000,
    owner: USERS[2],
    tags: ['Supply Chain', 'Warm'],
    notes: [],
    createdAt: '2026-10-26T09:40:00Z',
    lastContactedAt: '2026-10-31T12:00:00Z'
  },
  {
    id: 'lead-3',
    name: 'Sophia Chang',
    company: 'OmniFlow Solutions',
    title: 'VP of Customer Experience',
    email: 'schang@omniflow.io',
    phone: '+1 (650) 419-5520',
    status: 'proposal',
    score: 88,
    source: 'Referral',
    estimatedValue: 640000,
    owner: USERS[0],
    tags: ['Referral', 'Fast Track', 'Multi-Year'],
    notes: [],
    createdAt: '2026-10-18T14:00:00Z',
    lastContactedAt: '2026-11-01T15:00:00Z'
  },
  {
    id: 'lead-4',
    name: 'Michael Torres',
    company: 'Beacon Health Partners',
    title: 'IT Compliance Manager',
    email: 'mtorres@beaconhealthpartners.org',
    phone: '+1 (617) 890-4412',
    status: 'new',
    score: 76,
    source: 'Google Ads',
    estimatedValue: 240000,
    owner: USERS[2],
    tags: ['Healthcare', 'Evaluation'],
    notes: [],
    createdAt: '2026-11-02T08:15:00Z'
  },
  {
    id: 'lead-7',
    name: 'Siddharth Rao',
    company: 'RazorSecure Cyber Labs',
    title: 'Chief Information Security Officer',
    email: 'siddharth@razorsecure.com',
    phone: '+91 98200 11234',
    status: 'converted',
    score: 96,
    source: 'Inbound Demo',
    estimatedValue: 1250000,
    owner: USERS[0],
    tags: ['High Value', 'Converted', 'Enterprise'],
    notes: [],
    createdAt: '2026-10-15T09:00:00Z',
    lastContactedAt: '2026-10-29T15:00:00Z'
  },
  {
    id: 'lead-8',
    name: 'Ananya Deshmukh',
    company: 'FinEdge Analytics',
    title: 'Head of Growth & Monetization',
    email: 'ananya.d@finedge.io',
    phone: '+91 98450 33412',
    status: 'qualified',
    score: 91,
    source: 'Website',
    estimatedValue: 850000,
    owner: USERS[1],
    tags: ['FinTech', 'High Intent'],
    notes: [],
    createdAt: '2026-10-28T14:20:00Z',
    lastContactedAt: '2026-11-02T11:00:00Z'
  },
  {
    id: 'lead-11',
    name: 'Kavita Patel',
    company: 'Aura Logistics India',
    title: 'VP of Supply Chain Systems',
    email: 'kavita.patel@auralogistics.in',
    phone: '+91 97110 55490',
    status: 'proposal',
    score: 89,
    source: 'Referral',
    estimatedValue: 1100000,
    owner: USERS[1],
    tags: ['Supply Chain', 'Proposal Review'],
    notes: [],
    createdAt: '2026-10-21T10:00:00Z',
    lastContactedAt: '2026-11-01T16:00:00Z'
  }
];

export const MOCK_DEALS: Deal[] = [
  {
    id: 'deal-technova',
    title: 'TechNova Solutions — Enterprise AI Knowledge Graph & Agents',
    companyId: 'comp-technova',
    companyName: 'TechNova Solutions',
    contactId: 'cont-aarav',
    contactName: 'Aarav Singhania',
    value: 1450000,
    stage: 'proposal',
    status: 'open',
    probability: 65,
    expectedCloseDate: '2026-12-18',
    owner: USERS[0],
    priority: 'high',
    tags: ['Enterprise AI', 'Multi-Year', 'Q4 Target'],
    notes: [
      {
        id: 'dn-technova-1',
        author: USERS[0],
        content: 'Enterprise AI knowledge graph deployment for 350 engineers. Proposal submitted for ₹14.5L.',
        createdAt: '2026-11-02T14:00:00Z'
      }
    ],
    files: [
      {
        id: 'file-tn-1',
        name: 'TechNova_AI_Architecture_Scope.pdf',
        size: '3.8 MB',
        type: 'pdf',
        uploadedAt: '2026-11-01T14:30:00Z',
        uploadedBy: USERS[0]
      }
    ],
    timeline: [
      {
        id: 'tl-tn-1',
        type: 'created',
        title: 'Deal Created',
        description: 'Enterprise AI Knowledge Graph deal created for TechNova Solutions (₹14,50,000)',
        timestamp: '2026-10-25T10:00:00Z',
        actor: USERS[0],
        badge: 'New Lead'
      },
      {
        id: 'tl-tn-2',
        type: 'stage_changed',
        title: 'Stage Moved to Qualified',
        description: 'Architecture diligence completed with VP of Engineering Aarav Singhania.',
        timestamp: '2026-10-30T11:00:00Z',
        actor: USERS[0],
        badge: 'Qualified'
      },
      {
        id: 'tl-tn-3',
        type: 'stage_changed',
        title: 'Stage Moved to Proposal',
        description: 'Commercial proposal and SLA delivered.',
        timestamp: '2026-11-02T14:00:00Z',
        actor: USERS[0],
        badge: 'Proposal'
      }
    ],
    createdAt: '2026-10-25T10:00:00Z',
    updatedAt: '2026-11-04T11:45:00Z'
  },
  {
    id: 'deal-acme',
    title: 'Acme Technologies — Website Development & Corporate Portal',
    companyId: 'comp-acme',
    companyName: 'Acme Technologies',
    contactId: 'cont-rohit',
    contactName: 'Rohit Verma',
    value: 180000,
    stage: 'negotiation',
    status: 'open',
    probability: 85,
    expectedCloseDate: '2026-11-28',
    owner: USERS[0],
    priority: 'high',
    tags: ['High Priority', 'Corporate Portal', 'SOW Review'],
    notes: [
      {
        id: 'dn-acme-1',
        author: USERS[0],
        content: 'Acme Technologies evaluated custom React portal delivery. Pricing proposal submitted.',
        createdAt: '2026-11-01T10:00:00Z'
      }
    ],
    files: [
      {
        id: 'file-0-1',
        name: 'Acme_Technologies_SOW_v2.1.pdf',
        size: '2.4 MB',
        type: 'pdf',
        uploadedAt: '2026-10-28T14:30:00Z',
        uploadedBy: USERS[0]
      }
    ],
    timeline: [
      {
        id: 'tl-acme-1',
        type: 'created',
        title: 'Deal Created',
        description: 'Created deal Website Development for Acme Technologies (₹1,80,000)',
        timestamp: '2026-10-15T10:00:00Z',
        actor: USERS[0],
        badge: 'New Lead'
      },
      {
        id: 'tl-acme-2',
        type: 'stage_changed',
        title: 'Stage Moved to Negotiation',
        description: 'Proposal accepted by Rohit Verma; negotiating advance invoice milestone.',
        timestamp: '2026-11-04T14:45:00Z',
        actor: USERS[0],
        badge: 'Negotiation'
      }
    ],
    createdAt: '2026-10-15T10:00:00Z',
    updatedAt: '2026-11-04T14:45:00Z'
  },
  {
    id: 'deal-cloudcore',
    title: 'CloudCore Systems — Multi-Cloud Transit Mesh & VPC Peering',
    companyId: 'comp-cloudcore',
    companyName: 'CloudCore Systems',
    contactId: 'cont-rohan',
    contactName: 'Rohan Malhotra',
    value: 1800000,
    stage: 'negotiation',
    status: 'open',
    probability: 85,
    expectedCloseDate: '2026-11-25',
    owner: USERS[0],
    priority: 'high',
    tags: ['Cloud Mesh', 'VPC Architecture', 'Executive Deal'],
    notes: [
      {
        id: 'dn-cloudcore-1',
        author: USERS[0],
        content: 'Multi-cloud transit mesh proposal accepted in principle. Reviewing legal markups on data transit liability.',
        createdAt: '2026-11-03T16:00:00Z'
      }
    ],
    files: [
      {
        id: 'file-cc-1',
        name: 'CloudCore_Transit_Mesh_Specification.pdf',
        size: '5.1 MB',
        type: 'pdf',
        uploadedAt: '2026-10-30T16:00:00Z',
        uploadedBy: USERS[0]
      }
    ],
    timeline: [
      {
        id: 'tl-cc-1',
        type: 'created',
        title: 'Deal Created',
        description: 'Multi-Cloud Transit Mesh deal created for CloudCore Systems (₹18,00,000)',
        timestamp: '2026-10-20T11:00:00Z',
        actor: USERS[0]
      },
      {
        id: 'tl-cc-2',
        type: 'stage_changed',
        title: 'Stage Moved to Negotiation',
        description: 'Moved to Negotiation stage following executive alignment on ₹18.0L contract value.',
        timestamp: '2026-11-04T14:15:00Z',
        actor: USERS[0],
        badge: 'Negotiation'
      }
    ],
    createdAt: '2026-10-20T11:00:00Z',
    updatedAt: '2026-11-04T14:15:00Z'
  },
  {
    id: 'deal-innovatex',
    title: 'InnovateX — Automated FinTech Compliance Core & API Gateway',
    companyId: 'comp-innovatex',
    companyName: 'InnovateX',
    contactId: 'cont-aditya',
    contactName: 'Aditya Sen',
    value: 1120000,
    stage: 'proposal',
    status: 'open',
    probability: 65,
    expectedCloseDate: '2026-12-10',
    owner: USERS[0],
    priority: 'high',
    tags: ['FinTech', 'Compliance', 'Annual Pre-pay'],
    notes: [
      {
        id: 'dn-innovatex-1',
        author: USERS[0],
        content: 'Regulatory compliance module vetted with Aditya Sen. Proposal submitted for ₹11.2L.',
        createdAt: '2026-11-03T11:30:00Z'
      }
    ],
    files: [
      {
        id: 'file-ix-1',
        name: 'InnovateX_Compliance_Engine_SOW.pdf',
        size: '3.4 MB',
        type: 'pdf',
        uploadedAt: '2026-11-02T15:00:00Z',
        uploadedBy: USERS[0]
      }
    ],
    timeline: [
      {
        id: 'tl-ix-1',
        type: 'created',
        title: 'Deal Created',
        description: 'FinTech Compliance Core deal logged for InnovateX (₹11,20,000)',
        timestamp: '2026-10-22T14:00:00Z',
        actor: USERS[0]
      },
      {
        id: 'tl-ix-2',
        type: 'stage_changed',
        title: 'Stage Moved to Proposal',
        description: 'Submitted full commercial quotation for 1-year prepaid compliance core.',
        timestamp: '2026-11-03T11:30:00Z',
        actor: USERS[0],
        badge: 'Proposal'
      }
    ],
    createdAt: '2026-10-22T14:00:00Z',
    updatedAt: '2026-11-04T15:30:00Z'
  },
  {
    id: 'deal-brightlabs',
    title: 'BrightLabs — UI/UX Design System & React Component Library',
    companyId: 'comp-brightlabs',
    companyName: 'BrightLabs',
    contactId: 'cont-meera',
    contactName: 'Meera Krishnan',
    value: 620000,
    stage: 'qualified',
    status: 'open',
    probability: 40,
    expectedCloseDate: '2026-12-22',
    owner: USERS[1],
    priority: 'medium',
    tags: ['Design System', 'UI Library', 'Mobile App'],
    notes: [
      {
        id: 'dn-brightlabs-1',
        author: USERS[1],
        content: 'Component library design tokens aligned with Meera Krishnan. Preparing sprint schedule.',
        createdAt: '2026-11-01T15:20:00Z'
      }
    ],
    files: [
      {
        id: 'file-bl-1',
        name: 'BrightLabs_Design_Tokens_Specification.pdf',
        size: '2.8 MB',
        type: 'pdf',
        uploadedAt: '2026-10-29T11:00:00Z',
        uploadedBy: USERS[1]
      }
    ],
    timeline: [
      {
        id: 'tl-bl-1',
        type: 'created',
        title: 'Deal Created',
        description: 'Design system consulting deal logged for BrightLabs (₹6,20,000)',
        timestamp: '2026-10-28T16:00:00Z',
        actor: USERS[1]
      },
      {
        id: 'tl-bl-2',
        type: 'stage_changed',
        title: 'Stage Moved to Qualified',
        description: 'Technical requirements confirmed with CDO Meera Krishnan.',
        timestamp: '2026-11-02T10:00:00Z',
        actor: USERS[1],
        badge: 'Qualified'
      }
    ],
    createdAt: '2026-10-28T16:00:00Z',
    updatedAt: '2026-11-04T16:45:00Z'
  },
  {
    id: 'deal-pixelworks',
    title: 'PixelWorks — Interactive 3D Web Experience & Digital Showcase',
    companyId: 'comp-pixelworks',
    companyName: 'PixelWorks',
    contactId: 'cont-pooja',
    contactName: 'Pooja Sundaram',
    value: 480000,
    stage: 'new_lead',
    status: 'open',
    probability: 10,
    expectedCloseDate: '2027-01-15',
    owner: USERS[2],
    priority: 'medium',
    tags: ['3D WebGL', 'Experience Design'],
    notes: [
      {
        id: 'dn-pixelworks-1',
        author: USERS[2],
        content: 'Introductory call held with Pooja Sundaram. Initial scope estimated at ₹4,80,000.',
        createdAt: '2026-11-02T16:15:00Z'
      }
    ],
    files: [],
    timeline: [
      {
        id: 'tl-pw-1',
        type: 'created',
        title: 'Deal Created',
        description: 'Inbound inquiry for interactive 3D WebGL showcase (₹4,80,000)',
        timestamp: '2026-11-02T10:15:00Z',
        actor: USERS[2],
        badge: 'New Lead'
      }
    ],
    createdAt: '2026-11-02T10:15:00Z',
    updatedAt: '2026-11-04T17:15:00Z'
  },
  {
    id: 'deal-2',
    title: 'Vanguard FinTech — Global Expansion & API Seats',
    companyId: 'comp-2',
    companyName: 'Vanguard FinTech Labs',
    contactId: 'cont-2',
    contactName: 'David Sterling',
    value: 1248000,
    stage: 'won',
    status: 'won',
    probability: 100,
    expectedCloseDate: '2026-10-28',
    owner: USERS[1],
    priority: 'high',
    tags: ['Expansion', 'Won Deal', 'Flagship'],
    wonReason: 'Superior API performance and direct webhook streaming capabilities.',
    notes: [
      {
        id: 'dn-2',
        author: USERS[1],
        content: 'Contracts fully executed! Handed off to Customer Success team for deployment.',
        createdAt: '2026-10-28T18:00:00Z'
      }
    ],
    files: [
      {
        id: 'file-2-1',
        name: 'Vanguard_Master_Services_Agreement_Signed.pdf',
        size: '1.9 MB',
        type: 'pdf',
        uploadedAt: '2026-10-28T17:45:00Z',
        uploadedBy: USERS[1]
      }
    ],
    timeline: [
      {
        id: 'tl-2-3',
        type: 'deal_won',
        title: 'Deal Closed Won! 🏆',
        description: 'Contracts countersigned by David Sterling for ₹12.48L.',
        timestamp: '2026-10-28T18:00:00Z',
        actor: USERS[1],
        badge: 'Won'
      }
    ],
    createdAt: '2026-08-10T09:30:00Z',
    updatedAt: '2026-10-28T18:00:00Z'
  },
  {
    id: 'deal-3',
    title: 'Pulse Health — HIPAA Certified Workflow Rollout',
    companyId: 'comp-3',
    companyName: 'Pulse Health AI',
    contactId: 'cont-3',
    contactName: 'Dr. Clara Thorne',
    value: 580000,
    stage: 'qualified',
    status: 'open',
    probability: 40,
    expectedCloseDate: '2026-12-05',
    owner: USERS[0],
    priority: 'medium',
    tags: ['Healthcare', 'Security Review'],
    notes: [],
    files: [],
    timeline: [],
    createdAt: '2026-10-08T14:15:00Z',
    updatedAt: '2026-10-27T11:15:00Z'
  },
  {
    id: 'deal-4',
    title: 'Aether Robotics — Fleet Telemetry Integration',
    companyId: 'comp-4',
    companyName: 'Aether Robotics',
    contactId: 'cont-4',
    contactName: 'Vikram Mehta',
    value: 920000,
    stage: 'qualified',
    status: 'open',
    probability: 40,
    expectedCloseDate: '2026-12-15',
    owner: USERS[2],
    priority: 'high',
    tags: ['IoT', 'Robotics', 'Proof of Concept'],
    notes: [],
    files: [],
    timeline: [],
    createdAt: '2026-07-25T11:00:00Z',
    updatedAt: '2026-10-30T16:00:00Z'
  },
  {
    id: 'deal-1',
    title: 'Nexus Cloud — Enterprise Infrastructure License',
    companyId: 'comp-1',
    companyName: 'Nexus Cloud Systems',
    contactId: 'cont-1',
    contactName: 'Elena Rostova',
    value: 750000,
    stage: 'negotiation',
    status: 'open',
    probability: 85,
    expectedCloseDate: '2026-11-20',
    owner: USERS[0],
    priority: 'high',
    tags: ['High Priority', 'Enterprise Tier', 'Annual Pre-pay'],
    notes: [],
    files: [],
    timeline: [],
    createdAt: '2026-09-18T10:00:00Z',
    updatedAt: '2026-11-01T16:30:00Z'
  }
];

export const MOCK_ACTIVITIES: Activity[] = [
  // ── TODAY (Nov 4, 2026) ──────────────────────────────────────────
  {
    id: 'act-today-1',
    type: 'call',
    title: 'Called Rohit Verma from Acme Technologies',
    description: 'Reviewed Website Development SOW delivery milestones and agreed on ₹54,000 milestone invoice advance. Call connected, client pleased with scope.',
    dueDate: '2026-11-04T10:30:00Z',
    completed: true,
    priority: 'high',
    relatedTo: {
      type: 'contact',
      id: 'cont-rohit',
      name: 'Rohit Verma (Acme Technologies)'
    },
    assignedTo: USERS[0],
    createdAt: '2026-11-04T10:30:00Z',
    completedAt: '2026-11-04T10:45:00Z',
    durationMinutes: 15,
    outcome: 'Connected — Agreed on SOW'
  },
  {
    id: 'act-today-2',
    type: 'email',
    title: 'Sent proposal to Aarav Singhania at TechNova Solutions',
    description: 'Sent formal enterprise proposal for Enterprise AI Knowledge Graph (₹14,50,000) with custom cluster sizing and benchmark documentation.',
    dueDate: '2026-11-04T11:45:00Z',
    completed: true,
    priority: 'high',
    relatedTo: {
      type: 'deal',
      id: 'deal-technova',
      name: 'TechNova Solutions — Enterprise AI Knowledge Graph'
    },
    assignedTo: USERS[0],
    createdAt: '2026-11-04T11:45:00Z',
    completedAt: '2026-11-04T11:45:00Z',
    outcome: 'Delivered'
  },
  {
    id: 'act-today-3',
    type: 'deal_update',
    title: 'Deal Stage Updated: Moved CloudCore Systems to Negotiation',
    description: 'Pipeline stage updated from Qualified to Negotiation. Deal value ₹18,00,000 with 85% probability for Multi-Cloud Transit Mesh rollout.',
    dueDate: '2026-11-04T14:15:00Z',
    completed: true,
    priority: 'high',
    relatedTo: {
      type: 'deal',
      id: 'deal-cloudcore',
      name: 'CloudCore Systems — Multi-Cloud Transit Mesh'
    },
    assignedTo: USERS[0],
    createdAt: '2026-11-04T14:15:00Z',
    completedAt: '2026-11-04T14:15:00Z',
    outcome: 'Stage: Negotiation (₹18,00,000)'
  },
  {
    id: 'act-today-4',
    type: 'note',
    title: 'Added strategic note on InnovateX Compliance Core',
    description: 'Aditya Sen verified payment gateway sandbox compliance. Financial regulatory audit report successfully validated.',
    dueDate: '2026-11-04T15:30:00Z',
    completed: true,
    priority: 'medium',
    relatedTo: {
      type: 'deal',
      id: 'deal-innovatex',
      name: 'InnovateX — Automated FinTech Compliance Core'
    },
    assignedTo: USERS[0],
    createdAt: '2026-11-04T15:30:00Z',
    completedAt: '2026-11-04T15:30:00Z',
    outcome: 'Strategic Note'
  },
  {
    id: 'act-today-5',
    type: 'task',
    title: 'Completed task: Finalize Design System sprint scope for BrightLabs',
    description: 'Agreed on 24 core React components and Figma design token synchronization pipeline with CDO Meera Krishnan.',
    dueDate: '2026-11-04T16:45:00Z',
    completed: true,
    priority: 'urgent',
    relatedTo: {
      type: 'deal',
      id: 'deal-brightlabs',
      name: 'BrightLabs — UI/UX Design System'
    },
    assignedTo: USERS[1],
    createdAt: '2026-11-04T16:45:00Z',
    completedAt: '2026-11-04T16:45:00Z',
    outcome: 'Completed'
  },
  {
    id: 'act-today-6',
    type: 'meeting',
    title: 'Interactive 3D Demo Walkthrough with Pooja Sundaram',
    description: 'Showcased WebGL 3D rendering pipeline and asset streaming benchmarks for PixelWorks creative showcase.',
    dueDate: '2026-11-04T17:15:00Z',
    completed: true,
    priority: 'medium',
    relatedTo: {
      type: 'deal',
      id: 'deal-pixelworks',
      name: 'PixelWorks — Interactive 3D Web Experience'
    },
    assignedTo: USERS[2],
    createdAt: '2026-11-04T17:15:00Z',
    completedAt: '2026-11-04T17:45:00Z',
    durationMinutes: 30,
    outcome: 'Positive Demo'
  },

  // ── YESTERDAY (Nov 3, 2026) ──────────────────────────────────────
  {
    id: 'act-yest-1',
    type: 'meeting',
    title: 'Product demo completed with Dr. Clara Thorne',
    description: 'Detailed walkthrough of HIPAA compliant telemetry pipeline, audit trail retention, and granular RBAC permissions for clinical directors.',
    dueDate: '2026-11-03T16:30:00Z',
    completed: true,
    priority: 'high',
    relatedTo: {
      type: 'deal',
      id: 'deal-3',
      name: 'Pulse Health AI — HIPAA Certified Workflow Rollout'
    },
    assignedTo: USERS[0],
    createdAt: '2026-11-03T16:30:00Z',
    completedAt: '2026-11-03T17:30:00Z',
    durationMinutes: 60,
    outcome: 'Demo Completed — Very Positive'
  },
  {
    id: 'act-yest-2',
    type: 'deal_update',
    title: 'Deal Won: Vanguard FinTech Labs (₹12,48,000)',
    description: 'Executed master service agreement and received countersigned contract for global cloud expansion rollout.',
    dueDate: '2026-11-03T10:00:00Z',
    completed: true,
    priority: 'urgent',
    relatedTo: {
      type: 'deal',
      id: 'deal-2',
      name: 'Vanguard FinTech Labs — Global Expansion'
    },
    assignedTo: USERS[1],
    createdAt: '2026-11-03T10:00:00Z',
    completedAt: '2026-11-03T10:00:00Z',
    outcome: 'Won — ₹12.48L'
  },
  {
    id: 'act-yest-3',
    type: 'email',
    title: 'Sent proposal to Sarah Williams at TechNova Solutions',
    description: 'Delivered technical architecture annexure and SLA documentation for executive briefing.',
    dueDate: '2026-11-03T09:15:00Z',
    completed: true,
    priority: 'high',
    relatedTo: {
      type: 'contact',
      id: 'cont-sarah',
      name: 'Sarah Williams (TechNova Solutions)'
    },
    assignedTo: USERS[0],
    createdAt: '2026-11-03T09:15:00Z',
    completedAt: '2026-11-03T09:15:00Z',
    outcome: 'Delivered'
  }
];

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-lead-assigned',
    title: 'New lead assigned to you',
    description: 'Aarav Singhania (TechNova Solutions, Score: 95) was routed to you from Inbound Demo.',
    time: '15m ago',
    read: false,
    type: 'lead',
    linkTarget: { view: 'leads', id: 'lead-technova' },
    category: 'Lead Routing'
  },
  {
    id: 'notif-meeting-starts',
    title: 'Meeting starts in 30 minutes',
    description: 'CloudCore Systems Architecture Sync with Rohan Malhotra begins at 3:00 PM via Google Meet.',
    time: '30m ago',
    read: false,
    type: 'meeting',
    linkTarget: { view: 'calendar' },
    category: 'Calendar Reminder'
  },
  {
    id: 'notif-deal-negotiation',
    title: 'Deal moved to Negotiation',
    description: 'Acme Technologies — Website Development (₹1,80,000) was moved to Negotiation stage.',
    time: '1 hour ago',
    read: false,
    type: 'deal',
    linkTarget: { view: 'deals', id: 'deal-acme' },
    category: 'Pipeline Movement'
  },
  {
    id: 'notif-task-completed',
    title: 'Task completed',
    description: 'Alex Rivera marked "Draft Master Services Agreement (MSA) for Acme Technologies" as completed.',
    time: '2 hours ago',
    read: true,
    type: 'task',
    linkTarget: { view: 'tasks' },
    category: 'Task Execution'
  },
  {
    id: 'notif-customer-email',
    title: 'New customer email',
    description: 'Aditya Sen from InnovateX replied: "Compliance annexure approved by board; ready for final contract."',
    time: '3 hours ago',
    read: false,
    type: 'email',
    linkTarget: { view: 'contacts', id: 'cont-aditya' },
    category: 'Email Inbox'
  },
  {
    id: 'notif-deal-won',
    title: 'Deal Won! ₹12,48,000',
    description: 'Vanguard FinTech Labs signed the Global Expansion contract.',
    time: '5 hours ago',
    read: true,
    type: 'deal',
    linkTarget: { view: 'deals', id: 'deal-2' },
    category: 'Pipeline Milestone'
  }
];

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  channels: {
    inApp: true,
    email: true,
    desktopPush: false,
    slackAlerts: true
  },
  categories: {
    newLead: { inApp: true, email: true, push: true },
    meetingReminders: { inApp: true, email: true, push: true },
    dealMovements: { inApp: true, email: true, push: false },
    taskCompleted: { inApp: true, email: false, push: false },
    customerEmail: { inApp: true, email: true, push: true },
    systemUpdates: { inApp: true, email: false, push: false }
  },
  emailDigest: 'instant',
  quietHours: {
    enabled: true,
    startTime: '22:00',
    endTime: '08:00'
  }
};

export const MOCK_TASKS: TaskItem[] = [
  {
    id: 'task-technova',
    title: 'Finalize Enterprise AI Architecture for TechNova Solutions',
    description: 'Review multi-agent LLM orchestration specifications and compute cluster sizing with Aarav Singhania.',
    assignee: USERS[0],
    priority: 'urgent',
    dueDate: '2026-11-06',
    relatedTo: {
      type: 'deal',
      id: 'deal-technova',
      name: 'TechNova Solutions — Enterprise AI Knowledge Graph'
    },
    status: 'in_progress',
    createdAt: '2026-11-02T10:00:00Z'
  },
  {
    id: 'task-1',
    title: 'Draft Master Services Agreement (MSA) for Acme Technologies',
    description: 'Prepare standard commercial contract and delivery milestones for Rohit Verma signature.',
    assignee: USERS[0],
    priority: 'urgent',
    dueDate: '2026-11-05',
    relatedTo: {
      type: 'deal',
      id: 'deal-acme',
      name: 'Acme Technologies — Website Development'
    },
    status: 'in_progress',
    createdAt: '2026-11-02T10:00:00Z'
  },
  {
    id: 'task-brightlabs',
    title: 'Review UI/UX Design System Component Library with BrightLabs',
    description: 'Align on 24 accessible React components and Figma token integration pipeline with Meera Krishnan.',
    assignee: USERS[1],
    priority: 'high',
    dueDate: '2026-11-07',
    relatedTo: {
      type: 'deal',
      id: 'deal-brightlabs',
      name: 'BrightLabs — UI/UX Design System'
    },
    status: 'todo',
    createdAt: '2026-11-02T11:15:00Z'
  },
  {
    id: 'task-cloudcore',
    title: 'Executive Multi-Cloud Pricing Review for CloudCore Systems',
    description: 'Review proposed multi-region VPC peering discount matrix with VP of Sales before Friday call.',
    assignee: USERS[0],
    priority: 'urgent',
    dueDate: '2026-11-04',
    relatedTo: {
      type: 'deal',
      id: 'deal-cloudcore',
      name: 'CloudCore Systems — Multi-Cloud Transit Mesh'
    },
    status: 'todo',
    createdAt: '2026-11-01T09:00:00Z'
  },
  {
    id: 'task-pixelworks',
    title: 'Interactive 3D WebGL Proof of Concept Review for PixelWorks',
    description: 'Validate frame rates and compressed glTF asset loading speeds on mobile viewports.',
    assignee: USERS[2],
    priority: 'medium',
    dueDate: '2026-11-08',
    relatedTo: {
      type: 'deal',
      id: 'deal-pixelworks',
      name: 'PixelWorks — Interactive 3D Web Experience'
    },
    status: 'review',
    createdAt: '2026-11-02T14:30:00Z'
  },
  {
    id: 'task-innovatex',
    title: 'Deliver Regulatory Compliance Annexure to Aditya Sen at InnovateX',
    description: 'Email signed compliance framework document and API SLA response commitments.',
    assignee: USERS[0],
    priority: 'high',
    dueDate: '2026-11-06',
    relatedTo: {
      type: 'deal',
      id: 'deal-innovatex',
      name: 'InnovateX — Automated FinTech Compliance Core'
    },
    status: 'todo',
    createdAt: '2026-11-03T10:00:00Z'
  },
  {
    id: 'task-4',
    title: 'PoC Telemetry Ingress Review with Vikram Mehta',
    description: 'Confirm MQTT telemetry ingress specifications and cloud broker throughput benchmarks.',
    assignee: USERS[2],
    priority: 'high',
    dueDate: '2026-11-06',
    relatedTo: {
      type: 'deal',
      id: 'deal-4',
      name: 'Aether Robotics — Fleet Telemetry Integration'
    },
    status: 'in_progress',
    createdAt: '2026-10-30T16:00:00Z'
  },
  {
    id: 'task-2',
    title: 'Send Security Questionnaire & SOC2 Type II Report',
    description: 'Email Dr. Clara Thorne the updated SOC2 report and HIPAA BAA compliance schedule.',
    assignee: USERS[0],
    priority: 'high',
    dueDate: '2026-11-04',
    relatedTo: {
      type: 'deal',
      id: 'deal-3',
      name: 'Pulse Health AI — HIPAA Certified Workflow Rollout'
    },
    status: 'todo',
    createdAt: '2026-11-02T11:15:00Z'
  },
  {
    id: 'task-9',
    title: 'Customer Onboarding Kickoff: Vanguard FinTech Labs',
    description: 'Introduce lead Customer Success Architect and initialize API production keys.',
    assignee: USERS[1],
    priority: 'medium',
    dueDate: '2026-10-29',
    relatedTo: {
      type: 'company',
      id: 'comp-2',
      name: 'Vanguard FinTech Labs'
    },
    status: 'completed',
    createdAt: '2026-10-28T18:15:00Z',
    completedAt: '2026-10-29T18:00:00Z'
  },
  {
    id: 'task-20',
    title: 'Compile Sales Pipeline Forecast Deck for Executive Review',
    description: 'Summarize total weighted pipeline (₹83.98L) and expected Q4 closing deals across top accounts.',
    assignee: USERS[0],
    priority: 'medium',
    dueDate: '2026-11-07',
    relatedTo: {
      type: 'deal',
      id: 'deal-technova',
      name: 'TechNova Solutions — Enterprise AI Knowledge Graph'
    },
    status: 'todo',
    createdAt: '2026-11-03T09:00:00Z'
  }
];

export const MOCK_EVENTS: CalendarEvent[] = [
  {
    id: 'event-1',
    title: 'Acme Technologies — Website Development SOW & Architecture Signoff',
    type: 'Client Meeting',
    date: '2026-11-04',
    startTime: '10:00',
    endTime: '11:00',
    durationMinutes: 60,
    participants: [USERS[0], USERS[1]],
    contactId: 'cont-rohit',
    contactName: 'Rohit Verma (Acme Technologies)',
    dealId: 'deal-acme',
    dealName: 'Acme Technologies — Website Development',
    meetingLink: 'https://meet.google.com/acme-tech-portal',
    notes: 'Review final deliverable roadmap, sprint milestones, and initial advance invoice of ₹54,000.',
    location: 'Google Meet',
    createdAt: '2026-11-01T10:00:00Z'
  },
  {
    id: 'event-technova',
    title: 'TechNova Solutions — Enterprise AI Agent Architecture Review',
    type: 'Client Meeting',
    date: '2026-11-04',
    startTime: '11:30',
    endTime: '12:30',
    durationMinutes: 60,
    participants: [USERS[0], USERS[2]],
    contactId: 'cont-aarav',
    contactName: 'Aarav Singhania (TechNova Solutions)',
    dealId: 'deal-technova',
    dealName: 'TechNova Solutions — Enterprise AI Knowledge Graph',
    meetingLink: 'https://meet.google.com/technova-ai-sync',
    notes: 'Walkthrough of scalable RAG ingestion pipeline, vector database embeddings, and token cost forecasting.',
    location: 'Google Meet',
    createdAt: '2026-11-02T10:00:00Z'
  },
  {
    id: 'event-cloudcore',
    title: 'CloudCore Systems — Multi-Cloud Transit Mesh & VPC Peering Demo',
    type: 'Product Demo',
    date: '2026-11-04',
    startTime: '14:00',
    endTime: '15:00',
    durationMinutes: 60,
    participants: [USERS[0], USERS[1]],
    contactId: 'cont-rohan',
    contactName: 'Rohan Malhotra (CloudCore Systems)',
    dealId: 'deal-cloudcore',
    dealName: 'CloudCore Systems — Multi-Cloud Transit Mesh',
    meetingLink: 'https://meet.google.com/cloudcore-peering-demo',
    notes: 'Live demonstration of cross-cloud transit latency, routing failovers, and sub-millisecond encryption.',
    location: 'Google Meet',
    createdAt: '2026-11-02T14:00:00Z'
  },
  {
    id: 'event-brightlabs',
    title: 'BrightLabs — Design System & React Component Sync',
    type: 'Client Meeting',
    date: '2026-11-05',
    startTime: '11:00',
    endTime: '12:00',
    durationMinutes: 60,
    participants: [USERS[1]],
    contactId: 'cont-meera',
    contactName: 'Meera Krishnan (BrightLabs)',
    dealId: 'deal-brightlabs',
    dealName: 'BrightLabs — UI/UX Design System',
    meetingLink: 'https://meet.google.com/brightlabs-design-sync',
    notes: 'Sprint alignment on Figma tokens, accessible primitives, and dark mode palette tokens.',
    location: 'Google Meet',
    createdAt: '2026-11-01T15:00:00Z'
  },
  {
    id: 'event-innovatex',
    title: 'InnovateX — FinTech Regulatory Compliance Walkthrough',
    type: 'Proposal Review',
    date: '2026-11-05',
    startTime: '15:00',
    endTime: '16:00',
    durationMinutes: 60,
    participants: [USERS[0]],
    contactId: 'cont-aditya',
    contactName: 'Aditya Sen (InnovateX)',
    dealId: 'deal-innovatex',
    dealName: 'InnovateX — Automated FinTech Compliance Core',
    meetingLink: 'https://meet.google.com/innovatex-compliance-sow',
    notes: 'Review transaction risk scoring rules and automated audit trail export specifications.',
    location: 'Google Meet',
    createdAt: '2026-11-03T11:00:00Z'
  },
  {
    id: 'event-pulse',
    title: 'Pulse Health AI — HIPAA Compliance & Clinical Audit Demo',
    type: 'Product Demo',
    date: '2026-11-06',
    startTime: '14:30',
    endTime: '15:30',
    durationMinutes: 60,
    participants: [USERS[0], USERS[2]],
    contactId: 'cont-3',
    contactName: 'Dr. Clara Thorne (Pulse Health AI)',
    dealId: 'deal-3',
    dealName: 'Pulse Health — HIPAA Certified Workflow Rollout',
    meetingLink: 'https://meet.google.com/pulse-health-demo',
    notes: 'Walkthrough of granular RBAC, access log exports, and encryption in transit for medical records.',
    location: 'Google Meet',
    createdAt: '2026-11-02T11:15:00Z'
  },
  {
    id: 'event-4',
    title: 'Weekly Revenue Sprint & Deal Pipeline Review',
    type: 'Team Meeting',
    date: '2026-11-06',
    startTime: '09:30',
    endTime: '10:15',
    durationMinutes: 45,
    participants: [USERS[0], USERS[1], USERS[2], USERS[3], USERS[4]],
    meetingLink: 'https://meet.google.com/crm-team-sync',
    notes: 'Weekly pipeline review: 92 active deals, ₹83.98L total pipeline value, hot inbound SDR demos.',
    location: 'Google Meet',
    createdAt: '2026-11-01T09:00:00Z'
  }
];
