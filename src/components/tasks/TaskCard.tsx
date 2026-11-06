import React, { useState } from 'react';
import { TaskItem, TaskPriority, TaskStatus } from '../../types';
import { useCRM } from '../../context/CRMContext';
import { formatDate } from '../../utils/formatters';
import {
  Calendar,
  Clock,
  Briefcase,
  Target,
  User as UserIcon,
  Building2,
  Flame,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Check
} from 'lucide-react';

interface TaskCardProps {
  task: TaskItem;
  onEdit: (task: TaskItem) => void;
  onDragStart?: (e: React.DragEvent, taskId: string) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  isDragging?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDragStart,
  onDragEnd,
  isDragging = false
}) => {
  const { updateTaskStatus, deleteTask, toggleTaskCompleted } = useCRM();
  const [showMenu, setShowMenu] = useState(false);

  // Priority metadata
  const priorityMap: Record<
    TaskPriority,
    { label: string; badge: string; icon: React.ReactNode }
  > = {
    urgent: {
      label: 'Urgent',
      badge: 'bg-rose-50 text-rose-700 border-rose-200 font-semibold',
      icon: <Flame className="w-3 h-3 text-rose-600" />
    },
    high: {
      label: 'High',
      badge: 'bg-orange-50 text-orange-700 border-orange-200 font-semibold',
      icon: <ArrowUp className="w-3 h-3 text-orange-600" />
    },
    medium: {
      label: 'Medium',
      badge: 'bg-amber-50 text-amber-700 border-amber-200 font-medium',
      icon: <Clock className="w-3 h-3 text-amber-600" />
    },
    low: {
      label: 'Low',
      badge: 'bg-slate-100 text-slate-600 border-slate-200 font-medium',
      icon: <ArrowDown className="w-3 h-3 text-slate-500" />
    }
  };

  // Related entity icon
  const getRelatedIcon = (type: 'deal' | 'lead' | 'contact' | 'company') => {
    switch (type) {
      case 'deal':
        return <Briefcase className="w-3 h-3 text-blue-600" />;
      case 'lead':
        return <Target className="w-3 h-3 text-emerald-600" />;
      case 'contact':
        return <UserIcon className="w-3 h-3 text-purple-600" />;
      case 'company':
        return <Building2 className="w-3 h-3 text-indigo-600" />;
    }
  };

  // Check if overdue relative to Nov 4, 2026 (the active CRM simulated date)
  const isOverdue =
    task.status !== 'completed' &&
    task.dueDate &&
    task.dueDate < '2026-11-04';

  const isToday = task.dueDate === '2026-11-04';

  const isCompleted = task.status === 'completed';

  return (
    <div
      draggable={true}
      onDragStart={e => onDragStart && onDragStart(e, task.id)}
      onDragEnd={onDragEnd}
      className={`group relative bg-white border rounded-xl p-3.5 shadow-2xs hover:shadow-md transition-all duration-150 cursor-grab active:cursor-grabbing ${
        isCompleted
          ? 'border-slate-200/60 bg-slate-50/50 opacity-75'
          : 'border-slate-200/90 hover:border-blue-400'
      } ${isDragging ? 'opacity-40 scale-95 ring-2 ring-blue-500' : ''}`}
    >
      {/* Top Header: Priority Badge + Dropdown Menu */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span
          className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md border ${
            priorityMap[task.priority].badge
          }`}
        >
          {priorityMap[task.priority].icon}
          <span>{priorityMap[task.priority].label}</span>
        </span>

        {/* Quick Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              setShowMenu(prev => !prev);
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
            title="Options"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={e => {
                  e.stopPropagation();
                  setShowMenu(false);
                }}
              />
              <div className="absolute right-0 top-6 z-50 w-44 bg-white border border-slate-200 rounded-xl shadow-lg py-1 text-xs">
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    setShowMenu(false);
                    onEdit(task);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-slate-700 hover:bg-slate-50 text-left"
                >
                  <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Edit Task</span>
                </button>

                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Move to
                </div>

                {(['todo', 'in_progress', 'review', 'completed'] as TaskStatus[]).map(st => (
                  <button
                    key={st}
                    type="button"
                    disabled={task.status === st}
                    onClick={e => {
                      e.stopPropagation();
                      updateTaskStatus(task.id, st);
                      setShowMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-1 text-left ${
                      task.status === st
                        ? 'text-blue-600 font-semibold bg-blue-50/50'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="capitalize">{st.replace('_', ' ')}</span>
                    {task.status === st && <Check className="w-3 h-3 text-blue-600" />}
                  </button>
                ))}

                <div className="border-t border-slate-100 my-1" />

                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    setShowMenu(false);
                    deleteTask(task.id);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-rose-600 hover:bg-rose-50 text-left font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Task</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Task Title & Completion Checkbox */}
      <div className="flex items-start gap-2 mb-1.5">
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            toggleTaskCompleted(task.id);
          }}
          className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${
            isCompleted
              ? 'bg-emerald-600 border-emerald-600 text-white'
              : 'border-slate-300 hover:border-blue-500 bg-white'
          }`}
          title={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
        >
          {isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
        </button>

        <h4
          onClick={() => onEdit(task)}
          className={`text-xs font-bold leading-snug cursor-pointer transition-colors ${
            isCompleted
              ? 'line-through text-slate-400'
              : 'text-slate-900 group-hover:text-blue-600'
          }`}
        >
          {task.title}
        </h4>
      </div>

      {/* Description Snippet */}
      {task.description && (
        <p className="text-[11px] text-slate-500 line-clamp-2 mb-2.5 pl-6 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Related Entity Pill */}
      {task.relatedTo && (
        <div className="flex items-center gap-1.5 mb-3 px-2 py-1 rounded-md bg-slate-50 border border-slate-100 text-[11px] text-slate-600 truncate">
          {getRelatedIcon(task.relatedTo.type)}
          <span className="truncate font-medium">{task.relatedTo.name}</span>
        </div>
      )}

      {/* Bottom Footer: Due Date & Assignee Avatar */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px]">
        {/* Due Date Indicator */}
        <div className="flex items-center gap-1">
          {isOverdue ? (
            <span className="flex items-center gap-1 text-rose-700 bg-rose-50 border border-rose-200/80 px-1.5 py-0.5 rounded text-[10px] font-bold">
              <AlertCircle className="w-3 h-3" />
              Overdue
            </span>
          ) : isToday ? (
            <span className="flex items-center gap-1 text-amber-700 bg-amber-50 border border-amber-200/80 px-1.5 py-0.5 rounded text-[10px] font-bold">
              <Clock className="w-3 h-3" />
              Today
            </span>
          ) : (
            <span className="flex items-center gap-1 text-slate-500">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>{formatDate(task.dueDate)}</span>
            </span>
          )}
        </div>

        {/* Assignee Avatar / Pill */}
        <div
          className="flex items-center gap-1.5 shrink-0"
          title={`Assigned to ${task.assignee.name} (${task.assignee.role})`}
        >
          <div className="w-5 h-5 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-[9px] font-bold flex items-center justify-center">
            {task.assignee.initials}
          </div>
          <span className="text-[10px] font-medium text-slate-600 truncate max-w-[80px]">
            {task.assignee.name.split(' ')[0]}
          </span>
        </div>
      </div>
    </div>
  );
};

