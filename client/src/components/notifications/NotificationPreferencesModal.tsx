import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  Bell,
  Mail,
  Smartphone,
  MessageSquare,
  Clock,
  Shield,
  Save,
  RotateCcw,
  X,
  Check,
  CheckCircle2,
  Calendar,
  Kanban,
  CheckSquare,
  UserPlus
} from 'lucide-react';
import { NotificationPreferences } from '../../types';

interface NotificationPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPreferencesModal: React.FC<NotificationPreferencesModalProps> = ({
  isOpen,
  onClose
}) => {
  const { notificationPreferences, updateNotificationPreferences, showToast, addNotification } = useCRM();

  const [prefs, setPrefs] = useState<NotificationPreferences>(notificationPreferences);
  const [activeTab, setActiveTab] = useState<'channels' | 'events' | 'quiet_hours'>('events');

  if (!isOpen) return null;

  const handleSave = () => {
    updateNotificationPreferences(prefs);
    onClose();
  };

  const handleReset = () => {
    // Reset to defaults
    const defaults: NotificationPreferences = {
      channels: {
        inApp: true,
        email: true,
        desktopPush: false,
        slackAlerts: true
      },
      categories: {
        newLead: { inApp: true, email: true, push: true },
        meetingReminders: { inApp: true, email: true, push: true },
        dealMovements: { inApp: true, email: true, push: false },
        taskCompleted: { inApp: true, email: false, push: false },
        customerEmail: { inApp: true, email: true, push: true },
        systemUpdates: { inApp: true, email: false, push: false }
      },
      emailDigest: 'instant',
      quietHours: {
        enabled: true,
        startTime: '22:00',
        endTime: '08:00'
      }
    };
    setPrefs(defaults);
    updateNotificationPreferences(defaults);
    showToast('Preferences Reset', 'All notification settings restored to system defaults.', 'info');
  };

  const handleTestAlert = () => {
    addNotification({
      title: '🔔 Test Notification Triggered',
      description: 'Your notification preferences are working properly across all active channels.',
      type: 'system',
      read: false
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-up">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200/60">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Notification Preferences</h2>
              <p className="text-xs text-slate-500">Configure how and when you receive CRM alerts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-100 px-6 bg-white gap-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('events')}
            className={`py-3.5 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'events'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Bell className="w-4 h-4" />
            Event Subscriptions
          </button>
          <button
            onClick={() => setActiveTab('channels')}
            className={`py-3.5 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'channels'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Mail className="w-4 h-4" />
            Delivery Channels
          </button>
          <button
            onClick={() => setActiveTab('quiet_hours')}
            className={`py-3.5 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'quiet_hours'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            Quiet Hours & Digest
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: EVENT SUBSCRIPTIONS */}
          {activeTab === 'events' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-2xs font-semibold text-slate-400 uppercase tracking-wider">
                <span>Alert Category</span>
                <div className="flex items-center gap-8 pr-2">
                  <span>In-App</span>
                  <span>Email</span>
                  <span>Push</span>
                </div>
              </div>

              {/* Event 1: New Lead */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100/70 text-blue-600">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">🔔 New lead assigned to you</h4>
                    <p className="text-2xs text-slate-500">When an SDR or manager routes a prospect to your pipeline</p>
                  </div>
                </div>
                <div className="flex items-center gap-8 pr-2">
                  <input
                    type="checkbox"
                    checked={prefs.categories.newLead.inApp}
                    onChange={e =>
                      setPrefs({
                        ...prefs,
                        categories: {
                          ...prefs.categories,
                          newLead: { ...prefs.categories.newLead, inApp: e.target.checked }
                        }
                      })
                    }
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <input
                    type="checkbox"
                    checked={prefs.categories.newLead.email}
                    onChange={e =>
                      setPrefs({
                        ...prefs,
                        categories: {
                          ...prefs.categories,
                          newLead: { ...prefs.categories.newLead, email: e.target.checked }
                        }
                      })
                    }
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <input
                    type="checkbox"
                    checked={prefs.categories.newLead.push}
                    onChange={e =>
                      setPrefs({
                        ...prefs,
                        categories: {
                          ...prefs.categories,
                          newLead: { ...prefs.categories.newLead, push: e.target.checked }
                        }
                      })
                    }
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Event 2: Meeting starts in 30 minutes */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100/70 text-purple-600">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">📅 Meeting starts in 30 minutes</h4>
                    <p className="text-2xs text-slate-500">Upcoming calendar event reminder with 1-click video link</p>
                  </div>
                </div>
                <div className="flex items-center gap-8 pr-2">
                  <input
                    type="checkbox"
                    checked={prefs.categories.meetingReminders.inApp}
                    onChange={e =>
                      setPrefs({
                        ...prefs,
                        categories: {
                          ...prefs.categories,
                          meetingReminders: { ...prefs.categories.meetingReminders, inApp: e.target.checked }
                        }
                      })
                    }
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <input
                    type="checkbox"
                    checked={prefs.categories.meetingReminders.email}
                    onChange={e =>
                      setPrefs({
                        ...prefs,
                        categories: {
                          ...prefs.categories,
                          meetingReminders: { ...prefs.categories.meetingReminders, email: e.target.checked }
                        }
                      })
                    }
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <input
                    type="checkbox"
                    checked={prefs.categories.meetingReminders.push}
                    onChange={e =>
                      setPrefs({
                        ...prefs,
                        categories: {
                          ...prefs.categories,
                          meetingReminders: { ...prefs.categories.meetingReminders, push: e.target.checked }
                        }
                      })
                    }
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Event 3: Deal moved to Negotiation */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100/70 text-emerald-600">
                    <Kanban className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">💰 Deal moved to Negotiation</h4>
                    <p className="text-2xs text-slate-500">When opportunities advance stages or close won</p>
                  </div>
                </div>
                <div className="flex items-center gap-8 pr-2">
                  <input
                    type="checkbox"
                    checked={prefs.categories.dealMovements.inApp}
                    onChange={e =>
                      setPrefs({
                        ...prefs,
                        categories: {
                          ...prefs.categories,
                          dealMovements: { ...prefs.categories.dealMovements, inApp: e.target.checked }
                        }
                      })
                    }
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <input
                    type="checkbox"
                    checked={prefs.categories.dealMovements.email}
                    onChange={e =>
                      setPrefs({
                        ...prefs,
                        categories: {
                          ...prefs.categories,
                          dealMovements: { ...prefs.categories.dealMovements, email: e.target.checked }
                        }
                      })
                    }
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <input
                    type="checkbox"
                    checked={prefs.categories.dealMovements.push}
                    onChange={e =>
                      setPrefs({
                        ...prefs,
                        categories: {
                          ...prefs.categories,
                          dealMovements: { ...prefs.categories.dealMovements, push: e.target.checked }
                        }
                      })
                    }
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Event 4: Task completed */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-100/70 text-amber-600">
                    <CheckSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">✅ Task completed</h4>
                    <p className="text-2xs text-slate-500">When assigned tasks or action items are checked off</p>
                  </div>
                </div>
                <div className="flex items-center gap-8 pr-2">
                  <input
                    type="checkbox"
                    checked={prefs.categories.taskCompleted.inApp}
                    onChange={e =>
                      setPrefs({
                        ...prefs,
                        categories: {
                          ...prefs.categories,
                          taskCompleted: { ...prefs.categories.taskCompleted, inApp: e.target.checked }
                        }
                      })
                    }
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <input
                    type="checkbox"
                    checked={prefs.categories.taskCompleted.email}
                    onChange={e =>
                      setPrefs({
                        ...prefs,
                        categories: {
                          ...prefs.categories,
                          taskCompleted: { ...prefs.categories.taskCompleted, email: e.target.checked }
                        }
                      })
                    }
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <input
                    type="checkbox"
                    checked={prefs.categories.taskCompleted.push}
                    onChange={e =>
                      setPrefs({
                        ...prefs,
                        categories: {
                          ...prefs.categories,
                          taskCompleted: { ...prefs.categories.taskCompleted, push: e.target.checked }
                        }
                      })
                    }
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Event 5: New customer email */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-100/70 text-indigo-600">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">📧 New customer email</h4>
                    <p className="text-2xs text-slate-500">When a prospect or contact replies to your email threads</p>
                  </div>
                </div>
                <div className="flex items-center gap-8 pr-2">
                  <input
                    type="checkbox"
                    checked={prefs.categories.customerEmail.inApp}
                    onChange={e =>
                      setPrefs({
                        ...prefs,
                        categories: {
                          ...prefs.categories,
                          customerEmail: { ...prefs.categories.customerEmail, inApp: e.target.checked }
                        }
                      })
                    }
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <input
                    type="checkbox"
                    checked={prefs.categories.customerEmail.email}
                    onChange={e =>
                      setPrefs({
                        ...prefs,
                        categories: {
                          ...prefs.categories,
                          customerEmail: { ...prefs.categories.customerEmail, email: e.target.checked }
                        }
                      })
                    }
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <input
                    type="checkbox"
                    checked={prefs.categories.customerEmail.push}
                    onChange={e =>
                      setPrefs({
                        ...prefs,
                        categories: {
                          ...prefs.categories,
                          customerEmail: { ...prefs.categories.customerEmail, push: e.target.checked }
                        }
                      })
                    }
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DELIVERY CHANNELS */}
          {activeTab === 'channels' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-slate-200/90 bg-white flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200/60 mt-0.5">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">In-App Notifications</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Display unread badges, header popover dropdowns, and toast cards inside CRM Pro
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={prefs.channels.inApp}
                    onChange={e =>
                      setPrefs({
                        ...prefs,
                        channels: { ...prefs.channels, inApp: e.target.checked }
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="p-4 rounded-xl border border-slate-200/90 bg-white flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-200/60 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Email Notifications</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Send transactional email alerts to viraj@crmpro.io for priority deal activities
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={prefs.channels.email}
                    onChange={e =>
                      setPrefs({
                        ...prefs,
                        channels: { ...prefs.channels, email: e.target.checked }
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="p-4 rounded-xl border border-slate-200/90 bg-white flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 mt-0.5">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Desktop Push Notifications</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Display native browser push banners even when CRM Pro is minimized
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={prefs.channels.desktopPush}
                    onChange={e =>
                      setPrefs({
                        ...prefs,
                        channels: { ...prefs.channels, desktopPush: e.target.checked }
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="p-4 rounded-xl border border-slate-200/90 bg-white flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60 mt-0.5">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Slack & Teams Webhook Integration</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Forward pipeline milestones and lead notifications to #sales-won channel
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={prefs.channels.slackAlerts}
                    onChange={e =>
                      setPrefs({
                        ...prefs,
                        channels: { ...prefs.channels, slackAlerts: e.target.checked }
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          )}

          {/* TAB 3: QUIET HOURS & DIGEST */}
          {activeTab === 'quiet_hours' && (
            <div className="space-y-5">
              {/* Email Digest Frequency */}
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80">
                <h4 className="text-xs font-bold text-slate-900 mb-1">Email Digest Frequency</h4>
                <p className="text-xs text-slate-500 mb-3">Group non-urgent notifications into a consolidated summary</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['instant', 'daily', 'weekly', 'off'] as const).map(mode => (
                    <button
                      key={mode}
                      onClick={() => setPrefs({ ...prefs, emailDigest: mode })}
                      className={`p-2.5 rounded-xl text-xs font-semibold capitalize border transition-all ${
                        prefs.emailDigest === mode
                          ? 'bg-white border-blue-600 text-blue-600 shadow-2xs font-bold'
                          : 'bg-white/80 border-slate-200 text-slate-600 hover:bg-white'
                      }`}
                    >
                      {mode === 'off' ? 'Disabled' : `${mode} Digest`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quiet Hours / Do Not Disturb */}
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Quiet Hours (Do Not Disturb)</h4>
                    <p className="text-xs text-slate-500">Mute popups and sound alerts during specified hours</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={prefs.quietHours.enabled}
                      onChange={e =>
                        setPrefs({
                          ...prefs,
                          quietHours: { ...prefs.quietHours, enabled: e.target.checked }
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {prefs.quietHours.enabled && (
                  <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-slate-200/60">
                    <div>
                      <label className="block text-2xs font-semibold text-slate-500 mb-1">Mute Starting</label>
                      <input
                        type="time"
                        value={prefs.quietHours.startTime}
                        onChange={e =>
                          setPrefs({
                            ...prefs,
                            quietHours: { ...prefs.quietHours, startTime: e.target.value }
                          })
                        }
                        className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-2xs font-semibold text-slate-500 mb-1">Resume Alerts At</label>
                      <input
                        type="time"
                        value={prefs.quietHours.endTime}
                        onChange={e =>
                          setPrefs({
                            ...prefs,
                            quietHours: { ...prefs.quietHours, endTime: e.target.value }
                          })
                        }
                        className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 font-medium"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Defaults
            </button>
            <button
              onClick={handleTestAlert}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
            >
              <Bell className="w-3.5 h-3.5" />
              Send Test Alert
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-2xs transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

