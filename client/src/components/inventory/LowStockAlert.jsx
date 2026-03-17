import { AlertTriangle } from 'lucide-react';
import useTheme from '../../hooks/useTheme';

const LowStockAlert = ({ items }) => {
  const { isDark } = useTheme();

  if (items.length === 0) return null;

  return (
    <div className={`border rounded-xl p-4 mb-6 ${
      isDark
        ? 'bg-red-500 bg-opacity-10 border-red-500 border-opacity-30'
        : 'bg-red-50 border-red-200'
    }`}>
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle size={16} className="text-red-500" />
        <h3 className="text-red-500 font-semibold text-sm">
          Low Stock Alert — {items.length} item(s) running low
        </h3>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item._id}
            className={`flex justify-between items-center rounded-lg px-3 py-2 ${
              isDark ? 'bg-slate-800' : 'bg-white border border-red-100'
            }`}
          >
            <div>
              <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                {item.product?.name}
              </span>
              <span className={`text-xs ml-2 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                {item.product?.category}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-red-500 font-semibold">
                {item.stockQuantity} left
              </span>
              <span className={`text-xs ml-2 ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>
                (min: {item.lowStockThreshold})
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LowStockAlert;