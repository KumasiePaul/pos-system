import { useState, useEffect } from 'react';
import { Plus, Search, X } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useTheme from '../../hooks/useTheme';
import {
  getAllProducts, createProduct, updateProduct, searchProducts
} from '../../services/productService';
import ProductTable from '../../components/products/ProductTable';
import ProductForm from '../../components/products/ProductForm';

const ProductManagement = () => {
  const { token } = useAuth();
  const { isDark } = useTheme();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const card = `rounded-xl shadow p-4 ${isDark ? 'bg-slate-800' : 'bg-white'}`;
  const heading = `text-2xl font-bold ${isDark ? 'text-white' : 'text-blue-800'}`;
  const input = `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${
    isDark
      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
      : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
  }`;

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

  const handleSubmit = async (formData) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id, formData, token);
        setSuccess('Product updated successfully!');
      } else {
        await createProduct(formData, token);
        setSuccess('Product added successfully!');
      }
      setShowForm(false);
      setEditingProduct(null);
      fetchProducts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
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

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className={heading}>Product Management</h1>
        <button
          onClick={() => { setShowForm(true); setEditingProduct(null); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200 shadow"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-500 bg-opacity-10 border border-green-500 text-green-500 p-3 rounded-lg mb-4 text-sm">
          ✅ {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 p-3 rounded-lg mb-4 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Add / Edit Form */}
      {showForm && (
        <div className={`${card} mb-6`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-700'}`}>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <button
              onClick={() => { setShowForm(false); setEditingProduct(null); }}
              className={`p-1 rounded-lg transition duration-200 ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-gray-100 text-gray-500'}`}
            >
              <X size={18} />
            </button>
          </div>
          <ProductForm
            onSubmit={handleSubmit}
            initialData={editingProduct}
            onCancel={() => { setShowForm(false); setEditingProduct(null); }}
          />
        </div>
      )}

      {/* Search Bar */}
      <div className={`${card} mb-6`}>
        <div className="relative">
          <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-gray-400'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search by name, category or barcode..."
            className={`${input} pl-9`}
          />
        </div>
      </div>

      {/* Product Table */}
      <div className={card}>
        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Loading products...</p>
          </div>
        ) : (
          <ProductTable
            products={products}
            onEdit={handleEdit}
            onDelete={null}
          />
        )}
      </div>

    </div>
  );
};

export default ProductManagement;