import { useState, useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useTheme from '../../hooks/useTheme';
import {
  getAllInventory, getLowStockItems, updateStock, adjustStock
} from '../../services/inventoryService';
import StockTable from '../../components/inventory/StockTable';
import LowStockAlert from '../../components/inventory/LowStockAlert';

const InventoryManagement = () => {
  const { token } = useAuth();
  const { isDark } = useTheme();
  const [inventory, setInventory] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updatingItem, setUpdatingItem] = useState(null);
  const [updateData, setUpdateData] = useState({ stockQuantity: '', lowStockThreshold: '', supplier: '' });
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustingItem, setAdjustingItem] = useState(null);
  const [adjustData, setAdjustData] = useState({ adjustment: '', reason: '' });

  const card = `rounded-xl shadow p-4 ${isDark ? 'bg-slate-800' : 'bg-white'}`;
  const input = `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${
    isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-gray-300 text-gray-800'
  }`;
  const label = `block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-700'}`;
  const modalBg = `fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50`;
  const modalCard = `rounded-2xl shadow-2xl p-6 w-full max-w-md ${isDark ? 'bg-slate-800' : 'bg-white'}`;

  useEffect(() => { fetchInventory(); }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const [allInventory, lowStock] = await Promise.all([
        getAllInventory(token), getLowStockItems(token)
      ]);
      setInventory(allInventory);
      setLowStockItems(lowStock);
    } catch (err) {
      setError('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (item) => {
    setUpdatingItem(item);
    setUpdateData({ stockQuantity: item.stockQuantity, lowStockThreshold: item.lowStockThreshold, supplier: item.supplier || '' });
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateStock(updatingItem._id, updateData, token);
      setSuccess('Stock updated successfully!');
      setShowUpdateModal(false);
      fetchInventory();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update stock');
      setTimeout(() => setError(''), 3000);
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
      await adjustStock(adjustingItem._id, { adjustment: Number(adjustData.adjustment), reason: adjustData.reason }, token);
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
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-blue-800'}`}>
          Inventory Management
        </h1>
        <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
          Track and manage stock levels
        </p>
      </div>

      {success && (
        <div className="bg-green-500 bg-opacity-10 border border-green-500 text-green-500 p-3 rounded-lg mb-4 text-sm">
          ✅ {success}
        </div>
      )}
      {error && (
        <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 p-3 rounded-lg mb-4 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Low Stock Alert */}
      <LowStockAlert items={lowStockItems} />

      {/* Inventory Table */}
      <div className={card}>
        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Loading inventory...</p>
          </div>
        ) : (
          <StockTable inventory={inventory} onUpdate={handleUpdate} onAdjust={handleAdjust} />
        )}
      </div>

      {/* Update Stock Modal */}
      {showUpdateModal && (
        <div className={modalBg}>
          <div className={modalCard}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-700'}`}>
                Update Stock — {updatingItem?.product?.name}
              </h2>
              <button onClick={() => setShowUpdateModal(false)}
                className={`p-1 rounded-lg ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className={label}>Stock Quantity</label>
                <input type="number" value={updateData.stockQuantity}
                  onChange={(e) => setUpdateData({ ...updateData, stockQuantity: e.target.value })}
                  required min="0" className={input} />
              </div>
              <div>
                <label className={label}>Low Stock Threshold</label>
                <input type="number" value={updateData.lowStockThreshold}
                  onChange={(e) => setUpdateData({ ...updateData, lowStockThreshold: e.target.value })}
                  required min="0" className={input} />
              </div>
              <div>
                <label className={label}>Supplier</label>
                <input type="text" value={updateData.supplier}
                  onChange={(e) => setUpdateData({ ...updateData, supplier: e.target.value })}
                  className={input} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium transition duration-200">
                  Update Stock
                </button>
                <button type="button" onClick={() => setShowUpdateModal(false)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition duration-200 ${
                    isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjust Stock Modal */}
      {showAdjustModal && (
        <div className={modalBg}>
          <div className={modalCard}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-700'}`}>
                Adjust Stock — {adjustingItem?.product?.name}
              </h2>
              <button onClick={() => setShowAdjustModal(false)}
                className={`p-1 rounded-lg ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                <X size={18} />
              </button>
            </div>
            <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
              Current Stock: <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-700'}`}>{adjustingItem?.stockQuantity}</span>
            </p>
            <form onSubmit={handleAdjustSubmit} className="space-y-4">
              <div>
                <label className={label}>Adjustment (use negative to subtract)</label>
                <input type="number" value={adjustData.adjustment}
                  onChange={(e) => setAdjustData({ ...adjustData, adjustment: e.target.value })}
                  required placeholder="e.g. 20 or -5" className={input} />
              </div>
              <div>
                <label className={label}>Reason</label>
                <input type="text" value={adjustData.reason}
                  onChange={(e) => setAdjustData({ ...adjustData, reason: e.target.value })}
                  placeholder="e.g. Damaged goods, Restock" className={input} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit"
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2.5 rounded-lg text-sm font-medium transition duration-200">
                  Adjust Stock
                </button>
                <button type="button" onClick={() => setShowAdjustModal(false)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition duration-200 ${
                    isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}>
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