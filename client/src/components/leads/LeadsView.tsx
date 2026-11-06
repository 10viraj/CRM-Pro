import React, { useState, useMemo } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Lead, LeadSource, LeadStatus } from '../../types';
import { formatDate, exportToCSV, getAvatarColor } from '../../utils/formatters';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { EmptyState } from '../common/EmptyState';
import {
  Search,
  Download,
  Upload,
  Plus,
  Filter,
  ArrowRightCircle,
  MoreVertical,
  Trash2,
  Mail,
  Phone,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Check,
  FileSpreadsheet,
  X,
  SlidersHorizontal,
  Flame,
  Building,
  Calendar,
  Users
} from 'lucide-react';

interface LeadsViewProps {
  onSelectLead: (lead: Lead) => void;
  onOpenNewLead: () => void;
  onEditLead: (lead: Lead) => void;
}

type SortField = 'name' | 'company' | 'source' | 'status' | 'score' | 'createdAt' | 'owner';
type SortOrder = 'asc' | 'desc';

export const LeadsView: React.FC<LeadsViewProps> = ({
  onSelectLead,
  onOpenNewLead,
  onEditLead
}) => {
  const { leads, addLead, convertLead, deleteLead, updateLead, availableUsers, showToast, confirmAction } = useCRM();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [ownerFilter, setOwnerFilter] = useState<string>('all');
  const [minScoreFilter, setMinScoreFilter] = useState<number>(0);

  // Sorting State
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Bulk Selection State
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);

  // Import Modal State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importFileContent, setImportFileContent] = useState<string | null>(null);

  // Status Badge Colors & Labels
  const statusConfig: Record<LeadStatus, { label: string; variant: 'blue' | 'purple' | 'emerald' | 'amber' | 'cyan' | 'slate' | 'rose' }> = {
    new: { label: 'New', variant: 'blue' },
    contacted: { label: 'Contacted', variant: 'purple' },
    qualified: { label: 'Qualified', variant: 'emerald' },
    proposal: { label: 'Proposal', variant: 'amber' },
    converted: { label: 'Converted', variant: 'cyan' },
    lost: { label: 'Lost', variant: 'slate' }
  };

  // Toggle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Filtered & Sorted Leads
  const filteredAndSortedLeads = useMemo(() => {
    return leads
      .filter(lead => {
        // Status filter
        if (statusFilter !== 'all' && lead.status !== statusFilter) return false;
        // Source filter
        if (sourceFilter !== 'all' && lead.source !== sourceFilter) return false;
        // Owner filter
        if (ownerFilter !== 'all' && lead.owner.id !== ownerFilter) return false;
        // Min Score filter
        if (minScoreFilter > 0 && lead.score < minScoreFilter) return false;

        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = lead.name.toLowerCase().includes(q);
          const matchCompany = lead.company.toLowerCase().includes(q);
          const matchEmail = lead.email.toLowerCase().includes(q);
          const matchPhone = lead.phone.toLowerCase().includes(q);
          const matchSource = lead.source.toLowerCase().includes(q);
          const matchOwner = lead.owner.name.toLowerCase().includes(q);
          return matchName || matchCompany || matchEmail || matchPhone || matchSource || matchOwner;
        }
        return true;
      })
      .sort((a, b) => {
        let valA: any = a[sortField as keyof Lead];
        let valB: any = b[sortField as keyof Lead];

        if (sortField === 'owner') {
          valA = a.owner.name;
          valB = b.owner.name;
        }

        if (typeof valA === 'string') {
          return sortOrder === 'asc'
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        }

        return sortOrder === 'asc' ? valA - valB : valB - valA;
      });
  }, [leads, searchQuery, statusFilter, sourceFilter, ownerFilter, minScoreFilter, sortField, sortOrder]);

  // Pagination calculation
  const totalLeads = filteredAndSortedLeads.length;
  const totalPages = Math.ceil(totalLeads / pageSize) || 1;
  const paginatedLeads = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedLeads.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedLeads, currentPage, pageSize]);

  // Bulk Selection Handlers
  const handleSelectAllOnPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const pageIds = paginatedLeads.map(l => l.id);
      setSelectedLeadIds(prev => Array.from(new Set([...prev, ...pageIds])));
    } else {
      const pageIds = paginatedLeads.map(l => l.id);
      setSelectedLeadIds(prev => prev.filter(id => !pageIds.includes(id)));
    }
  };

  const handleToggleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedLeadIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Bulk Actions
  const handleBulkStatusChange = (newStatus: LeadStatus) => {
    selectedLeadIds.forEach(id => updateLead(id, { status: newStatus }));
    showToast('Bulk Status Updated', `Updated ${selectedLeadIds.length} leads to ${statusConfig[newStatus].label}`, 'success');
    setSelectedLeadIds([]);
  };

  const handleBulkReassignOwner = (ownerId: string) => {
    const newOwner = availableUsers.find(u => u.id === ownerId);
    if (!newOwner) return;
    selectedLeadIds.forEach(id => updateLead(id, { owner: newOwner }));
    showToast('Bulk Owner Reassigned', `Assigned ${selectedLeadIds.length} leads to ${newOwner.name}`, 'success');
    setSelectedLeadIds([]);
  };

  const handleBulkDelete = () => {
    confirmAction({
      title: 'Delete Selected Leads',
      message: `Are you sure you want to permanently delete ${selectedLeadIds.length} selected leads? This action cannot be undone.`,
      confirmText: `Delete ${selectedLeadIds.length} Leads`,
      variant: 'danger',
      onConfirm: () => {
        selectedLeadIds.forEach(id => deleteLead(id));
        setSelectedLeadIds([]);
      }
    });
  };

  const handleExportSelected = () => {
    const leadsToExport = leads.filter(l => selectedLeadIds.includes(l.id));
    const dataToExport = leadsToExport.map(l => ({
      Lead: l.name,
      Company: l.company,
      Title: l.title,
      Email: l.email,
      Phone: l.phone,
      Source: l.source,
      Status: statusConfig[l.status]?.label || l.status,
      Owner: l.owner.name,
      Created: formatDate(l.createdAt)
    }));
    exportToCSV(dataToExport, `leads_selected_export_${new Date().toISOString().split('T')[0]}`);
  };

  const handleExportAll = () => {
    const dataToExport = filteredAndSortedLeads.map(l => ({
      Lead: l.name,
      Company: l.company,
      Title: l.title,
      Email: l.email,
      Phone: l.phone,
      Source: l.source,
      Status: statusConfig[l.status]?.label || l.status,
      Owner: l.owner.name,
      Created: formatDate(l.createdAt)
    }));
    exportToCSV(dataToExport, `leads_export_${new Date().toISOString().split('T')[0]}`);
  };

  // Import Leads Simulation
  const handleImportSampleData = () => {
    const sampleImportBatch: Omit<Lead, 'id' | 'createdAt' | 'notes'>[] = [
      {
        name: 'Amitabh Sen',
        company: 'Starlight Media Group',
        title: 'VP of Technology',
        email: 'amitabh@starlightmedia.com',
        phone: '+91 98210 44556',
        status: 'qualified',
        score: 87,
        source: 'Website',
        estimatedValue: 75000,
        owner: availableUsers[0],
        tags: ['Imported', 'Media']
      },
      {
        name: 'Jessica Vance',
        company: 'Quantum Dynamics Inc',
        title: 'Head of Infrastructure',
        email: 'jvance@quantumdyn.io',
        phone: '+1 (415) 880-9912',
        status: 'new',
        score: 79,
        source: 'Product Signup',
        estimatedValue: 60000,
        owner: availableUsers[1],
        tags: ['Imported', 'Cloud']
      }
    ];

    sampleImportBatch.forEach(leadData => addLead(leadData));
    setIsImportModalOpen(false);
    showToast('Import Complete', 'Successfully imported 2 leads into your pipeline.', 'success');
  };

  const isAllCurrentPageSelected =
    paginatedLeads.length > 0 && paginatedLeads.every(l => selectedLeadIds.includes(l.id));

  const hasActiveFilters =
    statusFilter !== 'all' || sourceFilter !== 'all' || ownerFilter !== 'all' || minScoreFilter > 0;

  const resetFilters = () => {
    setStatusFilter('all');
    setSourceFilter('all');
    setOwnerFilter('all');
    setMinScoreFilter(0);
    setSearchQuery('');
  };

  return (
    <div className="space-y-4">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER & TOP ACTIONS
          Header: Leads
          Subtitle: "Manage and track your potential customers."
          Actions: Import, Export, Filter, Add Lead
          ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Leads</h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
              {totalLeads} prospects
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage and track your potential customers.
          </p>
        </div>

        {/* Top Actions: Import, Export, Filter, Add Lead */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Import */}
          <Button
            variant="outline"
            size="sm"
            icon={<Upload className="w-3.5 h-3.5 text-slate-500" />}
            onClick={() => setIsImportModalOpen(true)}
          >
            Import
          </Button>

          {/* Export */}
          <Button
            variant="outline"
            size="sm"
            icon={<Download className="w-3.5 h-3.5 text-slate-500" />}
            onClick={handleExportAll}
          >
            Export
          </Button>

          {/* Filter Toggle */}
          <Button
            variant={isFilterPanelOpen || hasActiveFilters ? 'secondary' : 'outline'}
            size="sm"
            icon={<SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />}
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
          >
            <span>Filter</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-blue-600 ml-1" />
            )}
          </Button>

          {/* Add Lead */}
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={onOpenNewLead}
            className="shadow-xs font-semibold px-3.5"
          >
            Add Lead
          </Button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. SEARCH & ADVANCED FILTERS PANEL
          ───────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-3 shadow-xs space-y-3">
        {/* Main Search Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search leads by name, company, email..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs">
            {/* Quick Status Dropdown */}
            <select
              value={statusFilter}
              onChange={e => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 font-medium focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="proposal">Proposal</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-blue-600 hover:underline font-semibold text-xs ml-1"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Collapsible Advanced Filters Drawer */}
        {isFilterPanelOpen && (
          <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs animate-fade-in">
            {/* Source Filter */}
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Lead Source</label>
              <select
                value={sourceFilter}
                onChange={e => {
                  setSourceFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700"
              >
                <option value="all">All Sources</option>
                <option value="Website">Website</option>
                <option value="Inbound Demo">Inbound Demo</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Referral">Referral</option>
                <option value="Cold Outbound">Cold Outbound</option>
                <option value="Product Signup">Product Signup</option>
                <option value="Event">Event</option>
              </select>
            </div>

            {/* Owner Filter */}
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Assigned Owner</label>
              <select
                value={ownerFilter}
                onChange={e => {
                  setOwnerFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700"
              >
                <option value="all">All Owners</option>
                {availableUsers.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Min AI Score */}
            <div>
              <label className="block text-slate-500 font-semibold mb-1">
                Min AI Score: {minScoreFilter > 0 ? `${minScoreFilter}+` : 'Any'}
              </label>
              <input
                type="range"
                min="0"
                max="95"
                step="5"
                value={minScoreFilter}
                onChange={e => {
                  setMinScoreFilter(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="w-full accent-blue-600"
              />
            </div>

            {/* Rows Per Page */}
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Rows Per Page</label>
              <select
                value={pageSize}
                onChange={e => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700"
              >
                <option value={5}>5 leads per page</option>
                <option value={10}>10 leads per page</option>
                <option value={25}>25 leads per page</option>
                <option value={50}>50 leads per page</option>
              </select>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            BULK ACTIONS BANNER (when rows are selected)
            ───────────────────────────────────────────────────────────── */}
        {selectedLeadIds.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-blue-50/90 border border-blue-200 rounded-xl text-xs text-blue-900 animate-fade-in shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="font-bold">
                {selectedLeadIds.length} lead{selectedLeadIds.length > 1 ? 's' : ''} selected
              </span>
              <button
                onClick={() => setSelectedLeadIds([])}
                className="text-blue-600 hover:underline font-semibold"
              >
                (Clear selection)
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Bulk Status */}
              <select
                onChange={e => {
                  if (e.target.value) handleBulkStatusChange(e.target.value as LeadStatus);
                }}
                defaultValue=""
                className="bg-white border border-blue-300 rounded-lg px-2.5 py-1 text-slate-800 font-medium"
              >
                <option value="" disabled>Change Status...</option>
                <option value="new">Set to New</option>
                <option value="contacted">Set to Contacted</option>
                <option value="qualified">Set to Qualified</option>
                <option value="proposal">Set to Proposal</option>
                <option value="converted">Set to Converted</option>
                <option value="lost">Set to Lost</option>
              </select>

              {/* Bulk Assign */}
              <select
                onChange={e => {
                  if (e.target.value) handleBulkReassignOwner(e.target.value);
                }}
                defaultValue=""
                className="bg-white border border-blue-300 rounded-lg px-2.5 py-1 text-slate-800 font-medium"
              >
                <option value="" disabled>Assign Owner...</option>
                {availableUsers.map(u => (
                  <option key={u.id} value={u.id}>
                    Assign to {u.name}
                  </option>
                ))}
              </select>

              {/* Export Selected */}
              <button
                onClick={handleExportSelected}
                className="px-2.5 py-1 bg-white border border-blue-200 rounded-lg font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
              >
                Export Selected
              </button>

              {/* Bulk Delete */}
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-semibold px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. LEADS TABLE (9 COLUMNS)
          Columns: Lead | Company | Email | Phone | Source | Status | Owner | Created | Actions
          ───────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {filteredAndSortedLeads.length === 0 ? (
          leads.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={<Users className="w-8 h-8 text-blue-500" />}
                title="No leads yet"
                description="Your lead pipeline is clean. Start capturing prospects by adding your first lead."
                actionLabel="+ Add First Lead"
                onAction={onOpenNewLead}
              />
            </div>
          ) : (
            <EmptyState
              icon={<Filter className="w-6 h-6" />}
              title="No leads match your criteria"
              description="Try modifying search keywords or resetting active filters."
              actionLabel="Reset Filters"
              onAction={resetFilters}
            />
          )
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="sticky top-0 bg-slate-50/95 backdrop-blur-xs z-10 border-b border-slate-200/90 text-slate-500 font-semibold uppercase tracking-wider text-[11px] select-none">
                  {/* Bulk Checkbox */}
                  <th className="py-3.5 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={isAllCurrentPageSelected}
                      onChange={handleSelectAllOnPage}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </th>

                  {/* 1. Lead */}
                  <th
                    className="py-3.5 px-4 cursor-pointer hover:text-slate-800 transition-colors"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Lead</span>
                      {sortField === 'name' ? (
                        sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-blue-600" /> : <ChevronDown className="w-3.5 h-3.5 text-blue-600" />
                      ) : (
                        <ChevronsUpDown className="w-3.5 h-3.5 text-slate-300" />
                      )}
                    </div>
                  </th>

                  {/* 2. Company */}
                  <th
                    className="py-3.5 px-4 cursor-pointer hover:text-slate-800 transition-colors"
                    onClick={() => handleSort('company')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Company</span>
                      {sortField === 'company' ? (
                        sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-blue-600" /> : <ChevronDown className="w-3.5 h-3.5 text-blue-600" />
                      ) : (
                        <ChevronsUpDown className="w-3.5 h-3.5 text-slate-300" />
                      )}
                    </div>
                  </th>

                  {/* 3. Email */}
                  <th className="py-3.5 px-4 hidden md:table-cell">Email</th>

                  {/* 4. Phone */}
                  <th className="py-3.5 px-4 hidden lg:table-cell">Phone</th>

                  {/* 5. Source */}
                  <th
                    className="py-3.5 px-4 cursor-pointer hover:text-slate-800 transition-colors hidden sm:table-cell"
                    onClick={() => handleSort('source')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Source</span>
                      {sortField === 'source' ? (
                        sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-blue-600" /> : <ChevronDown className="w-3.5 h-3.5 text-blue-600" />
                      ) : (
                        <ChevronsUpDown className="w-3.5 h-3.5 text-slate-300" />
                      )}
                    </div>
                  </th>

                  {/* 6. Status */}
                  <th
                    className="py-3.5 px-4 cursor-pointer hover:text-slate-800 transition-colors"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Status</span>
                      {sortField === 'status' ? (
                        sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-blue-600" /> : <ChevronDown className="w-3.5 h-3.5 text-blue-600" />
                      ) : (
                        <ChevronsUpDown className="w-3.5 h-3.5 text-slate-300" />
                      )}
                    </div>
                  </th>

                  {/* 7. Owner */}
                  <th
                    className="py-3.5 px-4 cursor-pointer hover:text-slate-800 transition-colors hidden md:table-cell"
                    onClick={() => handleSort('owner')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Owner</span>
                      {sortField === 'owner' ? (
                        sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-blue-600" /> : <ChevronDown className="w-3.5 h-3.5 text-blue-600" />
                      ) : (
                        <ChevronsUpDown className="w-3.5 h-3.5 text-slate-300" />
                      )}
                    </div>
                  </th>

                  {/* 8. Created */}
                  <th
                    className="py-3.5 px-4 cursor-pointer hover:text-slate-800 transition-colors hidden xl:table-cell"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Created</span>
                      {sortField === 'createdAt' ? (
                        sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-blue-600" /> : <ChevronDown className="w-3.5 h-3.5 text-blue-600" />
                      ) : (
                        <ChevronsUpDown className="w-3.5 h-3.5 text-slate-300" />
                      )}
                    </div>
                  </th>

                  {/* 9. Actions */}
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedLeads.map(lead => {
                  const isSelected = selectedLeadIds.includes(lead.id);
                  const statusInfo = statusConfig[lead.status] || { label: lead.status, variant: 'slate' };
                  const initials = lead.name.split(' ').map(w => w[0]).join('').slice(0, 2);

                  return (
                    <tr
                      key={lead.id}
                      onClick={() => onSelectLead(lead)}
                      className={`hover:bg-slate-50/80 cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-4" onClick={e => handleToggleSelectRow(lead.id, e)}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </td>

                      {/* 1. Lead (Avatar + Name + Title) */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-xl font-bold text-xs shrink-0 border ${getAvatarColor(lead.name)}`}>
                            {initials}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-blue-600 hover:text-blue-600 transition-colors">
                              {lead.name}
                            </div>
                            <div className="text-[11px] text-slate-500 truncate max-w-[150px]">
                              {lead.title || 'Prospect'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 2. Company */}
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {lead.company}
                      </td>

                      {/* 3. Email */}
                      <td className="py-3.5 px-4 text-slate-600 hidden md:table-cell" onClick={e => e.stopPropagation()}>
                        <a
                          href={`mailto:${lead.email}`}
                          className="hover:text-blue-600 hover:underline flex items-center gap-1.5"
                        >
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[140px]">{lead.email}</span>
                        </a>
                      </td>

                      {/* 4. Phone */}
                      <td className="py-3.5 px-4 text-slate-600 hidden lg:table-cell" onClick={e => e.stopPropagation()}>
                        {lead.phone ? (
                          <a
                            href={`tel:${lead.phone}`}
                            className="hover:text-blue-600 hover:underline flex items-center gap-1.5"
                          >
                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{lead.phone}</span>
                          </a>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      {/* 5. Source */}
                      <td className="py-3.5 px-4 text-slate-700 font-medium hidden sm:table-cell">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          {lead.source}
                        </span>
                      </td>

                      {/* 6. Status */}
                      <td className="py-3.5 px-4">
                        <Badge variant={statusInfo.variant} size="sm">
                          {statusInfo.label}
                        </Badge>
                      </td>

                      {/* 7. Owner */}
                      <td className="py-3.5 px-4 hidden md:table-cell">
                        <div className="flex items-center gap-1.5">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold shrink-0">
                            {lead.owner.initials}
                          </span>
                          <span className="text-slate-700 text-[11px] truncate max-w-[100px]">{lead.owner.name}</span>
                        </div>
                      </td>

                      {/* 8. Created */}
                      <td className="py-3.5 px-4 text-slate-500 text-[11px] whitespace-nowrap hidden xl:table-cell">
                        {formatDate(lead.createdAt)}
                      </td>

                      {/* 9. Actions */}
                      <td className="py-3.5 px-4 text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {lead.status !== 'converted' && (
                            <button
                              onClick={() => convertLead(lead.id, lead.estimatedValue)}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-lg transition-colors"
                              title="Convert to Contact & Deal"
                            >
                              <ArrowRightCircle className="w-3.5 h-3.5" />
                              <span className="hidden md:inline">Convert</span>
                            </button>
                          )}
                          <button
                            onClick={() => onEditLead(lead)}
                            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                            title="Edit"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            4. PAGINATION FOOTER
            Rows per page, count range, prev/next buttons & page numbers
            ───────────────────────────────────────────────────────────── */}
        {filteredAndSortedLeads.length > 0 && (
          <div className="px-4 py-3 bg-slate-50/70 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div>
              Showing <strong className="text-slate-800">{(currentPage - 1) * pageSize + 1}</strong> to{' '}
              <strong className="text-slate-800">
                {Math.min(currentPage * pageSize, totalLeads)}
              </strong>{' '}
              of <strong className="text-slate-800">{totalLeads}</strong> leads
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page Number Pills */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${
                      currentPage === p
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-200/60'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          IMPORT LEADS MODAL
          ───────────────────────────────────────────────────────────── */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Import Leads from CSV</h3>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Upload your CSV lead list or click below to import sample enterprise prospects directly. Supported columns: Lead, Company, Email, Phone, Source, Status, Owner.
            </p>

            <div className="p-6 border-2 border-dashed border-slate-200 rounded-xl text-center bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
              <Upload className="w-8 h-8 text-blue-600 mx-auto mb-2 opacity-80" />
              <p className="text-xs font-semibold text-slate-800">
                Drag and drop your .CSV file here
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">Maximum file size: 10MB</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  showToast('Template Downloaded', 'leads_import_template.csv saved.', 'info');
                }}
              >
                Download CSV Template
              </Button>

              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => setIsImportModalOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" variant="primary" onClick={handleImportSampleData}>
                  Import Sample Batch
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
