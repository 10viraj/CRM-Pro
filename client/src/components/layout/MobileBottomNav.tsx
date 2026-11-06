import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { ViewType } from '../../types';
import {
  LayoutDashboard,
  Kanban,
  UserPlus,
  CheckSquare,
  Calendar,
  Plus,
  Menu,
  X,
  Phone,
  Briefcase,
  Users,
  Activity,
  Layers
} from 'lucide-react';

interface MobileBottomNavProps {
  onOpenMobileMenu: () => void;
  onOpenNewLead: () => void;
  onOpenNewDeal: () => void;
  onOpenNewContact: () => void;
  onOpenNewActivity: () => void;
  onOpenNewCompany: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onOpenMobileMenu,
  onOpenNewLead,
  onOpenNewDeal,
  onOpenNewContact,
  onOpenNewActivity,
  onOpenNewCompany
}) => {
  const { activeView, setActiveView } = useCRM();
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);

  const navItems: Array<{ id: ViewType; label: string; icon: React.ReactNode }> = [
    { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'deals', label: 'Deals', icon: <Kanban className="w-5 h-5" /> },
    // Center is the Quick Add FAB
    { id: 'leads', label: 'Leads', icon: <UserPlus className="w-5 h-5" /> },
    { id: 'tasks', label: 'Tasks', icon: <CheckSquare className="w-5 h-5" /> }
  ];

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          1. QUICK ACTIONS BOTTOM SHEET (Triggered by center FAB)
          ───────────────────────────────────────────────────────────── */}
      {isQuickActionOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setIsQuickActionOpen(false)}
          />

          {/* Bottom Sheet Card */}
          <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl border-t border-slate-200/90 shadow-2xl p-5 pb-8 animate-slide-down select-none">
            {/* Grab Handle */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Quick Actions</h3>
                <p className="text-2xs text-slate-500">Create new records with 1-tap thumb reach</p>
              </div>
              <button
                onClick={() => setIsQuickActionOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => {
                  setIsQuickActionOpen(false);
                  onOpenNewDeal();
                }}
                className="flex items-center gap-3 p-3 rounded-2xl border border-blue-100 bg-blue-50/60 hover:bg-blue-100/70 text-left transition-all active:scale-[0.98]"
              >
                <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-blue-900 block">New Deal</span>
                  <span className="text-[10px] text-blue-600 font-medium">Add to pipeline</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsQuickActionOpen(false);
                  onOpenNewLead();
                }}
                className="flex items-center gap-3 p-3 rounded-2xl border border-indigo-100 bg-indigo-50/60 hover:bg-indigo-100/70 text-left transition-all active:scale-[0.98]"
              >
                <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-indigo-900 block">New Lead</span>
                  <span className="text-[10px] text-indigo-600 font-medium">Capture prospect</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsQuickActionOpen(false);
                  onOpenNewContact();
                }}
                className="flex items-center gap-3 p-3 rounded-2xl border border-cyan-100 bg-cyan-50/60 hover:bg-cyan-100/70 text-left transition-all active:scale-[0.98]"
              >
                <div className="p-2 rounded-xl bg-cyan-600 text-white shadow-xs">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-cyan-900 block">New Contact</span>
                  <span className="text-[10px] text-cyan-600 font-medium">Add to directory</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsQuickActionOpen(false);
                  onOpenNewActivity();
                }}
                className="flex items-center gap-3 p-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 hover:bg-emerald-100/70 text-left transition-all active:scale-[0.98]"
              >
                <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-900 block">Log Activity</span>
                  <span className="text-[10px] text-emerald-600 font-medium">Call, email, note</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. FIXED BOTTOM NAVIGATION BAR
          ───────────────────────────────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg px-2 py-1 flex items-center justify-between select-none">
        {/* 1. Dashboard */}
        <button
          onClick={() => setActiveView('dashboard')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 transition-all ${
            activeView === 'dashboard'
              ? 'text-blue-600 font-bold scale-105'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight">Overview</span>
        </button>

        {/* 2. Deals */}
        <button
          onClick={() => setActiveView('deals')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 transition-all ${
            activeView === 'deals'
              ? 'text-blue-600 font-bold scale-105'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Kanban className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight">Deals</span>
        </button>

        {/* 3. CENTER QUICK ACTION FAB (+) */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <button
            onClick={() => setIsQuickActionOpen(!isQuickActionOpen)}
            className="flex items-center justify-center -mt-5 h-12 w-12 rounded-full bg-blue-600 text-white shadow-md shadow-blue-500/30 hover:bg-blue-700 active:scale-95 transition-all"
            title="Quick Create"
          >
            <Plus className={`w-6 h-6 transition-transform duration-200 ${isQuickActionOpen ? 'rotate-45' : ''}`} />
          </button>
          <span className="text-[10px] mt-0.5 font-bold text-slate-700 tracking-tight">Create</span>
        </div>

        {/* 4. Leads */}
        <button
          onClick={() => setActiveView('leads')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 transition-all ${
            activeView === 'leads'
              ? 'text-blue-600 font-bold scale-105'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserPlus className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight">Leads</span>
        </button>

        {/* 5. More / Menu */}
        <button
          onClick={onOpenMobileMenu}
          className="flex-1 flex flex-col items-center justify-center py-1.5 text-slate-500 hover:text-slate-800 transition-all"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight">Menu</span>
        </button>
      </nav>
    </>
  );
};
