import React, { useState } from 'react';
import { TaskItem, TaskStatus } from '../../types';
import { TaskCard } from './TaskCard';
import { useCRM } from '../../context/CRMContext';
import {
  Circle,
  Clock,
  Eye,
  CheckCircle2,
  Plus,
  Inbox
} from 'lucide-react';

interface TaskKanbanViewProps {
  tasks: TaskItem[];
  onEditTask: (task: TaskItem) => void;
  onOpenNewTaskWithStatus: (status: TaskStatus) => void;
}

interface ColumnConfig {
  key: TaskStatus;
  title: string;
  icon: React.ReactNode;
  headerBg: string;
  badgeBg: string;
  badgeText: string;
  borderHover: string;
  bgHover: string;
}

const KANBAN_COLUMNS: ColumnConfig[] = [
  {
    key: 'todo',
    title: 'To Do',
    icon: <Circle className="w-3.5 h-3.5 text-slate-500" />,
    headerBg: 'bg-slate-100/70 border-slate-200/80',
    badgeBg: 'bg-slate-200/80',
    badgeText: 'text-slate-700',
    borderHover: 'border-slate-400 ring-2 ring-slate-200',
    bgHover: 'bg-slate-50/60'
  },
  {
    key: 'in_progress',
    title: 'In Progress',
    icon: <Clock className="w-3.5 h-3.5 text-blue-600" />,
    headerBg: 'bg-blue-50/70 border-blue-200/70',
    badgeBg: 'bg-blue-200/70',
    badgeText: 'text-blue-700',
    borderHover: 'border-blue-400 ring-2 ring-blue-100',
    bgHover: 'bg-blue-50/30'
  },
  {
    key: 'review',
    title: 'In Review',
    icon: <Eye className="w-3.5 h-3.5 text-purple-600" />,
    headerBg: 'bg-purple-50/70 border-purple-200/70',
    badgeBg: 'bg-purple-200/70',
    badgeText: 'text-purple-700',
    borderHover: 'border-purple-400 ring-2 ring-purple-100',
    bgHover: 'bg-purple-50/30'
  },
  {
    key: 'completed',
    title: 'Completed',
    icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
    headerBg: 'bg-emerald-50/70 border-emerald-200/70',
    badgeBg: 'bg-emerald-200/70',
    badgeText: 'text-emerald-700',
    borderHover: 'border-emerald-400 ring-2 ring-emerald-100',
    bgHover: 'bg-emerald-50/30'
  }
];

export const TaskKanbanView: React.FC<TaskKanbanViewProps> = ({
  tasks,
  onEditTask,
  onOpenNewTaskWithStatus
}) => {
  const { updateTaskStatus } = useCRM();
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);
  const [mobileActiveStatus, setMobileActiveStatus] = useState<string>('all');

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedTaskId(taskId);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, columnKey: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== columnKey) {
      setDragOverColumn(columnKey);
    }
  };

  const handleDragLeave = (e: React.DragEvent, columnKey: TaskStatus) => {
    e.preventDefault();
    // Only reset if leaving current column
    if (dragOverColumn === columnKey) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (taskId) {
      updateTaskStatus(taskId, targetStatus);
    }
    setDraggedTaskId(null);
    setDragOverColumn(null);
  };

  return (
    <div className="space-y-3">
      {/* Mobile Status Switcher Bar (< 768px) */}
      <div className="md:hidden flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setMobileActiveStatus('all')}
          className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            mobileActiveStatus === 'all'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          All Tasks ({tasks.length})
        </button>
        {KANBAN_COLUMNS.map(col => {
          const count = tasks.filter(t => t.status === col.key).length;
          const isActive = mobileActiveStatus === col.key;
          return (
            <button
              key={col.key}
              onClick={() => setMobileActiveStatus(col.key)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              {col.icon}
              <span>{col.title}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start select-none">
        {KANBAN_COLUMNS
          .filter(col => mobileActiveStatus === 'all' || col.key === mobileActiveStatus)
          .map(col => {
            const columnTasks = tasks.filter(t => t.status === col.key);
            const isColumnDragOver = dragOverColumn === col.key;

            return (
              <div
                key={col.key}
                onDragOver={e => handleDragOver(e, col.key)}
                onDragLeave={e => handleDragLeave(e, col.key)}
                onDrop={e => handleDrop(e, col.key)}
                className={`flex flex-col rounded-2xl bg-slate-100/60 border p-2.5 min-h-[500px] sm:min-h-[580px] transition-all duration-150 ${
                  isColumnDragOver
                    ? `${col.borderHover} ${col.bgHover}`
                    : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
            {/* Column Header */}
            <div
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl border mb-3 ${col.headerBg}`}
            >
              <div className="flex items-center gap-2">
                {col.icon}
                <span className="text-xs font-bold text-slate-900 tracking-tight">
                  {col.title}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${col.badgeBg} ${col.badgeText}`}
                >
                  {columnTasks.length}
                </span>
                <button
                  type="button"
                  onClick={() => onOpenNewTaskWithStatus(col.key)}
                  className="p-1 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-white/60 transition-colors"
                  title={`Add task to ${col.title}`}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Column Task Cards Stack */}
            <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[calc(100vh-280px)] pr-0.5">
              {columnTasks.length === 0 ? (
                <div
                  className={`border border-dashed rounded-xl p-6 text-center transition-colors ${
                    isColumnDragOver
                      ? 'border-blue-400 bg-blue-50/50'
                      : 'border-slate-200/80 bg-white/40'
                  }`}
                >
                  <Inbox className="w-5 h-5 text-slate-300 mx-auto mb-1.5" />
                  <p className="text-xs font-medium text-slate-400">No tasks in {col.title}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Drag tasks here or click + to add
                  </p>
                </div>
              ) : (
                columnTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={onEditTask}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    isDragging={draggedTaskId === task.id}
                  />
                ))
              )}
            </div>

            {/* Quick Add Button at Bottom of Column */}
            <button
              type="button"
              onClick={() => onOpenNewTaskWithStatus(col.key)}
              className="mt-2.5 w-full py-2 px-3 rounded-xl border border-dashed border-slate-300/80 hover:border-blue-400 hover:bg-white/80 text-slate-500 hover:text-blue-600 text-xs font-medium flex items-center justify-center gap-1.5 transition-all group"
            >
              <Plus className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span>Add task</span>
            </button>
          </div>
        );
      })}
      </div>
    </div>
  );
};

