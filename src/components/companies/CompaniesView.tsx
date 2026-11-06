import React, { useState, useMemo } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Company } from '../../types';
import { formatCurrency, formatDate, exportToCSV, getAvatarColor } from '../../utils/formatters';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { EmptyState } from '../common/EmptyState';
import {
  Building2,
  Search,
  Download,
  Plus,
  ExternalLink,
  Users,
  DollarSign,
  MoreVertical,
  Grid,
  Table as TableIcon,
  MapPin,
  TrendingUp,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  Edit2,
  Briefcase,
  Layers
} from 'lucide-react';

interface CompaniesViewProps {
  onSelectCompany: (company: Company) => void;
  onOpenNewCompany: () => void;
  onEditCompany: (company: Company) => void;
}

type SortField = 'name' | 'industry' | 'size' | 'revenue' | 'location' | 'contacts' | 'deals' | 'status';
type SortDirection = 'asc' | 'desc';

export const CompaniesView: React.FC<CompaniesViewProps> = ({
  onSelectCompany,
  onOpenNewCompany,
  onEditCompany
}) => {
  const { companies, deals, contacts, deleteCompany, availableUsers, confirmAction } = useCRM();

  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [industryFilter, setIndustryFilter] = useState<string>('all');
  const [ownerFilter, setOwnerFilter] = useState<string>('all');

  // Sorting
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);

  // Compute stats helper
  const getCompanyStats = (companyId: string) => {
    const companyContacts = contacts.filter(c => c.companyId === companyId);
    const companyDeals = deals.filter(d => d.companyId === companyId);
    const activeDeals = companyDeals.filter(d => d.stage !== 'lost');
    const activeDealsValue = activeDeals.reduce((sum, d) => sum + d.value, 0);
    return {
      contactsCount: companyContacts.length,
      dealsCount: companyDeals.length,
      activeDealsCount: activeDeals.length,
      activeDealsValue
    };
  };

  // Filter companies
  const filteredCompanies = useMemo(() => {
    return companies.filter(company => {
      if (statusFilter !== 'all' && company.status !== statusFilter) return false;
      if (industryFilter !== 'all' && company.industry !== industryFilter) return false;
      if (ownerFilter !== 'all' && company.owner.id !== ownerFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = company.name.toLowerCase().includes(q);
        const matchIndustry = company.industry.toLowerCase().includes(q);
        const matchLocation = company.location.toLowerCase().includes(q);
        const matchDomain = company.domain.toLowerCase().includes(q);
        const matchDesc = (company.description || '').toLowerCase().includes(q);
        return matchName || matchIndustry || matchLocation || matchDomain || matchDesc;
      }
      return true;
    });
  }, [companies, statusFilter, industryFilter, ownerFilter, searchQuery]);

  // Sort companies
  const sortedCompanies = useMemo(() => {
    return [...filteredCompanies].sort((a, b) => {
      const statsA = getCompanyStats(a.id);
      const statsB = getCompanyStats(b.id);
      let comparison = 0;

      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'industry':
          comparison = a.industry.localeCompare(b.industry);
          break;
        case 'size':
          comparison = a.size.localeCompare(b.size);
          break;
        case 'revenue':
          comparison = a.annualRevenue - b.annualRevenue;
          break;
        case 'location':
          comparison = a.location.localeCompare(b.location);
          break;
        case 'contacts':
          comparison = statsA.contactsCount - statsB.contactsCount;
          break;
        case 'deals':
          comparison = statsA.activeDealsValue - statsB.activeDealsValue;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          comparison = 0;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredCompanies, sortField, sortDirection, contacts, deals]);

  // Pagination calculations
  const totalPages = Math.ceil(sortedCompanies.length / pageSize) || 1;
  const paginatedCompanies = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedCompanies.slice(start, start + pageSize);
  }, [sortedCompanies, currentPage, pageSize]);

  // Unique industries for filter dropdown
  const industries = useMemo(() => {
    return Array.from(new Set(companies.map(c => c.industry))).filter(Boolean);
  }, [companies]);

  // Quick stats calculations
  const totalAccounts = companies.length;
  const activeCustomers = companies.filter(c => c.status === 'Active Customer').length;
  const totalPipelineSum = deals
    .filter(d => d.stage !== 'lost')
    .reduce((sum, d) => sum + d.value, 0);
  const avgRevenue = companies.length > 0
    ? Math.round(companies.reduce((sum, c) => sum + c.annualRevenue, 0) / companies.length)
    : 0;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleExportCSV = () => {
    const dataToExport = sortedCompanies.map(c => {
      const stats = getCompanyStats(c.id);
      return {
        'Company Name': c.name,
        'Domain': c.domain,
        'Industry': c.industry,
        'Employees / Size': c.size,
        'Annual Revenue': c.annualRevenue,
        'Location': c.location,
        'Contact Count': stats.contactsCount,
        'Active Deals Count': stats.activeDealsCount,
        'Active Pipeline Value': stats.activeDealsValue,
        'Account Status': c.status,
        'Account Owner': c.owner.name,
        'Created Date': formatDate(c.createdAt)
      };
    });
    exportToCSV(dataToExport, `companies_directory_${new Date().toISOString().split('T')[0]}`);
  };

  const statusVariant = (status: string) => {
    switch (status) {
      case 'Active Customer': return 'emerald';
      case 'Prospect': return 'blue';
      case 'Partner': return 'purple';
      case 'Churned': return 'rose';
      default: return 'slate';
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Companies</h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {filteredCompanies.length} accounts • {formatCurrency(totalPipelineSum, true)} Pipeline
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Maintain account-based intelligence, firmographic data, and company deals
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle: Cards vs Table */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              onClick={() => {
                setViewMode('cards');
                setPageSize(9);
              }}
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
              onClick={() => {
                setViewMode('table');
                setPageSize(10);
              }}
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
            onClick={onOpenNewCompany}
          >
            Add Company
          </Button>
        </div>
      </div>

      {/* 2. Top Statistic KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Total Accounts
          </span>
          <span className="text-xl font-extrabold text-slate-900 mt-0.5 block">
            {totalAccounts}
          </span>
          <span className="text-[10px] text-blue-600 font-semibold mt-0.5 block">
            In company directory
          </span>
        </div>

        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Active Customers
          </span>
          <span className="text-xl font-extrabold text-emerald-600 mt-0.5 block">
            {activeCustomers}
          </span>
          <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">
            Live client accounts
          </span>
        </div>

        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Active Pipeline ARR
          </span>
          <span className="text-xl font-extrabold text-blue-600 mt-0.5 block">
            {formatCurrency(totalPipelineSum, true)}
          </span>
          <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">
            Across enterprise deals
          </span>
        </div>

        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Avg. Account Revenue
          </span>
          <span className="text-xl font-extrabold text-slate-900 mt-0.5 block">
            {formatCurrency(avgRevenue, true)}
          </span>
          <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">
            Firmographic benchmark
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
            placeholder="Search company, industry, location or domain..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="Active Customer">Active Customer</option>
            <option value="Prospect">Prospect</option>
            <option value="Partner">Partner</option>
            <option value="Churned">Churned</option>
          </select>

          {/* Industry Filter */}
          <select
            value={industryFilter}
            onChange={e => {
              setIndustryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium"
          >
            <option value="all">All Industries</option>
            {industries.map(ind => (
              <option key={ind} value={ind}>
                {ind}
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
            <option value="all">All Account Owners</option>
            {availableUsers.map(u => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. Main Body: Cards View vs Table View */}
      {filteredCompanies.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
          <EmptyState
            icon={<Building2 className="w-8 h-8" />}
            title="No companies found"
            description="No accounts match your current search or filter criteria."
            actionLabel="+ Add Company"
            onAction={onOpenNewCompany}
          />
        </div>
      ) : viewMode === 'cards' ? (
        /* CARDS VIEW */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedCompanies.map(company => {
              const stats = getCompanyStats(company.id);
              const companyInitials = company.name
                .split(' ')
                .map(n => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase();

              return (
                <div
                  key={company.id}
                  onClick={() => onSelectCompany(company)}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-card hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    {/* 1. Logo, Company Name, Industry & Status */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Company Logo */}
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-2xl font-extrabold text-sm border shadow-2xs shrink-0 group-hover:scale-105 transition-all ${getAvatarColor(
                            company.name
                          )}`}
                        >
                          {companyInitials}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                            {company.name}
                          </h3>
                          <p className="text-xs text-slate-500 truncate mt-0.5 font-medium">
                            {company.industry}
                          </p>
                        </div>
                      </div>

                      <Badge variant={statusVariant(company.status)} size="sm">
                        {company.status}
                      </Badge>
                    </div>

                    {/* Description or Domain */}
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {company.description || `${company.name} is an enterprise account in ${company.location}.`}
                    </p>

                    {/* 2. Firmographic Metrics: Employees, Revenue, Location */}
                    <div className="mt-4 pt-3.5 border-t border-slate-100 grid grid-cols-3 gap-2 text-xs">
                      {/* Employees */}
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Employees
                        </span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-semibold text-slate-800 truncate text-[11px]">
                            {company.size.split(' ')[0]}
                          </span>
                        </div>
                      </div>

                      {/* Revenue */}
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Revenue
                        </span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="font-semibold text-slate-800 truncate text-[11px]">
                            {formatCurrency(company.annualRevenue, true)}
                          </span>
                        </div>
                      </div>

                      {/* Location */}
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Location
                        </span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-semibold text-slate-800 truncate text-[11px]">
                            {company.location.split(',')[0]}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. Footer: Contact count & Active deals */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    {/* Contact Count */}
                    <div className="flex items-center gap-1.5 font-medium text-slate-600">
                      <Users className="w-3.5 h-3.5 text-blue-600" />
                      <span>{stats.contactsCount} {stats.contactsCount === 1 ? 'contact' : 'contacts'}</span>
                    </div>

                    {/* Active Deals */}
                    <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                      <Briefcase className="w-3.5 h-3.5 text-purple-600" />
                      <span>
                        {stats.activeDealsCount} {stats.activeDealsCount === 1 ? 'deal' : 'deals'}
                      </span>
                      {stats.activeDealsValue > 0 && (
                        <span className="text-blue-600">({formatCurrency(stats.activeDealsValue, true)})</span>
                      )}
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
                Showing {Math.min((currentPage - 1) * pageSize + 1, sortedCompanies.length)} -{' '}
                {Math.min(currentPage * pageSize, sortedCompanies.length)} of {sortedCompanies.length} companies
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
        /* TABLE VIEW (High density grid with all 8 fields + Actions) */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="sticky top-0 bg-slate-50/95 backdrop-blur-xs z-10 border-b border-slate-200/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  {/* 1. Logo & Company Name */}
                  <th
                    onClick={() => handleSort('name')}
                    className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition-colors select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Company</span>
                      {sortField === 'name' ? (
                        sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-blue-600" /> : <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
                      ) : (
                        <ArrowUpDown className="w-3.5 h-3.5 text-slate-300" />
                      )}
                    </div>
                  </th>

                  {/* 2. Industry */}
                  <th
                    onClick={() => handleSort('industry')}
                    className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition-colors select-none hidden sm:table-cell"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Industry</span>
                      {sortField === 'industry' ? (
                        sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-blue-600" /> : <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
                      ) : (
                        <ArrowUpDown className="w-3.5 h-3.5 text-slate-300" />
                      )}
                    </div>
                  </th>

                  {/* 3. Employees */}
                  <th
                    onClick={() => handleSort('size')}
                    className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition-colors select-none hidden md:table-cell"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Employees</span>
                      {sortField === 'size' ? (
                        sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-blue-600" /> : <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
                      ) : (
                        <ArrowUpDown className="w-3.5 h-3.5 text-slate-300" />
                      )}
                    </div>
                  </th>

                  {/* 4. Revenue */}
                  <th
                    onClick={() => handleSort('revenue')}
                    className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition-colors select-none hidden lg:table-cell"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Revenue</span>
                      {sortField === 'revenue' ? (
                        sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-blue-600" /> : <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
                      ) : (
                        <ArrowUpDown className="w-3.5 h-3.5 text-slate-300" />
                      )}
                    </div>
                  </th>

                  {/* 5. Location */}
                  <th
                    onClick={() => handleSort('location')}
                    className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition-colors select-none hidden sm:table-cell"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Location</span>
                      {sortField === 'location' ? (
                        sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-blue-600" /> : <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
                      ) : (
                        <ArrowUpDown className="w-3.5 h-3.5 text-slate-300" />
                      )}
                    </div>
                  </th>

                  {/* 6. Contact Count */}
                  <th
                    onClick={() => handleSort('contacts')}
                    className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition-colors select-none hidden xl:table-cell"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Contacts</span>
                      {sortField === 'contacts' ? (
                        sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-blue-600" /> : <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
                      ) : (
                        <ArrowUpDown className="w-3.5 h-3.5 text-slate-300" />
                      )}
                    </div>
                  </th>

                  {/* 7. Active Deals */}
                  <th
                    onClick={() => handleSort('deals')}
                    className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition-colors select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Active Deals</span>
                      {sortField === 'deals' ? (
                        sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-blue-600" /> : <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
                      ) : (
                        <ArrowUpDown className="w-3.5 h-3.5 text-slate-300" />
                      )}
                    </div>
                  </th>

                  {/* 8. Status */}
                  <th
                    onClick={() => handleSort('status')}
                    className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition-colors select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Status</span>
                      {sortField === 'status' ? (
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
                {paginatedCompanies.map(company => {
                  const stats = getCompanyStats(company.id);
                  const companyInitials = company.name
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase();

                  return (
                    <tr
                      key={company.id}
                      onClick={() => onSelectCompany(company)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      {/* 1. Logo & Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-xl font-extrabold text-xs shrink-0 border ${getAvatarColor(
                              company.name
                            )}`}
                          >
                            {companyInitials}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 hover:text-blue-600 transition-colors block">
                              {company.name}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {company.domain}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 2. Industry */}
                      <td className="py-3 px-4 font-medium text-slate-700 hidden sm:table-cell">
                        {company.industry}
                      </td>

                      {/* 3. Employees */}
                      <td className="py-3 px-4 text-slate-600 hidden md:table-cell">
                        {company.size}
                      </td>

                      {/* 4. Revenue */}
                      <td className="py-3 px-4 font-bold text-slate-900 hidden lg:table-cell">
                        {formatCurrency(company.annualRevenue, true)}
                      </td>

                      {/* 5. Location */}
                      <td className="py-3 px-4 text-slate-600 hidden sm:table-cell">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{company.location}</span>
                        </div>
                      </td>

                      {/* 6. Contact Count */}
                      <td className="py-3 px-4 font-semibold text-slate-700 hidden xl:table-cell">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-blue-600" />
                          <span>{stats.contactsCount}</span>
                        </div>
                      </td>

                      {/* 7. Active Deals */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900">
                          <span>{stats.activeDealsCount}</span>
                          {stats.activeDealsValue > 0 && (
                            <span className="text-blue-600 text-[11px] font-semibold">
                              ({formatCurrency(stats.activeDealsValue, true)})
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 8. Status */}
                      <td className="py-3 px-4">
                        <Badge variant={statusVariant(company.status)} size="sm">
                          {company.status}
                        </Badge>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onSelectCompany(company)}
                            className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Company Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onEditCompany(company)}
                            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Edit Company"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              confirmAction({
                                title: 'Delete Company',
                                message: `Are you sure you want to delete company ${company.name}? Associated contact mappings will be unlinked.`,
                                confirmText: 'Delete Company',
                                variant: 'danger',
                                onConfirm: () => deleteCompany(company.id)
                              });
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Company"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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
                Showing {Math.min((currentPage - 1) * pageSize + 1, sortedCompanies.length)} -{' '}
                {Math.min(currentPage * pageSize, sortedCompanies.length)} of {sortedCompanies.length} companies
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
