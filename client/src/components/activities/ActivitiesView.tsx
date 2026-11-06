import React, { useState, useMemo } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Activity, ActivityType } from '../../types';
import { formatDate } from '../../utils/formatters';
import { Button } from '../common/Button';
import { EmptyState } from '../common/EmptyState';
import { ActivityModal } from './ActivityModal';
import {
  Phone,
  Mail,
  Calendar,
  FileText,
  CheckSquare,
  Briefcase,
  Search,
  Filter,
  Plus,
  Trash2,
  Clock,
  CheckCircle2,
  User as UserIcon,
  Building2,
  X,
  ArrowUpDown,
  Sparkles
} from 'lucide-react';

interface ActivitiesViewProps {
  onOpenNewActivity?: () => void;
}

type QuickFilterPill = 'all' | 'today' | 'client_touchpoints' | 'deal_updates' | 'notes_tasks';

export const ActivitiesView: React.FC<ActivitiesViewProps> = () => {
  const { activities, toggleActivityCompleted, deleteActivity, availableUsers, currentUser } = useCRM();

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [userFilter, setUserFilter] = useState<string>('all');
  const [quickPill, setQuickPill] = useState<QuickFilterPill>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDefaultType, setModalDefaultType] = useState<ActivityType>('call');

  const handleOpenModalWithType = (type: ActivityType) => {
    setModalDefaultType(type);
    setIsModalOpen(true);
  };

  // Helper to extract clean time (e.g. 10:30 AM) from ISO timestamp
  const formatTime = (isoString?: string): string => {
    if (!isoString) return '';
    try {
      if (isoString.includes('T')) {
        const timePart = isoString.split('T')[1].slice(0, 5); // "10:30"
        const [hStr, mStr] = timePart.split(':');
        const h = Number(hStr);
        const m = mStr;
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayH = h % 12 === 0 ? 12 : h % 12;
        return `${displayH}:${m} ${ampm}`;
      }
      return '';
    } catch {
      return '';
    }
  };

  // Activity Type styling and iconography
  const activityConfig: Record<
    ActivityType,
    {
      label: string;
      emoji: string;
      icon: React.ReactNode;
      badge: string;
      dot: string;
      border: string;
      bg: string;
    }
  > = {
    call: {
      label: 'Call',
      emoji: '📞',
      icon: <Phone className="w-3.5 h-3.5 text-blue-600" />,
      badge: 'bg-blue-50 text-blue-700 border-blue-200/80',
      dot: 'bg-blue-500',
      border: 'border-blue-200',
      bg: 'bg-blue-50/40'
    },
    email: {
      label: 'Email',
      emoji: '✉️',
      icon: <Mail className="w-3.5 h-3.5 text-emerald-600" />,
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      dot: 'bg-emerald-500',
      border: 'border-emerald-200',
      bg: 'bg-emerald-50/40'
    },
    meeting: {
      label: 'Meeting',
      emoji: '📅',
      icon: <Calendar className="w-3.5 h-3.5 text-purple-600" />,
      badge: 'bg-purple-50 text-purple-700 border-purple-200/80',
      dot: 'bg-purple-500',
      border: 'border-purple-200',
      bg: 'bg-purple-50/40'
    },
    note: {
      label: 'Note',
      emoji: '📝',
      icon: <FileText className="w-3.5 h-3.5 text-amber-600" />,
      badge: 'bg-amber-50 text-amber-700 border-amber-200/80',
      dot: 'bg-amber-500',
      border: 'border-amber-200',
      bg: 'bg-amber-50/40'
    },
    task: {
      label: 'Task',
      emoji: '✅',
      icon: <CheckSquare className="w-3.5 h-3.5 text-rose-600" />,
      badge: 'bg-rose-50 text-rose-700 border-rose-200/80',
      dot: 'bg-rose-500',
      border: 'border-rose-200',
      bg: 'bg-rose-50/40'
    },
    deal_update: {
      label: 'Deal Update',
      emoji: '💼',
      icon: <Briefcase className="w-3.5 h-3.5 text-indigo-600" />,
      badge: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
      dot: 'bg-indigo-500',
      border: 'border-indigo-200',
      bg: 'bg-indigo-50/40'
    }
  };

  // KPI Counts
  const callCount = activities.filter(a => a.type === 'call').length;
  const emailCount = activities.filter(a => a.type === 'email').length;
  const meetingCount = activities.filter(a => a.type === 'meeting').length;
  const noteCount = activities.filter(a => a.type === 'note').length;
  const taskCount = activities.filter(a => a.type === 'task').length;
  const dealUpdateCount = activities.filter(a => a.type === 'deal_update').length;

  // Filtered and Sorted Activities
  const filteredActivities = useMemo(() => {
    let result = [...activities];

    // Quick Pill Presets
    if (quickPill === 'today') {
      result = result.filter(a => (a.createdAt || a.dueDate || '').startsWith('2026-11-04'));
    } else if (quickPill === 'client_touchpoints') {
      result = result.filter(a => a.type === 'call' || a.type === 'email' || a.type === 'meeting');
    } else if (quickPill === 'deal_updates') {
      result = result.filter(a => a.type === 'deal_update');
    } else if (quickPill === 'notes_tasks') {
      result = result.filter(a => a.type === 'note' || a.type === 'task');
    }

    // Type Filter
    if (typeFilter !== 'all') {
      result = result.filter(a => a.type === typeFilter);
    }

    // User Filter
    if (userFilter !== 'all') {
      result = result.filter(a => a.assignedTo?.id === userFilter);
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        a =>
          a.title.toLowerCase().includes(q) ||
          (a.description && a.description.toLowerCase().includes(q)) ||
          a.relatedTo?.name.toLowerCase().includes(q) ||
          a.assignedTo?.name.toLowerCase().includes(q) ||
          (a.outcome && a.outcome.toLowerCase().includes(q))
      );
    }

    // Sort Chronologically Descending
    result.sort((a, b) => {
      const timeA = new Date(a.createdAt || a.dueDate || 0).getTime();
      const timeB = new Date(b.createdAt || b.dueDate || 0).getTime();
      return timeB - timeA;
    });

    return result;
  }, [activities, quickPill, typeFilter, userFilter, searchQuery]);

  // Group Chronologically by Relative Day
  const chronologicalGroups = useMemo(() => {
    const groups: Record<string, Activity[]> = {};
    const groupOrder: string[] = [];

    filteredActivities.forEach(act => {
      const rawDate = act.createdAt || act.dueDate || '';
      const datePart = rawDate.split('T')[0]; // "2026-11-04"

      let groupTitle = 'Earlier';
      if (datePart === '2026-11-04') {
        groupTitle = 'Today';
      } else if (datePart === '2026-11-03') {
        groupTitle = 'Yesterday';
      } else if (datePart === '2026-11-02') {
        groupTitle = 'Monday, Nov 2, 2026';
      } else if (datePart === '2026-11-01') {
        groupTitle = 'Sunday, Nov 1, 2026';
      } else if (datePart.startsWith('2026-10')) {
        groupTitle = 'October 2026';
      } else {
        groupTitle = formatDate(datePart);
      }

      if (!groups[groupTitle]) {
        groups[groupTitle] = [];
        groupOrder.push(groupTitle);
      }
      groups[groupTitle].push(act);
    });

    return groupOrder.map(title => ({
      groupName: title,
      items: groups[title]
    }));
  }, [filteredActivities]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    typeFilter !== 'all' ||
    userFilter !== 'all' ||
    quickPill !== 'all';

  const resetFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
    setUserFilter('all');
    setQuickPill('all');
  };

  return (
    <div className="space-y-4">
      {/* ─────────────────────────────────────────────────────────────
          1. Header: Page Title, Action Bar & Log Triggers
          ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Activity Timeline
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
              {activities.length} total logged events
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Chronological audit log of calls, meetings, emails, team notes, and deal stage changes
          </p>
        </div>

        {/* Quick Log Action Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Button
            variant="secondary"
            size="sm"
            icon={<Phone className="w-3.5 h-3.5 text-blue-600" />}
            onClick={() => handleOpenModalWithType('call')}
          >
            Log Call
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={<Mail className="w-3.5 h-3.5 text-emerald-600" />}
            onClick={() => handleOpenModalWithType('email')}
          >
            Log Email
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={<Calendar className="w-3.5 h-3.5 text-purple-600" />}
            onClick={() => handleOpenModalWithType('meeting')}
          >
            Meeting
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={<FileText className="w-3.5 h-3.5 text-amber-600" />}
            onClick={() => handleOpenModalWithType('note')}
          >
            Note
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => handleOpenModalWithType('call')}
          >
            Log Activity
          </Button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. Activity Types Ribbon
          ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {[
          { type: 'call', label: 'Calls', count: callCount, icon: <Phone className="w-3.5 h-3.5 text-blue-600" />, bg: 'hover:bg-blue-50/50' },
          { type: 'email', label: 'Emails', count: emailCount, icon: <Mail className="w-3.5 h-3.5 text-emerald-600" />, bg: 'hover:bg-emerald-50/50' },
          { type: 'meeting', label: 'Meetings', count: meetingCount, icon: <Calendar className="w-3.5 h-3.5 text-purple-600" />, bg: 'hover:bg-purple-50/50' },
          { type: 'note', label: 'Notes', count: noteCount, icon: <FileText className="w-3.5 h-3.5 text-amber-600" />, bg: 'hover:bg-amber-50/50' },
          { type: 'task', label: 'Tasks', count: taskCount, icon: <CheckSquare className="w-3.5 h-3.5 text-rose-600" />, bg: 'hover:bg-rose-50/50' },
          { type: 'deal_update', label: 'Deal Updates', count: dealUpdateCount, icon: <Briefcase className="w-3.5 h-3.5 text-indigo-600" />, bg: 'hover:bg-indigo-50/50' }
        ].map(item => {
          const isSelected = typeFilter === item.type;
          return (
            <button
              key={item.type}
              type="button"
              onClick={() => {
                setTypeFilter(typeFilter === item.type ? 'all' : item.type);
                setQuickPill('all');
              }}
              className={`p-2.5 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50/70 ring-1 ring-blue-500 shadow-2xs'
                  : `bg-white border-slate-200/80 ${item.bg} shadow-2xs`
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {item.label}
                </span>
                {item.icon}
              </div>
              <div className="text-base font-extrabold text-slate-900">{item.count}</div>
            </button>
          );
        })}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. Toolbar: Quick Preset Pills & Multi-Field Search
          ───────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-xs space-y-3">
        {/* Row 1: Quick Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
            {[
              { id: 'all', label: 'All Activities', count: activities.length },
              {
                id: 'today',
                label: 'Today',
                count: activities.filter(a => (a.createdAt || a.dueDate || '').startsWith('2026-11-04')).length
              },
              {
                id: 'client_touchpoints',
                label: 'Client Touchpoints',
                count: activities.filter(a => a.type === 'call' || a.type === 'email' || a.type === 'meeting').length
              },
              {
                id: 'deal_updates',
                label: 'Deal Updates',
                count: dealUpdateCount
              },
              {
                id: 'notes_tasks',
                label: 'Notes & Tasks',
                count: noteCount + taskCount
              }
            ].map(pill => (
              <button
                key={pill.id}
                type="button"
                onClick={() => {
                  setQuickPill(pill.id as QuickFilterPill);
                  if (pill.id !== 'all') setTypeFilter('all');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1.5 ${
                  quickPill === pill.id
                    ? 'bg-blue-50 text-blue-700 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>{pill.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    quickPill === pill.id
                      ? 'bg-blue-200/60 text-blue-800'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {pill.count}
                </span>
              </button>
            ))}
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear filters</span>
            </button>
          )}
        </div>

        {/* Row 2: Search Input & Dropdown Selectors */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search activities, contact names, company or notes..."
              className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <select
              value={typeFilter}
              onChange={e => {
                setTypeFilter(e.target.value);
                setQuickPill('all');
              }}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 font-medium focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Activity Types</option>
              <option value="call">📞 Phone Calls</option>
              <option value="email">✉️ Emails</option>
              <option value="meeting">📅 Meetings</option>
              <option value="note">📝 Notes</option>
              <option value="task">✅ Tasks</option>
              <option value="deal_update">💼 Deal Updates</option>
            </select>

            {/* Rep Filter */}
            <select
              value={userFilter}
              onChange={e => setUserFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 font-medium focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Team Members</option>
              {availableUsers.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. Chronological Timeline Stream
          ───────────────────────────────────────────────────────────── */}
      {chronologicalGroups.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-10">
          <EmptyState
            icon={<CheckCircle2 className="w-8 h-8 text-slate-400" />}
            title="No activities found"
            description="No logged events match your active filters. Try adjusting your search query or log a new activity."
            actionLabel="+ Log Activity"
            onAction={() => handleOpenModalWithType('call')}
          />
        </div>
      ) : (
        <div className="space-y-6">
          {chronologicalGroups.map(group => (
            <div key={group.groupName} className="space-y-3">
              {/* Chronological Day Heading (e.g. "Today", "Yesterday") */}
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 rounded-xl bg-slate-900 text-white text-xs font-bold tracking-wide uppercase shadow-xs flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  <span>{group.groupName}</span>
                </div>
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-xs font-semibold text-slate-400">
                  {group.items.length} {group.items.length === 1 ? 'event' : 'events'}
                </span>
              </div>

              {/* Vertical Timeline Container */}
              <div className="relative pl-6 sm:pl-8 space-y-3.5 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                {group.items.map(activity => {
                  const conf = activityConfig[activity.type] || activityConfig.call;
                  const itemTime = formatTime(activity.createdAt || activity.dueDate);

                  return (
                    <div
                      key={activity.id}
                      className="relative group transition-all"
                    >
                      {/* Timeline Node Dot */}
                      <div
                        className={`absolute -left-6 sm:-left-8 top-3.5 w-5 h-5 rounded-full border-2 border-white ${conf.dot} shadow-xs flex items-center justify-center text-[10px] text-white`}
                        title={conf.label}
                      >
                        <span className="sr-only">{conf.label}</span>
                      </div>

                      {/* Timeline Card */}
                      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all">
                        {/* Top Row: Time, Type, Title & Delete */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1 min-w-0">
                            {/* Time & Type Pill */}
                            <div className="flex flex-wrap items-center gap-2">
                              {itemTime && (
                                <span className="text-xs font-extrabold text-slate-900 font-mono">
                                  {itemTime}
                                </span>
                              )}

                              <span
                                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${conf.badge}`}
                              >
                                <span>{conf.emoji}</span>
                                <span>{conf.label}</span>
                              </span>

                              {activity.outcome && (
                                <span className="inline-flex items-center text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200/70 px-2 py-0.5 rounded-md">
                                  {activity.outcome}
                                </span>
                              )}
                            </div>

                            {/* Main Event Title (Exact format requested in prompt) */}
                            <h4 className="text-sm font-bold text-slate-900 leading-snug pt-0.5">
                              {conf.emoji} {activity.title}
                            </h4>
                          </div>

                          {/* Quick Delete Action */}
                          <button
                            type="button"
                            onClick={() => deleteActivity(activity.id)}
                            className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            title="Delete activity"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Description / Content Body */}
                        {activity.description && (
                          <p className="text-xs text-slate-600 mt-2 leading-relaxed bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                            {activity.description}
                          </p>
                        )}

                        {/* Associated Entities & Team Rep Footer */}
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-slate-100 text-[11px]">
                          {/* Associated Record Badge */}
                          <div className="flex items-center gap-2">
                            {activity.relatedTo && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200/80 font-medium text-slate-700">
                                {activity.relatedTo.type === 'deal' ? (
                                  <Briefcase className="w-3 h-3 text-blue-600" />
                                ) : activity.relatedTo.type === 'contact' ? (
                                  <UserIcon className="w-3 h-3 text-purple-600" />
                                ) : (
                                  <Building2 className="w-3 h-3 text-indigo-600" />
                                )}
                                <span className="capitalize font-bold text-slate-500">
                                  {activity.relatedTo.type}:
                                </span>
                                <span className="truncate max-w-[200px]">
                                  {activity.relatedTo.name}
                                </span>
                              </span>
                            )}

                            {activity.durationMinutes && (
                              <span className="text-slate-400 font-medium">
                                • {activity.durationMinutes} mins
                              </span>
                            )}
                          </div>

                          {/* Assigned Rep */}
                          {activity.assignedTo && (
                            <div className="flex items-center gap-1.5 text-slate-500 shrink-0">
                              <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 font-bold text-[8px] flex items-center justify-center">
                                {activity.assignedTo.initials}
                              </div>
                              <span className="font-medium text-slate-700">
                                {activity.assignedTo.name}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          5. Log Activity Modal
          ───────────────────────────────────────────────────────────── */}
      <ActivityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultType={modalDefaultType}
      />
    </div>
  );
};
