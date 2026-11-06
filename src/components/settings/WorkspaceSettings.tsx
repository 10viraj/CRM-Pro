import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  Users,
  Shield,
  Layers,
  UserPlus,
  Mail,
  Check,
  X,
  Lock,
  Sparkles,
  Award,
  Trash2,
  Edit2,
  DollarSign,
  TrendingUp,
  Briefcase
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { UserRole } from '../../types';

interface WorkspaceSettingsProps {
  subSection: 'team' | 'roles' | 'departments';
}

interface TeamMemberItem {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  initials: string;
  status: 'Active' | 'Invited';
  dealsCount: number;
  avatarBg: string;
}

export const WorkspaceSettings: React.FC<WorkspaceSettingsProps> = ({ subSection }) => {
  const { availableUsers, showToast } = useCRM();

  // Team Members State
  const [members, setMembers] = useState<TeamMemberItem[]>([
    {
      id: 'user-0',
      name: 'Viraj Somani',
      email: 'viraj@crmpro.io',
      role: 'Developer / Admin',
      department: 'Executive & Engineering',
      initials: 'VS',
      status: 'Active',
      dealsCount: 18,
      avatarBg: 'bg-amber-100 text-amber-800 border-amber-300'
    },
    {
      id: 'user-1',
      name: 'Alex Rivera',
      email: 'alex.rivera@crmpro.io',
      role: 'Account Executive',
      department: 'Sales',
      initials: 'AR',
      status: 'Active',
      dealsCount: 14,
      avatarBg: 'bg-blue-100 text-blue-800 border-blue-300'
    },
    {
      id: 'user-2',
      name: 'Maya Patel',
      email: 'maya.patel@crmpro.io',
      role: 'Sales Manager',
      department: 'Sales',
      initials: 'MP',
      status: 'Active',
      dealsCount: 22,
      avatarBg: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    },
    {
      id: 'user-3',
      name: 'Marcus Vance',
      email: 'marcus.vance@crmpro.io',
      role: 'SDR',
      department: 'Sales Development',
      initials: 'MV',
      status: 'Active',
      dealsCount: 9,
      avatarBg: 'bg-purple-100 text-purple-800 border-purple-300'
    },
    {
      id: 'user-4',
      name: 'Sarah Jenkins',
      email: 'sarah.jenkins@crmpro.io',
      role: 'Admin',
      department: 'Operations',
      initials: 'SJ',
      status: 'Active',
      dealsCount: 12,
      avatarBg: 'bg-rose-100 text-rose-800 border-rose-300'
    }
  ]);

  // Invite Member Modal State
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('Account Executive');
  const [inviteDept, setInviteDept] = useState('Sales');

  // Departments State
  const [departments, setDepartments] = useState([
    {
      id: 'dept-1',
      name: 'Enterprise Sales',
      lead: 'Maya Patel',
      headcount: 8,
      targetQuota: '₹45,00,000 / mo',
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      id: 'dept-2',
      name: 'Sales Development (SDR)',
      lead: 'Marcus Vance',
      headcount: 5,
      targetQuota: '350 Qualified Leads / mo',
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
      id: 'dept-3',
      name: 'Customer Success & Solutions',
      lead: 'Alex Rivera',
      headcount: 6,
      targetQuota: '98% Retention Rate',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      id: 'dept-4',
      name: 'Executive & Operations',
      lead: 'Viraj Somani',
      headcount: 4,
      targetQuota: 'Company ARR Target: ₹12.5 Cr',
      color: 'bg-amber-50 text-amber-700 border-amber-200'
    }
  ]);

  // Roles & Permissions matrix
  const permissionsList = [
    { key: 'view_leads', label: 'View & Create Leads', admin: true, manager: true, ae: true, sdr: true },
    { key: 'delete_leads', label: 'Delete Lead Records', admin: true, manager: true, ae: false, sdr: false },
    { key: 'view_deals', label: 'Manage Pipeline & Deals', admin: true, manager: true, ae: true, sdr: false },
    { key: 'edit_stages', label: 'Modify Deal Stages & Values', admin: true, manager: true, ae: true, sdr: false },
    { key: 'view_reports', label: 'View Revenue & Analytics', admin: true, manager: true, ae: true, sdr: false },
    { key: 'export_data', label: 'Bulk Export Data (CSV/JSON)', admin: true, manager: true, ae: false, sdr: false },
    { key: 'manage_team', label: 'Manage Users & Permissions', admin: true, manager: false, ae: false, sdr: false },
    { key: 'system_settings', label: 'Access System Settings', admin: true, manager: false, ae: false, sdr: false }
  ];

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !inviteName) return;

    const initials = inviteName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const newMember: TeamMemberItem = {
      id: `user-${Date.now()}`,
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
      department: inviteDept,
      initials,
      status: 'Invited',
      dealsCount: 0,
      avatarBg: 'bg-slate-100 text-slate-800 border-slate-300'
    };

    setMembers([...members, newMember]);
    setIsInviteOpen(false);
    setInviteName('');
    setInviteEmail('');
    showToast('Invitation Dispatched', `Invite email sent to ${inviteEmail}.`, 'success');
  };

  const handleRemoveMember = (id: string, name: string) => {
    setMembers(members.filter(m => m.id !== id));
    showToast('Member Removed', `${name} has been removed from the workspace.`, 'info');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ─────────────────────────────────────────────────────────────
          1. TEAM MEMBERS
          ───────────────────────────────────────────────────────────── */}
      {subSection === 'team' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">Workspace Team Members</h3>
                  <span className="text-2xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {members.length} Users
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage seats, assign role levels, and invite sales representatives
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                icon={<UserPlus className="w-3.5 h-3.5" />}
                onClick={() => setIsInviteOpen(true)}
              >
                Invite Member
              </Button>
            </div>

            {/* Members Table */}
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-2xs font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-3">Member</th>
                    <th className="py-3 px-3">Role</th>
                    <th className="py-3 px-3">Department</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Active Deals</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {members.map(member => (
                    <tr key={member.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-xl border flex items-center justify-center font-bold text-xs shrink-0 ${member.avatarBg}`}
                          >
                            {member.initials}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{member.name}</span>
                            <span className="text-2xs text-slate-400">{member.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-semibold text-slate-700">{member.role}</span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="text-slate-600">{member.department}</span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`text-2xs font-semibold px-2 py-0.5 rounded-full border ${
                            member.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {member.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-bold text-slate-800">{member.dealsCount} deals</span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        {member.role !== 'Developer / Admin' && (
                          <button
                            onClick={() => handleRemoveMember(member.id, member.name)}
                            title="Remove member"
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Invite Member Modal */}
          {isInviteOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 w-full max-w-md animate-scale-up">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                      <UserPlus className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">Invite New Team Member</h3>
                  </div>
                  <button
                    onClick={() => setIsInviteOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSendInvite} className="space-y-4 pt-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Ananya Sharma"
                      value={inviteName}
                      onChange={e => setInviteName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Work Email</label>
                    <input
                      type="email"
                      placeholder="ananya@crmpro.io"
                      value={inviteEmail}
                      onChange={e => setInviteEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Role</label>
                      <select
                        value={inviteRole}
                        onChange={e => setInviteRole(e.target.value as UserRole)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium"
                      >
                        <option value="Account Executive">Account Executive</option>
                        <option value="Sales Manager">Sales Manager</option>
                        <option value="SDR">SDR</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Department</label>
                      <select
                        value={inviteDept}
                        onChange={e => setInviteDept(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium"
                      >
                        <option value="Sales">Sales</option>
                        <option value="Sales Development">Sales Development</option>
                        <option value="Customer Success">Customer Success</option>
                        <option value="Operations">Operations</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                    <Button variant="outline" size="sm" onClick={() => setIsInviteOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" size="sm">
                      Send Invite
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. ROLES & PERMISSIONS
          ───────────────────────────────────────────────────────────── */}
      {subSection === 'roles' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="pb-6 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Roles & Access Control Matrix</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Define functional authorization, record governance, and data deletion rights per role
              </p>
            </div>

            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-2xs font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-3">Permission Capability</th>
                    <th className="py-3 px-3 text-center">Admin</th>
                    <th className="py-3 px-3 text-center">Sales Manager</th>
                    <th className="py-3 px-3 text-center">Account Executive</th>
                    <th className="py-3 px-3 text-center">SDR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {permissionsList.map(perm => (
                    <tr key={perm.key} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-3">
                        <span className="font-semibold text-slate-800">{perm.label}</span>
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        {perm.admin ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-700">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-300">
                            <X className="w-3 h-3" />
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        {perm.manager ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-700">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-300">
                            <X className="w-3 h-3" />
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        {perm.ae ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-700">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-300">
                            <X className="w-3 h-3" />
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        {perm.sdr ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-700">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-300">
                            <X className="w-3 h-3" />
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. DEPARTMENTS
          ───────────────────────────────────────────────────────────── */}
      {subSection === 'departments' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Organizational Departments</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Business units, departmental managers, headcount allocations, and quota targets
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                icon={<Layers className="w-3.5 h-3.5" />}
                onClick={() => showToast('Add Department', 'Create new department modal ready.', 'info')}
              >
                New Department
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {departments.map(dept => (
                <div
                  key={dept.id}
                  className="p-5 rounded-2xl border border-slate-200/90 hover:border-slate-300 transition-all hover:shadow-card bg-white flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-2xs font-bold px-2.5 py-1 rounded-lg border ${dept.color}`}>
                        {dept.name}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {dept.headcount} members
                      </span>
                    </div>

                    <div className="mt-3 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Department Lead:</span>
                        <strong className="text-slate-900 font-bold">{dept.lead}</strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Attribution Target:</span>
                        <span className="font-semibold text-emerald-600">{dept.targetQuota}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-2xs text-slate-400">
                    <span>Active Team Unit</span>
                    <button className="font-semibold text-blue-600 hover:underline">
                      Configure Members →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

