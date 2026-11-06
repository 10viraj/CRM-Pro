import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { LoginScreen } from './LoginScreen';
import { RegisterScreen } from './RegisterScreen';
import { ForgotPasswordScreen } from './ForgotPasswordScreen';
import { ResetPasswordScreen } from './ResetPasswordScreen';
import { EmailVerificationScreen } from './EmailVerificationScreen';
import { AuthScreenType } from '../../types';
import {
  ShieldCheck,
  TrendingUp,
  Award,
  Users,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Zap
} from 'lucide-react';

interface AuthContainerProps {
  initialScreen?: AuthScreenType;
  onEnterApp?: () => void;
  onBackToLanding?: () => void;
}

export const AuthContainer: React.FC<AuthContainerProps> = ({
  initialScreen = 'login',
  onEnterApp,
  onBackToLanding
}) => {
  const { authScreen, setAuthScreen, login, showToast } = useCRM();

  const [currentScreen, setCurrentScreen] = useState<AuthScreenType>(authScreen || initialScreen);
  const [registeredEmail, setRegisteredEmail] = useState('viraj@crmpro.io');

  const handleNavigate = (screen: AuthScreenType) => {
    setCurrentScreen(screen);
    if (setAuthScreen) setAuthScreen(screen);
  };

  const handleLoginSuccess = (email: string) => {
    if (login) login(email);
    showToast('Signed In', `Welcome back to CRM Pro, ${email}!`, 'success');
    if (onEnterApp) onEnterApp();
  };

  const handleRegisterSuccess = (email: string, name: string, company: string) => {
    setRegisteredEmail(email);
    showToast('Account Created', 'Verification code dispatched to your email.', 'info');
    handleNavigate('email_verification');
  };

  const handleVerifySuccess = () => {
    if (login) login(registeredEmail);
    showToast('Email Verified', 'Your CRM Pro account is fully verified. Welcome!', 'success');
    if (onEnterApp) onEnterApp();
  };

  const handleResetSuccess = () => {
    showToast('Password Reset', 'You can now sign in with your new credentials.', 'success');
    handleNavigate('login');
  };

  return (
    <div className="min-h-screen w-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col justify-between overflow-x-hidden font-sans select-none antialiased">
      {/* ─────────────────────────────────────────────────────────────
          TOP SCREEN SWITCHER BAR (Quick inspection of all 5 screens)
          ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white font-bold shadow-xs">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </div>
          <span className="text-xs font-extrabold tracking-tight text-slate-900 hidden sm:inline">
            CRM Pro Auth Portal
          </span>
        </div>

        {/* 5 Screen Switcher Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold overflow-x-auto max-w-full scrollbar-none">
          <button
            onClick={() => handleNavigate('login')}
            className={`px-3 py-1 rounded-lg transition-all ${
              currentScreen === 'login'
                ? 'bg-white text-blue-600 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => handleNavigate('register')}
            className={`px-3 py-1 rounded-lg transition-all ${
              currentScreen === 'register'
                ? 'bg-white text-blue-600 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Register
          </button>
          <button
            onClick={() => handleNavigate('forgot_password')}
            className={`px-3 py-1 rounded-lg transition-all ${
              currentScreen === 'forgot_password'
                ? 'bg-white text-blue-600 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Forgot Password
          </button>
          <button
            onClick={() => handleNavigate('reset_password')}
            className={`px-3 py-1 rounded-lg transition-all ${
              currentScreen === 'reset_password'
                ? 'bg-white text-blue-600 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Reset Password
          </button>
          <button
            onClick={() => handleNavigate('email_verification')}
            className={`px-3 py-1 rounded-lg transition-all ${
              currentScreen === 'email_verification'
                ? 'bg-white text-blue-600 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Email Verification
          </button>
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex items-center gap-2">
          {onBackToLanding && (
            <button
              type="button"
              onClick={onBackToLanding}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors rounded-xl hover:bg-slate-100"
            >
              ← Back to Product
            </button>
          )}
          {onEnterApp && (
            <button
              type="button"
              onClick={onEnterApp}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-colors"
            >
              <span>View Live Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          MAIN CONTENT: SPLIT SCREEN (Form + Enterprise Hero Banner)
          ───────────────────────────────────────────────────────────── */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-5xl bg-white rounded-3xl border border-slate-200/90 shadow-card overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          {/* LEFT: AUTH FORM VIEW (7 Cols on desktop) */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
            {currentScreen === 'login' && (
              <LoginScreen
                onNavigate={handleNavigate}
                onLoginSuccess={handleLoginSuccess}
              />
            )}

            {currentScreen === 'register' && (
              <RegisterScreen
                onNavigate={handleNavigate}
                onRegisterSuccess={handleRegisterSuccess}
              />
            )}

            {currentScreen === 'forgot_password' && (
              <ForgotPasswordScreen
                onNavigate={handleNavigate}
                onSendResetLink={() => {}}
              />
            )}

            {currentScreen === 'reset_password' && (
              <ResetPasswordScreen
                onNavigate={handleNavigate}
                onResetSuccess={handleResetSuccess}
              />
            )}

            {currentScreen === 'email_verification' && (
              <EmailVerificationScreen
                email={registeredEmail}
                onNavigate={handleNavigate}
                onVerifySuccess={handleVerifySuccess}
              />
            )}
          </div>

          {/* RIGHT: ENTERPRISE TESTIMONIAL & TRUST PANEL (5 Cols on desktop) */}
          <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 p-8 text-white flex-col justify-between relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

            {/* Top Brand Statement */}
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-2xs font-extrabold uppercase tracking-widest text-blue-400 bg-blue-950/80 px-2.5 py-1 rounded-full border border-blue-800">
                  Enterprise Sales Operating System
                </span>
              </div>
              <h2 className="text-xl font-extrabold leading-snug tracking-tight text-white">
                Accelerate deals from first touch to closed won in record time.
              </h2>
            </div>

            {/* Center Live Metric Showcase Card */}
            <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-lg space-y-3">
              <div className="flex items-center justify-between text-2xs text-slate-300">
                <span className="font-semibold">Active Sales Velocity</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +26.4% YoY
                </span>
              </div>
              <div className="text-2xl font-extrabold tracking-tight text-white">
                ₹12,48,000 <span className="text-xs font-normal text-slate-400">closed this month</span>
              </div>
              {/* Mini SVG Sparkline */}
              <div className="h-8 w-full flex items-end gap-1.5 pt-1">
                {[35, 45, 40, 60, 55, 75, 85, 90, 110, 130].map((val, idx) => (
                  <div
                    key={idx}
                    className="flex-1 bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-sm opacity-80"
                    style={{ height: `${(val / 130) * 100}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Customer Testimonial */}
            <div className="relative z-10 pt-4 space-y-3 border-t border-white/10">
              <p className="text-xs text-slate-300 italic leading-relaxed">
                &ldquo;CRM Pro gave our sales engineering and executive team complete pipeline clarity.
                Our win rate climbed to 82% within 60 days.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center justify-center border border-amber-500/30">
                  VS
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Viraj Somani</div>
                  <div className="text-2xs text-slate-400">Head of Solutions Engineering</div>
                </div>
              </div>
            </div>

            {/* Bottom Security Badges */}
            <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                SOC2 Type II
              </span>
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-blue-400" />
                256-bit AES
              </span>
              <span>99.99% Uptime SLA</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-2xs text-slate-400">
        CRM Pro Enterprise Suite • Protected by End-to-End SSL Encryption • &copy; 2026 CRM Pro Inc.
      </footer>
    </div>
  );
};

