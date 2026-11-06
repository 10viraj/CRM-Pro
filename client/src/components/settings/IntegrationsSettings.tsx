import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  Mail,
  Calendar,
  MessageSquare,
  Smartphone,
  CreditCard,
  Check,
  X,
  ExternalLink,
  RefreshCw,
  Sliders,
  Sparkles,
  ShieldCheck,
  Send,
  Zap,
  Globe,
  Radio
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface IntegrationsSettingsProps {
  subSection: 'email' | 'calendar' | 'slack' | 'whatsapp' | 'payment';
}

export const IntegrationsSettings: React.FC<IntegrationsSettingsProps> = ({ subSection }) => {
  const { showToast } = useCRM();

  // Email Integration State
  const [emailSync, setEmailSync] = useState({
    provider: 'Google Workspace (Gmail)',
    account: 'viraj@crmpro.io',
    connected: true,
    twoWaySync: true,
    trackOpens: true,
    trackClicks: true
  });

  // Calendar Integration State
  const [calendarSync, setCalendarSync] = useState({
    provider: 'Google Calendar',
    account: 'viraj@crmpro.io',
    connected: true,
    autoAddVideoLink: true,
    videoProvider: 'Google Meet',
    bufferMinutes: 15
  });

  // Slack Integration State
  const [slackSync, setSlackSync] = useState({
    workspace: 'CRM Pro Global Team',
    connected: true,
    dealChannel: '#sales-wins',
    leadChannel: '#leads-inbox',
    notifyDealWon: true,
    notifyHighPriorityLead: true
  });

  // WhatsApp Integration State
  const [whatsAppSync, setWhatsAppSync] = useState({
    phoneNumber: '+91 98201 44520',
    wabaId: 'WABA-9921-88402-CRMPRO',
    connected: true,
    autoWelcome: true,
    leadFollowupTemplate: 'crm_pro_lead_welcome_v2',
    deliveryStatus: 'Healthy (Meta Cloud API)'
  });

  // Payment Integration State
  const [paymentSync, setPaymentSync] = useState({
    razorpayConnected: true,
    razorpayKey: 'rzp_live_89a7f92b491c',
    stripeConnected: true,
    stripeKey: 'pk_live_51P0...4912',
    currency: 'INR (₹)',
    autoCreateInvoice: true,
    paymentLinkExpiryHours: 48
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ─────────────────────────────────────────────────────────────
          1. EMAIL INTEGRATION
          ───────────────────────────────────────────────────────────── */}
      {subSection === 'email' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-200">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Email Sync & Communication</h3>
                  <p className="text-xs text-slate-500">
                    Synchronize corporate inboxes, automated thread logging, and read-receipt tracking
                  </p>
                </div>
              </div>

              <span className="text-2xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5 self-start sm:self-auto">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Connected
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {/* Google Workspace */}
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/20 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Google Workspace (Gmail)</h4>
                  <p className="text-2xs text-slate-500 mt-0.5">Connected as viraj@crmpro.io</p>
                  <span className="text-2xs font-semibold text-emerald-600 mt-1 inline-block">
                    ✓ Real-time webhook push active
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => showToast('Reconnected', 'Google Workspace token refreshed.', 'success')}
                >
                  Reconnect
                </Button>
              </div>

              {/* Microsoft 365 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Microsoft Outlook 365</h4>
                  <p className="text-2xs text-slate-500 mt-0.5">Not connected for secondary inbox</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => showToast('Connect Outlook', 'Microsoft OAuth redirect initiated.', 'info')}
                >
                  Connect
                </Button>
              </div>
            </div>

            {/* Email Toggles */}
            <div className="space-y-3.5 mt-6 pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Two-way Email Synchronization</h4>
                  <p className="text-2xs text-slate-500">Sync both sent proposals and received customer replies into CRM timelines</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailSync.twoWaySync}
                  onChange={e => setEmailSync({ ...emailSync, twoWaySync: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Email Open Tracking Pixel</h4>
                  <p className="text-2xs text-slate-500">Notify reps immediately when clients view commercial proposal attachments</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailSync.trackOpens}
                  onChange={e => setEmailSync({ ...emailSync, trackOpens: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. CALENDAR INTEGRATION
          ───────────────────────────────────────────────────────────── */}
      {subSection === 'calendar' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Calendar & Meeting Sync</h3>
                  <p className="text-xs text-slate-500">
                    Two-way calendar sync, automated Google Meet/Zoom generation, and slot buffer rules
                  </p>
                </div>
              </div>

              <span className="text-2xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5 self-start sm:self-auto">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Synced (Google Calendar)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Default Video Conference Link</label>
                <select
                  value={calendarSync.videoProvider}
                  onChange={e => setCalendarSync({ ...calendarSync, videoProvider: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                >
                  <option value="Google Meet">Google Meet (Auto-provisioned link)</option>
                  <option value="Zoom">Zoom Video Communications</option>
                  <option value="Microsoft Teams">Microsoft Teams</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Meeting Buffer Time</label>
                <select
                  value={calendarSync.bufferMinutes}
                  onChange={e => setCalendarSync({ ...calendarSync, bufferMinutes: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                >
                  <option value={10}>10 minutes between client calls</option>
                  <option value={15}>15 minutes between client calls</option>
                  <option value={30}>30 minutes between client calls</option>
                </select>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Automatically Attach Video Links</h4>
                <p className="text-2xs text-slate-500">Auto-inject meeting URL into Google Calendar invitations sent to prospects</p>
              </div>
              <input
                type="checkbox"
                checked={calendarSync.autoAddVideoLink}
                onChange={e => setCalendarSync({ ...calendarSync, autoAddVideoLink: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded border-slate-300"
              />
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. SLACK INTEGRATION
          ───────────────────────────────────────────────────────────── */}
      {subSection === 'slack' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Slack Workspace Bot</h3>
                  <p className="text-xs text-slate-500">
                    Forward pipeline achievements, milestone notifications, and hot inbound leads into channels
                  </p>
                </div>
              </div>

              <span className="text-2xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5 self-start sm:self-auto">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Connected
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Deal Won Celebrations Channel</label>
                <input
                  type="text"
                  value={slackSync.dealChannel}
                  onChange={e => setSlackSync({ ...slackSync, dealChannel: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Inbound Leads Alert Channel</label>
                <input
                  type="text"
                  value={slackSync.leadChannel}
                  onChange={e => setSlackSync({ ...slackSync, leadChannel: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
              <p className="text-2xs text-slate-500">Workspace connected: <strong>CRM Pro Global Team</strong></p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => showToast('Slack Test', 'Sample celebration posted to #sales-wins.', 'success')}
              >
                Send Test Webhook
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. WHATSAPP INTEGRATION
          ───────────────────────────────────────────────────────────── */}
      {subSection === 'whatsapp' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600 border border-teal-200">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">WhatsApp Business Cloud API</h3>
                  <p className="text-xs text-slate-500">
                    Official Meta WhatsApp Business Cloud API integration for instant lead reach-outs
                  </p>
                </div>
              </div>

              <span className="text-2xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5 self-start sm:self-auto">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Verified Phone Number
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Connected Business Phone</label>
                <input
                  type="text"
                  value={whatsAppSync.phoneNumber}
                  onChange={e => setWhatsAppSync({ ...whatsAppSync, phoneNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Meta WABA Account ID</label>
                <input
                  type="text"
                  value={whatsAppSync.wabaId}
                  disabled
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium text-slate-500"
                />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Automated Instant WhatsApp Greeting</h4>
                <p className="text-2xs text-slate-500">Send WhatsApp intro when a new lead fills the website demo form</p>
              </div>
              <input
                type="checkbox"
                checked={whatsAppSync.autoWelcome}
                onChange={e => setWhatsAppSync({ ...whatsAppSync, autoWelcome: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded border-slate-300"
              />
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          5. PAYMENT INTEGRATION
          ───────────────────────────────────────────────────────────── */}
      {subSection === 'payment' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Payment Gateways & Invoicing</h3>
                  <p className="text-xs text-slate-500">
                    Process Indian Rupee (₹) payments via Razorpay and global card transactions with Stripe
                  </p>
                </div>
              </div>

              <span className="text-2xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5 self-start sm:self-auto">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                2 Gateways Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {/* Razorpay */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900">Razorpay (India UPI / Cards / Netbanking)</span>
                  <Badge variant="emerald" size="sm">Active</Badge>
                </div>
                <p className="text-2xs text-slate-500 mb-3">Live Key: {paymentSync.razorpayKey}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => showToast('Razorpay Settings', 'Gateway parameters up to date.', 'info')}
                >
                  Configure Webhooks
                </Button>
              </div>

              {/* Stripe */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900">Stripe Global Payments</span>
                  <Badge variant="emerald" size="sm">Active</Badge>
                </div>
                <p className="text-2xs text-slate-500 mb-3">Live Key: {paymentSync.stripeKey}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => showToast('Stripe Settings', 'Global credit card processing active.', 'info')}
                >
                  Configure Webhooks
                </Button>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Auto-Generate Payment Invoice on Deal Won</h4>
                <p className="text-2xs text-slate-500">Dispatches GST-compliant payment link immediately when deal is dragged to Won</p>
              </div>
              <input
                type="checkbox"
                checked={paymentSync.autoCreateInvoice}
                onChange={e => setPaymentSync({ ...paymentSync, autoCreateInvoice: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded border-slate-300"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
