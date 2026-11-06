import React, { useState } from 'react';
import { CalendarEvent, CalendarEventType } from '../../types';
import { Video, Phone, MonitorPlay, FileText, Users2, Plus, Clock, ExternalLink, Calendar as CalendarIcon } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

interface MonthViewProps {
  currentYear: number;
  currentMonth: number; // 0-indexed (10 = November)
  events: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent) => void;
  onSelectDate: (dateStr: string) => void;
  onQuickAddEvent: (dateStr: string) => void;
}

export const MonthView: React.FC<MonthViewProps> = ({
  currentYear,
  currentMonth,
  events,
  onSelectEvent,
  onSelectDate,
  onQuickAddEvent
}) => {
  const [selectedMobileDate, setSelectedMobileDate] = useState<string>('2026-11-04');
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun

  // Days in previous month
  const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

  // Color & Icon mapping for Event Types
  const eventTypeStyles: Record<
    CalendarEventType,
    { bg: string; text: string; border: string; dot: string }
  > = {
    'Client Meeting': {
      bg: 'bg-blue-50 hover:bg-blue-100/70',
      text: 'text-blue-800',
      border: 'border-blue-200/80',
      dot: 'bg-blue-500'
    },
    'Follow-up Call': {
      bg: 'bg-emerald-50 hover:bg-emerald-100/70',
      text: 'text-emerald-800',
      border: 'border-emerald-200/80',
      dot: 'bg-emerald-500'
    },
    'Product Demo': {
      bg: 'bg-purple-50 hover:bg-purple-100/70',
      text: 'text-purple-800',
      border: 'border-purple-200/80',
      dot: 'bg-purple-500'
    },
    'Proposal Review': {
      bg: 'bg-amber-50 hover:bg-amber-100/70',
      text: 'text-amber-800',
      border: 'border-amber-200/80',
      dot: 'bg-amber-500'
    },
    'Team Meeting': {
      bg: 'bg-indigo-50 hover:bg-indigo-100/70',
      text: 'text-indigo-800',
      border: 'border-indigo-200/80',
      dot: 'bg-indigo-500'
    }
  };

  const getDateString = (day: number, monthOffset = 0): string => {
    let y = currentYear;
    let m = currentMonth + monthOffset;
    if (m < 0) {
      m = 11;
      y -= 1;
    } else if (m > 11) {
      m = 0;
      y += 1;
    }
    const mStr = String(m + 1).padStart(2, '0');
    const dStr = String(day).padStart(2, '0');
    return `${y}-${mStr}-${dStr}`;
  };

  const getDayEvents = (dateStr: string): CalendarEvent[] => {
    return events.filter(e => e.date === dateStr);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden select-none">
      {/* Weekday Names Header */}
      <div className="grid grid-cols-7 border-b border-slate-200/80 bg-slate-50/70 text-center text-[11px] font-bold text-slate-500 uppercase tracking-wider py-2.5">
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
      </div>

      {/* Month Days Grid */}
      <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 bg-slate-100/30">
        {/* Overflow from Previous Month */}
        {Array.from({ length: firstDayOfWeek }).map((_, index) => {
          const prevDay = prevMonthDays - firstDayOfWeek + index + 1;
          const dateStr = getDateString(prevDay, -1);
          const dayEvents = getDayEvents(dateStr);

          return (
            <div
              key={`prev-${index}`}
              onClick={() => {
                setSelectedMobileDate(dateStr);
                onSelectDate(dateStr);
              }}
              className="min-h-[50px] sm:min-h-[115px] p-1 sm:p-2 bg-slate-50/30 text-slate-300 flex flex-col justify-between cursor-pointer hover:bg-slate-50/70 transition-colors"
            >
              <span className="text-[11px] sm:text-xs font-semibold">{prevDay}</span>
              {/* Desktop view chips */}
              <div className="hidden sm:block space-y-1">
                {dayEvents.slice(0, 1).map(ev => (
                  <div
                    key={ev.id}
                    onClick={e => {
                      e.stopPropagation();
                      onSelectEvent(ev);
                    }}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 truncate opacity-60"
                  >
                    {ev.startTime} {ev.title}
                  </div>
                ))}
              </div>
              {/* Mobile event dots */}
              <div className="sm:hidden flex items-center justify-center gap-0.5 mt-0.5 flex-wrap">
                {dayEvents.slice(0, 2).map(ev => (
                  <span key={ev.id} className="w-1 h-1 rounded-full bg-slate-400" />
                ))}
              </div>
            </div>
          );
        })}

        {/* Current Month Days */}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const dayNum = index + 1;
          const dateStr = getDateString(dayNum);
          const dayEvents = getDayEvents(dateStr);
          const isToday = currentYear === 2026 && currentMonth === 10 && dayNum === 4;
          const isSelectedOnMobile = dateStr === selectedMobileDate;

          return (
            <div
              key={`day-${dayNum}`}
              onClick={() => {
                setSelectedMobileDate(dateStr);
                onSelectDate(dateStr);
              }}
              className={`min-h-[50px] sm:min-h-[115px] p-1 sm:p-2 bg-white flex flex-col justify-between cursor-pointer hover:bg-blue-50/20 transition-all group relative ${
                isToday ? 'bg-blue-50/20' : ''
              } ${isSelectedOnMobile ? 'max-sm:ring-2 max-sm:ring-blue-600 max-sm:z-10 max-sm:bg-blue-50/30' : ''}`}
            >
              {/* Day Cell Header */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-[11px] sm:text-xs font-bold w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center transition-colors ${
                    isToday
                      ? 'bg-blue-600 text-white shadow-xs'
                      : isSelectedOnMobile
                      ? 'bg-blue-100 text-blue-700 max-sm:font-extrabold'
                      : 'text-slate-700 group-hover:text-blue-600'
                  }`}
                >
                  {dayNum}
                </span>

                {/* Quick Add Button on Hover (Desktop) */}
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    onQuickAddEvent(dateStr);
                  }}
                  className="hidden sm:block opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                  title="Schedule on this date"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Desktop Event Chips List */}
              <div className="hidden sm:block space-y-1 my-1 overflow-hidden">
                {dayEvents.slice(0, 3).map(ev => {
                  const style = eventTypeStyles[ev.type] || eventTypeStyles['Client Meeting'];
                  return (
                    <div
                      key={ev.id}
                      onClick={e => {
                        e.stopPropagation();
                        onSelectEvent(ev);
                      }}
                      className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[10px] font-semibold transition-all shadow-2xs truncate ${style.bg} ${style.text} ${style.border}`}
                      title={`${ev.startTime} - ${ev.title} (${ev.type})`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
                      <span className="font-bold shrink-0">{ev.startTime}</span>
                      <span className="truncate">{ev.title}</span>
                    </div>
                  );
                })}

                {dayEvents.length > 3 && (
                  <div className="text-[10px] font-bold text-blue-600 pl-1 hover:underline">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>

              {/* Mobile Event Dots Indicator */}
              <div className="sm:hidden flex items-center justify-center gap-1 mt-1 flex-wrap">
                {dayEvents.slice(0, 3).map(ev => {
                  const style = eventTypeStyles[ev.type] || eventTypeStyles['Client Meeting'];
                  return (
                    <span
                      key={ev.id}
                      className={`w-1.5 h-1.5 rounded-full ${style.dot}`}
                      title={ev.title}
                    />
                  );
                })}
                {dayEvents.length > 3 && (
                  <span className="text-[8px] font-bold text-slate-500">+{dayEvents.length - 3}</span>
                )}
              </div>

              {/* Desktop Bottom indicator if events exist */}
              <div className="hidden sm:flex h-1 items-center gap-1">
                {dayEvents.length > 0 && (
                  <span className="text-[9px] font-semibold text-slate-400">
                    {dayEvents.length} {dayEvents.length === 1 ? 'event' : 'events'}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* Overflow for trailing days of week grid */}
        {(() => {
          const totalRendered = firstDayOfWeek + daysInMonth;
          const remainder = totalRendered % 7 === 0 ? 0 : 7 - (totalRendered % 7);
          return Array.from({ length: remainder }).map((_, index) => {
            const nextDay = index + 1;
            const dateStr = getDateString(nextDay, 1);
            const dayEvents = getDayEvents(dateStr);

            return (
              <div
                key={`next-${index}`}
                onClick={() => {
                  setSelectedMobileDate(dateStr);
                  onSelectDate(dateStr);
                }}
                className="min-h-[50px] sm:min-h-[115px] p-1 sm:p-2 bg-slate-50/30 text-slate-300 flex flex-col justify-between cursor-pointer hover:bg-slate-50/70 transition-colors"
              >
                <span className="text-[11px] sm:text-xs font-semibold">{nextDay}</span>
                {/* Desktop view chips */}
                <div className="hidden sm:block space-y-1">
                  {dayEvents.slice(0, 1).map(ev => (
                    <div
                      key={ev.id}
                      onClick={e => {
                        e.stopPropagation();
                        onSelectEvent(ev);
                      }}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 truncate opacity-60"
                    >
                      {ev.startTime} {ev.title}
                    </div>
                  ))}
                </div>
                {/* Mobile event dots */}
                <div className="sm:hidden flex items-center justify-center gap-0.5 mt-0.5 flex-wrap">
                  {dayEvents.slice(0, 2).map(ev => (
                    <span key={ev.id} className="w-1 h-1 rounded-full bg-slate-400" />
                  ))}
                </div>
              </div>
            );
          });
        })()}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          MOBILE SELECTED DAY AGENDA LIST (Underneath month grid on phones)
          ───────────────────────────────────────────────────────────── */}
      <div className="sm:hidden border-t border-slate-200/90 bg-slate-50/70 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-100 text-blue-600">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                Agenda: {formatDate(selectedMobileDate)}
              </h4>
              <p className="text-[10px] text-slate-500">Tap day above to browse schedules</p>
            </div>
          </div>
          <button
            onClick={() => onQuickAddEvent(selectedMobileDate)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold shadow-2xs"
          >
            <Plus className="w-3 h-3" />
            <span>Add</span>
          </button>
        </div>

        {getDayEvents(selectedMobileDate).length === 0 ? (
          <div className="p-4 bg-white rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400 space-y-1">
            <p>No events scheduled for this day</p>
            <button
              onClick={() => onQuickAddEvent(selectedMobileDate)}
              className="text-blue-600 font-semibold hover:underline text-[11px]"
            >
              + Tap to schedule event
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {getDayEvents(selectedMobileDate).map(ev => {
              const style = eventTypeStyles[ev.type] || eventTypeStyles['Client Meeting'];
              return (
                <div
                  key={ev.id}
                  onClick={() => onSelectEvent(ev)}
                  className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs flex flex-col gap-2 active:scale-[0.99] transition-transform cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${style.bg} ${style.text} ${style.border}`}>
                      {ev.type}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{ev.startTime} – {ev.endTime}</span>
                    </div>
                  </div>

                  <h5 className="text-xs font-bold text-slate-900 leading-snug">
                    {ev.title}
                  </h5>

                  {ev.meetingLink && (
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                      <span className="text-blue-600 font-semibold flex items-center gap-1">
                        <Video className="w-3 h-3" />
                        Google Meet Link
                      </span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

