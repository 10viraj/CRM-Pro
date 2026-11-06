import React from 'react';
import { Flame } from 'lucide-react';

interface LeadScoreBadgeProps {
  score: number;
}

export const LeadScoreBadge: React.FC<LeadScoreBadgeProps> = ({ score }) => {
  let badgeColor = 'bg-slate-100 text-slate-700 border-slate-200';
  let label = 'Cold';
  let isHot = false;

  if (score >= 85) {
    badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
    label = 'Hot';
    isHot = true;
  } else if (score >= 65) {
    badgeColor = 'bg-amber-50 text-amber-800 border-amber-200';
    label = 'Warm';
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-xs font-semibold ${badgeColor}`}>
      {isHot && <Flame className="w-3 h-3 text-emerald-600 shrink-0" />}
      <span>{score}</span>
      <span className="text-[10px] opacity-75">({label})</span>
    </div>
  );
};

