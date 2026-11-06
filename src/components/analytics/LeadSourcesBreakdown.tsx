import React from 'react';
import {
  Globe,
  Share2,
  Users,
  Search,
  Mail,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Percent
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { useCRM } from '../../context/CRMContext';

interface LeadSourcesBreakdownProps {
  dateRange: 'today' | '7days' | '30days' | '3months' | '1year';
}

interface SourceStat {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  leadsCount: number;
  percentage: number;
  pipelineValue: number; // in Rupees
  conversionRate: number; // in %
  avgDealSize: number; // in Rupees
  iconBg: string;
  iconColor: string;
  barColor: string;
}

export const LeadSourcesBreakdown: React.FC<LeadSourcesBreakdownProps> = ({ dateRange }) => {
  // Dynamic metrics per date filter for the exact 6 required sources
  const dataMap: Record<'today' | '7days' | '30days' | '3months' | '1year', SourceStat[]> = {
    today: [
      {
        id: 'website',
        name: 'Website',
        icon: Globe,
        leadsCount: 26,
        percentage: 35.1,
        pipelineValue: 320000,
        conversionRate: 28.5,
        avgDealSize: 125000,
        iconBg: 'bg-blue-50 border-blue-200',
        iconColor: 'text-blue-600',
        barColor: 'bg-blue-600'
      },
      {
        id: 'linkedin',
        name: 'LinkedIn',
        icon: Share2,
        leadsCount: 18,
        percentage: 24.3,
        pipelineValue: 245000,
        conversionRate: 25.0,
        avgDealSize: 160000,
        iconBg: 'bg-sky-50 border-sky-200',
        iconColor: 'text-sky-600',
        barColor: 'bg-sky-500'
      },
      {
        id: 'referral',
        name: 'Referral',
        icon: Users,
        leadsCount: 12,
        percentage: 16.2,
        pipelineValue: 190000,
        conversionRate: 38.2,
        avgDealSize: 185000,
        iconBg: 'bg-emerald-50 border-emerald-200',
        iconColor: 'text-emerald-600',
        barColor: 'bg-emerald-500'
      },
      {
        id: 'google_ads',
        name: 'Google Ads',
        icon: Search,
        leadsCount: 9,
        percentage: 12.2,
        pipelineValue: 135000,
        conversionRate: 18.4,
        avgDealSize: 110000,
        iconBg: 'bg-amber-50 border-amber-200',
        iconColor: 'text-amber-600',
        barColor: 'bg-amber-500'
      },
      {
        id: 'email',
        name: 'Email',
        icon: Mail,
        leadsCount: 6,
        percentage: 8.1,
        pipelineValue: 95000,
        conversionRate: 21.0,
        avgDealSize: 140000,
        iconBg: 'bg-purple-50 border-purple-200',
        iconColor: 'text-purple-600',
        barColor: 'bg-purple-500'
      },
      {
        id: 'other',
        name: 'Other',
        icon: Layers,
        leadsCount: 3,
        percentage: 4.1,
        pipelineValue: 45000,
        conversionRate: 14.5,
        avgDealSize: 90000,
        iconBg: 'bg-slate-100 border-slate-200',
        iconColor: 'text-slate-600',
        barColor: 'bg-slate-500'
      }
    ],
    '7days': [
      {
        id: 'website',
        name: 'Website',
        icon: Globe,
        leadsCount: 78,
        percentage: 35.5,
        pipelineValue: 1120000,
        conversionRate: 29.1,
        avgDealSize: 130000,
        iconBg: 'bg-blue-50 border-blue-200',
        iconColor: 'text-blue-600',
        barColor: 'bg-blue-600'
      },
      {
        id: 'linkedin',
        name: 'LinkedIn',
        icon: Share2,
        leadsCount: 52,
        percentage: 23.6,
        pipelineValue: 840000,
        conversionRate: 26.4,
        avgDealSize: 165000,
        iconBg: 'bg-sky-50 border-sky-200',
        iconColor: 'text-sky-600',
        barColor: 'bg-sky-500'
      },
      {
        id: 'referral',
        name: 'Referral',
        icon: Users,
        leadsCount: 38,
        percentage: 17.3,
        pipelineValue: 690000,
        conversionRate: 39.5,
        avgDealSize: 195000,
        iconBg: 'bg-emerald-50 border-emerald-200',
        iconColor: 'text-emerald-600',
        barColor: 'bg-emerald-500'
      },
      {
        id: 'google_ads',
        name: 'Google Ads',
        icon: Search,
        leadsCount: 26,
        percentage: 11.8,
        pipelineValue: 460000,
        conversionRate: 19.2,
        avgDealSize: 115000,
        iconBg: 'bg-amber-50 border-amber-200',
        iconColor: 'text-amber-600',
        barColor: 'bg-amber-500'
      },
      {
        id: 'email',
        name: 'Email',
        icon: Mail,
        leadsCount: 16,
        percentage: 7.3,
        pipelineValue: 310000,
        conversionRate: 22.4,
        avgDealSize: 145000,
        iconBg: 'bg-purple-50 border-purple-200',
        iconColor: 'text-purple-600',
        barColor: 'bg-purple-500'
      },
      {
        id: 'other',
        name: 'Other',
        icon: Layers,
        leadsCount: 10,
        percentage: 4.5,
        pipelineValue: 180000,
        conversionRate: 15.0,
        avgDealSize: 95000,
        iconBg: 'bg-slate-100 border-slate-200',
        iconColor: 'text-slate-600',
        barColor: 'bg-slate-500'
      }
    ],
    '30days': [
      {
        id: 'website',
        name: 'Website',
        icon: Globe,
        leadsCount: 428,
        percentage: 34.3,
        pipelineValue: 4680000,
        conversionRate: 31.2,
        avgDealSize: 145000,
        iconBg: 'bg-blue-50 border-blue-200',
        iconColor: 'text-blue-600',
        barColor: 'bg-blue-600'
      },
      {
        id: 'linkedin',
        name: 'LinkedIn',
        icon: Share2,
        leadsCount: 296,
        percentage: 23.7,
        pipelineValue: 3520000,
        conversionRate: 27.8,
        avgDealSize: 172000,
        iconBg: 'bg-sky-50 border-sky-200',
        iconColor: 'text-sky-600',
        barColor: 'bg-sky-500'
      },
      {
        id: 'referral',
        name: 'Referral',
        icon: Users,
        leadsCount: 215,
        percentage: 17.2,
        pipelineValue: 2890000,
        conversionRate: 41.5,
        avgDealSize: 210000,
        iconBg: 'bg-emerald-50 border-emerald-200',
        iconColor: 'text-emerald-600',
        barColor: 'bg-emerald-500'
      },
      {
        id: 'google_ads',
        name: 'Google Ads',
        icon: Search,
        leadsCount: 152,
        percentage: 12.2,
        pipelineValue: 1980000,
        conversionRate: 20.4,
        avgDealSize: 120000,
        iconBg: 'bg-amber-50 border-amber-200',
        iconColor: 'text-amber-600',
        barColor: 'bg-amber-500'
      },
      {
        id: 'email',
        name: 'Email',
        icon: Mail,
        leadsCount: 98,
        percentage: 7.9,
        pipelineValue: 1350000,
        conversionRate: 23.8,
        avgDealSize: 150000,
        iconBg: 'bg-purple-50 border-purple-200',
        iconColor: 'text-purple-600',
        barColor: 'bg-purple-500'
      },
      {
        id: 'other',
        name: 'Other',
        icon: Layers,
        leadsCount: 59,
        percentage: 4.7,
        pipelineValue: 820000,
        conversionRate: 16.2,
        avgDealSize: 105000,
        iconBg: 'bg-slate-100 border-slate-200',
        iconColor: 'text-slate-600',
        barColor: 'bg-slate-500'
      }
    ],
    '3months': [
      {
        id: 'website',
        name: 'Website',
        icon: Globe,
        leadsCount: 1180,
        percentage: 34.6,
        pipelineValue: 13200000,
        conversionRate: 31.8,
        avgDealSize: 148000,
        iconBg: 'bg-blue-50 border-blue-200',
        iconColor: 'text-blue-600',
        barColor: 'bg-blue-600'
      },
      {
        id: 'linkedin',
        name: 'LinkedIn',
        icon: Share2,
        leadsCount: 810,
        percentage: 23.8,
        pipelineValue: 9800000,
        conversionRate: 28.3,
        avgDealSize: 175000,
        iconBg: 'bg-sky-50 border-sky-200',
        iconColor: 'text-sky-600',
        barColor: 'bg-sky-500'
      },
      {
        id: 'referral',
        name: 'Referral',
        icon: Users,
        leadsCount: 590,
        percentage: 17.3,
        pipelineValue: 8100000,
        conversionRate: 42.1,
        avgDealSize: 215000,
        iconBg: 'bg-emerald-50 border-emerald-200',
        iconColor: 'text-emerald-600',
        barColor: 'bg-emerald-500'
      },
      {
        id: 'google_ads',
        name: 'Google Ads',
        icon: Search,
        leadsCount: 415,
        percentage: 12.2,
        pipelineValue: 5400000,
        conversionRate: 21.0,
        avgDealSize: 122000,
        iconBg: 'bg-amber-50 border-amber-200',
        iconColor: 'text-amber-600',
        barColor: 'bg-amber-500'
      },
      {
        id: 'email',
        name: 'Email',
        icon: Mail,
        leadsCount: 265,
        percentage: 7.8,
        pipelineValue: 3750000,
        conversionRate: 24.2,
        avgDealSize: 152000,
        iconBg: 'bg-purple-50 border-purple-200',
        iconColor: 'text-purple-600',
        barColor: 'bg-purple-500'
      },
      {
        id: 'other',
        name: 'Other',
        icon: Layers,
        leadsCount: 150,
        percentage: 4.3,
        pipelineValue: 2100000,
        conversionRate: 16.8,
        avgDealSize: 108000,
        iconBg: 'bg-slate-100 border-slate-200',
        iconColor: 'text-slate-600',
        barColor: 'bg-slate-500'
      }
    ],
    '1year': [
      {
        id: 'website',
        name: 'Website',
        icon: Globe,
        leadsCount: 4520,
        percentage: 34.9,
        pipelineValue: 51200000,
        conversionRate: 32.5,
        avgDealSize: 152000,
        iconBg: 'bg-blue-50 border-blue-200',
        iconColor: 'text-blue-600',
        barColor: 'bg-blue-600'
      },
      {
        id: 'linkedin',
        name: 'LinkedIn',
        icon: Share2,
        leadsCount: 3080,
        percentage: 23.8,
        pipelineValue: 38400000,
        conversionRate: 29.1,
        avgDealSize: 180000,
        iconBg: 'bg-sky-50 border-sky-200',
        iconColor: 'text-sky-600',
        barColor: 'bg-sky-500'
      },
      {
        id: 'referral',
        name: 'Referral',
        icon: Users,
        leadsCount: 2240,
        percentage: 17.3,
        pipelineValue: 31500000,
        conversionRate: 43.0,
        avgDealSize: 220000,
        iconBg: 'bg-emerald-50 border-emerald-200',
        iconColor: 'text-emerald-600',
        barColor: 'bg-emerald-500'
      },
      {
        id: 'google_ads',
        name: 'Google Ads',
        icon: Search,
        leadsCount: 1560,
        percentage: 12.0,
        pipelineValue: 20800000,
        conversionRate: 21.5,
        avgDealSize: 125000,
        iconBg: 'bg-amber-50 border-amber-200',
        iconColor: 'text-amber-600',
        barColor: 'bg-amber-500'
      },
      {
        id: 'email',
        name: 'Email',
        icon: Mail,
        leadsCount: 1020,
        percentage: 7.9,
        pipelineValue: 14700000,
        conversionRate: 24.8,
        avgDealSize: 155000,
        iconBg: 'bg-purple-50 border-purple-200',
        iconColor: 'text-purple-600',
        barColor: 'bg-purple-500'
      },
      {
        id: 'other',
        name: 'Other',
        icon: Layers,
        leadsCount: 540,
        percentage: 4.1,
        pipelineValue: 7900000,
        conversionRate: 17.2,
        avgDealSize: 110000,
        iconBg: 'bg-slate-100 border-slate-200',
        iconColor: 'text-slate-600',
        barColor: 'bg-slate-500'
      }
    ]
  };

  const { leads } = useCRM();
  const hasLeads = leads.length > 0;

  const rawSources = dataMap[dateRange] || dataMap['30days'];
  const sources = hasLeads
    ? rawSources
    : rawSources.map(s => ({
        ...s,
        leadsCount: 0,
        percentage: 0,
        pipelineValue: 0,
        conversionRate: 0,
        avgDealSize: 0
      }));
  const totalLeads = sources.reduce((sum, s) => sum + s.leadsCount, 0);
  const totalPipeline = sources.reduce((sum, s) => sum + s.pipelineValue, 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-900 tracking-tight">Lead Sources</span>
              <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                6 Channels
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Attribution breakdown & channel conversion ROI</p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400">Total Leads</span>
            <div className="text-sm font-bold text-slate-900">{totalLeads.toLocaleString()}</div>
          </div>
        </div>

        {/* Sources Progress Bars and List */}
        <div className="mt-4 space-y-4">
          {sources.map(source => {
            const Icon = source.icon;
            return (
              <div
                key={source.id}
                className="group p-2.5 rounded-xl transition-all duration-150 hover:bg-slate-50/80 border border-transparent hover:border-slate-100"
              >
                {/* Top Row: Name, count, percentage */}
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${source.iconBg}`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${source.iconColor}`} />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-800">{source.name}</span>
                      <span className="text-2xs text-slate-400 ml-2">
                        {source.conversionRate}% conv. rate
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-right">
                    <span className="text-xs font-bold text-slate-900">
                      {source.leadsCount.toLocaleString()}{' '}
                      <span className="text-2xs font-normal text-slate-400">leads</span>
                    </span>
                    <span className="text-2xs font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-md min-w-[42px] text-center">
                      {source.percentage}%
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${source.barColor}`}
                    style={{ width: `${source.percentage}%` }}
                  />
                </div>

                {/* Secondary Row: Pipeline value & avg deal */}
                <div className="flex items-center justify-between mt-1 text-2xs text-slate-500">
                  <span>
                    Pipeline:{' '}
                    <span className="font-semibold text-slate-700">
                      {formatCurrency(source.pipelineValue)}
                    </span>
                  </span>
                  <span>
                    Avg Deal:{' '}
                    <span className="font-semibold text-slate-700">
                      {formatCurrency(source.avgDealSize)}
                    </span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Summary Banner */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-2xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          <span>
            Highest ROI:{' '}
            <strong className="text-slate-800 font-semibold">Referral (41.5% conv.)</strong>
          </span>
        </div>
        <div>
          Total Pipeline:{' '}
          <strong className="text-slate-900 font-bold">{formatCurrency(totalPipeline)}</strong>
        </div>
      </div>
    </div>
  );
};

