import { useMemo, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const TOKENS = [
  { key: 'ETH', color: '#3b82f6' },
  { key: 'BTC', color: '#f97316' },
  { key: 'LINK', color: '#06b6d4' },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { fullDate, price } = payload[0].payload;
    return (
      <div style={{ background: '#1e293b', borderRadius: 8, padding: '8px 14px' }}>
        <p style={{ color: '#94a3b8', fontSize: 12, margin: 0 }}>{fullDate}</p>
        <p style={{ color: 'white', fontSize: 15, fontWeight: 600, margin: '2px 0 0' }}>
          ${price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </p>
      </div>
    );
  }
  return null;
};

export default function PriceChart({ logs }) {
  const [selected, setSelected] = useState('ETH');

  const chartData = useMemo(() => {
    if (!logs || logs.length === 0) return [];

    return [...logs]
      .filter(r => r.token.toUpperCase() === selected)
      .sort((a, b) => a.timestamp - b.timestamp)
      .slice(-20) // ← limit to last 20 data points
       .map(r => {
        const date = new Date(r.timestamp * 1000);
          return {
          timestamp: r.timestamp, // ← unique key for each point
          label: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
          fullDate: date.toLocaleDateString(undefined, {
            month: 'short', day: 'numeric', year: 'numeric',
          }) + ' · ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          price: r.price,
        };
      });
    }, [logs, selected]);

  const activeColor = TOKENS.find(t => t.key === selected)?.color;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm h-full flex flex-col">
      <div className="flex gap-2 mb-4">
        {TOKENS.map(({ key, color }) => (
          <button
            key={key}
            onClick={() => setSelected(key)}
            style={{
              borderColor: color,
              backgroundColor: selected === key ? color : 'transparent',
              color: selected === key ? 'white' : color,
            }}
            className="px-4 py-1.5 rounded-lg text-sm font-semibold border-2 transition-all cursor-pointer"
          >
            {key}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, minHeight: 0, minWidth: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
             <XAxis
              dataKey="timestamp"
              fontSize={11}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
              tickFormatter={(val) => {
                const d = new Date(val * 1000);
                return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              }}
            />
            <YAxis
              domain={['auto', 'auto']}
              fontSize={11}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => `$${v.toLocaleString()}`}
              width={40}
            />
            <Tooltip content={<CustomTooltip />}/>
            <Line
              type="monotone"
              dataKey="price"
              key={selected}
              stroke={activeColor}
              strokeWidth={2}
              dot={false}
              // dot={{ r: 4 }}
              activeDot={{ r: 5 }}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}