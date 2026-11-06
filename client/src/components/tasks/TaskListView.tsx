import React from 'react';
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
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Check,
  CheckSquare,
  ArrowUpDown
} from 'lucide-react';
import { EmptyState } from '../common/EmptyState';

interface TaskListViewProps {
  tasks: TaskItem[];
  onEditTask: (task: TaskItem) => void;
  onOpenNewTask: () => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export const TaskListView: React.FC<TaskListViewProps> = ({
  tasks,
  onEditTask,
  onOpenNewTask,
  sortBy,
  onSortChange
}) => {
  const { updateTaskStatus, deleteTask, toggleTaskCompleted } = useCRM();

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

  const statusConfigs: Record<TaskStatus, { label: string; badge: string }> = {
    todo: { label: 'To Do', badge: 'bg-slate-100 text-slate-700 border-slate-200' },
    in_progress: { label: 'In Progress', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
    review: { label: 'In Review', badge: 'bg-purple-50 text-purple-700 border-purple-200' },
    completed: { label: 'Completed', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
  };

  // Related icon
  const getRelatedIcon = (type: 'deal' | 'lead' | 'contact' | 'company') => {
    switch (type) {
      case 'deal':
        return <Briefcase className="w-3.5 h-3.5 text-blue-600 shrink-0" />;
      case 'lead':
        return <Target className="w-3.5 h-3.5 text-emerald-600 shrink-0" />;
      case 'contact':
        return <UserIcon className="w-3.5 h-3.5 text-purple-600 shrink-0" />;
      case 'company':
        return <Building2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      {tasks.length === 0 ? (
        <EmptyState
          icon={<CheckSquare className="w-8 h-8 text-slate-400" />}
          title="No tasks found"
          description="Try adjusting your active filters or create a new task to get started."
          actionLabel="+ Create Task"
          onAction={onOpenNewTask}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="sticky top-0 bg-slate-50/95 backdrop-blur-xs z-10 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider select-none">
                <th className="py-3 px-3.5 w-10 text-center">Done</th>
                <th
                  onClick={() =>
                    onSortChange(sortBy === 'title_asc' ? 'title_desc' : 'title_asc')
                  }
                  className="py-3 px-3 cursor-pointer hover:text-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Task Name</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3 hidden sm:table-cell">Related Lead / Deal</th>
                <th
                  onClick={() =>
                    onSortChange(sortBy === 'priority_desc' ? 'priority_asc' : 'priority_desc')
                  }
                  className="py-3 px-3 cursor-pointer hover:text-slate-800 transition-colors hidden md:table-cell"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Priority</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() =>
                    onSortChange(sortBy === 'due_earliest' ? 'due_latest' : 'due_earliest')
                  }
                  className="py-3 px-3 cursor-pointer hover:text-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Due Date</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3 hidden lg:table-cell">Assignee</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {tasks.map(task => {
                const isCompleted = task.status === 'completed';
                const isOverdue =
                  !isCompleted && task.dueDate && task.dueDate < '2026-11-04';
                const isToday = task.dueDate === '2026-11-04';

                return (
                  <tr
                    key={task.id}
                    className={`hover:bg-slate-50/80 transition-colors group ${
                      isCompleted ? 'bg-slate-50/40 opacity-70' : ''
                    }`}
                  >
                    {/* Completion Checkbox */}
                    <td className="py-3 px-3.5 text-center">
                      <button
                        type="button"
                        onClick={() => toggleTaskCompleted(task.id)}
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors mx-auto ${
                          isCompleted
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 hover:border-blue-500 bg-white'
                        }`}
                        title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                      >
                        {isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
                      </button>
                    </td>

                    {/* Task Title & Description */}
                    <td className="py-3 px-3 min-w-[260px] max-w-[380px]">
                      <div
                        onClick={() => onEditTask(task)}
                        className="cursor-pointer group-hover:text-blue-600 transition-colors"
                      >
                        <p
                          className={`font-semibold text-slate-900 ${
                            isCompleted ? 'line-through text-slate-400' : ''
                          }`}
                        >
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Related Lead / Deal / Company */}
                    <td className="py-3 px-3 min-w-[180px] hidden sm:table-cell">
                      {task.relatedTo ? (
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-700 max-w-[220px]">
                          {getRelatedIcon(task.relatedTo.type)}
                          <span className="truncate font-medium">{task.relatedTo.name}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">—</span>
                      )}
                    </td>

                    {/* Priority */}
                    <td className="py-3 px-3 hidden md:table-cell">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md border ${
                          priorityMap[task.priority].badge
                        }`}
                      >
                        {priorityMap[task.priority].icon}
                        <span>{priorityMap[task.priority].label}</span>
                      </span>
                    </td>

                    {/* Due Date */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      {isOverdue ? (
                        <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 border border-rose-200/80 px-2 py-0.5 rounded-md text-[11px] font-bold">
                          <AlertCircle className="w-3 h-3" />
                          <span>{formatDate(task.dueDate)} (Overdue)</span>
                        </span>
                      ) : isToday ? (
                        <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md text-[11px] font-bold">
                          <Clock className="w-3 h-3" />
                          <span>Today</span>
                        </span>
                      ) : (
                        <span className="text-slate-600 text-[11px] flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{formatDate(task.dueDate)}</span>
                        </span>
                      )}
                    </td>

                    {/* Assignee */}
                    <td className="py-3 px-3 whitespace-nowrap hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                          {task.assignee.initials}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800 text-xs truncate">
                            {task.assignee.name}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {task.assignee.role}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Status Dropdown Selector */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <select
                        value={task.status}
                        onChange={e => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                        className={`text-[11px] font-semibold border rounded-lg px-2 py-1 cursor-pointer focus:outline-hidden transition-colors ${
                          statusConfigs[task.status].badge
                        }`}
                      >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="review">In Review</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => onEditTask(task)}
                          className="p-1 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                          title="Edit task"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteTask(task.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete task"
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
      )}
    </div>
  );
};

