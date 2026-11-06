import React, { useState } from 'react';
import { Drawer } from '../common/Drawer';
import { Company, Contact, Deal, Activity, CompanyDocument, Note } from '../../types';
import { useCRM } from '../../context/CRMContext';
import { formatCurrency, formatDate, formatTimeAgo, getAvatarColor } from '../../utils/formatters';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  Building2,
  Globe,
  MapPin,
  Users,
  DollarSign,
  Briefcase,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Mail,
  Phone,
  Video,
  CheckSquare,
  FileText,
  FileSpreadsheet,
  FileCode,
  FileImage,
  File,
  Download,
  Upload,
  MessageSquare,
  Send,
  Clock,
  ChevronDown
} from 'lucide-react';

interface CompanyDetailDrawerProps {
  company: Company | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (company: Company) => void;
  onSelectContact: (contact: Contact) => void;
  onSelectDeal: (deal: Deal) => void;
  onOpenNewDealForCompany: (company: Company) => void;
  onOpenNewContactForCompany?: (company: Company) => void;
}

type CompanyTab = 'contacts' | 'deals' | 'activities' | 'notes' | 'documents';

export const CompanyDetailDrawer: React.FC<CompanyDetailDrawerProps> = ({
  company,
  isOpen,
  onClose,
  onEdit,
  onSelectContact,
  onSelectDeal,
  onOpenNewDealForCompany,
  onOpenNewContactForCompany
}) => {
  const {
    contacts,
    deals,
    activities,
    addActivity,
    toggleActivityCompleted,
    deleteCompany,
    addNote,
    addCompanyDocument,
    deleteCompanyDocument,
    updateCompany,
    availableUsers,
    currentUser,
    showToast,
    confirmAction
  } = useCRM();

  const [activeTab, setActiveTab] = useState<CompanyTab>('contacts');
  const [newNoteContent, setNewNoteContent] = useState('');

  // Interactive Action Modals
  const [activeModal, setActiveModal] = useState<'call' | 'email' | 'meeting' | 'task' | 'document' | null>(null);

  // Form states
  const [callOutcome, setCallOutcome] = useState('Executive Alignment Completed');
  const [callNotes, setCallNotes] = useState('');

  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  const [meetingTitle, setMeetingTitle] = useState('Executive Partnership Review');
  const [meetingDate, setMeetingDate] = useState(new Date().toISOString().split('T')[0]);
  const [meetingDuration, setMeetingDuration] = useState('45');

  const [taskTitle, setTaskTitle] = useState('');
  const [taskDueDate, setTaskDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [taskPriority, setTaskPriority] = useState<'low' | 'medium' | 'high'>('high');

  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState<'pdf' | 'doc' | 'sheet' | 'image'>('pdf');
  const [docSize, setDocSize] = useState('2.4 MB');

  if (!company) return null;

  // 1. Associated contacts
  const companyContacts = contacts.filter(c => c.companyId === company.id);

  // 2. Associated deals
  const companyDeals = deals.filter(d => d.companyId === company.id);
  const activeDeals = companyDeals.filter(d => d.stage !== 'lost');
  const totalPipelineValue = activeDeals.reduce((sum, d) => sum + d.value, 0);

  // 3. Associated activities (related to company or any of its contacts)
  const contactIds = new Set(companyContacts.map(c => c.id));
  const companyActivities = activities.filter(
    a =>
      a.relatedTo?.id === company.id ||
      contactIds.has(a.relatedTo?.id) ||
      a.relatedTo?.name?.toLowerCase().includes(company.name.toLowerCase())
  );

  const handleDelete = () => {
    confirmAction({
      title: 'Delete Company',
      message: `Are you sure you want to delete company ${company.name} and remove its associations?`,
      confirmText: 'Delete Company',
      variant: 'danger',
      onConfirm: () => {
        deleteCompany(company.id);
        onClose();
      }
    });
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;
    addNote('company', company.id, newNoteContent);
    setNewNoteContent('');
  };

  const handleReassignOwner = (newOwnerId: string) => {
    const newOwner = availableUsers.find(u => u.id === newOwnerId);
    if (newOwner) {
      updateCompany(company.id, { owner: newOwner });
      showToast('Account Owner Updated', `Company reassigned to ${newOwner.name}.`, 'info');
    }
  };

  // Activity submit handlers
  const handleLogCallSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addActivity({
      type: 'call',
      title: `Call: ${callOutcome}`,
      dueDate: new Date().toISOString().split('T')[0],
      durationMinutes: 20,
      completed: true,
      priority: 'medium',
      description: callNotes || `Call with executive leadership at ${company.name}. Outcome: ${callOutcome}`,
      relatedTo: {
        type: 'company',
        id: company.id,
        name: company.name
      },
      assignedTo: currentUser
    });
    setCallNotes('');
    setActiveModal(null);
  };

  const handleLogEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSubject.trim()) return;
    addActivity({
      type: 'email',
      title: `Email: ${emailSubject}`,
      dueDate: new Date().toISOString().split('T')[0],
      completed: true,
      priority: 'medium',
      description: emailBody || `Correspondence with account team at ${company.name}`,
      relatedTo: {
        type: 'company',
        id: company.id,
        name: company.name
      },
      assignedTo: currentUser
    });
    setEmailSubject('');
    setEmailBody('');
    setActiveModal(null);
  };

  const handleScheduleMeetingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingTitle.trim()) return;
    addActivity({
      type: 'meeting',
      title: meetingTitle.trim(),
      dueDate: meetingDate,
      durationMinutes: Number(meetingDuration),
      completed: false,
      priority: 'high',
      description: `Meeting with account stakeholders at ${company.name}`,
      relatedTo: {
        type: 'company',
        id: company.id,
        name: company.name
      },
      assignedTo: company.owner
    });
    setActiveModal(null);
  };

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    addActivity({
      type: 'task',
      title: taskTitle.trim(),
      dueDate: taskDueDate,
      completed: false,
      priority: taskPriority,
      relatedTo: {
        type: 'company',
        id: company.id,
        name: company.name
      },
      assignedTo: company.owner
    });
    setTaskTitle('');
    setActiveModal(null);
  };

  const handleUploadDocumentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;
    const finalName = docName.includes('.')
      ? docName
      : `${docName}.${docType === 'sheet' ? 'xlsx' : docType === 'doc' ? 'docx' : docType}`;

    addCompanyDocument(company.id, {
      name: finalName,
      size: docSize || '2.1 MB',
      type: docType,
      uploadedBy: currentUser
    });
    setDocName('');
    setActiveModal(null);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-rose-500" />;
      case 'sheet':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-500" />;
      case 'doc':
        return <FileCode className="w-5 h-5 text-blue-500" />;
      case 'image':
        return <FileImage className="w-5 h-5 text-purple-500" />;
      default:
        return <File className="w-5 h-5 text-slate-500" />;
    }
  };

  const statusVariant = {
    'Active Customer': 'emerald',
    'Prospect': 'blue',
    'Partner': 'purple',
    'Churned': 'rose'
  }[company.status] as any;

  const companyInitials = company.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const documentsList: CompanyDocument[] = company.documents || [];
  const notesList: Note[] = company.notes || [];

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={company.name}
      subtitle={`${company.industry} • ${company.location}`}
      width="xl"
    >
      <div className="space-y-5">
        {/* 1. Header Profile Banner & Quick CTAs */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div
                className={`flex h-13 w-13 items-center justify-center rounded-2xl font-extrabold text-base border shadow-2xs shrink-0 ${getAvatarColor(
                  company.name
                )}`}
              >
                {companyInitials}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    {company.name}
                  </h3>
                  <Badge variant={statusVariant} size="sm">
                    {company.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mt-0.5">
                  <span>{company.industry}</span>
                  <span>•</span>
                  <span>{company.location}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 self-end sm:self-auto">
              <Button
                size="sm"
                variant="outline"
                icon={<Edit2 className="w-3.5 h-3.5" />}
                onClick={() => onEdit(company)}
              >
                Edit
              </Button>
              <button
                onClick={handleDelete}
                className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                title="Delete Company"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Firmographic Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-slate-200/60 text-xs">
            <div className="p-2.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Annual Revenue
              </span>
              <p className="font-extrabold text-slate-900 text-sm mt-0.5">
                {formatCurrency(company.annualRevenue, true)}
              </p>
            </div>

            <div className="p-2.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Employees
              </span>
              <p className="font-bold text-slate-900 text-sm mt-0.5">{company.size}</p>
            </div>

            <div className="p-2.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Active Deals Value
              </span>
              <p className="font-extrabold text-blue-600 text-sm mt-0.5">
                {formatCurrency(totalPipelineValue, true)}
              </p>
            </div>

            <div className="p-2.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Account Owner
              </span>
              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-[9px] font-bold">
                  {company.owner.initials}
                </span>
                <span className="font-bold text-slate-900 text-xs truncate">
                  {company.owner.name.split(' ')[0]}
                </span>
              </div>
            </div>
          </div>

          {/* Action Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/60">
            <a
              href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:border-blue-300 shadow-2xs transition-all"
            >
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>{company.domain || 'Visit Website'}</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            {company.phone && (
              <a
                href={`tel:${company.phone}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:border-blue-300 shadow-2xs transition-all"
              >
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Call Mainline</span>
              </a>
            )}

            <button
              onClick={() => setActiveModal('call')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:border-blue-300 shadow-2xs transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-blue-500" />
              <span>Log Call</span>
            </button>

            <button
              onClick={() => setActiveModal('meeting')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:border-blue-300 shadow-2xs transition-all"
            >
              <Video className="w-3.5 h-3.5 text-purple-500" />
              <span>Schedule Meeting</span>
            </button>

            <button
              onClick={() => onOpenNewDealForCompany(company)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-700 hover:bg-blue-100 shadow-2xs transition-all sm:ml-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Opportunity</span>
            </button>
          </div>
        </div>

        {/* 2. Tab Navigation: Contacts | Deals | Activities | Notes | Documents */}
        <div className="border-b border-slate-200">
          <div className="flex gap-2 -mb-px overflow-x-auto">
            {/* Tab 1: Contacts */}
            <button
              onClick={() => setActiveTab('contacts')}
              className={`flex items-center gap-1.5 py-2.5 px-3.5 text-xs font-semibold border-b-2 transition-all ${
                activeTab === 'contacts'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Contacts ({companyContacts.length})</span>
            </button>

            {/* Tab 2: Deals */}
            <button
              onClick={() => setActiveTab('deals')}
              className={`flex items-center gap-1.5 py-2.5 px-3.5 text-xs font-semibold border-b-2 transition-all ${
                activeTab === 'deals'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Deals ({companyDeals.length})</span>
            </button>

            {/* Tab 3: Activities */}
            <button
              onClick={() => setActiveTab('activities')}
              className={`flex items-center gap-1.5 py-2.5 px-3.5 text-xs font-semibold border-b-2 transition-all ${
                activeTab === 'activities'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Activities ({companyActivities.length})</span>
            </button>

            {/* Tab 4: Notes */}
            <button
              onClick={() => setActiveTab('notes')}
              className={`flex items-center gap-1.5 py-2.5 px-3.5 text-xs font-semibold border-b-2 transition-all ${
                activeTab === 'notes'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Notes ({notesList.length})</span>
            </button>

            {/* Tab 5: Documents */}
            <button
              onClick={() => setActiveTab('documents')}
              className={`flex items-center gap-1.5 py-2.5 px-3.5 text-xs font-semibold border-b-2 transition-all ${
                activeTab === 'documents'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Documents ({documentsList.length})</span>
            </button>
          </div>
        </div>

        {/* 3. TAB 1: CONTACTS */}
        {activeTab === 'contacts' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Key Decision Makers & Stakeholders ({companyContacts.length})
              </span>
              {onOpenNewContactForCompany && (
                <Button
                  size="sm"
                  variant="primary"
                  icon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => onOpenNewContactForCompany(company)}
                >
                  Add Contact
                </Button>
              )}
            </div>

            {companyContacts.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <Users className="w-8 h-8 text-slate-300 mx-auto" />
                <p>No contacts currently associated with {company.name}.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {companyContacts.map(c => (
                  <div
                    key={c.id}
                    onClick={() => onSelectContact(c)}
                    className="p-3.5 bg-white rounded-xl border border-slate-200/80 hover:border-blue-300 hover:shadow-2xs cursor-pointer transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-xl font-bold text-xs shrink-0 border ${getAvatarColor(
                          c.name
                        )}`}
                      >
                        {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                            {c.name}
                          </p>
                          <Badge variant="blue" size="sm">
                            {c.lifecycleStage.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                          {c.title || 'Contact'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs shrink-0" onClick={e => e.stopPropagation()}>
                      <a
                        href={`mailto:${c.email}`}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title={c.email}
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                      {c.phone && (
                        <a
                          href={`tel:${c.phone}`}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title={c.phone}
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4. TAB 2: DEALS */}
        {activeTab === 'deals' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Pipeline Opportunities ({companyDeals.length})
              </span>
              <Button
                size="sm"
                variant="primary"
                icon={<Plus className="w-3.5 h-3.5" />}
                onClick={() => onOpenNewDealForCompany(company)}
              >
                Create Deal
              </Button>
            </div>

            {companyDeals.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <Briefcase className="w-8 h-8 text-slate-300 mx-auto" />
                <p>No active deals recorded for {company.name}.</p>
                <Button
                  size="sm"
                  variant="outline"
                  icon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => onOpenNewDealForCompany(company)}
                >
                  Create First Deal
                </Button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {companyDeals.map(d => (
                  <div
                    key={d.id}
                    onClick={() => onSelectDeal(d)}
                    className="p-3.5 bg-white rounded-xl border border-slate-200/80 hover:border-blue-400 hover:shadow-xs cursor-pointer transition-all flex items-center justify-between gap-3 group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {d.title}
                        </p>
                        <Badge
                          variant={
                            d.stage === 'won'
                              ? 'emerald'
                              : d.stage === 'lost'
                              ? 'slate'
                              : 'blue'
                          }
                          size="sm"
                        >
                          {d.stage.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500">
                        <span>Expected Close: {formatDate(d.expectedCloseDate)}</span>
                        <span>•</span>
                        <span>Win Prob: {d.probability}%</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-sm font-extrabold text-slate-900 block">
                        {formatCurrency(d.value)}
                      </span>
                      <span className="text-[10px] text-blue-600 font-semibold group-hover:underline">
                        View Deal →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 5. TAB 3: ACTIVITIES */}
        {activeTab === 'activities' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Account Activity Stream
              </span>
              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  icon={<Phone className="w-3.5 h-3.5" />}
                  onClick={() => setActiveModal('call')}
                >
                  Log Call
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  icon={<Mail className="w-3.5 h-3.5" />}
                  onClick={() => setActiveModal('email')}
                >
                  Log Email
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  icon={<Video className="w-3.5 h-3.5" />}
                  onClick={() => setActiveModal('meeting')}
                >
                  Schedule Meeting
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  icon={<CheckSquare className="w-3.5 h-3.5" />}
                  onClick={() => setActiveModal('task')}
                >
                  Add Task
                </Button>
              </div>
            </div>

            {companyActivities.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <Phone className="w-8 h-8 text-slate-300 mx-auto" />
                <p>No logged activities or tasks recorded for {company.name} yet.</p>
                <Button
                  size="sm"
                  variant="primary"
                  icon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => setActiveModal('call')}
                >
                  Log First Activity
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {companyActivities.map(act => (
                  <div
                    key={act.id}
                    className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs hover:border-blue-300 transition-all flex items-start gap-3"
                  >
                    <div className="p-2 rounded-lg bg-slate-50 text-blue-600 shrink-0">
                      {act.type === 'call' && <Phone className="w-4 h-4 text-blue-600" />}
                      {act.type === 'email' && <Mail className="w-4 h-4 text-emerald-600" />}
                      {act.type === 'meeting' && <Video className="w-4 h-4 text-purple-600" />}
                      {act.type === 'task' && <CheckSquare className="w-4 h-4 text-amber-600" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h5 className="text-xs font-bold text-slate-900 truncate">
                          {act.title}
                        </h5>
                        <span className="text-[11px] text-slate-400">
                          {act.dueDate ? formatDate(act.dueDate) : formatTimeAgo(act.createdAt)}
                        </span>
                      </div>
                      {act.description && (
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {act.description}
                        </p>
                      )}
                      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-100">
                        <span>Assigned to {act.assignedTo?.name || 'Viraj Somani'}</span>
                        {act.completed && (
                          <span className="text-emerald-600 font-bold">✓ Completed</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 6. TAB 4: NOTES */}
        {activeTab === 'notes' && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-slate-500" />
              <span>Internal Account Notes ({notesList.length})</span>
            </h4>

            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="space-y-2">
              <textarea
                value={newNoteContent}
                onChange={e => setNewNoteContent(e.target.value)}
                placeholder="Log account strategic goals, enterprise procurement policies, or relationship notes..."
                rows={3}
                className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  size="sm"
                  variant="primary"
                  icon={<Send className="w-3.5 h-3.5" />}
                  disabled={!newNoteContent.trim()}
                >
                  Save Account Note
                </Button>
              </div>
            </form>

            {/* Notes List */}
            <div className="space-y-3 pt-2">
              {notesList.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4 bg-slate-50 rounded-xl">
                  No account notes logged for {company.name} yet.
                </p>
              ) : (
                notesList.map(note => (
                  <div
                    key={note.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs"
                  >
                    <div className="flex items-center justify-between text-slate-500 mb-1">
                      <span className="font-semibold text-slate-800">{note.author.name}</span>
                      <span className="text-[11px]">{formatTimeAgo(note.createdAt)}</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {note.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 7. TAB 5: DOCUMENTS */}
        {activeTab === 'documents' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Company Documents & Assets ({documentsList.length})
              </span>
              <Button
                size="sm"
                variant="primary"
                icon={<Upload className="w-3.5 h-3.5" />}
                onClick={() => setActiveModal('document')}
              >
                Upload Document
              </Button>
            </div>

            {/* Document List */}
            {documentsList.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                <p>No agreements, whitepapers, or compliance documents attached yet.</p>
                <Button
                  size="sm"
                  variant="outline"
                  icon={<Upload className="w-3.5 h-3.5" />}
                  onClick={() => setActiveModal('document')}
                >
                  Upload First Document
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {documentsList.map(doc => (
                  <div
                    key={doc.id}
                    className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs hover:border-blue-300 transition-all flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className="p-2 bg-slate-50 rounded-lg shrink-0">
                        {getFileIcon(doc.type)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate" title={doc.name}>
                          {doc.name}
                        </p>
                        <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
                          <span>{doc.size}</span>
                          <span>•</span>
                          <span>{formatDate(doc.uploadedAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          showToast('Downloading Document', `Downloading ${doc.name}...`, 'info');
                        }}
                        className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Download Document"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteCompanyDocument(company.id, doc.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL 1: LOG CALL */}
      {activeModal === 'call' && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-5 max-w-md w-full border border-slate-200 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Log Phone Call for {company.name}</h3>
            <form onSubmit={handleLogCallSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Call Outcome</label>
                <select
                  value={callOutcome}
                  onChange={e => setCallOutcome(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Executive Alignment Completed">Executive Alignment Completed</option>
                  <option value="Commercial Terms Discussed">Commercial Terms Discussed</option>
                  <option value="Procurement Review in Progress">Procurement Review in Progress</option>
                  <option value="Quarterly Business Review">Quarterly Business Review</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Call Notes</label>
                <textarea
                  rows={3}
                  value={callNotes}
                  onChange={e => setCallNotes(e.target.value)}
                  placeholder="Key discussion points, budget updates, timeline..."
                  className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button size="sm" variant="outline" onClick={() => setActiveModal(null)}>
                  Cancel
                </Button>
                <Button size="sm" variant="primary" type="submit">
                  Log Call
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: LOG EMAIL */}
      {activeModal === 'email' && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-5 max-w-md w-full border border-slate-200 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Record Email for {company.name}</h3>
            <form onSubmit={handleLogEmailSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Partnership Agreement & Commercial Pricing"
                  value={emailSubject}
                  onChange={e => setEmailSubject(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Body / Notes</label>
                <textarea
                  rows={3}
                  value={emailBody}
                  onChange={e => setEmailBody(e.target.value)}
                  placeholder="Email contents and summary..."
                  className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button size="sm" variant="outline" onClick={() => setActiveModal(null)}>
                  Cancel
                </Button>
                <Button size="sm" variant="primary" type="submit">
                  Record Email
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: SCHEDULE MEETING */}
      {activeModal === 'meeting' && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-5 max-w-md w-full border border-slate-200 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Schedule Strategic Meeting with {company.name}</h3>
            <form onSubmit={handleScheduleMeetingSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Meeting Title *</label>
                <input
                  type="text"
                  required
                  value={meetingTitle}
                  onChange={e => setMeetingTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={meetingDate}
                    onChange={e => setMeetingDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Duration (Min)</label>
                  <select
                    value={meetingDuration}
                    onChange={e => setMeetingDuration(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="30">30 Minutes</option>
                    <option value="45">45 Minutes</option>
                    <option value="60">60 Minutes</option>
                    <option value="90">90 Minutes</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button size="sm" variant="outline" onClick={() => setActiveModal(null)}>
                  Cancel
                </Button>
                <Button size="sm" variant="primary" type="submit">
                  Book Meeting
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: ADD TASK */}
      {activeModal === 'task' && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-5 max-w-md w-full border border-slate-200 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Add Account Task for {company.name}</h3>
            <form onSubmit={handleAddTaskSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Send enterprise NDA to procurement"
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={e => setTaskDueDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={e => setTaskPriority(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button size="sm" variant="outline" onClick={() => setActiveModal(null)}>
                  Cancel
                </Button>
                <Button size="sm" variant="primary" type="submit">
                  Save Task
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: UPLOAD DOCUMENT */}
      {activeModal === 'document' && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-5 max-w-md w-full border border-slate-200 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Upload Document for {company.name}</h3>
            <form onSubmit={handleUploadDocumentSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master_Services_Agreement_2026"
                  value={docName}
                  onChange={e => setDocName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Document Type</label>
                  <select
                    value={docType}
                    onChange={e => setDocType(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="pdf">PDF File</option>
                    <option value="doc">Word / Text Doc</option>
                    <option value="sheet">Excel / Spreadsheet</option>
                    <option value="image">Image / Graphic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Simulated Size</label>
                  <input
                    type="text"
                    value={docSize}
                    onChange={e => setDocSize(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center text-xs text-slate-500">
                <Upload className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                <span>Document will be archived in the company repository and linked to this account.</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button size="sm" variant="outline" onClick={() => setActiveModal(null)}>
                  Cancel
                </Button>
                <Button size="sm" variant="primary" type="submit">
                  Upload Document
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Drawer>
  );
};
