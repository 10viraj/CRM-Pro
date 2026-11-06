import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { CalendarEvent, CalendarEventType, User } from '../../types';
import { useCRM } from '../../context/CRMContext';
import {
  Calendar,
  Clock,
  Video,
  Phone,
  MonitorPlay,
  FileText,
  Users2,
  Briefcase,
  User as UserIcon,
  Link as LinkIcon,
  Check,
  Plus,
  X,
  AlertCircle
} from 'lucide-react';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventToEdit?: CalendarEvent | null;
  defaultDate?: string;
  defaultTime?: string;
  defaultType?: CalendarEventType;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  eventToEdit,
  defaultDate,
  defaultTime = '10:00',
  defaultType = 'Client Meeting'
}) => {
  const { addEvent, updateEvent, availableUsers, currentUser, contacts, deals, showToast } = useCRM();

  const [title, setTitle] = useState('');
  const [type, setType] = useState<CalendarEventType>(defaultType);
  const [date, setDate] = useState(
    defaultDate || new Date(2026, 10, 4).toISOString().split('T')[0]
  );
  const [startTime, setStartTime] = useState(defaultTime);
  const [durationMinutes, setDurationMinutes] = useState<number>(60);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([currentUser.id]);
  const [contactId, setContactId] = useState<string>('');
  const [dealId, setDealId] = useState<string>('');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/crm-demo');
  const [notes, setNotes] = useState('');

  // Validation States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Populate when opening or editing
  useEffect(() => {
    if (eventToEdit) {
      setTitle(eventToEdit.title);
      setType(eventToEdit.type);
      setDate(eventToEdit.date);
      setStartTime(eventToEdit.startTime);
      setDurationMinutes(eventToEdit.durationMinutes || 60);
      setSelectedUserIds(eventToEdit.participants.map(u => u.id));
      setContactId(eventToEdit.contactId || '');
      setDealId(eventToEdit.dealId || '');
      setMeetingLink(eventToEdit.meetingLink || '');
      setNotes(eventToEdit.notes || '');
    } else {
      setTitle('');
      setType(defaultType);
      setDate(defaultDate || new Date(2026, 10, 4).toISOString().split('T')[0]);
      setStartTime(defaultTime);
      setDurationMinutes(60);
      setSelectedUserIds([currentUser.id]);
      setContactId(contacts[0]?.id || '');
      setDealId(deals[0]?.id || '');
      setMeetingLink('https://meet.google.com/crm-session');
      setNotes('');
    }
  }, [eventToEdit, isOpen, defaultDate, defaultTime, defaultType, currentUser.id, contacts, deals]);

  // Calculate End Time
  const calculateEndTime = (start: string, duration: number): string => {
    const [hours, mins] = start.split(':').map(Number);
    const totalMins = hours * 60 + mins + duration;
    const endH = Math.floor(totalMins / 60) % 24;
    const endM = totalMins % 60;
    return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
  };

  const handleToggleParticipant = (userId: string) => {
    setSelectedUserIds(prev =>
      prev.includes(userId)
        ? prev.length > 1
          ? prev.filter(id => id !== userId)
          : prev
        : [...prev, userId]
    );
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) {
      errs.title = 'Event title is required.';
    } else if (title.trim().length < 3) {
      errs.title = 'Event title must be at least 3 characters.';
    }
    if (!date) {
      errs.date = 'Date is required.';
    }
    if (!startTime) {
      errs.startTime = 'Start time is required.';
    }
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ title: true, date: true, startTime: true });
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      showToast('Validation Error', 'Please complete the required event fields.', 'warning');
      return;
    }

    const participants = availableUsers.filter(u => selectedUserIds.includes(u.id));
    const selectedContact = contacts.find(c => c.id === contactId);
    const selectedDeal = deals.find(d => d.id === dealId);

    const endTime = calculateEndTime(startTime, durationMinutes);

    if (eventToEdit) {
      updateEvent(eventToEdit.id, {
        title: title.trim(),
        type,
        date,
        startTime,
        endTime,
        durationMinutes,
        participants,
        contactId: selectedContact?.id,
        contactName: selectedContact ? `${selectedContact.name} (${selectedContact.companyName})` : undefined,
        dealId: selectedDeal?.id,
        dealName: selectedDeal?.title,
        meetingLink: meetingLink.trim() || undefined,
        notes: notes.trim() || undefined,
        location: meetingLink.includes('meet.google') ? 'Google Meet' : meetingLink.includes('zoom') ? 'Zoom' : 'Video Conference'
      });
    } else {
      addEvent({
        title: title.trim(),
        type,
        date,
        startTime,
        endTime,
        durationMinutes,
        participants,
        contactId: selectedContact?.id,
        contactName: selectedContact ? `${selectedContact.name} (${selectedContact.companyName})` : undefined,
        dealId: selectedDeal?.id,
        dealName: selectedDeal?.title,
        meetingLink: meetingLink.trim() || undefined,
        notes: notes.trim() || undefined,
        location: meetingLink.includes('meet.google') ? 'Google Meet' : meetingLink.includes('zoom') ? 'Zoom' : 'Video Conference'
      });
    }

    onClose();
  };

  const eventTypes: { type: CalendarEventType; icon: React.ReactNode; color: string; bg: string; border: string }[] = [
    {
      type: 'Client Meeting',
      icon: <Video className="w-3.5 h-3.5 text-blue-600" />,
      color: 'text-blue-700',
      bg: 'bg-blue-50',
      border: 'border-blue-300'
    },
    {
      type: 'Follow-up Call',
      icon: <Phone className="w-3.5 h-3.5 text-emerald-600" />,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-300'
    },
    {
      type: 'Product Demo',
      icon: <MonitorPlay className="w-3.5 h-3.5 text-purple-600" />,
      color: 'text-purple-700',
      bg: 'bg-purple-50',
      border: 'border-purple-300'
    },
    {
      type: 'Proposal Review',
      icon: <FileText className="w-3.5 h-3.5 text-amber-600" />,
      color: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-300'
    },
    {
      type: 'Team Meeting',
      icon: <Users2 className="w-3.5 h-3.5 text-indigo-600" />,
      color: 'text-indigo-700',
      bg: 'bg-indigo-50',
      border: 'border-indigo-300'
    }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={eventToEdit ? 'Edit Calendar Event' : 'Schedule New Event'}
      description="Plan meetings, product demos, calls, and review sessions with contacts and team members."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Event Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Event Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onBlur={() => {
              setTouched(prev => ({ ...prev, title: true }));
              if (!title.trim()) setErrors(prev => ({ ...prev, title: 'Event title is required.' }));
            }}
            onChange={e => {
              setTitle(e.target.value);
              if (touched.title) setErrors(prev => ({ ...prev, title: '' }));
            }}
            placeholder="e.g. Acme Technologies — Website Development SOW & Architecture Signoff"
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

        {/* Event Type Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Event Type <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {eventTypes.map(item => {
              const isSelected = type === item.type;
              return (
                <button
                  type="button"
                  key={item.type}
                  onClick={() => setType(item.type)}
                  className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-semibold transition-all ${
                    isSelected
                      ? `${item.bg} ${item.border} ${item.color} ring-1 ring-offset-0 ${item.border} shadow-2xs`
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {item.icon}
                  <span className="truncate">{item.type}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Date, Start Time & Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Start Time */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Start Time</label>
            <input
              type="time"
              required
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Duration</label>
            <select
              value={durationMinutes}
              onChange={e => setDurationMinutes(Number(e.target.value))}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value={15}>15 mins</option>
              <option value={30}>30 mins</option>
              <option value={45}>45 mins</option>
              <option value={60}>60 mins (1 hr)</option>
              <option value={90}>90 mins (1.5 hrs)</option>
              <option value={120}>120 mins (2 hrs)</option>
            </select>
          </div>
        </div>

        {/* Participants (Multi-Select Team Members) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Participants ({selectedUserIds.length} selected)
          </label>
          <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-slate-50/70 border border-slate-200">
            {availableUsers.map(user => {
              const isSelected = selectedUserIds.includes(user.id);
              return (
                <button
                  type="button"
                  key={user.id}
                  onClick={() => handleToggleParticipant(user.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-2xs font-semibold'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center ${
                      isSelected ? 'bg-blue-800 text-white' : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {user.initials}
                  </div>
                  <span>{user.name.split(' ')[0]}</span>
                  {isSelected && <Check className="w-3 h-3 ml-0.5 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Related Contact & Related Deal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-100">
          {/* Related Contact */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Related Contact
            </label>
            <select
              value={contactId}
              onChange={e => setContactId(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="">None / Not linked</option>
              {contacts.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.companyName}
                </option>
              ))}
            </select>
          </div>

          {/* Related Deal */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Related Deal
            </label>
            <select
              value={dealId}
              onChange={e => setDealId(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="">None / Not linked</option>
              {deals.map(d => (
                <option key={d.id} value={d.id}>
                  {d.title} ({d.companyName})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Meeting Link */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Meeting Link (Google Meet, Zoom, etc.)
          </label>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="url"
              value={meetingLink}
              onChange={e => setMeetingLink(e.target.value)}
              placeholder="https://meet.google.com/xyz-abc-def"
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Notes / Agenda */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Notes / Agenda
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Agenda topics, key objectives, dial-in passcode, or client context..."
            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
          />
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            {eventToEdit ? 'Save Changes' : 'Schedule Event'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

