import React, { useState } from 'react';
import {
  User,
  Mail,
  Lock,
  Building,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { AuthScreenType } from '../../types';

interface RegisterScreenProps {
  onNavigate: (screen: AuthScreenType) => void;
  onRegisterSuccess: (email: string, name: string, company: string) => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onNavigate,
  onRegisterSuccess
}) => {
  const [fullName, setFullName] = useState('Viraj Somani');
  const [email, setEmail] = useState('viraj@acmecloud.com');
  const [password, setPassword] = useState('CrmPro2026!Secure');
  const [companyName, setCompanyName] = useState('Acme Cloud Technologies');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onRegisterSuccess(email, fullName, companyName);
    }, 500);
  };

  const handleGoogleSignUp = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onRegisterSuccess('viraj@gmail.com', 'Viraj Somani', 'Acme Cloud');
    }, 500);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header Branding */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/25 mb-1 transition-transform hover:scale-105">
          <svg
            className="w-6 h-6"
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

        <div className="flex items-center justify-center gap-1.5">
          <span className="text-sm font-extrabold text-blue-600 tracking-wider uppercase">CRM Pro</span>
          <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            14-Day Free Trial
          </span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Create Account
        </h1>
        <p className="text-xs text-slate-500">
          Set up your organization workspace and accelerate sales pipeline execution
        </p>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Required: Full name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Full Name
          </label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="e.g. Viraj Somani"
              className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              required
            />
          </div>
        </div>

        {/* Required: Email */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Work Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="viraj@company.com"
              className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              required
            />
          </div>
        </div>

        {/* Required: Company name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Company Name
          </label>
          <div className="relative">
            <Building className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              placeholder="e.g. Acme Technologies Inc."
              className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              required
            />
          </div>
        </div>

        {/* Required: Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Min 8 characters, letters & symbols"
              className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Terms agreement */}
        <div className="pt-1">
          <label className="flex items-start gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={e => setAgreeTerms(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500/20 mt-0.5"
              required
            />
            <span className="text-2xs text-slate-600 leading-relaxed">
              I agree to the CRM Pro{' '}
              <a href="#terms" className="text-blue-600 hover:underline">Terms of Service</a>,{' '}
              <a href="#privacy" className="text-blue-600 hover:underline">Privacy Policy</a>, and Data Protection Addendum.
            </span>
          </label>
        </div>

        {/* Required: Create Account Button */}
        <button
          type="submit"
          disabled={isLoading || !agreeTerms}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative flex items-center justify-center my-3">
        <div className="border-t border-slate-200 w-full" />
        <span className="bg-white px-3 text-2xs font-semibold text-slate-400 uppercase tracking-wider relative">
          Or sign up with
        </span>
      </div>

      {/* Continue with Google */}
      <button
        type="button"
        onClick={handleGoogleSignUp}
        disabled={isLoading}
        className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2.5 hover:border-slate-300"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>Continue with Google</span>
      </button>

      {/* Switch to Login */}
      <div className="text-center pt-2 text-xs text-slate-500">
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => onNavigate('login')}
          className="font-bold text-blue-600 hover:text-blue-700 hover:underline"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

