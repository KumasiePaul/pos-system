import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package, Warehouse, Users, BarChart3,
  UserCog, DatabaseBackup, TrendingUp,
  ShoppingCart, DollarSign, ArrowRight
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useTheme from '../../hooks/useTheme';
import { getSummary, getDailySales } from '../../services/reportService';

const AdminDashboard = () => {
  const { user, token } = useAuth();
  const { isDark } = useTheme();
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

  const card = `rounded-xl shadow p-5 ${isDark ? 'bg-slate-800' : 'bg-white'}`;
  const label = `text-xs font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`;
  const value = `text-2xl font-bold ${isDark ? 'text-white' : 'text-blue-800'}`;
  const sub = `text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-gray-400'}`;

  const summaryCards = summary ? [
    { label: 'Total Revenue', value: `GH₵ ${Number(summary.totalRevenue).toFixed(2)}`, sub: 'All time', icon: DollarSign, color: 'bg-blue-500' },
    { label: 'Total Transactions', value: summary.totalTransactions, sub: 'All time', icon: ShoppingCart, color: 'bg-green-500' },
    { label: 'Total Products', value: summary.totalProducts, sub: 'In system', icon: Package, color: 'bg-yellow-500' },
    { label: 'Total Customers', value: summary.totalCustomers, sub: 'Registered', icon: Users, color: 'bg-purple-500' },
  ] : [];

  const dailyCards = dailySales ? [
    { label: "Today's Revenue", value: `GH₵ ${Number(dailySales.totalRevenue).toFixed(2)}`, icon: TrendingUp, color: 'text-green-500' },
    { label: "Today's Transactions", value: dailySales.totalTransactions, icon: ShoppingCart, color: 'text-blue-500' },
    { label: 'Items Sold Today', value: dailySales.totalItemsSold, icon: Package, color: 'text-yellow-500' },
  ] : [];

  const quickLinks = [
    { label: 'Manage Products', path: '/admin/products', icon: Package, color: 'bg-blue-500 hover:bg-blue-600' },
    { label: 'Manage Inventory', path: '/admin/inventory', icon: Warehouse, color: 'bg-green-500 hover:bg-green-600' },
    { label: 'Manage Customers', path: '/admin/customers', icon: Users, color: 'bg-yellow-500 hover:bg-yellow-600' },
    { label: 'View Reports', path: '/admin/reports', icon: BarChart3, color: 'bg-purple-500 hover:bg-purple-600' },
    { label: 'Manage Users', path: '/admin/users', icon: UserCog, color: 'bg-red-500 hover:bg-red-600' },
    { label: 'Backup & Recovery', path: '/admin/backup', icon: DatabaseBackup, color: 'bg-slate-500 hover:bg-slate-600' },
  ];

  return (
    <div className="p-6">

      {/* Welcome Header */}
      <div className="mb-6">
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-blue-800'}`}>
          Welcome back, {user?.name}! 👋
        </h1>
        <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
          {new Date().toLocaleDateString('en-GH', {
            weekday: 'long', year: 'numeric',
            month: 'long', day: 'numeric'
          })}
        </p>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          {summaryCards.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className={card}>
                <div className="flex items-center justify-between mb-3">
                  <p className={label}>{item.label}</p>
                  <div className={`${item.color} p-2 rounded-lg`}>
                    <Icon size={16} className="text-white" />
                  </div>
                </div>
                <p className={value}>{item.value}</p>
                <p className={sub}>{item.sub}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Today's Stats */}
      {dailySales && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {dailyCards.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className={`${card} border ${isDark ? 'border-slate-700' : 'border-green-100'}`}>
                <div className="flex items-center gap-3">
                  <Icon size={20} className={item.color} />
                  <div>
                    <p className={label}>{item.label}</p>
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

      {/* Quick Links */}
      <div className="mb-6">
        <h2 className={`text-base font-semibold mb-3 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
          Quick Access
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`${link.color} text-white rounded-xl p-4 text-left transition duration-200 shadow flex items-center justify-between group`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} />
                  <span className="text-sm font-semibold">{link.label}</span>
                </div>
                <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition duration-200" />
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;