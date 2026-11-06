import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';

interface SalesRevenueRechartProps {
  dateRange: 'today' | '7days' | '30days' | '3months' | '1year';
  isZero?: boolean;
}

export const SalesRevenueRechart: React.FC<SalesRevenueRechartProps> = ({ dateRange, isZero = false }) => {
  const datasets = {
    today: [
      { label: '9:00 AM', revenue: 15000, target: 10000 },
      { label: '11:00 AM', revenue: 45000, target: 35000 },
      { label: '1:00 PM', revenue: 72000, target: 60000 },
      { label: '3:00 PM', revenue: 125000, target: 100000 },
      { label: '5:00 PM', revenue: 160000, target: 140000 },
      { label: '7:00 PM', revenue: 180000, target: 170000 }
    ],
    '7days': [
      { label: 'Mon', revenue: 45000, target: 40000 },
      { label: 'Tue', revenue: 68000, target: 55000 },
      { label: 'Wed', revenue: 120000, target: 90000 },
      { label: 'Thu', revenue: 155000, target: 130000 },
      { label: 'Fri', revenue: 210000, target: 180000 },
      { label: 'Sat', revenue: 260000, target: 220000 },
      { label: 'Sun', revenue: 320000, target: 280000 }
    ],
    '30days': [
      { label: 'Week 1', revenue: 240000, target: 200000 },
      { label: 'Week 2', revenue: 580000, target: 480000 },
      { label: 'Week 3', revenue: 890000, target: 780000 },
      { label: 'Week 4', revenue: 1248000, target: 1050000 }
    ],
    '3months': [
      { label: 'September', revenue: 1080000, target: 950000 },
      { label: 'October', revenue: 2420000, target: 2100000 },
      { label: 'November', revenue: 3820000, target: 3300000 }
    ],
    '1year': [
      { label: 'Q1', revenue: 1850000, target: 1600000 },
      { label: 'Q2', revenue: 3940000, target: 3400000 },
      { label: 'Q3', revenue: 6200000, target: 5400000 },
      { label: 'Q4', revenue: 8450000, target: 7500000 }
    ]
  };

  const rawData = datasets[dateRange] || datasets['30days'];
  const data = isZero ? rawData.map(d => ({ ...d, revenue: 0, target: 0 })) : rawData;

  return (
    <div className="w-full h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="rechartsRevenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
            </linearGradient>
          </defs>
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
            tickFormatter={val => `₹${(val / 100000).toFixed(1)}L`}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs shadow-lg space-y-1">
                    <p className="font-bold text-slate-200">{label}</p>
                    <p className="text-blue-400 font-semibold">
                      Revenue: {formatCurrency(Number(payload[0].value))}
                    </p>
                    {payload[1] && (
                      <p className="text-slate-400">
                        Target: {formatCurrency(Number(payload[1].value))}
                      </p>
                    )}
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#2563EB"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#rechartsRevenueGradient)"
          />
          <Line
            type="monotone"
            dataKey="target"
            stroke="#94a3b8"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

