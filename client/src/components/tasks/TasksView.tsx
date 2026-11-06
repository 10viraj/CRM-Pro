import React, { useState, useMemo } from 'react';
import { useCRM } from '../../context/CRMContext';
import { TaskItem, TaskPriority, TaskStatus } from '../../types';
import { Button } from '../common/Button';
import { TaskModal } from './TaskModal';
import { TaskListView } from './TaskListView';
import { TaskKanbanView } from './TaskKanbanView';
import { TaskCalendarView } from './TaskCalendarView';
import {
  List,
  Kanban,
  Calendar,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Circle,
  Eye,
  Flame,
  X,
  ArrowUpDown
} from 'lucide-react';

interface TasksViewProps {
  onOpenNewActivity?: () => void;
}

type TaskViewMode = 'list' | 'kanban' | 'calendar';
type QuickFilterTab = 'all' | 'my_tasks' | 'urgent_high' | 'due_today' | 'completed';

export const TasksView: React.FC<TasksViewProps> = () => {
  const { tasks, addTask, currentUser, availableUsers, deals } = useCRM();

  // View Mode: List, Kanban, Calendar
  const [viewMode, setViewMode] = useState<TaskViewMode>('kanban');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<TaskItem | null>(null);
  const [modalDefaultStatus, setModalDefaultStatus] = useState<TaskStatus>('todo');
  const [modalDefaultDueDate, setModalDefaultDueDate] = useState<string | undefined>(undefined);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [quickTab, setQuickTab] = useState<QuickFilterTab>('all');
  const [sortBy, setSortBy] = useState<string>('due_earliest');

  // Inline Quick Add Bar State
  const [quickTitle, setQuickTitle] = useState('');

  const handleQuickAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    addTask({
      title: quickTitle.trim(),
      description: '',
      assignee: currentUser,
      priority: 'medium',
      status: 'todo',
      dueDate: new Date(2026, 10, 4).toISOString().split('T')[0], // Nov 4, 2026
      relatedTo: {
        type: 'deal',
        id: deals[0]?.id || 'general',
        name: deals[0]?.title || 'General Pipeline Task'
      }
    });

    setQuickTitle('');
  };

  // Open modal handlers
  const handleOpenNewTask = () => {
    setTaskToEdit(null);
    setModalDefaultStatus('todo');
    setModalDefaultDueDate(undefined);
    setIsModalOpen(true);
  };

  const handleOpenNewTaskWithStatus = (status: TaskStatus) => {
    setTaskToEdit(null);
    setModalDefaultStatus(status);
    setModalDefaultDueDate(undefined);
    setIsModalOpen(true);
  };

  const handleOpenNewTaskWithDate = (dateStr: string) => {
    setTaskToEdit(null);
    setModalDefaultStatus('todo');
    setModalDefaultDueDate(dateStr);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: TaskItem) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  // KPI Calculations
  const todoCount = tasks.filter(t => t.status === 'todo').length;
  const inProgressCount = tasks.filter(t => t.status === 'in_progress').length;
  const reviewCount = tasks.filter(t => t.status === 'review').length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const urgentHighCount = tasks.filter(
    t => t.status !== 'completed' && (t.priority === 'urgent' || t.priority === 'high')
  ).length;

  // Filtered and Sorted Tasks
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Quick filter presets
    if (quickTab === 'my_tasks') {
      result = result.filter(t => t.assignee.id === currentUser.id);
    } else if (quickTab === 'urgent_high') {
      result = result.filter(
        t => t.status !== 'completed' && (t.priority === 'urgent' || t.priority === 'high')
      );
    } else if (quickTab === 'due_today') {
      result = result.filter(
        t => t.status !== 'completed' && t.dueDate && t.dueDate <= '2026-11-04'
      );
    } else if (quickTab === 'completed') {
      result = result.filter(t => t.status === 'completed');
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(t => t.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      result = result.filter(t => t.priority === priorityFilter);
    }

    // Assignee filter
    if (assigneeFilter !== 'all') {
      result = result.filter(t => t.assignee.id === assigneeFilter);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        t =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q)) ||
          t.assignee.name.toLowerCase().includes(q) ||
          (t.relatedTo && t.relatedTo.name.toLowerCase().includes(q))
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'due_earliest') {
        return (a.dueDate || '').localeCompare(b.dueDate || '');
      }
      if (sortBy === 'due_latest') {
        return (b.dueDate || '').localeCompare(a.dueDate || '');
      }
      if (sortBy === 'priority_desc') {
        const priorityOrder: Record<TaskPriority, number> = {
          urgent: 4,
          high: 3,
          medium: 2,
          low: 1
        };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      if (sortBy === 'priority_asc') {
        const priorityOrder: Record<TaskPriority, number> = {
          urgent: 4,
          high: 3,
          medium: 2,
          low: 1
        };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      if (sortBy === 'title_asc') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'title_desc') {
        return b.title.localeCompare(a.title);
      }
      if (sortBy === 'created_desc') {
        return (b.createdAt || '').localeCompare(a.createdAt || '');
      }
      return 0;
    });

    return result;
  }, [
    tasks,
    quickTab,
    statusFilter,
    priorityFilter,
    assigneeFilter,
    searchQuery,
    sortBy,
    currentUser.id
  ]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    statusFilter !== 'all' ||
    priorityFilter !== 'all' ||
    assigneeFilter !== 'all' ||
    quickTab !== 'all';

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setAssigneeFilter('all');
    setQuickTab('all');
  };

  return (
    <div className="space-y-4">
      {/* ─────────────────────────────────────────────────────────────
          1. Header: Title, Metrics Badges & Primary Actions
          ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Task Management
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
              {tasks.length} total tasks
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize action items, deal follow-ups, and sales deliverables across your pipeline
          </p>
        </div>

        {/* View Switcher & + New Task Button */}
        <div className="flex items-center gap-2.5">
          {/* View Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'kanban'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Kanban View"
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'calendar'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Calendar View"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Calendar</span>
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={handleOpenNewTask}
          >
            New Task
          </Button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. KPI Counter Ribbon
          ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Todo */}
        <div
          onClick={() => {
            setStatusFilter('todo');
            setQuickTab('all');
          }}
          className={`p-3 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'todo'
              ? 'bg-slate-100 border-slate-300 ring-1 ring-slate-300'
              : 'bg-white border-slate-200/80 hover:bg-slate-50/70 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">To Do</span>
            <Circle className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-lg font-extrabold text-slate-900">{todoCount}</div>
        </div>

        {/* In Progress */}
        <div
          onClick={() => {
            setStatusFilter('in_progress');
            setQuickTab('all');
          }}
          className={`p-3 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'in_progress'
              ? 'bg-blue-50/70 border-blue-300 ring-1 ring-blue-300'
              : 'bg-white border-slate-200/80 hover:bg-slate-50/70 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between text-blue-600 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">In Progress</span>
            <Clock className="w-3.5 h-3.5" />
          </div>
          <div className="text-lg font-extrabold text-slate-900">{inProgressCount}</div>
        </div>

        {/* Review */}
        <div
          onClick={() => {
            setStatusFilter('review');
            setQuickTab('all');
          }}
          className={`p-3 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'review'
              ? 'bg-purple-50/70 border-purple-300 ring-1 ring-purple-300'
              : 'bg-white border-slate-200/80 hover:bg-slate-50/70 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between text-purple-600 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">In Review</span>
            <Eye className="w-3.5 h-3.5" />
          </div>
          <div className="text-lg font-extrabold text-slate-900">{reviewCount}</div>
        </div>

        {/* Completed */}
        <div
          onClick={() => {
            setStatusFilter('completed');
            setQuickTab('all');
          }}
          className={`p-3 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'completed'
              ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-300'
              : 'bg-white border-slate-200/80 hover:bg-slate-50/70 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between text-emerald-600 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Completed</span>
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <div className="text-lg font-extrabold text-slate-900">{completedCount}</div>
        </div>

        {/* Urgent / High Priority */}
        <div
          onClick={() => {
            setQuickTab('urgent_high');
            setStatusFilter('all');
          }}
          className={`col-span-2 sm:col-span-1 p-3 rounded-2xl border transition-all cursor-pointer ${
            quickTab === 'urgent_high'
              ? 'bg-rose-50/70 border-rose-300 ring-1 ring-rose-300'
              : 'bg-white border-slate-200/80 hover:bg-slate-50/70 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between text-rose-600 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Urgent & High</span>
            <Flame className="w-3.5 h-3.5" />
          </div>
          <div className="text-lg font-extrabold text-rose-700">{urgentHighCount}</div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. Quick Inline Add Bar
          ───────────────────────────────────────────────────────────── */}
      <form onSubmit={handleQuickAddSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={quickTitle}
            onChange={e => setQuickTitle(e.target.value)}
            placeholder="+ Quickly add a new task and press Enter (e.g. 'Follow up with Acme Tech on SOW')..."
            className="w-full bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-2xs transition-all"
          />
        </div>
        <Button
          type="submit"
          size="sm"
          variant="secondary"
          disabled={!quickTitle.trim()}
          icon={<Plus className="w-3.5 h-3.5" />}
        >
          Add
        </Button>
      </form>

      {/* ─────────────────────────────────────────────────────────────
          4. Toolbar: Quick Filter Pills, Live Search, Dropdown Filters & Sorting
          ───────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-xs space-y-3">
        {/* Row 1: Quick Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
            {[
              { id: 'all', label: 'All Tasks', count: tasks.length },
              {
                id: 'my_tasks',
                label: 'My Tasks',
                count: tasks.filter(t => t.assignee.id === currentUser.id).length
              },
              { id: 'urgent_high', label: 'Urgent & High', count: urgentHighCount },
              {
                id: 'due_today',
                label: 'Due Today / Overdue',
                count: tasks.filter(
                  t => t.status !== 'completed' && t.dueDate && t.dueDate <= '2026-11-04'
                ).length
              },
              { id: 'completed', label: 'Completed', count: completedCount }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setQuickTab(tab.id as QuickFilterTab);
                  if (tab.id !== 'all') setStatusFilter('all');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1.5 ${
                  quickTab === tab.id
                    ? 'bg-blue-50 text-blue-700 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    quickTab === tab.id
                      ? 'bg-blue-200/60 text-blue-800'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {tab.count}
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

        {/* Row 2: Search, Status, Priority, Assignee & Due Date Sorting */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Live Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by task title, description, assignee, related record..."
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

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 font-medium focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="review">In Review</option>
              <option value="completed">Completed</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 font-medium focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            {/* Assignee Filter */}
            <select
              value={assigneeFilter}
              onChange={e => setAssigneeFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 font-medium focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Assignees</option>
              {availableUsers.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>

            {/* Due Date Sorting Dropdown */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2 py-0.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="text-xs bg-transparent border-0 text-slate-700 font-medium focus:ring-0 py-1 cursor-pointer"
              >
                <option value="due_earliest">Due Date (Earliest first)</option>
                <option value="due_latest">Due Date (Latest first)</option>
                <option value="priority_desc">Priority (Urgent first)</option>
                <option value="title_asc">Task Name (A - Z)</option>
                <option value="created_desc">Recently Created</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          5. Active View Rendering: List, Kanban, or Calendar
          ───────────────────────────────────────────────────────────── */}
      {viewMode === 'list' && (
        <TaskListView
          tasks={filteredTasks}
          onEditTask={handleEditTask}
          onOpenNewTask={handleOpenNewTask}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      )}

      {viewMode === 'kanban' && (
        <TaskKanbanView
          tasks={filteredTasks}
          onEditTask={handleEditTask}
          onOpenNewTaskWithStatus={handleOpenNewTaskWithStatus}
        />
      )}

      {viewMode === 'calendar' && (
        <TaskCalendarView
          tasks={filteredTasks}
          onEditTask={handleEditTask}
          onOpenNewTaskWithDate={handleOpenNewTaskWithDate}
        />
      )}

      {/* ─────────────────────────────────────────────────────────────
          6. Task Modal (Create & Edit)
          ───────────────────────────────────────────────────────────── */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        taskToEdit={taskToEdit}
        defaultStatus={modalDefaultStatus}
        defaultDueDate={modalDefaultDueDate}
      />
    </div>
  );
};
