import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  User as UserIcon,
  Building,
  Sliders,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  Globe,
  DollarSign,
  Save,
  Camera,
  Check,
  Shield,
  Clock,
  Sparkles,
  Volume2,
  BellRing
} from 'lucide-react';
import { Button } from '../common/Button';

interface GeneralSettingsProps {
  subSection: 'profile' | 'company' | 'preferences';
}

export const GeneralSettings: React.FC<GeneralSettingsProps> = ({ subSection }) => {
  const { currentUser, setCurrentUser, showToast } = useCRM();

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    title: 'Senior Solutions Architect & Sales Lead',
    phone: '+91 98201 44520',
    timezone: 'Asia/Kolkata (IST, UTC+05:30)',
    bio: 'Overseeing enterprise client onboarding, architecture validation, and CRM pipeline growth.'
  });

  // Company Form State
  const [companyData, setCompanyData] = useState({
    name: 'Acme Cloud Technologies Pvt. Ltd.',
    domain: 'crmpro.io',
    industry: 'Enterprise SaaS & Cloud Infrastructure',
    size: '50-200 employees',
    revenue: '₹12,48,00,000 (₹12.48 Cr)',
    location: 'Bandra-Kurla Complex (BKC), Mumbai, India',
    gstin: '27AABCU9603R1ZM',
    currency: 'INR (₹) — Indian Rupee',
    fiscalYearStart: 'April (Standard Indian Fiscal)'
  });

  // Preferences Form State
  const [preferencesData, setPreferencesData] = useState({
    language: 'English (US & India)',
    dateFormat: 'DD/MM/YYYY (e.g. 04/11/2026)',
    timeFormat: '12-hour (e.g. 02:30 PM)',
    defaultLanding: 'dashboard',
    soundEffects: true,
    compactView: false,
    desktopNotifications: true
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser({
      ...currentUser,
      name: profileData.name,
      email: profileData.email
    });
    showToast('Profile Updated', 'Your user profile details have been saved.', 'success');
  };

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Company Saved', 'Workspace organization information updated.', 'success');
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Preferences Saved', 'Interface and localization preferences saved.', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ─────────────────────────────────────────────────────────────
          1. PROFILE SETTINGS
          ───────────────────────────────────────────────────────────── */}
      {subSection === 'profile' && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Personal Profile</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage your personal account credentials, role title, and contact details
                </p>
              </div>
              <Button type="submit" variant="primary" size="sm" icon={<Save className="w-3.5 h-3.5" />}>
                Save Changes
              </Button>
            </div>

            {/* Avatar Header */}
            <div className="flex items-center gap-5 py-6 border-b border-slate-100">
              <div className="relative group">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-extrabold text-xl flex items-center justify-center shadow-md">
                  {currentUser.initials}
                </div>
                <button
                  type="button"
                  title="Upload profile picture"
                  className="absolute -bottom-1.5 -right-1.5 p-1.5 rounded-xl bg-white border border-slate-200 shadow-xs text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">{profileData.name}</h4>
                  <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80">
                    {currentUser.role}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{profileData.email}</p>
                <p className="text-2xs text-slate-400 mt-1">
                  JPG, GIF or PNG. Max size 2MB. Recommended 400x400px.
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Job Title</label>
                <div className="relative">
                  <Briefcase className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={profileData.title}
                    onChange={e => setProfileData({ ...profileData, title: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Direct Phone</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={profileData.phone}
                    onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 font-medium"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Default Timezone</label>
                <div className="relative">
                  <Clock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={profileData.timezone}
                    onChange={e => setProfileData({ ...profileData, timezone: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 font-medium"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Bio / Role Description</label>
                <textarea
                  rows={3}
                  value={profileData.bio}
                  onChange={e => setProfileData({ ...profileData, bio: e.target.value })}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 font-medium"
                />
              </div>
            </div>
          </div>
        </form>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. COMPANY SETTINGS
          ───────────────────────────────────────────────────────────── */}
      {subSection === 'company' && (
        <form onSubmit={handleSaveCompany} className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Organization & Legal Entity</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Company branding, primary business domain, GST tax registration, and billing currency
                </p>
              </div>
              <Button type="submit" variant="primary" size="sm" icon={<Save className="w-3.5 h-3.5" />}>
                Save Organization
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Company Legal Name</label>
                <div className="relative">
                  <Building className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={companyData.name}
                    onChange={e => setCompanyData({ ...companyData, name: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Corporate Domain</label>
                <div className="relative">
                  <Globe className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={companyData.domain}
                    onChange={e => setCompanyData({ ...companyData, domain: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Industry</label>
                <input
                  type="text"
                  value={companyData.industry}
                  onChange={e => setCompanyData({ ...companyData, industry: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Organization Size</label>
                <select
                  value={companyData.size}
                  onChange={e => setCompanyData({ ...companyData, size: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 font-medium"
                >
                  <option value="1-10 employees">1-10 employees</option>
                  <option value="11-50 employees">11-50 employees</option>
                  <option value="50-200 employees">50-200 employees</option>
                  <option value="200-500 employees">200-500 employees</option>
                  <option value="500+ enterprise">500+ enterprise</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Default Pipeline Currency</label>
                <div className="relative">
                  <DollarSign className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={companyData.currency}
                    onChange={e => setCompanyData({ ...companyData, currency: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">GSTIN / Tax ID</label>
                <input
                  type="text"
                  value={companyData.gstin}
                  onChange={e => setCompanyData({ ...companyData, gstin: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 font-medium"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Registered Business Address</label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={companyData.location}
                    onChange={e => setCompanyData({ ...companyData, location: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 font-medium"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. PREFERENCES SETTINGS
          ───────────────────────────────────────────────────────────── */}
      {subSection === 'preferences' && (
        <form onSubmit={handleSavePreferences} className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Application Preferences</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Localization, date formatting, sound feedback, and default view behavior
                </p>
              </div>
              <Button type="submit" variant="primary" size="sm" icon={<Save className="w-3.5 h-3.5" />}>
                Save Preferences
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Language</label>
                <select
                  value={preferencesData.language}
                  onChange={e => setPreferencesData({ ...preferencesData, language: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                >
                  <option value="English (US & India)">English (US & India)</option>
                  <option value="English (UK)">English (UK)</option>
                  <option value="Hindi (हिंदी)">Hindi (हिंदी)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Date Format</label>
                <select
                  value={preferencesData.dateFormat}
                  onChange={e => setPreferencesData({ ...preferencesData, dateFormat: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                >
                  <option value="DD/MM/YYYY (e.g. 04/11/2026)">DD/MM/YYYY (e.g. 04/11/2026)</option>
                  <option value="MM/DD/YYYY (e.g. 11/04/2026)">MM/DD/YYYY (e.g. 11/04/2026)</option>
                  <option value="YYYY-MM-DD (e.g. 2026-11-04)">YYYY-MM-DD (e.g. 2026-11-04)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Default Landing Screen</label>
                <select
                  value={preferencesData.defaultLanding}
                  onChange={e => setPreferencesData({ ...preferencesData, defaultLanding: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                >
                  <option value="dashboard">Dashboard Overview</option>
                  <option value="deals">Deals Pipeline</option>
                  <option value="leads">Leads Table</option>
                  <option value="tasks">Tasks Board</option>
                  <option value="reports">Reports & Analytics</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Time Format</label>
                <select
                  value={preferencesData.timeFormat}
                  onChange={e => setPreferencesData({ ...preferencesData, timeFormat: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                >
                  <option value="12-hour (e.g. 02:30 PM)">12-hour (e.g. 02:30 PM)</option>
                  <option value="24-hour (e.g. 14:30)">24-hour (e.g. 14:30)</option>
                </select>
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-4 pt-6 mt-6 border-t border-slate-100">
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100/70 text-blue-600">
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Sound Effects & Deal Win Chime</h4>
                    <p className="text-2xs text-slate-500">Play celebratory audio cues when dragging deals to Won</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferencesData.soundEffects}
                  onChange={e => setPreferencesData({ ...preferencesData, soundEffects: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100/70 text-purple-600">
                    <BellRing className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Desktop Browser Notifications</h4>
                    <p className="text-2xs text-slate-500">Send instant browser notifications for high-priority lead assignments</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferencesData.desktopNotifications}
                  onChange={e => setPreferencesData({ ...preferencesData, desktopNotifications: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
              </div>
            </div>

            {/* 20. Professional SaaS Color System Active Theme */}
            <div className="pt-6 mt-6 border-t border-slate-100 space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900">Active SaaS Color System</h4>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Strict Enterprise Mode
                  </span>
                </div>
                <p className="text-2xs text-slate-500 mt-0.5">
                  Standardized high-contrast SaaS palette engineered for prolonged analytical sessions without visual fatigue.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <div className="w-full h-8 rounded-lg bg-[#2563EB] shadow-2xs mb-2 flex items-center justify-center text-white text-[10px] font-bold">
                    Primary
                  </div>
                  <span className="text-[11px] font-bold text-slate-900 block truncate">Primary Blue</span>
                  <span className="text-2xs font-mono text-slate-500">#2563EB</span>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <div className="w-full h-8 rounded-lg bg-[#F8FAFC] border border-slate-200 shadow-2xs mb-2 flex items-center justify-center text-slate-700 text-[10px] font-bold">
                    Canvas
                  </div>
                  <span className="text-[11px] font-bold text-slate-900 block truncate">Background</span>
                  <span className="text-2xs font-mono text-slate-500">#F8FAFC</span>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <div className="w-full h-8 rounded-lg bg-[#FFFFFF] border border-slate-200 shadow-2xs mb-2 flex items-center justify-center text-slate-800 text-[10px] font-bold">
                    Card Surface
                  </div>
                  <span className="text-[11px] font-bold text-slate-900 block truncate">Cards</span>
                  <span className="text-2xs font-mono text-slate-500">#FFFFFF</span>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <div className="w-full h-8 rounded-lg bg-[#0F172A] shadow-2xs mb-2 flex items-center justify-center text-white text-[10px] font-bold">
                    Aa Text
                  </div>
                  <span className="text-[11px] font-bold text-slate-900 block truncate">Text</span>
                  <span className="text-2xs font-mono text-slate-500">#0F172A</span>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <div className="w-full h-8 rounded-lg bg-[#64748B] shadow-2xs mb-2 flex items-center justify-center text-white text-[10px] font-bold">
                    Secondary
                  </div>
                  <span className="text-[11px] font-bold text-slate-900 block truncate">Secondary Text</span>
                  <span className="text-2xs font-mono text-slate-500">#64748B</span>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <div className="w-full h-8 rounded-lg bg-[#E2E8F0] border border-slate-300 shadow-2xs mb-2 flex items-center justify-center text-slate-700 text-[10px] font-bold">
                    Divider
                  </div>
                  <span className="text-[11px] font-bold text-slate-900 block truncate">Border</span>
                  <span className="text-2xs font-mono text-slate-500">#E2E8F0</span>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <div className="w-full h-8 rounded-lg bg-[#16A34A] shadow-2xs mb-2 flex items-center justify-center text-white text-[10px] font-bold">
                    Success
                  </div>
                  <span className="text-[11px] font-bold text-slate-900 block truncate">Green</span>
                  <span className="text-2xs font-mono text-slate-500">#16A34A</span>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <div className="w-full h-8 rounded-lg bg-[#D97706] shadow-2xs mb-2 flex items-center justify-center text-white text-[10px] font-bold">
                    Warning
                  </div>
                  <span className="text-[11px] font-bold text-slate-900 block truncate">Amber</span>
                  <span className="text-2xs font-mono text-slate-500">#D97706</span>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <div className="w-full h-8 rounded-lg bg-[#DC2626] shadow-2xs mb-2 flex items-center justify-center text-white text-[10px] font-bold">
                    Danger
                  </div>
                  <span className="text-[11px] font-bold text-slate-900 block truncate">Red</span>
                  <span className="text-2xs font-mono text-slate-500">#DC2626</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

