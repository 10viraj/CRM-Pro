import React, { useState, useMemo } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Contact, LifecycleStage } from '../../types';
import { formatDate, formatTimeAgo, exportToCSV, getAvatarColor } from '../../utils/formatters';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { EmptyState } from '../common/EmptyState';
import {
  Users,
  Search,
  Download,
  Plus,
  Mail,
  Phone,
  MoreVertical,
  Filter,
  Grid,
  Table as TableIcon,
  Building2,
  Clock,
  User as UserIcon,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  Edit2,
  Calendar,
  Briefcase
} from 'lucide-react';

interface ContactsViewProps {
  onSelectContact: (contact: Contact) => void;
  onOpenNewContact: () => void;
  onEditContact: (contact: Contact) => void;
}

type SortField = 'name' | 'company' | 'title' | 'lastActivity' | 'owner' | 'stage';
type SortDirection = 'asc' | 'desc';

export const ContactsView: React.FC<ContactsViewProps> = ({
  onSelectContact,
  onOpenNewContact,
  onEditContact
}) => {
  const { contacts, companies, deleteContact, availableUsers, confirmAction } = useCRM();

  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [lifecycleFilter, setLifecycleFilter] = useState<string>('all');
  const [companyFilter, setCompanyFilter] = useState<string>('all');
  const [ownerFilter, setOwnerFilter] = useState<string>('all');

  // Sorting
  const [sortField, setSortField] = useState<SortField>('lastActivity');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter contacts
  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      if (lifecycleFilter !== 'all' && contact.lifecycleStage !== lifecycleFilter) return false;
      if (companyFilter !== 'all' && contact.companyId !== companyFilter) return false;
      if (ownerFilter !== 'all' && contact.owner.id !== ownerFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = contact.name.toLowerCase().includes(q);
        const matchEmail = contact.email.toLowerCase().includes(q);
        const matchPhone = (contact.phone || '').toLowerCase().includes(q);
        const matchCompany = contact.companyName.toLowerCase().includes(q);
        const matchTitle = contact.title.toLowerCase().includes(q);
        const matchTags = contact.tags.some(t => t.toLowerCase().includes(q));
        return matchName || matchEmail || matchPhone || matchCompany || matchTitle || matchTags;
      }
      return true;
    });
  }, [contacts, lifecycleFilter, companyFilter, ownerFilter, searchQuery]);

  // Sort contacts
  const sortedContacts = useMemo(() => {
    return [...filteredContacts].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'company':
          comparison = a.companyName.localeCompare(b.companyName);
          break;
        case 'title':
          comparison = (a.title || '').localeCompare(b.title || '');
          break;
        case 'lastActivity': {
          const timeA = a.lastActivityDate ? new Date(a.lastActivityDate).getTime() : new Date(a.createdAt).getTime();
          const timeB = b.lastActivityDate ? new Date(b.lastActivityDate).getTime() : new Date(b.createdAt).getTime();
          comparison = timeA - timeB;
          break;
        }
        case 'owner':
          comparison = a.owner.name.localeCompare(b.owner.name);
          break;
        case 'stage':
          comparison = a.lifecycleStage.localeCompare(b.lifecycleStage);
          break;
        default:
          comparison = 0;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredContacts, sortField, sortDirection]);

  // Pagination calculations
  const totalPages = Math.ceil(sortedContacts.length / pageSize) || 1;
  const paginatedContacts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedContacts.slice(start, start + pageSize);
  }, [sortedContacts, currentPage, pageSize]);

  // Quick stats
  const totalContacts = contacts.length;
  const customerCount = contacts.filter(c => c.lifecycleStage === 'customer' || c.lifecycleStage === 'evangelist').length;
  const opportunityCount = contacts.filter(c => c.lifecycleStage === 'opportunity').length;
  const decisionMakerCount = contacts.filter(c => c.tags.some(t => t.toLowerCase().includes('decision') || t.toLowerCase().includes('executive'))).length;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleExportCSV = () => {
    const dataToExport = sortedContacts.map(c => ({
      Name: c.name,
      'Job Title': c.title,
      Company: c.companyName,
      Email: c.email,
      Phone: c.phone || 'N/A',
      'Lifecycle Stage': c.lifecycleStage.replace('_', ' ').toUpperCase(),
      'Assigned Owner': c.owner.name,
      'Last Activity': c.lastActivityDate ? formatDate(c.lastActivityDate) : formatDate(c.createdAt),
      'Created Date': formatDate(c.createdAt)
    }));
    exportToCSV(dataToExport, `contacts_export_${new Date().toISOString().split('T')[0]}`);
  };

  const lifecycleBadgeVariant = (stage: LifecycleStage) => {
    switch (stage) {
      case 'lead': return 'blue';
      case 'marketing_qualified': return 'purple';
      case 'opportunity': return 'amber';
      case 'customer': return 'emerald';
      case 'evangelist': return 'pink';
      default: return 'slate';
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Contacts</h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {filteredContacts.length} people • {companies.length} companies
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your customer relationships, decision-makers, and communication history
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle: Cards vs Table */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'cards'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            icon={<Download className="w-3.5 h-3.5" />}
            onClick={handleExportCSV}
          >
            Export
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={onOpenNewContact}
          >
            Add Contact
          </Button>
        </div>
      </div>

      {/* 2. Top Statistic KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Total Contacts
          </span>
          <span className="text-xl font-extrabold text-slate-900 mt-0.5 block">
            {totalContacts}
          </span>
          <span className="text-[10px] text-blue-600 font-semibold mt-0.5 block">
            In business directory
          </span>
        </div>

        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Active Customers
          </span>
          <span className="text-xl font-extrabold text-emerald-600 mt-0.5 block">
            {customerCount}
          </span>
          <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">
            Closed accounts
          </span>
        </div>

        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Opportunities
          </span>
          <span className="text-xl font-extrabold text-amber-600 mt-0.5 block">
            {opportunityCount}
          </span>
          <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">
            Active pipeline buyers
          </span>
        </div>

        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Decision Makers
          </span>
          <span className="text-xl font-extrabold text-purple-600 mt-0.5 block">
            {decisionMakerCount}
          </span>
          <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">
            Budget holders & VP+
          </span>
        </div>
      </div>

      {/* 3. Search and Multi-Criteria Filtering Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search name, job title, company, email, phone..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          {/* Lifecycle Filter */}
          <select
            value={lifecycleFilter}
            onChange={e => {
              setLifecycleFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium"
          >
            <option value="all">All Lifecycles</option>
            <option value="lead">Lead</option>
            <option value="marketing_qualified">Marketing Qualified</option>
            <option value="opportunity">Opportunity</option>
            <option value="customer">Customer</option>
            <option value="evangelist">Evangelist</option>
          </select>

          {/* Company Filter */}
          <select
            value={companyFilter}
            onChange={e => {
              setCompanyFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium"
          >
            <option value="all">All Companies</option>
            {companies.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Owner Filter */}
          <select
            value={ownerFilter}
            onChange={e => {
              setOwnerFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium"
          >
            <option value="all">All Salespeople</option>
            {availableUsers.map(u => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. Main Body: Cards View vs Table View */}
      {filteredContacts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
          <EmptyState
            icon={<Users className="w-8 h-8" />}
            title="No contacts found"
            description="No contacts match your current search or filter criteria."
            actionLabel="+ Add Contact"
            onAction={onOpenNewContact}
          />
        </div>
      ) : viewMode === 'cards' ? (
        /* CARDS VIEW */
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedContacts.map(contact => {
              const initials = contact.name
                .split(' ')
                .map(n => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase();

              return (
                <div
                  key={contact.id}
                  onClick={() => onSelectContact(contact)}
                  className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-card hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    {/* 1. Profile photo, Name, Job title & Options */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-2xl font-bold text-sm shrink-0 border shadow-2xs ${getAvatarColor(
                            contact.name
                          )}`}
                        >
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                            {contact.name}
                          </h4>
                          <p className="text-xs text-slate-500 font-medium truncate">
                            {contact.title}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => onEditContact(contact)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            confirmAction({
                              title: 'Delete Contact',
                              message: `Are you sure you want to permanently delete ${contact.name}?`,
                              confirmText: 'Delete Contact',
                              variant: 'danger',
                              onConfirm: () => deleteContact(contact.id)
                            });
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* 2. Company & Lifecycle Stage */}
                    <div className="mt-3.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-700 truncate max-w-[180px]">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{contact.companyName}</span>
                      </div>
                      <Badge variant={lifecycleBadgeVariant(contact.lifecycleStage)} size="sm">
                        {contact.lifecycleStage.replace('_', ' ')}
                      </Badge>
                    </div>

                    {/* 3. Direct Contact Details: Email & Phone */}
                    <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <a
                          href={`mailto:${contact.email}`}
                          onClick={e => e.stopPropagation()}
                          className="truncate hover:text-blue-600 hover:underline"
                        >
                          {contact.email}
                        </a>
                      </div>

                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {contact.phone ? (
                          <a
                            href={`tel:${contact.phone}`}
                            onClick={e => e.stopPropagation()}
                            className="hover:text-blue-600 hover:underline"
                          >
                            {contact.phone}
                          </a>
                        ) : (
                          <span className="text-slate-400">No direct phone</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 4. Footer: Last Activity & Owner */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>
                        {contact.lastActivityDate
                          ? formatTimeAgo(contact.lastActivityDate)
                          : formatTimeAgo(contact.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-[9px] font-bold">
                        {contact.owner.initials}
                      </span>
                      <span className="text-slate-700 font-medium">{contact.owner.name.split(' ')[0]}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cards Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-3.5 bg-white rounded-2xl border border-slate-200/80 gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span>Show</span>
              <select
                value={pageSize}
                onChange={e => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-slate-200 rounded-lg px-2 py-1 bg-slate-50 font-medium"
              >
                <option value={9}>9 cards</option>
                <option value={15}>15 cards</option>
                <option value={30}>30 cards</option>
              </select>
              <span>
                Showing {Math.min((currentPage - 1) * pageSize + 1, sortedContacts.length)} -{' '}
                {Math.min(currentPage * pageSize, sortedContacts.length)} of {sortedContacts.length} contacts
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-2.5 py-1.5 border border-slate-200 rounded-lg font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
              <span className="px-2 font-bold text-slate-800">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-2.5 py-1.5 border border-slate-200 rounded-lg font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="sticky top-0 bg-slate-50/95 backdrop-blur-xs z-10 border-b border-slate-200/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  {/* 1. Profile photo & Name */}
                  <th
                    onClick={() => handleSort('name')}
                    className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition-colors select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Contact</span>
                      {sortField === 'name' ? (
                        sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-blue-600" /> : <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
                      ) : (
                        <ArrowUpDown className="w-3.5 h-3.5 text-slate-300" />
                      )}
                    </div>
                  </th>

                  {/* 2. Job title */}
                  <th
                    onClick={() => handleSort('title')}
                    className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition-colors select-none hidden sm:table-cell"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Job Title</span>
                      {sortField === 'title' ? (
                        sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-blue-600" /> : <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
                      ) : (
                        <ArrowUpDown className="w-3.5 h-3.5 text-slate-300" />
                      )}
                    </div>
                  </th>

                  {/* 3. Company */}
                  <th
                    onClick={() => handleSort('company')}
                    className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition-colors select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Company</span>
                      {sortField === 'company' ? (
                        sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-blue-600" /> : <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
                      ) : (
                        <ArrowUpDown className="w-3.5 h-3.5 text-slate-300" />
                      )}
                    </div>
                  </th>

                  {/* 4. Email */}
                  <th className="py-3.5 px-4">Email</th>

                  {/* 5. Phone */}
                  <th className="py-3.5 px-4 hidden lg:table-cell">Phone</th>

                  {/* 6. Last activity */}
                  <th
                    onClick={() => handleSort('lastActivity')}
                    className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition-colors select-none hidden xl:table-cell"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Last Activity</span>
                      {sortField === 'lastActivity' ? (
                        sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-blue-600" /> : <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
                      ) : (
                        <ArrowUpDown className="w-3.5 h-3.5 text-slate-300" />
                      )}
                    </div>
                  </th>

                  {/* 7. Owner */}
                  <th
                    onClick={() => handleSort('owner')}
                    className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition-colors select-none hidden md:table-cell"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Owner</span>
                      {sortField === 'owner' ? (
                        sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-blue-600" /> : <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
                      ) : (
                        <ArrowUpDown className="w-3.5 h-3.5 text-slate-300" />
                      )}
                    </div>
                  </th>

                  {/* 8. Lifecycle Stage */}
                  <th
                    onClick={() => handleSort('stage')}
                    className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition-colors select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Stage</span>
                      {sortField === 'stage' ? (
                        sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-blue-600" /> : <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
                      ) : (
                        <ArrowUpDown className="w-3.5 h-3.5 text-slate-300" />
                      )}
                    </div>
                  </th>

                  {/* Actions */}
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedContacts.map(contact => (
                  <tr
                    key={contact.id}
                    onClick={() => onSelectContact(contact)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    {/* 1. Profile photo & Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-xl font-bold text-xs shrink-0 border ${getAvatarColor(
                            contact.name
                          )}`}
                        >
                          {contact.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <span className="font-bold text-slate-900 hover:text-blue-600 transition-colors">
                          {contact.name}
                        </span>
                      </div>
                    </td>

                    {/* 2. Job Title */}
                    <td className="py-3 px-4 font-medium text-slate-600 hidden sm:table-cell">
                      {contact.title}
                    </td>

                    {/* 3. Company */}
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {contact.companyName}
                    </td>

                    {/* 4. Email */}
                    <td className="py-3 px-4 text-slate-600" onClick={e => e.stopPropagation()}>
                      <a
                        href={`mailto:${contact.email}`}
                        className="hover:text-blue-600 hover:underline inline-flex items-center gap-1"
                      >
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span>{contact.email}</span>
                      </a>
                    </td>

                    {/* 5. Phone */}
                    <td className="py-3 px-4 text-slate-600 hidden lg:table-cell" onClick={e => e.stopPropagation()}>
                      {contact.phone ? (
                        <a
                          href={`tel:${contact.phone}`}
                          className="hover:text-blue-600 hover:underline inline-flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{contact.phone}</span>
                        </a>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    {/* 6. Last Activity */}
                    <td className="py-3 px-4 text-slate-500 text-[11px] hidden xl:table-cell">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>
                          {contact.lastActivityDate
                            ? formatTimeAgo(contact.lastActivityDate)
                            : formatTimeAgo(contact.createdAt)}
                        </span>
                      </div>
                    </td>

                    {/* 7. Owner */}
                    <td className="py-3 px-4 hidden md:table-cell">
                      <div className="flex items-center gap-1.5">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
                          {contact.owner.initials}
                        </span>
                        <span className="text-slate-700 font-medium">{contact.owner.name}</span>
                      </div>
                    </td>

                    {/* 8. Stage */}
                    <td className="py-3 px-4">
                      <Badge variant={lifecycleBadgeVariant(contact.lifecycleStage)} size="sm">
                        {contact.lifecycleStage.replace('_', ' ')}
                      </Badge>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onSelectContact(contact)}
                          className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Contact Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEditContact(contact)}
                          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit Contact"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            confirmAction({
                              title: 'Delete Contact',
                              message: `Are you sure you want to permanently delete ${contact.name}?`,
                              confirmText: 'Delete Contact',
                              variant: 'danger',
                              onConfirm: () => deleteContact(contact.id)
                            });
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Contact"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-3.5 border-t border-slate-200/80 gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span>Show</span>
              <select
                value={pageSize}
                onChange={e => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-slate-200 rounded-lg px-2 py-1 bg-slate-50 font-medium"
              >
                <option value={10}>10 rows</option>
                <option value={25}>25 rows</option>
                <option value={50}>50 rows</option>
              </select>
              <span>
                Showing {Math.min((currentPage - 1) * pageSize + 1, sortedContacts.length)} -{' '}
                {Math.min(currentPage * pageSize, sortedContacts.length)} of {sortedContacts.length} contacts
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-2.5 py-1.5 border border-slate-200 rounded-lg font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
              <span className="px-2 font-bold text-slate-800">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-2.5 py-1.5 border border-slate-200 rounded-lg font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
