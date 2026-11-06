export type ViewType = 
  | 'dashboard' 
  | 'leads' 
  | 'deals' 
  | 'contacts' 
  | 'companies' 
  | 'tasks'
  | 'calendar'
  | 'activities' 
  | 'reports' 
  | 'settings'
  | 'team'
  | 'notifications'
  | 'integrations'
  | 'components'
  | 'landing';

export type AuthScreenType = 'login' | 'register' | 'forgot_password' | 'reset_password' | 'email_verification';

export type UserRole = 'Developer / Admin' | 'Admin' | 'Sales Manager' | 'Account Executive' | 'SDR';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  initials: string;
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'converted' | 'lost';

export type LeadSource = 
  | 'Website' 
  | 'LinkedIn' 
  | 'Referral' 
  | 'Cold Outbound' 
  | 'Event' 
  | 'Inbound Demo'
  | 'Product Signup'
  | 'Google Ads'
  | 'Email'
  | 'Other';

export interface Note {
  id: string;
  author: User;
  content: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  title: string;
  email: string;
  phone: string;
  status: LeadStatus;
  score: number; // 0 to 100
  source: LeadSource;
  estimatedValue: number;
  owner: User;
  tags: string[];
  notes: Note[];
  createdAt: string;
  lastContactedAt?: string;
}

export type DealStage = 
  | 'new_lead'
  | 'contacted'
  | 'qualified' 
  | 'proposal' 
  | 'negotiation' 
  | 'won' 
  | 'lost';

export interface PipelineStageConfig {
  key: DealStage;
  label: string;
  color: string;
  probability: number;
  badgeBg: string;
  badgeText: string;
}

export type DealStatus = 'open' | 'won' | 'lost';

export interface DealFile {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'doc' | 'sheet' | 'image' | 'zip' | 'other';
  uploadedAt: string;
  uploadedBy: User;
  url?: string;
}

export interface DealTimelineItem {
  id: string;
  type: 'created' | 'stage_changed' | 'note_added' | 'activity_logged' | 'file_uploaded' | 'deal_won' | 'deal_lost';
  title: string;
  description?: string;
  timestamp: string;
  actor: User;
  badge?: string;
}

export interface Deal {
  id: string;
  title: string;
  companyId: string;
  companyName: string;
  contactId?: string;
  contactName?: string;
  value: number;
  stage: DealStage;
  status?: DealStatus;
  probability: number;
  expectedCloseDate: string;
  owner: User;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  notes: Note[];
  files?: DealFile[];
  timeline?: DealTimelineItem[];
  lostReason?: string;
  wonReason?: string;
  createdAt: string;
  updatedAt: string;
}

export type LifecycleStage = 'subscriber' | 'lead' | 'marketing_qualified' | 'opportunity' | 'customer' | 'evangelist';

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  title: string;
  companyId: string;
  companyName: string;
  lifecycleStage: LifecycleStage;
  owner: User;
  tags: string[];
  notes: Note[];
  avatar?: string;
  createdAt: string;
  lastActivityDate?: string;
}

export interface CompanyDocument {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'doc' | 'sheet' | 'image' | 'other';
  uploadedAt: string;
  uploadedBy: User;
  url?: string;
}

export interface Company {
  id: string;
  name: string;
  domain: string;
  industry: string;
  size: string; // e.g. "50-200 employees"
  annualRevenue: number;
  location: string;
  phone: string;
  website: string;
  status: 'Active Customer' | 'Prospect' | 'Partner' | 'Churned';
  owner: User;
  description: string;
  logo?: string;
  notes?: Note[];
  documents?: CompanyDocument[];
  createdAt: string;
}

export type ActivityType = 'call' | 'email' | 'meeting' | 'note' | 'task' | 'deal_update';

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  assignee: User;
  priority: TaskPriority;
  dueDate: string;
  relatedTo: {
    type: 'lead' | 'deal' | 'contact' | 'company';
    id: string;
    name: string;
  };
  status: TaskStatus;
  createdAt: string;
  completedAt?: string;
}

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  dueDate?: string;
  completed: boolean;
  priority: TaskPriority;
  status?: TaskStatus;
  relatedTo: {
    type: 'lead' | 'deal' | 'contact' | 'company';
    id: string;
    name: string;
  };
  assignedTo: User;
  createdAt: string;
  completedAt?: string;
  durationMinutes?: number;
  outcome?: string;
  metadata?: {
    dealStage?: string;
    dealValue?: number;
    emailSubject?: string;
    callOutcome?: string;
    meetingLink?: string;
    contactName?: string;
    companyName?: string;
  };
}

export type NotificationType = 'lead' | 'meeting' | 'deal' | 'task' | 'email' | 'system';

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: NotificationType;
  linkTarget?: {
    view: ViewType;
    id?: string;
  };
  category?: string;
  timestamp?: string;
}

export interface NotificationCategorySetting {
  inApp: boolean;
  email: boolean;
  push: boolean;
}

export interface NotificationPreferences {
  channels: {
    inApp: boolean;
    email: boolean;
    desktopPush: boolean;
    slackAlerts: boolean;
  };
  categories: {
    newLead: NotificationCategorySetting;
    meetingReminders: NotificationCategorySetting;
    dealMovements: NotificationCategorySetting;
    taskCompleted: NotificationCategorySetting;
    customerEmail: NotificationCategorySetting;
    systemUpdates: NotificationCategorySetting;
  };
  emailDigest: 'instant' | 'daily' | 'weekly' | 'off';
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
}

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ConfirmDialogOptions {
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void | Promise<void>;
}

export type CalendarEventType =
  | 'Client Meeting'
  | 'Follow-up Call'
  | 'Product Demo'
  | 'Proposal Review'
  | 'Team Meeting';

export interface CalendarEvent {
  id: string;
  title: string;
  type: CalendarEventType;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm (24h or formatted)
  endTime: string; // HH:mm
  durationMinutes: number;
  participants: User[];
  contactId?: string;
  contactName?: string;
  dealId?: string;
  dealName?: string;
  meetingLink?: string;
  notes?: string;
  location?: string;
  createdAt: string;
}


