import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  Lock,
  ShieldCheck,
  Smartphone,
  Laptop,
  Globe,
  Key,
  QrCode,
  AlertTriangle,
  LogOut,
  Check,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface SecuritySettingsProps {
  subSection: 'password' | 'two_factor' | 'sessions';
}

export const SecuritySettings: React.FC<SecuritySettingsProps> = ({ subSection }) => {
  const { showToast } = useCRM();

  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  // 2FA State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [verificationCode, setVerificationCode] = useState('');

  // Sessions State
  const [sessions, setSessions] = useState([
    {
      id: 'sess-1',
      device: 'Windows 11 PC (Chrome 128)',
      icon: Laptop,
      location: 'Mumbai, Maharashtra, India',
      ip: '103.21.244.18',
      lastActive: 'Active now (Current Session)',
      isCurrent: true
    },
    {
      id: 'sess-2',
      device: 'macOS Sonoma (Safari 17.5)',
      icon: Laptop,
      location: 'Bangalore, Karnataka, India',
      ip: '49.37.12.90',
      lastActive: '2 hours ago',
      isCurrent: false
    },
    {
      id: 'sess-3',
      device: 'Apple iPhone 16 Pro (Mobile Safari)',
      icon: Smartphone,
      location: 'Mumbai, Maharashtra, India',
      ip: '103.21.244.82',
      lastActive: 'Yesterday at 8:45 PM',
      isCurrent: false
    }
  ]);

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      showToast('Error', 'Please fill in all password fields.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Mismatch', 'New passwords do not match.', 'error');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast('Password Updated', 'Your account credentials have been securely changed.', 'success');
  };

  const handleRevokeSessions = () => {
    setSessions(sessions.filter(s => s.isCurrent));
    showToast('Sessions Terminated', 'All other logged-in devices have been logged out.', 'info');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ─────────────────────────────────────────────────────────────
          1. PASSWORD
          ───────────────────────────────────────────────────────────── */}
      {subSection === 'password' && (
        <form onSubmit={handleUpdatePassword} className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Change Account Password</h3>
                  <p className="text-xs text-slate-500">
                    Ensure your account is protected with a strong, distinct enterprise password
                  </p>
                </div>
              </div>

              <Button type="submit" variant="primary" size="sm" icon={<Lock className="w-3.5 h-3.5" />}>
                Update Password
              </Button>
            </div>

            <div className="max-w-md space-y-4 pt-6 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Current Password</label>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">New Password</label>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Min 8 characters, numbers & symbols"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Confirm New Password</label>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="text-2xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5"
                >
                  {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPass ? 'Hide passwords' : 'Show passwords'}</span>
                </button>
              </div>

              {/* Password Requirements Checklist */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-2xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>Minimum 8 characters length</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>Includes numbers (0-9) and special character</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>Not identical to previous 3 passwords</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. TWO-FACTOR AUTHENTICATION
          ───────────────────────────────────────────────────────────── */}
      {subSection === 'two_factor' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Two-Factor Authentication (2FA)</h3>
                  <p className="text-xs text-slate-500">
                    Require a TOTP verification code from Google Authenticator or 1Password when signing in
                  </p>
                </div>
              </div>

              <span className="text-2xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5 self-start sm:self-auto">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                2FA Enabled (TOTP)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Authenticator App Info */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                  <h4 className="text-xs font-bold text-slate-900">Authenticator Application Configured</h4>
                  <p className="text-2xs text-slate-500 leading-relaxed">
                    Time-based one-time passwords (TOTP) are enabled for <strong>viraj@crmpro.io</strong>.
                    Codes refresh every 30 seconds.
                  </p>
                  <div className="pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => showToast('Reconfigure 2FA', 'Scan new QR code in Authenticator.', 'info')}
                    >
                      Re-scan QR Code
                    </Button>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40">
                  <h4 className="text-xs font-bold text-amber-900">Emergency Backup Recovery Codes</h4>
                  <p className="text-2xs text-amber-700 mt-0.5 mb-2.5">
                    10 single-use emergency recovery codes generated on setup. Store them in a secure password vault.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Copy className="w-3.5 h-3.5" />}
                    onClick={() => showToast('Copied', 'Backup codes copied to clipboard.', 'success')}
                  >
                    Copy Backup Codes
                  </Button>
                </div>
              </div>

              {/* Mock QR Card */}
              <div className="p-5 rounded-xl border border-slate-200/90 bg-white flex flex-col items-center justify-center text-center">
                <div className="w-32 h-32 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-3">
                  <QrCode className="w-20 h-20 text-slate-800" />
                </div>
                <span className="text-2xs font-bold text-slate-800 block">Secret Key:</span>
                <code className="text-2xs text-blue-600 font-mono bg-blue-50 px-2 py-0.5 rounded mt-1">
                  JBSWY3DPEHPK3PXP
                </code>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. SESSIONS
          ───────────────────────────────────────────────────────────── */}
      {subSection === 'sessions' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
                  <Laptop className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Active Login Sessions</h3>
                  <p className="text-xs text-slate-500">
                    Devices and authorized client browsers currently signed in to your CRM Pro account
                  </p>
                </div>
              </div>

              {sessions.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  icon={<LogOut className="w-3.5 h-3.5 text-rose-600" />}
                  onClick={handleRevokeSessions}
                >
                  Revoke Other Sessions
                </Button>
              )}
            </div>

            <div className="divide-y divide-slate-100 mt-4">
              {sessions.map(session => {
                const Icon = session.icon;
                return (
                  <div key={session.id} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`p-2.5 rounded-xl border ${
                          session.isCurrent
                            ? 'bg-blue-50 text-blue-600 border-blue-200'
                            : 'bg-slate-50 text-slate-500 border-slate-200'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900">{session.device}</h4>
                          {session.isCurrent && (
                            <span className="text-2xs font-semibold px-2 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Current Device
                            </span>
                          )}
                        </div>
                        <p className="text-2xs text-slate-500 mt-0.5">
                          {session.location} • IP: {session.ip}
                        </p>
                        <span className="text-2xs text-slate-400 mt-0.5 block">{session.lastActive}</span>
                      </div>
                    </div>

                    {!session.isCurrent && (
                      <button
                        onClick={() => {
                          setSessions(sessions.filter(s => s.id !== session.id));
                          showToast('Session Revoked', 'Signed out from device.', 'info');
                        }}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-700"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

