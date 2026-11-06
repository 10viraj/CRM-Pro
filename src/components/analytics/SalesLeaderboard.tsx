import React from 'react';
import { Award, Trophy, Medal, TrendingUp, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { useCRM } from '../../context/CRMContext';

interface RepPerformance {
  rank: number;
  name: string;
  fullName: string;
  role: string;
  revenue: number; // in Rupees
  revenueDisplay: string;
  quota: number;
  attainment: number;
  dealsWon: number;
  winRate: number;
  initials: string;
  avatarBg: string;
  medalColor?: string;
  badgeBg: string;
}

export const SalesLeaderboard: React.FC = () => {
  const { deals } = useCRM();
  const hasDeals = deals.length > 0;

  // Required Leaderboard:
  // Viraj — ₹8.2L
  // Rahul — ₹6.7L
  // Priya — ₹5.9L
  const defaultLeaderboard: RepPerformance[] = [
    {
      rank: 1,
      name: 'Viraj',
      fullName: 'Viraj Somani',
      role: 'Developer / Admin',
      revenue: 820000,
      revenueDisplay: '₹8.2L',
      quota: 800000,
      attainment: 102.5,
      dealsWon: 18,
      winRate: 82,
      initials: 'VS',
      avatarBg: 'bg-amber-100 text-amber-800 border-amber-300',
      medalColor: 'text-amber-500',
      badgeBg: 'bg-amber-50 text-amber-800 border-amber-200'
    },
    {
      rank: 2,
      name: 'Rahul',
      fullName: 'Rahul Mehta',
      role: 'Senior Account Executive',
      revenue: 670000,
      revenueDisplay: '₹6.7L',
      quota: 800000,
      attainment: 83.8,
      dealsWon: 14,
      winRate: 74,
      initials: 'RM',
      avatarBg: 'bg-slate-200 text-slate-800 border-slate-300',
      medalColor: 'text-slate-400',
      badgeBg: 'bg-slate-100 text-slate-700 border-slate-200'
    },
    {
      rank: 3,
      name: 'Priya',
      fullName: 'Priya Sharma',
      role: 'Account Executive',
      revenue: 590000,
      revenueDisplay: '₹5.9L',
      quota: 800000,
      attainment: 73.8,
      dealsWon: 12,
      winRate: 70,
      initials: 'PS',
      avatarBg: 'bg-orange-100 text-orange-800 border-orange-300',
      medalColor: 'text-amber-700',
      badgeBg: 'bg-orange-50 text-orange-800 border-orange-200'
    },
    {
      rank: 4,
      name: 'Alex',
      fullName: 'Alex Rivera',
      role: 'Account Executive',
      revenue: 480000,
      revenueDisplay: '₹4.8L',
      quota: 800000,
      attainment: 60.0,
      dealsWon: 9,
      winRate: 65,
      initials: 'AR',
      avatarBg: 'bg-blue-100 text-blue-700 border-blue-200',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      rank: 5,
      name: 'Maya',
      fullName: 'Maya Patel',
      role: 'Sales Manager',
      revenue: 420000,
      revenueDisplay: '₹4.2L',
      quota: 800000,
      attainment: 52.5,
      dealsWon: 8,
      winRate: 62,
      initials: 'MP',
      avatarBg: 'bg-purple-100 text-purple-700 border-purple-200',
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200'
    }
  ];

  const leaderboard: RepPerformance[] = hasDeals
    ? defaultLeaderboard
    : defaultLeaderboard.map(rep => ({
        ...rep,
        revenue: 0,
        revenueDisplay: '₹0',
        attainment: 0,
        dealsWon: 0,
        winRate: 0
      }));

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
      {/* Leaderboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Sales Performance</h3>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60">
              Leaderboard
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Individual quota attainment, closed contract volume, and win efficiency
          </p>
        </div>

        <span className="text-[11px] font-semibold text-slate-500">
          Target Quota: <strong>₹8.0L / rep</strong>
        </span>
      </div>

      {/* Top 3 Podium Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {leaderboard.slice(0, 3).map(rep => (
          <div
            key={rep.name}
            className={`p-3.5 rounded-2xl border transition-all ${
              rep.rank === 1
                ? 'bg-amber-50/50 border-amber-200 shadow-2xs ring-1 ring-amber-200/60'
                : 'bg-slate-50/70 border-slate-200/80'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${rep.avatarBg}`}
              >
                {rep.rank === 1 ? '🥇' : rep.rank === 2 ? '🥈' : '🥉'}
              </span>
              <span className="text-xs font-bold text-slate-500">{rep.attainment}% Quota</span>
            </div>

            <h4 className="text-sm font-bold text-slate-900">{rep.fullName}</h4>
            <p className="text-[11px] text-slate-500 truncate">{rep.role}</p>

            <div className="mt-2.5 flex items-baseline justify-between pt-2 border-t border-slate-200/60">
              <span className="text-lg font-extrabold text-slate-900">{rep.revenueDisplay}</span>
              <span className="text-[10px] font-semibold text-slate-500">
                {rep.dealsWon} deals won
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Full Leaderboard Table List */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-2 px-3 w-12 text-center">Rank</th>
              <th className="py-2 px-3">Sales Rep</th>
              <th className="py-2 px-3 w-40">Quota Attainment</th>
              <th className="py-2 px-3 text-right">Revenue</th>
              <th className="py-2 px-3 text-right">Deals</th>
              <th className="py-2 px-3 text-right">Win Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leaderboard.map(rep => (
              <tr key={rep.fullName} className="hover:bg-slate-50/70 transition-colors">
                {/* Rank */}
                <td className="py-2.5 px-3 text-center">
                  <span
                    className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-extrabold ${
                      rep.rank === 1
                        ? 'bg-amber-100 text-amber-800'
                        : rep.rank === 2
                        ? 'bg-slate-200 text-slate-700'
                        : rep.rank === 3
                        ? 'bg-orange-100 text-orange-800'
                        : 'text-slate-500'
                    }`}
                  >
                    #{rep.rank}
                  </span>
                </td>

                {/* Name */}
                <td className="py-2.5 px-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-[10px] border ${rep.avatarBg}`}
                    >
                      {rep.initials}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 leading-tight">
                        {rep.name}{' '}
                        <span className="text-slate-400 font-normal">({rep.fullName.split(' ')[1]})</span>
                      </p>
                      <p className="text-[10px] text-slate-400">{rep.role}</p>
                    </div>
                  </div>
                </td>

                {/* Quota Progress Bar */}
                <td className="py-2.5 px-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          rep.attainment >= 100
                            ? 'bg-emerald-500'
                            : rep.attainment >= 70
                            ? 'bg-blue-600'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${Math.min(rep.attainment, 100)}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-slate-800 w-10 text-right">
                      {rep.attainment}%
                    </span>
                  </div>
                </td>

                {/* Revenue (Bold) */}
                <td className="py-2.5 px-3 text-right">
                  <span className="text-xs font-extrabold text-slate-900">
                    {rep.revenueDisplay}
                  </span>
                </td>

                {/* Deals Won */}
                <td className="py-2.5 px-3 text-right font-semibold text-slate-700">
                  {rep.dealsWon}
                </td>

                {/* Win Rate */}
                <td className="py-2.5 px-3 text-right">
                  <span className="text-emerald-700 bg-emerald-50 border border-emerald-200/60 text-[10px] font-bold px-1.5 py-0.5 rounded">
                    {rep.winRate}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

