import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Layout from '../components/common/Layout';

// Auth Pages
import Login from '../pages/auth/Login';
import UnauthorizedPage from '../pages/auth/UnauthorizedPage';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminProductManagement from '../pages/admin/ProductManagement';
import AdminInventoryManagement from '../pages/admin/InventoryManagement';
import AdminCustomerManagement from '../pages/admin/CustomerManagement';
import AdminReports from '../pages/admin/Reports';
import EndOfDayReport from '../pages/admin/EndOfDayReport';
import UserManagement from '../pages/admin/UserManagement';
import BackupRecovery from '../pages/admin/BackupRecovery';

// Manager Pages
import ManagerDashboard from '../pages/manager/ManagerDashboard';
import ManagerProductManagement from '../pages/manager/ProductManagement';
import ManagerInventoryManagement from '../pages/manager/InventoryManagement';
import ManagerCustomerManagement from '../pages/manager/CustomerManagement';
import ManagerReports from '../pages/manager/Reports';

// Cashier Pages
import POSScreen from '../pages/cashier/POSScreen';
import ReceiptScreen from '../pages/cashier/ReceiptScreen';

// Protected Route with Layout
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" />;
  return <Layout>{children}</Layout>;
};

// Protected Route without Layout (for POS and Receipt)
const ProtectedRoutePOS = ({ children, allowedRoles }) => {
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
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

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
        <Route path="/admin/customers" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminCustomerManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/reports" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminReports />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <UserManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/backup" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <BackupRecovery />
          </ProtectedRoute>
        } />
        <Route path="/admin/end-of-day" element={
          <ProtectedRoute allowedRoles={['admin', 'manager']}>
            <EndOfDayReport />
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
        <Route path="/manager/customers" element={
          <ProtectedRoute allowedRoles={['admin', 'manager']}>
            <ManagerCustomerManagement />
          </ProtectedRoute>
        } />
        <Route path="/manager/reports" element={
          <ProtectedRoute allowedRoles={['admin', 'manager']}>
            <ManagerReports />
          </ProtectedRoute>
        } />

        {/* Cashier Routes - No Layout */}
        <Route path="/cashier/pos" element={
          <ProtectedRoutePOS allowedRoles={['admin', 'manager', 'cashier']}>
            <POSScreen />
          </ProtectedRoutePOS>
        } />
        <Route path="/cashier/receipt" element={
          <ProtectedRoutePOS allowedRoles={['admin', 'manager', 'cashier']}>
            <ReceiptScreen />
          </ProtectedRoutePOS>
        } />

        {/* Default */}
        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;