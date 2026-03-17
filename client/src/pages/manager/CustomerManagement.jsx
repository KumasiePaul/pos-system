import { useState, useEffect } from 'react';
import { Plus, Search, X } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useTheme from '../../hooks/useTheme';
import {
  getAllCustomers, createCustomer, updateCustomer, searchCustomers
} from '../../services/customerService';
import CustomerTable from '../../components/customers/CustomerTable';
import CustomerForm from '../../components/customers/CustomerForm';

const CustomerManagement = () => {
  const { token } = useAuth();
  const { isDark } = useTheme();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const card = `rounded-xl shadow p-4 ${isDark ? 'bg-slate-800' : 'bg-white'}`;
  const input = `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${
    isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-gray-300 text-gray-800'
  }`;

  useEffect(() => { fetchCustomers(); }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await getAllCustomers(token);
      setCustomers(data);
    } catch (err) {
      setError('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingCustomer) {
        await updateCustomer(editingCustomer._id, formData, token);
        setSuccess('Customer updated successfully!');
      } else {
        await createCustomer(formData, token);
        setSuccess('Customer registered successfully!');
      }
      setShowForm(false);
      setEditingCustomer(null);
      fetchCustomers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim()) {
      try {
        const data = await searchCustomers(query, token);
        setCustomers(data);
      } catch (err) {
        setError('Search failed');
      }
    } else {
      fetchCustomers();
    }
  };

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-blue-800'}`}>
          Customer Management
        </h1>
        <button
          onClick={() => { setShowForm(true); setEditingCustomer(null); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200 shadow"
        >
          <Plus size={16} />
          Register Customer
        </button>
      </div>

      {success && (
        <div className="bg-green-500 bg-opacity-10 border border-green-500 text-green-500 p-3 rounded-lg mb-4 text-sm">
          ✅ {success}
        </div>
      )}
      {error && (
        <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 p-3 rounded-lg mb-4 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className={`${card} mb-6`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-700'}`}>
              {editingCustomer ? 'Edit Customer' : 'Register New Customer'}
            </h2>
            <button
              onClick={() => { setShowForm(false); setEditingCustomer(null); }}
              className={`p-1 rounded-lg ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-gray-100 text-gray-500'}`}
            >
              <X size={18} />
            </button>
          </div>
          <CustomerForm
            onSubmit={handleSubmit}
            initialData={editingCustomer}
            onCancel={() => { setShowForm(false); setEditingCustomer(null); }}
          />
        </div>
      )}

      {/* Search */}
      <div className={`${card} mb-6`}>
        <div className="relative">
          <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-gray-400'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search by name, phone or email..."
            className={`${input} pl-9`}
          />
        </div>
      </div>

      {/* Table */}
      <div className={card}>
        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Loading customers...</p>
          </div>
        ) : (
          <CustomerTable
            customers={customers}
            onEdit={handleEdit}
            onDelete={null}
            onUpdatePoints={null}
          />
        )}
      </div>

    </div>
  );
};

export default CustomerManagement;