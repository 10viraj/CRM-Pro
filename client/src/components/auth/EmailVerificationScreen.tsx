import React, { useState, useRef, useEffect } from 'react';
import {
  Mail,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { AuthScreenType } from '../../types';

interface EmailVerificationScreenProps {
  email?: string;
  onNavigate: (screen: AuthScreenType) => void;
  onVerifySuccess: () => void;
}

export const EmailVerificationScreen: React.FC<EmailVerificationScreenProps> = ({
  email = 'viraj@crmpro.io',
  onNavigate,
  onVerifySuccess
}) => {
  const [digits, setDigits] = useState<string[]>(['8', '4', '9', '2', '', '']);
  const [timer, setTimer] = useState(45);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (index: number, val: string) => {
    // Only accept single numeric char
    const clean = val.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = clean;
    setDigits(newDigits);

    // Auto advance focus
    if (clean && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasteData) return;

    const newDigits = [...digits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasteData[i] || '';
    }
    setDigits(newDigits);
    inputRefs.current[Math.min(pasteData.length, 5)]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = digits.join('');
    if (code.length < 6) {
      setError('Please enter all 6 digits of the verification code.');
      return;
    }

    setError('');
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onVerifySuccess();
    }, 600);
  };

  const handleResend = () => {
    setTimer(60);
    setDigits(['8', '4', '9', '2', '0', '1']);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header Branding */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 border border-purple-200/60 shadow-xs mb-1">
          <Mail className="w-6 h-6" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Email Verification
        </h1>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          We sent a 6-digit confirmation code to{' '}
          <strong className="text-slate-800 font-bold">{email}</strong>
        </p>
      </div>

      {/* Demo helper */}
      <div className="p-2.5 rounded-xl bg-purple-50/70 border border-purple-100 flex items-center justify-between text-2xs text-purple-700">
        <div className="flex items-center gap-1.5 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0" />
          <span>Demo Verification Code: <strong>849201</strong></span>
        </div>
        <button
          type="button"
          onClick={() => setDigits(['8', '4', '9', '2', '0', '1'])}
          className="font-bold text-purple-700 hover:text-purple-900 underline"
        >
          Fill Code
        </button>
      </div>

      {/* Verification Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-2xs text-rose-700 font-semibold text-center">
            {error}
          </div>
        )}

        {/* 6-box segmented OTP inputs */}
        <div className="flex items-center justify-center gap-2 sm:gap-2.5" onPaste={handlePaste}>
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={el => (inputRefs.current[idx] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(idx, e.target.value)}
              onKeyDown={e => handleKeyDown(idx, e)}
              className="w-11 h-12 text-center text-lg font-extrabold rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-2xs transition-all"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={isVerifying}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isVerifying ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>Verify Email</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      {/* Resend Code Section */}
      <div className="text-center space-y-2 text-xs">
        <p className="text-slate-500">
          Didn&apos;t receive the email?{' '}
          {timer > 0 ? (
            <span className="font-semibold text-slate-400">Resend in {timer}s</span>
          ) : (
            <button
              onClick={handleResend}
              className="font-bold text-blue-600 hover:text-blue-700 hover:underline"
            >
              Resend Code
            </button>
          )}
        </p>

        <div>
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="inline-flex items-center gap-1.5 text-2xs font-semibold text-slate-400 hover:text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Return to Sign In</span>
          </button>
        </div>
      </div>
    </div>
  );
};

