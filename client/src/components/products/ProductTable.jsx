const ProductTable = ({ products, onEdit, onDelete }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No products found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-blue-800 text-white">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Price (GH₵)</th>
            <th className="px-4 py-3">Quantity</th>
            <th className="px-4 py-3">Barcode</th>
            <th className="px-4 py-3">Supplier</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr
              key={product._id}
              className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
            >
              <td className="px-4 py-3 font-medium text-gray-800">
                {product.name}
              </td>
              <td className="px-4 py-3 text-gray-600">
                {product.category}
              </td>
              <td className="px-4 py-3 text-gray-600">
                {Number(product.price).toFixed(2)}
              </td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  product.quantity <= 10
                    ? 'bg-red-100 text-red-600'
                    : 'bg-green-100 text-green-600'
                }`}>
                  {product.quantity}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-600">
                {product.barcode || '—'}
              </td>
              <td className="px-4 py-3 text-gray-600">
                {product.supplier || '—'}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(product)}
                    className="bg-yellow-400 text-white px-3 py-1 rounded text-xs font-medium hover:bg-yellow-500 transition duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(product._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-xs font-medium hover:bg-red-600 transition duration-200"
                  >
                    Delete
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

export default ProductTable;