import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import {
  getAllCustomers,
  createCustomer,
  updateCustomer,
  searchCustomers
} from '../../services/customerService';
import CustomerTable from '../../components/customers/CustomerTable';
import CustomerForm from '../../components/customers/CustomerForm';

const CustomerManagement = () => {
  const { token } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

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
        <h1 className="text-2xl font-bold text-blue-800">Customer Management</h1>
        <button
          onClick={() => { setShowForm(true); setEditingCustomer(null); }}
          className="bg-blue-800 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 transition duration-200"
        >
          + Register Customer
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
            {editingCustomer ? 'Edit Customer' : 'Register New Customer'}
          </h2>
          <CustomerForm
            onSubmit={handleSubmit}
            initialData={editingCustomer}
            onCancel={() => { setShowForm(false); setEditingCustomer(null); }}
          />
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search by name, phone or email..."
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-lg shadow p-4">
        {loading ? (
          <div className="text-center py-8 text-gray-500">
            Loading customers...
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