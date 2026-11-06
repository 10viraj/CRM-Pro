import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  Kanban,
  Filter,
  CheckCircle2,
  Plus,
  Trash2,
  Edit2,
  Globe,
  Share2,
  Users,
  Search,
  Mail,
  Layers,
  ArrowRight,
  Sliders,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  X,
  Save,
  Check
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { PipelineStageConfig } from '../../types';

interface CRMSettingsProps {
  subSection: 'lead_sources' | 'deal_pipelines' | 'statuses' | 'custom_fields';
}

interface LeadSourceItem {
  id: string;
  name: string;
  leadsCount: number;
  conversionRate: string;
  active: boolean;
  color: string;
}

interface CustomFieldItem {
  id: string;
  name: string;
  entity: 'Lead' | 'Deal' | 'Contact' | 'Company';
  type: 'Text' | 'Number' | 'Dropdown' | 'Date' | 'Boolean';
  required: boolean;
  active: boolean;
}

export const CRMSettings: React.FC<CRMSettingsProps> = ({ subSection }) => {
  const { pipelineStages, showToast } = useCRM();

  // Lead Sources State
  const [leadSources, setLeadSources] = useState<LeadSourceItem[]>([
    { id: 'src-1', name: 'Website', leadsCount: 428, conversionRate: '31.2%', active: true, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { id: 'src-2', name: 'LinkedIn', leadsCount: 296, conversionRate: '27.8%', active: true, color: 'text-sky-600 bg-sky-50 border-sky-200' },
    { id: 'src-3', name: 'Referral', leadsCount: 215, conversionRate: '41.5%', active: true, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { id: 'src-4', name: 'Google Ads', leadsCount: 152, conversionRate: '20.4%', active: true, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { id: 'src-5', name: 'Email Marketing', leadsCount: 98, conversionRate: '23.8%', active: true, color: 'text-purple-600 bg-purple-50 border-purple-200' },
    { id: 'src-6', name: 'Cold Outbound', leadsCount: 74, conversionRate: '18.2%', active: true, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    { id: 'src-7', name: 'Event / Conference', leadsCount: 42, conversionRate: '34.0%', active: true, color: 'text-rose-600 bg-rose-50 border-rose-200' },
    { id: 'src-8', name: 'Inbound Demo Request', leadsCount: 165, conversionRate: '48.2%', active: true, color: 'text-teal-600 bg-teal-50 border-teal-200' }
  ]);

  // New Lead Source Modal
  const [isAddSourceOpen, setIsAddSourceOpen] = useState(false);
  const [newSourceName, setNewSourceName] = useState('');

  // Deal Pipeline Stages State
  const [stages, setStages] = useState<PipelineStageConfig[]>([
    { key: 'new_lead', label: 'New Lead', color: '#3b82f6', probability: 10, badgeBg: 'bg-blue-50', badgeText: 'text-blue-700' },
    { key: 'contacted', label: 'Contacted', color: '#06b6d4', probability: 25, badgeBg: 'bg-cyan-50', badgeText: 'text-cyan-700' },
    { key: 'qualified', label: 'Qualified', color: '#8b5cf6', probability: 40, badgeBg: 'bg-purple-50', badgeText: 'text-purple-700' },
    { key: 'proposal', label: 'Proposal', color: '#f59e0b', probability: 65, badgeBg: 'bg-amber-50', badgeText: 'text-amber-700' },
    { key: 'negotiation', label: 'Negotiation', color: '#10b981', probability: 85, badgeBg: 'bg-emerald-50', badgeText: 'text-emerald-700' },
    { key: 'won', label: 'Won', color: '#059669', probability: 100, badgeBg: 'bg-green-100', badgeText: 'text-green-800' },
    { key: 'lost', label: 'Lost', color: '#ef4444', probability: 0, badgeBg: 'bg-red-50', badgeText: 'text-red-700' }
  ]);

  // Custom Fields State
  const [customFields, setCustomFields] = useState<CustomFieldItem[]>([
    { id: 'cf-1', name: 'Contract Duration (Months)', entity: 'Deal', type: 'Number', required: true, active: true },
    { id: 'cf-2', name: 'Budget Sign-off Status', entity: 'Deal', type: 'Boolean', required: true, active: true },
    { id: 'cf-3', name: 'Decision Timeframe', entity: 'Lead', type: 'Dropdown', required: false, active: true },
    { id: 'cf-4', name: 'Key Competitors Mentioned', entity: 'Deal', type: 'Text', required: false, active: true },
    { id: 'cf-5', name: 'GST / Tax ID Number', entity: 'Company', type: 'Text', required: false, active: true },
    { id: 'cf-6', name: 'Preferred Communication Channel', entity: 'Contact', type: 'Dropdown', required: false, active: true }
  ]);

  // New Custom Field Modal
  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldEntity, setNewFieldEntity] = useState<'Lead' | 'Deal' | 'Contact' | 'Company'>('Deal');
  const [newFieldType, setNewFieldType] = useState<'Text' | 'Number' | 'Dropdown' | 'Date' | 'Boolean'>('Text');
  const [newFieldRequired, setNewFieldRequired] = useState(false);

  const handleAddSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSourceName.trim()) return;
    const newSource: LeadSourceItem = {
      id: `src-${Date.now()}`,
      name: newSourceName.trim(),
      leadsCount: 0,
      conversionRate: '0.0%',
      active: true,
      color: 'text-slate-600 bg-slate-50 border-slate-200'
    };
    setLeadSources([...leadSources, newSource]);
    setNewSourceName('');
    setIsAddSourceOpen(false);
    showToast('Source Added', `Lead attribution source "${newSource.name}" created.`, 'success');
  };

  const handleToggleSource = (id: string) => {
    setLeadSources(prev =>
      prev.map(s => (s.id === id ? { ...s, active: !s.active } : s))
    );
    showToast('Source Updated', 'Channel status changed.', 'info');
  };

  const handleAddCustomField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFieldName.trim()) return;
    const newField: CustomFieldItem = {
      id: `cf-${Date.now()}`,
      name: newFieldName.trim(),
      entity: newFieldEntity,
      type: newFieldType,
      required: newFieldRequired,
      active: true
    };
    setCustomFields([...customFields, newField]);
    setNewFieldName('');
    setIsAddFieldOpen(false);
    showToast('Field Created', `Custom field "${newField.name}" added to ${newFieldEntity}.`, 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ─────────────────────────────────────────────────────────────
          1. LEAD SOURCES
          ───────────────────────────────────────────────────────────── */}
      {subSection === 'lead_sources' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Lead Attribution Sources</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure marketing channels, track conversion efficiencies, and activate intake routes
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                icon={<Plus className="w-3.5 h-3.5" />}
                onClick={() => setIsAddSourceOpen(true)}
              >
                Add Source
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-5">
              {leadSources.map(source => (
                <div
                  key={source.id}
                  className={`p-4 rounded-xl border transition-all flex items-center justify-between ${
                    source.active
                      ? 'bg-white border-slate-200/90 shadow-2xs hover:border-slate-300'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-2xs font-bold px-2.5 py-1 rounded-lg border ${source.color}`}>
                      {source.name}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">
                        {source.leadsCount} leads
                      </span>
                      <span className="text-2xs text-slate-400">
                        {source.conversionRate} conv. rate
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleSource(source.id)}
                      className={`text-2xs font-semibold px-2.5 py-1 rounded-lg border transition-colors ${
                        source.active
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-200 text-slate-600 border-slate-300'
                      }`}
                    >
                      {source.active ? 'Active' : 'Disabled'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Source Modal */}
          {isAddSourceOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 w-full max-w-sm animate-scale-up">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900">Add Lead Source</h3>
                  <button
                    onClick={() => setIsAddSourceOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <form onSubmit={handleAddSource} className="space-y-4 pt-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Source Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Podcast Sponsorship"
                      value={newSourceName}
                      onChange={e => setNewSourceName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                    <Button variant="outline" size="sm" onClick={() => setIsAddSourceOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" size="sm">
                      Create Source
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. DEAL PIPELINES
          ───────────────────────────────────────────────────────────── */}
      {subSection === 'deal_pipelines' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Default Enterprise Sales Pipeline</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure stages, win probability percentage weighting, and color badges
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                icon={<Plus className="w-3.5 h-3.5" />}
                onClick={() => showToast('Stage Modal', 'Pipeline stage configuration ready.', 'info')}
              >
                Add Stage
              </Button>
            </div>

            <div className="space-y-3 mt-5">
              {stages.map((stage, idx) => (
                <div
                  key={stage.key}
                  className="p-4 rounded-xl border border-slate-200/90 bg-white hover:border-slate-300 transition-all flex items-center justify-between shadow-2xs"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-500 font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div
                      className="w-3.5 h-3.5 rounded-full shrink-0"
                      style={{ backgroundColor: stage.color }}
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900">{stage.label}</span>
                      <span className="text-2xs text-slate-400 ml-2">ID: {stage.key}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {stage.probability}% win probability
                    </span>
                    <button
                      onClick={() => showToast('Edit Stage', `Configure ${stage.label} stage properties.`, 'info')}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. STATUSES
          ───────────────────────────────────────────────────────────── */}
      {subSection === 'statuses' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="pb-6 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Lead & Task Lifecycle Statuses</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Standard milestone states across prospective leads and operational task checklists
              </p>
            </div>

            {/* Lead Statuses */}
            <div className="mt-6">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-slate-500 mb-3">
                Lead Record Statuses
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: 'New', color: 'bg-blue-50 text-blue-700 border-blue-200', desc: 'Fresh inbound or scraped lead' },
                  { label: 'Contacted', color: 'bg-cyan-50 text-cyan-700 border-cyan-200', desc: 'Initial email or call dispatched' },
                  { label: 'Qualified', color: 'bg-purple-50 text-purple-700 border-purple-200', desc: 'BANT criteria validated' },
                  { label: 'Proposal', color: 'bg-amber-50 text-amber-700 border-amber-200', desc: 'Quote or proposal shared' },
                  { label: 'Converted', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', desc: 'Successfully promoted to Deal' },
                  { label: 'Lost', color: 'bg-rose-50 text-rose-700 border-rose-200', desc: 'Disqualified or cold prospect' }
                ].map(item => (
                  <div key={item.label} className="p-3.5 rounded-xl border border-slate-200/80 bg-white">
                    <span className={`text-2xs font-bold px-2 py-0.5 rounded-md border ${item.color}`}>
                      {item.label}
                    </span>
                    <p className="text-2xs text-slate-500 mt-2 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Task Statuses */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-slate-500 mb-3">
                Task Execution Statuses
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Todo', color: 'bg-slate-100 text-slate-700 border-slate-200' },
                  { label: 'In Progress', color: 'bg-blue-50 text-blue-700 border-blue-200' },
                  { label: 'Review', color: 'bg-amber-50 text-amber-700 border-amber-200' },
                  { label: 'Completed', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
                ].map(item => (
                  <div key={item.label} className="p-3.5 rounded-xl border border-slate-200/80 bg-white text-center">
                    <span className={`text-2xs font-bold px-2.5 py-1 rounded-md border ${item.color}`}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. CUSTOM FIELDS
          ───────────────────────────────────────────────────────────── */}
      {subSection === 'custom_fields' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Custom Attributes & Fields</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Extend standard Lead, Deal, Contact, and Company records with proprietary data points
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                icon={<Plus className="w-3.5 h-3.5" />}
                onClick={() => setIsAddFieldOpen(true)}
              >
                New Field
              </Button>
            </div>

            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-2xs font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-3">Field Label</th>
                    <th className="py-3 px-3">CRM Entity</th>
                    <th className="py-3 px-3">Data Type</th>
                    <th className="py-3 px-3">Requirement</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {customFields.map(field => (
                    <tr key={field.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-3">
                        <span className="font-bold text-slate-900">{field.name}</span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                          {field.entity}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-medium text-slate-600">{field.type}</span>
                      </td>
                      <td className="py-3.5 px-3">
                        {field.required ? (
                          <span className="text-2xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            Required
                          </span>
                        ) : (
                          <span className="text-2xs text-slate-400">Optional</span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <button
                          onClick={() => {
                            setCustomFields(customFields.filter(f => f.id !== field.id));
                            showToast('Field Deleted', `Custom field "${field.name}" removed.`, 'info');
                          }}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Custom Field Modal */}
          {isAddFieldOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 w-full max-w-md animate-scale-up">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900">Create Custom Field</h3>
                  <button
                    onClick={() => setIsAddFieldOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <form onSubmit={handleAddCustomField} className="space-y-4 pt-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Field Label</label>
                    <input
                      type="text"
                      placeholder="e.g. Contract Term (Months)"
                      value={newFieldName}
                      onChange={e => setNewFieldName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Applies To Entity</label>
                      <select
                        value={newFieldEntity}
                        onChange={e => setNewFieldEntity(e.target.value as any)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium"
                      >
                        <option value="Lead">Lead</option>
                        <option value="Deal">Deal</option>
                        <option value="Contact">Contact</option>
                        <option value="Company">Company</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Data Type</label>
                      <select
                        value={newFieldType}
                        onChange={e => setNewFieldType(e.target.value as any)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium"
                      >
                        <option value="Text">Text</option>
                        <option value="Number">Number</option>
                        <option value="Dropdown">Dropdown</option>
                        <option value="Date">Date</option>
                        <option value="Boolean">Boolean (Yes/No)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="req"
                      checked={newFieldRequired}
                      onChange={e => setNewFieldRequired(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300"
                    />
                    <label htmlFor="req" className="font-semibold text-slate-700 cursor-pointer">
                      Make this field mandatory upon creation
                    </label>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                    <Button variant="outline" size="sm" onClick={() => setIsAddFieldOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" size="sm">
                      Create Field
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

