import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  Button,
  Input,
  Select,
  Search,
  Modal,
  Drawer,
  Dropdown,
  Tooltip,
  Badge,
  Avatar,
  AvatarGroup,
  DataTable,
  Column,
  Pagination,
  Tabs,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  ToastNotification,
  ConfirmationDialog,
  EmptyState,
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonCard,
  SkeletonTable
} from './index';
import {
  Sparkles,
  Search as SearchIcon,
  Mail,
  User,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Layers,
  ArrowRight,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Info,
  Shield,
  Download,
  Filter,
  Kanban,
  Palette,
  Copy,
  Check,
  Smartphone,
  Tablet,
  Monitor
} from 'lucide-react';

export const UIComponentShowcase: React.FC = () => {
  const { showToast } = useCRM();

  // Active Device Tier Preview State
  const [deviceTier, setDeviceTier] = useState<'desktop' | 'tablet' | 'mobile'>('mobile');

  // State for copied color swatch
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopyColor = (hex: string, name: string) => {
    navigator.clipboard?.writeText(hex);
    setCopiedHex(hex);
    showToast('Color Copied', `${name} (${hex}) copied to clipboard.`, 'info');
    setTimeout(() => {
      setCopiedHex(prev => (prev === hex ? null : prev));
    }, 2000);
  };

  // State for interactive components
  const [inputValue, setInputValue] = useState('Acme Cloud Technologies');
  const [inputError, setInputError] = useState('');
  const [selectValue, setSelectValue] = useState('qualified');
  const [searchValue, setSearchValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [activeUnderlineTab, setActiveUnderlineTab] = useState('pipeline');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectedTableIds, setSelectedTableIds] = useState<string[]>(['1', '3']);
  const [sortKey, setSortKey] = useState('value');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Sample data for DataTable demo
  interface SampleLead {
    id: string;
    name: string;
    company: string;
    stage: string;
    value: string;
    rep: string;
    statusBadge: 'emerald' | 'blue' | 'amber';
  }

  const sampleLeads: SampleLead[] = [
    { id: '1', name: 'Rohit Verma', company: 'Acme Technologies', stage: 'Negotiation', value: '₹1,80,000', rep: 'Viraj Somani', statusBadge: 'emerald' },
    { id: '2', name: 'Elena Rostova', company: 'Vanguard FinTech', stage: 'Won', value: '₹12,00,000', rep: 'Alex Rivera', statusBadge: 'emerald' },
    { id: '3', name: 'Dr. Clara Thorne', company: 'Pulse Health AI', stage: 'Proposal', value: '₹8,50,000', rep: 'Maya Patel', statusBadge: 'blue' },
    { id: '4', name: 'Sarah Williams', company: 'Nexus Cloud', stage: 'Qualified', value: '₹4,20,000', rep: 'Marcus Vance', statusBadge: 'blue' },
    { id: '5', name: 'David Chen', company: 'OmniFlow Global', stage: 'Contacted', value: '₹2,60,000', rep: 'Viraj Somani', statusBadge: 'amber' }
  ];

  const tableColumns: Column<SampleLead>[] = [
    {
      key: 'name',
      header: 'Contact Person',
      sortable: true,
      render: item => (
        <div className="flex items-center gap-2.5">
          <Avatar name={item.name} size="sm" />
          <div>
            <span className="font-bold text-slate-900 block">{item.name}</span>
            <span className="text-2xs text-slate-400">{item.company}</span>
          </div>
        </div>
      )
    },
    {
      key: 'stage',
      header: 'Pipeline Stage',
      sortable: true,
      render: item => (
        <Badge variant={item.statusBadge} size="sm" dot>
          {item.stage}
        </Badge>
      )
    },
    {
      key: 'value',
      header: 'Deal Value',
      sortable: true,
      align: 'right',
      render: item => <span className="font-bold text-slate-900">{item.value}</span>
    },
    {
      key: 'rep',
      header: 'Owner',
      render: item => <span className="text-slate-600">{item.rep}</span>
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200 pb-16">
      {/* ─────────────────────────────────────────────────────────────
          PAGE HEADER
          ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Design System & Reusable UI Components
            </h1>
            <span className="text-2xs font-extrabold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              18 Core Elements
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Production-ready enterprise SaaS component library built with consistent typography, slate palette, and Tailwind CSS
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<Sparkles className="w-3.5 h-3.5 text-blue-600" />}
            onClick={() => showToast('Design System Active', 'All 18 UI components verified.', 'success')}
          >
            Design Verified
          </Button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 1: BUTTONS & BADGES
          ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. BUTTONS */}
        <Card variant="default">
          <CardHeader title="1. Button" subtitle="5 variants, 3 sizes, icon integration, and loading states" />
          <CardContent className="space-y-4">
            <div>
              <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">Variants</span>
              <div className="flex flex-wrap items-center gap-2.5">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
              </div>
            </div>

            <div>
              <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">Sizes & Icons</span>
              <div className="flex flex-wrap items-center gap-2.5">
                <Button size="sm" icon={<Plus className="w-3.5 h-3.5" />}>Small</Button>
                <Button size="md" icon={<Mail className="w-4 h-4" />}>Medium</Button>
                <Button size="lg" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">Large</Button>
                <Button variant="outline" disabled>Disabled</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. BADGES */}
        <Card variant="default">
          <CardHeader title="2. Badge" subtitle="8 color variants, 2 sizes, and optional dot pulse indicator" />
          <CardContent className="space-y-4">
            <div>
              <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">Colors with Dot Indicators</span>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="blue" dot>New Lead</Badge>
                <Badge variant="emerald" dot>Qualified</Badge>
                <Badge variant="amber" dot>In Review</Badge>
                <Badge variant="purple" dot>Enterprise</Badge>
                <Badge variant="rose" dot>Urgent</Badge>
                <Badge variant="cyan" dot>Contacted</Badge>
                <Badge variant="pink" dot>VIP Client</Badge>
                <Badge variant="slate" dot>Draft</Badge>
              </div>
            </div>

            <div>
              <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">Sizes</span>
              <div className="flex items-center gap-2">
                <Badge variant="blue" size="sm">Small Badge</Badge>
                <Badge variant="blue" size="md">Medium Badge</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 2: FORM CONTROLS (Input, Select, Search)
          ───────────────────────────────────────────────────────────── */}
      <Card variant="default">
        <CardHeader title="3, 4, 5. Form Controls (Input, Select, Search)" subtitle="Accessible inputs with leading icons, helper text, error handling, and clear actions" />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Input */}
            <div>
              <Input
                label="Company Name (Input)"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="Enter organization name"
                icon={<User className="w-4 h-4" />}
                clearable
                onClear={() => setInputValue('')}
                helperText="Clearable input with leading icon"
              />
            </div>

            {/* Select */}
            <div>
              <Select
                label="Pipeline Stage (Select)"
                value={selectValue}
                onChange={e => setSelectValue(e.target.value)}
                icon={<Kanban className="w-4 h-4" />}
                options={[
                  { value: 'new_lead', label: 'New Lead (10%)' },
                  { value: 'qualified', label: 'Qualified (40%)' },
                  { value: 'proposal', label: 'Proposal (65%)' },
                  { value: 'won', label: 'Closed Won (100%)' }
                ]}
                helperText="Custom styled dropdown with chevron"
              />
            </div>

            {/* Search */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 select-none">
                Global Search (Search)
              </label>
              <Search
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                onClear={() => setSearchValue('')}
                placeholder="Search deals, contacts, tags..."
                shortcut="⌘K"
                resultCount={searchValue ? 4 : undefined}
              />
              <p className="text-2xs text-slate-500 mt-1">Includes shortcut pill and instant clear</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 3: OVERLAYS (Modal, Drawer, ConfirmationDialog, Dropdown, Tooltip)
          ───────────────────────────────────────────────────────────── */}
      <Card variant="default">
        <CardHeader title="6, 7, 8, 9, 10. Overlays & Floating Components" subtitle="Modal, Drawer, Confirmation Dialog, Dropdown Menu, and Tooltips" />
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            {/* Modal Trigger */}
            <Button
              variant="outline"
              size="sm"
              icon={<Sliders className="w-3.5 h-3.5 text-blue-600" />}
              onClick={() => setIsModalOpen(true)}
            >
              Open Center Modal
            </Button>

            {/* Drawer Trigger */}
            <Button
              variant="outline"
              size="sm"
              icon={<Layers className="w-3.5 h-3.5 text-purple-600" />}
              onClick={() => setIsDrawerOpen(true)}
            >
              Open Slide-Over Drawer
            </Button>

            {/* Confirmation Dialog Trigger */}
            <Button
              variant="outline"
              size="sm"
              icon={<AlertTriangle className="w-3.5 h-3.5 text-rose-600" />}
              onClick={() => setIsConfirmOpen(true)}
            >
              Open Confirm Dialog
            </Button>

            {/* Dropdown Menu */}
            <Dropdown
              trigger={
                <Button variant="outline" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
                  Actions Dropdown ▾
                </Button>
              }
              items={[
                { id: '1', label: 'Create Opportunity', icon: <Plus className="w-3.5 h-3.5" />, onClick: () => showToast('Action', 'Opportunity created.', 'success') },
                { id: '2', label: 'Export to CSV', icon: <Download className="w-3.5 h-3.5" />, badge: 'Pro', onClick: () => showToast('Export', 'CSV generated.', 'info') },
                { id: 'div', label: '', divider: true },
                { id: '3', label: 'Delete Record', icon: <Trash2 className="w-3.5 h-3.5" />, danger: true, onClick: () => showToast('Deleted', 'Record removed.', 'error') }
              ]}
            />

            {/* Tooltips in 4 Positions */}
            <Tooltip content="Tooltip positioned on top" position="top">
              <Button variant="secondary" size="sm">Hover Top Tooltip</Button>
            </Tooltip>

            <Tooltip content="Tooltip positioned on bottom" position="bottom">
              <Button variant="secondary" size="sm">Hover Bottom Tooltip</Button>
            </Tooltip>
          </div>
        </CardContent>
      </Card>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 4: AVATARS & TABS
          ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Avatars */}
        <Card variant="default">
          <CardHeader title="11. Avatar & AvatarGroup" subtitle="Sizes (xs to xl), status dots (online/busy/away), and stacked groups" />
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar name="Viraj Somani" size="xs" status="online" />
              <Avatar name="Alex Rivera" size="sm" status="busy" bg="bg-emerald-600 text-white" />
              <Avatar name="Maya Patel" size="md" status="away" bg="bg-purple-600 text-white" />
              <Avatar name="Marcus Vance" size="lg" status="online" bg="bg-amber-600 text-white" />
              <Avatar name="Sarah Jenkins" size="xl" status="online" bg="bg-rose-600 text-white" />
            </div>

            <div>
              <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">Stacked Avatar Group</span>
              <AvatarGroup max={4}>
                <Avatar name="Viraj Somani" />
                <Avatar name="Alex Rivera" bg="bg-emerald-600 text-white" />
                <Avatar name="Maya Patel" bg="bg-purple-600 text-white" />
                <Avatar name="Marcus Vance" bg="bg-amber-600 text-white" />
                <Avatar name="Sarah Jenkins" bg="bg-rose-600 text-white" />
                <Avatar name="Elena Rostova" bg="bg-cyan-600 text-white" />
              </AvatarGroup>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Card variant="default">
          <CardHeader title="12. Tabs" subtitle="Pill tabs and underline tabs with counts and badges" />
          <CardContent className="space-y-5">
            <div>
              <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">Pill Variant</span>
              <Tabs
                variant="pills"
                activeTab={activeTab}
                onChange={setActiveTab}
                items={[
                  { id: 'overview', label: 'Overview', count: 12 },
                  { id: 'activities', label: 'Activities', count: 5 },
                  { id: 'notes', label: 'Notes', badge: 'New' }
                ]}
              />
            </div>

            <div>
              <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">Underline Variant</span>
              <Tabs
                variant="underline"
                activeTab={activeUnderlineTab}
                onChange={setActiveUnderlineTab}
                items={[
                  { id: 'pipeline', label: 'Pipeline View', count: 48 },
                  { id: 'analytics', label: 'Analytics' },
                  { id: 'history', label: 'Audit History' }
                ]}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 5: DATA TABLE & PAGINATION
          ───────────────────────────────────────────────────────────── */}
      <Card variant="default">
        <CardHeader
          title="13, 14. Data Table & Pagination"
          subtitle="Sortable columns, row selection checkboxes, custom renderers, and pagination bar"
          action={
            <span className="text-xs font-semibold text-slate-500">
              {selectedTableIds.length} rows selected
            </span>
          }
        />
        <CardContent className="space-y-4">
          <DataTable<SampleLead>
            data={sampleLeads}
            columns={tableColumns}
            keyExtractor={item => item.id}
            selectable
            selectedIds={selectedTableIds}
            onSelectRow={id => {
              setSelectedTableIds(prev =>
                prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
              );
            }}
            onSelectAll={() => {
              if (selectedTableIds.length === sampleLeads.length) {
                setSelectedTableIds([]);
              } else {
                setSelectedTableIds(sampleLeads.map(l => l.id));
              }
            }}
            sortKey={sortKey}
            sortOrder={sortOrder}
            onSort={key => {
              if (sortKey === key) {
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              } else {
                setSortKey(key);
                setSortOrder('desc');
              }
            }}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={4}
            totalItems={18}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </CardContent>
      </Card>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 6: CARDS, TOAST NOTIFICATIONS & EMPTY STATES
          ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 15. Cards */}
        <Card variant="interactive">
          <CardHeader title="15. Card" subtitle="Bordered container with header & footer" />
          <CardContent>
            <p className="text-xs text-slate-600 leading-relaxed">
              Standard card component supporting default, elevated, flat, and interactive hover states with consistent border radiuses.
            </p>
          </CardContent>
          <CardFooter>
            <span className="text-slate-500 text-2xs">Updated just now</span>
            <Button size="sm" variant="ghost">Learn More →</Button>
          </CardFooter>
        </Card>

        {/* 16. Toast Notifications */}
        <Card variant="default">
          <CardHeader title="16. Toast Notifications" subtitle="Success, error, warning, and info toasts" />
          <CardContent className="space-y-2.5">
            <ToastNotification
              type="success"
              title="Deal Won! ₹1,80,000"
              message="Acme Technologies signed SOW."
            />
            <div className="flex gap-2 pt-2">
              <Button size="sm" variant="outline" onClick={() => showToast('Success Alert', 'Operation completed.', 'success')}>
                Trigger Success
              </Button>
              <Button size="sm" variant="outline" onClick={() => showToast('Error Notice', 'Validation failed.', 'error')}>
                Trigger Error
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 17. Empty States */}
        <Card variant="default">
          <CardHeader title="17. Empty State" subtitle="Clear fallback illustration & action" />
          <CardContent className="p-2">
            <EmptyState
              title="No Deals Found"
              description="Create a new deal to populate this pipeline stage."
              action={
                <Button size="sm" variant="primary" icon={<Plus className="w-3.5 h-3.5" />}>
                  Create Deal
                </Button>
              }
            />
          </CardContent>
        </Card>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 7: LOADING SKELETONS
          ───────────────────────────────────────────────────────────── */}
      <Card variant="default">
        <CardHeader title="18. Loading Skeletons" subtitle="Animated pulse shimmer states for text lines, user avatars, card widgets, and tables" />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">Text & Avatar Shimmer</span>
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-3">
                <div className="flex items-center gap-3">
                  <SkeletonAvatar size="md" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-3.5 w-1/2" />
                    <Skeleton className="h-2.5 w-3/4" />
                  </div>
                </div>
                <SkeletonText lines={3} />
              </div>
            </div>

            <div>
              <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">Card Shimmer</span>
              <SkeletonCard />
            </div>

            <div>
              <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">Table Rows Shimmer</span>
              <SkeletonTable rows={3} columns={3} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 8: 20. PROFESSIONAL SAAS COLOR SYSTEM
          ───────────────────────────────────────────────────────────── */}
      <Card variant="default">
        <CardHeader
          title={
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-blue-600" />
              <span>20. Professional SaaS Color System</span>
            </div>
          }
          subtitle="Strictly unified SaaS color tokens engineered for clarity, accessibility, and high sustained focus"
          action={
            <span className="text-2xs font-extrabold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Enterprise Palette
            </span>
          }
        />
        <CardContent className="space-y-6">
          {/* Swatch Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* 1. Primary: Blue */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs hover:border-blue-300 transition-all group">
              <div className="w-full h-14 rounded-lg bg-[#2563EB] shadow-xs flex items-center justify-center text-white font-bold text-xs">
                Primary Blue
              </div>
              <div className="mt-2.5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Primary</span>
                  <span className="text-2xs text-slate-500 font-mono">#2563EB</span>
                </div>
                <button
                  onClick={() => handleCopyColor('#2563EB', 'Primary Blue')}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  title="Copy Hex"
                >
                  {copiedHex === '#2563EB' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">Action buttons, active nav, primary CTAs</p>
            </div>

            {/* 2. Background: #F8FAFC */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs hover:border-slate-300 transition-all group">
              <div className="w-full h-14 rounded-lg bg-[#F8FAFC] border border-slate-200 shadow-2xs flex items-center justify-center text-slate-700 font-bold text-xs">
                Background
              </div>
              <div className="mt-2.5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Background</span>
                  <span className="text-2xs text-slate-500 font-mono">#F8FAFC</span>
                </div>
                <button
                  onClick={() => handleCopyColor('#F8FAFC', 'Background')}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  title="Copy Hex"
                >
                  {copiedHex === '#F8FAFC' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">Page backdrop, neutral workspace surface</p>
            </div>

            {/* 3. Cards: #FFFFFF */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs hover:border-slate-300 transition-all group">
              <div className="w-full h-14 rounded-lg bg-[#FFFFFF] border border-slate-200 shadow-2xs flex items-center justify-center text-slate-900 font-bold text-xs">
                Pure White Cards
              </div>
              <div className="mt-2.5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Cards</span>
                  <span className="text-2xs text-slate-500 font-mono">#FFFFFF</span>
                </div>
                <button
                  onClick={() => handleCopyColor('#FFFFFF', 'Cards')}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  title="Copy Hex"
                >
                  {copiedHex === '#FFFFFF' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">Record panels, tables, modals, flyouts</p>
            </div>

            {/* 4. Text: #0F172A */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs hover:border-slate-300 transition-all group">
              <div className="w-full h-14 rounded-lg bg-[#0F172A] shadow-xs flex items-center justify-center text-white font-bold text-xs">
                Aa Heading Text
              </div>
              <div className="mt-2.5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Text</span>
                  <span className="text-2xs text-slate-500 font-mono">#0F172A</span>
                </div>
                <button
                  onClick={() => handleCopyColor('#0F172A', 'Text')}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  title="Copy Hex"
                >
                  {copiedHex === '#0F172A' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">High-contrast headings, cell values, titles</p>
            </div>

            {/* 5. Secondary text: #64748B */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs hover:border-slate-300 transition-all group">
              <div className="w-full h-14 rounded-lg bg-[#64748B] shadow-xs flex items-center justify-center text-white font-bold text-xs">
                Secondary Text
              </div>
              <div className="mt-2.5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Secondary text</span>
                  <span className="text-2xs text-slate-500 font-mono">#64748B</span>
                </div>
                <button
                  onClick={() => handleCopyColor('#64748B', 'Secondary Text')}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  title="Copy Hex"
                >
                  {copiedHex === '#64748B' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">Subheadings, timestamps, helper labels</p>
            </div>

            {/* 6. Border: #E2E8F0 */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs hover:border-slate-300 transition-all group">
              <div className="w-full h-14 rounded-lg bg-[#E2E8F0] border border-slate-300 shadow-2xs flex items-center justify-center text-slate-700 font-bold text-xs">
                Structural Border
              </div>
              <div className="mt-2.5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Border</span>
                  <span className="text-2xs text-slate-500 font-mono">#E2E8F0</span>
                </div>
                <button
                  onClick={() => handleCopyColor('#E2E8F0', 'Border')}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  title="Copy Hex"
                >
                  {copiedHex === '#E2E8F0' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">Card boundaries, row dividers, inputs</p>
            </div>

            {/* 7. Success: Green */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs hover:border-emerald-300 transition-all group">
              <div className="w-full h-14 rounded-lg bg-[#16A34A] shadow-xs flex items-center justify-center text-white font-bold text-xs">
                Success Green
              </div>
              <div className="mt-2.5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Success</span>
                  <span className="text-2xs text-slate-500 font-mono">#16A34A</span>
                </div>
                <button
                  onClick={() => handleCopyColor('#16A34A', 'Success Green')}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                  title="Copy Hex"
                >
                  {copiedHex === '#16A34A' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">Won deals, verified badges, positive deltas</p>
            </div>

            {/* 8. Warning: Amber */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs hover:border-amber-300 transition-all group">
              <div className="w-full h-14 rounded-lg bg-[#D97706] shadow-xs flex items-center justify-center text-white font-bold text-xs">
                Warning Amber
              </div>
              <div className="mt-2.5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Warning</span>
                  <span className="text-2xs text-slate-500 font-mono">#D97706</span>
                </div>
                <button
                  onClick={() => handleCopyColor('#D97706', 'Warning Amber')}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                  title="Copy Hex"
                >
                  {copiedHex === '#D97706' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">Proposal reviews, high priority, pending sync</p>
            </div>

            {/* 9. Danger: Red */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs hover:border-rose-300 transition-all group">
              <div className="w-full h-14 rounded-lg bg-[#DC2626] shadow-xs flex items-center justify-center text-white font-bold text-xs">
                Danger Red
              </div>
              <div className="mt-2.5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Danger</span>
                  <span className="text-2xs text-slate-500 font-mono">#DC2626</span>
                </div>
                <button
                  onClick={() => handleCopyColor('#DC2626', 'Danger Red')}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Copy Hex"
                >
                  {copiedHex === '#DC2626' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">Lost deals, destructive actions, errors</p>
            </div>
          </div>

          {/* SaaS Principle Callout Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Color Harmony & Contrast Principles
              </h4>
              <p className="text-2xs text-slate-600 leading-relaxed max-w-3xl">
                Consistent semantic colors are utilized across all 20 CRM modules. Excessive bright, vibrating, or neon colors are strictly avoided in favor of calm slate neutrals, subtle pastel badges, and high WCAG AA contrast.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] font-semibold text-slate-500">Contrast Ratio:</span>
              <span className="text-2xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                14.2:1 AAA
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 9: 21. RESPONSIVE DESIGN (Desktop, Tablet, Mobile)
          ───────────────────────────────────────────────────────────── */}
      <Card variant="default">
        <CardHeader
          title={
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-blue-600" />
              <span>21. Responsive Design & Multi-Device Tiers</span>
            </div>
          }
          subtitle="Intentionally designed for mobile, tablet, and desktop viewports rather than scaled-down desktop UI"
          action={
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
              <button
                onClick={() => setDeviceTier('desktop')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  deviceTier === 'desktop' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Desktop</span>
              </button>
              <button
                onClick={() => setDeviceTier('tablet')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  deviceTier === 'tablet' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Tablet className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tablet</span>
              </button>
              <button
                onClick={() => setDeviceTier('mobile')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  deviceTier === 'mobile' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mobile</span>
              </button>
            </div>
          }
        />
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Desktop Tier Card */}
            <div className={`p-4 rounded-2xl border transition-all ${deviceTier === 'desktop' ? 'bg-blue-50/40 border-blue-300 ring-2 ring-blue-500/20' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
                    <Monitor className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Desktop Experience</h4>
                    <span className="text-[10px] text-slate-500">1024px and wider</span>
                  </div>
                </div>
                <Badge variant="blue" size="sm">Fixed Rail</Badge>
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                  <span><strong>Fixed Sidebar:</strong> Spacious navigation with persistent module badges and user profile menu</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                  <span><strong>Large Dashboard:</strong> 5-column metric KPI scorecards and 2-column pipeline charts</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                  <span><strong>Multi-column Layouts:</strong> 5-column drag-and-drop Kanban and 3-column contact directory cards</span>
                </li>
              </ul>
            </div>

            {/* Tablet Tier Card */}
            <div className={`p-4 rounded-2xl border transition-all ${deviceTier === 'tablet' ? 'bg-blue-50/40 border-blue-300 ring-2 ring-blue-500/20' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-cyan-100 text-cyan-700">
                    <Tablet className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Tablet Experience</h4>
                    <span className="text-[10px] text-slate-500">768px – 1023px viewports</span>
                  </div>
                </div>
                <Badge variant="cyan" size="sm">Collapsible</Badge>
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 mt-0.5 shrink-0" />
                  <span><strong>Collapsible Sidebar:</strong> Toggles effortlessly between compact icon-only rail (72px) and expanded 256px menu</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 mt-0.5 shrink-0" />
                  <span><strong>Responsive Cards:</strong> Adapts automatically to 2-column grids on iPad & Android tablets</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 mt-0.5 shrink-0" />
                  <span><strong>Scrollable Tables:</strong> Sticky headers with backdrop blur and smooth horizontal overflow panning</span>
                </li>
              </ul>
            </div>

            {/* Mobile Tier Card */}
            <div className={`p-4 rounded-2xl border transition-all ${deviceTier === 'mobile' ? 'bg-blue-50/40 border-blue-300 ring-2 ring-blue-500/20' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Mobile Native Design</h4>
                    <span className="text-[10px] text-slate-500">Under 768px screens</span>
                  </div>
                </div>
                <Badge variant="purple" size="sm">Touch-First</Badge>
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 mt-0.5 shrink-0" />
                  <span><strong>Hamburger & Bottom Dock:</strong> Top header hamburger drawer + fixed bottom thumb dock with (+) Quick Action FAB</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 mt-0.5 shrink-0" />
                  <span><strong>Stacked Cards:</strong> 1-column vertically stacked contact, company, and deal cards</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 mt-0.5 shrink-0" />
                  <span><strong>Responsive Kanban:</strong> Mobile stage switcher tabs allowing single-column focus without awkward horizontal panning</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 mt-0.5 shrink-0" />
                  <span><strong>Bottom-Sheet Forms:</strong> Dialogs attach as native bottom sheets with drag handles and sticky thumb actions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 mt-0.5 shrink-0" />
                  <span><strong>Mobile Calendar:</strong> Compact day-dots grid with instant Selected Day Agenda list below</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ─────────────────────────────────────────────────────────────
          MODAL PREVIEWS
          ───────────────────────────────────────────────────────────── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Sample Modal Dialog"
        description="Centered accessible modal dialog with backdrop blur and responsive layout"
      >
        <div className="space-y-4 text-xs text-slate-600">
          <p>
            Modals support ESC key closing, background backdrop dismissal, custom widths, and standard header/body/footer divisions.
          </p>
          <Input label="Opportunity Name" placeholder="e.g. Website Redesign" />
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>Close</Button>
            <Button variant="primary" size="sm" onClick={() => setIsModalOpen(false)}>Save Changes</Button>
          </div>
        </div>
      </Modal>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Sample Slide-Over Drawer"
        subtitle="Smooth right-aligned drawer for deep record inspections"
      >
        <div className="p-6 space-y-4 text-xs text-slate-600">
          <p>
            Drawers are optimal for detailed lead records, deal timelines, contact profiles, and activity logs without page reloads.
          </p>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <h4 className="font-bold text-slate-900">Drawer Content Body</h4>
            <p className="text-2xs text-slate-500">Supports scrollable overflowing sections and custom action buttons.</p>
          </div>
          <Button variant="primary" size="sm" onClick={() => setIsDrawerOpen(false)}>
            Close Drawer
          </Button>
        </div>
      </Drawer>

      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          setIsConfirmOpen(false);
          showToast('Confirmed', 'Delete action executed safely.', 'success');
        }}
        title="Delete Opportunity?"
        message="Are you sure you want to permanently delete this deal record? This action cannot be undone."
        confirmText="Delete Record"
        variant="danger"
      />
    </div>
  );
};

