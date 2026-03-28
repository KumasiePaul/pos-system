import { useState, useEffect } from 'react';
import { Plus, Search, X, Pencil } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const input = `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${
    isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
  }`;
  const modalBg = `fixed inset-0 flex items-center justify-center z-50 px-4 backdrop-blur-sm bg-black/30`;
  const modalBox = `w-full max-w-lg rounded-2xl shadow-2xl p-6 ${isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white'}`;

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts(token);
      setProducts(data);
    } catch {
      notify('error', 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const notify = (type, msg) => {
    if (type === 'success') { setSuccess(msg); setTimeout(() => setSuccess(''), 3000); }
    else { setError(msg); setTimeout(() => setError(''), 3000); }
  };

  const openAddModal = () => { setEditingProduct(null); setShowFormModal(true); };
  const openEditModal = (product) => { setEditingProduct(product); setShowFormModal(true); };

  const handleSubmit = async (formData) => {
    setFormLoading(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id, formData, token);
        notify('success', 'Product updated successfully!');
      } else {
        await createProduct(formData, token);
        notify('success', 'Product added successfully!');
      }
      setShowFormModal(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      notify('error', err.response?.data?.message || 'Operation failed');
    } finally {
      setFormLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim()) {
      try {
        const data = await searchProducts(query, token);
        setProducts(data);
      } catch {
        notify('error', 'Search failed');
      }
    } else {
      fetchProducts();
    }
  };

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-blue-800'}`}>Product Management</h1>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200 shadow"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">✅ {success}</div>}
      {error   && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">⚠️ {error}</div>}

      {/* Search */}
      <div className={`rounded-xl shadow p-4 mb-6 ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
        <div className="relative">
          <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-gray-400'}`} />
          <input type="text" value={searchQuery} onChange={handleSearch}
            placeholder="Search by name, category or barcode..." className={`${input} pl-9`} />
        </div>
      </div>

      {/* Table */}
      <div className={`rounded-xl shadow p-4 ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Loading products...</p>
          </div>
        ) : (
          <ProductTable products={products} onEdit={openEditModal} onDelete={null} />
        )}
      </div>

      {/* Add / Edit Modal */}
      {showFormModal && (
        <div className={modalBg}>
          <div className={modalBox}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${editingProduct ? 'bg-yellow-100' : 'bg-blue-100'}`}>
                  {editingProduct ? <Pencil size={18} className="text-yellow-600" /> : <Plus size={18} className="text-blue-600" />}
                </div>
                <div>
                  <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  {editingProduct && <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{editingProduct.name}</p>}
                </div>
              </div>
              <button onClick={() => { setShowFormModal(false); setEditingProduct(null); }}
                className={`p-1 rounded-lg transition ${isDark ? 'text-slate-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}>
                <X size={18} />
              </button>
            </div>
            <ProductForm
              onSubmit={handleSubmit}
              initialData={editingProduct}
              onCancel={() => { setShowFormModal(false); setEditingProduct(null); }}
              loading={formLoading}
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductManagement;
