import React, { useState, useRef, useEffect } from 'react';
import { useCRM } from '../../context/CRMContext';
import { ViewType } from '../../types';
import {
  LayoutDashboard,
  UserPlus,
  Kanban,
  Users,
  Building2,
  CheckSquare,
  Calendar,
  Activity as ActivityIcon,
  BarChart3,
  Settings,
  Users2,
  Bell,
  Layers,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ChevronUp,
  UserCheck,
  ShieldCheck,
  Keyboard,
  ExternalLink,
  RotateCcw,
  X,
  Sparkles,
  Globe
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen
}) => {
  const {
    activeView,
    setActiveView,
    currentUser,
    leads,
    deals,
    activities,
    notifications,
    availableUsers,
    setCurrentUser,
    logout,
    resetToMockData,
    resetToZero
  } = useCRM();

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const pendingActivitiesCount = activities.filter(a => !a.completed).length;
  const activeDealsCount = deals.filter(d => d.stage !== 'won' && d.stage !== 'lost').length;
  const newLeadsCount = leads.filter(l => l.status === 'new').length;
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Main navigation items
  const mainNavItems: { id: ViewType; label: string; icon: React.ReactNode; badge?: number | string }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4.5 h-4.5 shrink-0" />
    },
    {
      id: 'leads',
      label: 'Leads',
      icon: <UserPlus className="w-4.5 h-4.5 shrink-0" />,
      badge: newLeadsCount > 0 ? newLeadsCount : undefined
    },
    {
      id: 'deals',
      label: 'Deals',
      icon: <Kanban className="w-4.5 h-4.5 shrink-0" />,
      badge: activeDealsCount > 0 ? activeDealsCount : undefined
    },
    {
      id: 'contacts',
      label: 'Contacts',
      icon: <Users className="w-4.5 h-4.5 shrink-0" />
    },
    {
      id: 'companies',
      label: 'Companies',
      icon: <Building2 className="w-4.5 h-4.5 shrink-0" />
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: <CheckSquare className="w-4.5 h-4.5 shrink-0" />,
      badge: pendingActivitiesCount > 0 ? pendingActivitiesCount : undefined
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: <Calendar className="w-4.5 h-4.5 shrink-0" />
    },
    {
      id: 'activities',
      label: 'Activities',
      icon: <ActivityIcon className="w-4.5 h-4.5 shrink-0" />
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: <BarChart3 className="w-4.5 h-4.5 shrink-0" />
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-4.5 h-4.5 shrink-0" />
    }
  ];

  // Workspace items
  const workspaceNavItems: { id: ViewType; label: string; icon: React.ReactNode; badge?: number | string }[] = [
    {
      id: 'team',
      label: 'Team',
      icon: <Users2 className="w-4.5 h-4.5 shrink-0" />
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Bell className="w-4.5 h-4.5 shrink-0" />,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined
    },
    {
      id: 'integrations',
      label: 'Integrations',
      icon: <Layers className="w-4.5 h-4.5 shrink-0" />
    },
    {
      id: 'components',
      label: 'UI Components',
      icon: <Sparkles className="w-4.5 h-4.5 shrink-0" />,
      badge: '18'
    },
    {
      id: 'landing',
      label: 'Landing Page',
      icon: <Globe className="w-4.5 h-4.5 shrink-0" />,
      badge: 'Public'
    }
  ];

  const handleNavClick = (view: ViewType) => {
    setActiveView(view);
    setIsMobileOpen(false);
  };

  const handleLogout = () => {
    setIsProfileDropdownOpen(false);
    logout();
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-white border-r border-slate-200/90 transition-all duration-200 ease-in-out md:static ${
          isMobileOpen ? 'translate-x-0 w-64 shadow-2xl' : '-translate-x-full md:translate-x-0'
        } ${isCollapsed ? 'md:w-[72px]' : 'md:w-64'}`}
      >
        {/* Logo Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-100 shrink-0">
          <div
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-3 min-w-0 cursor-pointer select-none group"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white font-bold shadow-xs shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>

            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-base font-bold tracking-tight text-slate-900 truncate">
                  CRM Pro
                </span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  SaaS Platform
                </span>
              </div>
            )}
          </div>

          {/* Tablet & Desktop Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-6">
          {/* Main Navigation Section */}
          <div>
            {!isCollapsed && (
              <div className="px-3 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Menu
              </div>
            )}
            <nav className="space-y-0.5">
              {mainNavItems.map(item => {
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 shadow-2xs font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    } ${isCollapsed ? 'justify-center px-0 py-2.5' : ''}`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <span className={`${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                      {item.icon}
                    </span>

                    {!isCollapsed && (
                      <span className="flex-1 text-left truncate">{item.label}</span>
                    )}

                    {!isCollapsed && item.badge !== undefined && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          isActive
                            ? 'bg-blue-200/80 text-blue-900'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* WORKSPACE Section */}
          <div className="pt-2 border-t border-slate-100">
            {!isCollapsed ? (
              <div className="px-3 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Workspace
              </div>
            ) : (
              <div className="w-6 h-0.5 bg-slate-200 mx-auto my-2" />
            )}
            <nav className="space-y-0.5">
              {workspaceNavItems.map(item => {
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 shadow-2xs font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    } ${isCollapsed ? 'justify-center px-0 py-2.5' : ''}`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <span className={`${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                      {item.icon}
                    </span>

                    {!isCollapsed && (
                      <span className="flex-1 text-left truncate">{item.label}</span>
                    )}

                    {!isCollapsed && item.badge !== undefined && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          isActive
                            ? 'bg-blue-200/80 text-blue-900'
                            : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* User Profile Section at Bottom */}
        <div className="p-3 border-t border-slate-100 relative bg-slate-50/60" ref={profileDropdownRef}>
          {/* Profile Trigger Button */}
          <button
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className={`w-full flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-white hover:shadow-2xs border border-transparent hover:border-slate-200 transition-all text-left ${
              isCollapsed ? 'justify-center p-1' : ''
            }`}
            title="Profile & Workspace Settings"
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white text-xs font-bold shadow-2xs">
                VS
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
            </div>

            {/* Name & Role */}
            {!isCollapsed && (
              <div className="flex-1 min-w-0 pr-1">
                <p className="text-xs font-bold text-slate-900 truncate leading-snug">
                  Viraj Somani
                </p>
                <p className="text-[11px] font-medium text-slate-500 truncate mt-0.5">
                  Developer / Admin
                </p>
              </div>
            )}

            {!isCollapsed && (
              <ChevronUp className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
            )}
          </button>

          {/* Profile Dropdown Popover */}
          {isProfileDropdownOpen && (
            <div className={`absolute bottom-full mb-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-dropdown p-2 animate-scale-up z-50 ${
              isCollapsed ? 'left-1' : 'left-3 right-3 w-auto'
            }`}>
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
                <div className="mt-2 flex items-center gap-1.5 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Workspace Administrator</span>
                </div>
              </div>

              {/* Action Links */}
              <div className="py-1 text-xs">
                <button
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    setActiveView('settings');
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors font-medium text-left"
                >
                  <ShieldCheck className="w-4 h-4 text-slate-400" />
                  <span>Profile Settings</span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    setActiveView('team');
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors font-medium text-left"
                >
                  <Users2 className="w-4 h-4 text-slate-400" />
                  <span>Manage Workspace</span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    resetToZero();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-amber-700 hover:text-amber-900 hover:bg-amber-50/70 rounded-lg transition-colors font-medium text-left"
                >
                  <RotateCcw className="w-4 h-4 text-amber-600" />
                  <span>Reset All Data to Zero</span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    resetToMockData();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors font-medium text-left"
                >
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Load Sample Demo Data</span>
                </button>
              </div>

              {/* Logout Option */}
              <div className="pt-1 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-semibold text-left"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
