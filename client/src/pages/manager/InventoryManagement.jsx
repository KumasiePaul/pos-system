import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import {
  getAllInventory,
  getLowStockItems,
  adjustStock
} from '../../services/inventoryService';
import StockTable from '../../components/inventory/StockTable';
import LowStockAlert from '../../components/inventory/LowStockAlert';

const InventoryManagement = () => {
  const { token } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Adjust stock modal
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustingItem, setAdjustingItem] = useState(null);
  const [adjustData, setAdjustData] = useState({
    adjustment: '',
    reason: ''
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const [allInventory, lowStock] = await Promise.all([
        getAllInventory(token),
        getLowStockItems(token)
      ]);
      setInventory(allInventory);
      setLowStockItems(lowStock);
    } catch (err) {
      setError('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleAdjust = (item) => {
    setAdjustingItem(item);
    setAdjustData({ adjustment: '', reason: '' });
    setShowAdjustModal(true);
  };

  const handleAdjustSubmit = async (e) => {
    e.preventDefault();
    try {
      await adjustStock(adjustingItem._id, {
        adjustment: Number(adjustData.adjustment),
        reason: adjustData.reason
      }, token);
      setSuccess('Stock adjusted successfully!');
      setShowAdjustModal(false);
      fetchInventory();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to adjust stock');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-blue-800">Inventory Management</h1>
        <p className="text-gray-500 text-sm mt-1">Track and manage stock levels</p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-100 text-green-600 p-3 rounded mb-4 text-sm">
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Low Stock Alert */}
      <LowStockAlert items={lowStockItems} />

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow p-4">
        {loading ? (
          <div className="text-center py-8 text-gray-500">
            Loading inventory...
          </div>
        ) : (
          <StockTable
            inventory={inventory}
            onUpdate={null}
            onAdjust={handleAdjust}
          />
        )}
      </div>

      {/* Adjust Stock Modal */}
      {showAdjustModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Adjust Stock — {adjustingItem?.product?.name}
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Current Stock: <span className="font-semibold text-gray-700">{adjustingItem?.stockQuantity}</span>
            </p>
            <form onSubmit={handleAdjustSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adjustment (use negative to subtract)
                </label>
                <input
                  type="number"
                  value={adjustData.adjustment}
                  onChange={(e) => setAdjustData({
                    ...adjustData, adjustment: e.target.value
                  })}
                  required
                  placeholder="e.g. 20 or -5"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason
                </label>
                <input
                  type="text"
                  value={adjustData.reason}
                  onChange={(e) => setAdjustData({
                    ...adjustData, reason: e.target.value
                  })}
                  placeholder="e.g. Damaged goods, Restock"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="bg-yellow-500 text-white px-6 py-2 rounded text-sm font-medium hover:bg-yellow-600 transition duration-200"
                >
                  Adjust Stock
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded text-sm font-medium hover:bg-gray-300 transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default InventoryManagement;