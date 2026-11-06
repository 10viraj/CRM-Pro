import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  delta: string;
  trend: 'up' | 'down' | 'neutral';
  subtext?: string;
  icon: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
  sparklinePoints?: number[];
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  delta,
  trend = 'up',
  subtext = 'vs last period',
  icon,
  iconBg = 'bg-blue-50',
  iconColor = 'text-blue-600',
  sparklinePoints = [20, 28, 25, 35, 32, 42, 48, 45, 55]
}) => {
  const isUp = trend === 'up';
  const isDown = trend === 'down';

  // Calculate SVG sparkline path
  const minVal = Math.min(...sparklinePoints);
  const maxVal = Math.max(...sparklinePoints);
  const range = maxVal - minVal || 1;
  const width = 64;
  const height = 22;

  const points = sparklinePoints.map((val, idx) => {
    const x = (idx / (sparklinePoints.length - 1)) * width;
    const y = height - ((val - minVal) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs hover:shadow-card hover:border-slate-300 transition-all flex flex-col justify-between group">
      {/* Top: Icon + Metric Title */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconBg} ${iconColor} border border-slate-100/80 transition-transform group-hover:scale-105`}>
          {icon}
        </div>
      </div>

      {/* Center: Main Value */}
      <div className="my-2.5">
        <span className="text-2xl sm:text-[26px] font-extrabold tracking-tight text-slate-900 leading-tight">
          {value}
        </span>
      </div>

      {/* Bottom: Trend Indicator + Sparkline */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${
              isUp
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                : isDown
                ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                : 'bg-slate-100 text-slate-700 border border-slate-200/60'
            }`}
          >
            {isUp && <TrendingUp className="w-3 h-3 stroke-[2.5]" />}
            {isDown && <TrendingDown className="w-3 h-3 stroke-[2.5]" />}
            {!isUp && !isDown && <Minus className="w-3 h-3 stroke-[2.5]" />}
            <span>{delta}</span>
          </span>
          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
            {subtext}
          </span>
        </div>

        {/* Mini Sparkline Indicator */}
        <div className="shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
          <svg width={width} height={height} className="overflow-visible">
            <polyline
              fill="none"
              stroke={isUp ? '#10b981' : isDown ? '#f43f5e' : '#64748b'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
