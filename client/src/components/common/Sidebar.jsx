import { NavLink } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const Sidebar = ({ isOpen }) => {
  const { user } = useAuth();

  const adminLinks = [
    { path: '/admin/dashboard', label: '🏠 Dashboard' },
    { path: '/admin/products', label: '📦 Products' },
    { path: '/admin/inventory', label: '🏭 Inventory' },
    { path: '/admin/customers', label: '👥 Customers' },
    { path: '/admin/reports', label: '📊 Reports' },
    { path: '/admin/users', label: '👤 User Management' },
    { path: '/admin/backup', label: '💾 Backup & Recovery' },
  ];

  const managerLinks = [
    { path: '/manager/dashboard', label: '🏠 Dashboard' },
    { path: '/manager/products', label: '📦 Products' },
    { path: '/manager/inventory', label: '🏭 Inventory' },
    { path: '/manager/customers', label: '👥 Customers' },
    { path: '/manager/reports', label: '📊 Reports' },
  ];

  const cashierLinks = [
    { path: '/cashier/pos', label: '🧾 POS Screen' },
  ];

  const getLinks = () => {
    if (user?.role === 'admin') return adminLinks;
    if (user?.role === 'manager') return managerLinks;
    return cashierLinks;
  };

  return (
    <div className={`bg-gray-900 text-white h-full transition-all duration-300 ${
      isOpen ? 'w-56' : 'w-0 overflow-hidden'
    }`}>
      <div className="p-4">

        {/* User Info */}
        <div className="bg-gray-800 rounded-lg p-3 mb-6">
          <p className="text-sm font-semibold">{user?.name}</p>
          <p className="text-xs text-gray-400 capitalize mt-1">{user?.role}</p>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {getLinks().map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `block px-3 py-2 rounded text-sm transition duration-200 ${
                  isActive
                    ? 'bg-blue-800 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

      </div>
    </div>
  );
};

export default Sidebar;