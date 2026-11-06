import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { formatCurrency } from '../../utils/formatters';

export const PipelineForecastChart: React.FC = () => {
  const { deals, pipelineStages, setActiveView } = useCRM();

  // Aggregate deal amounts and counts per stage
  const stageStats = pipelineStages.map(stage => {
    const stageDeals = deals.filter(d => d.stage === stage.key);
    const totalAmount = stageDeals.reduce((sum, d) => sum + d.value, 0);
    return {
      ...stage,
      count: stageDeals.length,
      amount: totalAmount
    };
  });

  const totalActivePipeline = stageStats
    .filter(s => s.key !== 'lost')
    .reduce((sum, s) => sum + s.amount, 0);

  const maxAmount = Math.max(...stageStats.map(s => s.amount), 1);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Pipeline Distribution by Stage</h3>
          <p className="text-xs text-slate-500">Live breakdown of deal values and conversion readiness</p>
        </div>
        <button
          onClick={() => setActiveView('deals')}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 self-start sm:self-auto"
        >
          View Kanban Board →
        </button>
      </div>

      <div className="mt-5 space-y-4">
        {stageStats.map(stage => {
          const percentage = totalActivePipeline > 0 ? Math.round((stage.amount / totalActivePipeline) * 100) : 0;
          const barWidth = Math.max((stage.amount / maxAmount) * 100, 3);

          return (
            <div key={stage.key} className="group">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: stage.color }}
                  />
                  <span className="font-semibold text-slate-700">{stage.label}</span>
                  <span className="text-[11px] text-slate-500">
                    ({stage.count} {stage.count === 1 ? 'deal' : 'deals'})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{formatCurrency(stage.amount)}</span>
                  <span className="text-[11px] text-slate-500 w-8 text-right">{percentage}%</span>
                </div>
              </div>

              {/* Progress Bar Container */}
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 group-hover:brightness-95"
                  style={{
                    width: `${stage.amount > 0 ? barWidth : 0}%`,
                    backgroundColor: stage.color
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Weighted Pipeline summary footer */}
      <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
        <div>
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Total Active Pipeline</span>
          <p className="text-base font-bold text-slate-900 mt-0.5">{formatCurrency(totalActivePipeline)}</p>
        </div>
        <div>
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Weighted Forecast</span>
          <p className="text-base font-bold text-blue-600 mt-0.5">
            {formatCurrency(
              deals
                .filter(d => d.stage !== 'lost')
                .reduce((sum, d) => sum + (d.value * (d.probability / 100)), 0)
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

