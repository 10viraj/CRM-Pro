import React, { useState } from 'react';
import { Drawer } from '../common/Drawer';
import { Contact, Deal, Activity, LifecycleStage, User } from '../../types';
import { useCRM } from '../../context/CRMContext';
import { formatCurrency, formatDate, formatTimeAgo, getAvatarColor } from '../../utils/formatters';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  Mail,
  Phone,
  Building2,
  User as UserIcon,
  Calendar,
  Send,
  MessageSquare,
  Trash2,
  Edit2,
  Kanban,
  Plus,
  Clock,
  CheckSquare,
  Video,
  FileText,
  Briefcase,
  Globe,
  MapPin,
  TrendingUp,
  Tag,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

interface ContactDetailDrawerProps {
  contact: Contact | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (contact: Contact) => void;
  onSelectDeal: (deal: Deal) => void;
  onOpenNewDealForContact: (contact: Contact) => void;
}

type ContactTab = 'overview' | 'activities' | 'deals' | 'tasks' | 'notes';

export const ContactDetailDrawer: React.FC<ContactDetailDrawerProps> = ({
  contact,
  isOpen,
  onClose,
  onEdit,
  onSelectDeal,
  onOpenNewDealForContact
}) => {
  const {
    deals,
    companies,
    activities,
    addActivity,
    toggleActivityCompleted,
    deleteContact,
    addNote,
    updateContact,
    availableUsers,
    currentUser,
    showToast,
    confirmAction
  } = useCRM();

  const [activeTab, setActiveTab] = useState<ContactTab>('overview');
  const [newNoteContent, setNewNoteContent] = useState('');

  // Interactive Action Modals
  const [activeModal, setActiveModal] = useState<'call' | 'email' | 'meeting' | 'task' | null>(null);

  // Modal form states
  const [callOutcome, setCallOutcome] = useState('Interested / Follow-up Needed');
  const [callNotes, setCallNotes] = useState('');

  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  const [meetingTitle, setMeetingTitle] = useState('Product Demo & Architecture Review');
  const [meetingDate, setMeetingDate] = useState(new Date().toISOString().split('T')[0]);
  const [meetingDuration, setMeetingDuration] = useState('30');

  const [taskTitle, setTaskTitle] = useState('');
  const [taskDueDate, setTaskDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [taskPriority, setTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');

  if (!contact) return null;

  // Associated company
  const company = companies.find(c => c.id === contact.companyId);

  // Associated deals (by contactId or companyId)
  const contactDeals = deals.filter(
    d => d.contactId === contact.id || d.companyId === contact.companyId
  );

  // All activities related to contact (or matching name/company)
  const contactActivities = activities.filter(
    a =>
      a.relatedTo?.id === contact.id ||
      a.relatedTo?.name?.toLowerCase().includes(contact.name.toLowerCase()) ||
      (company && a.relatedTo?.id === company.id)
  );

  // Communication activities: calls, emails, meetings
  const communicationActivities = contactActivities.filter(
    a => a.type === 'call' || a.type === 'email' || a.type === 'meeting'
  );

  // Tasks related to contact
  const contactTasks = contactActivities.filter(a => a.type === 'task');

  const handleDelete = () => {
    confirmAction({
      title: 'Delete Contact',
      message: `Are you sure you want to permanently delete ${contact.name}?`,
      confirmText: 'Delete Contact',
      variant: 'danger',
      onConfirm: () => {
        deleteContact(contact.id);
        onClose();
      }
    });
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;
    addNote('contact', contact.id, newNoteContent);
    setNewNoteContent('');
  };

  const handleReassignOwner = (newOwnerId: string) => {
    const newOwner = availableUsers.find(u => u.id === newOwnerId);
    if (newOwner) {
      updateContact(contact.id, { owner: newOwner });
      showToast('Owner Updated', `Contact reassigned to ${newOwner.name}.`, 'info');
    }
  };

  // Submit Activity Handlers
  const handleLogCallSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addActivity({
      type: 'call',
      title: `Call: ${callOutcome}`,
      dueDate: new Date().toISOString().split('T')[0],
      durationMinutes: 15,
      completed: true,
      priority: 'medium',
      description: callNotes || `Spoke with ${contact.name} (${contact.title}). Outcome: ${callOutcome}`,
      relatedTo: {
        type: 'contact',
        id: contact.id,
        name: `${contact.name} (${contact.companyName})`
      },
      assignedTo: currentUser
    });
    setCallNotes('');
    setActiveModal(null);
  };

  const handleLogEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSubject.trim()) return;
    addActivity({
      type: 'email',
      title: `Email: ${emailSubject}`,
      dueDate: new Date().toISOString().split('T')[0],
      completed: true,
      priority: 'medium',
      description: emailBody || `Sent correspondence to ${contact.email}`,
      relatedTo: {
        type: 'contact',
        id: contact.id,
        name: `${contact.name} (${contact.companyName})`
      },
      assignedTo: currentUser
    });
    setEmailSubject('');
    setEmailBody('');
    setActiveModal(null);
  };

  const handleScheduleMeetingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingTitle.trim()) return;
    addActivity({
      type: 'meeting',
      title: meetingTitle.trim(),
      dueDate: meetingDate,
      durationMinutes: Number(meetingDuration),
      completed: false,
      priority: 'high',
      description: `Meeting with ${contact.name} (${contact.title} at ${contact.companyName})`,
      relatedTo: {
        type: 'contact',
        id: contact.id,
        name: `${contact.name} (${contact.companyName})`
      },
      assignedTo: contact.owner
    });
    setActiveModal(null);
  };

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    addActivity({
      type: 'task',
      title: taskTitle.trim(),
      dueDate: taskDueDate,
      completed: false,
      priority: taskPriority,
      relatedTo: {
        type: 'contact',
        id: contact.id,
        name: `${contact.name} (${contact.companyName})`
      },
      assignedTo: contact.owner
    });
    setTaskTitle('');
    setActiveModal(null);
  };

  const lifecycleBadgeVariant = (stage: LifecycleStage) => {
    switch (stage) {
      case 'lead': return 'blue';
      case 'marketing_qualified': return 'purple';
      case 'opportunity': return 'amber';
      case 'customer': return 'emerald';
      case 'evangelist': return 'pink';
      default: return 'slate';
    }
  };

  const initials = contact.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={contact.name}
      subtitle={`${contact.title || 'Contact'} at ${contact.companyName}`}
      width="xl"
    >
      <div className="space-y-5">
        {/* 1. Header Profile Banner & Action Bar */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div
                className={`flex h-13 w-13 items-center justify-center rounded-2xl font-bold text-base border shadow-2xs shrink-0 ${getAvatarColor(
                  contact.name
                )}`}
              >
                {initials}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    {contact.name}
                  </h3>
                  <Badge variant={lifecycleBadgeVariant(contact.lifecycleStage)} size="sm">
                    {contact.lifecycleStage.replace('_', ' ')}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {contact.title} • {contact.companyName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 self-end sm:self-auto">
              <Button
                size="sm"
                variant="outline"
                icon={<Edit2 className="w-3.5 h-3.5" />}
                onClick={() => onEdit(contact)}
              >
                Edit
              </Button>
              <button
                onClick={handleDelete}
                className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                title="Delete Contact"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Communication & Deal Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-200/60">
            <a
              href={`mailto:${contact.email}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:border-blue-300 shadow-2xs transition-all"
            >
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>Send Email</span>
            </a>

            {contact.phone && (
              <a
                href={`tel:${contact.phone}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:border-blue-300 shadow-2xs transition-all"
              >
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Call ({contact.phone})</span>
              </a>
            )}

            <button
              onClick={() => setActiveModal('call')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:border-blue-300 shadow-2xs transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-blue-500" />
              <span>Log Call</span>
            </button>

            <button
              onClick={() => setActiveModal('meeting')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:border-blue-300 shadow-2xs transition-all"
            >
              <Video className="w-3.5 h-3.5 text-purple-500" />
              <span>Schedule Meeting</span>
            </button>

            <button
              onClick={() => onOpenNewDealForContact(contact)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-700 hover:bg-blue-100 shadow-2xs transition-all sm:ml-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Deal</span>
            </button>
          </div>
        </div>

        {/* 2. Tab Navigation: Overview | Activities | Deals | Tasks | Notes */}
        <div className="border-b border-slate-200">
          <div className="flex gap-2 -mb-px overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-1.5 py-2.5 px-3.5 text-xs font-semibold border-b-2 transition-all ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('activities')}
              className={`flex items-center gap-1.5 py-2.5 px-3.5 text-xs font-semibold border-b-2 transition-all ${
                activeTab === 'activities'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Activities ({communicationActivities.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('deals')}
              className={`flex items-center gap-1.5 py-2.5 px-3.5 text-xs font-semibold border-b-2 transition-all ${
                activeTab === 'deals'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Deals ({contactDeals.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex items-center gap-1.5 py-2.5 px-3.5 text-xs font-semibold border-b-2 transition-all ${
                activeTab === 'tasks'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Tasks ({contactTasks.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('notes')}
              className={`flex items-center gap-1.5 py-2.5 px-3.5 text-xs font-semibold border-b-2 transition-all ${
                activeTab === 'notes'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Notes ({contact.notes?.length || 0})</span>
            </button>
          </div>
        </div>

        {/* 3. TAB 1: OVERVIEW (Personal and Company Information) */}
        {activeTab === 'overview' && (
          <div className="space-y-5">
            {/* Personal Information */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                Personal Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Direct Email
                  </span>
                  <a
                    href={`mailto:${contact.email}`}
                    className="font-bold text-blue-600 hover:underline truncate block mt-1"
                  >
                    {contact.email}
                  </a>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Direct Phone
                  </span>
                  {contact.phone ? (
                    <a
                      href={`tel:${contact.phone}`}
                      className="font-bold text-slate-900 hover:text-blue-600 hover:underline block mt-1"
                    >
                      {contact.phone}
                    </a>
                  ) : (
                    <span className="text-slate-400 font-medium block mt-1">Not provided</span>
                  )}
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Job Title & Role
                  </span>
                  <p className="font-bold text-slate-900 mt-1">{contact.title || 'Executive'}</p>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Assigned Account Owner
                  </span>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
                      {contact.owner.initials}
                    </span>
                    <select
                      value={contact.owner.id}
                      onChange={e => handleReassignOwner(e.target.value)}
                      className="text-xs font-bold text-slate-900 bg-transparent border-none p-0 focus:ring-0 cursor-pointer"
                    >
                      {availableUsers.map(u => (
                        <option key={u.id} value={u.id}>
                          {u.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {contact.tags && contact.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {contact.tags.map(tag => (
                    <Badge key={tag} variant="blue" size="sm">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Company Information */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                Company & Organization
              </h4>
              {company ? (
                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-slate-900">{company.name}</h5>
                        <p className="text-xs text-slate-500">{company.industry}</p>
                      </div>
                    </div>
                    <Badge variant="blue" size="sm">
                      {company.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-[11px] text-slate-400">Domain</span>
                      <p className="font-semibold text-slate-800 mt-0.5">{company.domain}</p>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-400">Headquarters</span>
                      <p className="font-semibold text-slate-800 mt-0.5">{company.location}</p>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-400">Annual Revenue</span>
                      <p className="font-semibold text-slate-800 mt-0.5">
                        {formatCurrency(company.annualRevenue)}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
                  <p className="text-xs font-semibold text-slate-900">{contact.companyName}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Associated company profile</p>
                </div>
              )}
            </div>

            {/* Activity Timestamps */}
            <div className="flex items-center justify-between text-xs text-slate-400 p-3 bg-slate-50 rounded-xl border border-slate-200/60">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Created on {formatDate(contact.createdAt)}
              </span>
              <span>
                Last active {contact.lastActivityDate ? formatTimeAgo(contact.lastActivityDate) : 'recently'}
              </span>
            </div>
          </div>
        )}

        {/* 4. TAB 2: ACTIVITIES (Calls, emails, meetings) */}
        {activeTab === 'activities' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Communication History
              </span>
              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  icon={<Phone className="w-3.5 h-3.5" />}
                  onClick={() => setActiveModal('call')}
                >
                  Log Call
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  icon={<Mail className="w-3.5 h-3.5" />}
                  onClick={() => setActiveModal('email')}
                >
                  Log Email
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  icon={<Video className="w-3.5 h-3.5" />}
                  onClick={() => setActiveModal('meeting')}
                >
                  Schedule Meeting
                </Button>
              </div>
            </div>

            {communicationActivities.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <Phone className="w-8 h-8 text-slate-300 mx-auto" />
                <p>No phone calls, meetings, or emails logged for this contact yet.</p>
                <Button
                  size="sm"
                  variant="primary"
                  icon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => setActiveModal('call')}
                >
                  Log First Call
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {communicationActivities.map(act => (
                  <div
                    key={act.id}
                    className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs hover:border-blue-300 transition-all flex items-start gap-3"
                  >
                    <div className="p-2 rounded-lg bg-slate-50 text-blue-600 shrink-0">
                      {act.type === 'call' && <Phone className="w-4 h-4 text-blue-600" />}
                      {act.type === 'email' && <Mail className="w-4 h-4 text-emerald-600" />}
                      {act.type === 'meeting' && <Video className="w-4 h-4 text-purple-600" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h5 className="text-xs font-bold text-slate-900 truncate">
                          {act.title}
                        </h5>
                        <span className="text-[11px] text-slate-400">
                          {act.dueDate ? formatDate(act.dueDate) : formatTimeAgo(act.createdAt)}
                        </span>
                      </div>
                      {act.description && (
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {act.description}
                        </p>
                      )}
                      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-100">
                        <span>Logged by {act.assignedTo?.name || 'Viraj Somani'}</span>
                        {act.durationMinutes && <span>Duration: {act.durationMinutes} min</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 5. TAB 3: DEALS (Associated deals) */}
        {activeTab === 'deals' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Associated Pipeline Deals ({contactDeals.length})
              </span>
              <Button
                size="sm"
                variant="primary"
                icon={<Plus className="w-3.5 h-3.5" />}
                onClick={() => onOpenNewDealForContact(contact)}
              >
                Create Deal
              </Button>
            </div>

            {contactDeals.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <Kanban className="w-8 h-8 text-slate-300 mx-auto" />
                <p>No active pipeline deals associated with this contact yet.</p>
                <Button
                  size="sm"
                  variant="outline"
                  icon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => onOpenNewDealForContact(contact)}
                >
                  Create Opportunity
                </Button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {contactDeals.map(d => (
                  <div
                    key={d.id}
                    onClick={() => onSelectDeal(d)}
                    className="p-3.5 bg-white rounded-xl border border-slate-200/80 hover:border-blue-400 hover:shadow-xs cursor-pointer transition-all flex items-center justify-between gap-3 group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {d.title}
                        </p>
                        <Badge
                          variant={
                            d.stage === 'won'
                              ? 'emerald'
                              : d.stage === 'lost'
                              ? 'slate'
                              : 'blue'
                          }
                          size="sm"
                        >
                          {d.stage.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500">
                        <span>Close: {formatDate(d.expectedCloseDate)}</span>
                        <span>•</span>
                        <span>Probability: {d.probability}%</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-sm font-extrabold text-slate-900 block">
                        {formatCurrency(d.value)}
                      </span>
                      <span className="text-[10px] text-blue-600 font-semibold group-hover:underline">
                        View Pipeline →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 6. TAB 4: TASKS (Assigned tasks) */}
        {activeTab === 'tasks' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Assigned Follow-up Tasks ({contactTasks.length})
              </span>
              <Button
                size="sm"
                variant="primary"
                icon={<Plus className="w-3.5 h-3.5" />}
                onClick={() => setActiveModal('task')}
              >
                Add Task
              </Button>
            </div>

            {contactTasks.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <CheckSquare className="w-8 h-8 text-slate-300 mx-auto" />
                <p>No follow-up tasks currently assigned for this contact.</p>
                <Button
                  size="sm"
                  variant="outline"
                  icon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => setActiveModal('task')}
                >
                  Assign Task
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {contactTasks.map(task => (
                  <div
                    key={task.id}
                    className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex items-start gap-3 hover:border-slate-300 transition-all"
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleActivityCompleted(task.id)}
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-xs font-bold ${
                            task.completed ? 'line-through text-slate-400' : 'text-slate-900'
                          }`}
                        >
                          {task.title}
                        </span>
                        <Badge
                          variant={
                            task.priority === 'high'
                              ? 'rose'
                              : task.priority === 'medium'
                              ? 'amber'
                              : 'slate'
                          }
                          size="sm"
                        >
                          {task.priority}
                        </Badge>
                      </div>
                      {task.description && (
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                          {task.description}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-400">
                        {task.dueDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> Due {formatDate(task.dueDate)}
                          </span>
                        )}
                        <span>Assigned to {task.assignedTo?.name || 'Viraj Somani'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 7. TAB 5: NOTES (Internal notes) */}
        {activeTab === 'notes' && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-slate-500" />
              <span>Internal Team Notes ({contact.notes?.length || 0})</span>
            </h4>

            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="space-y-2">
              <textarea
                value={newNoteContent}
                onChange={e => setNewNoteContent(e.target.value)}
                placeholder="Log internal context, decision authority, or conversation summary..."
                rows={3}
                className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  size="sm"
                  variant="primary"
                  icon={<Send className="w-3.5 h-3.5" />}
                  disabled={!newNoteContent.trim()}
                >
                  Save Note
                </Button>
              </div>
            </form>

            {/* Notes List */}
            <div className="space-y-3 pt-2">
              {(!contact.notes || contact.notes.length === 0) ? (
                <p className="text-xs text-slate-400 text-center py-4 bg-slate-50 rounded-xl">
                  No internal notes logged on this contact yet.
                </p>
              ) : (
                contact.notes.map(note => (
                  <div
                    key={note.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs"
                  >
                    <div className="flex items-center justify-between text-slate-500 mb-1">
                      <span className="font-semibold text-slate-800">{note.author.name}</span>
                      <span className="text-[11px]">{formatTimeAgo(note.createdAt)}</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {note.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: LOG CALL */}
      {activeModal === 'call' && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-5 max-w-md w-full border border-slate-200 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Log Phone Call with {contact.name}</h3>
            <form onSubmit={handleLogCallSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Call Outcome</label>
                <select
                  value={callOutcome}
                  onChange={e => setCallOutcome(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Interested / Follow-up Needed">Interested / Follow-up Needed</option>
                  <option value="Executive Pitch Completed">Executive Pitch Completed</option>
                  <option value="Proposal Requested">Proposal Requested</option>
                  <option value="Left Voicemail">Left Voicemail</option>
                  <option value="Busy / Callback Requested">Busy / Callback Requested</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Call Notes</label>
                <textarea
                  rows={3}
                  value={callNotes}
                  onChange={e => setCallNotes(e.target.value)}
                  placeholder="Key discussion points, budget holder updates..."
                  className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button size="sm" variant="outline" onClick={() => setActiveModal(null)}>
                  Cancel
                </Button>
                <Button size="sm" variant="primary" type="submit">
                  Log Call
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: LOG EMAIL */}
      {activeModal === 'email' && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-5 max-w-md w-full border border-slate-200 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Record Email to {contact.name}</h3>
            <form onSubmit={handleLogEmailSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SOW & Proposal Follow-up"
                  value={emailSubject}
                  onChange={e => setEmailSubject(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Body / Summary</label>
                <textarea
                  rows={3}
                  value={emailBody}
                  onChange={e => setEmailBody(e.target.value)}
                  placeholder="Email contents, questions asked, or commitments made..."
                  className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button size="sm" variant="outline" onClick={() => setActiveModal(null)}>
                  Cancel
                </Button>
                <Button size="sm" variant="primary" type="submit">
                  Record Email
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: SCHEDULE MEETING */}
      {activeModal === 'meeting' && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-5 max-w-md w-full border border-slate-200 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Schedule Meeting with {contact.name}</h3>
            <form onSubmit={handleScheduleMeetingSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Meeting Title *</label>
                <input
                  type="text"
                  required
                  value={meetingTitle}
                  onChange={e => setMeetingTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={meetingDate}
                    onChange={e => setMeetingDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Duration (Min)</label>
                  <select
                    value={meetingDuration}
                    onChange={e => setMeetingDuration(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="15">15 Minutes</option>
                    <option value="30">30 Minutes</option>
                    <option value="45">45 Minutes</option>
                    <option value="60">60 Minutes</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button size="sm" variant="outline" onClick={() => setActiveModal(null)}>
                  Cancel
                </Button>
                <Button size="sm" variant="primary" type="submit">
                  Book Meeting
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: ADD TASK */}
      {activeModal === 'task' && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-5 max-w-md w-full border border-slate-200 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Add Task for {contact.name}</h3>
            <form onSubmit={handleAddTaskSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Follow up on technical evaluation"
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={e => setTaskDueDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={e => setTaskPriority(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button size="sm" variant="outline" onClick={() => setActiveModal(null)}>
                  Cancel
                </Button>
                <Button size="sm" variant="primary" type="submit">
                  Save Task
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Drawer>
  );
};
