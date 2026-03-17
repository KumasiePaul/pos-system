import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, X, CreditCard, Smartphone, Banknote, LogOut } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useTheme from '../../hooks/useTheme';
import useCart from '../../hooks/useCart';
import Cart from '../../components/sales/Cart';
import { getAllProducts, searchProducts } from '../../services/productService';
import { createSale } from '../../services/salesService';

const POSScreen = () => {
  const { token, user, logout } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const { cartItems, discount, tax, clearCart, addToCart, getGrandTotal } = useCart();

  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amountPaid, setAmountPaid] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => { fetchProducts(); }, []);

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

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      const saleData = {
        items: cartItems.map(item => ({ productId: item._id, quantity: item.quantity })),
        discount, tax, paymentMethod, amountPaid: Number(amountPaid)
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const grandTotal = getGrandTotal();
  const change = Number(amountPaid) - grandTotal;

  const paymentMethods = [
    { id: 'cash', label: 'Cash', icon: Banknote },
    { id: 'mobile_money', label: 'Mobile Money', icon: Smartphone },
    { id: 'card', label: 'Card', icon: CreditCard },
  ];

  return (
    <div className={`h-screen flex flex-col ${isDark ? 'bg-slate-900' : 'bg-gray-100'}`}>

      {/* Header */}
      <div className="bg-blue-800 text-white px-6 py-3 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <ShoppingCart size={22} />
          <div>
            <h1 className="text-lg font-bold">POS System</h1>
            <p className="text-xs text-blue-200">{user?.name} — Cashier</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-sm text-blue-200">
            {new Date().toLocaleDateString('en-GH', {
              weekday: 'long', year: 'numeric',
              month: 'long', day: 'numeric'
            })}
          </p>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-blue-700 hover:bg-red-600 text-white text-sm px-3 py-1.5 rounded-lg transition duration-200"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500 bg-opacity-10 border-b border-red-500 text-red-500 px-6 py-2 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">

        {/* Left — Product Search & Grid */}
        <div className="flex-1 flex flex-col">

          {/* Search Bar */}
          <div className="mb-4 relative">
            <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-gray-400'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search products by name, category or barcode..."
              className={`w-full pl-9 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 shadow ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400'
                  : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400'
              }`}
            />
          </div>

          {/* Product Grid */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className={`text-center py-8 text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                No products found
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {products.map(product => (
                  <button
                    key={product._id}
                    onClick={() => addToCart(product)}
                    disabled={product.quantity === 0}
                    className={`rounded-xl p-4 text-left transition duration-200 shadow ${
                      product.quantity === 0
                        ? `opacity-50 cursor-not-allowed ${isDark ? 'bg-slate-800' : 'bg-white'}`
                        : `${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:bg-blue-50'} hover:shadow-md`
                    }`}
                  >
                    <p className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      {product.name}
                    </p>
                    <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                      {product.category}
                    </p>
                    <p className="text-blue-500 font-bold mt-2 text-sm">
                      GH₵ {Number(product.price).toFixed(2)}
                    </p>
                    <p className={`text-xs mt-1 font-medium ${
                      product.quantity <= 10 ? 'text-red-400' : 'text-green-500'
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
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className={`rounded-2xl shadow-2xl p-6 w-full max-w-md ${isDark ? 'bg-slate-800' : 'bg-white'}`}>

            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-700'}`}>
                Payment
              </h2>
              <button onClick={() => setShowPaymentModal(false)}
                className={`p-1 rounded-lg ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                <X size={18} />
              </button>
            </div>

            {/* Grand Total */}
            <div className={`rounded-xl p-4 mb-4 text-center ${isDark ? 'bg-slate-700' : 'bg-blue-50'}`}>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Grand Total</p>
              <p className="text-3xl font-bold text-blue-500 mt-1">
                GH₵ {grandTotal.toFixed(2)}
              </p>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-4">

              {/* Payment Method */}
              <div>
                <label className={`block text-xs font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {paymentMethods.map(method => {
                    const Icon = method.icon;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id)}
                        className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 text-xs font-medium transition duration-200 ${
                          paymentMethod === method.id
                            ? 'border-blue-500 bg-blue-500 bg-opacity-20 text-blue-500'
                            : `${isDark ? 'border-slate-600 text-slate-300 hover:border-blue-500' : 'border-gray-200 text-gray-600 hover:border-blue-400'}`
                        }`}
                      >
                        <Icon size={20} />
                        {method.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Amount Paid */}
              <div>
                <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
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
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${
                    isDark
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
                />
              </div>

              {/* Change */}
              {amountPaid && Number(amountPaid) >= grandTotal && (
                <div className={`rounded-xl p-3 flex justify-between items-center ${
                  isDark ? 'bg-green-500 bg-opacity-10 border border-green-500 border-opacity-30' : 'bg-green-50 border border-green-200'
                }`}>
                  <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>Change</span>
                  <span className="text-lg font-bold text-green-500">
                    GH₵ {change.toFixed(2)}
                  </span>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={processing}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium text-sm transition duration-200 disabled:opacity-50"
                >
                  {processing ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <CreditCard size={16} />
                  )}
                  {processing ? 'Processing...' : 'Complete Sale'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className={`flex-1 py-3 rounded-xl font-medium text-sm transition duration-200 ${
                    isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
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