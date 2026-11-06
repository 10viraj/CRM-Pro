import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  Layers,
  CheckCircle2,
  ExternalLink,
  Shield,
  Zap,
  Globe,
  RefreshCw
} from 'lucide-react';

export const IntegrationsView: React.FC = () => {
  const { showToast } = useCRM();

  const [integrations, setIntegrations] = useState([
    {
      id: 'slack',
      name: 'Slack',
      category: 'Messaging',
      desc: 'Publish instant deal announcements into #sales-wins and ping lead owners on inbound signups.',
      connected: true,
      lastSync: '5 mins ago'
    },
    {
      id: 'gcal',
      name: 'Google Calendar',
      category: 'Calendar',
      desc: 'Two-way calendar sync for discovery meetings, demos, and executive contract reviews.',
      connected: true,
      lastSync: 'Just now'
    },
    {
      id: 'stripe',
      name: 'Stripe Payments',
      category: 'Billing',
      desc: 'Automatic sync of MRR, customer invoice payment states, and expansion subscriptions.',
      connected: false,
      lastSync: 'Not connected'
    },
    {
      id: 'zapier',
      name: 'Zapier',
      category: 'Automation',
      desc: 'Trigger workflows, webhooks, and automate CRM Pro events across 5,000+ business tools.',
      connected: true,
      lastSync: '12 mins ago'
    },
    {
      id: 'gmail',
      name: 'Gmail & Google Workspace',
      category: 'Email',
      desc: 'Track email opens, auto-log email threads to contact profiles, and send from CRM Pro.',
      connected: true,
      lastSync: '2 mins ago'
    },
    {
      id: 'zoom',
      name: 'Zoom Video Communications',
      category: 'Video Conferencing',
      desc: 'Auto-generate unique meeting links for scheduled calls and log call transcripts.',
      connected: false,
      lastSync: 'Not connected'
    }
  ]);

  const toggleConnection = (id: string) => {
    setIntegrations(prev =>
      prev.map(item => {
        if (item.id === id) {
          const nextState = !item.connected;
          showToast(
            nextState ? 'App Connected' : 'App Disconnected',
            `${item.name} status updated.`,
            nextState ? 'success' : 'info'
          );
          return {
            ...item,
            connected: nextState,
            lastSync: nextState ? 'Just now' : 'Not connected'
          };
        }
        return item;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Integrations & Connected Apps</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
              {integrations.filter(i => i.connected).length} active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Streamline your revenue tech stack with seamless two-way data sync
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={<RefreshCw className="w-3.5 h-3.5" />}
          onClick={() => showToast('Sync Complete', 'All active integrations are fully synchronized.', 'success')}
        >
          Sync All Data
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map(item => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-800 font-bold text-xs">
                    {item.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{item.name}</h3>
                    <span className="text-[10px] text-slate-400 font-medium">{item.category}</span>
                  </div>
                </div>

                <Badge variant={item.connected ? 'emerald' : 'slate'} size="sm" dot>
                  {item.connected ? 'Active' : 'Disconnected'}
                </Badge>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed min-h-[48px]">
                {item.desc}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Sync: {item.lastSync}</span>
              <Button
                size="sm"
                variant={item.connected ? 'outline' : 'primary'}
                onClick={() => toggleConnection(item.id)}
              >
                {item.connected ? 'Disconnect' : 'Connect'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

