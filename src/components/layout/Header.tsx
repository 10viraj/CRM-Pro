import React, { useState, useRef, useEffect } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Button } from '../common/Button';
import {
  Menu,
  Bell,
  Plus,
  Search,
  HelpCircle,
  ChevronRight,
  UserPlus,
  Kanban,
  Users,
  Building2,
  CheckSquare,
  Keyboard,
  BookOpen,
  Headphones,
  Sparkles,
  LogOut,
  RotateCcw,
  Check,
  UserCheck,
  ExternalLink,
  ChevronDown,
  Mail,
  Calendar,
  SlidersHorizontal,
  Lock,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { ViewType } from '../../types';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  onOpenNewLead: () => void;
  onOpenNewDeal: () => void;
  onOpenNewContact: () => void;
  onOpenNewActivity: () => void;
  onOpenNewCompany: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileMenu,
  onOpenNewLead,
  onOpenNewDeal,
  onOpenNewContact,
  onOpenNewActivity,
  onOpenNewCompany
}) => {
  const {
    activeView,
    setActiveView,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    currentUser,
    setCurrentUser,
    availableUsers,
    setIsCommandPaletteOpen,
    resetToMockData,
    resetToZero,
    logout,
    showToast,
    isRefreshing,
    refreshData,
    setIsLoading,
    setSimulatedError,
    setIsShortcutsOpen
  } = useCRM();

  // Dropdown states
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Click outside refs
  const quickAddRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const helpRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (quickAddRef.current && !quickAddRef.current.contains(e.target as Node)) {
        setIsQuickAddOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (helpRef.current && !helpRef.current.contains(e.target as Node)) {
        setIsHelpOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Page titles and breadcrumbs mapping
  const getBreadcrumbInfo = (view: ViewType): { section: string; title: string } => {
    switch (view) {
      case 'dashboard':
        return { section: 'Overview', title: 'Dashboard' };
      case 'leads':
        return { section: 'Pipeline', title: 'Leads' };
      case 'deals':
        return { section: 'Pipeline', title: 'Deals Pipeline' };
      case 'contacts':
        return { section: 'Directory', title: 'Contacts' };
      case 'companies':
        return { section: 'Directory', title: 'Companies' };
      case 'tasks':
        return { section: 'Activities', title: 'Tasks' };
      case 'calendar':
        return { section: 'Activities', title: 'Calendar' };
      case 'activities':
        return { section: 'Activities', title: 'Activities Feed' };
      case 'reports':
        return { section: 'Analytics', title: 'Reports' };
      case 'settings':
        return { section: 'System', title: 'Settings' };
      case 'team':
        return { section: 'Workspace', title: 'Team' };
      case 'notifications':
        return { section: 'Workspace', title: 'Notifications' };
      case 'integrations':
        return { section: 'Workspace', title: 'Integrations' };
      case 'components':
        return { section: 'Design System', title: 'UI Components' };
      default:
        return { section: 'Workspace', title: 'CRM Pro' };
    }
  };

  const breadcrumb = getBreadcrumbInfo(activeView);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/90 bg-white/95 backdrop-blur-sm px-4 lg:px-7 select-none gap-3">
      {/* ─────────────────────────────────────────────────────────────
          LEFT: Mobile Menu + Breadcrumb + Current Page Title
          ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 min-w-0 shrink-0">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col min-w-0">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
            <span
              onClick={() => setActiveView('dashboard')}
              className="hover:text-blue-600 cursor-pointer transition-colors"
            >
              CRM Pro
            </span>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className="text-slate-500">{breadcrumb.section}</span>
            <ChevronRight className="w-3 h-3 text-slate-300 hidden sm:inline" />
            <span className="text-slate-700 font-semibold hidden sm:inline truncate max-w-[120px]">
              {breadcrumb.title}
            </span>
          </nav>

          {/* Current Page Title */}
          <h1 className="text-base font-bold text-slate-900 tracking-tight truncate leading-tight">
            {breadcrumb.title}
          </h1>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          CENTER: Global Search
          Placeholder: "Search leads, contacts, deals..."
          ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 max-w-xl mx-2 sm:mx-4 flex justify-center">
        <button
          type="button"
          onClick={() => setIsCommandPaletteOpen(true)}
          className="w-full max-w-md flex items-center justify-between px-3.5 py-2 text-xs font-medium text-slate-400 bg-slate-50 hover:bg-slate-100/90 border border-slate-200/90 hover:border-slate-300 rounded-xl transition-all shadow-2xs group text-left"
          title="Global Search (Press Cmd+K or Ctrl+K)"
        >
          <div className="flex items-center gap-2.5 truncate">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
            <span className="text-slate-500 group-hover:text-slate-700 truncate">
              Search leads, contacts, deals...
            </span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded-md shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          RIGHT: Quick Add | Notifications | Help | User Profile
          ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* 1. Quick Add Button & Dropdown */}
        <div className="relative" ref={quickAddRef}>
          <Button
            size="sm"
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsQuickAddOpen(!isQuickAddOpen)}
            className="shadow-xs font-semibold"
          >
            <span className="hidden sm:inline">Quick Add</span>
          </Button>

          {isQuickAddOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-dropdown animate-scale-up z-50">
              <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                Quick Create Records
              </div>

              <div className="py-1 space-y-0.5">
                {/* 1. New Lead */}
                <button
                  onClick={() => {
                    setIsQuickAddOpen(false);
                    onOpenNewLead();
                  }}
                  className="w-full flex items-start gap-2.5 px-3 py-2 text-xs text-left hover:bg-blue-50/70 rounded-xl transition-colors group"
                >
                  <div className="p-1.5 rounded-lg bg-blue-100/70 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0 mt-0.5">
                    <UserPlus className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 group-hover:text-blue-700">New Lead</p>
                    <p className="text-[11px] text-slate-500">Capture inbound or outbound prospect</p>
                  </div>
                </button>

                {/* 2. New Contact */}
                <button
                  onClick={() => {
                    setIsQuickAddOpen(false);
                    onOpenNewContact();
                  }}
                  className="w-full flex items-start gap-2.5 px-3 py-2 text-xs text-left hover:bg-purple-50/70 rounded-xl transition-colors group"
                >
                  <div className="p-1.5 rounded-lg bg-purple-100/70 text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition-colors shrink-0 mt-0.5">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 group-hover:text-purple-700">New Contact</p>
                    <p className="text-[11px] text-slate-500">Create client person profile</p>
                  </div>
                </button>

                {/* 3. New Deal */}
                <button
                  onClick={() => {
                    setIsQuickAddOpen(false);
                    onOpenNewDeal();
                  }}
                  className="w-full flex items-start gap-2.5 px-3 py-2 text-xs text-left hover:bg-emerald-50/70 rounded-xl transition-colors group"
                >
                  <div className="p-1.5 rounded-lg bg-emerald-100/70 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0 mt-0.5">
                    <Kanban className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 group-hover:text-emerald-700">New Deal</p>
                    <p className="text-[11px] text-slate-500">Add commercial pipeline opportunity</p>
                  </div>
                </button>

                {/* 4. New Task */}
                <button
                  onClick={() => {
                    setIsQuickAddOpen(false);
                    onOpenNewActivity();
                  }}
                  className="w-full flex items-start gap-2.5 px-3 py-2 text-xs text-left hover:bg-amber-50/70 rounded-xl transition-colors group"
                >
                  <div className="p-1.5 rounded-lg bg-amber-100/70 text-amber-700 group-hover:bg-amber-600 group-hover:text-white transition-colors shrink-0 mt-0.5">
                    <CheckSquare className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 group-hover:text-amber-700">New Task</p>
                    <p className="text-[11px] text-slate-500">Schedule follow-up call, demo, or to-do</p>
                  </div>
                </button>

                {/* 5. New Company */}
                <button
                  onClick={() => {
                    setIsQuickAddOpen(false);
                    onOpenNewCompany();
                  }}
                  className="w-full flex items-start gap-2.5 px-3 py-2 text-xs text-left hover:bg-cyan-50/70 rounded-xl transition-colors group"
                >
                  <div className="p-1.5 rounded-lg bg-cyan-100/70 text-cyan-700 group-hover:bg-cyan-600 group-hover:text-white transition-colors shrink-0 mt-0.5">
                    <Building2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 group-hover:text-cyan-700">New Company</p>
                    <p className="text-[11px] text-slate-500">Add organization account & firmographics</p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 2. Sync / Refresh Button */}
        <button
          type="button"
          onClick={() => refreshData()}
          disabled={isRefreshing}
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors border border-transparent hover:border-slate-200 disabled:opacity-50"
          title="Sync Cloud Data (Press 'R')"
        >
          <RefreshCw className={`w-4.5 h-4.5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
        </button>

        {/* 3. Keyboard Shortcuts Button */}
        <button
          type="button"
          onClick={() => setIsShortcutsOpen(true)}
          className="hidden sm:flex items-center p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors border border-transparent hover:border-slate-200"
          title="Keyboard Navigation Shortcuts (Press '?')"
        >
          <Keyboard className="w-4.5 h-4.5" />
        </button>

        {/* 4. Notifications Bell & Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors border border-transparent hover:border-slate-200"
            title="Notifications"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white shadow-dropdown animate-scale-up z-50 overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 bg-slate-50/70">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-1.5 py-0.2 rounded-full">
                      {unreadCount} unread
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllNotificationsAsRead()}
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <p className="p-6 text-center text-xs text-slate-400">No new notifications</p>
                ) : (
                  notifications.map(n => {
                    let IconComponent = Bell;
                    let iconBg = 'bg-slate-50 text-slate-600 border-slate-200';
                    if (n.type === 'lead') {
                      IconComponent = UserPlus;
                      iconBg = 'bg-blue-50 text-blue-600 border-blue-200';
                    } else if (n.type === 'meeting') {
                      IconComponent = Calendar;
                      iconBg = 'bg-purple-50 text-purple-600 border-purple-200';
                    } else if (n.type === 'deal') {
                      IconComponent = Kanban;
                      iconBg = 'bg-emerald-50 text-emerald-600 border-emerald-200';
                    } else if (n.type === 'task') {
                      IconComponent = CheckSquare;
                      iconBg = 'bg-amber-50 text-amber-600 border-amber-200';
                    } else if (n.type === 'email') {
                      IconComponent = Mail;
                      iconBg = 'bg-indigo-50 text-indigo-600 border-indigo-200';
                    }

                    return (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationAsRead(n.id);
                          if (n.linkTarget) {
                            setActiveView(n.linkTarget.view);
                            setIsNotifOpen(false);
                          }
                        }}
                        className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors flex items-start gap-3 ${
                          !n.read ? 'bg-blue-50/40' : ''
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg border shrink-0 mt-0.5 ${iconBg}`}>
                          <IconComponent className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1.5">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <p className={`text-xs font-bold truncate ${!n.read ? 'text-blue-900 font-extrabold' : 'text-slate-800'}`}>
                                {n.title}
                              </p>
                              {!n.read && (
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                          </div>
                          <p className="mt-1 text-xs text-slate-500 leading-relaxed line-clamp-2">
                            {n.description}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="p-2 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between px-3">
                <button
                  onClick={() => {
                    setIsNotifOpen(false);
                    setActiveView('notifications');
                  }}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <span>Open Notification Center</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3. Help Popover */}
        <div className="relative" ref={helpRef}>
          <button
            onClick={() => setIsHelpOpen(!isHelpOpen)}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors border border-transparent hover:border-slate-200"
            title="Help & Resources"
          >
            <HelpCircle className="w-4.5 h-4.5" />
          </button>

          {isHelpOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-dropdown animate-scale-up z-50">
              <div className="px-3 py-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900">CRM Pro Help & Guides</span>
                <p className="text-[11px] text-slate-500 mt-0.5">Quick resources & shortcuts</p>
              </div>

              <div className="py-1 text-xs space-y-0.5">
                <button
                  onClick={() => {
                    setIsHelpOpen(false);
                    setIsShortcutsOpen(true);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-colors font-medium text-left"
                >
                  <div className="flex items-center gap-2">
                    <Keyboard className="w-3.5 h-3.5 text-slate-400" />
                    <span>Keyboard Shortcuts</span>
                  </div>
                  <kbd className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-mono">?</kbd>
                </button>

                <button
                  onClick={() => {
                    setIsHelpOpen(false);
                    setIsCommandPaletteOpen(true);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-colors font-medium text-left"
                >
                  <div className="flex items-center gap-2">
                    <Search className="w-3.5 h-3.5 text-slate-400" />
                    <span>Command Palette</span>
                  </div>
                  <kbd className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-mono">⌘K</kbd>
                </button>

                <button
                  onClick={() => {
                    setIsHelpOpen(false);
                    setIsLoading(true);
                    showToast('Skeleton Loaders Active', 'Simulating 2s asynchronous data loading...', 'info');
                    setTimeout(() => setIsLoading(false), 2000);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-colors font-medium text-left"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Simulate Skeleton Loading (2s)</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsHelpOpen(false);
                    setSimulatedError('Network Timeout: Unable to communicate with CRM server endpoint https://api.crmpro.io/v1/sync. Offline cached data is currently being presented.');
                    showToast('Error Simulated', 'A test network error state banner was displayed.', 'error');
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors font-medium text-left"
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                    <span>Simulate Error State Banner</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsHelpOpen(false);
                    showToast('Documentation', 'CRM Pro API & user guide documentation opened.', 'info');
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-colors font-medium text-left"
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    <span>Documentation & API</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </button>

                <button
                  onClick={() => {
                    setIsHelpOpen(false);
                    showToast('Support Contact', 'Support desk reached at support@crmpro.io', 'info');
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-colors font-medium text-left"
                >
                  <div className="flex items-center gap-2">
                    <Headphones className="w-3.5 h-3.5 text-slate-400" />
                    <span>Contact Support</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsHelpOpen(false);
                    resetToZero();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-amber-700 hover:text-amber-900 hover:bg-amber-50/70 rounded-xl transition-colors font-medium text-left"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                  <span>Reset All Data to Zero</span>
                </button>

                <button
                  onClick={() => {
                    setIsHelpOpen(false);
                    resetToMockData();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-colors font-medium text-left"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Load Sample Demo Data</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 4. User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 border border-slate-200/90 transition-all text-left"
            title="User Account"
          >
            <div className="relative">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xs shadow-2xs">
                VS
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 border-2 border-white rounded-full" />
            </div>

            <div className="hidden md:flex flex-col min-w-0 pr-0.5">
              <span className="text-xs font-bold text-slate-900 leading-none truncate">
                Viraj Somani
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5 leading-none truncate">
                Developer / Admin
              </span>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline shrink-0" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-dropdown animate-scale-up z-50">
              {/* Profile Card Header */}
              <div className="p-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-xs">
                    VS
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">Viraj Somani</p>
                    <p className="text-[11px] text-slate-500 truncate">Developer / Admin</p>
                  </div>
                </div>
                <div className="mt-2 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Workspace Administrator</span>
                </div>
              </div>

              {/* Action Links */}
              <div className="py-1 text-xs space-y-0.5">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    setActiveView('settings');
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors font-medium text-left"
                >
                  <span>Account & System Settings</span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    setActiveView('team');
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors font-medium text-left"
                >
                  <span>Workspace Team ({availableUsers.length})</span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors font-medium text-left"
                >
                  <div className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Auth Screens</span>
                  </div>
                  <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.2 rounded">Portal</span>
                </button>

                <div className="pt-1 mt-1 border-t border-slate-100 space-y-0.5">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      resetToZero();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-slate-700 hover:text-amber-700 hover:bg-amber-50/70 rounded-lg transition-colors font-medium text-left"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                    <span>Reset All Data to Zero</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      resetToMockData();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors font-medium text-left"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>Load Demo Data</span>
                  </button>
                </div>
              </div>

              {/* Logout Option */}
              <div className="pt-1 border-t border-slate-100">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-semibold text-left"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
