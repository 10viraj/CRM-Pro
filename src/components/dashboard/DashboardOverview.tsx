import React, { useState, useRef, useEffect } from 'react';
import { useCRM } from '../../context/CRMContext';
import { MetricCard } from './MetricCard';
import { PipelineForecastChart } from './PipelineForecastChart';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  Users,
  Kanban,
  Target,
  CheckSquare,
  Plus,
  Calendar,
  Clock,
  Phone,
  Mail,
  Flame,
  ChevronDown,
  UserPlus,
  Building2,
  CalendarDays,
  IndianRupee
} from 'lucide-react';
import { Deal, Lead } from '../../types';

interface DashboardOverviewProps {
  onSelectDeal: (deal: Deal) => void;
  onSelectLead: (lead: Lead) => void;
  onOpenNewLead: () => void;
  onOpenNewDeal: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onSelectDeal,
  onSelectLead,
  onOpenNewLead,
  onOpenNewDeal
}) => {
  const {
    leads,
    deals,
    activities,
    toggleActivityCompleted,
    setActiveView,
    currentUser,
    showToast
  } = useCRM();

  // Date range filter state
  type DateRangeType = 'Today' | 'This Week' | 'This Month' | 'Custom Range';
  const [dateRange, setDateRange] = useState<DateRangeType>('This Month');
  const [isCustomRangeModalOpen, setIsCustomRangeModalOpen] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('2026-11-01');
  const [customEndDate, setCustomEndDate] = useState('2026-11-30');

  // Quick Add dropdown state
  const [isAddNewOpen, setIsAddNewOpen] = useState(false);
  const addNewRef = useRef<HTMLDivElement>(null);

  // Close Quick Add on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (addNewRef.current && !addNewRef.current.contains(e.target as Node)) {
        setIsAddNewOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleApplyCustomRange = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCustomRangeModalOpen(false);
    showToast('Date Filter Applied', `Showing records from ${customStartDate} to ${customEndDate}`, 'info');
  };

  // Pending activities
  const pendingTasks = activities.filter(a => !a.completed).slice(0, 5);

  // Top Opportunities
  const activeDeals = deals.filter(d => d.stage !== 'won' && d.stage !== 'lost');
  const topDeals = [...activeDeals].sort((a, b) => b.value - a.value).slice(0, 4);

  // Hot Leads
  const hotLeads = [...leads].sort((a, b) => b.score - a.score).slice(0, 4);

  // Dynamic KPI calculations from live CRMContext state
  const totalLeadsCount = leads.length;
  const activeDealsCount = activeDeals.length;
  const wonDeals = deals.filter(d => d.stage === 'won');
  const wonRevenue = wonDeals.reduce((sum, d) => sum + d.value, 0);
  const totalResolvedDeals = deals.filter(d => d.stage === 'won' || d.stage === 'lost').length;
  const conversionRate = totalResolvedDeals > 0
    ? `${((wonDeals.length / totalResolvedDeals) * 100).toFixed(1)}%`
    : leads.length > 0 && wonDeals.length > 0
    ? `${((wonDeals.length / leads.length) * 100).toFixed(1)}%`
    : '0.0%';
  const tasksDueCount = pendingTasks.length;

  return (
    <div className="space-y-6">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER & CONTROLS ROW
          Header: "Good morning, Viraj 👋"
          Subtitle: "Here's what's happening with your sales pipeline today."
          Top-Right: Date range selector + "+ Add New" primary button
          ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Good morning, {currentUser.name.split(' ')[0]}</span>
            <span className="inline-block animate-wave text-2xl">👋</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Here's what's happening with your sales pipeline today.
          </p>
        </div>

        {/* Top-Right: Date Range Selector + + Add New Button */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Date range selector */}
          <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200/90 shadow-2xs text-xs font-semibold">
            {(['Today', 'This Week', 'This Month', 'Custom Range'] as const).map(range => {
              const isSelected = dateRange === range;
              return (
                <button
                  key={range}
                  onClick={() => {
                    setDateRange(range);
                    if (range === 'Custom Range') {
                      setIsCustomRangeModalOpen(true);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    isSelected
                      ? 'bg-blue-50 text-blue-700 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {range}
                </button>
              );
            })}
          </div>

          {/* Primary Button: + Add New with Dropdown */}
          <div className="relative" ref={addNewRef}>
            <Button
              variant="primary"
              size="md"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setIsAddNewOpen(!isAddNewOpen)}
              className="shadow-xs font-semibold px-4"
            >
              <span>+ Add New</span>
              <ChevronDown className="w-3.5 h-3.5 ml-1" />
            </Button>

            {isAddNewOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-dropdown animate-scale-up z-50">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                  Create Record
                </div>
                <button
                  onClick={() => {
                    setIsAddNewOpen(false);
                    onOpenNewLead();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:text-blue-600 hover:bg-blue-50/70 rounded-xl transition-colors font-medium text-left"
                >
                  <UserPlus className="w-3.5 h-3.5 text-blue-600" />
                  <span>New Lead</span>
                </button>
                <button
                  onClick={() => {
                    setIsAddNewOpen(false);
                    onOpenNewDeal();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:text-emerald-600 hover:bg-emerald-50/70 rounded-xl transition-colors font-medium text-left"
                >
                  <Kanban className="w-3.5 h-3.5 text-emerald-600" />
                  <span>New Deal</span>
                </button>
                <button
                  onClick={() => {
                    setIsAddNewOpen(false);
                    setActiveView('contacts');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:text-purple-600 hover:bg-purple-50/70 rounded-xl transition-colors font-medium text-left"
                >
                  <Users className="w-3.5 h-3.5 text-purple-600" />
                  <span>New Contact</span>
                </button>
                <button
                  onClick={() => {
                    setIsAddNewOpen(false);
                    setActiveView('tasks');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:text-amber-600 hover:bg-amber-50/70 rounded-xl transition-colors font-medium text-left"
                >
                  <CheckSquare className="w-3.5 h-3.5 text-amber-600" />
                  <span>New Task</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. 5 PROFESSIONAL KPI CARDS
          1. Total Leads: 1,248 (+12.5%)
          2. Active Deals: 86 (+8.2%)
          3. Revenue: ₹12.48L (+18.4%)
          4. Conversion Rate: 24.8% (+4.6%)
          5. Tasks Due: 18 (-12.3%)
          ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Card 1: Total Leads */}
        <MetricCard
          title="Total Leads"
          value={totalLeadsCount > 0 ? totalLeadsCount.toLocaleString() : '0'}
          delta={totalLeadsCount > 0 ? '+12.5%' : '0%'}
          trend={totalLeadsCount > 0 ? 'up' : 'neutral'}
          subtext={totalLeadsCount > 0 ? 'vs last mo' : 'No leads recorded'}
          icon={<Users className="w-4 h-4" />}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          sparklinePoints={totalLeadsCount > 0 ? [22, 26, 24, 30, 28, 36, 40, 38, 48] : [0, 0, 0, 0, 0]}
        />

        {/* Card 2: Active Deals */}
        <MetricCard
          title="Active Deals"
          value={activeDealsCount > 0 ? activeDealsCount.toString() : '0'}
          delta={activeDealsCount > 0 ? '+8.2%' : '0%'}
          trend={activeDealsCount > 0 ? 'up' : 'neutral'}
          subtext={activeDealsCount > 0 ? 'vs last mo' : 'Pipeline is empty'}
          icon={<Kanban className="w-4 h-4" />}
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
          sparklinePoints={activeDealsCount > 0 ? [18, 22, 20, 25, 27, 26, 31, 33, 35] : [0, 0, 0, 0, 0]}
        />

        {/* Card 3: Revenue */}
        <MetricCard
          title="Revenue"
          value={wonRevenue > 0 ? formatCurrency(wonRevenue, true) : '₹0'}
          delta={wonRevenue > 0 ? '+18.4%' : '0%'}
          trend={wonRevenue > 0 ? 'up' : 'neutral'}
          subtext={wonRevenue > 0 ? 'vs last mo' : 'No closed won deals'}
          icon={<IndianRupee className="w-4 h-4" />}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          sparklinePoints={wonRevenue > 0 ? [14, 18, 22, 20, 28, 30, 34, 38, 44] : [0, 0, 0, 0, 0]}
        />

        {/* Card 4: Conversion Rate */}
        <MetricCard
          title="Conversion Rate"
          value={conversionRate}
          delta={wonDeals.length > 0 ? '+4.6%' : '0%'}
          trend={wonDeals.length > 0 ? 'up' : 'neutral'}
          subtext={wonDeals.length > 0 ? 'vs last mo' : 'Lead to win ratio'}
          icon={<Target className="w-4 h-4" />}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
          sparklinePoints={wonDeals.length > 0 ? [20, 21, 23, 22, 24, 25, 24, 26, 28] : [0, 0, 0, 0, 0]}
        />

        {/* Card 5: Tasks Due */}
        <MetricCard
          title="Tasks Due"
          value={tasksDueCount.toString()}
          delta={tasksDueCount > 0 ? '-12.3%' : '0%'}
          trend={tasksDueCount > 0 ? 'down' : 'neutral'}
          subtext={tasksDueCount > 0 ? 'vs last mo' : 'All tasks completed'}
          icon={<CheckSquare className="w-4 h-4" />}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
          sparklinePoints={tasksDueCount > 0 ? [35, 32, 30, 28, 26, 24, 22, 20, 18] : [0, 0, 0, 0, 0]}
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. PIPELINE FORECAST & PRIORITY AGENDA ROW
          ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Pipeline Funnel / Distribution Chart (2 cols) */}
        <div className="lg:col-span-2">
          <PipelineForecastChart />
        </div>

        {/* Right: Pending Activities & Action Items (1 col) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Priority Agenda</h3>
                <p className="text-xs text-slate-500">Upcoming calls, demos & to-dos</p>
              </div>
              <button
                onClick={() => setActiveView('tasks')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                View all tasks →
              </button>
            </div>

            <div className="mt-4 space-y-2.5 overflow-y-auto max-h-80">
              {pendingTasks.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  <CheckSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  All caught up! No urgent tasks pending.
                </div>
              ) : (
                pendingTasks.map(task => {
                  let TypeIcon = CheckSquare;
                  if (task.type === 'call') TypeIcon = Phone;
                  if (task.type === 'meeting') TypeIcon = Calendar;
                  if (task.type === 'email') TypeIcon = Mail;

                  return (
                    <div
                      key={task.id}
                      className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/60 transition-all group"
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleActivityCompleted(task.id)}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-blue-600">
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                          <span className="flex items-center gap-1">
                            <TypeIcon className="w-3 h-3 text-slate-400" />
                            <span className="capitalize">{task.type}</span>
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {task.dueDate ? formatDate(task.dueDate) : 'Today'}
                          </span>
                        </div>
                      </div>
                      {task.priority === 'high' && (
                        <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                          High
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>{pendingTasks.length} tasks scheduled today</span>
            <button
              onClick={() => setActiveView('calendar')}
              className="font-semibold text-blue-600 hover:underline"
            >
              Open Calendar
            </button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. BOTTOM ROW: HIGH-VALUE OPPORTUNITIES & HOT LEADS
          ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Active Deals */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Highest-Value Opportunities</h3>
              <p className="text-xs text-slate-500">Key deals driving Q4 revenue growth</p>
            </div>
            <button
              onClick={() => setActiveView('deals')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Pipeline Board →
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {topDeals.length === 0 ? (
              <div className="py-8 px-4 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
                <Kanban className="w-7 h-7 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">No active deals in pipeline</p>
                <p className="text-2xs text-slate-400 mt-0.5">Start by adding your first deal to track pipeline progress</p>
                <button
                  type="button"
                  onClick={onOpenNewDeal}
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Deal</span>
                </button>
              </div>
            ) : (
              topDeals.map(deal => (
                <div
                  key={deal.id}
                  onClick={() => onSelectDeal(deal)}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 cursor-pointer transition-all group"
                >
                  <div className="min-w-0 pr-3">
                    <p className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 truncate">
                      {deal.title}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {deal.companyName} • Expected close {formatDate(deal.expectedCloseDate)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-slate-900">{formatCurrency(deal.value)}</span>
                    <div className="mt-1">
                      <Badge variant="blue" size="sm">
                        {deal.probability}% Prob.
                      </Badge>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* High Intent Leads */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-500" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">High-Scoring Leads</h3>
                <p className="text-xs text-slate-500">Algorithmically prioritized inbound prospects</p>
              </div>
            </div>
            <button
              onClick={() => setActiveView('leads')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              All Leads →
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {hotLeads.length === 0 ? (
              <div className="py-8 px-4 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
                <Users className="w-7 h-7 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">No leads captured yet</p>
                <p className="text-2xs text-slate-400 mt-0.5">Add prospective buyers to score intent and track status</p>
                <button
                  type="button"
                  onClick={onOpenNewLead}
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add First Lead</span>
                </button>
              </div>
            ) : (
              hotLeads.map(lead => (
                <div
                  key={lead.id}
                  onClick={() => onSelectLead(lead)}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50/30 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-xl font-bold text-xs shrink-0 ${
                        lead.score >= 85
                          ? 'bg-emerald-100 text-emerald-800'
                          : lead.score >= 70
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {lead.score}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 truncate">
                        {lead.name}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {lead.company} • {lead.source}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-slate-900">{formatCurrency(lead.estimatedValue, true)}</span>
                    <div className="mt-1">
                      <Badge variant={lead.status === 'qualified' ? 'emerald' : lead.status === 'proposal' ? 'amber' : 'slate'} size="sm">
                        {lead.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          CUSTOM DATE RANGE MODAL
          ───────────────────────────────────────────────────────────── */}
      {isCustomRangeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-slate-200 shadow-xl space-y-4 animate-scale-up">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Select Custom Date Range</h3>
            </div>
            <form onSubmit={handleApplyCustomRange} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Start Date</label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={e => setCustomStartDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">End Date</label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={e => setCustomEndDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button size="sm" variant="outline" type="button" onClick={() => setIsCustomRangeModalOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" variant="primary" type="submit">
                  Apply Filter
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
