import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Activity,
  ActivityType,
  AppNotification,
  Company,
  CompanyDocument,
  Contact,
  Deal,
  DealFile,
  DealStage,
  DealStatus,
  DealTimelineItem,
  Lead,
  Note,
  PipelineStageConfig,
  ToastMessage,
  User,
  ViewType,
  TaskItem,
  TaskPriority,
  TaskStatus,
  CalendarEvent,
  CalendarEventType,
  NotificationPreferences,
  AuthScreenType,
  ConfirmDialogOptions
} from '../types';
import {
  CURRENT_USER,
  MOCK_ACTIVITIES,
  MOCK_COMPANIES,
  MOCK_CONTACTS,
  MOCK_DEALS,
  MOCK_LEADS,
  MOCK_NOTIFICATIONS,
  DEFAULT_NOTIFICATION_PREFERENCES,
  MOCK_TASKS,
  MOCK_EVENTS,
  PIPELINE_STAGES,
  USERS
} from '../data/mockData';

interface CRMContextType {
  // Navigation & View
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  currentUser: User;
  setCurrentUser: (user: User) => void;
  availableUsers: User[];
  
  // Data
  leads: Lead[];
  deals: Deal[];
  contacts: Contact[];
  companies: Company[];
  activities: Activity[];
  notifications: AppNotification[];
  pipelineStages: PipelineStageConfig[];
  
  // Lead Operations
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'notes'>) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  convertLead: (leadId: string, dealValue?: number) => void;
  
  // Deal Operations
  addDeal: (deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt' | 'notes'>) => void;
  updateDeal: (id: string, updates: Partial<Deal>) => void;
  updateDealStage: (id: string, stage: DealStage, winReason?: string, lostReason?: string) => void;
  deleteDeal: (id: string) => void;
  addDealFile: (dealId: string, file: Omit<DealFile, 'id' | 'uploadedAt'>) => void;
  deleteDealFile: (dealId: string, fileId: string) => void;
  addDealTimelineEvent: (dealId: string, event: Omit<DealTimelineItem, 'id' | 'timestamp'>) => void;
  
  // Contact Operations
  addContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'notes'>) => void;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  
  // Company Operations
  addCompany: (company: Omit<Company, 'id' | 'createdAt'>) => void;
  updateCompany: (id: string, updates: Partial<Company>) => void;
  deleteCompany: (id: string) => void;
  addCompanyDocument: (companyId: string, doc: Omit<CompanyDocument, 'id' | 'uploadedAt'>) => void;
  deleteCompanyDocument: (companyId: string, docId: string) => void;
  
  // Activity Operations
  addActivity: (activity: Omit<Activity, 'id' | 'createdAt'>) => void;
  toggleActivityCompleted: (id: string) => void;
  deleteActivity: (id: string) => void;

  // Task Operations
  tasks: TaskItem[];
  addTask: (task: Omit<TaskItem, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<TaskItem>) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompleted: (id: string) => void;

  // Calendar Events
  events: CalendarEvent[];
  addEvent: (event: Omit<CalendarEvent, 'id' | 'createdAt'>) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  
  // Notes
  addNote: (type: 'lead' | 'deal' | 'contact' | 'company', targetId: string, content: string) => void;
  
  // Notifications
  markNotificationAsRead: (id: string) => void;
  toggleNotificationRead: (id: string) => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (notification: Omit<AppNotification, 'id' | 'time' | 'read'> & { time?: string; read?: boolean }) => void;
  notificationPreferences: NotificationPreferences;
  updateNotificationPreferences: (prefs: Partial<NotificationPreferences>) => void;
  
  // Toasts
  toasts: ToastMessage[];
  showToast: (
    title: string,
    message?: string,
    type?: 'success' | 'error' | 'warning' | 'info',
    action?: { label: string; onClick: () => void }
  ) => void;
  removeToast: (id: string) => void;
  
  // UX Requirements: Loading States, Sync & Simulation
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isRefreshing: boolean;
  refreshData: () => Promise<void>;
  simulatedError: string | null;
  setSimulatedError: (error: string | null) => void;

  // UX Requirements: Confirmation Dialogs
  confirmDialog: (ConfirmDialogOptions & { isOpen: boolean; isLoading?: boolean }) | null;
  confirmAction: (options: ConfirmDialogOptions) => void;
  closeConfirm: () => void;

  // UX Requirements: Keyboard Shortcuts Modal
  isShortcutsOpen: boolean;
  setIsShortcutsOpen: (open: boolean) => void;

  // Search & Command Palette
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  
  // Authentication
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  authScreen: AuthScreenType;
  setAuthScreen: (screen: AuthScreenType) => void;
  login: (email?: string) => void;

  // Utilities
  resetToMockData: () => void;
  loadDemoData: () => void;
  resetToZero: () => void;
  logout: () => void;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'crm_pro_v3_';

export const CRMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER);
  const [pipelineStages] = useState<PipelineStageConfig[]>(PIPELINE_STAGES);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // UX Requirements: Loading States, Sync & Simulation
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [simulatedError, setSimulatedError] = useState<string | null>(null);

  // UX Requirements: Global Confirmation Dialog
  const [confirmDialog, setConfirmDialog] = useState<(ConfirmDialogOptions & { isOpen: boolean; isLoading?: boolean }) | null>(null);

  // UX Requirements: Keyboard Shortcuts Modal
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}is_authenticated`);
      if (saved !== null) return JSON.parse(saved);
      const oldSaved = localStorage.getItem('crm_pro_v2_is_authenticated');
      return oldSaved !== null ? JSON.parse(oldSaved) : true;
    } catch {
      return true;
    }
  });

  const [authScreen, setAuthScreen] = useState<AuthScreenType>('login');

  // Initialize from LocalStorage or Fallback to Empty Arrays (Zero Data by default)
  const [leads, setLeads] = useState<Lead[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}leads`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [deals, setDeals] = useState<Deal[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}deals`);
      if (saved) {
        const parsed: Deal[] = JSON.parse(saved);
        return parsed.map(d => ({
          ...d,
          status: d.status || (d.stage === 'won' ? 'won' : d.stage === 'lost' ? 'lost' : 'open'),
          files: d.files || [],
          timeline: d.timeline || []
        }));
      }
      return [];
    } catch {
      return [];
    }
  });

  const [contacts, setContacts] = useState<Contact[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}contacts`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [companies, setCompanies] = useState<Company[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}companies`);
      if (saved) {
        const parsed: Company[] = JSON.parse(saved);
        return parsed.map(c => ({
          ...c,
          notes: c.notes || [],
          documents: c.documents || []
        }));
      }
      return [];
    } catch {
      return [];
    }
  });

  const [activities, setActivities] = useState<Activity[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}activities`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}notifications`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}notification_preferences`);
      return saved ? JSON.parse(saved) : DEFAULT_NOTIFICATION_PREFERENCES;
    } catch {
      return DEFAULT_NOTIFICATION_PREFERENCES;
    }
  });

  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}tasks`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}calendar_events`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}leads`, JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}deals`, JSON.stringify(deals));
  }, [deals]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}contacts`, JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}companies`, JSON.stringify(companies));
  }, [companies]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}activities`, JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}tasks`, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}calendar_events`, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}notifications`, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}notification_preferences`, JSON.stringify(notificationPreferences));
  }, [notificationPreferences]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}is_authenticated`, JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  // Confirmation Dialog Actions
  const confirmAction = (options: ConfirmDialogOptions) => {
    setConfirmDialog({
      isOpen: true,
      ...options
    });
  };

  const closeConfirm = () => {
    setConfirmDialog(null);
  };

  // Toast System with Warning and Action support
  const showToast = (
    title: string,
    message?: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'success',
    action?: { label: string; onClick: () => void }
  ) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = { id, title, message, type, action };
    setToasts(prev => [newToast, ...prev.slice(0, 4)]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Cloud Sync & Refresh Simulation
  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      // Simulate network roundtrip and synchronization latency
      await new Promise(resolve => setTimeout(resolve, 600));
      showToast('Data Synchronized', 'All CRM records, deals, and activities are up to date.', 'success');
    } catch {
      showToast('Sync Failed', 'Could not sync records with cloud.', 'error');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Global Keyboard Shortcuts (Navigation, Commands & Shortcuts Cheat Sheet)
  useEffect(() => {
    let chordTimeout: any = null;
    let leaderKeyActive = false;

    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Command Palette: Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
        return;
      }

      // 2. Escape: closes open dialogs/drawers/shortcuts
      if (e.key === 'Escape') {
        setIsShortcutsOpen(false);
        setIsCommandPaletteOpen(false);
        if (confirmDialog?.isOpen && !confirmDialog.isLoading) {
          setConfirmDialog(null);
        }
        return;
      }

      // Ignore single key or sequence shortcuts if user is typing in form controls
      const activeEl = document.activeElement;
      const isTyping =
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.tagName === 'SELECT' ||
          (activeEl as HTMLElement).isContentEditable);

      if (isTyping) return;

      // 3. Shortcuts cheat sheet: '?' (or Shift + '/')
      if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsOpen(prev => !prev);
        return;
      }

      // 4. Quick Refresh: 'r' key
      if (e.key.toLowerCase() === 'r' && !leaderKeyActive) {
        e.preventDefault();
        refreshData();
        return;
      }

      // 5. Leader navigation sequences (e.g. 'g' then 'd' -> dashboard)
      if (e.key.toLowerCase() === 'g' && !leaderKeyActive) {
        leaderKeyActive = true;
        clearTimeout(chordTimeout);
        chordTimeout = setTimeout(() => {
          leaderKeyActive = false;
        }, 1000);
        return;
      }

      if (leaderKeyActive) {
        leaderKeyActive = false;
        clearTimeout(chordTimeout);
        const targetMap: Record<string, ViewType> = {
          d: 'dashboard',
          l: 'leads',
          o: 'deals',
          c: 'contacts',
          a: 'activities',
          t: 'tasks',
          e: 'calendar',
          r: 'reports',
          s: 'settings',
          n: 'notifications',
          u: 'components'
        };
        const key = e.key.toLowerCase();
        if (targetMap[key]) {
          e.preventDefault();
          setActiveView(targetMap[key]);
          showToast('Navigation', `Switched to ${targetMap[key].toUpperCase()}`, 'info');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(chordTimeout);
    };
  }, [confirmDialog, setActiveView]);

  // Reset all CRM data to zero (clean slate)
  const resetToZero = () => {
    setLeads([]);
    setDeals([]);
    setContacts([]);
    setCompanies([]);
    setActivities([]);
    setTasks([]);
    setEvents([]);
    setNotifications([]);
    setNotificationPreferences(DEFAULT_NOTIFICATION_PREFERENCES);
    localStorage.setItem(`${STORAGE_KEY_PREFIX}leads`, JSON.stringify([]));
    localStorage.setItem(`${STORAGE_KEY_PREFIX}deals`, JSON.stringify([]));
    localStorage.setItem(`${STORAGE_KEY_PREFIX}contacts`, JSON.stringify([]));
    localStorage.setItem(`${STORAGE_KEY_PREFIX}companies`, JSON.stringify([]));
    localStorage.setItem(`${STORAGE_KEY_PREFIX}activities`, JSON.stringify([]));
    localStorage.setItem(`${STORAGE_KEY_PREFIX}tasks`, JSON.stringify([]));
    localStorage.setItem(`${STORAGE_KEY_PREFIX}calendar_events`, JSON.stringify([]));
    localStorage.setItem(`${STORAGE_KEY_PREFIX}notifications`, JSON.stringify([]));
    showToast('Data Reset to Zero', 'All CRM records have been reset to zero. Ready to start fresh!', 'info');
  };

  // Restore sample demo data
  const resetToMockData = () => {
    setLeads(MOCK_LEADS);
    setDeals(MOCK_DEALS);
    setContacts(MOCK_CONTACTS);
    setCompanies(MOCK_COMPANIES);
    setActivities(MOCK_ACTIVITIES);
    setTasks(MOCK_TASKS);
    setEvents(MOCK_EVENTS);
    setNotifications(MOCK_NOTIFICATIONS);
    setNotificationPreferences(DEFAULT_NOTIFICATION_PREFERENCES);
    localStorage.setItem(`${STORAGE_KEY_PREFIX}leads`, JSON.stringify(MOCK_LEADS));
    localStorage.setItem(`${STORAGE_KEY_PREFIX}deals`, JSON.stringify(MOCK_DEALS));
    localStorage.setItem(`${STORAGE_KEY_PREFIX}contacts`, JSON.stringify(MOCK_CONTACTS));
    localStorage.setItem(`${STORAGE_KEY_PREFIX}companies`, JSON.stringify(MOCK_COMPANIES));
    localStorage.setItem(`${STORAGE_KEY_PREFIX}activities`, JSON.stringify(MOCK_ACTIVITIES));
    localStorage.setItem(`${STORAGE_KEY_PREFIX}tasks`, JSON.stringify(MOCK_TASKS));
    localStorage.setItem(`${STORAGE_KEY_PREFIX}calendar_events`, JSON.stringify(MOCK_EVENTS));
    localStorage.setItem(`${STORAGE_KEY_PREFIX}notifications`, JSON.stringify(MOCK_NOTIFICATIONS));
    showToast('Demo Data Loaded', 'Sample enterprise records have been loaded.', 'success');
  };

  // Authentication
  const login = (email?: string) => {
    setIsAuthenticated(true);
    if (email) {
      setCurrentUser(prev => ({
        ...prev,
        email,
        name: email.split('@')[0].replace('.', ' ').replace(/^./, c => c.toUpperCase())
      }));
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAuthScreen('login');
    showToast('Signed Out', 'You have been signed out of CRM Pro.', 'info');
  };

  // Lead CRUD
  const addLead = (leadData: Omit<Lead, 'id' | 'createdAt' | 'notes'>) => {
    const newLead: Lead = {
      ...leadData,
      id: `lead-${Date.now()}`,
      notes: [],
      createdAt: new Date().toISOString()
    };
    setLeads(prev => [newLead, ...prev]);
    showToast('Lead Created', `${newLead.name} at ${newLead.company} has been added.`, 'success');
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
    showToast('Lead Updated', 'Changes saved successfully.', 'info');
  };

  const deleteLead = (id: string) => {
    const lead = leads.find(l => l.id === id);
    setLeads(prev => prev.filter(l => l.id !== id));
    showToast('Lead Deleted', lead ? `${lead.name} was removed.` : 'Lead removed.', 'info');
  };

  // Convert Lead -> Contact + Deal
  const convertLead = (leadId: string, customDealValue?: number) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    // 1. Check or create Company
    let targetCompany = companies.find(c => c.name.toLowerCase() === lead.company.toLowerCase());
    if (!targetCompany) {
      targetCompany = {
        id: `comp-${Date.now()}`,
        name: lead.company,
        domain: lead.email.includes('@') ? lead.email.split('@')[1] : `${lead.company.toLowerCase().replace(/\s+/g, '')}.com`,
        industry: 'Technology',
        size: '50-100 employees',
        annualRevenue: lead.estimatedValue * 20,
        location: 'United States',
        phone: lead.phone || '+1 (555) 000-0000',
        website: `https://${lead.email.includes('@') ? lead.email.split('@')[1] : 'example.com'}`,
        status: 'Prospect',
        owner: lead.owner,
        description: `Company created automatically upon converting lead ${lead.name}.`,
        createdAt: new Date().toISOString()
      };
      setCompanies(prev => [targetCompany!, ...prev]);
    }

    // 2. Create Contact
    const newContact: Contact = {
      id: `cont-${Date.now()}`,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      title: lead.title,
      companyId: targetCompany.id,
      companyName: targetCompany.name,
      lifecycleStage: 'opportunity',
      owner: lead.owner,
      tags: [...lead.tags, 'Converted Lead'],
      notes: lead.notes,
      createdAt: new Date().toISOString()
    };
    setContacts(prev => [newContact, ...prev]);

    // 3. Create Deal
    const dealVal = customDealValue !== undefined ? customDealValue : lead.estimatedValue || 25000;
    const newDeal: Deal = {
      id: `deal-${Date.now()}`,
      title: `${targetCompany.name} — Expansion Opportunity`,
      companyId: targetCompany.id,
      companyName: targetCompany.name,
      contactId: newContact.id,
      contactName: newContact.name,
      value: dealVal,
      stage: 'new_lead',
      probability: 10,
      expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      owner: lead.owner,
      priority: 'high',
      tags: ['Converted', 'Inbound'],
      notes: [
        {
          id: `n-${Date.now()}`,
          author: currentUser,
          content: `Converted from lead ${lead.name} (${lead.title}). Initial score was ${lead.score}/100.`,
          createdAt: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setDeals(prev => [newDeal, ...prev]);

    // 4. Remove Lead
    setLeads(prev => prev.filter(l => l.id !== leadId));

    showToast('Lead Converted!', `Created Contact ${newContact.name} and Deal for $${dealVal.toLocaleString()}.`, 'success');
  };

  // Deal CRUD
  const addDeal = (dealData: Omit<Deal, 'id' | 'createdAt' | 'updatedAt' | 'notes'>) => {
    const stageConfig = PIPELINE_STAGES.find(s => s.key === dealData.stage);
    const stageLabel = stageConfig?.label || dealData.stage;
    const initialStatus: DealStatus = dealData.stage === 'won' ? 'won' : dealData.stage === 'lost' ? 'lost' : 'open';

    const creationTimeline: DealTimelineItem = {
      id: `tl-${Date.now()}`,
      type: 'created',
      title: 'Deal Created',
      description: `Opportunity created for ${dealData.companyName} by ${currentUser.name}. Initial stage: ${stageLabel}.`,
      timestamp: new Date().toISOString(),
      actor: currentUser,
      badge: stageLabel
    };

    const newDeal: Deal = {
      ...dealData,
      id: `deal-${Date.now()}`,
      status: initialStatus,
      notes: [],
      files: dealData.files || [],
      timeline: [creationTimeline],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setDeals(prev => [newDeal, ...prev]);
    showToast('Deal Created', `${newDeal.title} added to pipeline.`, 'success');
  };

  const updateDeal = (id: string, updates: Partial<Deal>) => {
    setDeals(prev => prev.map(d => {
      if (d.id !== id) return d;
      let newStatus = updates.status || d.status;
      if (updates.stage) {
        newStatus = updates.stage === 'won' ? 'won' : updates.stage === 'lost' ? 'lost' : 'open';
      }
      return { ...d, ...updates, status: newStatus, updatedAt: new Date().toISOString() };
    }));
    showToast('Deal Updated', 'Deal details saved.', 'info');
  };

  const updateDealStage = (id: string, stage: DealStage, winReason?: string, lostReason?: string) => {
    setDeals(prev => prev.map(d => {
      if (d.id !== id) return d;
      const stageConfig = PIPELINE_STAGES.find(s => s.key === stage);
      const stageLabel = stageConfig?.label || stage;
      const status: DealStatus = stage === 'won' ? 'won' : stage === 'lost' ? 'lost' : 'open';

      const timelineEvent: DealTimelineItem = {
        id: `tl-${Date.now()}`,
        type: stage === 'won' ? 'deal_won' : stage === 'lost' ? 'deal_lost' : 'stage_changed',
        title: stage === 'won' ? 'Deal Won! 🏆' : stage === 'lost' ? 'Deal Marked Closed Lost' : `Stage Changed to ${stageLabel}`,
        description: stage === 'won' 
          ? (winReason || 'Contract signed and deal finalized.')
          : stage === 'lost'
          ? `Reason: ${lostReason || 'Budget / Competitor selection'}`
          : `Pipeline stage moved from ${d.stage} to ${stageLabel}.`,
        timestamp: new Date().toISOString(),
        actor: currentUser,
        badge: stageLabel
      };

      return {
        ...d,
        stage,
        status,
        probability: stageConfig ? stageConfig.probability : d.probability,
        wonReason: stage === 'won' ? winReason || d.wonReason || 'Strategic enterprise fit' : undefined,
        lostReason: stage === 'lost' ? lostReason || d.lostReason || 'Pricing / Budget' : undefined,
        timeline: [timelineEvent, ...(d.timeline || [])],
        updatedAt: new Date().toISOString()
      };
    }));

    if (stage === 'won') {
      showToast('Deal Won! 🚀', 'Congratulations on closing this deal!', 'success');
    } else if (stage === 'lost') {
      showToast('Deal Marked Lost', 'Stage updated and reason logged.', 'info');
    } else {
      const stageLabel = PIPELINE_STAGES.find(s => s.key === stage)?.label || stage;
      showToast('Stage Moved', `Deal moved to "${stageLabel}".`, 'info');
    }
  };

  const deleteDeal = (id: string) => {
    const deal = deals.find(d => d.id === id);
    setDeals(prev => prev.filter(d => d.id !== id));
    showToast('Deal Deleted', deal ? `${deal.title} was removed.` : 'Deal removed.', 'info');
  };

  const addDealFile = (dealId: string, fileData: Omit<DealFile, 'id' | 'uploadedAt'>) => {
    const newFile: DealFile = {
      ...fileData,
      id: `file-${Date.now()}`,
      uploadedAt: new Date().toISOString()
    };
    const timelineEvent: DealTimelineItem = {
      id: `tl-${Date.now()}`,
      type: 'file_uploaded',
      title: `File Uploaded: ${newFile.name}`,
      description: `${newFile.name} (${newFile.size}) uploaded by ${newFile.uploadedBy.name}.`,
      timestamp: new Date().toISOString(),
      actor: newFile.uploadedBy,
      badge: newFile.type.toUpperCase()
    };
    setDeals(prev => prev.map(d => {
      if (d.id !== dealId) return d;
      return {
        ...d,
        files: [newFile, ...(d.files || [])],
        timeline: [timelineEvent, ...(d.timeline || [])],
        updatedAt: new Date().toISOString()
      };
    }));
    showToast('File Attached', `${newFile.name} uploaded to deal.`, 'success');
  };

  const deleteDealFile = (dealId: string, fileId: string) => {
    setDeals(prev => prev.map(d => {
      if (d.id !== dealId) return d;
      return {
        ...d,
        files: (d.files || []).filter(f => f.id !== fileId),
        updatedAt: new Date().toISOString()
      };
    }));
    showToast('File Deleted', 'Attachment removed.', 'info');
  };

  const addDealTimelineEvent = (dealId: string, eventData: Omit<DealTimelineItem, 'id' | 'timestamp'>) => {
    const newEvent: DealTimelineItem = {
      ...eventData,
      id: `tl-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    setDeals(prev => prev.map(d => {
      if (d.id !== dealId) return d;
      return {
        ...d,
        timeline: [newEvent, ...(d.timeline || [])],
        updatedAt: new Date().toISOString()
      };
    }));
  };

  // Contact CRUD
  const addContact = (contactData: Omit<Contact, 'id' | 'createdAt' | 'notes'>) => {
    const newContact: Contact = {
      ...contactData,
      id: `cont-${Date.now()}`,
      notes: [],
      createdAt: new Date().toISOString()
    };
    setContacts(prev => [newContact, ...prev]);
    showToast('Contact Added', `${newContact.name} was added.`, 'success');
  };

  const updateContact = (id: string, updates: Partial<Contact>) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    showToast('Contact Updated', 'Contact information saved.', 'info');
  };

  const deleteContact = (id: string) => {
    const c = contacts.find(item => item.id === id);
    setContacts(prev => prev.filter(item => item.id !== id));
    showToast('Contact Deleted', c ? `${c.name} was removed.` : 'Contact removed.', 'info');
  };

  // Company CRUD
  const addCompany = (compData: Omit<Company, 'id' | 'createdAt'>) => {
    const newCompany: Company = {
      ...compData,
      id: `comp-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setCompanies(prev => [newCompany, ...prev]);
    showToast('Company Added', `${newCompany.name} was added.`, 'success');
  };

  const updateCompany = (id: string, updates: Partial<Company>) => {
    setCompanies(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    showToast('Company Updated', 'Company details saved.', 'info');
  };

  const deleteCompany = (id: string) => {
    const comp = companies.find(c => c.id === id);
    setCompanies(prev => prev.filter(c => c.id !== id));
    showToast('Company Deleted', comp ? `${comp.name} was removed.` : 'Company removed.', 'info');
  };

  const addCompanyDocument = (companyId: string, docData: Omit<CompanyDocument, 'id' | 'uploadedAt'>) => {
    const newDoc: CompanyDocument = {
      ...docData,
      id: `doc-${Date.now()}`,
      uploadedAt: new Date().toISOString()
    };
    setCompanies(prev => prev.map(c => {
      if (c.id !== companyId) return c;
      return {
        ...c,
        documents: [newDoc, ...(c.documents || [])]
      };
    }));
    showToast('Document Uploaded', `${newDoc.name} attached to company profile.`, 'success');
  };

  const deleteCompanyDocument = (companyId: string, docId: string) => {
    setCompanies(prev => prev.map(c => {
      if (c.id !== companyId) return c;
      return {
        ...c,
        documents: (c.documents || []).filter(d => d.id !== docId)
      };
    }));
    showToast('Document Removed', 'Document deleted.', 'info');
  };

  // Activity CRUD
  const addActivity = (actData: Omit<Activity, 'id' | 'createdAt'>) => {
    const newActivity: Activity = {
      ...actData,
      id: `act-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setActivities(prev => [newActivity, ...prev]);
    showToast('Activity Logged', `${newActivity.title} recorded.`, 'success');
  };

  const toggleActivityCompleted = (id: string) => {
    setActivities(prev => prev.map(act => {
      if (act.id === id) {
        const completed = !act.completed;
        return {
          ...act,
          completed,
          completedAt: completed ? new Date().toISOString() : undefined
        };
      }
      return act;
    }));
  };

  const deleteActivity = (id: string) => {
    setActivities(prev => prev.filter(a => a.id !== id));
    showToast('Activity Deleted', 'Item removed.', 'info');
  };

  // Task Operations
  const addTask = (taskData: Omit<TaskItem, 'id' | 'createdAt'>) => {
    const newTask: TaskItem = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [newTask, ...prev]);

    // Also sync as an Activity
    const newAct: Activity = {
      id: `act-${newTask.id}`,
      type: 'task',
      title: newTask.title,
      description: newTask.description,
      dueDate: newTask.dueDate,
      completed: newTask.status === 'completed',
      priority: newTask.priority,
      status: newTask.status,
      relatedTo: newTask.relatedTo,
      assignedTo: newTask.assignee,
      createdAt: newTask.createdAt
    };
    setActivities(prev => [newAct, ...prev]);

    showToast('Task Created', `Task "${newTask.title}" added successfully.`, 'success');
  };

  const updateTask = (id: string, updates: Partial<TaskItem>) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const updated = { ...t, ...updates };
        if (updates.status === 'completed' && !t.completedAt) {
          updated.completedAt = new Date().toISOString();
        } else if (updates.status && updates.status !== 'completed') {
          updated.completedAt = undefined;
        }
        return updated;
      }
      return t;
    }));

    setActivities(prev => prev.map(a => {
      if (a.id === `act-${id}` || a.id === id) {
        return {
          ...a,
          title: updates.title ?? a.title,
          description: updates.description ?? a.description,
          dueDate: updates.dueDate ?? a.dueDate,
          priority: updates.priority ?? a.priority,
          completed: updates.status ? updates.status === 'completed' : a.completed,
          status: updates.status ?? a.status,
          assignedTo: updates.assignee ?? a.assignedTo,
          relatedTo: updates.relatedTo ?? a.relatedTo
        };
      }
      return a;
    }));

    showToast('Task Updated', 'Task changes saved.', 'info');
  };

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        return {
          ...t,
          status,
          completedAt: status === 'completed' ? (t.completedAt || new Date().toISOString()) : undefined
        };
      }
      return t;
    }));

    setActivities(prev => prev.map(a => {
      if (a.id === `act-${id}` || a.id === id) {
        return {
          ...a,
          status,
          completed: status === 'completed',
          completedAt: status === 'completed' ? (a.completedAt || new Date().toISOString()) : undefined
        };
      }
      return a;
    }));

    const statusLabels: Record<TaskStatus, string> = {
      todo: 'To Do',
      in_progress: 'In Progress',
      review: 'Review',
      completed: 'Completed'
    };
    showToast('Task Moved', `Task status updated to ${statusLabels[status]}.`, 'info');
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    setActivities(prev => prev.filter(a => a.id !== `act-${id}` && a.id !== id));
    showToast('Task Deleted', 'Task removed successfully.', 'info');
  };

  const toggleTaskCompleted = (id: string) => {
    const target = tasks.find(t => t.id === id);
    if (!target) return;
    const nextStatus: TaskStatus = target.status === 'completed' ? 'todo' : 'completed';
    updateTaskStatus(id, nextStatus);
  };

  // Calendar Event Operations
  const addEvent = (eventData: Omit<CalendarEvent, 'id' | 'createdAt'>) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: `event-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setEvents(prev => [newEvent, ...prev]);

    // Also sync as an Activity
    const actType: ActivityType =
      newEvent.type === 'Follow-up Call'
        ? 'call'
        : 'meeting';

    const newAct: Activity = {
      id: `act-${newEvent.id}`,
      type: actType,
      title: newEvent.title,
      description: newEvent.notes || `${newEvent.type} with ${newEvent.contactName || 'client'}`,
      dueDate: `${newEvent.date}T${newEvent.startTime}:00Z`,
      completed: false,
      priority: newEvent.type === 'Client Meeting' || newEvent.type === 'Proposal Review' ? 'high' : 'medium',
      relatedTo: {
        type: newEvent.dealId ? 'deal' : newEvent.contactId ? 'contact' : 'lead',
        id: newEvent.dealId || newEvent.contactId || 'general',
        name: newEvent.dealName || newEvent.contactName || 'General Event'
      },
      assignedTo: newEvent.participants[0] || currentUser,
      durationMinutes: newEvent.durationMinutes,
      createdAt: newEvent.createdAt
    };
    setActivities(prev => [newAct, ...prev]);

    showToast('Event Scheduled', `"${newEvent.title}" added to calendar.`, 'success');
  };

  const updateEvent = (id: string, updates: Partial<CalendarEvent>) => {
    setEvents(prev => prev.map(e => (e.id === id ? { ...e, ...updates } : e)));
    setActivities(prev => prev.map(a => {
      if (a.id === `act-${id}`) {
        return {
          ...a,
          title: updates.title ?? a.title,
          description: updates.notes ?? a.description,
          dueDate: updates.date && updates.startTime ? `${updates.date}T${updates.startTime}:00Z` : a.dueDate,
          durationMinutes: updates.durationMinutes ?? a.durationMinutes
        };
      }
      return a;
    }));
    showToast('Event Updated', 'Calendar event details saved.', 'info');
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    setActivities(prev => prev.filter(a => a.id !== `act-${id}`));
    showToast('Event Removed', 'Event deleted from calendar.', 'info');
  };

  // Notes
  const addNote = (type: 'lead' | 'deal' | 'contact' | 'company', targetId: string, content: string) => {
    if (!content.trim()) return;
    const newNote: Note = {
      id: `note-${Date.now()}`,
      author: currentUser,
      content: content.trim(),
      createdAt: new Date().toISOString()
    };

    if (type === 'lead') {
      setLeads(prev => prev.map(l => l.id === targetId ? { ...l, notes: [newNote, ...l.notes] } : l));
    } else if (type === 'deal') {
      const dealTimelineEvent: DealTimelineItem = {
        id: `tl-${Date.now()}`,
        type: 'note_added',
        title: 'Note Logged',
        description: content.trim(),
        timestamp: new Date().toISOString(),
        actor: currentUser
      };
      setDeals(prev => prev.map(d => d.id === targetId ? {
        ...d,
        notes: [newNote, ...d.notes],
        timeline: [dealTimelineEvent, ...(d.timeline || [])],
        updatedAt: new Date().toISOString()
      } : d));
    } else if (type === 'contact') {
      setContacts(prev => prev.map(c => c.id === targetId ? { ...c, notes: [newNote, ...c.notes] } : c));
    } else if (type === 'company') {
      setCompanies(prev => prev.map(comp => comp.id === targetId ? { ...comp, notes: [newNote, ...(comp.notes || [])] } : comp));
    }

    showToast('Note Added', 'Note saved to record timeline.', 'success');
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const toggleNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    showToast('Notifications Cleared', 'All notifications have been dismissed.', 'info');
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All Read', 'All notifications marked as read.', 'success');
  };

  const addNotification = (notif: Omit<AppNotification, 'id' | 'time' | 'read'> & { time?: string; read?: boolean }) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      time: notif.time || 'Just now',
      read: notif.read ?? false
    };
    setNotifications(prev => [newNotif, ...prev]);
    showToast(notif.title, notif.description, 'info');
  };

  const updateNotificationPreferences = (updates: Partial<NotificationPreferences>) => {
    setNotificationPreferences(prev => ({
      ...prev,
      ...updates,
      channels: { ...prev.channels, ...(updates.channels || {}) },
      categories: { ...prev.categories, ...(updates.categories || {}) },
      quietHours: { ...prev.quietHours, ...(updates.quietHours || {}) }
    }));
    showToast('Preferences Saved', 'Notification preferences updated successfully.', 'success');
  };

  return (
    <CRMContext.Provider
      value={{
        activeView,
        setActiveView,
        currentUser,
        setCurrentUser,
        availableUsers: USERS,
        leads,
        deals,
        contacts,
        companies,
        activities,
        notifications,
        pipelineStages,
        addLead,
        updateLead,
        deleteLead,
        convertLead,
        addDeal,
        updateDeal,
        updateDealStage,
        deleteDeal,
        addDealFile,
        deleteDealFile,
        addDealTimelineEvent,
        addContact,
        updateContact,
        deleteContact,
        addCompany,
        updateCompany,
        deleteCompany,
        addCompanyDocument,
        deleteCompanyDocument,
        addActivity,
        toggleActivityCompleted,
        deleteActivity,
        tasks,
        addTask,
        updateTask,
        updateTaskStatus,
        deleteTask,
        toggleTaskCompleted,
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        addNote,
        markNotificationAsRead,
        toggleNotificationRead,
        deleteNotification,
        clearAllNotifications,
        markAllNotificationsAsRead,
        addNotification,
        notificationPreferences,
        updateNotificationPreferences,
        toasts,
        showToast,
        removeToast,
        isLoading,
        setIsLoading,
        isRefreshing,
        refreshData,
        simulatedError,
        setSimulatedError,
        confirmDialog,
        confirmAction,
        closeConfirm,
        isShortcutsOpen,
        setIsShortcutsOpen,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isAuthenticated,
        setIsAuthenticated,
        authScreen,
        setAuthScreen,
        login,
        resetToMockData,
        loadDemoData: resetToMockData,
        resetToZero,
        logout
      }}
    >
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
};

