import React, { useState } from 'react';
import {
  TrendingUp,
  ArrowRight,
  Sparkles,
  Play,
  LayoutDashboard,
  BarChart3,
  Users,
  Briefcase,
  Calendar,
  CheckSquare,
  ShieldCheck,
  DollarSign,
  Layers,
  Globe,
  Star,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Lock,
  Database,
  Zap,
  CheckCircle2,
  Clock,
  Laptop,
  Smartphone,
  Sliders,
  Send,
  HelpCircle,
  Menu,
  X
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

interface LandingPageProps {
  onGetStarted: () => void;
  onViewDemo: () => void;
  onSignIn?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onViewDemo,
  onSignIn = onGetStarted
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactCompany, setContactCompany] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isContactSubmitted, setIsContactSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail) return;
    setIsContactSubmitted(true);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* ─────────────────────────────────────────────────────────────
          1. STICKY TOP NAVIGATION BAR
          ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold tracking-tight text-slate-900">CRM Pro</span>
              <span className="text-2xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 hidden sm:inline-block">
                SaaS v2.0
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#pipeline" className="hover:text-blue-600 transition-colors">Sales Pipeline</a>
            <a href="#leads" className="hover:text-blue-600 transition-colors">Lead Management</a>
            <a href="#analytics" className="hover:text-blue-600 transition-colors">Analytics</a>
            <a href="#tasks" className="hover:text-blue-600 transition-colors">Tasks</a>
            <a href="#testimonials" className="hover:text-blue-600 transition-colors">Testimonials</a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-blue-600 transition-colors">FAQ</a>
            <a href="#contact" className="hover:text-blue-600 transition-colors">Contact</a>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              type="button"
              onClick={onSignIn}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors rounded-xl hover:bg-slate-100"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={onViewDemo}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-all"
            >
              <Play className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
              <span>View Demo</span>
            </button>
            <button
              type="button"
              onClick={onGetStarted}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/25 transition-all"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2">
            <nav className="flex flex-col gap-2.5 text-sm font-semibold text-slate-700">
              <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="px-2 py-1.5 rounded-lg hover:bg-slate-50">Features</a>
              <a href="#pipeline" onClick={() => setIsMobileMenuOpen(false)} className="px-2 py-1.5 rounded-lg hover:bg-slate-50">Sales Pipeline</a>
              <a href="#leads" onClick={() => setIsMobileMenuOpen(false)} className="px-2 py-1.5 rounded-lg hover:bg-slate-50">Lead Management</a>
              <a href="#analytics" onClick={() => setIsMobileMenuOpen(false)} className="px-2 py-1.5 rounded-lg hover:bg-slate-50">Analytics</a>
              <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="px-2 py-1.5 rounded-lg hover:bg-slate-50">Pricing</a>
              <a href="#faq" onClick={() => setIsMobileMenuOpen(false)} className="px-2 py-1.5 rounded-lg hover:bg-slate-50">FAQ</a>
              <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="px-2 py-1.5 rounded-lg hover:bg-slate-50">Contact</a>
            </nav>
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onViewDemo();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl bg-slate-900 text-white"
              >
                <Play className="w-3.5 h-3.5 fill-blue-400 text-blue-400" />
                <span>Launch Live Demo</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onGetStarted();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl bg-blue-600 text-white"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. HERO SECTION
          ───────────────────────────────────────────────────────────── */}
      <section className="relative pt-16 pb-20 overflow-hidden text-center">
        {/* Subtle Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-400/15 via-indigo-400/10 to-transparent blur-3xl pointer-events-none -z-10 rounded-full" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Next-Generation Commercial B2B CRM Platform</span>
          </div>

          {/* Main Brand Title & Tagline */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              CRM Pro
            </h1>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-blue-600 tracking-tight">
              Manage leads. Close deals. Grow your business.
            </p>
          </div>

          {/* Subtitle */}
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            &ldquo;An all-in-one CRM platform for managing customers, sales pipelines, tasks and business performance.&rdquo;
          </p>

          {/* Buttons: Get Started + View Demo */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              type="button"
              onClick={onGetStarted}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 transition-all transform hover:-translate-y-0.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onViewDemo}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 font-bold text-sm shadow-xs hover:border-slate-400 transition-all transform hover:-translate-y-0.5"
            >
              <Play className="w-4 h-4 text-blue-600 fill-blue-600" />
              <span>View Demo</span>
              <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ml-1">
                Live Data
              </span>
            </button>
          </div>

          {/* Enterprise Metrics Ribbon */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left border-t border-slate-200/80">
            <div className="p-3 bg-white rounded-xl border border-slate-200/70 shadow-2xs">
              <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider block">Active Pipeline</span>
              <span className="text-base font-extrabold text-slate-900">₹83,98,000</span>
              <span className="text-2xs font-medium text-emerald-600 block mt-0.5">+18.4% this month</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200/70 shadow-2xs">
              <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider block">Target Win Rate</span>
              <span className="text-base font-extrabold text-slate-900">24.8%</span>
              <span className="text-2xs font-medium text-blue-600 block mt-0.5">Proposal to Won</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200/70 shadow-2xs">
              <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider block">Architecture</span>
              <span className="text-base font-extrabold text-slate-900">React + Node.js</span>
              <span className="text-2xs font-medium text-slate-500 block mt-0.5">MongoDB + JWT</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200/70 shadow-2xs">
              <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider block">Security & Access</span>
              <span className="text-base font-extrabold text-slate-900">Role-Based RBAC</span>
              <span className="text-2xs font-medium text-emerald-600 block mt-0.5">Admin, Rep, SDR</span>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            3. DASHBOARD PREVIEW / MOCKUP BELOW HERO
            ───────────────────────────────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div
            onClick={onViewDemo}
            className="cursor-pointer group relative rounded-3xl bg-slate-900 p-2 sm:p-3.5 shadow-2xl shadow-slate-900/25 border border-slate-800 transition-all hover:scale-[1.01] duration-300"
          >
            {/* macOS Browser Header Frame */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800/80 mb-2">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/90" />
                <div className="w-3 h-3 rounded-full bg-amber-500/90" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/90" />
              </div>
              <div className="flex items-center gap-2 px-4 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300 text-xs font-mono">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>https://app.crmpro.io/dashboard</span>
              </div>
              <div className="text-2xs font-semibold px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-400/30">
                Click to explore live
              </div>
            </div>

            {/* Dashboard Content Mockup */}
            <div className="bg-[#F8FAFC] rounded-2xl p-4 sm:p-6 text-left space-y-5 overflow-hidden">
              {/* Header inside mockup */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Executive Revenue Dashboard</h3>
                  <p className="text-xs text-slate-500">Live operational overview • 92 active pipeline opportunities</p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-xs">
                  <Play className="w-3 h-3 fill-white" />
                  <span>Interactive Mode</span>
                </div>
              </div>

              {/* Mockup Metric Cards Ribbon */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-2xs font-bold text-slate-400 block uppercase">Sales Revenue</span>
                  <span className="text-lg font-extrabold text-slate-900">₹84,50,000</span>
                  <span className="text-2xs font-semibold text-emerald-600 mt-0.5 block">+18.4% vs target</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-2xs font-bold text-slate-400 block uppercase">Leads Generated</span>
                  <span className="text-lg font-extrabold text-slate-900">1,248</span>
                  <span className="text-2xs font-semibold text-blue-600 mt-0.5 block">68% inbound share</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-2xs font-bold text-slate-400 block uppercase">Active Pipeline</span>
                  <span className="text-lg font-extrabold text-slate-900">₹83,98,000</span>
                  <span className="text-2xs font-semibold text-indigo-600 mt-0.5 block">9 High-value deals</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-2xs font-bold text-slate-400 block uppercase">Lead Conversion</span>
                  <span className="text-lg font-extrabold text-slate-900">24.8%</span>
                  <span className="text-2xs font-semibold text-amber-600 mt-0.5 block">Top quartile velocity</span>
                </div>
              </div>

              {/* Mockup Kanban Preview Strip */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    <span>Visual Deal Pipeline (Live Kanban)</span>
                  </div>
                  <span className="text-slate-400 text-2xs font-semibold">5 Stages Active</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 text-2xs">
                  {/* Card 1 */}
                  <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                    <span className="font-bold text-blue-600 uppercase tracking-wider block text-[10px]">New Lead (10%)</span>
                    <p className="font-semibold text-slate-800 truncate">PixelWorks — 3D Web</p>
                    <p className="font-extrabold text-slate-900">₹4,80,000</p>
                  </div>
                  {/* Card 2 */}
                  <div className="p-2.5 rounded-lg border border-cyan-200 bg-cyan-50/50 space-y-1">
                    <span className="font-bold text-cyan-600 uppercase tracking-wider block text-[10px]">Qualified (40%)</span>
                    <p className="font-semibold text-slate-800 truncate">BrightLabs — Design</p>
                    <p className="font-extrabold text-slate-900">₹6,20,000</p>
                  </div>
                  {/* Card 3 */}
                  <div className="p-2.5 rounded-lg border border-amber-200 bg-amber-50/50 space-y-1">
                    <span className="font-bold text-amber-600 uppercase tracking-wider block text-[10px]">Proposal (65%)</span>
                    <p className="font-semibold text-slate-800 truncate">TechNova — AI Agents</p>
                    <p className="font-extrabold text-slate-900">₹14,50,000</p>
                  </div>
                  {/* Card 4 */}
                  <div className="p-2.5 rounded-lg border border-pink-200 bg-pink-50/50 space-y-1">
                    <span className="font-bold text-pink-600 uppercase tracking-wider block text-[10px]">Negotiation (85%)</span>
                    <p className="font-semibold text-slate-800 truncate">CloudCore — Transit</p>
                    <p className="font-extrabold text-slate-900">₹18,00,000</p>
                  </div>
                  {/* Card 5 */}
                  <div className="p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/50 space-y-1">
                    <span className="font-bold text-emerald-600 uppercase tracking-wider block text-[10px]">Won (100%) 🏆</span>
                    <p className="font-semibold text-slate-800 truncate">Vanguard FinTech</p>
                    <p className="font-extrabold text-slate-900">₹12,48,000</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hover Callout Overlay */}
            <div className="absolute inset-0 bg-blue-600/10 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-3xl">
              <span className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-xl flex items-center gap-2 transform group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>Click to Enter Full Live CRM Application</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. CORE FEATURES SECTION
          ───────────────────────────────────────────────────────────── */}
      <section id="features" className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Enterprise Feature Architecture</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Engineered to Drive High-Velocity Sales Operations
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Every workflow from initial inbound lead capture to commercial contract signing is built with precision, speed, and real-time visibility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-[#F8FAFC] hover:border-blue-300 hover:shadow-sm transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Visual Sales Pipeline</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Intuitive 5-stage drag-and-drop Kanban board with win probabilities, weighted value calculations, stage-duration audit trails, and detail slide-over drawers.
              </p>
              <span className="inline-block text-2xs font-semibold text-blue-600">Drag-and-Drop • Probability Weighting</span>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-[#F8FAFC] hover:border-blue-300 hover:shadow-sm transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Lead Scoring & Management</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Algorithmic 0–100 lead intent scoring, multi-channel attribution (Website, LinkedIn, Referral, Google Ads), bulk reassign, and 1-click deal conversion.
              </p>
              <span className="inline-block text-2xs font-semibold text-cyan-600">0–100 Intent Scoring • CSV Export</span>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-[#F8FAFC] hover:border-blue-300 hover:shadow-sm transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Declarative Recharts Analytics</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Real-time sales revenue area curves, lead source double-bar charts, stage donut distribution, quota attainment gauges, and rep leaderboards with live engine switcher.
              </p>
              <span className="inline-block text-2xs font-semibold text-indigo-600">Recharts + SVG • 5 Date Filters</span>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-[#F8FAFC] hover:border-blue-300 hover:shadow-sm transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <CheckSquare className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Task & Activity Automation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Multi-mode task board (Kanban, List, Calendar), urgency priority tagging, chronological timeline logging (Calls, Emails, Meetings, Notes), and automatic status updates.
              </p>
              <span className="inline-block text-2xs font-semibold text-amber-600">Kanban / List / Calendar • Due Dates</span>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-[#F8FAFC] hover:border-blue-300 hover:shadow-sm transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Calendar & Meeting Scheduler</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Interactive month, week, and day calendars with Google Meet direct link integration, participant tracking, and mobile day-agenda breakdown.
              </p>
              <span className="inline-block text-2xs font-semibold text-emerald-600">Google Meet Links • Agenda Sync</span>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-[#F8FAFC] hover:border-blue-300 hover:shadow-sm transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Enterprise Security & RBAC</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Stateless JWT Bearer token authentication, bcrypt password hashing, and granular role gates (Admin, Manager, Rep, SDR) across backend REST APIs and frontend components.
              </p>
              <span className="inline-block text-2xs font-semibold text-purple-600">JWT Bearer • MongoDB Mongoose</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. DEEP DIVE: SALES PIPELINE
          ───────────────────────────────────────────────────────────── */}
      <section id="pipeline" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Pipeline Velocity</span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Visual Drag-and-Drop Deal Pipeline Built for High-Volume Closing
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Gain instant clarity over your sales funnel. Move opportunities across 5 distinct stages with weighted probabilities, automatic stage duration tracking, and comprehensive commercial deal drawers.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Custom Stage Probabilities</h4>
                    <p className="text-2xs text-slate-500">From New Lead (10%) to Negotiation (85%) and Won (100%), forecast revenue with statistical precision.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Rich Deal Drawers</h4>
                    <p className="text-2xs text-slate-500">Inspect uploaded SOW agreements, contract files, meeting histories, and log notes in one integrated side-sheet.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Mobile-First Stage Tabs</h4>
                    <p className="text-2xs text-slate-500">Advance deals seamlessly on smartphones using dedicated touch-friendly stage pill tabs and advance triggers.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onViewDemo}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all"
                >
                  <span>Explore Deal Pipeline Demo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Pipeline Visual Box */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  <span className="text-xs font-bold text-slate-900">Active Deals in Flight (₹83.98L Total)</span>
                </div>
                <span className="text-2xs font-bold text-slate-400">9 Enterprise Contracts</span>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div>
                    <span className="text-2xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">Proposal (65%)</span>
                    <h4 className="text-xs font-bold text-slate-900 mt-1">TechNova Solutions — AI Knowledge Graph</h4>
                    <p className="text-2xs text-slate-500">Primary Contact: Aarav Singhania (VP of Engineering)</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-slate-900">₹14,50,000</span>
                    <span className="text-2xs text-slate-400 block">Close: Dec 18</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div>
                    <span className="text-2xs font-bold px-2 py-0.5 rounded bg-pink-100 text-pink-800">Negotiation (85%)</span>
                    <h4 className="text-xs font-bold text-slate-900 mt-1">CloudCore Systems — Multi-Cloud Transit Mesh</h4>
                    <p className="text-2xs text-slate-500">Primary Contact: Rohan Malhotra (Head of Cloud)</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-slate-900">₹18,00,000</span>
                    <span className="text-2xs text-slate-400 block">Close: Nov 25</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div>
                    <span className="text-2xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">Won (100%) 🏆</span>
                    <h4 className="text-xs font-bold text-slate-900 mt-1">Vanguard FinTech Labs — Global Expansion</h4>
                    <p className="text-2xs text-slate-500">Signed by: David Sterling (CTO)</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-emerald-700">₹12,48,000</span>
                    <span className="text-2xs text-emerald-600 block">Executed SOW</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. DEEP DIVE: LEAD MANAGEMENT
          ───────────────────────────────────────────────────────────── */}
      <section id="leads" className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Lead Preview Box */}
            <div className="bg-[#F8FAFC] p-5 rounded-3xl border border-slate-200 shadow-md space-y-4 order-2 lg:order-1">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-900">Inbound Leads Attribution & Scoring</span>
                <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Smart Routing
                </span>
              </div>

              <div className="space-y-2.5">
                {[
                  { name: 'Aarav Singhania', company: 'TechNova Solutions', score: 95, src: 'Inbound Demo', val: '₹14.5L', status: 'Qualified' },
                  { name: 'Rohit Verma', company: 'Acme Technologies', score: 92, src: 'Website', val: '₹1.8L', status: 'Proposal' },
                  { name: 'Meera Krishnan', company: 'BrightLabs', score: 88, src: 'LinkedIn', val: '₹6.2L', status: 'Contacted' },
                  { name: 'Rohan Malhotra', company: 'CloudCore Systems', score: 96, src: 'Referral', val: '₹18.0L', status: 'Qualified' }
                ].map((lead, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                        {lead.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900">{lead.name}</h4>
                          <span className="text-2xs font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                            Score: {lead.score}
                          </span>
                        </div>
                        <p className="text-2xs text-slate-500">{lead.company} • Via {lead.src}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-900">{lead.val}</span>
                      <span className="text-2xs text-blue-600 block font-semibold">{lead.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-5 order-1 lg:order-2">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Prospect Intelligence</span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Prioritize High-Intent Leads with Automated Scoring & Multi-Touch Attribution
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Never miss a high-value opportunity. CRM Pro captures and attributes leads across Website, LinkedIn, Referrals, and Google Ads, calculating real-time 0–100 qualification scores to direct your sales reps to the most lucrative prospects.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                  <span className="text-lg font-extrabold text-slate-900">0–100</span>
                  <span className="text-xs font-bold text-slate-800 block mt-0.5">Intent Scoring</span>
                  <p className="text-2xs text-slate-500 mt-1">Weighted by company size, engagement velocity, and budget authority.</p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                  <span className="text-lg font-extrabold text-slate-900">1-Click</span>
                  <span className="text-xs font-bold text-slate-800 block mt-0.5">Opportunity Conversion</span>
                  <p className="text-2xs text-slate-500 mt-1">Transform qualified leads into active pipeline deals with zero data re-entry.</p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onViewDemo}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all"
                >
                  <span>Test Lead Management Live</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. DEEP DIVE: ANALYTICS & RECHARTS
          ───────────────────────────────────────────────────────────── */}
      <section id="analytics" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Business Intelligence</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Executive Analytics & Revenue Forecasting with Recharts
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Track actual revenue against period quota, analyze conversion funnel velocity, and inspect source acquisition distribution with our interactive Recharts engine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                <span>Revenue Attainment</span>
                <span className="text-emerald-600">+18.4%</span>
              </div>
              <div className="text-2xl font-extrabold text-slate-900">₹84,50,000</div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: '84%' }} />
              </div>
              <p className="text-2xs text-slate-500">84% of annual quota attained with 55 days remaining in Q4.</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                <span>Conversion Funnel</span>
                <span className="text-blue-600">24.8% Win</span>
              </div>
              <div className="space-y-1.5 text-2xs font-semibold">
                <div className="flex justify-between text-slate-600"><span>1. Leads Captured</span><span className="font-bold text-slate-900">1,248 (100%)</span></div>
                <div className="flex justify-between text-slate-600"><span>2. Qualified Prospects</span><span className="font-bold text-slate-900">624 (50%)</span></div>
                <div className="flex justify-between text-slate-600"><span>3. Commercial Proposals</span><span className="font-bold text-slate-900">312 (25%)</span></div>
                <div className="flex justify-between text-emerald-700 font-bold"><span>4. Closed Won Deals</span><span>77 (24.8%)</span></div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                <span>Sales Leaderboard</span>
                <span className="text-slate-400">Top Reps</span>
              </div>
              <div className="space-y-2 text-2xs">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>1. Viraj Somani</span>
                  <span className="text-blue-600">₹8.2L</span>
                </div>
                <div className="flex items-center justify-between font-semibold text-slate-700">
                  <span>2. Rahul Mehta</span>
                  <span className="text-slate-900">₹6.7L</span>
                </div>
                <div className="flex items-center justify-between font-semibold text-slate-700">
                  <span>3. Priya Sharma</span>
                  <span className="text-slate-900">₹5.9L</span>
                </div>
              </div>
              <p className="text-2xs text-slate-400 pt-1 border-t border-slate-100">Live leaderboards updated across closed-won contracts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. DEEP DIVE: TASK MANAGEMENT
          ───────────────────────────────────────────────────────────── */}
      <section id="tasks" className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Execution Discipline</span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Keep Deals Moving with Integrated Task & Activity Tracking
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Connect tasks directly to deals, accounts, and contacts. Switch seamlessly between Kanban, List, and Calendar views to prioritize urgent deliverables and ensure no customer touchpoint falls through the cracks.
              </p>

              <div className="space-y-2.5 pt-2 text-xs">
                <div className="p-3 rounded-xl border border-rose-200 bg-rose-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    <div>
                      <p className="font-bold text-slate-900">Finalize Enterprise AI Architecture for TechNova</p>
                      <span className="text-2xs text-slate-500">Assigned to Viraj Somani • Due Nov 06</span>
                    </div>
                  </div>
                  <span className="text-2xs font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-700">Urgent</span>
                </div>

                <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <div>
                      <p className="font-bold text-slate-900">Review UI/UX Design System Library with BrightLabs</p>
                      <span className="text-2xs text-slate-500">Assigned to Maya Patel • Due Nov 07</span>
                    </div>
                  </div>
                  <span className="text-2xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-700">High</span>
                </div>

                <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <div>
                      <p className="font-bold text-slate-900 line-through text-slate-500">Customer Onboarding Kickoff: Vanguard FinTech Labs</p>
                      <span className="text-2xs text-slate-400">Completed on Oct 29</span>
                    </div>
                  </div>
                  <span className="text-2xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">Done</span>
                </div>
              </div>
            </div>

            {/* Calendar & Activities Preview */}
            <div className="bg-[#F8FAFC] p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-900">Upcoming Client Google Meet Schedule</span>
                <span className="text-2xs font-bold text-blue-600">3 Sessions Today</span>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-900">Acme Technologies — SOW Signoff</span>
                    <span className="text-blue-600">10:00 AM</span>
                  </div>
                  <p className="text-2xs text-slate-500">Attendees: Rohit Verma, Viraj Somani</p>
                  <a
                    href="https://meet.google.com/acme-tech-portal"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-2xs font-semibold text-emerald-600 hover:text-emerald-700"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>meet.google.com/acme-tech-portal</span>
                  </a>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-900">CloudCore Systems — Multi-Cloud Transit Demo</span>
                    <span className="text-blue-600">02:00 PM</span>
                  </div>
                  <p className="text-2xs text-slate-500">Attendees: Rohan Malhotra, Viraj Somani</p>
                  <a
                    href="https://meet.google.com/cloudcore-peering-demo"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-2xs font-semibold text-emerald-600 hover:text-emerald-700"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>meet.google.com/cloudcore-peering-demo</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          9. TESTIMONIALS SECTION
          ───────────────────────────────────────────────────────────── */}
      <section id="testimonials" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Customer Endorsements</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Trusted by High-Velocity Engineering & Sales Leaders
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Discover how modern commercial sales organizations scale their revenue operations using CRM Pro.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Testimonial 1 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  &ldquo;CRM Pro gave our engineering consultancy complete pipeline visibility. The Kanban stage tracking and clean UI shortened our sales cycle by 35%.&rdquo;
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                  AS
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Aarav Singhania</h4>
                  <p className="text-2xs text-slate-500">VP of Engineering, TechNova Solutions</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  &ldquo;The best CRM software we have ever evaluated. The attention to typography, micro-interactions, and instant loading states makes it a pure joy to use.&rdquo;
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-cyan-100 text-cyan-700 font-bold text-xs flex items-center justify-center">
                  RV
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Rohit Verma</h4>
                  <p className="text-2xs text-slate-500">Head of Digital, Acme Technologies</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  &ldquo;Having realistic Indian and international enterprise data out of the box makes presenting to board members and clients effortless.&rdquo;
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center">
                  MK
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Meera Krishnan</h4>
                  <p className="text-2xs text-slate-500">Chief Design Officer, BrightLabs</p>
                </div>
              </div>
            </div>

            {/* Testimonial 4 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  &ldquo;Rock solid architecture. The dual MongoDB and offline-resilient failover layer guarantees 100% uptime for our global payment teams.&rdquo;
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center">
                  DS
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">David Sterling</h4>
                  <p className="text-2xs text-slate-500">Chief Technology Officer, Vanguard FinTech</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          10. PRICING SECTION
          ───────────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Transparent Pricing</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Predictable Plans for Ambitious Sales Organizations
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Start with our full-featured sandbox demo or scale to unlimited seats with dedicated MongoDB clustering.
            </p>

            {/* Annual / Monthly Toggle */}
            <div className="pt-4 flex items-center justify-center gap-3">
              <span className={`text-xs font-bold ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-500'}`}>
                Monthly Billing
              </span>
              <button
                type="button"
                onClick={() => setBillingCycle(billingCycle === 'annual' ? 'monthly' : 'annual')}
                className="w-12 h-6 rounded-full bg-blue-600 p-0.5 transition-colors relative"
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
              <div className="flex items-center gap-1.5">
                <span className={`text-xs font-bold ${billingCycle === 'annual' ? 'text-slate-900' : 'text-slate-500'}`}>
                  Annual Billing
                </span>
                <span className="text-2xs font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Save 20%
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Plan 1: Starter */}
            <div className="p-7 rounded-3xl border border-slate-200 bg-[#F8FAFC] flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Starter</h3>
                  <p className="text-xs text-slate-500 mt-1">For solo entrepreneurs, SDRs, and boutique agencies.</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-slate-900">
                    {billingCycle === 'annual' ? '₹1,199' : '₹1,499'}
                  </span>
                  <span className="text-xs font-medium text-slate-500">/ user / month</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-600 pt-3 border-t border-slate-200">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Up to 1,000 active contacts</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Drag-and-drop Kanban pipeline</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Standard task management</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Email & Google Meet links</li>
                </ul>
              </div>
              <button
                type="button"
                onClick={onGetStarted}
                className="w-full py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-slate-900 font-bold text-xs transition-colors"
              >
                Start 14-Day Free Trial
              </button>
            </div>

            {/* Plan 2: Professional (Featured) */}
            <div className="relative p-7 rounded-3xl border-2 border-blue-600 bg-white shadow-xl shadow-blue-500/10 flex flex-col justify-between space-y-6">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-blue-600 text-white font-extrabold text-2xs uppercase tracking-wider shadow-sm">
                Most Popular for Teams
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Professional</h3>
                  <p className="text-xs text-slate-500 mt-1">For scaling B2B sales teams needing advanced analytics & RBAC.</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">
                    {billingCycle === 'annual' ? '₹3,999' : '₹4,999'}
                  </span>
                  <span className="text-xs font-medium text-slate-500">/ user / month</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-700 pt-3 border-t border-slate-100 font-medium">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Unlimited leads & contacts</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Full Recharts Analytics Engine</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Role-Based Access Control (RBAC)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Automated Lead Scoring (0–100)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> 1-Click CSV/JSON Data Exports</li>
                </ul>
              </div>
              <button
                type="button"
                onClick={onGetStarted}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all"
              >
                Get Started with Professional
              </button>
            </div>

            {/* Plan 3: Enterprise */}
            <div className="p-7 rounded-3xl border border-slate-200 bg-[#F8FAFC] flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Enterprise</h3>
                  <p className="text-xs text-slate-500 mt-1">For large sales organizations with custom compliance & database needs.</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-slate-900">
                    {billingCycle === 'annual' ? '₹11,999' : '₹14,999'}
                  </span>
                  <span className="text-xs font-medium text-slate-500">/ user / month</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-600 pt-3 border-t border-slate-200">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Dedicated MongoDB Replica Cluster</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Custom REST API & Webhook streaming</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> SOC-2 Type II & HIPAA audit reports</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> 99.99% Uptime Guarantee & SLA</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> 24/7 Dedicated Solutions Engineer</li>
                </ul>
              </div>
              <button
                type="button"
                onClick={onGetStarted}
                className="w-full py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-slate-900 font-bold text-xs transition-colors"
              >
                Contact Enterprise Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          11. FAQ SECTION (ACCORDION)
          ───────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Frequently Asked Questions</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Everything You Need to Know About CRM Pro
            </h2>
            <p className="text-sm text-slate-600">
              Technical architecture, security parameters, demo exploration, and platform capabilities.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'What is the full technology stack powering CRM Pro?',
                a: 'CRM Pro is built with React 18, Vite 6, TypeScript, Tailwind CSS, Lucide React icons, and Recharts on the frontend. The backend runs on Node.js and Express.js with a MongoDB document database connected via Mongoose ODM and secured using stateless JWT Bearer token authentication and bcryptjs password encryption.'
              },
              {
                q: 'Can recruiters or clients try the live application without creating an account?',
                a: 'Yes! Simply click "View Demo" or "Launch Live Demo" anywhere on this page. It immediately logs you in as an administrator (Viraj Somani) with rich, realistic pre-populated Indian and international accounts (TechNova Solutions, Acme Technologies, BrightLabs, CloudCore Systems, PixelWorks, InnovateX) and an active pipeline of ₹83,98,000.'
              },
              {
                q: 'How does Role-Based Access Control (RBAC) work?',
                a: 'CRM Pro implements strict RBAC at both backend route handlers and frontend UI components. Supported roles include Admin, Sales Manager, Account Executive (Rep), and SDR. Sensitive operations (like bulk deleting leads or modifying team roles) are guarded by authorize("admin", "manager") middleware on the Express server and <RoleGate> components in React.'
              },
              {
                q: 'How is data persistence and offline failover handled?',
                a: 'The application employs a dual-layer data architecture: when connected to MongoDB (port 27017), all operations persist to MongoDB collections. In offline or standalone demonstration environments, the system seamlessly falls back to an in-memory repository and browser LocalStorage (v2), guaranteeing 100% uptime with zero crashes.'
              },
              {
                q: 'Is the platform intentionally designed for mobile devices?',
                a: 'Yes. Rather than simply shrinking desktop layouts, CRM Pro features a dedicated three-tier responsive architecture: desktop fixed sidebar, tablet collapsible rail, and a mobile bottom thumb-friendly navigation dock with a center (+) Quick Action FAB, bottom-sheet form modals, and swipeable Kanban stage tabs.'
              },
              {
                q: 'Can I export leads, deals, and reports to CSV or JSON?',
                a: 'Yes. All data tables across Leads, Deals, Contacts, Companies, and Analytics dashboards feature 1-click export functionality to CSV spreadsheets or structured JSON files for external business intelligence integration.'
              }
            ].map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all shadow-2xs"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 hover:text-blue-600 transition-colors"
                  >
                    <span>{item.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-blue-600 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          12. CONTACT & PORTFOLIO INQUIRY SECTION
          ───────────────────────────────────────────────────────────── */}
      <section id="contact" className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Developer Bio & Portfolio Info */}
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Developer Portfolio Project</span>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                  Let&apos;s Build Exceptional Software Together
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed mt-2">
                  This CRM Pro SaaS application was conceived, engineered, and designed by <strong>Viraj Somani</strong> to demonstrate mastery of scalable full-stack React, Node.js, and MongoDB system architecture.
                </p>
              </div>

              {/* Developer Medallion */}
              <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-extrabold text-base flex items-center justify-center shadow-md shadow-blue-500/20">
                    VS
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Viraj Somani</h4>
                    <p className="text-xs text-slate-500">Full-Stack Software Engineer & SaaS Architect</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>Bangalore, Karnataka, India</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <a href="mailto:viraj@crmpro.io" className="text-blue-600 hover:underline font-semibold">
                      viraj@crmpro.io
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <GithubIcon className="w-4 h-4 text-slate-400" />
                    <a href="https://github.com/virajsomani" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-semibold">
                      github.com/virajsomani
                    </a>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-2xs font-semibold">
                  🚀 Available for full-time senior software engineering opportunities and high-impact enterprise SaaS contracts.
                </div>
              </div>
            </div>

            {/* Interactive Contact Form */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#F8FAFC] border border-slate-200 shadow-md space-y-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Send an Inquiry or Schedule Demo</h3>
                <p className="text-xs text-slate-500 mt-1">Get in touch regarding product inquiries, feedback, or developer opportunities.</p>
              </div>

              {isContactSubmitted ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2 animate-in zoom-in-95">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="text-sm font-bold text-emerald-900">Message Delivered Successfully!</h4>
                  <p className="text-xs text-emerald-700">Thank you for reaching out. We will respond within 24 hours.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsContactSubmitted(false);
                      setContactName('');
                      setContactEmail('');
                      setContactMessage('');
                    }}
                    className="mt-3 px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={e => setContactName(e.target.value)}
                      placeholder="e.g. Aarav Singhania"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Work Email *</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={e => setContactEmail(e.target.value)}
                      placeholder="e.g. aarav@technovasolutions.in"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Company / Organization</label>
                    <input
                      type="text"
                      value={contactCompany}
                      onChange={e => setContactCompany(e.target.value)}
                      placeholder="e.g. TechNova Solutions"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Message</label>
                    <textarea
                      rows={3}
                      value={contactMessage}
                      onChange={e => setContactMessage(e.target.value)}
                      placeholder="Discuss custom features, deployment timelines, or hiring inquiries..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          13. FOOTER
          ───────────────────────────────────────────────────────────── */}
      <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8">
            {/* Column 1: CRM Pro */}
            <div className="col-span-2 md:col-span-4 lg:col-span-1 space-y-3">
              <div className="flex items-center gap-2.5 text-white">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
                  <Layers className="w-4 h-4" />
                </div>
                <span className="text-base font-extrabold tracking-tight">CRM Pro</span>
              </div>
              <p className="text-2xs text-slate-400 leading-relaxed">
                Manage leads. Close deals. Grow your business. Commercial SaaS CRM platform.
              </p>
              <div className="flex items-center gap-3 pt-1 text-slate-400">
                <a href="https://github.com/virajsomani" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" title="GitHub">
                  <GithubIcon className="w-4 h-4" />
                </a>
                <a href="mailto:viraj@crmpro.io" className="hover:text-white transition-colors" title="Email">
                  <Mail className="w-4 h-4" />
                </a>
                <a href="#contact" className="hover:text-white transition-colors" title="Contact">
                  <Globe className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Column 2: Product */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">Product</h4>
              <ul className="space-y-1.5 text-2xs">
                <li><a href="#features" className="hover:text-white transition-colors">Overview</a></li>
                <li><a href="#pipeline" className="hover:text-white transition-colors">Deals Pipeline</a></li>
                <li><a href="#leads" className="hover:text-white transition-colors">Lead Scoring</a></li>
                <li><a href="#analytics" className="hover:text-white transition-colors">Analytics Engine</a></li>
                <li><button type="button" onClick={onViewDemo} className="hover:text-white transition-colors text-left">Live Sandbox</button></li>
              </ul>
            </div>

            {/* Column 3: Features */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">Features</h4>
              <ul className="space-y-1.5 text-2xs">
                <li><a href="#pipeline" className="hover:text-white transition-colors">Kanban Drag & Drop</a></li>
                <li><a href="#tasks" className="hover:text-white transition-colors">Task Priority Grid</a></li>
                <li><a href="#tasks" className="hover:text-white transition-colors">Google Meet Sync</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Role-Based RBAC</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Audit Logging</a></li>
              </ul>
            </div>

            {/* Column 4: Pricing */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">Pricing</h4>
              <ul className="space-y-1.5 text-2xs">
                <li><a href="#pricing" className="hover:text-white transition-colors">Starter Plan</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Professional Plan</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Enterprise Tier</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Annual 20% Off</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Custom Quote</a></li>
              </ul>
            </div>

            {/* Column 5: Documentation */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">Documentation</h4>
              <ul className="space-y-1.5 text-2xs">
                <li><a href="#faq" className="hover:text-white transition-colors">REST API Spec</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">MongoDB Models</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">JWT Authentication</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">Design System</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">Offline Failover</a></li>
              </ul>
            </div>

            {/* Column 6: GitHub */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">GitHub</h4>
              <ul className="space-y-1.5 text-2xs">
                <li>
                  <a href="https://github.com/virajsomani" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                    Repository <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </li>
                <li><a href="https://github.com/virajsomani" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Release v2.0</a></li>
                <li><a href="https://github.com/virajsomani" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Pull Requests</a></li>
                <li><a href="https://github.com/virajsomani" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Issue Tracker</a></li>
                <li><a href="https://github.com/virajsomani" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Star on GitHub ⭐</a></li>
              </ul>
            </div>

            {/* Column 7: Contact */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">Contact</h4>
              <ul className="space-y-1.5 text-2xs">
                <li><a href="mailto:viraj@crmpro.io" className="hover:text-white transition-colors">viraj@crmpro.io</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Bengaluru, India</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Schedule Demo</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Inquiry Form</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Portfolio Bio</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright & Tech Stack Ribbon */}
          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-2xs">
            <p>© 2026 CRM Pro. All rights reserved. Architected & developed by Viraj Somani.</p>
            <div className="flex items-center gap-4">
              <span>React 18</span>
              <span>•</span>
              <span>TypeScript</span>
              <span>•</span>
              <span>Tailwind CSS</span>
              <span>•</span>
              <span>Recharts</span>
              <span>•</span>
              <span>Node.js / Express</span>
              <span>•</span>
              <span>MongoDB</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
