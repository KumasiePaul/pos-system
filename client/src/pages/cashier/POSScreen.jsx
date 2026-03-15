import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import Cart from '../../components/sales/Cart';
import { getAllProducts, searchProducts } from '../../services/productService';
import { createSale } from '../../services/salesService';

const POSScreen = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const {
    cartItems,
    discount,
    tax,
    clearCart,
    addToCart,
    getGrandTotal
  } = useCart();

  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Payment modal
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amountPaid, setAmountPaid] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts(token);
      setProducts(data);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim()) {
      try {
        const data = await searchProducts(query, token);
        setProducts(data);
      } catch (err) {
        setError('Search failed');
      }
    } else {
      fetchProducts();
    }
  };

  // Handle checkout
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      setError('Cart is empty!');
      setTimeout(() => setError(''), 3000);
      return;
    }
    setAmountPaid('');
    setPaymentMethod('cash');
    setShowPaymentModal(true);
  };

  // Handle payment submission
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const saleData = {
        items: cartItems.map(item => ({
          productId: item._id,
          quantity: item.quantity
        })),
        discount,
        tax,
        paymentMethod,
        amountPaid: Number(amountPaid)
      };

      const result = await createSale(saleData, token);
      clearCart();
      setShowPaymentModal(false);
      navigate('/cashier/receipt', { state: { sale: result.sale } });
    } catch (err) {
      setError(err.response?.data?.message || 'Sale failed. Try again.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setProcessing(false);
    }
  };

  const grandTotal = getGrandTotal();
  const change = Number(amountPaid) - grandTotal;

  return (
    <div className="h-screen bg-gray-100 flex flex-col">

      {/* Header */}
      <div className="bg-blue-800 text-white px-6 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold">POS System</h1>
        <p className="text-sm opacity-75">
          {new Date().toLocaleDateString('en-GH', {
            weekday: 'long', year: 'numeric',
            month: 'long', day: 'numeric'
          })}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-600 px-6 py-2 text-sm">
          {error}
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">

        {/* Left — Product Search & Grid */}
        <div className="flex-1 flex flex-col">

          {/* Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search products by name, category or barcode..."
              className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:outline-none focus:border-blue-500 bg-white shadow"
            />
          </div>

          {/* Product Grid */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="text-center py-8 text-gray-500">
                Loading products...
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No products found
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {products.map(product => (
                  <button
                    key={product._id}
                    onClick={() => addToCart(product)}
                    disabled={product.quantity === 0}
                    className={`bg-white rounded-lg shadow p-4 text-left hover:shadow-md transition duration-200 ${
                      product.quantity === 0
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:border-blue-500 border border-transparent'
                    }`}
                  >
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {product.category}
                    </p>
                    <p className="text-blue-800 font-bold mt-2">
                      GH₵ {Number(product.price).toFixed(2)}
                    </p>
                    <p className={`text-xs mt-1 ${
                      product.quantity <= 10
                        ? 'text-red-500'
                        : 'text-green-600'
                    }`}>
                      Stock: {product.quantity}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right — Cart */}
        <div className="w-80">
          <Cart onCheckout={handleCheckout} />
        </div>

      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Payment
            </h2>

            {/* Grand Total */}
            <div className="bg-blue-50 rounded p-4 mb-4 text-center">
              <p className="text-sm text-gray-600">Grand Total</p>
              <p className="text-3xl font-bold text-blue-800">
                GH₵ {grandTotal.toFixed(2)}
              </p>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-4">

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['cash', 'mobile_money', 'card'].map(method => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`py-2 px-3 rounded text-sm font-medium border transition duration-200 ${
                        paymentMethod === method
                          ? 'bg-blue-800 text-white border-blue-800'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                      }`}
                    >
                      {method === 'cash' ? '💵 Cash' :
                       method === 'mobile_money' ? '📱 Mobile' : '💳 Card'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Paid */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount Paid (GH₵)
                </label>
                <input
                  type="number"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  required
                  min={grandTotal}
                  step="0.01"
                  placeholder="0.00"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Change */}
              {amountPaid && Number(amountPaid) >= grandTotal && (
                <div className="bg-green-50 rounded p-3 flex justify-between items-center">
                  <span className="text-sm text-gray-600">Change</span>
                  <span className="text-lg font-bold text-green-600">
                    GH₵ {change.toFixed(2)}
                  </span>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={processing}
                  className="flex-1 bg-blue-800 text-white py-3 rounded font-medium hover:bg-blue-700 transition duration-200 disabled:opacity-50"
                >
                  {processing ? 'Processing...' : 'Complete Sale'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded font-medium hover:bg-gray-300 transition duration-200"
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

export default POSScreen;