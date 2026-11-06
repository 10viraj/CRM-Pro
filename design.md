# Design System Specification & UI/UX Guidelines — CRM Pro

**Document Version:** 1.0.0  
**Status:** Approved Design Specification  
**Design Style:** Modern Enterprise B2B SaaS (Border-Led, Slate Palette, High Contrast)  

---

## 1. Design Philosophy & Brand Identity

CRM Pro is crafted to look and feel like an enterprise SaaS platform (comparable to Linear, HubSpot, and Stripe) rather than a generic dashboard template.

### 1.1 Core Design Pillars
1. **Border-Led Structure Over Heavy Shadows:** Surfaces are delineated by clean, crisp borders (`border-slate-200/90` or `border-slate-200/80`) paired with subtle ambient background lighting (`bg-slate-50`), avoiding muddy drop shadows.
2. **Disciplined Color Application:** Color is treated as a semantic communication tool rather than decoration. Neutral slates dominate the canvas, while vibrant tones are reserved strictly for actionable buttons and status indicators.
3. **Information Density with Breathable Whitespace:** Standardized internal padding (`p-4` to `p-6`) and balanced grid gaps (`gap-4` to `gap-6`) ensure high data density without visual clutter.
4. **Deliberate Mobile Adaptation:** Mobile layouts are designed intentionally with native mobile patterns: hamburger navigation, bottom action dock with a floating (+) Quick Action FAB, swipeable Kanban columns, and bottom-sheet forms.

---

## 2. Color Palette & Design Tokens

### 2.1 Foundational Palette

| Token Name | Hex Code | Tailwind Utility | Semantic Role |
| :--- | :--- | :--- | :--- |
| **Canvas Background** | `#F8FAFC` | `bg-slate-50` | Primary app canvas and page backdrop |
| **Card Surface** | `#FFFFFF` | `bg-white` | Elevated card containers, modals, table rows |
| **Card Border** | `#E2E8F0` | `border-slate-200` | Subtle structural division lines |
| **Primary Text** | `#0F172A` | `text-slate-900` | Primary headings, titles, financial amounts |
| **Secondary Text** | `#64748B` | `text-slate-500` | Subtitles, helper text, table column labels |
| **Muted Text / Icons** | `#94A3B8` | `text-slate-400` | Inactive icons, subtle timestamps |
| **Primary Brand** | `#2563EB` | `bg-blue-600` | Primary call-to-actions, active navigation pills |
| **Primary Brand Hover**| `#1D4ED8` | `bg-blue-700` | Hover state for primary buttons |
| **Primary Brand Tint** | `#EFF6FF` | `bg-blue-50` | Active selection backgrounds, primary badge fill |

### 2.2 Semantic Status Palette

| Status Category | Background Tint | Text Color | Border Color | Typical Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Success / Won** | `bg-emerald-50` | `text-emerald-700` | `border-emerald-200` | Closed Won deals, Active Customer, Completed tasks |
| **Warning / Proposal** | `bg-amber-50` | `text-amber-700` | `border-amber-200` | Proposal stage, Pending activities, Quota alerts |
| **Danger / Lost / Urgent**| `bg-rose-50` | `text-rose-700` | `border-rose-200` | Closed Lost deals, Urgent tasks, Delete confirmations |
| **Qualified / Pipeline** | `bg-cyan-50` | `text-cyan-700` | `border-cyan-200` | BANT Qualified leads, in-progress stages |
| **Information / System** | `bg-indigo-50` | `text-indigo-700` | `border-indigo-200` | General system notifications, deal updates |
| **Neutral / Inactive** | `bg-slate-100` | `text-slate-700` | `border-slate-300` | Draft records, archived items, read alerts |

---

## 3. Typography Scale & Hierarchy

**Font Family:** Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif.

| Level | Size / Weight | Line Height | Tracking | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Display 1 (Hero)** | `text-4xl sm:text-6xl` / `font-extrabold` | `leading-tight` | `tracking-tight` | Landing page hero headline |
| **Display 2** | `text-3xl` / `font-extrabold` | `leading-snug` | `tracking-tight` | Landing page feature headers |
| **Heading 1** | `text-2xl` / `font-extrabold` | `leading-8` | `tracking-tight` | Dashboard "Good morning" greeting, View titles |
| **Heading 2** | `text-xl` / `font-bold` | `leading-7` | `tracking-tight` | Modal titles, Drawer titles, Section headers |
| **Heading 3** | `text-sm` / `font-bold` | `leading-5` | `tracking-normal` | Card titles, Kanban column headers, Table headers |
| **Body (Base)** | `text-sm` / `font-normal` | `leading-6` | `tracking-normal` | Modal form inputs, notes, descriptions |
| **Body (Dense)** | `text-xs` / `font-medium` | `leading-5` | `tracking-normal` | Data table cells, list items, search fields |
| **Metadata / Badge** | `text-[10px]` / `font-extrabold` | `leading-4` | `tracking-wider` | Uppercase stage badges, probability indicators |

---

## 4. Spacing, Elevation & Corner Radii

### 4.1 Spacing Scale
- `p-1` (4px): Sub-control padding, segmented pill buttons.
- `p-2` (8px): Icon button hit targets, dense input padding.
- `p-3.5` (14px): Compact cards, list row padding.
- `p-5` (20px): Standard card container padding, section dividers.
- `p-6` (24px): Page headers, modal content padding.
- `p-8` (32px): Spacious empty states, landing page containers.

### 4.2 Corner Radii
- `rounded-lg` (8px): Form input controls, buttons, dropdown menu items.
- `rounded-xl` (12px): Metric cards, filter containers, badge medallions.
- `rounded-2xl` (16px): Large dashboard cards, modals, Kanban columns.
- `rounded-full` (9999px): Status pill badges, user avatars, FAB buttons.

### 4.3 Elevation & Shadows
- `shadow-2xs` (`0 1px 2px rgba(0,0,0,0.03)`): Soft button resting state.
- `shadow-xs` (`0 1px 3px rgba(0,0,0,0.05)`): Standard card depth.
- `shadow-md` (`0 4px 6px -1px rgba(0,0,0,0.07)`): Dropdown popovers, hover card states.
- `shadow-2xl` (`0 25px 50px -12px rgba(0,0,0,0.18)`): Centered modal dialogs, slide-over drawers.

---

## 5. Component Specifications & Interaction Patterns

### 5.1 Buttons (`src/components/common/Button.tsx`)
- **Primary:** `bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs active:scale-[0.98] transition-all`
- **Secondary:** `bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold transition-all`
- **Outline:** `bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 transition-all`
- **Ghost:** `hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors`
- **Danger:** `bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold transition-all`
- **Loading State:** Disabled pointer events with an inline spinning SVG circle.

### 5.2 Input Controls (`src/components/common/Input.tsx`)
- Standard input: `bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-xs rounded-xl px-3 py-2 transition-all`
- Integrated leading icon (e.g. Search, Mail, Phone) and trailing instant-clear button (✕).

### 5.3 Metric Scorecards (`src/components/dashboard/MetricCard.tsx`)
- High-impact layout:
  - Header: Metric Title + Tonal Icon Medallion (`w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center`).
  - Numerals: `text-2xl font-extrabold text-slate-900 tracking-tight`.
  - Sparkline: Vector SVG curve visually indicating directional velocity.
  - Footer: Trend delta pill (`+12.5%` with `TrendingUp` icon) + contextual subtext (`vs last mo`).
  - Zero-State: Displays flat sparkline `[0,0,0,0,0]` and `0%` delta without layout distortion.

### 5.4 Empty States (`src/components/common/EmptyState.tsx`)
- Dashed border container (`border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center`).
- Soft icon container (`w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3`).
- Title in `text-sm font-bold text-slate-900` + descriptive helper text.
- Actionable CTA button to trigger record creation immediately.

---

## 6. Responsive Breakpoint & Adaptive Layout Rules

| Screen Size | Breakpoint | Layout Behavioral Rules |
| :--- | :--- | :--- |
| **Mobile** | `< 640px` | • Top navigation collapsed into hamburger drawer.<br>• Bottom action dock rendered with (+) Quick Action floating button.<br>• Kanban columns become swipeable snap-cards.<br>• Metric cards stack into 1 column.<br>• Modals transform into bottom slide-up sheets. |
| **Tablet** | `640px – 1024px`| • Collapsible icon-only sidebar navigation.<br>• Metric cards display in a 2-column grid.<br>• Tables render with horizontal scroll indicators.<br>• Kanban displays 2 visible columns at a time. |
| **Desktop** | `> 1024px` | • Fixed expanded sidebar with badge counts.<br>• 4 to 5 column KPI metric ribbons.<br>• Multi-column analytical views.<br>• Full 5-stage drag-and-drop Kanban board layout. |

