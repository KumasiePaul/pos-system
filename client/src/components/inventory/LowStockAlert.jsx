const LowStockAlert = ({ items }) => {
  if (items.length === 0) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <h3 className="text-red-700 font-semibold text-sm mb-3">
        ⚠️ Low Stock Alert — {items.length} item(s) running low
      </h3>
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item._id}
            className="flex justify-between items-center bg-white border border-red-100 rounded px-3 py-2"
          >
            <div>
              <span className="text-sm font-medium text-gray-800">
                {item.product?.name}
              </span>
              <span className="text-xs text-gray-500 ml-2">
                {item.product?.category}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-red-600 font-medium">
                {item.stockQuantity} left
              </span>
              <span className="text-xs text-gray-400 ml-2">
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