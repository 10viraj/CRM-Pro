import React, { useState } from 'react';
import { Target, ArrowUpRight, Users } from 'lucide-react';
import { LeadsBarRechart } from './LeadsBarRechart';
import { useCRM } from '../../context/CRMContext';

interface LeadsBarChartProps {
  dateRange: 'today' | '7days' | '30days' | '3months' | '1year';
}

interface BarDataPoint {
  label: string;
  inbound: number;
  outbound: number;
}

export const LeadsBarChart: React.FC<LeadsBarChartProps> = ({ dateRange }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [chartEngine, setChartEngine] = useState<'recharts' | 'svg'>('recharts');

  const datasets: Record<
    'today' | '7days' | '30days' | '3months' | '1year',
    { bars: BarDataPoint[]; total: number; delta: string }
  > = {
    today: {
      bars: [
        { label: '9 AM', inbound: 4, outbound: 2 },
        { label: '11 AM', inbound: 9, outbound: 5 },
        { label: '1 PM', inbound: 7, outbound: 3 },
        { label: '3 PM', inbound: 12, outbound: 6 },
        { label: '5 PM', inbound: 14, outbound: 4 },
        { label: '7 PM', inbound: 6, outbound: 2 }
      ],
      total: 74,
      delta: '+8.3%'
    },
    '7days': {
      bars: [
        { label: 'Mon', inbound: 24, outbound: 12 },
        { label: 'Tue', inbound: 36, outbound: 18 },
        { label: 'Wed', inbound: 48, outbound: 22 },
        { label: 'Thu', inbound: 42, outbound: 19 },
        { label: 'Fri', inbound: 38, outbound: 16 },
        { label: 'Sat', inbound: 18, outbound: 8 },
        { label: 'Sun', inbound: 14, outbound: 6 }
      ],
      total: 327,
      delta: '+15.2%'
    },
    '30days': {
      bars: [
        { label: 'Week 1', inbound: 180, outbound: 95 },
        { label: 'Week 2', inbound: 240, outbound: 110 },
        { label: 'Week 3', inbound: 295, outbound: 130 },
        { label: 'Week 4', inbound: 345, outbound: 148 }
      ],
      total: 1248,
      delta: '+12.5%'
    },
    '3months': {
      bars: [
        { label: 'Sep', inbound: 780, outbound: 380 },
        { label: 'Oct', inbound: 1040, outbound: 490 },
        { label: 'Nov', inbound: 1248, outbound: 540 }
      ],
      total: 4478,
      delta: '+18.1%'
    },
    '1year': {
      bars: [
        { label: 'Q1', inbound: 2400, outbound: 1200 },
        { label: 'Q2', inbound: 3100, outbound: 1450 },
        { label: 'Q3', inbound: 3850, outbound: 1720 },
        { label: 'Q4', inbound: 4450, outbound: 1920 }
      ],
      total: 20090,
      delta: '+24.6%'
    }
  };

  const { leads } = useCRM();
  const hasLeads = leads.length > 0;

  const currentData = datasets[dateRange];
  const bars = hasLeads ? currentData.bars : currentData.bars.map(b => ({ ...b, inbound: 0, outbound: 0 }));
  const total = hasLeads ? currentData.total : 0;
  const delta = hasLeads ? currentData.delta : '0%';

  const width = 640;
  const height = 220;
  const paddingX = 40;
  const paddingY = 30;

  const maxTotal = Math.max(...bars.map(b => b.inbound + b.outbound)) * 1.18 || 10;
  const barWidth = Math.min(38, (width - paddingX * 2) / (bars.length * 1.6));

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
      {/* Chart Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Leads Generated</h3>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60 flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />
              {delta}
            </span>
            <div className="inline-flex p-0.5 bg-slate-100 rounded-lg border border-slate-200/80 text-[10px]">
              <button
                type="button"
                onClick={() => setChartEngine('recharts')}
                className={`px-2 py-0.5 rounded font-semibold transition-colors ${
                  chartEngine === 'recharts'
                    ? 'bg-white text-blue-600 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Recharts
              </button>
              <button
                type="button"
                onClick={() => setChartEngine('svg')}
                className={`px-2 py-0.5 rounded font-semibold transition-colors ${
                  chartEngine === 'svg'
                    ? 'bg-white text-blue-600 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Custom SVG
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Total marketing prospects acquired across inbound and outbound channels
          </p>
        </div>

        {/* Volume Metric */}
        <div className="text-right">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            New Leads
          </span>
          <span className="text-lg font-extrabold text-slate-900">
            {total.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Visualization Graphic: Recharts or Custom SVG */}
      {chartEngine === 'recharts' ? (
        <div className="mt-4">
          <LeadsBarRechart dateRange={dateRange} isZero={!hasLeads} />
        </div>
      ) : (
        <div className="relative mt-4 w-full">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            <linearGradient id="inboundGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
            <linearGradient id="outboundGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#0891b2" />
            </linearGradient>
          </defs>

          {/* Background Grid Lines */}
          {[0, 0.33, 0.66, 1].map((ratio, idx) => {
            const y = height - paddingY - ratio * (height - paddingY * 2);
            const gridVal = Math.round(ratio * maxTotal);
            return (
              <g key={idx}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 8}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="9"
                  fill="#94a3b8"
                  fontWeight="600"
                >
                  {gridVal}
                </text>
              </g>
            );
          })}

          {/* Render Bars */}
          {bars.map((bar, idx) => {
            const slotWidth = (width - paddingX * 2) / bars.length;
            const slotCenterX = paddingX + slotWidth * idx + slotWidth / 2;

            const inboundH = (bar.inbound / maxTotal) * (height - paddingY * 2);
            const outboundH = (bar.outbound / maxTotal) * (height - paddingY * 2);

            const isHovered = hoveredIdx === idx;

            // Stacked or grouped bars: dual grouped
            const w = barWidth / 2 - 2;
            const inX = slotCenterX - w - 1;
            const outX = slotCenterX + 1;

            const inY = height - paddingY - inboundH;
            const outY = height - paddingY - outboundH;

            return (
              <g
                key={idx}
                className="cursor-pointer transition-all"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Hover Background Column Highlight */}
                {isHovered && (
                  <rect
                    x={slotCenterX - slotWidth / 2 + 4}
                    y={paddingY}
                    width={slotWidth - 8}
                    height={height - paddingY * 2}
                    rx="8"
                    fill="#f8fafc"
                  />
                )}

                {/* Inbound Bar */}
                <rect
                  x={inX}
                  y={inY}
                  width={w}
                  height={inboundH}
                  rx="3"
                  fill="url(#inboundGradient)"
                  className="transition-all duration-200"
                  opacity={isHovered ? 1 : 0.88}
                />

                {/* Outbound Bar */}
                <rect
                  x={outX}
                  y={outY}
                  width={w}
                  height={outboundH}
                  rx="3"
                  fill="url(#outboundGradient)"
                  className="transition-all duration-200"
                  opacity={isHovered ? 1 : 0.88}
                />

                {/* X-axis Label */}
                <text
                  x={slotCenterX}
                  y={height - paddingY + 16}
                  textAnchor="middle"
                  fontSize="10"
                  fill={isHovered ? '#0f172a' : '#64748b'}
                  fontWeight={isHovered ? 'bold' : '600'}
                >
                  {bar.label}
                </text>

                {/* Hover Tooltip */}
                {isHovered && (
                  <g className="transition-all animate-fade-in pointer-events-none">
                    <rect
                      x={slotCenterX - 55}
                      y={Math.min(inY, outY) - 52}
                      width="110"
                      height="44"
                      rx="8"
                      fill="#0f172a"
                      className="shadow-lg"
                    />
                    <text
                      x={slotCenterX}
                      y={Math.min(inY, outY) - 36}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      {bar.inbound + bar.outbound} Total Leads
                    </text>
                    <text
                      x={slotCenterX}
                      y={Math.min(inY, outY) - 22}
                      textAnchor="middle"
                      fill="#93c5fd"
                      fontSize="8"
                      fontWeight="600"
                    >
                      Inbound: {bar.inbound} • Outbound: {bar.outbound}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      )}

      {/* Legend & Channel Ratios */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-blue-600 rounded-sm" />
            <span className="text-slate-600 text-[11px] font-semibold">Inbound Leads</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-cyan-500 rounded-sm" />
            <span className="text-slate-600 text-[11px] font-semibold">Outbound Sourced</span>
          </div>
        </div>

        <span className="text-[11px] text-slate-500 font-medium">
          Inbound Share: <strong className="text-slate-800">68.2%</strong>
        </span>
      </div>
    </div>
  );
};

