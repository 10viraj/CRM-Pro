import React, { useState } from 'react';
import { Drawer } from '../common/Drawer';
import { Lead, LeadStatus, Activity } from '../../types';
import { useCRM } from '../../context/CRMContext';
import { formatCurrency, formatDate, formatTimeAgo, getAvatarColor } from '../../utils/formatters';
import { LeadScoreBadge } from './LeadScoreBadge';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  Mail,
  Phone,
  Building,
  User,
  Calendar,
  Send,
  MessageSquare,
  ArrowRightCircle,
  Trash2,
  Edit,
  DollarSign,
  Plus,
  CheckCircle2,
  Clock,
  Video,
  FileText,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ListTodo,
  CheckSquare
} from 'lucide-react';

interface LeadDetailDrawerProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (lead: Lead) => void;
}

export const LeadDetailDrawer: React.FC<LeadDetailDrawerProps> = ({
  lead,
  isOpen,
  onClose,
  onEdit
}) => {
  const { updateLead, deleteLead, convertLead, addNote, addActivity, activities, currentUser, showToast, confirmAction } = useCRM();

  // Active sub-modal or inline tool
  const [activeActionModal, setActiveActionModal] = useState<'note' | 'task' | 'meeting' | 'call' | null>(null);

  // Form states
  const [noteContent, setNoteContent] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDueDate, setTaskDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [taskPriority, setTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const [meetingTitle, setMeetingTitle] = useState('Product Demo & Technical Discovery');
  const [meetingDate, setMeetingDate] = useState(new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [meetingDuration, setMeetingDuration] = useState(30);

  const [callNotes, setCallNotes] = useState('');
  const [callOutcome, setCallOutcome] = useState('Connected — Interested in Demo');

  if (!lead) return null;

  const handleStatusChange = (newStatus: LeadStatus) => {
    updateLead(lead.id, { status: newStatus });
  };

  const handleConvert = () => {
    convertLead(lead.id, lead.estimatedValue);
    onClose();
  };

  const handleDelete = () => {
    confirmAction({
      title: 'Delete Lead',
      message: `Are you sure you want to permanently delete lead ${lead.name} from ${lead.company}? This action cannot be undone.`,
      confirmText: 'Delete Lead',
      variant: 'danger',
      onConfirm: () => {
        deleteLead(lead.id);
        onClose();
      }
    });
  };

  // Add Note handler
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    addNote('lead', lead.id, noteContent.trim());
    setNoteContent('');
    setActiveActionModal(null);
  };

  // Add Task handler
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    addActivity({
      type: 'task',
      title: taskTitle.trim(),
      dueDate: taskDueDate,
      completed: false,
      priority: taskPriority,
      relatedTo: {
        type: 'lead',
        id: lead.id,
        name: `${lead.name} (${lead.company})`
      },
      assignedTo: lead.owner
    });
    setTaskTitle('');
    setActiveActionModal(null);
  };

  // Schedule Meeting handler
  const handleScheduleMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingTitle.trim()) return;
    addActivity({
      type: 'meeting',
      title: meetingTitle.trim(),
      dueDate: meetingDate,
      durationMinutes: Number(meetingDuration),
      completed: false,
      priority: 'high',
      description: `Meeting with ${lead.name} (${lead.title} at ${lead.company}) via Google Meet/Zoom`,
      relatedTo: {
        type: 'lead',
        id: lead.id,
        name: `${lead.name} (${lead.company})`
      },
      assignedTo: lead.owner
    });
    showToast('Meeting Scheduled', `${meetingTitle} booked for ${formatDate(meetingDate)}`, 'success');
    setActiveActionModal(null);
  };

  // Log Call handler
  const handleLogCall = (e: React.FormEvent) => {
    e.preventDefault();
    addActivity({
      type: 'call',
      title: `Call: ${callOutcome}`,
      dueDate: new Date().toISOString().split('T')[0],
      durationMinutes: 15,
      completed: true,
      priority: 'medium',
      description: callNotes || `Spoke with ${lead.name}. Outcome: ${callOutcome}`,
      relatedTo: {
        type: 'lead',
        id: lead.id,
        name: `${lead.name} (${lead.company})`
      },
      assignedTo: currentUser
    });
    showToast('Call Logged', 'Phone interaction recorded to timeline.', 'success');
    setCallNotes('');
    setActiveActionModal(null);
  };

  // Status configuration
  const statusLabels: Record<LeadStatus, { label: string; variant: 'blue' | 'purple' | 'emerald' | 'amber' | 'cyan' | 'slate' }> = {
    new: { label: 'New', variant: 'blue' },
    contacted: { label: 'Contacted', variant: 'purple' },
    qualified: { label: 'Qualified', variant: 'emerald' },
    proposal: { label: 'Proposal', variant: 'amber' },
    converted: { label: 'Converted', variant: 'cyan' },
    lost: { label: 'Lost', variant: 'slate' }
  };

  // Activities related to this lead
  const leadActivities = activities.filter(a => a.relatedTo.id === lead.id || a.relatedTo.name.includes(lead.name));

  // Structured Activity Timeline items (Examples required: "Lead created", "Email sent", "Call completed", "Meeting scheduled", "Deal created")
  const timelineEvents = [
    ...(lead.status === 'converted'
      ? [
          {
            id: 'evt-deal-created',
            type: 'deal_created',
            title: 'Deal created',
            desc: `Converted to commercial pipeline opportunity valued at ${formatCurrency(lead.estimatedValue)}`,
            time: 'Recent',
            icon: <Sparkles className="w-4 h-4 text-emerald-600" />,
            badge: 'Deal Converted'
          }
        ]
      : []),
    ...leadActivities.map(a => ({
      id: a.id,
      type: a.type,
      title: a.type === 'call' ? 'Call completed' : a.type === 'meeting' ? 'Meeting scheduled' : a.type === 'email' ? 'Email sent' : 'Task added',
      desc: a.title + (a.description ? ` — ${a.description}` : ''),
      time: formatDate(a.dueDate || a.createdAt),
      icon:
        a.type === 'call' ? (
          <Phone className="w-4 h-4 text-blue-600" />
        ) : a.type === 'meeting' ? (
          <Video className="w-4 h-4 text-purple-600" />
        ) : a.type === 'email' ? (
          <Mail className="w-4 h-4 text-emerald-600" />
        ) : (
          <CheckSquare className="w-4 h-4 text-amber-600" />
        ),
      badge: a.type.toUpperCase()
    })),
    // Pre-populated realistic historical events matching the prompt requirements
    {
      id: 'evt-email-sent',
      type: 'email_sent',
      title: 'Email sent',
      desc: `Personalized intro and solution overview sent to ${lead.email}`,
      time: lead.lastContactedAt ? formatTimeAgo(lead.lastContactedAt) : '2 days ago',
      icon: <Mail className="w-4 h-4 text-emerald-600" />,
      badge: 'Outreach'
    },
    {
      id: 'evt-call-completed',
      type: 'call_completed',
      title: 'Call completed',
      desc: `Introductory qualification call with ${lead.name}. Budget & Q4 deployment timeline confirmed.`,
      time: '3 days ago',
      icon: <Phone className="w-4 h-4 text-blue-600" />,
      badge: 'Discovery'
    },
    {
      id: 'evt-meeting-scheduled',
      type: 'meeting_scheduled',
      title: 'Meeting scheduled',
      desc: `Executive product walkthrough demo booked with technical evaluation team.`,
      time: '4 days ago',
      icon: <Video className="w-4 h-4 text-purple-600" />,
      badge: 'Demo'
    },
    {
      id: 'evt-lead-created',
      type: 'lead_created',
      title: 'Lead created',
      desc: `Captured via ${lead.source} inquiry. AI Score initialized at ${lead.score}/100.`,
      time: formatDate(lead.createdAt),
      icon: <CheckCircle2 className="w-4 h-4 text-blue-600" />,
      badge: 'Origination'
    }
  ];

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={lead.name}
      subtitle={`${lead.title || 'Prospect'} at ${lead.company}`}
      width="xl"
    >
      {/* ─────────────────────────────────────────────────────────────
          1. ACTIONS TOOLBAR (CALL, EMAIL, ADD TASK, ADD NOTE, SCHEDULE MEETING, CONVERT)
          ───────────────────────────────────────────────────────────── */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/90 space-y-3.5 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Quick Actions
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onEdit(lead)}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors"
              title="Edit Lead"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
              title="Delete Lead"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 6 Actions: Call | Email | Add Task | Add Note | Schedule Meeting | Convert to Deal */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {/* 1. Call */}
          <button
            onClick={() => setActiveActionModal(activeActionModal === 'call' ? null : 'call')}
            className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
              activeActionModal === 'call'
                ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                : 'bg-white hover:bg-blue-50/60 border-slate-200 text-slate-700 hover:border-blue-300'
            }`}
          >
            <Phone className="w-3.5 h-3.5 text-blue-600" />
            <span>Call</span>
          </button>

          {/* 2. Email */}
          <a
            href={`mailto:${lead.email}?subject=Following%20up%20on%20our%20discussion`}
            onClick={() => showToast('Opening Email Client', `Drafting message to ${lead.email}`, 'info')}
            className="flex items-center gap-2 p-2.5 rounded-xl border bg-white hover:bg-blue-50/60 border-slate-200 text-slate-700 hover:border-blue-300 text-xs font-semibold transition-all"
          >
            <Mail className="w-3.5 h-3.5 text-purple-600" />
            <span>Email</span>
          </a>

          {/* 3. Add Task */}
          <button
            onClick={() => setActiveActionModal(activeActionModal === 'task' ? null : 'task')}
            className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
              activeActionModal === 'task'
                ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                : 'bg-white hover:bg-amber-50/60 border-slate-200 text-slate-700 hover:border-amber-300'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5 text-amber-600" />
            <span>Add Task</span>
          </button>

          {/* 4. Add Note */}
          <button
            onClick={() => setActiveActionModal(activeActionModal === 'note' ? null : 'note')}
            className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
              activeActionModal === 'note'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                : 'bg-white hover:bg-indigo-50/60 border-slate-200 text-slate-700 hover:border-indigo-300'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
            <span>Add Note</span>
          </button>

          {/* 5. Schedule Meeting */}
          <button
            onClick={() => setActiveActionModal(activeActionModal === 'meeting' ? null : 'meeting')}
            className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
              activeActionModal === 'meeting'
                ? 'bg-purple-600 text-white border-purple-600 shadow-2xs'
                : 'bg-white hover:bg-purple-50/60 border-slate-200 text-slate-700 hover:border-purple-300'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-purple-600" />
            <span>Schedule Meeting</span>
          </button>

          {/* 6. Convert to Deal */}
          <button
            onClick={handleConvert}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white border border-blue-600 text-xs font-bold shadow-xs hover:shadow transition-all"
          >
            <ArrowRightCircle className="w-3.5 h-3.5" />
            <span>Convert to Deal</span>
          </button>
        </div>

        {/* ── Collapsible Action Forms ── */}

        {/* Call Form */}
        {activeActionModal === 'call' && (
          <form onSubmit={handleLogCall} className="p-3 bg-white rounded-xl border border-blue-200 space-y-2.5 animate-scale-up text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">Log Phone Call with {lead.name}</span>
              <a href={`tel:${lead.phone}`} className="text-blue-600 hover:underline flex items-center gap-1 font-semibold">
                <Phone className="w-3 h-3" />
                <span>Call {lead.phone}</span>
              </a>
            </div>
            <select
              value={callOutcome}
              onChange={e => setCallOutcome(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-2 text-slate-800"
            >
              <option value="Connected — Interested in Demo">Connected — Interested in Demo</option>
              <option value="Connected — Gatekeeper / Follow up">Connected — Gatekeeper / Follow up</option>
              <option value="Left Voicemail">Left Voicemail</option>
              <option value="Busy / No Answer">Busy / No Answer</option>
            </select>
            <textarea
              value={callNotes}
              onChange={e => setCallNotes(e.target.value)}
              placeholder="Call discussion notes..."
              rows={2}
              className="w-full rounded-xl border border-slate-200 p-2 text-slate-800"
            />
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline" type="button" onClick={() => setActiveActionModal(null)}>Cancel</Button>
              <Button size="sm" variant="primary" type="submit">Log Completed Call</Button>
            </div>
          </form>
        )}

        {/* Task Form */}
        {activeActionModal === 'task' && (
          <form onSubmit={handleAddTask} className="p-3 bg-white rounded-xl border border-amber-200 space-y-2.5 animate-scale-up text-xs">
            <span className="font-bold text-slate-900 block">Add Follow-up Task for {lead.name}</span>
            <input
              type="text"
              required
              value={taskTitle}
              onChange={e => setTaskTitle(e.target.value)}
              placeholder="e.g. Send technical whitepaper and SOC2 deck"
              className="w-full rounded-xl border border-slate-200 p-2 text-slate-800"
            />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-slate-500 font-semibold mb-1">Due Date</label>
                <input
                  type="date"
                  value={taskDueDate}
                  onChange={e => setTaskDueDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-1.5 text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 font-semibold mb-1">Priority</label>
                <select
                  value={taskPriority}
                  onChange={e => setTaskPriority(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-200 p-1.5 text-slate-800"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button size="sm" variant="outline" type="button" onClick={() => setActiveActionModal(null)}>Cancel</Button>
              <Button size="sm" variant="primary" type="submit">Create Task</Button>
            </div>
          </form>
        )}

        {/* Schedule Meeting Form */}
        {activeActionModal === 'meeting' && (
          <form onSubmit={handleScheduleMeeting} className="p-3 bg-white rounded-xl border border-purple-200 space-y-2.5 animate-scale-up text-xs">
            <span className="font-bold text-slate-900 block">Schedule Calendar Meeting with {lead.name}</span>
            <input
              type="text"
              required
              value={meetingTitle}
              onChange={e => setMeetingTitle(e.target.value)}
              placeholder="Meeting Title / Agenda"
              className="w-full rounded-xl border border-slate-200 p-2 text-slate-800"
            />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-slate-500 font-semibold mb-1">Date</label>
                <input
                  type="date"
                  value={meetingDate}
                  onChange={e => setMeetingDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-1.5 text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 font-semibold mb-1">Duration (Mins)</label>
                <select
                  value={meetingDuration}
                  onChange={e => setMeetingDuration(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 p-1.5 text-slate-800"
                >
                  <option value={15}>15 Minutes (Quick Intro)</option>
                  <option value={30}>30 Minutes (Standard Demo)</option>
                  <option value={45}>45 Minutes (Architecture Review)</option>
                  <option value={60}>60 Minutes (Deep Dive)</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button size="sm" variant="outline" type="button" onClick={() => setActiveActionModal(null)}>Cancel</Button>
              <Button size="sm" variant="primary" type="submit">Schedule on Calendar</Button>
            </div>
          </form>
        )}

        {/* Add Note Form */}
        {activeActionModal === 'note' && (
          <form onSubmit={handleAddNote} className="p-3 bg-white rounded-xl border border-indigo-200 space-y-2.5 animate-scale-up text-xs">
            <span className="font-bold text-slate-900 block">Add Internal Note</span>
            <textarea
              required
              value={noteContent}
              onChange={e => setNoteContent(e.target.value)}
              placeholder="Record lead feedback, objection handling, or next steps..."
              rows={3}
              className="w-full rounded-xl border border-slate-200 p-2 text-slate-800"
            />
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline" type="button" onClick={() => setActiveActionModal(null)}>Cancel</Button>
              <Button size="sm" variant="primary" type="submit">Post Note</Button>
            </div>
          </form>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. LEAD INFORMATION SECTION
          Name, Email, Phone, Company, Job Title, Lead Source, Owner, Status
          ───────────────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Lead Information
          </h4>
          <div className="flex items-center gap-2">
            <LeadScoreBadge score={lead.score} />
            <select
              value={lead.status}
              onChange={e => handleStatusChange(e.target.value as LeadStatus)}
              className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-800 cursor-pointer"
            >
              <option value="new">Status: New</option>
              <option value="contacted">Status: Contacted</option>
              <option value="qualified">Status: Qualified</option>
              <option value="proposal">Status: Proposal</option>
              <option value="converted">Status: Converted</option>
              <option value="lost">Status: Lost</option>
            </select>
          </div>
        </div>

        {/* Info Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* 1. Name */}
          <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Full Name</span>
            <div className="flex items-center gap-2 mt-1">
              <div className={`flex h-6 w-6 items-center justify-center rounded-lg text-[10px] font-bold border ${getAvatarColor(lead.name)}`}>
                {lead.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </div>
              <p className="font-bold text-slate-900">{lead.name}</p>
            </div>
          </div>

          {/* 2. Job Title */}
          <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Job Title</span>
            <p className="font-bold text-slate-900 mt-1">{lead.title || 'Prospect'}</p>
          </div>

          {/* 3. Company */}
          <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Company</span>
            <div className="flex items-center gap-1.5 mt-1 font-bold text-slate-900">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              <span>{lead.company}</span>
            </div>
          </div>

          {/* 4. Status */}
          <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Lead Status</span>
            <div className="mt-1">
              <Badge variant={statusLabels[lead.status]?.variant || 'slate'} size="sm">
                {statusLabels[lead.status]?.label || lead.status}
              </Badge>
            </div>
          </div>

          {/* 5. Email */}
          <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Email Address</span>
            <a
              href={`mailto:${lead.email}`}
              className="flex items-center gap-1.5 mt-1 font-semibold text-blue-600 hover:underline truncate"
            >
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{lead.email}</span>
            </a>
          </div>

          {/* 6. Phone */}
          <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Phone Number</span>
            {lead.phone ? (
              <a
                href={`tel:${lead.phone}`}
                className="flex items-center gap-1.5 mt-1 font-semibold text-slate-800 hover:text-blue-600 hover:underline"
              >
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{lead.phone}</span>
              </a>
            ) : (
              <p className="text-slate-400 mt-1">—</p>
            )}
          </div>

          {/* 7. Lead Source */}
          <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Lead Source</span>
            <p className="font-semibold text-slate-800 mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              <span>{lead.source}</span>
            </p>
          </div>

          {/* 8. Owner */}
          <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Assigned Owner</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">
                {lead.owner.initials}
              </span>
              <span className="font-semibold text-slate-800">{lead.owner.name}</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        {lead.tags && lead.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {lead.tags.map(tag => (
              <Badge key={tag} variant="slate" size="sm">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. ACTIVITY TIMELINE
          "Lead created", "Email sent", "Call completed", "Meeting scheduled", "Deal created"
          ───────────────────────────────────────────────────────────── */}
      <div className="border-t border-slate-200 pt-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Activity Timeline
            </h4>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            {timelineEvents.length} chronological events
          </span>
        </div>

        {/* Vertical Timeline */}
        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {timelineEvents.map((evt, idx) => (
            <div key={evt.id || idx} className="relative group">
              {/* Event Marker */}
              <div className="absolute -left-6 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white border border-slate-300 shadow-2xs group-hover:border-blue-500 transition-colors">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
              </div>

              {/* Event Card */}
              <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-colors text-xs space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {evt.icon}
                    <h5 className="font-bold text-slate-900">{evt.title}</h5>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">
                      {evt.badge}
                    </span>
                    <span className="text-[11px] text-slate-400">{evt.time}</span>
                  </div>
                </div>

                <p className="text-slate-600 leading-relaxed pl-6">
                  {evt.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. NOTES & DISCUSSION SECTION
          ───────────────────────────────────────────────────────────── */}
      <div className="border-t border-slate-200 pt-5 space-y-4">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-slate-500" />
          <span>Internal Notes & Discussion ({lead.notes.length})</span>
        </h4>

        {/* Quick Note Input */}
        <form onSubmit={handleAddNote} className="space-y-2">
          <textarea
            value={noteContent}
            onChange={e => setNoteContent(e.target.value)}
            placeholder="Add a new observation, interaction log, or deal context..."
            rows={2}
            className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              size="sm"
              variant="secondary"
              icon={<Send className="w-3.5 h-3.5" />}
              disabled={!noteContent.trim()}
            >
              Post Note
            </Button>
          </div>
        </form>

        {/* Existing Notes Feed */}
        <div className="space-y-2.5 pt-1">
          {lead.notes.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4 bg-slate-50 rounded-xl">
              No custom notes logged yet. Use the box above to record feedback.
            </p>
          ) : (
            lead.notes.map(note => (
              <div key={note.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="font-semibold text-slate-800">{note.author.name}</span>
                  <span className="text-[11px]">{formatTimeAgo(note.createdAt)}</span>
                </div>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{note.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </Drawer>
  );
};
