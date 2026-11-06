import React, { useState } from 'react';
import { CRMProvider, useCRM } from './context/CRMContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { CommandPalette } from './components/layout/CommandPalette';
import { ToastContainer } from './components/common/ToastContainer';
import { ConfirmationDialog } from './components/common/ConfirmationDialog';
import { KeyboardShortcutsModal } from './components/common/KeyboardShortcutsModal';
import { Button } from './components/common/Button';
import {
  LeadsSkeletonView,
  DealsSkeletonView,
  ContactsSkeletonView,
  CompaniesSkeletonView,
  TasksSkeletonView,
  CalendarSkeletonView,
  ActivitiesSkeletonView,
  AnalyticsSkeletonView,
  NotificationsSkeletonView
} from './components/common/ViewSkeletons';
import { AlertCircle, X, RefreshCw } from 'lucide-react';

// Views
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { LeadsView } from './components/leads/LeadsView';
import { DealsView } from './components/deals/DealsView';
import { ContactsView } from './components/contacts/ContactsView';
import { CompaniesView } from './components/companies/CompaniesView';
import { TasksView } from './components/tasks/TasksView';
import { CalendarView } from './components/calendar/CalendarView';
import { ActivitiesView } from './components/activities/ActivitiesView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { SettingsView } from './components/settings/SettingsView';
import { TeamView } from './components/workspace/TeamView';
import { NotificationsView } from './components/workspace/NotificationsView';
import { IntegrationsView } from './components/workspace/IntegrationsView';
import { AuthContainer } from './components/auth/AuthContainer';
import { UIComponentShowcase } from './components/common/UIComponentShowcase';
import { LandingPage } from './components/landing/LandingPage';

// Drawers & Modals
import { LeadDetailDrawer } from './components/leads/LeadDetailDrawer';
import { LeadModal } from './components/leads/LeadModal';
import { DealDetailDrawer } from './components/deals/DealDetailDrawer';
import { DealModal } from './components/deals/DealModal';
import { ContactDetailDrawer } from './components/contacts/ContactDetailDrawer';
import { ContactModal } from './components/contacts/ContactModal';
import { CompanyDetailDrawer } from './components/companies/CompanyDetailDrawer';
import { CompanyModal } from './components/companies/CompanyModal';
import { ActivityModal } from './components/activities/ActivityModal';

// Types
import { Company, Contact, Deal, DealStage, Lead } from './types';

const CRMAppContent: React.FC = () => {
  const {
    activeView,
    setActiveView,
    isAuthenticated,
    login,
    isLoading,
    isRefreshing,
    refreshData,
    simulatedError,
    setSimulatedError,
    confirmDialog,
    closeConfirm
  } = useCRM();

  // Mode when unauthenticated: 'landing' or 'auth'
  const [unauthMode, setUnauthMode] = useState<'landing' | 'auth'>('landing');

  // If unauthenticated, present LandingPage before login
  if (!isAuthenticated) {
    if (unauthMode === 'auth') {
      return (
        <>
          <AuthContainer
            onEnterApp={() => login()}
            onBackToLanding={() => setUnauthMode('landing')}
          />
          <ToastContainer />
        </>
      );
    }

    return (
      <>
        <LandingPage
          onGetStarted={() => setUnauthMode('auth')}
          onSignIn={() => setUnauthMode('auth')}
          onViewDemo={() => login()}
        />
        <ToastContainer />
      </>
    );
  }

  // If authenticated user selects Landing Page view to inspect the portfolio landing page
  if (activeView === 'landing') {
    return (
      <div className="relative">
        <div className="fixed top-20 right-6 z-50">
          <button
            type="button"
            onClick={() => setActiveView('dashboard')}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/30 transition-all border border-blue-400/40"
          >
            <span>← Return to CRM Dashboard</span>
          </button>
        </div>
        <LandingPage
          onGetStarted={() => setActiveView('dashboard')}
          onSignIn={() => setActiveView('dashboard')}
          onViewDemo={() => setActiveView('dashboard')}
        />
        <ToastContainer />
      </div>
    );
  }

  // Sidebar States
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Selected Records for Drawers
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isLeadDrawerOpen, setIsLeadDrawerOpen] = useState(false);

  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [isDealDrawerOpen, setIsDealDrawerOpen] = useState(false);

  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isContactDrawerOpen, setIsContactDrawerOpen] = useState(false);

  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isCompanyDrawerOpen, setIsCompanyDrawerOpen] = useState(false);

  // Modals States
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState<Lead | null>(null);

  const [isDealModalOpen, setIsDealModalOpen] = useState(false);
  const [dealToEdit, setDealToEdit] = useState<Deal | null>(null);
  const [dealInitialStage, setDealInitialStage] = useState<DealStage>('new_lead');

  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactToEdit, setContactToEdit] = useState<Contact | null>(null);

  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [companyToEdit, setCompanyToEdit] = useState<Company | null>(null);

  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

  // Drawer Open Handlers
  const handleSelectLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsLeadDrawerOpen(true);
  };

  const handleSelectDeal = (deal: Deal) => {
    setSelectedDeal(deal);
    setIsDealDrawerOpen(true);
  };

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
    setIsContactDrawerOpen(true);
  };

  const handleSelectCompany = (company: Company) => {
    setSelectedCompany(company);
    setIsCompanyDrawerOpen(true);
  };

  // Modal Open Handlers
  const handleOpenNewLead = () => {
    setLeadToEdit(null);
    setIsLeadModalOpen(true);
  };

  const handleEditLead = (lead: Lead) => {
    setLeadToEdit(lead);
    setIsLeadModalOpen(true);
  };

  const handleOpenNewDeal = () => {
    setDealToEdit(null);
    setDealInitialStage('new_lead');
    setIsDealModalOpen(true);
  };

  const handleOpenNewDealWithStage = (stage: DealStage) => {
    setDealToEdit(null);
    setDealInitialStage(stage);
    setIsDealModalOpen(true);
  };

  const handleEditDeal = (deal: Deal) => {
    setDealToEdit(deal);
    setIsDealModalOpen(true);
  };

  const handleOpenNewContact = () => {
    setContactToEdit(null);
    setIsContactModalOpen(true);
  };

  const handleEditContact = (contact: Contact) => {
    setContactToEdit(contact);
    setIsContactModalOpen(true);
  };

  const handleOpenNewCompany = () => {
    setCompanyToEdit(null);
    setIsCompanyModalOpen(true);
  };

  const handleEditCompany = (company: Company) => {
    setCompanyToEdit(company);
    setIsCompanyModalOpen(true);
  };

  const handleOpenNewActivity = () => {
    setIsActivityModalOpen(true);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAFC] text-[#0F172A] font-sans antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Header Bar */}
        <Header
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          onOpenNewLead={handleOpenNewLead}
          onOpenNewDeal={handleOpenNewDeal}
          onOpenNewContact={handleOpenNewContact}
          onOpenNewActivity={handleOpenNewActivity}
          onOpenNewCompany={handleOpenNewCompany}
        />

        {/* Scrollable Workspace Body */}
        <main className="flex-1 overflow-y-auto p-3.5 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto pb-24 md:pb-12">
            {/* 1. Global Error State Alert Banner */}
            {simulatedError && (
              <div className="mb-5 p-4 rounded-2xl bg-rose-50 border border-rose-200/90 text-rose-900 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-xs animate-scale-up">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="p-2 rounded-xl bg-rose-100 text-rose-700 shrink-0">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">System Connection Notice</p>
                    <p className="text-2xs text-rose-700 mt-0.5 leading-relaxed">
                      {simulatedError}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={async () => {
                      setSimulatedError(null);
                      await refreshData();
                    }}
                    className="bg-rose-600 hover:bg-rose-700 text-white shadow-xs text-xs font-semibold"
                  >
                    Retry Connection
                  </Button>
                  <button
                    onClick={() => setSimulatedError(null)}
                    className="p-1 rounded-lg text-rose-400 hover:text-rose-700 hover:bg-rose-100 transition-colors"
                    title="Dismiss"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* 2. Loading State / Skeletons vs Real Views */}
            {isRefreshing || isLoading ? (
              activeView === 'leads' ? (
                <LeadsSkeletonView />
              ) : activeView === 'deals' ? (
                <DealsSkeletonView />
              ) : activeView === 'contacts' ? (
                <ContactsSkeletonView />
              ) : activeView === 'companies' ? (
                <CompaniesSkeletonView />
              ) : activeView === 'tasks' ? (
                <TasksSkeletonView />
              ) : activeView === 'calendar' ? (
                <CalendarSkeletonView />
              ) : activeView === 'activities' ? (
                <ActivitiesSkeletonView />
              ) : activeView === 'reports' || activeView === 'dashboard' ? (
                <AnalyticsSkeletonView />
              ) : activeView === 'notifications' ? (
                <NotificationsSkeletonView />
              ) : (
                <LeadsSkeletonView />
              )
            ) : (
              <>
                {activeView === 'dashboard' && (
                  <DashboardOverview
                    onSelectDeal={handleSelectDeal}
                    onSelectLead={handleSelectLead}
                    onOpenNewLead={handleOpenNewLead}
                    onOpenNewDeal={handleOpenNewDeal}
                  />
                )}

                {activeView === 'leads' && (
                  <LeadsView
                    onSelectLead={handleSelectLead}
                    onOpenNewLead={handleOpenNewLead}
                    onEditLead={handleEditLead}
                  />
                )}

                {activeView === 'deals' && (
                  <DealsView
                    onSelectDeal={handleSelectDeal}
                    onOpenNewDeal={handleOpenNewDeal}
                    onOpenNewDealWithStage={handleOpenNewDealWithStage}
                    onEditDeal={handleEditDeal}
                  />
                )}

                {activeView === 'contacts' && (
                  <ContactsView
                    onSelectContact={handleSelectContact}
                    onOpenNewContact={handleOpenNewContact}
                    onEditContact={handleEditContact}
                  />
                )}

                {activeView === 'companies' && (
                  <CompaniesView
                    onSelectCompany={handleSelectCompany}
                    onOpenNewCompany={handleOpenNewCompany}
                    onEditCompany={handleEditCompany}
                  />
                )}

                {activeView === 'tasks' && (
                  <TasksView onOpenNewActivity={handleOpenNewActivity} />
                )}

                {activeView === 'calendar' && (
                  <CalendarView onOpenNewActivity={handleOpenNewActivity} />
                )}

                {activeView === 'activities' && (
                  <ActivitiesView onOpenNewActivity={handleOpenNewActivity} />
                )}

                {activeView === 'reports' && <AnalyticsView />}

                {activeView === 'settings' && <SettingsView />}

                {activeView === 'team' && <TeamView />}

                {activeView === 'notifications' && <NotificationsView />}

                {activeView === 'integrations' && <IntegrationsView />}

                {activeView === 'components' && <UIComponentShowcase />}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Drawers */}
      <LeadDetailDrawer
        lead={selectedLead}
        isOpen={isLeadDrawerOpen}
        onClose={() => setIsLeadDrawerOpen(false)}
        onEdit={handleEditLead}
      />

      <DealDetailDrawer
        deal={selectedDeal}
        isOpen={isDealDrawerOpen}
        onClose={() => setIsDealDrawerOpen(false)}
        onEdit={handleEditDeal}
      />

      <ContactDetailDrawer
        contact={selectedContact}
        isOpen={isContactDrawerOpen}
        onClose={() => setIsContactDrawerOpen(false)}
        onEdit={handleEditContact}
        onSelectDeal={handleSelectDeal}
        onOpenNewDealForContact={contact => {
          setIsContactDrawerOpen(false);
          handleOpenNewDeal();
        }}
      />

      <CompanyDetailDrawer
        company={selectedCompany}
        isOpen={isCompanyDrawerOpen}
        onClose={() => setIsCompanyDrawerOpen(false)}
        onEdit={handleEditCompany}
        onSelectContact={handleSelectContact}
        onSelectDeal={handleSelectDeal}
        onOpenNewDealForCompany={comp => {
          setIsCompanyDrawerOpen(false);
          handleOpenNewDeal();
        }}
      />

      {/* Modals */}
      <LeadModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        leadToEdit={leadToEdit}
      />

      <DealModal
        isOpen={isDealModalOpen}
        onClose={() => setIsDealModalOpen(false)}
        dealToEdit={dealToEdit}
        initialStage={dealInitialStage}
      />

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        contactToEdit={contactToEdit}
      />

      <CompanyModal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
        companyToEdit={companyToEdit}
      />

      <ActivityModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
      />

      {/* Global Command Palette (⌘K) */}
      <CommandPalette
        onOpenNewLead={handleOpenNewLead}
        onOpenNewDeal={handleOpenNewDeal}
        onOpenNewContact={handleOpenNewContact}
      />

      {/* Global Confirmation Dialog */}
      {confirmDialog && confirmDialog.isOpen && (
        <ConfirmationDialog
          isOpen={confirmDialog.isOpen}
          title={confirmDialog.title}
          message={confirmDialog.message}
          confirmText={confirmDialog.confirmText}
          cancelText={confirmDialog.cancelText}
          variant={confirmDialog.variant}
          isLoading={confirmDialog.isLoading}
          onClose={closeConfirm}
          onConfirm={async () => {
            try {
              if (confirmDialog.onConfirm) {
                await confirmDialog.onConfirm();
              }
            } finally {
              closeConfirm();
            }
          }}
        />
      )}

      {/* Mobile Bottom-Friendly Action & Navigation Dock */}
      <MobileBottomNav
        onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
        onOpenNewLead={handleOpenNewLead}
        onOpenNewDeal={handleOpenNewDeal}
        onOpenNewContact={handleOpenNewContact}
        onOpenNewActivity={handleOpenNewActivity}
        onOpenNewCompany={handleOpenNewCompany}
      />

      {/* Keyboard Shortcuts Cheat Sheet Modal (?) */}
      <KeyboardShortcutsModal />

      {/* Toast Notification Container */}
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <CRMProvider>
      <CRMAppContent />
    </CRMProvider>
  );
};

export default App;

