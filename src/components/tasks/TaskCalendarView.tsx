import React, { useState } from 'react';
import { TaskItem, TaskPriority, TaskStatus } from '../../types';
import { useCRM } from '../../context/CRMContext';
import { formatDate } from '../../utils/formatters';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  Clock,
  Briefcase,
  Target,
  User as UserIcon,
  Building2,
  CheckCircle2,
  Check,
  Flame,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { Button } from '../common/Button';

interface TaskCalendarViewProps {
  tasks: TaskItem[];
  onEditTask: (task: TaskItem) => void;
  onOpenNewTaskWithDate: (dateStr: string) => void;
}

export const TaskCalendarView: React.FC<TaskCalendarViewProps> = ({
  tasks,
  onEditTask,
  onOpenNewTaskWithDate
}) => {
  const { updateTaskStatus, deleteTask, toggleTaskCompleted } = useCRM();

  // Simulated month: November 2026 (Year: 2026, Month index: 10)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(10); // 0-indexed, 10 = November
  const [selectedDay, setSelectedDay] = useState<number>(4); // Nov 4 is CRM today

  // Days in month calculation
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleGoToday = () => {
    setCurrentYear(2026);
    setCurrentMonth(10);
    setSelectedDay(4);
  };

  // Helper to format ISO date string for given day
  const getDateString = (day: number) => {
    const m = String(currentMonth + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${currentYear}-${m}-${d}`;
  };

  // Get tasks for a given day
  const getTasksForDay = (day: number): TaskItem[] => {
    const dateStr = getDateString(day);
    return tasks.filter(t => t.dueDate === dateStr);
  };

  const selectedDateStr = getDateString(selectedDay);
  const selectedDayTasks = getTasksForDay(selectedDay);

  // Priority metadata
  const priorityColorDot: Record<TaskPriority, string> = {
    urgent: 'bg-rose-500',
    high: 'bg-orange-500',
    medium: 'bg-amber-500',
    low: 'bg-slate-400'
  };

  const priorityBadge: Record<TaskPriority, { label: string; badge: string }> = {
    urgent: { label: 'Urgent', badge: 'bg-rose-50 text-rose-700 border-rose-200' },
    high: { label: 'High', badge: 'bg-orange-50 text-orange-700 border-orange-200' },
    medium: { label: 'Medium', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
    low: { label: 'Low', badge: 'bg-slate-100 text-slate-600 border-slate-200' }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
      {/* ─────────────────────────────────────────────────────────────
          LEFT: Calendar Month Grid (2 cols)
          ───────────────────────────────────────────────────────────── */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
        {/* Month Navigation Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                {monthNames[currentMonth]} {currentYear}
              </h3>
              <p className="text-[11px] text-slate-500">
                {tasks.length} total tasks scheduled across pipeline
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <Button variant="ghost" size="sm" onClick={handleGoToday}>
              Today
            </Button>
            <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 hover:bg-slate-50 text-slate-600 transition-colors border-r border-slate-200"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 hover:bg-slate-50 text-slate-600 transition-colors"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 text-center py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Month Grid Cells */}
        <div className="grid grid-cols-7 gap-1.5">
          {/* Empty cells before month starts */}
          {Array.from({ length: firstDayOfWeek }).map((_, index) => (
            <div
              key={`empty-${index}`}
              className="h-24 rounded-xl bg-slate-50/40 border border-transparent p-1.5 opacity-40 select-none"
            />
          ))}

          {/* Day Cells */}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const dayNum = index + 1;
            const isToday =
              currentYear === 2026 && currentMonth === 10 && dayNum === 4;
            const isSelected = dayNum === selectedDay;
            const dayTasks = getTasksForDay(dayNum);

            return (
              <div
                key={`day-${dayNum}`}
                onClick={() => setSelectedDay(dayNum)}
                className={`h-24 rounded-xl border p-1.5 flex flex-col justify-between transition-all cursor-pointer relative overflow-hidden group ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/20 ring-2 ring-blue-500/30'
                    : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                {/* Day Header */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                      isToday
                        ? 'bg-blue-600 text-white shadow-xs'
                        : isSelected
                        ? 'bg-blue-100 text-blue-700 font-extrabold'
                        : 'text-slate-700 group-hover:text-slate-900'
                    }`}
                  >
                    {dayNum}
                  </span>

                  {dayTasks.length > 0 && (
                    <span className="text-[10px] font-semibold text-slate-400 px-1">
                      {dayTasks.length}
                    </span>
                  )}
                </div>

                {/* Task Chips inside cell */}
                <div className="space-y-1 overflow-hidden mt-1">
                  {dayTasks.slice(0, 2).map(task => (
                    <div
                      key={task.id}
                      onClick={e => {
                        e.stopPropagation();
                        onEditTask(task);
                      }}
                      className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] truncate transition-colors font-medium ${
                        task.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 line-through opacity-70'
                          : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                      }`}
                      title={task.title}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                          priorityColorDot[task.priority]
                        }`}
                      />
                      <span className="truncate">{task.title}</span>
                    </div>
                  ))}

                  {dayTasks.length > 2 && (
                    <div className="text-[9px] font-semibold text-blue-600 pl-1">
                      +{dayTasks.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          RIGHT: Selected Date Agenda & Details
          ───────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Selected Agenda
            </h4>
            <h3 className="text-sm font-bold text-slate-900 mt-0.5">
              {monthNames[currentMonth]} {selectedDay}, {currentYear}
            </h3>
          </div>

          <Button
            variant="secondary"
            size="sm"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => onOpenNewTaskWithDate(selectedDateStr)}
          >
            Add Task
          </Button>
        </div>

        {/* Selected Tasks List */}
        <div className="mt-4 space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {selectedDayTasks.length === 0 ? (
            <div className="border border-dashed border-slate-200 rounded-xl p-8 text-center text-slate-400">
              <CalendarIcon className="w-6 h-6 mx-auto mb-2 text-slate-300" />
              <p className="text-xs font-semibold text-slate-600">
                No tasks on this date
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Schedule follow-ups, deliverables, or meetings for{' '}
                {monthNames[currentMonth]} {selectedDay}.
              </p>
              <Button
                variant="primary"
                size="sm"
                className="mt-3"
                onClick={() => onOpenNewTaskWithDate(selectedDateStr)}
              >
                + Schedule Task
              </Button>
            </div>
          ) : (
            selectedDayTasks.map(task => {
              const isCompleted = task.status === 'completed';

              return (
                <div
                  key={task.id}
                  className={`p-3 rounded-xl border transition-all ${
                    isCompleted
                      ? 'bg-slate-50 border-slate-200/70 opacity-75'
                      : 'bg-white border-slate-200/90 shadow-2xs hover:border-blue-400'
                  }`}
                >
                  {/* Priority & Status */}
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                        priorityBadge[task.priority].badge
                      }`}
                    >
                      {priorityBadge[task.priority].label}
                    </span>

                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Title & Checkbox */}
                  <div className="flex items-start gap-2 mb-1">
                    <button
                      type="button"
                      onClick={() => toggleTaskCompleted(task.id)}
                      className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 hover:border-blue-500 bg-white'
                      }`}
                      title={isCompleted ? 'Mark incomplete' : 'Mark complete'}
                    >
                      {isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
                    </button>

                    <h5
                      onClick={() => onEditTask(task)}
                      className={`text-xs font-bold cursor-pointer transition-colors ${
                        isCompleted
                          ? 'line-through text-slate-400'
                          : 'text-slate-900 hover:text-blue-600'
                      }`}
                    >
                      {task.title}
                    </h5>
                  </div>

                  {/* Description */}
                  {task.description && (
                    <p className="text-[11px] text-slate-500 line-clamp-2 pl-6 mb-2">
                      {task.description}
                    </p>
                  )}

                  {/* Related info & Assignee */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                    <span className="truncate max-w-[130px] font-medium text-slate-700">
                      {task.relatedTo?.name || 'General'}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 font-bold text-[8px] flex items-center justify-center">
                        {task.assignee.initials}
                      </div>
                      <span>{task.assignee.name.split(' ')[0]}</span>

                      <button
                        type="button"
                        onClick={() => onEditTask(task)}
                        className="p-1 text-slate-400 hover:text-blue-600 ml-1"
                        title="Edit"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteTask(task.id)}
                        className="p-1 text-slate-400 hover:text-rose-600"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

