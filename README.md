# CRM Pro — Enterprise B2B SaaS Customer Relationship Management Platform

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-blue.svg?style=for-the-badge&logo=react" alt="React 18" />
  <img src="https://img.shields.io/badge/TypeScript-5.5-3178C6.svg?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6.0-646CFF.svg?style=for-the-badge&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC.svg?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Node.js-18+-339933.svg?style=for-the-badge&logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-4.21-000000.svg?style=for-the-badge&logo=express" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-6.0+-47A248.svg?style=for-the-badge&logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/JWT-Stateless_Auth-black.svg?style=for-the-badge&logo=json-web-tokens" alt="JWT" />
</p>

---

## 📌 Executive Overview

**CRM Pro** is a commercial-grade, multi-tenant B2B Sales CRM web application built using **React 18**, **TypeScript**, **Tailwind CSS**, **Node.js**, **Express**, and **MongoDB**. Designed for high-velocity sales teams, agencies, and enterprise account executives, CRM Pro streamlines pipeline execution from first marketing touchpoint to closed-won revenue.

### 🌟 Key Product Highlights
- **Unified Pipeline Visibility:** Real-time drag-and-drop Kanban boards with stage velocity tracking and probability-weighted revenue forecasting.
- **Atomic 1-Click Lead Conversion:** Instant transformation of qualified leads into active Deals, Contact profiles, and Company corporate accounts.
- **Enterprise Account Governance:** 360° company directories, lifecycle hierarchies, and chronological audit timelines.
- **Tri-Mode Task Management:** Seamless switching between **List**, **Kanban**, and **Calendar** views with urgency tags.
- **Integrated Calendar & Scheduler:** Discovery demo booking with built-in Google Meet link generation.
- **Dual-Engine Analytics:** Real-time financial dashboards leveraging **Recharts** and custom **Vector SVG** engines with period filtering (`Today`, `7 Days`, `30 Days`, `3 Months`, `1 Year`).
- **Power-User Navigation:** Global Command Palette (`⌘K` / `Ctrl+K`) and two-key navigation chords (`G` then `D` for Dashboard, `G` then `L` for Leads).
- **Public SaaS Landing Page:** High-conversion marketing showcase with interactive pricing, testimonials, FAQ, and 1-click demo access for recruiters.
- **Zero-State Flexibility:** 1-click toggling between a pristine clean slate (`0` data) for operational deployment and rich, realistic enterprise demo data for portfolio presentations.

---

## 📂 Project Directory Structure

CRM Pro follows a clean, decoupled monorepo architecture:

```
CRM Pro/
├── client/                      # Presentation Tier (React 18 + TypeScript + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/          # Sidebar, Header, CommandPalette, Breadcrumbs
│   │   │   ├── dashboard/       # DashboardOverview, MetricCard, PipelineForecast
│   │   │   ├── leads/           # LeadsView, LeadDetailModal, ConvertLeadModal
│   │   │   ├── deals/           # DealsView, KanbanBoard, DealCard, DealDrawer
│   │   │   ├── contacts/        # ContactsView, ContactModal
│   │   │   ├── companies/       # CompaniesView, CompanyModal
│   │   │   ├── tasks/           # TasksView, TaskListView, TaskKanbanView, TaskCalendarView
│   │   │   ├── calendar/        # CalendarView, MonthView, EventModal
│   │   │   ├── activities/      # ActivitiesView (Chronological Audit Trail)
│   │   │   ├── analytics/       # AnalyticsView, Recharts & SVG visualizers
│   │   │   ├── landing/         # Public Commercial SaaS Landing Page
│   │   │   ├── auth/            # Login, Register, Forgot/Reset Password, Verification
│   │   │   ├── settings/        # System Configuration & Preferences
│   │   │   └── common/          # 18 Reusable UI Design System Components
│   │   ├── context/             # Central CRMContext state machine & local storage sync
│   │   ├── types/               # Strict TypeScript domain interfaces
│   │   └── utils/               # Currency, date formatters, and mock datasets
│   ├── index.html               # Frontend HTML root
│   ├── package.json             # Frontend dependencies & scripts
│   ├── tsconfig.json            # Strict TypeScript configuration
│   ├── vite.config.ts           # Vite build configuration (Port 3000)
│   └── tailwind.config.js       # Enterprise SaaS design system tokens
│
├── server/                      # Application Tier (Node.js + Express REST API)
│   ├── src/
│   │   ├── config/              # MongoDB Mongoose connection manager
│   │   ├── controllers/         # Auth, Leads, Deals, Contacts, Companies, Tasks, Activities
│   │   ├── middleware/          # JWT auth guard, RBAC validator, global error handler
│   │   ├── models/              # Mongoose schemas (User, Lead, Deal, Contact, Company, Task)
│   │   ├── routes/              # Express REST API endpoints (/api/*)
│   │   ├── seed/                # clearData.js (Zero reset) & seedData.js (Demo populate)
│   │   └── server.js            # Express application bootstrap (Port 5000)
│   ├── .env                     # Server environment variables
│   ├── .env.example             # Server environment template
│   └── package.json             # Backend dependencies & scripts
│
├── docs/                        # Complete Engineering & Product Documentation
│   ├── PRD.md                   # Product Requirements Document
│   ├── architecture.md          # System Architecture & Technical Design Document
│   ├── design.md                # Design System Specification & UI/UX Guidelines
│   ├── phases.doc.md            # Implementation Phases & Strategic Roadmap
│   ├── rules.md                 # Engineering Rules & Coding Standards
│   └── workflow.md              # Operational & Technical Workflow Guide
│
├── package.json                 # Monorepo root orchestrator (Single-command runner)
├── .gitignore                   # Version control ignore rules
└── README.md                    # Executive project documentation
```

---

## 🛠️ Technology Stack

| Layer | Technologies | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18, TypeScript 5.5, Vite 6 | High-speed SPA rendering with strict type safety |
| **Styling** | Tailwind CSS 3.4, PostCSS, Lucide Icons | Border-led SaaS theme, feather vector iconography |
| **Data Viz** | Recharts 2.12 + Custom SVG | Dual-engine charts for revenue, acquisition, and funnels |
| **Backend** | Node.js 18+, Express.js 4.21 | Modular RESTful API services (ES Modules) |
| **Database** | MongoDB 6.0+, Mongoose ODM 8.3 | Document store with compound indexing |
| **Security** | JWT, bcryptjs (10 salt rounds) | Stateless bearer authentication and RBAC |
| **State / Cache** | React Context + LocalStorage | Optimistic UI updates with offline resilience |

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) (running locally on port `27017`) or a MongoDB Atlas connection string.

### 1. Clone & Install Dependencies
Clone the repository and install dependencies across all workspaces with one command:

```bash
git clone https://github.com/virajsomani/crm-pro.git
cd "CRM Pro"

# Install both client and server dependencies
npm run install:all
```

### 2. Configure Environment Variables
Verify or adjust the backend environment file in `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/crm_pro
JWT_SECRET=crm_pro_super_secret_jwt_key_2026_enterprise_production
JWT_EXPIRE=7d
NODE_ENV=development
```

### 3. Start Both Frontend and Backend (Single Command)
Run the root orchestrator to start the React frontend and Express backend concurrently:

```bash
npm run dev
```

- **Frontend Application:** [http://localhost:3000](http://localhost:3000)
- **Backend REST API:** [http://localhost:5000](http://localhost:5000)
- **API Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 📜 Available NPM Scripts

From the root directory:

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts **both** client (Port 3000) and server (Port 5000) concurrently with colored terminal logs. |
| `npm run dev:client` | Runs only the Vite client development server. |
| `npm run dev:server` | Runs only the Express backend development server with auto-reload. |
| `npm run build` | Compiles TypeScript and builds the production frontend bundle into `client/dist/`. |
| `npm run preview` | Previews the compiled client production build locally. |
| `npm start` | Starts the production Express server. |
| `npm run seed` | Populates MongoDB with realistic Indian & international enterprise demo records. |
| `npm run clear` | Clears all data in MongoDB to start from zero (preserves admin account). |

---

## 🔑 Default Credentials & Demo Access

| User Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **System Administrator** | `viraj@crmpro.io` | `admin123` | Full administrative access, settings, RBAC, zero reset |
| **Senior Account Executive** | `rahul@crmpro.io` | `sales123` | Deals, leads, contacts, tasks, reports |
| **Account Executive** | `priya@crmpro.io` | `sales123` | Deals, leads, contacts, tasks |

> 💡 **Instant Recruiter Demo:** First-time visitors on the landing page can click **"View Demo"** anywhere to bypass the login gate and explore the CRM immediately.

---

## 🔄 Dual Operational Modes

You can switch between operational modes at any time from your avatar dropdown in the top header:
1. **"Reset All Data to Zero"**: Flushes MongoDB collections and resets client local storage to `0`. Scorecards display `0`, `₹0`, and `0.0%` with flat sparklines, giving you a clean slate to enter real business records.
2. **"Load Sample Demo Data"**: Instantly reloads 1,248 leads, ₹91.48L active pipeline, and complete historical analytics to present the CRM to clients or recruiters.

---

## 📖 In-Depth Project Documentation

Comprehensive engineering documentation is maintained in the [`docs/`](docs/) directory:

- 📋 [**Product Requirements Document (PRD)**](docs/PRD.md) — Functional specifications, personas, and acceptance criteria.
- 🏗️ [**System Architecture & Technical Design**](docs/architecture.md) — Topology, database schemas, and state management.
- 🎨 [**Design System & UI/UX Guidelines**](docs/design.md) — Color tokens, typography, component specs, and responsive layouts.
- 📜 [**Engineering Rules & Standards**](docs/rules.md) — TypeScript conventions, Tailwind constraints, and code integrity rules.
- 🗺️ [**Implementation Phases & Roadmap**](docs/phases.doc.md) — Milestones, deliverables, and future AI extensions.
- ⚡ [**Operational & Technical Workflow Guide**](docs/workflow.md) — Step-by-step lifecycle flow, command palette, and keyboard navigation.

---

## 👤 Author & Developer

**Viraj Somani**  
- **Role:** Full-Stack Software Engineer / Developer  
- **Portfolio:** [CRM Pro Platform](http://localhost:3000)  
- **Email:** `viraj@crmpro.io`  

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).

