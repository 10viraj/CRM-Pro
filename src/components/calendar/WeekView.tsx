import React from 'react';
import { CalendarEvent, CalendarEventType } from '../../types';
import {
  Video,
  Phone,
  MonitorPlay,
  FileText,
  Users2,
  Clock,
  ExternalLink,
  Plus
} from 'lucide-react';

interface WeekViewProps {
  currentDate: Date; // e.g. Nov 4, 2026
  events: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent) => void;
  onQuickAddEvent: (dateStr: string, timeStr?: string) => void;
}

export const WeekView: React.FC<WeekViewProps> = ({
  currentDate,
  events,
  onSelectEvent,
  onQuickAddEvent
}) => {
  // Compute start of week (Sunday)
  const currentDayOfWeek = currentDate.getDay(); // 0 = Sun
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDayOfWeek);

  // Array of 7 days
  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return {
      date: d,
      dateStr: `${y}-${m}-${day}`,
      dayNum: d.getDate(),
      dayName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()],
      isToday: y === 2026 && d.getMonth() === 10 && d.getDate() === 4
    };
  });

  // Hours array from 8:00 to 18:00 (8 AM to 6 PM)
  const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

  const formatHourLabel = (h: number): string => {
    if (h === 12) return '12 PM';
    return h > 12 ? `${h - 12} PM` : `${h} AM`;
  };

  const getEventsForDay = (dateStr: string): CalendarEvent[] => {
    return events.filter(e => e.date === dateStr);
  };

  // Color & Icon mapping
  const eventTypeStyles: Record<
    CalendarEventType,
    { bg: string; text: string; border: string; icon: React.ReactNode; borderLeft: string }
  > = {
    'Client Meeting': {
      bg: 'bg-blue-50/90 hover:bg-blue-100',
      text: 'text-blue-900',
      border: 'border-blue-200',
      borderLeft: 'border-l-4 border-l-blue-600',
      icon: <Video className="w-3 h-3 text-blue-600 shrink-0" />
    },
    'Follow-up Call': {
      bg: 'bg-emerald-50/90 hover:bg-emerald-100',
      text: 'text-emerald-900',
      border: 'border-emerald-200',
      borderLeft: 'border-l-4 border-l-emerald-600',
      icon: <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
    },
    'Product Demo': {
      bg: 'bg-purple-50/90 hover:bg-purple-100',
      text: 'text-purple-900',
      border: 'border-purple-200',
      borderLeft: 'border-l-4 border-l-purple-600',
      icon: <MonitorPlay className="w-3 h-3 text-purple-600 shrink-0" />
    },
    'Proposal Review': {
      bg: 'bg-amber-50/90 hover:bg-amber-100',
      text: 'text-amber-900',
      border: 'border-amber-200',
      borderLeft: 'border-l-4 border-l-amber-600',
      icon: <FileText className="w-3 h-3 text-amber-600 shrink-0" />
    },
    'Team Meeting': {
      bg: 'bg-indigo-50/90 hover:bg-indigo-100',
      text: 'text-indigo-900',
      border: 'border-indigo-200',
      borderLeft: 'border-l-4 border-l-indigo-600',
      icon: <Users2 className="w-3 h-3 text-indigo-600 shrink-0" />
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden select-none">
      {/* Top Header: Days of the Week */}
      <div className="grid grid-cols-8 border-b border-slate-200/80 bg-slate-50/80">
        {/* Time Column header */}
        <div className="py-3 px-2 border-r border-slate-200/80 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Time
        </div>

        {/* 7 Day Headers */}
        {weekDays.map(day => (
          <div
            key={day.dateStr}
            className={`py-2.5 px-2 text-center border-r border-slate-200/80 last:border-r-0 transition-colors ${
              day.isToday ? 'bg-blue-50/50' : ''
            }`}
          >
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {day.dayName}
            </p>
            <div className="mt-1 flex items-center justify-center">
              <span
                className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                  day.isToday
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-800'
                }`}
              >
                {day.dayNum}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Grid: Time Rows */}
      <div className="divide-y divide-slate-100 max-h-[640px] overflow-y-auto">
        {hours.map(hour => {
          const hourTimeStr = `${String(hour).padStart(2, '0')}:00`;

          return (
            <div key={hour} className="grid grid-cols-8 min-h-[68px]">
              {/* Left Time Label */}
              <div className="py-2 px-2 text-right pr-3 border-r border-slate-100 text-[11px] font-semibold text-slate-400 shrink-0 select-none">
                {formatHourLabel(hour)}
              </div>

              {/* 7 Days Columns for this hour */}
              {weekDays.map(day => {
                const dayEvents = getEventsForDay(day.dateStr);

                // Events that start in this hour
                const matchingEvents = dayEvents.filter(e => {
                  const [h] = e.startTime.split(':').map(Number);
                  return h === hour;
                });

                return (
                  <div
                    key={`${day.dateStr}-${hour}`}
                    onClick={() => onQuickAddEvent(day.dateStr, hourTimeStr)}
                    className={`p-1 border-r border-slate-100 last:border-r-0 hover:bg-blue-50/15 transition-colors relative group cursor-pointer ${
                      day.isToday ? 'bg-blue-50/10' : ''
                    }`}
                  >
                    {/* Matching Events in this hour slot */}
                    <div className="space-y-1">
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
                            className={`p-1.5 rounded-lg border text-left cursor-pointer transition-all shadow-2xs hover:shadow-sm ${style.bg} ${style.border} ${style.borderLeft} ${style.text}`}
                            title={`${ev.title} (${ev.startTime} - ${ev.endTime})`}
                          >
                            <div className="flex items-center justify-between gap-1 mb-0.5">
                              <span className="text-[10px] font-bold flex items-center gap-1 truncate">
                                {style.icon}
                                <span className="truncate">{ev.type}</span>
                              </span>
                              <span className="text-[9px] font-bold text-slate-500 shrink-0">
                                {ev.startTime}
                              </span>
                            </div>

                            <p className="text-[11px] font-bold leading-tight truncate">
                              {ev.title}
                            </p>

                            {(ev.contactName || ev.dealName) && (
                              <p className="text-[9px] text-slate-500 truncate mt-0.5 font-medium">
                                {ev.contactName || ev.dealName}
                              </p>
                            )}

                            {/* Participant Avatars */}
                            <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-200/50">
                              <div className="flex -space-x-1">
                                {ev.participants.slice(0, 3).map(p => (
                                  <div
                                    key={p.id}
                                    className="w-4 h-4 rounded-full bg-blue-100 border border-white text-blue-700 text-[8px] font-bold flex items-center justify-center shrink-0"
                                    title={p.name}
                                  >
                                    {p.initials}
                                  </div>
                                ))}
                              </div>

                              {ev.meetingLink && (
                                <span className="text-[9px] font-bold text-blue-600 bg-white/80 px-1 py-0.2 rounded border border-blue-200/60">
                                  Video
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Quick + button on empty hover */}
                    {matchingEvents.length === 0 && (
                      <div className="opacity-0 group-hover:opacity-100 flex items-center justify-center h-full text-slate-300 hover:text-blue-600 transition-opacity">
                        <Plus className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

