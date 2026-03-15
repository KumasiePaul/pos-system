import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

// Auth Pages
import Login from '../pages/auth/Login';

// Product Pages
import AdminProductManagement from '../pages/admin/ProductManagement';
import ManagerProductManagement from '../pages/manager/ProductManagement';

// Inventory Pages
import AdminInventoryManagement from '../pages/admin/InventoryManagement';
import ManagerInventoryManagement from '../pages/manager/InventoryManagement';

// Placeholder pages
const AdminDashboard = () => <div className="p-8 text-2xl font-bold text-blue-800">Admin Dashboard 🛠️ Coming Soon</div>;
const ManagerDashboard = () => <div className="p-8 text-2xl font-bold text-blue-800">Manager Dashboard 🛠️ Coming Soon</div>;
const CashierPOS = () => <div className="p-8 text-2xl font-bold text-blue-800">Cashier POS Screen 🛠️ Coming Soon</div>;
const Unauthorized = () => <div className="p-8 text-2xl font-bold text-red-600">Unauthorized ⛔ You do not have access to this page</div>;

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-8">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" />;

  return children;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/products" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminProductManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/inventory" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminInventoryManagement />
          </ProtectedRoute>
        } />

        {/* Manager Routes */}
        <Route path="/manager/dashboard" element={
          <ProtectedRoute allowedRoles={['admin', 'manager']}>
            <ManagerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/manager/products" element={
          <ProtectedRoute allowedRoles={['admin', 'manager']}>
            <ManagerProductManagement />
          </ProtectedRoute>
        } />
        <Route path="/manager/inventory" element={
          <ProtectedRoute allowedRoles={['admin', 'manager']}>
            <ManagerInventoryManagement />
          </ProtectedRoute>
        } />

        {/* Cashier Routes */}
        <Route path="/cashier/pos" element={
          <ProtectedRoute allowedRoles={['admin', 'manager', 'cashier']}>
            <CashierPOS />
          </ProtectedRoute>
        } />

        {/* Default */}
        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;