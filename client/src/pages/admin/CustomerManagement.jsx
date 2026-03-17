import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import {
  getAllCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  updateLoyaltyPoints,
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

  // Loyalty points modal
  const [showPointsModal, setShowPointsModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [points, setPoints] = useState('');

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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    try {
      await deleteCustomer(id, token);
      setSuccess('Customer deleted successfully!');
      fetchCustomers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete customer');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleUpdatePoints = (customer) => {
    setSelectedCustomer(customer);
    setPoints('');
    setShowPointsModal(true);
  };

  const handlePointsSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateLoyaltyPoints(selectedCustomer._id, Number(points), token);
      setSuccess('Loyalty points updated successfully!');
      setShowPointsModal(false);
      fetchCustomers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update loyalty points');
      setTimeout(() => setError(''), 3000);
    }
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
            onDelete={handleDelete}
            onUpdatePoints={handleUpdatePoints}
          />
        )}
      </div>

      {/* Loyalty Points Modal */}
      {showPointsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Update Loyalty Points
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Customer: <span className="font-semibold text-gray-700">{selectedCustomer?.name}</span>
              <br />
              Current Points: <span className="font-semibold text-yellow-600">⭐ {selectedCustomer?.loyaltyPoints}</span>
            </p>
            <form onSubmit={handlePointsSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Points to Add (use negative to subtract)
                </label>
                <input
                  type="number"
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  required
                  placeholder="e.g. 50 or -10"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-green-500 text-white py-2 rounded text-sm font-medium hover:bg-green-600 transition duration-200"
                >
                  Update Points
                </button>
                <button
                  type="button"
                  onClick={() => setShowPointsModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded text-sm font-medium hover:bg-gray-300 transition duration-200"
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

export default CustomerManagement;