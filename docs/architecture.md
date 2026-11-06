# Architecture & Technical Design Document — CRM Pro

**Document Version:** 1.0.0  
**Status:** Approved Architecture  
**System Type:** Full-Stack Decoupled Single-Page Web Application (SPA) + RESTful API  

---

## 1. System Architecture Overview

CRM Pro utilizes a decoupled client-server architecture consisting of a React + Vite TypeScript Single-Page Application on the presentation tier, an Express.js Node.js REST API on the application tier, and MongoDB as the persistence layer, supplemented by a local storage fallback mechanism.

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   CRM PRO SYSTEM TOPOLOGY                                        │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                  │
│   [ Client Browser ]                                                                             │
│         │                                                                                        │
│         ▼                                                                                        │
│   ┌──────────────────────────────────────────────────────────────────────────────────────────┐   │
│   │                                PRESENTATION TIER (Vite + React 18)                       │   │
│   │                                                                                          │   │
│   │  ┌───────────────────────┐  ┌───────────────────────┐  ┌───────────────────────────────┐ │   │
│   │  │ App Shell & Layout    │  │ Feature Modules       │  │ Reusable UI Design System     │ │   │
│   │  │ • Sidebar Navigation  │  │ • Dashboard Overview  │  │ • Button, Input, Select       │ │   │
│   │  │ • Header & Quick Add  │  │ • Leads & Deals Kanban│  │ • Modal, Drawer, Dropdown     │ │   │
│   │  │ • Command Palette(⌘K) │  │ • Contacts & Companies│  │ • Toast & Confirm Dialog      │ │   │
│   │  │ • Breadcrumbs / Mobile│  │ • Tasks, Calendar, Act│  │ • Empty States & Skeletons    │ │   │
│   │  └───────────┬───────────┘  └───────────┬───────────┘  └───────────────┬───────────────┘ │   │
│   │              │                          │                              │                 │   │
│   │              └──────────────────────────┼──────────────────────────────┘                 │   │
│   │                                         ▼                                                │   │
│   │                       ┌───────────────────────────────────┐                              │   │
│   │                       │      CENTRAL STATE ENGINE         │                              │   │
│   │                       │    (CRMContext.tsx / Reducers)    │                              │   │
│   │                       └─────────┬───────────────┬─────────┘                              │   │
│   └─────────────────────────────────┼───────────────┼────────────────────────────────────────┘   │
│                                     │               │                                            │
│            REST Calls / JWT Bearer  │               │ LocalStorage Sync (`crm_pro_v3_*`)         │
│            HTTP Port: 5000          │               ▼                                            │
│                                     │   ┌───────────────────────────┐                            │
│                                     │   │ Client Local Storage      │                            │
│                                     │   │ (Offline Resilient Cache) │                            │
│                                     │   └───────────────────────────┘                            │
│                                     ▼                                                            │
│   ┌──────────────────────────────────────────────────────────────────────────────────────────┐   │
│   │                                APPLICATION TIER (Express.js / Node.js)                   │   │
│   │                                                                                          │   │
│   │  ┌─────────────────────────────────────────────────────────────────────────────────────┐ │   │
│   │  │ Middleware Pipeline: CORS • Morgan Logger • express.json • Rate Limiter             │ │   │
│   │  └──────────────────────────────────────┬──────────────────────────────────────────────┘ │   │
│   │                                         ▼                                                │   │
│   │  ┌─────────────────────────────────────────────────────────────────────────────────────┐ │   │
│   │  │ Route Dispatcher & Security: JWT Auth Guard (`authMiddleware.js`) • RBAC Validator  │ │   │
│   │  └──────────────────────────────────────┬──────────────────────────────────────────────┘ │   │
│   │                                         ▼                                                │   │
│   │  ┌─────────────────────────────────────────────────────────────────────────────────────┐ │   │
│   │  │ Controllers: Auth • Leads • Deals • Contacts • Companies • Tasks • Activities       │ │   │
│   │  └──────────────────────────────────────┬──────────────────────────────────────────────┘ │   │
│   └─────────────────────────────────────────┼────────────────────────────────────────────────┘   │
│                                             ▼                                                    │
│   ┌──────────────────────────────────────────────────────────────────────────────────────────┐   │
│   │                                PERSISTENCE TIER (MongoDB)                                │   │
│   │                                                                                          │   │
│   │  ┌─────────────────────────────────────────────────────────────────────────────────────┐ │   │
│   │  │ Mongoose ODM Data Layer (`mongodb://127.0.0.1:27017/crm_pro`)                        │ │   │
│   │  │ Collections: users • leads • deals • contacts • companies • tasks • activities      │ │   │
│   │  └─────────────────────────────────────────────────────────────────────────────────────┘ │   │
│   └──────────────────────────────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack & Key Dependencies

### 2.1 Presentation Tier (Frontend)
- **Framework:** React 18.3+ with TypeScript 5.5+
- **Build Tool & Bundler:** Vite 6.4+ (ESM-native dev server with Hot Module Replacement)
- **Styling & CSS Utility Engine:** Tailwind CSS 3.4+ with PostCSS and Autoprefixer
- **Iconography:** Lucide React (feather-style clean SVG vector iconography)
- **Data Visualization:** Recharts 2.12+ (Composable D3-based charting) + Custom Vector SVG engines
- **Date & Numeric Utilities:** Native Intl formatting (`Intl.NumberFormat` for Indian Rupee `₹` and international numbering, `Intl.DateTimeFormat`)

### 2.2 Application Tier (Backend)
- **Runtime Environment:** Node.js (v18.0.0+)
- **HTTP Application Framework:** Express.js 4.19+ (ES Modules format `import/export`)
- **Security & Encryption:**
  - `bcryptjs` (Salted hashing with 10 work factors)
  - `jsonwebtoken` (HMAC SHA-256 JWT generation and bearer verification)
- **Middleware & Utility:**
  - `cors` (Cross-Origin Resource Sharing control)
  - `dotenv` (Environment variable configuration)
  - `morgan` (HTTP request lifecycle logging)

### 2.3 Persistence Tier (Database)
- **Database Engine:** MongoDB 6.0+ Community Server
- **Object Data Modeling (ODM):** Mongoose 8.3+
- **Indexes:** Multi-key compound indexing on `(owner, stage)`, `(status, score)`, and unique indexing on `email`.

---

## 3. Directory Structure & Codebase Organization

```
CRM Pro/
├── package.json                   # Root package configuration (scripts, deps)
├── tsconfig.json                  # Strict TypeScript compiler options
├── vite.config.ts                 # Vite bundler, proxy & build chunk settings
├── tailwind.config.js             # SaaS design system tokens, colors & themes
├── postcss.config.js              # PostCSS plugins (Tailwind, Autoprefixer)
│
├── server/                        # Express.js REST API Backend
│   ├── package.json               # Backend dependencies
│   └── src/
│       ├── config/
│       │   └── db.js              # MongoDB Mongoose connection manager
│       ├── controllers/
│       │   ├── authController.js  # Register, login, token refresh
│       │   ├── leadController.js  # CRUD & qualification scoring
│       │   ├── dealController.js  # Pipeline stages & stage drag updates
│       │   └── ...                # Contacts, Companies, Tasks, Activities
│       ├── middleware/
│       │   ├── authMiddleware.js  # JWT extraction & signature validation
│       │   └── errorMiddleware.js # Centralized 500/400 exception formatter
│       ├── models/
│       │   ├── User.js            # User accounts, hashed passwords, roles
│       │   ├── Lead.js            # Leads, score, source, BANT attributes
│       │   ├── Deal.js            # Deals, stage, probability, timeline
│       │   ├── Contact.js         # Contacts, lifecycle stage, touchpoints
│       │   ├── Company.js         # Accounts, annual revenue, firmographics
│       │   ├── Task.js            # Tasks, priority, due date, status
│       │   └── Activity.js        # Audit trail logs (calls, emails, notes)
│       ├── routes/
│       │   ├── authRoutes.js      # /api/auth/* endpoints
│       │   ├── leadRoutes.js      # /api/leads/* endpoints
│       │   ├── dealRoutes.js      # /api/deals/* endpoints
│       │   └── ...                # contacts, companies, tasks, activities
│       ├── seed/
│       │   ├── clearData.js       # Complete database reset to 0 (keeps admin)
│       │   └── seedData.js        # Enterprise demo data population script
│       └── server.js              # Express app initialization & server listener
│
└── src/                           # React + TypeScript Frontend
    ├── main.tsx                   # React root entry point
    ├── App.tsx                    # Top-level shell, auth gate, view router
    ├── index.css                  # Tailwind directives & design system utilities
    │
    ├── context/
    │   └── CRMContext.tsx         # Central state engine, reducers & local storage
    │
    ├── types/
    │   └── index.ts               # Core domain interfaces (Lead, Deal, User, etc.)
    │
    ├── utils/
    │   ├── formatters.ts          # formatCurrency, formatDate, getAvatarColor
    │   └── mockData.ts            # Enterprise demo data constants
    │
    └── components/
        ├── layout/
        │   ├── Header.tsx         # Quick Add, Search trigger, User dropdown
        │   ├── Sidebar.tsx        # Responsive navigation bar & badging
        │   ├── CommandPalette.tsx # ⌘K universal fuzzy search modal
        │   └── Breadcrumbs.tsx    # Dynamic view hierarchy trail
        ├── dashboard/
        │   ├── DashboardOverview.tsx    # High-impact KPI ribbon & top tables
        │   ├── MetricCard.tsx           # SaaS metric card with SVG sparkline
        │   └── PipelineForecastChart.tsx # Pipeline distribution & forecast
        ├── leads/
        │   ├── LeadsView.tsx      # Table, bulk selection, CSV export/import
        │   ├── LeadDetailModal.tsx # Full-profile view & qualification editor
        │   └── ConvertLeadModal.tsx # 1-click lead to deal/contact conversion
        ├── deals/
        │   ├── DealsView.tsx      # Kanban & Table view container
        │   ├── KanbanBoard.tsx    # Drag-and-drop 5-stage pipeline board
        │   ├── DealCard.tsx       # Individual opportunity card with badges
        │   └── DealDrawer.tsx     # Slide-over opportunity inspection panel
        ├── contacts/
        │   ├── ContactsView.tsx   # Dual card/table view with filters
        │   └── ContactModal.tsx   # Create/Edit contact dialog
        ├── companies/
        │   ├── CompaniesView.tsx  # Account directory & firmographic filters
        │   └── CompanyModal.tsx   # Account creation modal
        ├── tasks/
        │   ├── TasksView.tsx      # Tri-mode container (List/Kanban/Calendar)
        │   ├── TaskListView.tsx   # Checkbox list with priority badges
        │   ├── TaskKanbanView.tsx # Task status progression board
        │   └── TaskCalendarView.tsx # Weekly/monthly task schedule
        ├── calendar/
        │   ├── CalendarView.tsx   # Month, Week, Day calendar views
        │   ├── MonthView.tsx      # Full grid calendar with event pills
        │   └── EventModal.tsx     # Google Meet schedule dialog
        ├── activities/
        │   └── ActivitiesView.tsx # Chronological multi-type audit timeline
        ├── analytics/
        │   ├── AnalyticsView.tsx  # Complete reports dashboard with filters
        │   ├── RevenueLineChart.tsx    # SVG/Recharts revenue vs quota
        │   ├── SalesRevenueRechart.tsx # Recharts area visualizer
        │   ├── LeadsBarChart.tsx       # Leads acquisition bar chart
        │   ├── LeadsBarRechart.tsx     # Recharts multi-bar visualizer
        │   ├── ConversionFunnel.tsx    # Stage-by-stage drop-off funnel
        │   ├── PipelineDonutChart.tsx  # Stage distribution donut
        │   ├── PipelineDonutRechart.tsx # Recharts pie visualizer
        │   ├── SalesLeaderboard.tsx    # Rep podium attainment rankings
        │   └── LeadSourcesBreakdown.tsx # Channel attribution ROI table
        ├── landing/
        │   └── LandingPage.tsx    # High-conversion public SaaS landing page
        ├── auth/
        │   ├── LoginView.tsx      # Sign In screen
        │   ├── RegisterView.tsx   # Account registration screen
        │   ├── ForgotPasswordView.tsx # Recovery email trigger
        │   ├── ResetPasswordView.tsx  # New password entry screen
        │   └── EmailVerificationView.tsx # OTP / link confirmation
        ├── settings/
        │   └── SettingsView.tsx   # 5 administration sections & preferences
        └── common/                # 18 Reusable UI Design System Components
            ├── Button.tsx, Input.tsx, Select.tsx, Search.tsx
            ├── Modal.tsx, Drawer.tsx, Dropdown.tsx, Tooltip.tsx
            ├── Badge.tsx, Avatar.tsx, DataTable.tsx, Pagination.tsx
            ├── Tabs.tsx, Card.tsx, Toast.tsx, ConfirmDialog.tsx
            ├── EmptyState.tsx, LoadingSkeleton.tsx
            └── UIComponentsGallery.tsx # Interactive visual catalog
```

---

## 4. State Management & Data Lifecycle

### 4.1 Centralized Context Architecture (`CRMContext.tsx`)
The frontend uses a centralized React Context architecture that exposes state and mutator methods across all components without prop drilling:

- **State Slices:**
  - `leads: Lead[]`
  - `deals: Deal[]`
  - `contacts: Contact[]`
  - `companies: Company[]`
  - `tasks: TaskItem[]`
  - `events: CalendarEvent[]`
  - `activities: Activity[]`
  - `notifications: AppNotification[]`
  - `currentUser: User`
  - `isAuthenticated: boolean`
  - `activeView: ViewType`

### 4.2 Optimistic Updates & Local Cache Synchronization
1. When a user triggers an action (e.g. dragging a deal to `Won`, adding a note, or deleting a lead):
   - The state is updated **optimistically** in memory immediately.
   - The updated collection is serialized and saved to `localStorage` under key `crm_pro_v3_{collection}`.
   - If connected, an asynchronous HTTP request is dispatched to the Express backend (`http://localhost:5000/api/*`).
   - If the network fails, the user is notified via an in-app Toast notification while client-side state remains intact.

### 4.3 Zero-Data Reset & Demo Switching Mechanism
- **Reset to Zero (`resetToZero()`):**
  - Sets all state slices to `[]`.
  - Writes `JSON.stringify([])` to all `crm_pro_v3_*` local storage keys.
  - Clears MongoDB documents via `server/src/seed/clearData.js` while preserving the administrative user account (`viraj@crmpro.io`).
  - Displays instant zero-state scorecards (`0`, `₹0`, `0.0%`) and empty state callouts.
- **Load Demo Data (`loadDemoData()`):**
  - Sets state to authentic pre-populated constants (`MOCK_LEADS`, `MOCK_DEALS`, `MOCK_COMPANIES`, etc.).
  - Persists constants to local storage and updates all analytics charts.

---

## 5. Database Schema & Data Models (Mongoose)

### 5.1 Lead Schema (`server/src/models/Lead.js`)
```typescript
interface LeadDocument {
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'converted' | 'lost';
  source: 'website' | 'linkedin' | 'referral' | 'google_ads' | 'email' | 'other';
  score: number; // 0 to 100 qualification rating
  owner: { id: string; name: string; email: string; avatar?: string };
  notes: Array<{ id: string; author: string; content: string; createdAt: Date }>;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

### 5.2 Deal Schema (`server/src/models/Deal.js`)
```typescript
interface DealDocument {
  title: string;
  companyName: string;
  companyId: string;
  contactName: string;
  contactId: string;
  value: number; // in Indian Rupees (INR)
  stage: 'new_lead' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  status: 'open' | 'won' | 'lost';
  probability: number; // percentage (0 - 100)
  expectedCloseDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  owner: { id: string; name: string; email: string; avatar?: string };
  tags: string[];
  notes: Array<{ id: string; author: string; content: string; createdAt: Date }>;
  files: Array<{ id: string; name: string; size: string; uploadedAt: Date }>;
  timeline: Array<{ id: string; type: string; title: string; timestamp: Date }>;
  createdAt: Date;
  updatedAt: Date;
}
```

### 5.3 User Schema (`server/src/models/User.js`)
```typescript
interface UserDocument {
  name: string;
  email: string; // unique indexed
  password: string; // bcrypt hash
  role: 'admin' | 'sales_rep' | 'manager' | 'viewer';
  companyName: string;
  avatar?: string;
  createdAt: Date;
}
```

---

## 6. Security Architecture & Authentication Flow

1. **Client Request:** User inputs credentials into `LoginView.tsx`.
2. **Password Validation:** Backend locates user by email and performs `bcrypt.compare(candidatePassword, user.password)`.
3. **Token Issuance:** Backend signs a JWT with payload `{ id: user._id, role: user.role, email: user.email }` expiring in 7 days.
4. **Header Injection:** Client stores token in localStorage and includes `Authorization: Bearer <TOKEN>` in the headers of all outbound HTTP requests.
5. **Route Protection:** Express middleware `authMiddleware.js` verifies the token signature on protected routes and attaches the validated user object to `req.user`.

---

## 7. Production Build & Deployment Pipeline

- **Vite Bundling:** Executed via `npm run build`. Compiles TypeScript with `tsc` and bundles assets with Vite.
- **Minification & Code Splitting:** Produces a single HTML entry point, scoped CSS (`~85KB`), and minified vendor/application JavaScript chunks.
- **Port Allocation:**
  - Frontend: `http://localhost:3000` (Dev Server / Preview)
  - Backend API: `http://localhost:5000` (Express REST Service)
  - Database: `mongodb://127.0.0.1:27017/crm_pro`

