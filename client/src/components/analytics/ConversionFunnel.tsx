import React from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  Filter,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  Target
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface ConversionFunnelProps {
  dateRange: 'today' | '7days' | '30days' | '3months' | '1year';
}

interface FunnelStage {
  key: string;
  name: string;
  count: number;
  overallRate: string;
  stepRate: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  subtext: string;
  avgDays: string;
}

export const ConversionFunnel: React.FC<ConversionFunnelProps> = ({ dateRange }) => {
  // Funnel numbers scaled per dateRange
  const funnelData: Record<'today' | '7days' | '30days' | '3months' | '1year', FunnelStage[]> = {
    today: [
      {
        key: 'leads',
        name: 'Leads',
        count: 74,
        overallRate: '100%',
        stepRate: '54.1%',
        color: '#3b82f6',
        bgColor: 'bg-blue-50/70',
        borderColor: 'border-blue-200',
        textColor: 'text-blue-700',
        subtext: 'Prospects captured today',
        avgDays: 'Same day'
      },
      {
        key: 'qualified',
        name: 'Qualified',
        count: 40,
        overallRate: '54.1%',
        stepRate: '45.0%',
        color: '#06b6d4',
        bgColor: 'bg-cyan-50/70',
        borderColor: 'border-cyan-200',
        textColor: 'text-cyan-700',
        subtext: 'BANT vetted by SDR team',
        avgDays: '2.5 hrs'
      },
      {
        key: 'proposal',
        name: 'Proposal',
        count: 18,
        overallRate: '24.3%',
        stepRate: '33.3%',
        color: '#f59e0b',
        bgColor: 'bg-amber-50/70',
        borderColor: 'border-amber-200',
        textColor: 'text-amber-700',
        subtext: 'Quotations & SOWs sent',
        avgDays: '4.8 hrs'
      },
      {
        key: 'won',
        name: 'Won',
        count: 6,
        overallRate: '8.1%',
        stepRate: '33.3%',
        color: '#10b981',
        bgColor: 'bg-emerald-50/70',
        borderColor: 'border-emerald-200',
        textColor: 'text-emerald-700',
        subtext: 'Executed deals closed',
        avgDays: 'Closed today'
      }
    ],
    '7days': [
      {
        key: 'leads',
        name: 'Leads',
        count: 327,
        overallRate: '100%',
        stepRate: '52.6%',
        color: '#3b82f6',
        bgColor: 'bg-blue-50/70',
        borderColor: 'border-blue-200',
        textColor: 'text-blue-700',
        subtext: 'Marketing qualified leads',
        avgDays: '1.2 days'
      },
      {
        key: 'qualified',
        name: 'Qualified',
        count: 172,
        overallRate: '52.6%',
        stepRate: '43.6%',
        color: '#06b6d4',
        bgColor: 'bg-cyan-50/70',
        borderColor: 'border-cyan-200',
        textColor: 'text-cyan-700',
        subtext: 'Discovery calls completed',
        avgDays: '2.4 days'
      },
      {
        key: 'proposal',
        name: 'Proposal',
        count: 75,
        overallRate: '22.9%',
        stepRate: '30.7%',
        color: '#f59e0b',
        bgColor: 'bg-amber-50/70',
        borderColor: 'border-amber-200',
        textColor: 'text-amber-700',
        subtext: 'Proposals reviewed by clients',
        avgDays: '4.1 days'
      },
      {
        key: 'won',
        name: 'Won',
        count: 23,
        overallRate: '7.0%',
        stepRate: '30.7%',
        color: '#10b981',
        bgColor: 'bg-emerald-50/70',
        borderColor: 'border-emerald-200',
        textColor: 'text-emerald-700',
        subtext: 'Contracts countersigned',
        avgDays: '6.8 days'
      }
    ],
    '30days': [
      {
        key: 'leads',
        name: 'Leads',
        count: 1248,
        overallRate: '100%',
        stepRate: '51.3%',
        color: '#3b82f6',
        bgColor: 'bg-blue-50/70',
        borderColor: 'border-blue-200',
        textColor: 'text-blue-700',
        subtext: 'Inbound + outbound prospects',
        avgDays: '2.1 days'
      },
      {
        key: 'qualified',
        name: 'Qualified',
        count: 640,
        overallRate: '51.3%',
        stepRate: '44.4%',
        color: '#06b6d4',
        bgColor: 'bg-cyan-50/70',
        borderColor: 'border-cyan-200',
        textColor: 'text-cyan-700',
        subtext: 'Discovery demo passed',
        avgDays: '5.4 days'
      },
      {
        key: 'proposal',
        name: 'Proposal',
        count: 284,
        overallRate: '22.8%',
        stepRate: '30.3%',
        color: '#f59e0b',
        bgColor: 'bg-amber-50/70',
        borderColor: 'border-amber-200',
        textColor: 'text-amber-700',
        subtext: 'Commercial proposals sent',
        avgDays: '8.2 days'
      },
      {
        key: 'won',
        name: 'Won',
        count: 86,
        overallRate: '6.9%',
        stepRate: '30.3%',
        color: '#10b981',
        bgColor: 'bg-emerald-50/70',
        borderColor: 'border-emerald-200',
        textColor: 'text-emerald-700',
        subtext: 'Closed won paid revenue',
        avgDays: '14.5 days'
      }
    ],
    '3months': [
      {
        key: 'leads',
        name: 'Leads',
        count: 4478,
        overallRate: '100%',
        stepRate: '50.8%',
        color: '#3b82f6',
        bgColor: 'bg-blue-50/70',
        borderColor: 'border-blue-200',
        textColor: 'text-blue-700',
        subtext: 'Quarterly inbound volume',
        avgDays: '2.4 days'
      },
      {
        key: 'qualified',
        name: 'Qualified',
        count: 2275,
        overallRate: '50.8%',
        stepRate: '43.2%',
        color: '#06b6d4',
        bgColor: 'bg-cyan-50/70',
        borderColor: 'border-cyan-200',
        textColor: 'text-cyan-700',
        subtext: 'Opportunity pipeline vetted',
        avgDays: '6.1 days'
      },
      {
        key: 'proposal',
        name: 'Proposal',
        count: 982,
        overallRate: '21.9%',
        stepRate: '29.5%',
        color: '#f59e0b',
        bgColor: 'bg-amber-50/70',
        borderColor: 'border-amber-200',
        textColor: 'text-amber-700',
        subtext: 'Executive quotes delivered',
        avgDays: '9.5 days'
      },
      {
        key: 'won',
        name: 'Won',
        count: 290,
        overallRate: '6.5%',
        stepRate: '29.5%',
        color: '#10b981',
        bgColor: 'bg-emerald-50/70',
        borderColor: 'border-emerald-200',
        textColor: 'text-emerald-700',
        subtext: 'Total closed ARR deals',
        avgDays: '18.2 days'
      }
    ],
    '1year': [
      {
        key: 'leads',
        name: 'Leads',
        count: 20090,
        overallRate: '100%',
        stepRate: '51.1%',
        color: '#3b82f6',
        bgColor: 'bg-blue-50/70',
        borderColor: 'border-blue-200',
        textColor: 'text-blue-700',
        subtext: 'Annual pipeline entrance',
        avgDays: '2.8 days'
      },
      {
        key: 'qualified',
        name: 'Qualified',
        count: 10266,
        overallRate: '51.1%',
        stepRate: '42.8%',
        color: '#06b6d4',
        bgColor: 'bg-cyan-50/70',
        borderColor: 'border-cyan-200',
        textColor: 'text-cyan-700',
        subtext: 'Enterprise prospects passed',
        avgDays: '6.8 days'
      },
      {
        key: 'proposal',
        name: 'Proposal',
        count: 4393,
        overallRate: '21.9%',
        stepRate: '28.9%',
        color: '#f59e0b',
        bgColor: 'bg-amber-50/70',
        borderColor: 'border-amber-200',
        textColor: 'text-amber-700',
        subtext: 'Formal contracts presented',
        avgDays: '11.0 days'
      },
      {
        key: 'won',
        name: 'Won',
        count: 1270,
        overallRate: '6.3%',
        stepRate: '28.9%',
        color: '#10b981',
        bgColor: 'bg-emerald-50/70',
        borderColor: 'border-emerald-200',
        textColor: 'text-emerald-700',
        subtext: 'Commercial customers live',
        avgDays: '22.4 days'
      }
    ]
  };

  const { leads, deals } = useCRM();
  const hasData = leads.length > 0 || deals.length > 0;

  const zeroStages: FunnelStage[] = [
    {
      key: 'leads',
      name: 'Leads',
      count: 0,
      overallRate: '0%',
      stepRate: '0%',
      color: '#3b82f6',
      bgColor: 'bg-blue-50/70',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      subtext: 'Prospects captured',
      avgDays: '-'
    },
    {
      key: 'qualified',
      name: 'Qualified',
      count: 0,
      overallRate: '0%',
      stepRate: '0%',
      color: '#06b6d4',
      bgColor: 'bg-cyan-50/70',
      borderColor: 'border-cyan-200',
      textColor: 'text-cyan-700',
      subtext: 'BANT vetted leads',
      avgDays: '-'
    },
    {
      key: 'proposal',
      name: 'Proposal',
      count: 0,
      overallRate: '0%',
      stepRate: '0%',
      color: '#f59e0b',
      bgColor: 'bg-amber-50/70',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-700',
      subtext: 'Formal proposals',
      avgDays: '-'
    },
    {
      key: 'won',
      name: 'Won',
      count: 0,
      overallRate: '0%',
      stepRate: '0%',
      color: '#10b981',
      bgColor: 'bg-emerald-50/70',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-700',
      subtext: 'Closed won deals',
      avgDays: '-'
    }
  ];

  const stages = hasData ? funnelData[dateRange] : zeroStages;
  const maxCount = stages[0].count || 1;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
      {/* Funnel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Conversion Funnel</h3>
            <span className="text-[11px] font-semibold text-slate-400">
              Leads → Qualified → Proposal → Won
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Stage-by-stage pipeline transition velocity and drop-off analysis
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-lg">
            Proposal-to-Won: <strong>30.3%</strong>
          </span>
        </div>
      </div>

      {/* Visual Funnel Cards Stack */}
      <div className="space-y-3">
        {stages.map((stage, idx) => {
          const widthPercent = Math.max(22, (stage.count / maxCount) * 100);

          return (
            <div key={stage.key} className="space-y-1">
              <div
                className={`p-3.5 rounded-xl border transition-all ${stage.bgColor} ${stage.borderColor} hover:shadow-2xs`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  {/* Left: Stage Title & Subtext */}
                  <div className="flex items-center gap-3">
                    <span
                      className="w-6 h-6 rounded-lg text-white font-bold text-xs flex items-center justify-center shadow-2xs"
                      style={{ backgroundColor: stage.color }}
                    >
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{stage.name}</h4>
                      <p className="text-[11px] text-slate-500">{stage.subtext}</p>
                    </div>
                  </div>

                  {/* Right: Numbers & Conversion % */}
                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <span className="text-xs font-bold text-slate-400 block text-[10px] uppercase">
                        Volume
                      </span>
                      <span className="text-sm font-extrabold text-slate-900">
                        {stage.count.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="border-l border-slate-200/70 pl-3">
                      <span className="text-xs font-bold text-slate-400 block text-[10px] uppercase">
                        Funnel Share
                      </span>
                      <span className={`text-xs font-extrabold ${stage.textColor}`}>
                        {stage.overallRate}
                      </span>
                    </div>

                    <div className="border-l border-slate-200/70 pl-3 hidden md:block">
                      <span className="text-xs font-bold text-slate-400 block text-[10px] uppercase">
                        Avg Time
                      </span>
                      <span className="text-xs font-semibold text-slate-600">
                        {stage.avgDays}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar Representation */}
                <div className="mt-2.5 h-2 w-full bg-slate-200/50 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${widthPercent}%`,
                      backgroundColor: stage.color
                    }}
                  />
                </div>
              </div>

              {/* Conversion Step Pill between stages */}
              {idx < stages.length - 1 && (
                <div className="flex items-center justify-center -my-1 relative z-10">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-[10px] font-bold text-slate-600 shadow-2xs">
                    <span>{stage.stepRate} conversion</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                    <span className="text-slate-400">
                      {(100 - parseFloat(stage.stepRate)).toFixed(1)}% drop
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Funnel Bottom Summary */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Overall Funnel Efficiency: <strong className="text-slate-900">6.9% total lead-to-won</strong></span>
        </div>
        <span className="text-blue-600 font-semibold">
          Avg Sales Cycle: 24 Days
        </span>
      </div>
    </div>
  );
};

