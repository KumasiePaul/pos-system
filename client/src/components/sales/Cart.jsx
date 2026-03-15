import useCart from '../../hooks/useCart';
import CartItem from './CartItem';
import DiscountInput from './DiscountInput';

const Cart = ({ onCheckout }) => {
  const {
    cartItems,
    discount,
    tax,
    setDiscount,
    setTax,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,
    getGrandTotal
  } = useCart();

  const total = getTotal();
  const discountAmount = (total * discount) / 100;
  const taxAmount = (total * tax) / 100;
  const grandTotal = getGrandTotal();

  return (
    <div className="bg-white rounded-lg shadow h-full flex flex-col">

      {/* Cart Header */}
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-bold text-blue-800">
          Cart ({cartItems.length} items)
        </h2>
        {cartItems.length > 0 && (
          <button
            onClick={clearCart}
            className="text-red-500 text-xs hover:text-red-600 transition duration-200"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4">
        {cartItems.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p className="text-4xl mb-2">🛒</p>
            <p className="text-sm">Cart is empty</p>
            <p className="text-xs mt-1">Search and add products</p>
          </div>
        ) : (
          cartItems.map(item => (
            <CartItem
              key={item._id}
              item={item}
              onRemove={removeFromCart}
              onUpdateQuantity={updateQuantity}
            />
          ))
        )}
      </div>

      {/* Cart Summary */}
      {cartItems.length > 0 && (
        <div className="p-4 border-t border-gray-100">

          {/* Discount and Tax inputs */}
          <DiscountInput
            discount={discount}
            tax={tax}
            onDiscountChange={setDiscount}
            onTaxChange={setTax}
          />

          {/* Totals */}
          <div className="mt-3 space-y-1">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>GH₵ {total.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount ({discount}%)</span>
                <span>- GH₵ {discountAmount.toFixed(2)}</span>
              </div>
            )}
            {tax > 0 && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tax ({tax}%)</span>
                <span>+ GH₵ {taxAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold text-gray-800 border-t border-gray-200 pt-2 mt-2">
              <span>Grand Total</span>
              <span>GH₵ {grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            onClick={onCheckout}
            className="w-full bg-blue-800 text-white py-3 rounded font-medium mt-4 hover:bg-blue-700 transition duration-200"
          >
            Proceed to Payment
          </button>

        </div>
      )}

    </div>
  );
};

export default Cart;