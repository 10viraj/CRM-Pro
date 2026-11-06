# Engineering Rules, Coding Standards & Operational Guidelines — CRM Pro

**Document Version:** 1.0.0  
**Scope:** Frontend (React + TypeScript + Tailwind), Backend (Node.js + Express), Database (MongoDB Mongoose)  

---

## 1. Core Engineering Principles

1. **Type Safety First:** Zero tolerance for the `any` type in TypeScript files. Every model, API response, hook argument, and component prop must have an explicit interface defined in `src/types/index.ts`.
2. **Component Single Responsibility (SRP):** Presentation components must remain purely presentational. Complex data transforms, filtering algorithms, and network calls belong in custom hooks, utility functions, or the central `CRMContext`.
3. **Graceful Zero-State Handling:** Never display `NaN`, `undefined`, raw `null`, or broken divisions (e.g. `0 / 0`). When records are empty, every chart, table, metric card, and funnel must render an intentional, polished empty state with an actionable CTA button.
4. **Documentation & Comment Integrity:** Never strip existing comments, docstrings, or architectural notes when modifying code files. Preserve functional documentation at all times.
5. **Security Without Workarounds:** Never bypass authentication checks, disable CORS protections, or store plaintext passwords. Always use bcrypt with 10 salt rounds and standard JWT bearer headers.

---

## 2. TypeScript & React Standards

### 2.1 Component Structure
- Use functional components typed with `React.FC<PropsInterface>`.
- Order file contents consistently:
  1. External library imports (React, Lucide icons, Recharts)
  2. Internal context & domain type imports
  3. Utility & formatter imports
  4. Child component imports
  5. Local interface & type definitions
  6. Component declaration
  7. State hooks, refs, and memoized values
  8. Event handler functions
  9. JSX render block

### 2.2 Memoization & Performance
- Use `useMemo` for expensive computations:
  - Multi-condition array filtering (e.g. `filteredLeads`, `sortedDeals`).
  - Aggregate financial calculations (`totalActivePipeline`, `weightedForecast`, `conversionRate`).
- Use `useCallback` when passing event handlers down to heavy list items (e.g. `DealCard` in Kanban columns) to prevent unnecessary re-renders.
- Ensure dependency arrays are comprehensive and exhaustive.

### 2.3 Strict Typing Example
```typescript
// ✅ Good: Explicit domain typing
interface DealCardProps {
  deal: Deal;
  onSelect: (deal: Deal) => void;
  onEdit?: (deal: Deal) => void;
  onDelete?: (deal: Deal) => void;
  onMoveToNextStage?: (deal: Deal) => void;
  isLastStage?: boolean;
}

export const DealCard: React.FC<DealCardProps> = ({ deal, onSelect, ... }) => { ... };

// ❌ Bad: Untyped or using any
export const DealCard = ({ deal, onSelect }: any) => { ... };
```

---

## 3. Tailwind CSS & Design System Rules

### 3.1 SaaS Color Constraints
Always use the standardized CRM Pro color palette tokens:
- **Canvas / Background:** `bg-[#F8FAFC]` (`bg-slate-50`)
- **Card Surfaces:** `bg-white` with soft borders `border-slate-200/90` or `border-slate-200/80`
- **Primary Brand:** `bg-blue-600` (`#2563EB`), hover `bg-blue-700`, subtle tint `bg-blue-50 text-blue-700`
- **Primary Text:** `text-slate-900` (`#0F172A`)
- **Secondary Text:** `text-slate-500` (`#64748B`) or `text-slate-400`
- **Semantic Indicators:**
  - **Success / Won:** Emerald (`bg-emerald-50 text-emerald-700 border-emerald-200`)
  - **Warning / Proposal / Pending:** Amber (`bg-amber-50 text-amber-700 border-amber-200`)
  - **Danger / High Urgency / Lost:** Rose / Red (`bg-rose-50 text-rose-700 border-rose-200`)
  - **Qualified / Pipeline:** Cyan / Indigo (`bg-cyan-50 text-cyan-700 border-cyan-200`)

### 3.2 Anti-Patterns Strictly Prohibited
- ❌ **No Garish Gradients:** Avoid loud, multi-stop radial or diagonal gradients across cards. Keep surfaces clean `#FFFFFF`.
- ❌ **No Oversized Typography:** Restrict main headings to `text-2xl font-extrabold tracking-tight`. Use `text-xs font-semibold` for tables and `text-[10px] font-bold uppercase` for metadata badges.
- ❌ **No Bootstrap Generic Styling:** Avoid default alerts, rectangular buttons, or unpadded card layouts. All buttons must have rounded corners (`rounded-xl`), soft transitions, and active tap feedback.
- ❌ **No Missing Empty States:** Never leave a table or view completely blank when data length is 0. Always display the standard `<EmptyState />` component with an icon and action button.

---

## 4. State Management & Data Persistence Rules

### 4.1 Local Storage Storage Key Prefix
All local storage items must use the versioned prefix `crm_pro_v3_`:
```typescript
const STORAGE_KEY_PREFIX = 'crm_pro_v3_';
// Keys: crm_pro_v3_leads, crm_pro_v3_deals, crm_pro_v3_contacts, etc.
```

### 4.2 Data Immutability
Always treat state as immutable:
```typescript
// ✅ Good: Immutable state update
setDeals(prev => prev.map(d => d.id === targetId ? { ...d, stage: newStage } : d));

// ❌ Bad: In-place array mutation
const deal = deals.find(d => d.id === targetId);
deal.stage = newStage;
setDeals(deals);
```

### 4.3 Zero Data vs Demo Data Integrity
- When `resetToZero()` is invoked:
  - All entities (`leads`, `deals`, `contacts`, `companies`, `tasks`, `activities`, `notifications`) must be reset to `[]`.
  - The administrator user account (`viraj@crmpro.io`) must **never** be deleted or logged out during a data reset.
  - Calculations must safely yield `₹0`, `0`, and `0.0%` without runtime errors.
- When `loadDemoData()` is invoked:
  - Pre-populated demo constants must populate all views seamlessly without requiring a hard page reload.

---

## 5. Backend REST API & Database Rules

### 5.1 Standardized Response Envelope
All Express route controllers must return JSON payloads adhering to the standardized envelope structure:

```json
{
  "success": true,
  "count": 12,
  "data": [ ... ],
  "message": "Operation completed successfully"
}
```

For error responses:
```json
{
  "success": false,
  "error": "Resource not found",
  "statusCode": 404
}
```

### 5.2 HTTP Status Codes
- `200 OK`: Successful GET, PUT, or PATCH operation.
- `201 Created`: Successful POST record creation.
- `400 Bad Request`: Validation failure or malformed payload.
- `401 Unauthorized`: Missing, invalid, or expired JWT token.
- `403 Forbidden`: Insufficient RBAC role permissions.
- `404 Not Found`: Target entity ID does not exist in MongoDB.
- `500 Internal Server Error`: Unhandled server exception (caught by error middleware).

### 5.3 Mongoose Model Constraints
- All schemas must include `{ timestamps: true }` so `createdAt` and `updatedAt` are maintained automatically.
- Unique fields (e.g. `User.email`) must have explicit database-level unique indexes.
- Pre-save hooks must be used for sensitive data handling (e.g. bcrypt hashing passwords before persisting `User` documents).

---

## 6. Verification & Build Rules

1. Before pushing any commit or declaring a task complete, verify that:
   - `npm run build` exits with code `0`.
   - TypeScript compilation (`tsc`) reports `0` errors.
   - Both development servers run without warnings:
     - Frontend: `http://localhost:3000`
     - Backend API: `http://localhost:5000`

