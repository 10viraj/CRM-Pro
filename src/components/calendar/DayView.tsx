import React from 'react';
import { CalendarEvent, CalendarEventType } from '../../types';
import { formatDate } from '../../utils/formatters';
import {
  Video,
  Phone,
  MonitorPlay,
  FileText,
  Users2,
  Clock,
  ExternalLink,
  Plus,
  Briefcase,
  User as UserIcon,
  Trash2,
  Edit2,
  Calendar as CalendarIcon
} from 'lucide-react';
import { Button } from '../common/Button';

interface DayViewProps {
  currentDate: Date; // e.g. Nov 4, 2026
  events: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent) => void;
  onQuickAddEvent: (dateStr: string, timeStr?: string) => void;
  onSelectDate: (dateStr: string) => void;
}

export const DayView: React.FC<DayViewProps> = ({
  currentDate,
  events,
  onSelectEvent,
  onQuickAddEvent,
  onSelectDate
}) => {
  const y = currentDate.getFullYear();
  const m = String(currentDate.getMonth() + 1).padStart(2, '0');
  const d = String(currentDate.getDate()).padStart(2, '0');
  const dateStr = `${y}-${m}-${d}`;

  const dayEvents = events.filter(e => e.date === dateStr);

  // Hours: 8:00 to 18:00
  const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

  const formatHourLabel = (h: number): string => {
    if (h === 12) return '12:00 PM';
    return h > 12 ? `${h - 12}:00 PM` : `${h}:00 AM`;
  };

  // Day metrics
  const clientMeetingsCount = dayEvents.filter(e => e.type === 'Client Meeting').length;
  const productDemosCount = dayEvents.filter(e => e.type === 'Product Demo').length;
  const callsCount = dayEvents.filter(e => e.type === 'Follow-up Call').length;

  // Type styling
  const eventTypeStyles: Record<
    CalendarEventType,
    { bg: string; text: string; border: string; borderLeft: string; icon: React.ReactNode }
  > = {
    'Client Meeting': {
      bg: 'bg-blue-50/70',
      text: 'text-blue-900',
      border: 'border-blue-200',
      borderLeft: 'border-l-4 border-l-blue-600',
      icon: <Video className="w-4 h-4 text-blue-600" />
    },
    'Follow-up Call': {
      bg: 'bg-emerald-50/70',
      text: 'text-emerald-900',
      border: 'border-emerald-200',
      borderLeft: 'border-l-4 border-l-emerald-600',
      icon: <Phone className="w-4 h-4 text-emerald-600" />
    },
    'Product Demo': {
      bg: 'bg-purple-50/70',
      text: 'text-purple-900',
      border: 'border-purple-200',
      borderLeft: 'border-l-4 border-l-purple-600',
      icon: <MonitorPlay className="w-4 h-4 text-purple-600" />
    },
    'Proposal Review': {
      bg: 'bg-amber-50/70',
      text: 'text-amber-900',
      border: 'border-amber-200',
      borderLeft: 'border-l-4 border-l-amber-600',
      icon: <FileText className="w-4 h-4 text-amber-600" />
    },
    'Team Meeting': {
      bg: 'bg-indigo-50/70',
      text: 'text-indigo-900',
      border: 'border-indigo-200',
      borderLeft: 'border-l-4 border-l-indigo-600',
      icon: <Users2 className="w-4 h-4 text-indigo-600" />
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 items-start">
      {/* ─────────────────────────────────────────────────────────────
          LEFT COLUMN: Day Summary & Mini Agenda
          ───────────────────────────────────────────────────────────── */}
      <div className="lg:col-span-1 space-y-4">
        {/* Day Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600 font-bold text-sm">
              {currentDate.getDate()}
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {currentDate.toLocaleDateString('en-US', { weekday: 'long' })}
              </p>
              <h3 className="text-sm font-bold text-slate-900">
                {currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </h3>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-2 pt-3 text-xs">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-medium text-slate-400 block">Total Events</span>
              <span className="text-base font-extrabold text-slate-900">{dayEvents.length}</span>
            </div>
            <div className="p-2 rounded-xl bg-blue-50 border border-blue-100">
              <span className="text-[10px] font-medium text-blue-500 block">Client Meetings</span>
              <span className="text-base font-extrabold text-blue-700">{clientMeetingsCount}</span>
            </div>
            <div className="p-2 rounded-xl bg-purple-50 border border-purple-100">
              <span className="text-[10px] font-medium text-purple-500 block">Product Demos</span>
              <span className="text-base font-extrabold text-purple-700">{productDemosCount}</span>
            </div>
            <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100">
              <span className="text-[10px] font-medium text-emerald-500 block">Follow-ups</span>
              <span className="text-base font-extrabold text-emerald-700">{callsCount}</span>
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            className="w-full mt-3"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => onQuickAddEvent(dateStr)}
          >
            Schedule for Today
          </Button>
        </div>

        {/* Quick Month Jumper (Surrounding Days) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
            Quick Day Jumper
          </h4>
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {[-3, -2, -1, 0, 1, 2, 3].map(offset => {
              const d = new Date(currentDate);
              d.setDate(currentDate.getDate() + offset);
              const isSelected = offset === 0;
              const dY = d.getFullYear();
              const dM = String(d.getMonth() + 1).padStart(2, '0');
              const dD = String(d.getDate()).padStart(2, '0');
              const dStr = `${dY}-${dM}-${dD}`;
              const dayEventCount = events.filter(e => e.date === dStr).length;

              return (
                <button
                  key={offset}
                  type="button"
                  onClick={() => onSelectDate(dStr)}
                  className={`p-1.5 rounded-xl flex flex-col items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white font-bold shadow-2xs'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="text-[9px] font-medium opacity-80">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'][d.getDay()]}
                  </span>
                  <span className="text-xs font-bold mt-0.5">{d.getDate()}</span>
                  {dayEventCount > 0 && (
                    <span
                      className={`w-1 h-1 rounded-full mt-0.5 ${
                        isSelected ? 'bg-white' : 'bg-blue-600'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          MAIN AREA: Detailed Hourly Timeline (3 cols)
          ───────────────────────────────────────────────────────────── */}
      <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden select-none">
        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Hourly Schedule ({dayEvents.length} events booked)
            </h3>
          </div>
          <span className="text-[11px] text-slate-500">
            Click on any empty slot to create an event
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {hours.map(hour => {
            const hourTimeStr = `${String(hour).padStart(2, '0')}:00`;
            const matchingEvents = dayEvents.filter(e => {
              const [h] = e.startTime.split(':').map(Number);
              return h === hour;
            });

            return (
              <div
                key={hour}
                className="flex items-start min-h-[76px] hover:bg-slate-50/40 transition-colors group"
              >
                {/* Time Label on left */}
                <div className="w-24 p-3 text-right text-xs font-semibold text-slate-400 border-r border-slate-100 shrink-0">
                  {formatHourLabel(hour)}
                </div>

                {/* Event Area on right */}
                <div
                  className="flex-1 p-2.5 cursor-pointer min-h-[76px]"
                  onClick={() => onQuickAddEvent(dateStr, hourTimeStr)}
                >
                  {matchingEvents.length > 0 ? (
                    <div className="space-y-2">
                      {matchingEvents.map(ev => {
                        const style =
                          eventTypeStyles[ev.type] || eventTypeStyles['Client Meeting'];

                        return (
                          <div
                            key={ev.id}
                            onClick={e => {
                              e.stopPropagation();
                              onSelectEvent(ev);
                            }}
                            className={`p-3 rounded-xl border text-left cursor-pointer transition-all shadow-2xs hover:shadow-md ${style.bg} ${style.border} ${style.borderLeft} ${style.text}`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                              <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/90 border border-slate-200/80 text-[10px] font-bold">
                                  {style.icon}
                                  <span>{ev.type}</span>
                                </span>
                                <h4 className="text-xs font-bold text-slate-900 leading-snug">
                                  {ev.title}
                                </h4>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-[11px] font-bold text-slate-600 bg-white/80 px-2 py-0.5 rounded-md border border-slate-200/70">
                                  {ev.startTime} - {ev.endTime} ({ev.durationMinutes}m)
                                </span>
                                {ev.meetingLink && (
                                  <a
                                    href={ev.meetingLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={e => e.stopPropagation()}
                                    className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold flex items-center gap-1 transition-colors shadow-2xs"
                                  >
                                    <span>Join</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}
                              </div>
                            </div>

                            {/* Linked Info & Participants */}
                            <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-2 border-t border-slate-200/60">
                              <div className="flex flex-wrap items-center gap-2">
                                {ev.contactName && (
                                  <span className="flex items-center gap-1 text-[11px] text-slate-600 bg-white/80 px-2 py-0.5 rounded border border-slate-200/60 font-medium">
                                    <UserIcon className="w-3 h-3 text-purple-600" />
                                    <span>{ev.contactName}</span>
                                  </span>
                                )}
                                {ev.dealName && (
                                  <span className="flex items-center gap-1 text-[11px] text-slate-600 bg-white/80 px-2 py-0.5 rounded border border-slate-200/60 font-medium">
                                    <Briefcase className="w-3 h-3 text-blue-600" />
                                    <span>{ev.dealName}</span>
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-slate-400 font-medium">
                                  Participants:
                                </span>
                                <div className="flex -space-x-1">
                                  {ev.participants.map(p => (
                                    <div
                                      key={p.id}
                                      className="w-5 h-5 rounded-full bg-blue-100 border border-white text-blue-700 text-[9px] font-bold flex items-center justify-center shrink-0"
                                      title={p.name}
                                    >
                                      {p.initials}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Notes Snippet */}
                            {ev.notes && (
                              <p className="text-[11px] text-slate-500 mt-2 pl-1 italic">
                                "{ev.notes}"
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-start text-[11px] text-slate-300 group-hover:text-blue-600 transition-colors">
                      <span className="opacity-0 group-hover:opacity-100 flex items-center gap-1 font-semibold pl-1">
                        <Plus className="w-3.5 h-3.5" />
                        <span>Schedule at {formatHourLabel(hour)}</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

