import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { TaskItem, TaskPriority, TaskStatus, User } from '../../types';
import { useCRM } from '../../context/CRMContext';
import {
  Calendar,
  AlertCircle,
  Clock,
  Briefcase,
  Target,
  User as UserIcon,
  Building2,
  Flame,
  AlertTriangle,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: TaskItem | null;
  defaultStatus?: TaskStatus;
  defaultDueDate?: string;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  taskToEdit,
  defaultStatus = 'todo',
  defaultDueDate
}) => {
  const {
    addTask,
    updateTask,
    availableUsers,
    currentUser,
    leads,
    deals,
    contacts,
    companies,
    showToast
  } = useCRM();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assigneeId, setAssigneeId] = useState(currentUser.id);
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [status, setStatus] = useState<TaskStatus>(defaultStatus);
  const [dueDate, setDueDate] = useState(
    defaultDueDate || new Date(2026, 10, 4).toISOString().split('T')[0]
  );
  const [relatedType, setRelatedType] = useState<'deal' | 'lead' | 'contact' | 'company'>('deal');
  const [relatedId, setRelatedId] = useState('');

  // Validation States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Populate when opening modal or editing
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setAssigneeId(taskToEdit.assignee.id);
      setPriority(taskToEdit.priority);
      setStatus(taskToEdit.status);
      setDueDate(taskToEdit.dueDate);
      setRelatedType(taskToEdit.relatedTo.type);
      setRelatedId(taskToEdit.relatedTo.id);
    } else {
      setTitle('');
      setDescription('');
      setAssigneeId(currentUser.id);
      setPriority('medium');
      setStatus(defaultStatus);
      setDueDate(defaultDueDate || new Date(2026, 10, 4).toISOString().split('T')[0]);
      setRelatedType('deal');
      setRelatedId(deals[0]?.id || '');
    }
  }, [taskToEdit, isOpen, defaultStatus, defaultDueDate, currentUser.id, deals]);

  // Update default relatedId when type changes
  const handleRelatedTypeChange = (newType: 'deal' | 'lead' | 'contact' | 'company') => {
    setRelatedType(newType);
    if (newType === 'deal') setRelatedId(deals[0]?.id || '');
    else if (newType === 'lead') setRelatedId(leads[0]?.id || '');
    else if (newType === 'contact') setRelatedId(contacts[0]?.id || '');
    else if (newType === 'company') setRelatedId(companies[0]?.id || '');
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) {
      errs.title = 'Task name is required.';
    } else if (title.trim().length < 3) {
      errs.title = 'Task name must be at least 3 characters.';
    }
    if (!dueDate) {
      errs.dueDate = 'Due date is required.';
    }
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ title: true, dueDate: true });
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      showToast('Validation Error', 'Please complete the required task fields.', 'warning');
      return;
    }

    // Resolve Assignee
    const assignee = availableUsers.find(u => u.id === assigneeId) || currentUser;

    // Resolve Related Entity Name
    let relatedName = 'General Task';
    if (relatedType === 'deal') {
      const d = deals.find(item => item.id === relatedId);
      if (d) relatedName = `${d.title} (${d.companyName})`;
    } else if (relatedType === 'lead') {
      const l = leads.find(item => item.id === relatedId);
      if (l) relatedName = `${l.name} (${l.company})`;
    } else if (relatedType === 'contact') {
      const c = contacts.find(item => item.id === relatedId);
      if (c) relatedName = `${c.name} (${c.companyName})`;
    } else if (relatedType === 'company') {
      const comp = companies.find(item => item.id === relatedId);
      if (comp) relatedName = comp.name;
    }

    if (taskToEdit) {
      updateTask(taskToEdit.id, {
        title: title.trim(),
        description: description.trim(),
        assignee,
        priority,
        status,
        dueDate,
        relatedTo: {
          type: relatedType,
          id: relatedId,
          name: relatedName
        }
      });
    } else {
      addTask({
        title: title.trim(),
        description: description.trim(),
        assignee,
        priority,
        status,
        dueDate,
        relatedTo: {
          type: relatedType,
          id: relatedId,
          name: relatedName
        }
      });
    }

    onClose();
  };

  const priorityConfigs: Record<
    TaskPriority,
    { label: string; icon: React.ReactNode; color: string; border: string; bg: string }
  > = {
    urgent: {
      label: 'Urgent',
      icon: <Flame className="w-3.5 h-3.5 text-rose-600" />,
      color: 'text-rose-700',
      border: 'border-rose-300',
      bg: 'bg-rose-50'
    },
    high: {
      label: 'High',
      icon: <ArrowUp className="w-3.5 h-3.5 text-orange-600" />,
      color: 'text-orange-700',
      border: 'border-orange-300',
      bg: 'bg-orange-50'
    },
    medium: {
      label: 'Medium',
      icon: <Clock className="w-3.5 h-3.5 text-amber-600" />,
      color: 'text-amber-700',
      border: 'border-amber-300',
      bg: 'bg-amber-50'
    },
    low: {
      label: 'Low',
      icon: <ArrowDown className="w-3.5 h-3.5 text-slate-500" />,
      color: 'text-slate-600',
      border: 'border-slate-300',
      bg: 'bg-slate-50'
    }
  };

  const statusConfigs: Record<TaskStatus, { label: string; badge: string }> = {
    todo: { label: 'Todo', badge: 'bg-slate-100 text-slate-700' },
    in_progress: { label: 'In Progress', badge: 'bg-blue-100 text-blue-700' },
    review: { label: 'Review', badge: 'bg-purple-100 text-purple-700' },
    completed: { label: 'Completed', badge: 'bg-emerald-100 text-emerald-700' }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={taskToEdit ? 'Edit Task' : 'Create New Task'}
      description="Define task details, assignee, urgency, and linked sales record."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Task Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Task Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onBlur={() => {
              setTouched(prev => ({ ...prev, title: true }));
              if (!title.trim()) setErrors(prev => ({ ...prev, title: 'Task name is required.' }));
            }}
            onChange={e => {
              setTitle(e.target.value);
              if (touched.title) setErrors(prev => ({ ...prev, title: '' }));
            }}
            placeholder="e.g. Draft Master Services Agreement (MSA) for Acme"
            className={`w-full border rounded-xl px-3.5 py-2 text-xs transition-colors ${
              errors.title && touched.title
                ? 'border-rose-300 bg-rose-50/20 text-rose-900 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                : 'bg-slate-50/50 border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
            }`}
          />
          {errors.title && touched.title && (
            <p className="mt-1 text-2xs text-rose-600 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3 h-3 shrink-0" />
              {errors.title}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
          <textarea
            rows={2}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Key deliverables, context, or notes for the assignee..."
            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
          />
        </div>

        {/* Priority Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Priority</label>
          <div className="grid grid-cols-4 gap-2">
            {(['urgent', 'high', 'medium', 'low'] as TaskPriority[]).map(p => {
              const conf = priorityConfigs[p];
              const isSelected = priority === p;
              return (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl border text-xs font-semibold transition-all ${
                    isSelected
                      ? `${conf.bg} ${conf.border} ${conf.color} ring-1 ring-offset-0 ${conf.border} shadow-2xs`
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {conf.icon}
                  <span>{conf.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Status Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Status</label>
          <div className="grid grid-cols-4 gap-2">
            {(['todo', 'in_progress', 'review', 'completed'] as TaskStatus[]).map(s => {
              const conf = statusConfigs[s];
              const isSelected = status === s;
              return (
                <button
                  type="button"
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`py-2 px-2 rounded-xl border text-xs font-semibold text-center transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600 shadow-2xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {conf.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Two Columns: Assignee & Due Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Assignee */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Assignee</label>
            <select
              value={assigneeId}
              onChange={e => setAssigneeId(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              {availableUsers.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.role})
                </option>
              ))}
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Due Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={dueDate}
              onBlur={() => {
                setTouched(prev => ({ ...prev, dueDate: true }));
                if (!dueDate) setErrors(prev => ({ ...prev, dueDate: 'Due date is required.' }));
              }}
              onChange={e => {
                setDueDate(e.target.value);
                if (touched.dueDate) setErrors(prev => ({ ...prev, dueDate: '' }));
              }}
              className={`w-full border rounded-xl px-3 py-2 text-xs transition-colors ${
                errors.dueDate && touched.dueDate
                  ? 'border-rose-300 bg-rose-50/20 text-rose-900 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                  : 'bg-slate-50/50 border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              }`}
            />
            {errors.dueDate && touched.dueDate && (
              <p className="mt-1 text-2xs text-rose-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3 shrink-0" />
                {errors.dueDate}
              </p>
            )}
          </div>
        </div>

        {/* Related Entity: Type & Specific Record */}
        <div className="space-y-2 pt-1 border-t border-slate-100">
          <label className="block text-xs font-semibold text-slate-700">
            Related Lead / Deal / Account
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'deal', label: 'Deal', icon: <Briefcase className="w-3.5 h-3.5" /> },
              { id: 'lead', label: 'Lead', icon: <Target className="w-3.5 h-3.5" /> },
              { id: 'contact', label: 'Contact', icon: <UserIcon className="w-3.5 h-3.5" /> },
              { id: 'company', label: 'Company', icon: <Building2 className="w-3.5 h-3.5" /> }
            ].map(type => (
              <button
                type="button"
                key={type.id}
                onClick={() => handleRelatedTypeChange(type.id as any)}
                className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                  relatedType === type.id
                    ? 'border-blue-600 bg-blue-50/70 text-blue-700 font-semibold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {type.icon}
                <span>{type.label}</span>
              </button>
            ))}
          </div>

          {/* Specific Record Selector */}
          <div>
            <select
              value={relatedId}
              onChange={e => setRelatedId(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              {relatedType === 'deal' &&
                deals.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.title} ({d.companyName})
                  </option>
                ))}
              {relatedType === 'lead' &&
                leads.map(l => (
                  <option key={l.id} value={l.id}>
                    {l.name} — {l.company}
                  </option>
                ))}
              {relatedType === 'contact' &&
                contacts.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.companyName}
                  </option>
                ))}
              {relatedType === 'company' &&
                companies.map(comp => (
                  <option key={comp.id} value={comp.id}>
                    {comp.name} ({comp.industry})
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            {taskToEdit ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

