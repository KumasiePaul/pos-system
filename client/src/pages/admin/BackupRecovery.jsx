import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import axios from 'axios';

const BackupRecovery = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleExportData = async (collection) => {
    try {
      setLoading(true);
      setMessage('');
      setError('');

      const endpoints = {
        products: 'http://localhost:5000/api/products',
        customers: 'http://localhost:5000/api/customers',
        sales: 'http://localhost:5000/api/sales',
        users: 'http://localhost:5000/api/users'
      };

      const res = await axios.get(endpoints[collection], {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Create and download JSON file
      const dataStr = JSON.stringify(res.data, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${collection}_backup_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);

      setMessage(`${collection} data exported successfully!`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(`Failed to export ${collection} data`);
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const backupItems = [
    {
      collection: 'products',
      label: 'Products',
      emoji: '📦',
      description: 'Export all product data including prices and stock levels'
    },
    {
      collection: 'customers',
      label: 'Customers',
      emoji: '👥',
      description: 'Export all customer records including loyalty points'
    },
    {
      collection: 'sales',
      label: 'Sales',
      emoji: '🧾',
      description: 'Export all sales transactions and receipts'
    },
    {
      collection: 'users',
      label: 'Users',
      emoji: '👤',
      description: 'Export all system user accounts and roles'
    }
  ];

  return (
    <div className="p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-blue-800">Backup & Recovery</h1>
        <p className="text-gray-500 text-sm mt-1">
          Export your data as JSON files for backup and recovery
        </p>
      </div>

      {/* Success Message */}
      {message && (
        <div className="bg-green-100 text-green-600 p-3 rounded mb-4 text-sm">
          ✅ {message}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">
          ❌ {error}
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-700 font-medium mb-1">
          ℹ️ How Backup Works
        </p>
        <p className="text-xs text-blue-600">
          Clicking any export button below will download a JSON file of that
          collection to your computer. Store these files in a safe location.
          You can use them to restore data if needed.
        </p>
      </div>

      {/* Backup Cards */}
      <div className="grid grid-cols-2 gap-4">
        {backupItems.map((item) => (
          <div
            key={item.collection}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-3xl mb-2">{item.emoji}</p>
                <h3 className="text-base font-semibold text-gray-700">
                  {item.label} Backup
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {item.description}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleExportData(item.collection)}
              disabled={loading}
              className="mt-4 w-full bg-blue-800 text-white py-2 rounded text-sm font-medium hover:bg-blue-700 transition duration-200 disabled:opacity-50"
            >
              {loading ? 'Exporting...' : `Export ${item.label}`}
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default BackupRecovery;