import { useState, useEffect } from 'react';
import { TrendingUp, ShoppingCart, Package, RefreshCw } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useTheme from '../../hooks/useTheme';
import {
  getSummary, getDailySales, getWeeklySales, getProductPerformance
} from '../../services/reportService';
import SalesChart from '../../components/reports/SalesChart';
import ReportTable from '../../components/reports/ReportTable';

const Reports = () => {
  const { token } = useAuth();
  const { isDark } = useTheme();
  const [summary, setSummary] = useState(null);
  const [dailySales, setDailySales] = useState(null);
  const [weeklySales, setWeeklySales] = useState([]);
  const [productPerformance, setProductPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const card = `rounded-xl shadow p-5 ${isDark ? 'bg-slate-800' : 'bg-white'}`;

  useEffect(() => { fetchReports(); }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const [summaryData, dailyData, weeklyData, productData] =
        await Promise.allSettled([
          getSummary(token), getDailySales(token),
          getWeeklySales(token), getProductPerformance(token)
        ]);
      if (summaryData.status === 'fulfilled') setSummary(summaryData.value);
      if (dailyData.status === 'fulfilled') setDailySales(dailyData.value);
      if (weeklyData.status === 'fulfilled') setWeeklySales(weeklyData.value);
      if (productData.status === 'fulfilled') setProductPerformance(productData.value);
    } catch (err) {
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Loading reports...</p>
        </div>
      </div>
    );
  }

  const summaryItems = summary ? [
    { label: 'Total Revenue', value: `GH₵ ${Number(summary.totalRevenue).toFixed(2)}`, icon: TrendingUp, color: 'bg-blue-500' },
    { label: 'Total Transactions', value: summary.totalTransactions, icon: ShoppingCart, color: 'bg-green-500' },
    { label: 'Total Products', value: summary.totalProducts, icon: Package, color: 'bg-yellow-500' },
  ] : [];

  const dailyItems = dailySales ? [
    { label: "Today's Revenue", value: `GH₵ ${Number(dailySales.totalRevenue).toFixed(2)}`, icon: TrendingUp },
    { label: "Today's Transactions", value: dailySales.totalTransactions, icon: ShoppingCart },
    { label: 'Items Sold Today', value: dailySales.totalItemsSold, icon: Package },
  ] : [];

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-blue-800'}`}>
            Reports & Analytics
          </h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
            Business performance overview
          </p>
        </div>
        <button
          onClick={fetchReports}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 p-3 rounded-lg mb-4 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {summaryItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className={card}>
                <div className="flex items-center justify-between mb-2">
                  <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                    {item.label}
                  </p>
                  <div className={`${item.color} p-1.5 rounded-lg`}>
                    <Icon size={14} className="text-white" />
                  </div>
                </div>
                <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-blue-800'}`}>
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Today's Stats */}
      {dailySales && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {dailyItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className={`${card} border ${isDark ? 'border-green-500 border-opacity-30' : 'border-green-200'}`}>
                <div className="flex items-center gap-3">
                  <Icon size={20} className="text-green-500" />
                  <div>
                    <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                      {item.label}
                    </p>
                    <p className={`text-xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                      {item.value}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Weekly Chart */}
      <div className={`${card} mb-6`}>
        <h2 className={`text-base font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-700'}`}>
          Weekly Sales Chart
        </h2>
        <SalesChart data={weeklySales} />
      </div>

      {/* Product Performance */}
      <div className={card}>
        <ReportTable
          title="Product Performance"
          headers={['Product', 'Qty Sold', 'Revenue']}
          rows={productPerformance.map(p => [
            p.productName,
            p.totalQuantitySold,
            `GH₵ ${Number(p.totalRevenue).toFixed(2)}`
          ])}
          emptyMessage="No product sales data available."
        />
      </div>

    </div>
  );
};

export default Reports;