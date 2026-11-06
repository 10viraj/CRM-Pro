import React, { useState } from 'react';
import { TrendingUp, ArrowUpRight, DollarSign } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { SalesRevenueRechart } from './SalesRevenueRechart';
import { useCRM } from '../../context/CRMContext';

interface RevenueLineChartProps {
  dateRange: 'today' | '7days' | '30days' | '3months' | '1year';
}

interface DataPoint {
  label: string;
  value: number; // in Rupees
  target: number;
}

export const RevenueLineChart: React.FC<RevenueLineChartProps> = ({ dateRange }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [chartEngine, setChartEngine] = useState<'recharts' | 'svg'>('recharts');

  // Dynamic datasets per date filter
  const datasets: Record<
    'today' | '7days' | '30days' | '3months' | '1year',
    { points: DataPoint[]; total: number; target: number; delta: string }
  > = {
    today: {
      points: [
        { label: '9:00 AM', value: 15000, target: 10000 },
        { label: '11:00 AM', value: 45000, target: 35000 },
        { label: '1:00 PM', value: 72000, target: 60000 },
        { label: '3:00 PM', value: 125000, target: 100000 },
        { label: '5:00 PM', value: 160000, target: 140000 },
        { label: '7:00 PM', value: 180000, target: 170000 }
      ],
      total: 180000,
      target: 170000,
      delta: '+5.9%'
    },
    '7days': {
      points: [
        { label: 'Mon', value: 45000, target: 40000 },
        { label: 'Tue', value: 68000, target: 55000 },
        { label: 'Wed', value: 120000, target: 90000 },
        { label: 'Thu', value: 155000, target: 130000 },
        { label: 'Fri', value: 210000, target: 180000 },
        { label: 'Sat', value: 260000, target: 220000 },
        { label: 'Sun', value: 320000, target: 280000 }
      ],
      total: 320000,
      target: 280000,
      delta: '+14.3%'
    },
    '30days': {
      points: [
        { label: 'Week 1', value: 240000, target: 200000 },
        { label: 'Week 2', value: 580000, target: 480000 },
        { label: 'Week 3', value: 890000, target: 780000 },
        { label: 'Week 4', value: 1248000, target: 1050000 }
      ],
      total: 1248000,
      target: 1050000,
      delta: '+18.4%'
    },
    '3months': {
      points: [
        { label: 'September', value: 1080000, target: 950000 },
        { label: 'October', value: 2420000, target: 2100000 },
        { label: 'November (Est)', value: 3820000, target: 3300000 }
      ],
      total: 3820000,
      target: 3300000,
      delta: '+15.8%'
    },
    '1year': {
      points: [
        { label: 'Q1', value: 1850000, target: 1600000 },
        { label: 'Q2', value: 3940000, target: 3400000 },
        { label: 'Q3', value: 6200000, target: 5400000 },
        { label: 'Q4 (Projected)', value: 8450000, target: 7500000 }
      ],
      total: 8450000,
      target: 7500000,
      delta: '+22.6%'
    }
  };

  const { deals } = useCRM();
  const hasDeals = deals.length > 0;

  const currentData = datasets[dateRange];
  const points = hasDeals ? currentData.points : currentData.points.map(p => ({ ...p, value: 0, target: 0 }));
  const total = hasDeals ? currentData.total : 0;
  const target = hasDeals ? currentData.target : 0;
  const delta = hasDeals ? currentData.delta : '0%';

  // Chart dimensions & scaling
  const width = 640;
  const height = 220;
  const paddingX = 45;
  const paddingY = 30;

  const maxValue = Math.max(...points.map(p => p.value), ...points.map(p => p.target)) * 1.15 || 1000;

  const getCoordinates = (index: number, val: number) => {
    const x = paddingX + (index / (points.length - 1)) * (width - paddingX * 2);
    const y = height - paddingY - (val / maxValue) * (height - paddingY * 2);
    return { x, y };
  };

  // Build SVG Path strings
  const revenueCoords = points.map((p, i) => getCoordinates(i, p.value));
  const targetCoords = points.map((p, i) => getCoordinates(i, p.target));

  const pathString = revenueCoords.reduce(
    (acc, curr, i) => (i === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`),
    ''
  );

  const areaString = `${pathString} L ${revenueCoords[revenueCoords.length - 1].x} ${
    height - paddingY
  } L ${revenueCoords[0].x} ${height - paddingY} Z`;

  const targetPathString = targetCoords.reduce(
    (acc, curr, i) => (i === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`),
    ''
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
      {/* Chart Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Sales Revenue</h3>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center gap-0.5">
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
            Closed-won commercial contract volume vs period target
          </p>
        </div>

        {/* Total Key Metrics */}
        <div className="flex items-center gap-4 text-right">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Revenue
            </span>
            <span className="text-lg font-extrabold text-slate-900">
              {formatCurrency(total, true)}
            </span>
          </div>
          <div className="border-l border-slate-100 pl-4 hidden sm:block">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Period Quota
            </span>
            <span className="text-sm font-bold text-slate-600">
              {formatCurrency(target, true)}
            </span>
          </div>
        </div>
      </div>

      {/* Graphic Visualization: Recharts or Custom SVG */}
      {chartEngine === 'recharts' ? (
        <div className="mt-4">
          <SalesRevenueRechart dateRange={dateRange} isZero={!hasDeals} />
        </div>
      ) : (
        <div className="relative mt-4 w-full">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto overflow-visible select-none"
          >
            <defs>
              {/* Area Fill Gradient */}
              <linearGradient id="revenueAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                <stop offset="60%" stopColor="#3b82f6" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
              </linearGradient>

              {/* Target Line Gradient */}
              <linearGradient id="targetLineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#64748b" />
              </linearGradient>
            </defs>

            {/* Horizontal Background Grid Lines */}
            {[0, 0.33, 0.66, 1].map((ratio, idx) => {
              const y = height - paddingY - ratio * (height - paddingY * 2);
              const gridVal = Math.round(ratio * maxValue);
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
                    {formatCurrency(gridVal, true)}
                  </text>
                </g>
              );
            })}

            {/* Target Baseline Dotted Line */}
            <path
              d={targetPathString}
              fill="none"
              stroke="url(#targetLineGradient)"
              strokeWidth="2"
              strokeDasharray="4 4"
              className="opacity-70"
            />

            {/* Area Fill under curve */}
            <path d={areaString} fill="url(#revenueAreaGradient)" />

            {/* Main Revenue Line */}
            <path
              d={pathString}
              fill="none"
              stroke="#2563eb"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data Points / Interaction Nodes */}
            {revenueCoords.map((coord, idx) => {
              const isHovered = hoveredIndex === idx;
              const p = points[idx];
              return (
                <g
                  key={idx}
                  className="cursor-pointer transition-transform"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Outer halo on hover */}
                  {isHovered && (
                    <circle
                      cx={coord.x}
                      cy={coord.y}
                      r="10"
                      fill="#2563eb"
                      className="opacity-20 animate-pulse"
                    />
                  )}

                  {/* Main point */}
                  <circle
                    cx={coord.x}
                    cy={coord.y}
                    r={isHovered ? '6' : '4.5'}
                    fill="#ffffff"
                    stroke="#2563eb"
                    strokeWidth={isHovered ? '3' : '2.5'}
                  />

                  {/* X-axis Label */}
                  <text
                    x={coord.x}
                    y={height - paddingY + 16}
                    textAnchor="middle"
                    fontSize="10"
                    fill={isHovered ? '#0f172a' : '#64748b'}
                    fontWeight={isHovered ? 'bold' : '600'}
                  >
                    {p.label}
                  </text>

                  {/* Active Tooltip Box */}
                  {isHovered && (
                    <g className="transition-all animate-fade-in pointer-events-none">
                      <rect
                        x={coord.x - 55}
                        y={coord.y - 48}
                        width="110"
                        height="38"
                        rx="8"
                        fill="#0f172a"
                        className="shadow-lg"
                      />
                      <text
                        x={coord.x}
                        y={coord.y - 33}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="10"
                        fontWeight="bold"
                      >
                        {formatCurrency(p.value)}
                      </text>
                      <text
                        x={coord.x}
                        y={coord.y - 19}
                        textAnchor="middle"
                        fill="#94a3b8"
                        fontSize="8"
                        fontWeight="600"
                      >
                        Target: {formatCurrency(p.target, true)}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      )}

      {/* Legend & Period Summary */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-blue-600 rounded-full" />
            <span className="text-slate-600 text-[11px] font-semibold">Actual Revenue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-slate-400 rounded-full border-b border-dashed border-slate-400" />
            <span className="text-slate-500 text-[11px] font-medium">Sales Target</span>
          </div>
        </div>

        <span className="text-[11px] text-slate-500 font-medium">
          Quota Attainment: <strong className="text-slate-800">{Math.round((total / target) * 100)}%</strong>
        </span>
      </div>
    </div>
  );
};

