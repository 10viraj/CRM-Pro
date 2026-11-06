import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  User,
  Building,
  Sliders,
  Users,
  Shield,
  Layers,
  Filter,
  Kanban,
  CheckCircle2,
  ListPlus,
  Mail,
  Calendar,
  MessageSquare,
  Smartphone,
  CreditCard,
  Lock,
  KeyRound,
  Laptop,
  Search,
  ChevronRight,
  Sparkles,
  Download,
  RotateCcw
} from 'lucide-react';
import { GeneralSettings } from './GeneralSettings';
import { WorkspaceSettings } from './WorkspaceSettings';
import { CRMSettings } from './CRMSettings';
import { IntegrationsSettings } from './IntegrationsSettings';
import { SecuritySettings } from './SecuritySettings';

export type SettingsSection = 'general' | 'workspace' | 'crm' | 'integrations' | 'security';

export type SettingsSubSection =
  // General
  | 'profile'
  | 'company'
  | 'preferences'
  // Workspace
  | 'team'
  | 'roles'
  | 'departments'
  // CRM
  | 'lead_sources'
  | 'deal_pipelines'
  | 'statuses'
  | 'custom_fields'
  // Integrations
  | 'email'
  | 'calendar'
  | 'slack'
  | 'whatsapp'
  | 'payment'
  // Security
  | 'password'
  | 'two_factor'
  | 'sessions';

interface SettingsNavGroup {
  id: SettingsSection;
  title: string;
  items: Array<{
    id: SettingsSubSection;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }>;
}

const SETTINGS_NAVIGATION: SettingsNavGroup[] = [
  {
    id: 'general',
    title: 'General',
    items: [
      { id: 'profile', label: 'Profile', icon: User },
      { id: 'company', label: 'Company', icon: Building },
      { id: 'preferences', label: 'Preferences', icon: Sliders }
    ]
  },
  {
    id: 'workspace',
    title: 'Workspace',
    items: [
      { id: 'team', label: 'Team Members', icon: Users, badge: '5 Seats' },
      { id: 'roles', label: 'Roles & Permissions', icon: Shield },
      { id: 'departments', label: 'Departments', icon: Layers }
    ]
  },
  {
    id: 'crm',
    title: 'CRM',
    items: [
      { id: 'lead_sources', label: 'Lead Sources', icon: Filter },
      { id: 'deal_pipelines', label: 'Deal Pipelines', icon: Kanban },
      { id: 'statuses', label: 'Statuses', icon: CheckCircle2 },
      { id: 'custom_fields', label: 'Custom Fields', icon: ListPlus }
    ]
  },
  {
    id: 'integrations',
    title: 'Integrations',
    items: [
      { id: 'email', label: 'Email', icon: Mail, badge: 'Active' },
      { id: 'calendar', label: 'Calendar', icon: Calendar, badge: 'Active' },
      { id: 'slack', label: 'Slack', icon: MessageSquare, badge: 'Active' },
      { id: 'whatsapp', label: 'WhatsApp', icon: Smartphone, badge: 'Live API' },
      { id: 'payment', label: 'Payment', icon: CreditCard, badge: '2 Active' }
    ]
  },
  {
    id: 'security',
    title: 'Security',
    items: [
      { id: 'password', label: 'Password', icon: Lock },
      { id: 'two_factor', label: 'Two-factor authentication', icon: KeyRound, badge: '2FA On' },
      { id: 'sessions', label: 'Sessions', icon: Laptop, badge: '3 Devices' }
    ]
  }
];

export const SettingsView: React.FC = () => {
  const { leads, deals, contacts, companies, activities, resetToMockData, showToast } = useCRM();

  const [activeSection, setActiveSection] = useState<SettingsSection>('general');
  const [activeSubSection, setActiveSubSection] = useState<SettingsSubSection>('profile');
  const [navSearch, setNavSearch] = useState('');

  const handleSelectNav = (section: SettingsSection, sub: SettingsSubSection) => {
    setActiveSection(section);
    setActiveSubSection(sub);
  };

  const handleExportFullJSON = () => {
    const fullBackup = {
      exportedAt: new Date().toISOString(),
      organization: 'Acme Cloud Technologies Pvt. Ltd.',
      leads,
      deals,
      contacts,
      companies,
      activities
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `crm_pro_full_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Data Exported', 'Complete CRM database exported to JSON.', 'success');
  };

  // Filter navigation items by search query
  const filteredGroups = SETTINGS_NAVIGATION.map(group => {
    if (!navSearch.trim()) return group;
    const q = navSearch.toLowerCase();
    const matchedItems = group.items.filter(item =>
      item.label.toLowerCase().includes(q) || group.title.toLowerCase().includes(q)
    );
    return {
      ...group,
      items: matchedItems
    };
  }).filter(group => group.items.length > 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Settings & Configuration
            </h1>
            <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              Admin Console
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage your personal profile, company details, pipeline stages, connected integrations, and security
          </p>
        </div>

        {/* Global Action Tools */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportFullJSON}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Backup</span>
          </button>

          <button
            onClick={resetToMockData}
            title="Reset to default mock data"
            className="p-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 rounded-xl transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Dual Pane Layout: Left Sidebar + Right Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ─────────────────────────────────────────────────────────────
            LEFT: SETTINGS SIDEBAR NAVIGATION (4 Cols on lg)
            ───────────────────────────────────────────────────────────── */}
        <div className="lg:col-span-4 xl:col-span-3 bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-4">
          {/* Quick Search in Settings */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search settings..."
              value={navSearch}
              onChange={e => setNavSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Navigation Groups */}
          <div className="space-y-4">
            {filteredGroups.map(group => (
              <div key={group.id} className="space-y-1">
                <h3 className="text-2xs font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                  {group.title}
                </h3>

                <div className="space-y-0.5">
                  {group.items.map(item => {
                    const Icon = item.icon;
                    const isActive = activeSubSection === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectNav(group.id, item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-blue-50 text-blue-700 shadow-2xs font-bold'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon
                            className={`w-4 h-4 shrink-0 ${
                              isActive ? 'text-blue-600' : 'text-slate-400'
                            }`}
                          />
                          <span className="truncate">{item.label}</span>
                        </div>

                        {item.badge && (
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                              isActive
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            RIGHT: ACTIVE SETTINGS PANE (8 Cols on lg)
            ───────────────────────────────────────────────────────────── */}
        <div className="lg:col-span-8 xl:col-span-9">
          {/* General Settings */}
          {activeSection === 'general' && (
            <GeneralSettings
              subSection={activeSubSection as 'profile' | 'company' | 'preferences'}
            />
          )}

          {/* Workspace Settings */}
          {activeSection === 'workspace' && (
            <WorkspaceSettings
              subSection={activeSubSection as 'team' | 'roles' | 'departments'}
            />
          )}

          {/* CRM Settings */}
          {activeSection === 'crm' && (
            <CRMSettings
              subSection={
                activeSubSection as 'lead_sources' | 'deal_pipelines' | 'statuses' | 'custom_fields'
              }
            />
          )}

          {/* Integrations Settings */}
          {activeSection === 'integrations' && (
            <IntegrationsSettings
              subSection={
                activeSubSection as 'email' | 'calendar' | 'slack' | 'whatsapp' | 'payment'
              }
            />
          )}

          {/* Security Settings */}
          {activeSection === 'security' && (
            <SecuritySettings
              subSection={activeSubSection as 'password' | 'two_factor' | 'sessions'}
            />
          )}
        </div>
      </div>
    </div>
  );
};
