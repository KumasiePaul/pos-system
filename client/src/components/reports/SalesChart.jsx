import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const SalesChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No sales data available for chart.
      </div>
    );
  }

  // Format data for chart
  const chartData = data.map(item => ({
    date: item._id,
    Revenue: Number(item.totalRevenue.toFixed(2)),
    Transactions: item.totalTransactions
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: '#6B7280' }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#6B7280' }}
          />
          <Tooltip
            formatter={(value, name) => [
              name === 'Revenue' ? `GH₵ ${value}` : value,
              name
            ]}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              fontSize: '12px'
            }}
          />
          <Bar dataKey="Revenue" fill="#1E3A5F" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;