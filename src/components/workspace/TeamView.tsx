import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  Users,
  Plus,
  Shield,
  Mail,
  UserCheck,
  CheckCircle2,
  Copy
} from 'lucide-react';

export const TeamView: React.FC = () => {
  const { availableUsers, currentUser, showToast } = useCRM();

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Account Executive');

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    showToast('Invitation Sent', `Sent workspace invite to ${inviteEmail}`, 'success');
    setInviteEmail('');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Workspace Team</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
              {availableUsers.length} members
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage sales representatives, managers, and permission roles across CRM Pro
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={<Copy className="w-3.5 h-3.5" />}
          onClick={() => showToast('Invite Link Copied', 'https://crmpro.io/join/workspace-acme', 'info')}
        >
          Copy Invite Link
        </Button>
      </div>

      {/* Invite Member Box */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
          Invite New Member to Workspace
        </h3>
        <form onSubmit={handleSendInvite} className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="email"
            required
            value={inviteEmail}
            onChange={e => setInviteEmail(e.target.value)}
            placeholder="colleague@company.com"
            className="flex-1 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <select
            value={inviteRole}
            onChange={e => setInviteRole(e.target.value)}
            className="w-full sm:w-48 rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 bg-white"
          >
            <option value="Account Executive">Account Executive</option>
            <option value="Sales Manager">Sales Manager</option>
            <option value="SDR">SDR</option>
            <option value="Admin">Admin</option>
          </select>
          <Button type="submit" size="sm" variant="primary" icon={<Plus className="w-4 h-4" />}>
            Send Invite
          </Button>
        </form>
      </div>

      {/* Team Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Active Workspace Members</h3>
          <span className="text-xs text-slate-500">{availableUsers.length} of 25 seats used</span>
        </div>

        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4">Member Name</th>
              <th className="py-3.5 px-4">Email</th>
              <th className="py-3.5 px-4">Workspace Role</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Access</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {availableUsers.map(user => {
              const isCurrent = user.id === currentUser.id;

              return (
                <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-blue-700 font-bold text-xs shrink-0">
                        {user.initials}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                          <span>{user.name}</span>
                          {isCurrent && (
                            <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-1.5 py-0.2 rounded-full">
                              You
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500">{user.role}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 font-medium">
                    {user.email}
                  </td>

                  <td className="py-3.5 px-4">
                    <Badge variant={user.role.includes('Admin') ? 'purple' : 'blue'} size="sm">
                      {user.role}
                    </Badge>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 text-emerald-700 text-xs font-semibold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <span className="text-slate-500 font-medium">Full Access</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

