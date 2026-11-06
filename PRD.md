# Product Requirements Document (PRD) — CRM Pro

**Document Version:** 1.0.0  
**Status:** Approved & Implemented  
**Author:** Full-Stack Engineering Team  
**Target Platform:** Web (Desktop, Tablet, Mobile Responsive)  
**Live Application URL:** `http://localhost:3000` (Frontend) | `http://localhost:5000` (Backend API)  

---

## 1. Executive Summary & Vision

### 1.1 Product Statement
**CRM Pro** is a modern, high-performance, full-stack B2B SaaS Customer Relationship Management platform. Designed for fast-growing sales organizations, agencies, and enterprise account teams, CRM Pro streamlines pipeline execution from first touchpoint to closed-won deal.

### 1.2 Core Value Proposition
- **Unified Pipeline Visibility:** Real-time drag-and-drop Kanban boards, stage velocity tracking, and probability-weighted revenue forecasting.
- **Enterprise Account Governance:** 360-degree company directories, contact lifecycle hierarchies, and chronological audit timelines.
- **High-Impact Productivity:** Tri-mode task management (List, Kanban, Calendar) with integrated meeting scheduling and Google Meet linking.
- **Dual-Engine Analytics:** Real-time financial dashboards leveraging Recharts and custom vector SVG engines with instant period filtering.
- **Zero-State Flexibility:** 1-click toggling between a pristine clean slate (`0` data) for operational deployment and rich, realistic enterprise demo data for portfolio presentations.

---

## 2. User Personas & Role-Based Access Control (RBAC)

### 2.1 Target Personas

| Persona | Primary Goal | Key Daily Workflows |
| :--- | :--- | :--- |
| **Sales Development Rep (SDR)** | Prospect capture & rapid qualification | Capturing new leads, BANT scoring, logging touchpoints (calls, emails), converting qualified leads into pipeline deals. |
| **Account Executive (AE)** | Opportunity velocity & deal closure | Managing deal stages, proposal delivery, contract negotiation, scheduling client demos, task tracking. |
| **Sales Director / Manager** | Revenue forecasting & rep performance | Inspecting pipeline distribution, tracking sales leaderboard attainment, export reports, setting quotas. |
| **System Administrator** | Workspace governance & system configuration | Managing user seats, RBAC roles, pipeline stages, system preferences, integrations, security audit logs. |

### 2.2 Role-Based Access Matrix

| Feature / Action | Admin | Sales Rep (AE) | SDR | Read-Only Viewer |
| :--- | :---: | :---: | :---: | :---: |
| View Dashboard & Analytics | Full | Full | Assigned | View Only |
| Create / Edit Leads & Contacts | Full | Full | Full | No |
| Convert Leads to Deals | Full | Full | Restricted | No |
| Drag & Drop Deals on Kanban | Full | Full | View Only | No |
| Delete Records (Deals/Leads) | Full | Confirmation Required | No | No |
| Manage Workspace & Settings | Full | No | No | No |
| Reset Data / Load Demo Mode | Full | No | No | No |

---

## 3. Product Features & Functional Requirements

### 3.1 Authentication & Onboarding
- **Multi-Screen Auth Suite:**
  - **Login:** Email, password, "Remember Me", forgot password link, Google OAuth trigger.
  - **Register:** Full name, work email, password, company name.
  - **Forgot Password & Reset Password:** Token-validated password recovery workflow.
  - **Email Verification:** OTP / link confirmation state.
- **Pre-Login SaaS Landing Page:**
  - High-conversion marketing showcase accessible prior to authentication.
  - Hero with dashboard preview mockup, 6 core feature highlights, 4 deep-dive interactive showcases, customer testimonials, tiered pricing table (Starter, Professional, Enterprise) with annual discount toggle, interactive FAQ accordion, and contact footer.
  - One-click **"View Demo"** access for recruiters and evaluators.

### 3.2 Lead Management
- **Lead Capture & Table:**
  - 9-column responsive data table: Lead Name, Company, Email, Phone, Lead Source, Status, Owner, Created Date, Actions.
  - 6 status workflows: `New`, `Contacted`, `Qualified`, `Proposal`, `Converted`, `Lost`.
  - Lead qualification scoring (0–100) with visual flame indicators.
- **Bulk Operations:**
  - Multi-row selection with bulk owner reassignment, bulk status changes, and bulk deletion.
  - Single-click CSV export and CSV import modal.
- **Conversion Flow:**
  - 1-click modal converting qualified leads into deals, contacts, and company accounts simultaneously.

### 3.3 Deals & Sales Pipeline
- **Dual-View Experience:**
  - **Kanban Board:** Smooth HTML5 drag-and-drop between pipeline stages (`New Lead` → `Qualified` → `Proposal` → `Negotiation` → `Won` / `Lost`).
  - **Dense Table View:** Sortable tabular pipeline with expected close date and status badges.
- **Stage Intelligence:**
  - Probability-weighted deal value calculation (e.g. 20% for Qualified, 80% for Negotiation).
  - Summary metrics banner: Active Pipeline Value, Weighted ARR, Won Count, Win Rate, Average Deal Size.
- **Deal Slide-Over Drawer:**
  - Tabbed overview displaying contract value, probability, key contacts, activity timeline, attached documents, and deal notes.

### 3.4 Contacts & Company Directory
- **Contacts Directory:**
  - Dual Card Grid and Dense Table views.
  - Lifecycle stages: `Lead`, `Marketing Qualified Lead`, `Sales Qualified Lead`, `Opportunity`, `Customer`, `Evangelist`.
  - One-click communication actions (mailto trigger, tel trigger, meeting scheduling).
- **Company Firmographics:**
  - Company profiles tracking annual revenue, employee count, industry tags, domain links, associated deals, and corporate location.

### 3.5 Productivity, Tasks & Calendar
- **Task Management Suite:**
  - Tri-mode view switching: **List View**, **Kanban View** (Todo, In Progress, Review, Completed), and **Calendar Agenda View**.
  - Urgency categorization: `Urgent`, `High`, `Medium`, `Low`.
  - Associative links binding tasks directly to specific deals, leads, or accounts.
- **Calendar & Event Scheduler:**
  - Month, Week, and Day calendar views.
  - Meeting scheduler with Google Meet link generation, attendee invitations, and calendar event modals.

### 3.6 Chronological Activity Audit Trail
- System-wide immutable activity logging:
  - Logs phone calls, emails sent, meetings conducted, deal stage transitions, notes added, and tasks completed.
  - Filterable by activity type, date range, and team member.

### 3.7 Reports & Analytics Suite
- **Date Range Filters:** `Today`, `7 Days`, `30 Days`, `3 Months`, `1 Year`.
- **Visualization Engines:** Dual-engine toggling between **Recharts** and custom **Vector SVG** graphics.
- **Core Analytics Components:**
  - **Sales Revenue Chart:** Area/Line chart comparing actual closed revenue vs target quotas.
  - **Leads Generated Chart:** Inbound vs outbound acquisition bar chart.
  - **Conversion Funnel:** Stage-by-stage drop-off visualization from Lead to Closed Won.
  - **Pipeline Donut:** Stage distribution by deal value and percentage share.
  - **Sales Leaderboard:** Top rep podium ranking quota attainment, closed contract volume, and win efficiency.
  - **Lead Sources Breakdown:** Channel attribution ROI across Website, LinkedIn, Referrals, Google Ads, Email, and Organic.

### 3.8 Notification Center & Command Palette
- **Notification Center:**
  - Unread counter badges, category tabs (`All`, `Deals`, `Tasks`, `Leads`, `System`), mark all read, and granular channel delivery preferences.
- **Global Command Palette (`⌘K` / `Ctrl+K`):**
  - Instant fuzzy search across all leads, deals, contacts, and navigation routes.
  - Keyboard shortcut navigation chords (`G` then `D` for Dashboard, `G` then `L` for Leads, `G` then `O` for Deals, etc.).

### 3.9 Zero-State & Demo Mode Switching
- **Clean Slate Operation:**
  - Backend database seed script (`server/src/seed/clearData.js`) resetting MongoDB collections to 0 while preserving admin authentication.
  - Frontend `resetToZero()` method clearing client state and local storage (`crm_pro_v3_*`).
  - Dynamic KPI scorecards displaying clean `0`, `₹0`, `0.0%`, flat sparklines, and informative empty state containers with primary CTA buttons.
- **Demo Data Restoration:**
  - 1-click **"Load Sample Demo Data"** action from header profile menu repopulating realistic Indian and international enterprise data (TechNova Solutions, Acme Technologies, BrightLabs, CloudCore Systems, PixelWorks, InnovateX).

---

## 4. Non-Functional Requirements (NFRs)

### 4.1 Performance & Responsiveness
- **Initial Load Time:** Sub-1.2 seconds for full SPA bundle delivery.
- **UI Interaction Latency:** Sub-50ms for local state transitions, filter changes, and Kanban drag-and-drop actions.
- **Optimistic UI Updates:** Instant client-side state mutation with silent background API synchronization.
- **Bundle Optimization:** Vite production chunk splitting with gzipped assets under 350KB.

### 4.2 Reliability & Fault Tolerance
- **Dual Persistence Architecture:** Seamless automatic failover between MongoDB REST API and client-side `LocalStorage` (`crm_pro_v3_*`).
- **Zero Data Loss Guarantee:** All user forms, edits, and note additions persist immediately.
- **Error Boundaries:** Graceful UI degradation with Toast notification alerts and recovery triggers.

### 4.3 Security & Privacy
- **Authentication:** Stateless JSON Web Token (JWT) with HTTP Bearer authorization headers.
- **Password Security:** Salted bcrypt hashing with 10 rounds prior to database insertion.
- **Input Sanitization:** Express-validator and frontend form validation guarding against XSS and NoSQL injection.
- **CORS Protection:** Whitelisted origin constraints on backend Express endpoints.

### 4.4 Usability & Design Polish
- **Color Contrast:** WCAG 2.1 AA compliance across all slate typography and status badges.
- **Responsive Adaptability:** Specialized three-tier layout architecture for Desktop (1024px+), Tablet (640px–1024px), and Mobile (<640px) including bottom action dock with floating action button (FAB).
- **Typography & Hierarchy:** Strict adherence to SaaS design systems without loud gradients or generic template traits.

