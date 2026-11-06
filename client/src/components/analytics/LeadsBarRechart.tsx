import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

interface LeadsBarRechartProps {
  dateRange: 'today' | '7days' | '30days' | '3months' | '1year';
  isZero?: boolean;
}

export const LeadsBarRechart: React.FC<LeadsBarRechartProps> = ({ dateRange, isZero = false }) => {
  const datasets = {
    today: [
      { label: '9 AM', inbound: 4, outbound: 2 },
      { label: '11 AM', inbound: 9, outbound: 5 },
      { label: '1 PM', inbound: 7, outbound: 3 },
      { label: '3 PM', inbound: 12, outbound: 6 },
      { label: '5 PM', inbound: 14, outbound: 4 },
      { label: '7 PM', inbound: 6, outbound: 2 }
    ],
    '7days': [
      { label: 'Mon', inbound: 24, outbound: 12 },
      { label: 'Tue', inbound: 36, outbound: 18 },
      { label: 'Wed', inbound: 48, outbound: 22 },
      { label: 'Thu', inbound: 42, outbound: 19 },
      { label: 'Fri', inbound: 38, outbound: 16 },
      { label: 'Sat', inbound: 18, outbound: 8 },
      { label: 'Sun', inbound: 14, outbound: 6 }
    ],
    '30days': [
      { label: 'Week 1', inbound: 180, outbound: 95 },
      { label: 'Week 2', inbound: 240, outbound: 110 },
      { label: 'Week 3', inbound: 295, outbound: 130 },
      { label: 'Week 4', inbound: 345, outbound: 148 }
    ],
    '3months': [
      { label: 'Sep', inbound: 780, outbound: 380 },
      { label: 'Oct', inbound: 1040, outbound: 490 },
      { label: 'Nov', inbound: 1248, outbound: 540 }
    ],
    '1year': [
      { label: 'Q1', inbound: 2400, outbound: 1100 },
      { label: 'Q2', inbound: 2950, outbound: 1350 },
      { label: 'Q3', inbound: 3600, outbound: 1600 },
      { label: 'Q4', inbound: 4200, outbound: 1850 }
    ]
  };

  const rawData = datasets[dateRange] || datasets['30days'];
  const data = isZero ? rawData.map(d => ({ ...d, inbound: 0, outbound: 0 })) : rawData;

  return (
    <div className="w-full h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="label"
            stroke="#94a3b8"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#94a3b8"
            fontSize={10}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const total = (Number(payload[0]?.value || 0)) + (Number(payload[1]?.value || 0));
                return (
                  <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs shadow-lg space-y-1">
                    <p className="font-bold text-slate-200">{label}</p>
                    <p className="text-blue-400 font-medium">
                      Inbound: <span className="font-bold">{payload[0]?.value}</span>
                    </p>
                    <p className="text-indigo-400 font-medium">
                      Outbound: <span className="font-bold">{payload[1]?.value}</span>
                    </p>
                    <p className="text-slate-300 font-semibold pt-1 border-t border-slate-700">
                      Total: {total} leads
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            iconType="circle"
            wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
            formatter={(value) => <span className="text-slate-600 font-medium capitalize">{value} Leads</span>}
          />
          <Bar dataKey="inbound" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={36} />
          <Bar dataKey="outbound" fill="#818cf8" radius={[4, 4, 0, 0]} maxBarSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

