import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { CalendarEvent, CalendarEventType } from '../../types';
import { useCRM } from '../../context/CRMContext';
import { formatDate } from '../../utils/formatters';
import {
  Calendar,
  Clock,
  Video,
  Phone,
  MonitorPlay,
  FileText,
  Users2,
  ExternalLink,
  Copy,
  Check,
  Edit2,
  Trash2,
  Briefcase,
  User as UserIcon,
  Building2,
  Mail,
  MapPin
} from 'lucide-react';

interface EventDetailModalProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (event: CalendarEvent) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  isOpen,
  onClose,
  onEdit
}) => {
  const { deleteEvent, contacts, deals, showToast } = useCRM();
  const [copied, setCopied] = useState(false);

  if (!event) return null;

  const handleCopyLink = () => {
    if (event.meetingLink) {
      navigator.clipboard.writeText(event.meetingLink);
      setCopied(true);
      showToast('Link Copied', 'Meeting link copied to clipboard.', 'info');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDelete = () => {
    deleteEvent(event.id);
    onClose();
  };

  // Resolve Linked Contact & Deal
  const contact = contacts.find(c => c.id === event.contactId);
  const deal = deals.find(d => d.id === event.dealId);

  // Type metadata
  const typeConfig: Record<
    CalendarEventType,
    { label: string; badge: string; icon: React.ReactNode; border: string; bg: string }
  > = {
    'Client Meeting': {
      label: 'Client Meeting',
      badge: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: <Video className="w-4 h-4 text-blue-600" />,
      border: 'border-blue-500',
      bg: 'bg-blue-50/50'
    },
    'Follow-up Call': {
      label: 'Follow-up Call',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: <Phone className="w-4 h-4 text-emerald-600" />,
      border: 'border-emerald-500',
      bg: 'bg-emerald-50/50'
    },
    'Product Demo': {
      label: 'Product Demo',
      badge: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: <MonitorPlay className="w-4 h-4 text-purple-600" />,
      border: 'border-purple-500',
      bg: 'bg-purple-50/50'
    },
    'Proposal Review': {
      label: 'Proposal Review',
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: <FileText className="w-4 h-4 text-amber-600" />,
      border: 'border-amber-500',
      bg: 'bg-amber-50/50'
    },
    'Team Meeting': {
      label: 'Team Meeting',
      badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      icon: <Users2 className="w-4 h-4 text-indigo-600" />,
      border: 'border-indigo-500',
      bg: 'bg-indigo-50/50'
    }
  };

  const config = typeConfig[event.type] || typeConfig['Client Meeting'];

  // Format date readable
  const formattedDate = formatDate(event.date);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 pt-1">
          <div className="space-y-1.5 min-w-0">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.badge}`}
            >
              {config.icon}
              <span>{config.label}</span>
            </span>
            <h3 className="text-base font-bold text-slate-900 leading-snug">
              {event.title}
            </h3>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(event);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors"
              title="Edit event"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Delete event"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Date & Time Ribbon */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
          <div className="flex items-center gap-2 text-slate-700 font-semibold">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-800">
              {event.startTime} - {event.endTime}
            </span>
            <span className="text-slate-400">({event.durationMinutes} mins)</span>
          </div>
        </div>

        {/* Video / Meeting Link Box */}
        {event.meetingLink && (
          <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Video className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-blue-950">
                  {event.location || 'Video Conference'}
                </p>
                <p className="text-[11px] text-blue-700 truncate max-w-[280px]">
                  {event.meetingLink}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleCopyLink}
                className="p-1.5 rounded-lg bg-white border border-blue-200 text-blue-700 hover:bg-blue-100/50 transition-colors text-xs font-medium flex items-center gap-1"
                title="Copy link"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>

              <a
                href={event.meetingLink}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                <span>Join Call</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}

        {/* Participants */}
        <div>
          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Participants ({event.participants.length})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {event.participants.map(p => (
              <div
                key={p.id}
                className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50/70 border border-slate-200/70"
              >
                <div className="w-7 h-7 rounded-full bg-blue-100 border border-blue-200 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                  {p.initials}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">{p.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{p.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Linked CRM Entities: Contact & Deal */}
        {(contact || event.contactName || deal || event.dealName) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            {/* Contact Card */}
            {(contact || event.contactName) && (
              <div className="p-3 rounded-xl border border-slate-200/80 bg-white shadow-2xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                  <UserIcon className="w-3.5 h-3.5 text-purple-600" />
                  <span>Related Contact</span>
                </div>
                <p className="text-xs font-bold text-slate-900 truncate">
                  {contact?.name || event.contactName}
                </p>
                {contact && (
                  <>
                    <p className="text-[11px] text-slate-500 truncate">
                      {contact.title} • {contact.companyName}
                    </p>
                    <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-600">
                      <a
                        href={`mailto:${contact.email}`}
                        className="hover:text-blue-600 flex items-center gap-1 truncate"
                      >
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span className="truncate">{contact.email}</span>
                      </a>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Deal Card */}
            {(deal || event.dealName) && (
              <div className="p-3 rounded-xl border border-slate-200/80 bg-white shadow-2xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                  <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                  <span>Related Deal</span>
                </div>
                <p className="text-xs font-bold text-slate-900 truncate">
                  {deal?.title || event.dealName}
                </p>
                {deal && (
                  <div className="flex items-center justify-between text-[11px] pt-1 text-slate-600">
                    <span className="font-bold text-slate-900">
                      ₹{deal.value.toLocaleString('en-IN')}
                    </span>
                    <span className="capitalize font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full text-[10px]">
                      {deal.stage.replace('_', ' ')}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Notes / Agenda */}
        {event.notes && (
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Notes & Agenda
            </h4>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
              {event.notes}
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
            icon={<Trash2 className="w-3.5 h-3.5" />}
          >
            Delete
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={<Edit2 className="w-3.5 h-3.5" />}
              onClick={() => {
                onClose();
                onEdit(event);
              }}
            >
              Edit Event
            </Button>
            <Button variant="primary" size="sm" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

