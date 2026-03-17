import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { getSummary, getDailySales } from '../../services/reportService';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [dailySales, setDailySales] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [summaryData, dailyData] = await Promise.allSettled([
        getSummary(token),
        getDailySales(token)
      ]);
      if (summaryData.status === 'fulfilled') setSummary(summaryData.value);
      if (dailyData.status === 'fulfilled') setDailySales(dailyData.value);
    } catch (err) {
      console.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const quickLinks = [
    { label: '📦 Manage Products', path: '/admin/products', color: 'bg-blue-500' },
    { label: '🏭 Manage Inventory', path: '/admin/inventory', color: 'bg-green-500' },
    { label: '👥 Manage Customers', path: '/admin/customers', color: 'bg-yellow-500' },
    { label: '📊 View Reports', path: '/admin/reports', color: 'bg-purple-500' },
    { label: '👤 Manage Users', path: '/admin/users', color: 'bg-red-500' },
    { label: '💾 Backup & Recovery', path: '/admin/backup', color: 'bg-gray-500' },
  ];

  return (
    <div className="p-6">

      {/* Welcome Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-blue-800">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {new Date().toLocaleDateString('en-GH', {
            weekday: 'long', year: 'numeric',
            month: 'long', day: 'numeric'
          })}
        </p>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-xs text-gray-500 mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-blue-800">
              GH₵ {Number(summary.totalRevenue).toFixed(2)}
            </p>
            <p className="text-xs text-gray-400 mt-1">All time</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-xs text-gray-500 mb-1">Total Transactions</p>
            <p className="text-2xl font-bold text-blue-800">
              {summary.totalTransactions}
            </p>
            <p className="text-xs text-gray-400 mt-1">All time</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-xs text-gray-500 mb-1">Total Products</p>
            <p className="text-2xl font-bold text-blue-800">
              {summary.totalProducts}
            </p>
            <p className="text-xs text-gray-400 mt-1">In system</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-xs text-gray-500 mb-1">Total Customers</p>
            <p className="text-2xl font-bold text-blue-800">
              {summary.totalCustomers}
            </p>
            <p className="text-xs text-gray-400 mt-1">Registered</p>
          </div>
        </div>
      )}

      {/* Today's Stats */}
      {dailySales && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Today's Revenue</p>
            <p className="text-xl font-bold text-green-700">
              GH₵ {Number(dailySales.totalRevenue).toFixed(2)}
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Today's Transactions</p>
            <p className="text-xl font-bold text-green-700">
              {dailySales.totalTransactions}
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Items Sold Today</p>
            <p className="text-xl font-bold text-green-700">
              {dailySales.totalItemsSold}
            </p>
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="mb-6">
        <h2 className="text-base font-semibold text-gray-700 mb-3">
          Quick Access
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`${link.color} text-white rounded-lg p-4 text-left hover:opacity-90 transition duration-200 shadow`}
            >
              <p className="text-sm font-semibold">{link.label}</p>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;