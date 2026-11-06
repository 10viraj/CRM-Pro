import React, { useState, useMemo } from 'react';
import { useCRM } from '../../context/CRMContext';
import { CalendarEvent, CalendarEventType } from '../../types';
import { Button } from '../common/Button';
import { MonthView } from './MonthView';
import { WeekView } from './WeekView';
import { DayView } from './DayView';
import { EventModal } from './EventModal';
import { EventDetailModal } from './EventDetailModal';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Video,
  Phone,
  MonitorPlay,
  FileText,
  Users2,
  Filter,
  CheckCircle2,
  CalendarDays,
  CalendarRange,
  Clock
} from 'lucide-react';

interface CalendarViewProps {
  onOpenNewActivity?: () => void;
}

type CalendarViewMode = 'month' | 'week' | 'day';

export const CalendarView: React.FC<CalendarViewProps> = () => {
  const { events } = useCRM();

  // Active view: Month, Week, Day
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month');

  // Active Simulated Date: Nov 4, 2026 (Wednesday)
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 10, 4));

  // Filter by event type
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [eventToEdit, setEventToEdit] = useState<CalendarEvent | null>(null);

  // Defaults for Create Modal
  const [modalDefaultDate, setModalDefaultDate] = useState<string | undefined>(undefined);
  const [modalDefaultTime, setModalDefaultTime] = useState<string>('10:00');

  // Filtered Events
  const filteredEvents = useMemo(() => {
    if (typeFilter === 'all') return events;
    return events.filter(e => e.type === typeFilter);
  }, [events, typeFilter]);

  // Date Navigation handlers
  const handlePrev = () => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      if (viewMode === 'month') {
        d.setMonth(d.getMonth() - 1);
      } else if (viewMode === 'week') {
        d.setDate(d.getDate() - 7);
      } else {
        d.setDate(d.getDate() - 1);
      }
      return d;
    });
  };

  const handleNext = () => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      if (viewMode === 'month') {
        d.setMonth(d.getMonth() + 1);
      } else if (viewMode === 'week') {
        d.setDate(d.getDate() + 7);
      } else {
        d.setDate(d.getDate() + 1);
      }
      return d;
    });
  };

  const handleGoToday = () => {
    setCurrentDate(new Date(2026, 10, 4));
  };

  // Header Title based on view
  const getHeaderTitle = (): string => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    if (viewMode === 'month') {
      return `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    }
    if (viewMode === 'week') {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      const sM = monthNames[startOfWeek.getMonth()].slice(0, 3);
      const eM = monthNames[endOfWeek.getMonth()].slice(0, 3);
      if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
        return `${sM} ${startOfWeek.getDate()} – ${endOfWeek.getDate()}, ${startOfWeek.getFullYear()}`;
      }
      return `${sM} ${startOfWeek.getDate()} – ${eM} ${endOfWeek.getDate()}, ${endOfWeek.getFullYear()}`;
    }
    return currentDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Select Event -> Open Details Modal
  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsDetailModalOpen(true);
  };

  // Select Date in Month -> Switch to Day view for that date
  const handleSelectDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    setCurrentDate(new Date(y, m - 1, d));
    setViewMode('day');
  };

  // Quick Add Event on specific date/time
  const handleQuickAddEvent = (dateStr: string, timeStr = '10:00') => {
    setEventToEdit(null);
    setModalDefaultDate(dateStr);
    setModalDefaultTime(timeStr);
    setIsCreateModalOpen(true);
  };

  // Open Edit Event from Detail Modal
  const handleEditEvent = (event: CalendarEvent) => {
    setEventToEdit(event);
    setIsCreateModalOpen(true);
  };

  // Open Standard Create Event Modal
  const handleOpenCreateEvent = () => {
    setEventToEdit(null);
    const y = currentDate.getFullYear();
    const m = String(currentDate.getMonth() + 1).padStart(2, '0');
    const d = String(currentDate.getDate()).padStart(2, '0');
    setModalDefaultDate(`${y}-${m}-${d}`);
    setModalDefaultTime('10:00');
    setIsCreateModalOpen(true);
  };

  // Event Type Counts
  const clientMeetingCount = events.filter(e => e.type === 'Client Meeting').length;
  const followUpCount = events.filter(e => e.type === 'Follow-up Call').length;
  const demoCount = events.filter(e => e.type === 'Product Demo').length;
  const proposalReviewCount = events.filter(e => e.type === 'Proposal Review').length;
  const teamMeetingCount = events.filter(e => e.type === 'Team Meeting').length;

  return (
    <div className="space-y-4">
      {/* ─────────────────────────────────────────────────────────────
          1. Header: Page Title, Metrics & Top Actions
          ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Sales Calendar
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
              {events.length} scheduled events
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your schedule, executive demos, discovery calls, and team review sessions
          </p>
        </div>

        {/* View Mode Switcher & + Schedule Event */}
        <div className="flex items-center gap-2.5">
          {/* Month / Week / Day Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode('month')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'month'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Month View"
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Month</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('week')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'week'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Week View"
            >
              <CalendarRange className="w-3.5 h-3.5" />
              <span>Week</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('day')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'day'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Day View"
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Day</span>
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={handleOpenCreateEvent}
          >
            Create Event
          </Button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. Event Types Filter Ribbon
          ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Client Meeting */}
        <button
          type="button"
          onClick={() => setTypeFilter(typeFilter === 'Client Meeting' ? 'all' : 'Client Meeting')}
          className={`p-3 rounded-2xl border text-left transition-all ${
            typeFilter === 'Client Meeting'
              ? 'bg-blue-50/80 border-blue-400 ring-1 ring-blue-400 shadow-2xs'
              : 'bg-white border-slate-200/80 hover:bg-slate-50/70 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between text-blue-600 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Client Meeting</span>
            <Video className="w-3.5 h-3.5" />
          </div>
          <div className="text-lg font-extrabold text-slate-900">{clientMeetingCount}</div>
        </button>

        {/* Follow-up Call */}
        <button
          type="button"
          onClick={() => setTypeFilter(typeFilter === 'Follow-up Call' ? 'all' : 'Follow-up Call')}
          className={`p-3 rounded-2xl border text-left transition-all ${
            typeFilter === 'Follow-up Call'
              ? 'bg-emerald-50/80 border-emerald-400 ring-1 ring-emerald-400 shadow-2xs'
              : 'bg-white border-slate-200/80 hover:bg-slate-50/70 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between text-emerald-600 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Follow-up Call</span>
            <Phone className="w-3.5 h-3.5" />
          </div>
          <div className="text-lg font-extrabold text-slate-900">{followUpCount}</div>
        </button>

        {/* Product Demo */}
        <button
          type="button"
          onClick={() => setTypeFilter(typeFilter === 'Product Demo' ? 'all' : 'Product Demo')}
          className={`p-3 rounded-2xl border text-left transition-all ${
            typeFilter === 'Product Demo'
              ? 'bg-purple-50/80 border-purple-400 ring-1 ring-purple-400 shadow-2xs'
              : 'bg-white border-slate-200/80 hover:bg-slate-50/70 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between text-purple-600 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Product Demo</span>
            <MonitorPlay className="w-3.5 h-3.5" />
          </div>
          <div className="text-lg font-extrabold text-slate-900">{demoCount}</div>
        </button>

        {/* Proposal Review */}
        <button
          type="button"
          onClick={() => setTypeFilter(typeFilter === 'Proposal Review' ? 'all' : 'Proposal Review')}
          className={`p-3 rounded-2xl border text-left transition-all ${
            typeFilter === 'Proposal Review'
              ? 'bg-amber-50/80 border-amber-400 ring-1 ring-amber-400 shadow-2xs'
              : 'bg-white border-slate-200/80 hover:bg-slate-50/70 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between text-amber-600 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Proposal Review</span>
            <FileText className="w-3.5 h-3.5" />
          </div>
          <div className="text-lg font-extrabold text-slate-900">{proposalReviewCount}</div>
        </button>

        {/* Team Meeting */}
        <button
          type="button"
          onClick={() => setTypeFilter(typeFilter === 'Team Meeting' ? 'all' : 'Team Meeting')}
          className={`col-span-2 sm:col-span-1 p-3 rounded-2xl border text-left transition-all ${
            typeFilter === 'Team Meeting'
              ? 'bg-indigo-50/80 border-indigo-400 ring-1 ring-indigo-400 shadow-2xs'
              : 'bg-white border-slate-200/80 hover:bg-slate-50/70 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between text-indigo-600 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Team Meeting</span>
            <Users2 className="w-3.5 h-3.5" />
          </div>
          <div className="text-lg font-extrabold text-slate-900">{teamMeetingCount}</div>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. Date Range Navigation Bar
          ───────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={handlePrev}
              className="p-1.5 hover:bg-slate-50 text-slate-600 transition-colors border-r border-slate-200"
              title="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="p-1.5 hover:bg-slate-50 text-slate-600 transition-colors"
              title="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <Button variant="ghost" size="sm" onClick={handleGoToday}>
            Today
          </Button>

          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            {getHeaderTitle()}
          </h3>
        </div>

        {/* Filter Indicator / Reset */}
        <div className="flex items-center gap-2">
          {typeFilter !== 'all' && (
            <span className="text-xs text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5">
              <span>Showing: {typeFilter}</span>
              <button
                onClick={() => setTypeFilter('all')}
                className="text-blue-500 hover:text-blue-900"
              >
                ×
              </button>
            </span>
          )}

          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 font-medium focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Event Types</option>
            <option value="Client Meeting">Client Meeting</option>
            <option value="Follow-up Call">Follow-up Call</option>
            <option value="Product Demo">Product Demo</option>
            <option value="Proposal Review">Proposal Review</option>
            <option value="Team Meeting">Team Meeting</option>
          </select>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. Active View Rendering: Month, Week, or Day
          ───────────────────────────────────────────────────────────── */}
      {viewMode === 'month' && (
        <MonthView
          currentYear={currentDate.getFullYear()}
          currentMonth={currentDate.getMonth()}
          events={filteredEvents}
          onSelectEvent={handleSelectEvent}
          onSelectDate={handleSelectDate}
          onQuickAddEvent={handleQuickAddEvent}
        />
      )}

      {viewMode === 'week' && (
        <WeekView
          currentDate={currentDate}
          events={filteredEvents}
          onSelectEvent={handleSelectEvent}
          onQuickAddEvent={handleQuickAddEvent}
        />
      )}

      {viewMode === 'day' && (
        <DayView
          currentDate={currentDate}
          events={filteredEvents}
          onSelectEvent={handleSelectEvent}
          onQuickAddEvent={handleQuickAddEvent}
          onSelectDate={dateStr => {
            const [y, m, d] = dateStr.split('-').map(Number);
            setCurrentDate(new Date(y, m - 1, d));
          }}
        />
      )}

      {/* ─────────────────────────────────────────────────────────────
          5. Event Details Modal (Clicked Event)
          ───────────────────────────────────────────────────────────── */}
      <EventDetailModal
        event={selectedEvent}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onEdit={handleEditEvent}
      />

      {/* ─────────────────────────────────────────────────────────────
          6. Create / Edit Event Modal
          ───────────────────────────────────────────────────────────── */}
      <EventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        eventToEdit={eventToEdit}
        defaultDate={modalDefaultDate}
        defaultTime={modalDefaultTime}
        defaultType={typeFilter !== 'all' ? (typeFilter as CalendarEventType) : 'Client Meeting'}
      />
    </div>
  );
};
