import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Activity, ActivityType, TaskPriority } from '../../types';
import { useCRM } from '../../context/CRMContext';
import { Phone, Mail, Calendar, CheckSquare, FileText, Briefcase } from 'lucide-react';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: ActivityType;
}

export const ActivityModal: React.FC<ActivityModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'call'
}) => {
  const { addActivity, addTask, leads, deals, contacts, companies, availableUsers, currentUser } = useCRM();

  const [type, setType] = useState<ActivityType>(defaultType);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [relatedType, setRelatedType] = useState<'lead' | 'deal' | 'contact' | 'company'>('deal');
  const [relatedId, setRelatedId] = useState(deals[0]?.id || '');
  const [assignedToId, setAssignedToId] = useState(currentUser.id);
  const [durationMinutes, setDurationMinutes] = useState(30);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let relatedName = 'General';
    if (relatedType === 'lead') {
      const item = leads.find(l => l.id === relatedId);
      if (item) relatedName = `${item.name} (${item.company})`;
    } else if (relatedType === 'deal') {
      const item = deals.find(d => d.id === relatedId);
      if (item) relatedName = item.title;
    } else if (relatedType === 'contact') {
      const item = contacts.find(c => c.id === relatedId);
      if (item) relatedName = `${item.name} (${item.companyName})`;
    } else if (relatedType === 'company') {
      const item = companies.find(c => c.id === relatedId);
      if (item) relatedName = item.name;
    }

    const assignedTo = availableUsers.find(u => u.id === assignedToId) || currentUser;

    if (type === 'task') {
      addTask({
        title,
        description,
        dueDate,
        priority,
        status: 'todo',
        relatedTo: {
          type: relatedType,
          id: relatedId,
          name: relatedName
        },
        assignee: assignedTo
      });
    } else {
      addActivity({
        type,
        title,
        description,
        dueDate,
        completed: false,
        priority,
        relatedTo: {
          type: relatedType,
          id: relatedId,
          name: relatedName
        },
        assignedTo,
        durationMinutes: Number(durationMinutes)
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Log Activity or Schedule Task"
      description="Record customer interactions, calls, demos, or pending to-dos"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Activity Type Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Activity Type</label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {[
              { id: 'call', label: 'Call', icon: <Phone className="w-4 h-4 text-blue-600" /> },
              { id: 'email', label: 'Email', icon: <Mail className="w-4 h-4 text-emerald-600" /> },
              { id: 'meeting', label: 'Meeting', icon: <Calendar className="w-4 h-4 text-purple-600" /> },
              { id: 'note', label: 'Note', icon: <FileText className="w-4 h-4 text-amber-600" /> },
              { id: 'task', label: 'Task', icon: <CheckSquare className="w-4 h-4 text-rose-600" /> },
              { id: 'deal_update', label: 'Deal Update', icon: <Briefcase className="w-4 h-4 text-indigo-600" /> }
            ].map(item => (
              <button
                type="button"
                key={item.id}
                onClick={() => setType(item.id as ActivityType)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-semibold transition-all ${
                  type === item.id
                    ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-2xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {item.icon}
                <span className="mt-1 text-[11px] truncate w-full text-center">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Title / Subject *</label>
          <input
            type="text"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Follow-up demo call with VP of Engineering"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Associate With Record</label>
            <select
              value={relatedType}
              onChange={e => {
                const rt = e.target.value as any;
                setRelatedType(rt);
                if (rt === 'deal') setRelatedId(deals[0]?.id || '');
                if (rt === 'lead') setRelatedId(leads[0]?.id || '');
                if (rt === 'contact') setRelatedId(contacts[0]?.id || '');
                if (rt === 'company') setRelatedId(companies[0]?.id || '');
              }}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="deal">Deal Opportunity</option>
              <option value="lead">Lead</option>
              <option value="contact">Contact</option>
              <option value="company">Company</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Target Record</label>
            <select
              value={relatedId}
              onChange={e => setRelatedId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white truncate"
            >
              {relatedType === 'deal' &&
                deals.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.title}
                  </option>
                ))}
              {relatedType === 'lead' &&
                leads.map(l => (
                  <option key={l.id} value={l.id}>
                    {l.name} ({l.company})
                  </option>
                ))}
              {relatedType === 'contact' &&
                contacts.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.companyName})
                  </option>
                ))}
              {relatedType === 'company' &&
                companies.map(comp => (
                  <option key={comp.id} value={comp.id}>
                    {comp.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
            <select
              value={priority}
              onChange={e => setPriority(e.target.value as any)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Duration (Min)</label>
            <input
              type="number"
              min="5"
              step="5"
              value={durationMinutes}
              onChange={e => setDurationMinutes(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Details & Agenda</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Add relevant notes, links, or meeting goals..."
            rows={3}
            className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            Save Activity
          </Button>
        </div>
      </form>
    </Modal>
  );
};

