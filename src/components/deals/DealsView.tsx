import React, { useState, useMemo } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Deal, DealStage, DealStatus } from '../../types';
import { KanbanBoard } from './KanbanBoard';
import { formatCurrency, formatDate, exportToCSV, getAvatarColor } from '../../utils/formatters';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { EmptyState } from '../common/EmptyState';
import {
  Kanban,
  Table as TableIcon,
  Search,
  Download,
  Plus,
  Filter,
  DollarSign,
  TrendingUp,
  MoreVertical,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Building2,
  User,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  Edit2
} from 'lucide-react';

interface DealsViewProps {
  onSelectDeal: (deal: Deal) => void;
  onOpenNewDeal: () => void;
  onOpenNewDealWithStage: (stage: DealStage) => void;
  onEditDeal: (deal: Deal) => void;
}

type SortField = 'title' | 'company' | 'contact' | 'value' | 'stage' | 'probability' | 'owner' | 'expectedCloseDate' | 'status';
type SortDirection = 'asc' | 'desc';

export const DealsView: React.FC<DealsViewProps> = ({
  onSelectDeal,
  onOpenNewDeal,
  onOpenNewDealWithStage,
  onEditDeal
}) => {
  const { deals, pipelineStages, updateDealStage, deleteDeal, availableUsers, confirmAction } = useCRM();

  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [ownerFilter, setOwnerFilter] = useState<string>('all');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Sorting State
  const [sortField, setSortField] = useState<SortField>('expectedCloseDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Pagination State for Table View
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter deals
  const filteredDeals = useMemo(() => {
    return deals.filter(deal => {
      // Stage filter
      if (stageFilter !== 'all' && deal.stage !== stageFilter) return false;

      // Status filter
      const dealStatus = deal.status || (deal.stage === 'won' ? 'won' : deal.stage === 'lost' ? 'lost' : 'open');
      if (statusFilter !== 'all' && dealStatus !== statusFilter) return false;

      // Priority filter
      if (priorityFilter !== 'all' && deal.priority !== priorityFilter) return false;

      // Owner filter
      if (ownerFilter !== 'all' && deal.owner.id !== ownerFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = deal.title.toLowerCase().includes(q);
        const matchCompany = deal.companyName.toLowerCase().includes(q);
        const matchContact = (deal.contactName || '').toLowerCase().includes(q);
        const matchOwner = deal.owner.name.toLowerCase().includes(q);
        const matchTags = deal.tags.some(t => t.toLowerCase().includes(q));
        return matchTitle || matchCompany || matchContact || matchOwner || matchTags;
      }

      return true;
    });
  }, [deals, stageFilter, statusFilter, priorityFilter, ownerFilter, searchQuery]);

  // Sort deals
  const sortedDeals = useMemo(() => {
    return [...filteredDeals].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'company':
          comparison = a.companyName.localeCompare(b.companyName);
          break;
        case 'contact':
          comparison = (a.contactName || '').localeCompare(b.contactName || '');
          break;
        case 'value':
          comparison = a.value - b.value;
          break;
        case 'stage':
          comparison = a.stage.localeCompare(b.stage);
          break;
        case 'probability':
          comparison = a.probability - b.probability;
          break;
        case 'owner':
          comparison = a.owner.name.localeCompare(b.owner.name);
          break;
        case 'expectedCloseDate':
          comparison = new Date(a.expectedCloseDate).getTime() - new Date(b.expectedCloseDate).getTime();
          break;
        case 'status': {
          const statusA = a.status || (a.stage === 'won' ? 'won' : a.stage === 'lost' ? 'lost' : 'open');
          const statusB = b.status || (b.stage === 'won' ? 'won' : b.stage === 'lost' ? 'lost' : 'open');
          comparison = statusA.localeCompare(statusB);
          break;
        }
        default:
          comparison = 0;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredDeals, sortField, sortDirection]);

  // Pagination for table
  const totalPages = Math.ceil(sortedDeals.length / pageSize) || 1;
  const paginatedDeals = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedDeals.slice(start, start + pageSize);
  }, [sortedDeals, currentPage, pageSize]);

  // Header Metrics Calculations
  const activeDeals = deals.filter(d => d.stage !== 'lost');
  const totalActivePipeline = activeDeals.reduce((sum, d) => sum + d.value, 0);
  const weightedPipeline = activeDeals.reduce((sum, d) => sum + Math.round(d.value * (d.probability / 100)), 0);
  const wonDealsCount = deals.filter(d => d.stage === 'won').length;
  const closedTotalCount = deals.filter(d => d.stage === 'won' || d.stage === 'lost').length;
  const winRate = closedTotalCount > 0 ? ((wonDealsCount / closedTotalCount) * 100).toFixed(1) : '0.0';
  const averageDealSize = activeDeals.length > 0 ? Math.round(totalActivePipeline / activeDeals.length) : 0;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleExportCSV = () => {
    const dataToExport = sortedDeals.map(d => {
      const dealStatus = d.status || (d.stage === 'won' ? 'won' : d.stage === 'lost' ? 'lost' : 'open');
      return {
        'Deal Title': d.title,
        'Company': d.companyName,
        'Contact Person': d.contactName || 'Unassigned',
        'Deal Value': d.value,
        'Pipeline Stage': pipelineStages.find(s => s.key === d.stage)?.label || d.stage,
        'Win Probability': `${d.probability}%`,
        'Expected Close Date': d.expectedCloseDate,
        'Assigned Salesperson': d.owner.name,
        'Deal Status': dealStatus.toUpperCase(),
        'Priority': d.priority.toUpperCase(),
        'Created Date': formatDate(d.createdAt)
      };
    });
    exportToCSV(dataToExport, `deals_pipeline_${new Date().toISOString().split('T')[0]}`);
  };

  const getStatusBadge = (deal: Deal) => {
    const status: DealStatus = deal.status || (deal.stage === 'won' ? 'won' : deal.stage === 'lost' ? 'lost' : 'open');
    if (status === 'won') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Won
        </span>
      );
    }
    if (status === 'lost') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
          <XCircle className="w-3 h-3 text-slate-500" />
          Lost
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
        <Clock className="w-3 h-3 text-blue-500" />
        Open
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* 1. Header with Title & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Sales Pipeline</h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {filteredDeals.length} deals • {formatCurrency(totalActivePipeline, true)} Total
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Track, manage, and close deals across your sales stages
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle: Kanban vs Table */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'kanban'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            icon={<Download className="w-3.5 h-3.5" />}
            onClick={handleExportCSV}
          >
            Export
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={onOpenNewDeal}
          >
            Add Deal
          </Button>
        </div>
      </div>

      {/* 2. Pipeline Summary Statistics Cards (HubSpot/Linear style) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Pipeline Value
          </span>
          <span className="text-base sm:text-lg font-extrabold text-slate-900 mt-0.5 block">
            {formatCurrency(totalActivePipeline, true)}
          </span>
          {totalActivePipeline > 0 ? (
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
              <TrendingUp className="w-3 h-3" /> +18.4% vs last mo
            </span>
          ) : (
            <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
              No active pipeline
            </span>
          )}
        </div>

        <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Weighted Value
          </span>
          <span className="text-base sm:text-lg font-extrabold text-blue-600 mt-0.5 block">
            {formatCurrency(weightedPipeline, true)}
          </span>
          <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">
            Probability weighted ARR
          </span>
        </div>

        <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Active Deals
          </span>
          <span className="text-base sm:text-lg font-extrabold text-slate-900 mt-0.5 block">
            {activeDeals.length}
          </span>
          <span className="text-[10px] text-blue-600 font-semibold mt-0.5 block">
            In active stages
          </span>
        </div>

        <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Win Rate
          </span>
          <span className="text-base sm:text-lg font-extrabold text-emerald-600 mt-0.5 block">
            {winRate}%
          </span>
          <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">
            Closed deals ratio
          </span>
        </div>

        <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-2xs col-span-2 sm:col-span-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Avg. Deal Size
          </span>
          <span className="text-base sm:text-lg font-extrabold text-slate-900 mt-0.5 block">
            {formatCurrency(averageDealSize, true)}
          </span>
          <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">
            Per qualified deal
          </span>
        </div>
      </div>

      {/* 3. Filter and Live Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search deal, company, contact or owner..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          {/* Stage Filter */}
          <select
            value={stageFilter}
            onChange={e => {
              setStageFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium"
          >
            <option value="all">All Stages</option>
            {pipelineStages.map(s => (
              <option key={s.key} value={s.key}>
                {s.label} ({s.probability}%)
              </option>
            ))}
          </select>

          {/* Status Filter: Open / Won / Lost */}
          <select
            value={statusFilter}
            onChange={e => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open Deals</option>
            <option value="won">Won Deals</option>
            <option value="lost">Lost Deals</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={e => {
              setPriorityFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          {/* Owner Filter */}
          <select
            value={ownerFilter}
            onChange={e => {
              setOwnerFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium"
          >
            <option value="all">All Salespeople</option>
            {availableUsers.map(u => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. Main Body: Kanban View vs Table View */}
      {viewMode === 'kanban' ? (
        <KanbanBoard
          deals={sortedDeals}
          onSelectDeal={onSelectDeal}
          onEditDeal={onEditDeal}
          onDeleteDeal={deal => {
            confirmAction({
              title: 'Delete Deal',
              message: `Are you sure you want to delete deal "${deal.title}"? Associated timeline events will be archived.`,
              confirmText: 'Delete Deal',
              variant: 'danger',
              onConfirm: () => deleteDeal(deal.id)
            });
          }}
          onOpenNewDealWithStage={onOpenNewDealWithStage}
        />
      ) : (
        /* Table View with exact required 9 columns: Deal, Company, Contact, Value, Stage, Probability, Owner, Expected Close, Status */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {sortedDeals.length === 0 ? (
            <EmptyState
              icon={<TableIcon className="w-6 h-6" />}
              title="No deals found"
              description="No deals match your search and filter criteria."
              actionLabel="+ Create Opportunity"
              onAction={onOpenNewDeal}
            />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="sticky top-0 bg-slate-50/95 backdrop-blur-xs z-10 border-b border-slate-200/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                      {/* 1. Deal */}
                      <th
                        onClick={() => handleSort('title')}
                        className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition-colors select-none"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Deal</span>
                          {sortField === 'title' ? (
                            sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-blue-600" /> : <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
                          ) : (
                            <ArrowUpDown className="w-3.5 h-3.5 text-slate-300" />
                          )}
                        </div>
                      </th>

                      {/* 2. Company */}
                      <th
                        onClick={() => handleSort('company')}
                        className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition-colors select-none"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Company</span>
                          {sortField === 'company' ? (
                            sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-blue-600" /> : <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
                          ) : (
                            <ArrowUpDown className="w-3.5 h-3.5 text-slate-300" />
                          )}
                        </div>
                      </th>

                      {/* 3. Contact */}
                      <th
                        onClick={() => handleSort('contact')}
                        className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition-colors select-none hidden sm:table-cell"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Contact</span>
                          {sortField === 'contact' ? (
                            sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-blue-600" /> : <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
                          ) : (
                            <ArrowUpDown className="w-3.5 h-3.5 text-slate-300" />
                          )}
                        </div>
                      </th>

                      {/* 4. Value */}
                      <th
                        onClick={() => handleSort('value')}
                        className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition-colors select-none"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Value</span>
                          {sortField === 'value' ? (
                            sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-blue-600" /> : <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
                          ) : (
                            <ArrowUpDown className="w-3.5 h-3.5 text-slate-300" />
                          )}
                        </div>
                      </th>

                      {/* 5. Stage */}
                      <th
                        onClick={() => handleSort('stage')}
                        className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition-colors select-none"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Stage</span>
                          {sortField === 'stage' ? (
                            sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-blue-600" /> : <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
                          ) : (
                            <ArrowUpDown className="w-3.5 h-3.5 text-slate-300" />
                          )}
                        </div>
                      </th>

                      {/* 6. Probability */}
                      <th
                        onClick={() => handleSort('probability')}
                        className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition-colors select-none hidden md:table-cell"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Probability</span>
                          {sortField === 'probability' ? (
                            sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-blue-600" /> : <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
                          ) : (
                            <ArrowUpDown className="w-3.5 h-3.5 text-slate-300" />
                          )}
                        </div>
                      </th>

                      {/* 7. Owner */}
                      <th
                        onClick={() => handleSort('owner')}
                        className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition-colors select-none hidden md:table-cell"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Owner</span>
                          {sortField === 'owner' ? (
                            sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-blue-600" /> : <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
                          ) : (
                            <ArrowUpDown className="w-3.5 h-3.5 text-slate-300" />
                          )}
                        </div>
                      </th>

                      {/* 8. Expected Close */}
                      <th
                        onClick={() => handleSort('expectedCloseDate')}
                        className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition-colors select-none hidden lg:table-cell"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Expected Close</span>
                          {sortField === 'expectedCloseDate' ? (
                            sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-blue-600" /> : <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
                          ) : (
                            <ArrowUpDown className="w-3.5 h-3.5 text-slate-300" />
                          )}
                        </div>
                      </th>

                      {/* 9. Status */}
                      <th
                        onClick={() => handleSort('status')}
                        className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition-colors select-none hidden xl:table-cell"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Status</span>
                          {sortField === 'status' ? (
                            sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-blue-600" /> : <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
                          ) : (
                            <ArrowUpDown className="w-3.5 h-3.5 text-slate-300" />
                          )}
                        </div>
                      </th>

                      {/* Actions */}
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedDeals.map(deal => {
                      const stageConfig = pipelineStages.find(s => s.key === deal.stage);
                      const isPastClose = new Date(deal.expectedCloseDate) < new Date() && deal.stage !== 'won' && deal.stage !== 'lost';

                      return (
                        <tr
                          key={deal.id}
                          onClick={() => onSelectDeal(deal)}
                          className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                        >
                          {/* 1. Deal */}
                          <td className="py-3.5 px-4">
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-900 hover:text-blue-600 transition-colors">
                                {deal.title}
                              </span>
                              <div className="flex items-center gap-1.5 mt-1">
                                <Badge
                                  variant={deal.priority === 'high' ? 'rose' : deal.priority === 'medium' ? 'amber' : 'slate'}
                                  size="sm"
                                >
                                  {deal.priority}
                                </Badge>
                                {deal.tags?.[0] && (
                                  <span className="text-[10px] text-slate-400 font-medium">
                                    #{deal.tags[0]}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* 2. Company */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                              <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate max-w-[150px]">{deal.companyName}</span>
                            </div>
                          </td>

                          {/* 3. Contact */}
                          <td className="py-3.5 px-4 hidden sm:table-cell">
                            <div className="flex items-center gap-1.5">
                              <div className={`flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold shrink-0 ${getAvatarColor(deal.contactName || deal.companyName)}`}>
                                {(deal.contactName || 'U')[0]}
                              </div>
                              <span className="text-slate-700 font-medium truncate max-w-[130px]">
                                {deal.contactName || 'Unassigned'}
                              </span>
                            </div>
                          </td>

                          {/* 4. Value */}
                          <td className="py-3.5 px-4">
                            <span className="font-extrabold text-slate-900 text-sm tracking-tight">
                              {formatCurrency(deal.value)}
                            </span>
                          </td>

                          {/* 5. Stage */}
                          <td className="py-3.5 px-4" onClick={e => e.stopPropagation()}>
                            <select
                              value={deal.stage}
                              onChange={e => updateDealStage(deal.id, e.target.value as DealStage)}
                              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-800 font-semibold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                            >
                              {pipelineStages.map(s => (
                                <option key={s.key} value={s.key}>
                                  {s.label}
                                </option>
                              ))}
                            </select>
                          </td>

                          {/* 6. Probability */}
                          <td className="py-3.5 px-4 hidden md:table-cell">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-700 text-xs w-8">
                                {deal.probability}%
                              </span>
                              <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    deal.stage === 'won'
                                      ? 'bg-emerald-500'
                                      : deal.stage === 'lost'
                                      ? 'bg-slate-400'
                                      : 'bg-blue-600'
                                  }`}
                                  style={{ width: `${deal.probability}%` }}
                                />
                              </div>
                            </div>
                          </td>

                          {/* 7. Owner */}
                          <td className="py-3.5 px-4 hidden md:table-cell">
                            <div className="flex items-center gap-1.5">
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold shrink-0">
                                {deal.owner.initials}
                              </span>
                              <span className="text-slate-700 text-xs font-medium truncate max-w-[120px]">
                                {deal.owner.name}
                              </span>
                            </div>
                          </td>

                          {/* 8. Expected Close */}
                          <td className="py-3.5 px-4 hidden lg:table-cell">
                            <div className="flex items-center gap-1 text-slate-600 text-xs">
                              <Calendar className={`w-3.5 h-3.5 ${isPastClose ? 'text-rose-500' : 'text-slate-400'}`} />
                              <span className={isPastClose ? 'text-rose-600 font-semibold' : ''}>
                                {formatDate(deal.expectedCloseDate)}
                              </span>
                            </div>
                          </td>

                          {/* 9. Status */}
                          <td className="py-3.5 px-4 hidden xl:table-cell">
                            {getStatusBadge(deal)}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => onSelectDeal(deal)}
                                className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="View Deal Details"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onEditDeal(deal)}
                                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                                title="Edit Deal"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  confirmAction({
                                    title: 'Delete Deal',
                                    message: `Are you sure you want to delete deal "${deal.title}"? Associated timeline events will be archived.`,
                                    confirmText: 'Delete Deal',
                                    variant: 'danger',
                                    onConfirm: () => deleteDeal(deal.id)
                                  });
                                }}
                                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Delete Deal"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between p-3.5 border-t border-slate-200/80 gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span>Show</span>
                  <select
                    value={pageSize}
                    onChange={e => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="border border-slate-200 rounded-lg px-2 py-1 bg-slate-50 font-medium"
                  >
                    <option value={10}>10 rows</option>
                    <option value={25}>25 rows</option>
                    <option value={50}>50 rows</option>
                  </select>
                  <span>
                    Showing {Math.min((currentPage - 1) * pageSize + 1, sortedDeals.length)} -{' '}
                    {Math.min(currentPage * pageSize, sortedDeals.length)} of {sortedDeals.length} deals
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-2.5 py-1.5 border border-slate-200 rounded-lg font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>
                  <span className="px-2 font-bold text-slate-800">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-2.5 py-1.5 border border-slate-200 rounded-lg font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
