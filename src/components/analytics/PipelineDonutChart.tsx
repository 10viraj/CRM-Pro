import React, { useState, useMemo } from 'react';
import { PieChart, Briefcase } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { PipelineDonutRechart } from './PipelineDonutRechart';
import { useCRM } from '../../context/CRMContext';

interface PipelineDonutChartProps {
  dateRange: 'today' | '7days' | '30days' | '3months' | '1year';
}

interface StageSegment {
  name: string;
  dealsCount: number;
  value: number; // in Rupees
  percentage: number;
  color: string;
}

export const PipelineDonutChart: React.FC<PipelineDonutChartProps> = ({ dateRange }) => {
  const { deals, pipelineStages } = useCRM();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [chartEngine, setChartEngine] = useState<'recharts' | 'svg'>('recharts');

  // Compute live pipeline distribution from actual deals
  const segments: StageSegment[] = useMemo(() => {
    const activeStages = pipelineStages.filter(s => s.key !== 'lost');
    const total = activeStages.reduce((acc, stage) => {
      const stageDeals = deals.filter(d => d.stage === stage.key);
      return acc + stageDeals.reduce((sum, d) => sum + d.value, 0);
    }, 0) || 1;

    return activeStages.map(stage => {
      const stageDeals = deals.filter(d => d.stage === stage.key);
      const stageVal = stageDeals.reduce((sum, d) => sum + d.value, 0);
      const pct = Math.round((stageVal / total) * 100);
      return {
        name: stage.label,
        dealsCount: stageDeals.length,
        value: stageVal,
        percentage: pct,
        color: stage.color
      };
    });
  }, [deals, pipelineStages]);

  const totalValue = segments.reduce((sum, s) => sum + s.value, 0);
  const totalDeals = segments.reduce((sum, s) => sum + s.dealsCount, 0);

  // SVG Donut geometry
  const size = 200;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Compute stroke offsets
  let accumulatedPercent = 0;
  const arcs = segments.map((seg, idx) => {
    const strokeDasharray = `${(seg.percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
    accumulatedPercent += seg.percentage;
    return {
      ...seg,
      strokeDasharray,
      strokeDashoffset,
      idx
    };
  });

  const activeSegment = hoveredIdx !== null ? segments[hoveredIdx] : null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
      {/* Chart Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Deal Pipeline</h3>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
              Donut Chart
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
            Stage distribution, active pipeline weighted value & deal counts
          </p>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Pipeline Volume
          </span>
          <span className="text-lg font-extrabold text-slate-900">
            {formatCurrency(totalValue, true)}
          </span>
        </div>
      </div>

      {/* Graphic Visualization: Recharts or Custom SVG */}
      {chartEngine === 'recharts' ? (
        <div className="my-2">
          <PipelineDonutRechart
            dateRange={dateRange}
            data={segments.map(s => ({ name: s.name, value: s.value, deals: s.dealsCount, color: s.color }))}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center my-4">
        {/* Left: SVG Donut */}
        <div className="relative flex items-center justify-center">
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="transform -rotate-90 select-none overflow-visible"
          >
            {/* Background ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#f1f5f9"
              strokeWidth={strokeWidth}
            />

            {/* Arcs */}
            {arcs.map(arc => {
              const isHovered = hoveredIdx === arc.idx;
              return (
                <circle
                  key={arc.name}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={arc.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={arc.strokeDasharray}
                  strokeDashoffset={arc.strokeDashoffset}
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(arc.idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              );
            })}
          </svg>

          {/* Donut Center Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            {activeSegment ? (
              <div className="animate-fade-in space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {activeSegment.name}
                </span>
                <span className="text-base font-extrabold text-slate-900 block">
                  {formatCurrency(activeSegment.value, true)}
                </span>
                <span className="text-[10px] font-semibold text-slate-500 block">
                  {activeSegment.dealsCount} deals ({activeSegment.percentage}%)
                </span>
              </div>
            ) : (
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Total Active
                </span>
                <span className="text-base font-extrabold text-slate-900 block">
                  {formatCurrency(totalValue, true)}
                </span>
                <span className="text-[10px] font-semibold text-slate-500 block">
                  {totalDeals} Opportunities
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Legend Breakdown */}
        <div className="space-y-2">
          {segments.map((seg, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <div
                key={seg.name}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                  isHovered
                    ? 'border-slate-300 bg-slate-50/80 shadow-2xs'
                    : 'border-slate-100 bg-white hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: seg.color }}
                  />
                  <span className="text-xs font-semibold text-slate-800 truncate">
                    {seg.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium shrink-0">
                    ({seg.dealsCount})
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0 text-right">
                  <span className="text-xs font-bold text-slate-900">
                    {formatCurrency(seg.value, true)}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 w-8 text-right">
                    {seg.percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      )}

      {/* Footer Info */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Weighted Pipeline: <strong className="text-slate-800">{formatCurrency(totalValue * 0.65, true)}</strong></span>
        <span className="text-[11px] text-slate-400">Hover over slices to inspect stage volume</span>
      </div>
    </div>
  );
};

