const StockTable = ({ inventory, onUpdate, onAdjust }) => {
  if (inventory.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No inventory records found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-blue-800 text-white">
          <tr>
            <th className="px-4 py-3">Product</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Stock Quantity</th>
            <th className="px-4 py-3">Low Stock Threshold</th>
            <th className="px-4 py-3">Supplier</th>
            <th className="px-4 py-3">Last Restocked</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item, index) => (
            <tr
              key={item._id}
              className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
            >
              <td className="px-4 py-3 font-medium text-gray-800">
                {item.product?.name}
              </td>
              <td className="px-4 py-3 text-gray-600">
                {item.product?.category}
              </td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  item.stockQuantity <= item.lowStockThreshold
                    ? 'bg-red-100 text-red-600'
                    : 'bg-green-100 text-green-600'
                }`}>
                  {item.stockQuantity}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-600">
                {item.lowStockThreshold}
              </td>
              <td className="px-4 py-3 text-gray-600">
                {item.supplier || '—'}
              </td>
              <td className="px-4 py-3 text-gray-600">
                {new Date(item.lastRestocked).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  item.stockQuantity <= item.lowStockThreshold
                    ? 'bg-red-100 text-red-600'
                    : 'bg-green-100 text-green-600'
                }`}>
                  {item.stockQuantity <= item.lowStockThreshold
                    ? 'Low Stock'
                    : 'In Stock'}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => onUpdate(item)}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-xs font-medium hover:bg-blue-600 transition duration-200"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => onAdjust(item)}
                    className="bg-yellow-400 text-white px-3 py-1 rounded text-xs font-medium hover:bg-yellow-500 transition duration-200"
                  >
                    Adjust
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockTable;