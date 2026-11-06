import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';

interface PipelineDonutRechartProps {
  dateRange: 'today' | '7days' | '30days' | '3months' | '1year';
  data?: { name: string; value: number; deals: number; color: string }[];
}

export const PipelineDonutRechart: React.FC<PipelineDonutRechartProps> = ({ data: propData }) => {
  const defaultData = [
    { name: 'New Lead', value: 480000, deals: 1, color: '#3b82f6' },
    { name: 'Qualified', value: 2120000, deals: 3, color: '#06b6d4' },
    { name: 'Proposal', value: 2570000, deals: 2, color: '#f59e0b' },
    { name: 'Negotiation', value: 2730000, deals: 3, color: '#8b5cf6' },
    { name: 'Won (Closed)', value: 1248000, deals: 1, color: '#10b981' }
  ];

  const data = propData && propData.length > 0 ? propData : defaultData;

  const totalValue = data.reduce((acc, curr) => acc + curr.value, 0);

  if (totalValue === 0) {
    return (
      <div className="w-full h-[240px] flex flex-col items-center justify-center text-center p-4">
        <div className="w-16 h-16 rounded-full border-4 border-dashed border-slate-200 flex items-center justify-center mb-2">
          <span className="text-xs font-bold text-slate-400">0%</span>
        </div>
        <p className="text-xs font-bold text-slate-700">No active deals in pipeline</p>
        <p className="text-2xs text-slate-400 mt-0.5">Stage distribution will appear as deals are created</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[240px] flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                const pct = ((item.value / totalValue) * 100).toFixed(1);
                return (
                  <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs shadow-lg space-y-1">
                    <p className="font-bold flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block"
                        style={{ backgroundColor: item.color }}
                      />
                      {item.name}
                    </p>
                    <p className="text-slate-200">
                      Value: <span className="font-semibold text-white">{formatCurrency(item.value)}</span> ({pct}%)
                    </p>
                    <p className="text-slate-400">
                      Deals in stage: <span className="font-semibold text-slate-200">{item.deals}</span>
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
            formatter={(value) => <span className="text-slate-700 font-medium text-[11px]">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

