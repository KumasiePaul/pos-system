const CartItem = ({ item, onRemove, onUpdateQuantity }) => {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100">

      {/* Product Info */}
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-800">{item.name}</p>
        <p className="text-xs text-gray-500">GH₵ {Number(item.price).toFixed(2)} each</p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2 mx-4">
        <button
          onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
          className="w-6 h-6 bg-gray-200 text-gray-700 rounded text-sm font-bold hover:bg-gray-300 transition duration-200"
        >
          -
        </button>
        <span className="text-sm font-medium w-6 text-center">
          {item.quantity}
        </span>
        <button
          onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
          className="w-6 h-6 bg-gray-200 text-gray-700 rounded text-sm font-bold hover:bg-gray-300 transition duration-200"
        >
          +
        </button>
      </div>

      {/* Subtotal */}
      <div className="text-right mr-4">
        <p className="text-sm font-semibold text-gray-800">
          GH₵ {Number(item.subtotal).toFixed(2)}
        </p>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(item._id)}
        className="text-red-500 hover:text-red-600 text-sm font-medium transition duration-200"
      >
        ✕
      </button>

    </div>
  );
};

export default CartItem;