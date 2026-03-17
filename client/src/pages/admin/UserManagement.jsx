import { useState, useEffect } from 'react';
import { Plus, X, Pencil, Trash2, UserCog } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useTheme from '../../hooks/useTheme';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

const UserManagement = () => {
  const { token } = useAuth();
  const { isDark } = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'cashier'
  });

  const card = `rounded-xl shadow p-4 ${isDark ? 'bg-slate-800' : 'bg-white'}`;
  const input = `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${
    isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-gray-300 text-gray-800'
  }`;
  const label = `block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-300' : 'text-gray-700'}`;
  const th = `px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider`;
  const td = `px-4 py-3 text-sm`;

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await axios.put(`${API_URL}/${editingUser._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('User updated successfully!');
      } else {
        await axios.post(API_URL, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('User created successfully!');
      }
      setShowForm(false);
      setEditingUser(null);
      setFormData({ name: '', email: '', password: '', role: 'cashier' });
      fetchUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, password: '', role: user.role });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('User deleted successfully!');
      fetchUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
      setTimeout(() => setError(''), 3000);
    }
  };

  const getRoleBadge = (role) => {
    const styles = {
      admin: 'bg-red-500 text-white',
      manager: 'bg-blue-500 text-white',
      cashier: 'bg-green-500 text-white'
    };
    return `px-2 py-1 rounded-lg text-xs font-semibold ${styles[role]}`;
  };

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-blue-800'}`}>
          User Management
        </h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingUser(null);
            setFormData({ name: '', email: '', password: '', role: 'cashier' });
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200 shadow"
        >
          <Plus size={16} />
          Add User
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
              {editingUser ? 'Edit User' : 'Add New User'}
            </h2>
            <button
              onClick={() => { setShowForm(false); setEditingUser(null); }}
              className={`p-1 rounded-lg ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-gray-100 text-gray-500'}`}
            >
              <X size={18} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>Full Name *</label>
              <input type="text" value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required placeholder="Enter full name" className={input} />
            </div>
            <div>
              <label className={label}>Email Address *</label>
              <input type="email" value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required placeholder="Enter email address" className={input} />
            </div>
            <div>
              <label className={label}>
                Password {editingUser ? '(leave blank to keep current)' : '*'}
              </label>
              <input type="password" value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required={!editingUser} placeholder="Enter password" className={input} />
            </div>
            <div>
              <label className={label}>Role *</label>
              <select value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className={input}>
                <option value="cashier">Cashier</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="col-span-2 flex gap-3 pt-2">
              <button type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition duration-200">
                {editingUser ? 'Update User' : 'Create User'}
              </button>
              <button type="button"
                onClick={() => { setShowForm(false); setEditingUser(null); }}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                  isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users Table */}
      <div className={card}>
        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Loading users...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className={isDark ? 'bg-slate-700' : 'bg-blue-800'}>
                <tr>
                  {['Name', 'Email', 'Role', 'Created', 'Actions'].map(h => (
                    <th key={h} className={`${th} ${isDark ? 'text-slate-300' : 'text-white'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id}
                    className={`transition duration-150 ${
                      isDark
                        ? index % 2 === 0 ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-900 hover:bg-slate-700'
                        : index % 2 === 0 ? 'bg-white hover:bg-blue-50' : 'bg-gray-50 hover:bg-blue-50'
                    }`}>
                    <td className={`${td} font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-600 rounded-full p-1.5">
                          <UserCog size={12} className="text-white" />
                        </div>
                        {user.name}
                      </div>
                    </td>
                    <td className={`${td} ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>{user.email}</td>
                    <td className={td}>
                      <span className={getRoleBadge(user.role)}>{user.role}</span>
                    </td>
                    <td className={`${td} ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className={td}>
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(user)}
                          className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition duration-200">
                          <Pencil size={12} />
                          Edit
                        </button>
                        <button onClick={() => handleDelete(user._id)}
                          className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition duration-200">
                          <Trash2 size={12} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default UserManagement;