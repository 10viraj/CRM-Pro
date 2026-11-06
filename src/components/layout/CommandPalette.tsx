import React, { useState, useEffect, useRef } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  Search,
  UserPlus,
  Kanban,
  Users,
  Building2,
  CheckSquare,
  ArrowRight,
  TrendingUp,
  X
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface CommandPaletteProps {
  onOpenNewLead: () => void;
  onOpenNewDeal: () => void;
  onOpenNewContact: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  onOpenNewLead,
  onOpenNewDeal,
  onOpenNewContact
}) => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    leads,
    deals,
    contacts,
    companies,
    setActiveView
  } = useCRM();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredLeads = leads
    .filter(l => l.name.toLowerCase().includes(q) || l.company.toLowerCase().includes(q))
    .slice(0, 3);

  const filteredDeals = deals
    .filter(d => d.title.toLowerCase().includes(q) || d.companyName.toLowerCase().includes(q))
    .slice(0, 3);

  const filteredContacts = contacts
    .filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q))
    .slice(0, 3);

  const filteredCompanies = companies
    .filter(c => c.name.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q))
    .slice(0, 3);

  const hasResults =
    filteredLeads.length > 0 ||
    filteredDeals.length > 0 ||
    filteredContacts.length > 0 ||
    filteredCompanies.length > 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={() => setIsCommandPaletteOpen(false)}
      />

      <div className="relative mx-auto max-w-xl rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 animate-scale-up overflow-hidden border border-slate-200">
        {/* Search input bar */}
        <div className="flex items-center px-4 border-b border-slate-100">
          <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a command or search leads, deals, contacts..."
            className="w-full bg-transparent py-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-4">
          {/* Quick Actions if query is short */}
          {!q && (
            <div className="px-2 py-1">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Quick Shortcuts
              </p>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setIsCommandPaletteOpen(false);
                    onOpenNewLead();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <UserPlus className="w-4 h-4 text-blue-600" />
                    <span>Create New Lead</span>
                  </div>
                  <kbd className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-mono">
                    L
                  </kbd>
                </button>
                <button
                  onClick={() => {
                    setIsCommandPaletteOpen(false);
                    onOpenNewDeal();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Kanban className="w-4 h-4 text-emerald-600" />
                    <span>Add Opportunity / Deal</span>
                  </div>
                  <kbd className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-mono">
                    D
                  </kbd>
                </button>
                <button
                  onClick={() => {
                    setIsCommandPaletteOpen(false);
                    setActiveView('reports');
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <TrendingUp className="w-4 h-4 text-indigo-600" />
                    <span>View Sales Reports</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>
          )}

          {/* Leads */}
          {filteredLeads.length > 0 && (
            <div>
              <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Leads
              </p>
              {filteredLeads.map(lead => (
                <button
                  key={lead.id}
                  onClick={() => {
                    setIsCommandPaletteOpen(false);
                    setActiveView('leads');
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-blue-50/60 rounded-xl transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-100 text-blue-700 font-semibold text-[10px]">
                      {lead.score}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 group-hover:text-blue-600">
                        {lead.name}
                      </p>
                      <p className="text-[11px] text-slate-500">{lead.company} • {lead.title}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-slate-500">
                    {formatCurrency(lead.estimatedValue, true)}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Deals */}
          {filteredDeals.length > 0 && (
            <div>
              <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Deals
              </p>
              {filteredDeals.map(deal => (
                <button
                  key={deal.id}
                  onClick={() => {
                    setIsCommandPaletteOpen(false);
                    setActiveView('deals');
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-emerald-50/60 rounded-xl transition-colors group"
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <Kanban className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div className="truncate">
                      <p className="font-semibold text-slate-900 group-hover:text-emerald-700 truncate">
                        {deal.title}
                      </p>
                      <p className="text-[11px] text-slate-500">{deal.companyName}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-900 shrink-0">
                    {formatCurrency(deal.value, true)}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Contacts */}
          {filteredContacts.length > 0 && (
            <div>
              <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Contacts
              </p>
              {filteredContacts.map(contact => (
                <button
                  key={contact.id}
                  onClick={() => {
                    setIsCommandPaletteOpen(false);
                    setActiveView('contacts');
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-purple-50/60 rounded-xl transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-purple-600 shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-900 group-hover:text-purple-700">
                        {contact.name}
                      </p>
                      <p className="text-[11px] text-slate-500">{contact.companyName} • {contact.title}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Companies */}
          {filteredCompanies.length > 0 && (
            <div>
              <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Companies
              </p>
              {filteredCompanies.map(comp => (
                <button
                  key={comp.id}
                  onClick={() => {
                    setIsCommandPaletteOpen(false);
                    setActiveView('companies');
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-amber-50/60 rounded-xl transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-900 group-hover:text-amber-700">
                        {comp.name}
                      </p>
                      <p className="text-[11px] text-slate-500">{comp.industry} • {comp.location}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {q && !hasResults && (
            <div className="py-8 text-center">
              <p className="text-xs text-slate-500">No records found matching "{query}"</p>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-50/90 border-t border-slate-100 text-[11px] text-slate-500">
          <span>Navigate with arrows</span>
          <span>Press ESC to exit</span>
        </div>
      </div>
    </div>
  );
};

