import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import useTheme from '../../hooks/useTheme';

const SalesChart = ({ data }) => {
  const { isDark } = useTheme();

  if (!data || data.length === 0) {
    return (
      <div className={`text-center py-8 text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
        No sales data available for chart.
      </div>
    );
  }

  const chartData = data.map(item => ({
    date: item._id,
    Revenue: Number(item.totalRevenue.toFixed(2)),
    Transactions: item.totalTransactions
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDark ? '#334155' : '#f0f0f0'}
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: isDark ? '#94a3b8' : '#6B7280' }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: isDark ? '#94a3b8' : '#6B7280' }}
          />
          <Tooltip
            formatter={(value, name) => [
              name === 'Revenue' ? `GH₵ ${value}` : value, name
            ]}
            contentStyle={{
              backgroundColor: isDark ? '#1e293b' : '#fff',
              border: `1px solid ${isDark ? '#334155' : '#E5E7EB'}`,
              borderRadius: '8px',
              fontSize: '12px',
              color: isDark ? '#f1f5f9' : '#111827'
            }}
          />
          <Bar dataKey="Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;