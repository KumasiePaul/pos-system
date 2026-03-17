import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import {
  getSummary,
  getDailySales,
  getWeeklySales,
  getProductPerformance
} from '../../services/reportService';
import SalesChart from '../../components/reports/SalesChart';
import ReportTable from '../../components/reports/ReportTable';

const Reports = () => {
  const { token } = useAuth();
  const [summary, setSummary] = useState(null);
  const [dailySales, setDailySales] = useState(null);
  const [weeklySales, setWeeklySales] = useState([]);
  const [productPerformance, setProductPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const [summaryData, dailyData, weeklyData, productData] = await Promise.all([
        getSummary(token),
        getDailySales(token),
        getWeeklySales(token),
        getProductPerformance(token)
      ]);
      setSummary(summaryData);
      setDailySales(dailyData);
      setWeeklySales(weeklyData);
      setProductPerformance(productData);
    } catch (err) {
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading reports...
      </div>
    );
  }

  return (
    <div className="p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-blue-800">Reports & Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Business performance overview</p>
      </div>

      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">Total Revenue</p>
            <p className="text-xl font-bold text-blue-800">
              GH₵ {Number(summary.totalRevenue).toFixed(2)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">Total Transactions</p>
            <p className="text-xl font-bold text-blue-800">
              {summary.totalTransactions}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">Total Products</p>
            <p className="text-xl font-bold text-blue-800">
              {summary.totalProducts}
            </p>
          </div>
        </div>
      )}

      {/* Today's Sales */}
      {dailySales && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">Today's Revenue</p>
            <p className="text-xl font-bold text-green-700">
              GH₵ {Number(dailySales.totalRevenue).toFixed(2)}
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">Today's Transactions</p>
            <p className="text-xl font-bold text-green-700">
              {dailySales.totalTransactions}
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">Items Sold Today</p>
            <p className="text-xl font-bold text-green-700">
              {dailySales.totalItemsSold}
            </p>
          </div>
        </div>
      )}

      {/* Weekly Sales Chart */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-base font-semibold text-gray-700 mb-4">
          Weekly Sales Chart
        </h2>
        <SalesChart data={weeklySales} />
      </div>

      {/* Product Performance */}
      <div className="bg-white rounded-lg shadow p-6">
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