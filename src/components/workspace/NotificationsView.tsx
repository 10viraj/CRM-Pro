import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import { NotificationPreferencesModal } from '../notifications/NotificationPreferencesModal';
import {
  Bell,
  CheckCheck,
  Kanban,
  UserPlus,
  Calendar,
  CheckSquare,
  Mail,
  Search,
  Filter,
  SlidersHorizontal,
  Trash2,
  Check,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ExternalLink,
  PlusCircle,
  Inbox,
  Clock,
  Layers
} from 'lucide-react';
import { AppNotification, NotificationType, ViewType } from '../../types';

export const NotificationsView: React.FC = () => {
  const {
    notifications,
    markNotificationAsRead,
    toggleNotificationRead,
    deleteNotification,
    clearAllNotifications,
    markAllNotificationsAsRead,
    addNotification,
    setActiveView,
    confirmAction
  } = useCRM();

  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'lead' | 'meeting' | 'deal' | 'task' | 'email'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Filtered notifications
  const filteredNotifications = notifications.filter(n => {
    // Tab filter
    if (activeTab === 'unread' && n.read) return false;
    if (activeTab !== 'all' && activeTab !== 'unread' && n.type !== activeTab) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = n.title.toLowerCase().includes(q);
      const matchDesc = n.description.toLowerCase().includes(q);
      const matchCategory = n.category?.toLowerCase().includes(q);
      return matchTitle || matchDesc || matchCategory;
    }

    return true;
  });

  // Simulator Presets matching the exact 5 examples
  const simulatorPresets: Array<{
    label: string;
    icon: string;
    title: string;
    description: string;
    type: NotificationType;
    linkTarget: { view: ViewType; id?: string };
  }> = [
    {
      label: 'New Lead Assigned',
      icon: '🔔',
      title: 'New lead assigned to you',
      description: 'Rohit Verma (Acme Technologies, Score: 92) was assigned to you by Maya Patel.',
      type: 'lead',
      linkTarget: { view: 'leads', id: 'lead-1' }
    },
    {
      label: 'Meeting Starts in 30m',
      icon: '📅',
      title: 'Meeting starts in 30 minutes',
      description: 'Client Demo with Dr. Clara Thorne from Pulse Health AI begins at 3:00 PM via Google Meet.',
      type: 'meeting',
      linkTarget: { view: 'calendar' }
    },
    {
      label: 'Deal to Negotiation',
      icon: '💰',
      title: 'Deal moved to Negotiation',
      description: 'Acme Technologies — Website Development (₹1,80,000) was moved to Negotiation stage.',
      type: 'deal',
      linkTarget: { view: 'deals', id: 'deal-acme' }
    },
    {
      label: 'Task Completed',
      icon: '✅',
      title: 'Task completed',
      description: 'Alex Rivera marked "Draft Master Services Agreement (MSA) for Acme Technologies" as completed.',
      type: 'task',
      linkTarget: { view: 'tasks' }
    },
    {
      label: 'New Customer Email',
      icon: '📧',
      title: 'New customer email',
      description: 'Sarah Williams replied: "Thanks for the proposal, our VP signed off on the enterprise tier."',
      type: 'email',
      linkTarget: { view: 'contacts', id: 'contact-1' }
    }
  ];

  const handleSimulate = (preset: typeof simulatorPresets[0]) => {
    addNotification({
      title: preset.title,
      description: preset.description,
      type: preset.type,
      linkTarget: preset.linkTarget,
      category: 'Live Alert'
    });
    setIsSimulatorOpen(false);
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'lead':
        return {
          icon: UserPlus,
          bg: 'bg-blue-50 text-blue-600 border-blue-200/80',
          dotBg: 'bg-blue-600',
          tag: 'Lead Alert'
        };
      case 'meeting':
        return {
          icon: Calendar,
          bg: 'bg-purple-50 text-purple-600 border-purple-200/80',
          dotBg: 'bg-purple-600',
          tag: 'Calendar'
        };
      case 'deal':
        return {
          icon: Kanban,
          bg: 'bg-emerald-50 text-emerald-600 border-emerald-200/80',
          dotBg: 'bg-emerald-600',
          tag: 'Pipeline'
        };
      case 'task':
        return {
          icon: CheckSquare,
          bg: 'bg-amber-50 text-amber-600 border-amber-200/80',
          dotBg: 'bg-amber-600',
          tag: 'Task'
        };
      case 'email':
        return {
          icon: Mail,
          bg: 'bg-indigo-50 text-indigo-600 border-indigo-200/80',
          dotBg: 'bg-indigo-600',
          tag: 'Email Inbox'
        };
      default:
        return {
          icon: Bell,
          bg: 'bg-slate-50 text-slate-600 border-slate-200/80',
          dotBg: 'bg-slate-500',
          tag: 'System'
        };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ─────────────────────────────────────────────────────────────
          PAGE HEADER: Title, Unread Count & Main Actions
          ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Notification Center
            </h1>
            {unreadCount > 0 ? (
              <span className="text-2xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200/80 animate-pulse">
                {unreadCount} unread
              </span>
            ) : (
              <span className="text-2xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                All caught up
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time activity alerts on assigned leads, meeting reminders, deal updates, and inbox events
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Simulator Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsSimulatorOpen(!isSimulatorOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-blue-200 bg-blue-50/70 hover:bg-blue-100/80 text-blue-700 transition-colors shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Simulate Alert ▾</span>
            </button>

            {isSimulatorOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-200 bg-white shadow-dropdown z-50 p-2 animate-scale-up">
                <div className="px-2.5 py-1.5 border-b border-slate-100 text-2xs font-bold uppercase tracking-wider text-slate-400">
                  Trigger Example Alert
                </div>
                <div className="mt-1 space-y-1">
                  {simulatorPresets.map(preset => (
                    <button
                      key={preset.label}
                      onClick={() => handleSimulate(preset)}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 text-left rounded-xl hover:bg-slate-50 text-xs font-medium text-slate-700 hover:text-slate-900 transition-colors"
                    >
                      <span className="text-sm">{preset.icon}</span>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 truncate">{preset.label}</p>
                        <p className="text-2xs text-slate-400 truncate">{preset.title}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Preferences Button */}
          <button
            onClick={() => setIsPreferencesOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-2xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <span>Preferences</span>
          </button>

          {/* Mark All as Read */}
          {unreadCount > 0 && (
            <button
              onClick={markAllNotificationsAsRead}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-2xs"
            >
              <CheckCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Mark All Read</span>
            </button>
          )}

          {/* Clear All */}
          {notifications.length > 0 && (
            <button
              onClick={() => {
                confirmAction({
                  title: 'Clear All Notifications',
                  message: 'Are you sure you want to clear all alerts from your notification feed?',
                  confirmText: 'Clear All Alerts',
                  variant: 'danger',
                  onConfirm: clearAllNotifications
                });
              }}
              title="Clear all notifications"
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          FILTER BAR & SEARCH CONTROLS
          ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Category Tab Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-white text-blue-600 shadow-2xs border border-slate-200/80 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            All ({notifications.length})
          </button>

          <button
            onClick={() => setActiveTab('unread')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'unread'
                ? 'bg-white text-blue-600 shadow-2xs border border-slate-200/80 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            Unread
            {unreadCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('lead')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'lead'
                ? 'bg-white text-blue-600 shadow-2xs border border-slate-200/80 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            🔔 Leads
          </button>

          <button
            onClick={() => setActiveTab('meeting')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'meeting'
                ? 'bg-white text-blue-600 shadow-2xs border border-slate-200/80 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            📅 Meetings
          </button>

          <button
            onClick={() => setActiveTab('deal')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'deal'
                ? 'bg-white text-blue-600 shadow-2xs border border-slate-200/80 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            💰 Deals
          </button>

          <button
            onClick={() => setActiveTab('task')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'task'
                ? 'bg-white text-blue-600 shadow-2xs border border-slate-200/80 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            ✅ Tasks
          </button>

          <button
            onClick={() => setActiveTab('email')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'email'
                ? 'bg-white text-blue-600 shadow-2xs border border-slate-200/80 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            📧 Emails
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search alerts by title or description..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200/90 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 placeholder-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-2xs text-slate-400 hover:text-slate-600 absolute right-3 top-1/2 -translate-y-1/2 font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          NOTIFICATIONS FEED LIST
          ───────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden divide-y divide-slate-100">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No notifications found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {searchQuery
                ? `No alerts matching "${searchQuery}". Try a different keyword.`
                : activeTab === 'unread'
                ? "You've read all your notifications! Click 'All' or simulate a new alert."
                : 'No alerts in this category.'}
            </p>
          </div>
        ) : (
          filteredNotifications.map(item => {
            const iconConfig = getNotificationIcon(item.type);
            const Icon = iconConfig.icon;

            return (
              <div
                key={item.id}
                className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-all group ${
                  !item.read
                    ? 'bg-blue-50/30 hover:bg-blue-50/50'
                    : 'bg-white hover:bg-slate-50/70'
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  {/* Category Themed Icon */}
                  <div
                    className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${iconConfig.bg}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="min-w-0">
                    {/* Header Row: Title + Unread indicator + Tag */}
                    <div className="flex flex-wrap items-center gap-2">
                      <h4
                        className={`text-xs sm:text-sm font-bold tracking-tight ${
                          !item.read ? 'text-blue-950 font-extrabold' : 'text-slate-800'
                        }`}
                      >
                        {item.title}
                      </h4>

                      {!item.read && (
                        <span
                          className={`w-2 h-2 rounded-full ${iconConfig.dotBg} animate-pulse shrink-0`}
                          title="Unread"
                        />
                      )}

                      <span className="text-2xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/60">
                        {item.category || iconConfig.tag}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Footer: Time + Direct Target View Link */}
                    <div className="flex items-center gap-3 mt-2 text-2xs text-slate-400">
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3" />
                        {item.time}
                      </span>

                      {item.linkTarget && (
                        <button
                          onClick={() => {
                            markNotificationAsRead(item.id);
                            setActiveView(item.linkTarget!.view);
                          }}
                          className="font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline transition-colors"
                        >
                          <span>Open in {item.linkTarget.view}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Quick Actions (Read/Unread Toggle & Delete) */}
                <div className="flex items-center gap-1 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => toggleNotificationRead(item.id)}
                    title={item.read ? 'Mark as unread' : 'Mark as read'}
                    className={`p-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                      item.read
                        ? 'border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                        : 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'
                    }`}
                  >
                    {item.read ? <EyeOff className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => deleteNotification(item.id)}
                    title="Dismiss alert"
                    className="p-1.5 rounded-lg border border-transparent text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          NOTIFICATION PREFERENCES MODAL
          ───────────────────────────────────────────────────────────── */}
      <NotificationPreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
      />
    </div>
  );
};
