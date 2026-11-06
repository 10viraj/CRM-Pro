import React, { useState } from 'react';
import { Drawer } from '../common/Drawer';
import { Deal, DealFile, DealStage, DealTimelineItem, Activity, User } from '../../types';
import { useCRM } from '../../context/CRMContext';
import { formatCurrency, formatDate, formatTimeAgo, getAvatarColor } from '../../utils/formatters';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  DollarSign,
  Building2,
  User as UserIcon,
  Calendar,
  Send,
  MessageSquare,
  Trash2,
  Edit,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Award,
  Clock,
  FileText,
  FileSpreadsheet,
  FileCode,
  FileImage,
  File,
  Download,
  Upload,
  Plus,
  Phone,
  Mail,
  Video,
  CheckSquare,
  AlertCircle,
  Tag,
  Share2,
  ArrowRight,
  ChevronDown
} from 'lucide-react';

interface DealDetailDrawerProps {
  deal: Deal | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (deal: Deal) => void;
}

type TabType = 'timeline' | 'activities' | 'notes' | 'files' | 'details';

export const DealDetailDrawer: React.FC<DealDetailDrawerProps> = ({
  deal,
  isOpen,
  onClose,
  onEdit
}) => {
  const {
    pipelineStages,
    updateDealStage,
    updateDeal,
    deleteDeal,
    addNote,
    activities,
    addActivity,
    toggleActivityCompleted,
    addDealFile,
    deleteDealFile,
    availableUsers,
    currentUser,
    showToast,
    confirmAction
  } = useCRM();

  const [activeTab, setActiveTab] = useState<TabType>('timeline');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [lossReasonInput, setLossReasonInput] = useState('');
  const [showLossReasonModal, setShowLossReasonModal] = useState(false);

  // Quick Action Modals for Activities & Files
  const [actionModalType, setActionModalType] = useState<'task' | 'call' | 'meeting' | 'email' | 'upload_file' | null>(null);

  // Task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDueDate, setTaskDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [taskPriority, setTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');

  // Call form state
  const [callOutcome, setCallOutcome] = useState('Interested / Follow-up Needed');
  const [callNotes, setCallNotes] = useState('');

  // Meeting form state
  const [meetingTitle, setMeetingTitle] = useState('Contract & Scope Alignment');
  const [meetingDate, setMeetingDate] = useState(new Date().toISOString().split('T')[0]);
  const [meetingDuration, setMeetingDuration] = useState('30');

  // Email form state
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  // File upload state
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadFileType, setUploadFileType] = useState<'pdf' | 'doc' | 'sheet' | 'image'>('pdf');
  const [uploadFileSize, setUploadFileSize] = useState('1.5 MB');

  if (!deal) return null;

  // Primary 5 progression stages: New Lead -> Qualified -> Proposal -> Negotiation -> Won
  const coreProgressionStages = pipelineStages.filter(s => s.key !== 'lost' && s.key !== 'contacted');
  const currentStageIndex = pipelineStages.findIndex(s => s.key === deal.stage);

  // Activities related to this deal
  const dealActivities = activities.filter(
    a => a.relatedTo?.type === 'deal' && a.relatedTo?.id === deal.id
  );

  const weightedValue = Math.round(deal.value * (deal.probability / 100));

  // Remaining days to close
  const daysRemaining = Math.ceil(
    (new Date(deal.expectedCloseDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const handleStageClick = (stageKey: DealStage) => {
    if (stageKey === 'lost') {
      setShowLossReasonModal(true);
    } else {
      updateDealStage(deal.id, stageKey);
    }
  };

  const handleConfirmLost = () => {
    updateDealStage(deal.id, 'lost', undefined, lossReasonInput || 'Budget / Competitor selection');
    setShowLossReasonModal(false);
    setLossReasonInput('');
  };

  const handleMarkWon = () => {
    updateDealStage(deal.id, 'won', 'Contract signed and fully executed.');
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;
    addNote('deal', deal.id, newNoteContent);
    setNewNoteContent('');
  };

  const handleReassignOwner = (newOwnerId: string) => {
    const newOwner = availableUsers.find(u => u.id === newOwnerId);
    if (newOwner) {
      updateDeal(deal.id, { owner: newOwner });
      showToast('Salesperson Reassigned', `Deal reassigned to ${newOwner.name}.`, 'info');
    }
  };

  // Activity submit handlers
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    addActivity({
      type: 'task',
      title: taskTitle.trim(),
      dueDate: taskDueDate,
      completed: false,
      priority: taskPriority,
      relatedTo: {
        type: 'deal',
        id: deal.id,
        name: deal.title
      },
      assignedTo: deal.owner
    });
    setTaskTitle('');
    setActionModalType(null);
  };

  const handleLogCall = (e: React.FormEvent) => {
    e.preventDefault();
    addActivity({
      type: 'call',
      title: `Phone Call: ${callOutcome}`,
      dueDate: new Date().toISOString().split('T')[0],
      durationMinutes: 15,
      completed: true,
      priority: 'medium',
      description: callNotes || `Spoke with ${deal.contactName || deal.companyName}. Outcome: ${callOutcome}`,
      relatedTo: {
        type: 'deal',
        id: deal.id,
        name: deal.title
      },
      assignedTo: currentUser
    });
    setCallNotes('');
    setActionModalType(null);
  };

  const handleScheduleMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingTitle.trim()) return;
    addActivity({
      type: 'meeting',
      title: meetingTitle.trim(),
      dueDate: meetingDate,
      durationMinutes: Number(meetingDuration),
      completed: false,
      priority: 'high',
      description: `Commercial meeting with ${deal.contactName || deal.companyName} regarding ${deal.title}`,
      relatedTo: {
        type: 'deal',
        id: deal.id,
        name: deal.title
      },
      assignedTo: deal.owner
    });
    setActionModalType(null);
  };

  const handleUploadFileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileName.trim()) return;
    const finalName = uploadFileName.includes('.')
      ? uploadFileName
      : `${uploadFileName}.${uploadFileType === 'sheet' ? 'xlsx' : uploadFileType === 'doc' ? 'docx' : uploadFileType}`;

    addDealFile(deal.id, {
      name: finalName,
      size: uploadFileSize || '1.8 MB',
      type: uploadFileType,
      uploadedBy: currentUser
    });
    setUploadFileName('');
    setActionModalType(null);
  };

  const handleDelete = () => {
    confirmAction({
      title: 'Delete Deal Opportunity',
      message: `Are you sure you want to permanently delete "${deal.title}"? This cannot be undone.`,
      confirmText: 'Delete Deal',
      variant: 'danger',
      onConfirm: () => {
        deleteDeal(deal.id);
        onClose();
      }
    });
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

  const timelineItems: DealTimelineItem[] = deal.timeline || [];

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={deal.title}
      subtitle={`${deal.companyName} • ${formatCurrency(deal.value)}`}
      width="xl"
    >
      <div className="space-y-5">
        {/* 1. Header Action Buttons & Status Indicators */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Pipeline Status:</span>
            {deal.stage === 'won' ? (
              <Badge variant="emerald" size="md">
                Won Opportunity 🏆
              </Badge>
            ) : deal.stage === 'lost' ? (
              <Badge variant="slate" size="md">
                Closed Lost
              </Badge>
            ) : (
              <Badge variant="blue" size="md">
                Active in Pipeline
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {deal.stage !== 'won' && (
              <Button
                size="sm"
                variant="primary"
                icon={<Award className="w-3.5 h-3.5" />}
                onClick={handleMarkWon}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Mark Won
              </Button>
            )}

            {deal.stage !== 'lost' && (
              <Button
                size="sm"
                variant="outline"
                icon={<XCircle className="w-3.5 h-3.5" />}
                onClick={() => setShowLossReasonModal(true)}
              >
                Mark Lost
              </Button>
            )}

            <Button
              size="sm"
              variant="outline"
              icon={<Edit className="w-3.5 h-3.5" />}
              onClick={() => onEdit(deal)}
            >
              Edit
            </Button>

            <button
              onClick={handleDelete}
              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
              title="Delete Deal"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. Interactive Pipeline Stage Progression Stepper (HubSpot / Salesforce style) */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Sales Stage Progression
            </span>
            <span className="text-xs font-bold text-blue-600">
              {pipelineStages.find(s => s.key === deal.stage)?.label || deal.stage} ({deal.probability}%)
            </span>
          </div>

          {/* Stepper Chevron Bar: New Lead -> Qualified -> Proposal -> Negotiation -> Won */}
          <div className="grid grid-cols-5 gap-1.5 pt-1">
            {coreProgressionStages.map((stage, idx) => {
              const isCurrent = stage.key === deal.stage;
              const isPassed = currentStageIndex > idx && deal.stage !== 'lost';
              const isWon = deal.stage === 'won' && stage.key === 'won';

              let barColor = 'bg-slate-100 text-slate-600 hover:bg-slate-200';
              if (isWon) {
                barColor = 'bg-emerald-600 text-white shadow-xs font-bold';
              } else if (isCurrent) {
                barColor = 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-500/30 font-bold';
              } else if (isPassed) {
                barColor = 'bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold border border-blue-200';
              }

              return (
                <button
                  key={stage.key}
                  onClick={() => handleStageClick(stage.key)}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-center transition-all ${barColor}`}
                  title={`Move to ${stage.label}`}
                >
                  <span className="text-[11px] font-bold truncate max-w-full">
                    {stage.label}
                  </span>
                  <span className="text-[10px] opacity-80 mt-0.5">{stage.probability}%</span>
                </button>
              );
            })}
          </div>

          {/* Won / Lost Special Banner */}
          {deal.stage === 'won' && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 animate-fade-in">
              <Award className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold">Deal Closed Won & Contract Finalized</p>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  {deal.wonReason || 'Strategic enterprise fit and team commitment.'}
                </p>
              </div>
            </div>
          )}

          {deal.stage === 'lost' && (
            <div className="flex items-center gap-2 p-3 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-800 animate-fade-in">
              <XCircle className="w-5 h-5 text-slate-500 shrink-0" />
              <div>
                <p className="font-bold">Deal Marked as Closed Lost</p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Reason: {deal.lostReason || 'Budget / Competitor selection'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 3. Hero Key Commercial Terms Grid (Deal value, Probability, Closing Date, Salesperson) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Deal Value */}
          <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Deal Value
            </span>
            <p className="text-xl font-extrabold text-slate-900 mt-0.5 tracking-tight">
              {formatCurrency(deal.value)}
            </p>
            <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">
              Gross contract total
            </span>
          </div>

          {/* Probability & Weighted ARR */}
          <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Win Probability
            </span>
            <p className="text-xl font-extrabold text-blue-600 mt-0.5 tracking-tight">
              {deal.probability}%
            </p>
            <span className="text-[10px] text-emerald-600 font-bold mt-0.5 block">
              Weighted: {formatCurrency(weightedValue)}
            </span>
          </div>

          {/* Expected Closing Date */}
          <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Expected Close
            </span>
            <p className="text-sm font-bold text-slate-900 mt-1">
              {formatDate(deal.expectedCloseDate)}
            </p>
            <span
              className={`text-[10px] font-semibold mt-0.5 block ${
                daysRemaining < 0 && deal.stage !== 'won' && deal.stage !== 'lost'
                  ? 'text-rose-600'
                  : 'text-slate-500'
              }`}
            >
              {daysRemaining < 0
                ? `${Math.abs(daysRemaining)} days overdue`
                : `${daysRemaining} days remaining`}
            </span>
          </div>

          {/* Assigned Salesperson */}
          <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Assigned Salesperson
            </span>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
                {deal.owner.initials}
              </span>
              <select
                value={deal.owner.id}
                onChange={e => handleReassignOwner(e.target.value)}
                className="text-xs font-bold text-slate-900 bg-transparent border-none p-0 focus:ring-0 cursor-pointer"
              >
                {availableUsers.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
            <span className="text-[10px] text-slate-400 truncate block mt-0.5">
              {deal.owner.role}
            </span>
          </div>
        </div>

        {/* 4. Tab Navigation: Timeline | Activities | Notes | Files | Details */}
        <div className="border-b border-slate-200">
          <div className="flex gap-2 -mb-px overflow-x-auto">
            <button
              onClick={() => setActiveTab('timeline')}
              className={`flex items-center gap-1.5 py-2.5 px-3.5 text-xs font-semibold border-b-2 transition-all ${
                activeTab === 'timeline'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Timeline ({timelineItems.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('activities')}
              className={`flex items-center gap-1.5 py-2.5 px-3.5 text-xs font-semibold border-b-2 transition-all ${
                activeTab === 'activities'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Activities ({dealActivities.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('notes')}
              className={`flex items-center gap-1.5 py-2.5 px-3.5 text-xs font-semibold border-b-2 transition-all ${
                activeTab === 'notes'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Notes ({deal.notes?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('files')}
              className={`flex items-center gap-1.5 py-2.5 px-3.5 text-xs font-semibold border-b-2 transition-all ${
                activeTab === 'files'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Files ({deal.files?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('details')}
              className={`flex items-center gap-1.5 py-2.5 px-3.5 text-xs font-semibold border-b-2 transition-all ${
                activeTab === 'details'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Record Details</span>
            </button>
          </div>
        </div>

        {/* 5. Tab Contents */}

        {/* TAB 1: TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Audit Trail & Event History
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Chronological record
              </span>
            </div>

            {timelineItems.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-200/80">
                <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p>No timeline events recorded yet.</p>
              </div>
            ) : (
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {timelineItems.map((event, idx) => {
                  let dotColor = 'bg-blue-600 ring-blue-100';
                  if (event.type === 'deal_won') dotColor = 'bg-emerald-600 ring-emerald-100';
                  if (event.type === 'deal_lost') dotColor = 'bg-slate-500 ring-slate-100';
                  if (event.type === 'file_uploaded') dotColor = 'bg-purple-600 ring-purple-100';
                  if (event.type === 'note_added') dotColor = 'bg-amber-600 ring-amber-100';

                  return (
                    <div key={event.id || idx} className="relative group">
                      <div
                        className={`absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white ring-4 ${dotColor}`}
                      />
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-xs font-bold text-slate-900">
                            {event.title}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {formatTimeAgo(event.timestamp)}
                          </span>
                        </div>
                        {event.description && (
                          <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                            {event.description}
                          </p>
                        )}
                        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-100">
                          <div className="flex items-center gap-1.5">
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-100 text-slate-700 font-bold">
                              {event.actor?.initials || 'U'}
                            </span>
                            <span>{event.actor?.name || 'Viraj Somani'}</span>
                          </div>
                          <span>{formatDate(event.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ACTIVITIES */}
        {activeTab === 'activities' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Commercial Activities
              </span>
              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  icon={<CheckSquare className="w-3.5 h-3.5" />}
                  onClick={() => setActionModalType('task')}
                >
                  Add Task
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  icon={<Phone className="w-3.5 h-3.5" />}
                  onClick={() => setActionModalType('call')}
                >
                  Log Call
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  icon={<Video className="w-3.5 h-3.5" />}
                  onClick={() => setActionModalType('meeting')}
                >
                  Schedule Meeting
                </Button>
              </div>
            </div>

            {dealActivities.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <CheckSquare className="w-8 h-8 text-slate-300 mx-auto" />
                <p>No active tasks or calls scheduled for this deal.</p>
                <Button
                  size="sm"
                  variant="primary"
                  icon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => setActionModalType('task')}
                >
                  Create First Task
                </Button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {dealActivities.map(act => (
                  <div
                    key={act.id}
                    className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex items-start gap-3 hover:border-slate-300 transition-all"
                  >
                    <input
                      type="checkbox"
                      checked={act.completed}
                      onChange={() => toggleActivityCompleted(act.id)}
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-xs font-bold ${
                            act.completed ? 'line-through text-slate-400' : 'text-slate-900'
                          }`}
                        >
                          {act.title}
                        </span>
                        <Badge
                          variant={
                            act.priority === 'high'
                              ? 'rose'
                              : act.priority === 'medium'
                              ? 'amber'
                              : 'slate'
                          }
                          size="sm"
                        >
                          {act.priority}
                        </Badge>
                      </div>
                      {act.description && (
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                          {act.description}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-400">
                        {act.dueDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> Due {formatDate(act.dueDate)}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <UserIcon className="w-3 h-3" /> {act.assignedTo?.name || 'Viraj Somani'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: NOTES */}
        {activeTab === 'notes' && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-slate-500" />
              <span>Deal Notes & Discussion ({deal.notes?.length || 0})</span>
            </h4>

            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="space-y-2">
              <textarea
                value={newNoteContent}
                onChange={e => setNewNoteContent(e.target.value)}
                placeholder="Log meeting outcome, executive alignment, or pricing discussion..."
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
                  Save Note
                </Button>
              </div>
            </form>

            {/* Notes List */}
            <div className="space-y-3 pt-2">
              {(!deal.notes || deal.notes.length === 0) ? (
                <p className="text-xs text-slate-400 text-center py-4 bg-slate-50 rounded-xl">
                  No notes logged on this deal yet.
                </p>
              ) : (
                deal.notes.map(note => (
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

        {/* TAB 4: FILES */}
        {activeTab === 'files' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Deal Files & Attachments ({deal.files?.length || 0})
              </span>
              <Button
                size="sm"
                variant="primary"
                icon={<Upload className="w-3.5 h-3.5" />}
                onClick={() => setActionModalType('upload_file')}
              >
                Upload File
              </Button>
            </div>

            {/* Files List */}
            {(!deal.files || deal.files.length === 0) ? (
              <div className="py-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                <p>No documents, proposals, or contracts attached yet.</p>
                <Button
                  size="sm"
                  variant="outline"
                  icon={<Upload className="w-3.5 h-3.5" />}
                  onClick={() => setActionModalType('upload_file')}
                >
                  Upload Proposal or SOW
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {deal.files.map(file => (
                  <div
                    key={file.id}
                    className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs hover:border-blue-300 transition-all flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className="p-2 bg-slate-50 rounded-lg shrink-0">
                        {getFileIcon(file.type)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate" title={file.name}>
                          {file.name}
                        </p>
                        <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
                          <span>{file.size}</span>
                          <span>•</span>
                          <span>{formatDate(file.uploadedAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          showToast('Downloading File', `Downloading ${file.name}...`, 'info');
                        }}
                        className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Download Attachment"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteDealFile(deal.id, file.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete File"
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

        {/* TAB 5: DETAILS & ASSOCIATIONS */}
        {activeTab === 'details' && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Associated Company & Contact
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2.5 p-3.5 rounded-xl border border-slate-200/80 bg-white shadow-2xs">
                <Building2 className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <p className="text-slate-400 text-[11px]">Associated Account</p>
                  <p className="font-bold text-slate-900 mt-0.5">{deal.companyName}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3.5 rounded-xl border border-slate-200/80 bg-white shadow-2xs">
                <UserIcon className="w-5 h-5 text-purple-600 shrink-0" />
                <div>
                  <p className="text-slate-400 text-[11px]">Primary Contact Person</p>
                  <p className="font-bold text-slate-900 mt-0.5">
                    {deal.contactName || 'Unassigned Contact'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3.5 rounded-xl border border-slate-200/80 bg-white shadow-2xs">
                <Calendar className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <p className="text-slate-400 text-[11px]">Close Target</p>
                  <p className="font-bold text-slate-900 mt-0.5">
                    {formatDate(deal.expectedCloseDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3.5 rounded-xl border border-slate-200/80 bg-white shadow-2xs">
                <UserIcon className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-slate-400 text-[11px]">Assigned Salesperson</p>
                  <p className="font-bold text-slate-900 mt-0.5">{deal.owner.name}</p>
                </div>
              </div>
            </div>

            {/* Tags */}
            {deal.tags && deal.tags.length > 0 && (
              <div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Deal Tags
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {deal.tags.map(tag => (
                    <Badge key={tag} variant="blue" size="sm">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL 1: ADD TASK */}
      {actionModalType === 'task' && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-5 max-w-md w-full border border-slate-200 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Add Task for {deal.title}</h3>
            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Send revised pricing quote"
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
                <Button size="sm" variant="outline" onClick={() => setActionModalType(null)}>
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

      {/* MODAL 2: LOG CALL */}
      {actionModalType === 'call' && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-5 max-w-md w-full border border-slate-200 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Log Phone Call with {deal.contactName || deal.companyName}</h3>
            <form onSubmit={handleLogCall} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Call Outcome</label>
                <select
                  value={callOutcome}
                  onChange={e => setCallOutcome(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Interested / Follow-up Needed">Interested / Follow-up Needed</option>
                  <option value="Proposal Accepted">Proposal Accepted</option>
                  <option value="Negotiation Ongoing">Negotiation Ongoing</option>
                  <option value="Left Voicemail">Left Voicemail</option>
                  <option value="Busy / Callback Requested">Busy / Callback Requested</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Call Notes</label>
                <textarea
                  rows={3}
                  value={callNotes}
                  onChange={e => setCallNotes(e.target.value)}
                  placeholder="Key discussion points, budget confirmation, next steps..."
                  className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button size="sm" variant="outline" onClick={() => setActionModalType(null)}>
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

      {/* MODAL 3: SCHEDULE MEETING */}
      {actionModalType === 'meeting' && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-5 max-w-md w-full border border-slate-200 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Schedule Commercial Meeting</h3>
            <form onSubmit={handleScheduleMeeting} className="space-y-3">
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
                    <option value="15">15 Minutes</option>
                    <option value="30">30 Minutes</option>
                    <option value="45">45 Minutes</option>
                    <option value="60">60 Minutes</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button size="sm" variant="outline" onClick={() => setActionModalType(null)}>
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

      {/* MODAL 4: UPLOAD FILE */}
      {actionModalType === 'upload_file' && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-5 max-w-md w-full border border-slate-200 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Attach Document to Deal</h3>
            <form onSubmit={handleUploadFileSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  File / Document Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme_Master_Services_Agreement_v1"
                  value={uploadFileName}
                  onChange={e => setUploadFileName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">File Type</label>
                  <select
                    value={uploadFileType}
                    onChange={e => setUploadFileType(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="sheet">Excel / Spreadsheet</option>
                    <option value="doc">Word / Text Doc</option>
                    <option value="image">Image / Screenshot</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Size</label>
                  <input
                    type="text"
                    value={uploadFileSize}
                    onChange={e => setUploadFileSize(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center text-xs text-slate-500">
                <Upload className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                <span>Simulated attachment will be linked to this deal and audit timeline.</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button size="sm" variant="outline" onClick={() => setActionModalType(null)}>
                  Cancel
                </Button>
                <Button size="sm" variant="primary" type="submit">
                  Attach File
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: LOSS REASON MODAL */}
      {showLossReasonModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-xl space-y-4 animate-scale-up">
            <h3 className="text-sm font-bold text-slate-900">Mark Deal as Closed Lost</h3>
            <p className="text-xs text-slate-500">
              Please specify the loss reason to assist our win/loss analysis and revenue intelligence.
            </p>
            <input
              type="text"
              value={lossReasonInput}
              onChange={e => setLossReasonInput(e.target.value)}
              placeholder="e.g. Budget cuts, Competitor pricing, Timing"
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button size="sm" variant="outline" onClick={() => setShowLossReasonModal(false)}>
                Cancel
              </Button>
              <Button size="sm" variant="danger" onClick={handleConfirmLost}>
                Confirm Closed Lost
              </Button>
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
};
