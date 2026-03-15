import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts
} from '../../services/productService';
import ProductTable from '../../components/products/ProductTable';
import ProductForm from '../../components/products/ProductForm';
import ProductSearch from '../../components/products/ProductSearch';

const ProductManagement = () => {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Fetch all products on load
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

  // Handle add or update product
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

  // Handle edit button click
  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  // Handle delete button click
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id, token);
      setSuccess('Product deleted successfully!');
      fetchProducts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete product');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Handle search
  const handleSearch = async (query) => {
    try {
      const data = await searchProducts(query, token);
      setProducts(data);
    } catch (err) {
      setError('Search failed');
    }
  };

  // Handle clear search
  const handleClear = () => {
    fetchProducts();
  };

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-800">Product Management</h1>
        <button
          onClick={() => { setShowForm(true); setEditingProduct(null); }}
          className="bg-blue-800 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 transition duration-200"
        >
          + Add Product
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-100 text-green-600 p-3 rounded mb-4 text-sm">
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Add / Edit Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h2>
          <ProductForm
            onSubmit={handleSubmit}
            initialData={editingProduct}
            onCancel={() => { setShowForm(false); setEditingProduct(null); }}
          />
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <ProductSearch onSearch={handleSearch} onClear={handleClear} />
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-lg shadow p-4">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading products...</div>
        ) : (
          <ProductTable
            products={products}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

    </div>
  );
};

export default ProductManagement;