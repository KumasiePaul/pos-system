import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Sun, Moon, LogOut, User, X, AlertTriangle } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useTheme from '../../hooks/useTheme';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutConfirm = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <div className="bg-blue-800 text-white px-6 py-3 flex justify-between items-center shadow-md">

        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="text-white hover:text-blue-200 transition duration-200 p-1 rounded hover:bg-blue-700"
          >
            <Menu size={22} />
          </button>
          <h1 className="text-lg font-bold tracking-wide">POS System</h1>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-blue-700 hover:bg-blue-600 transition duration-200"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* User Info */}
          <div className="flex items-center gap-2">
            <div className="bg-blue-700 p-2 rounded-full">
              <User size={16} />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium leading-none">{user?.name}</p>
              <p className="text-xs text-blue-200 capitalize mt-0.5">{user?.role}</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-2 bg-blue-700 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg transition duration-200"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>

        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className={`rounded-2xl shadow-2xl p-6 w-full max-w-sm ${isDark ? 'bg-slate-800' : 'bg-white'}`}>

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-red-500 bg-opacity-20 rounded-full p-2">
                  <AlertTriangle size={20} className="text-red-500" />
                </div>
                <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-700'}`}>
                  Confirm Logout
                </h2>
              </div>
              <button
                onClick={() => setShowLogoutModal(false)}
                className={`p-1 rounded-lg ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-gray-100 text-gray-500'}`}
              >
                <X size={18} />
              </button>
            </div>

            {/* Message */}
            <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
              Are you sure you want to log out? Any unsaved changes will be lost.
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleLogoutConfirm}
                className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl text-sm font-medium transition duration-200"
              >
                <LogOut size={16} />
                Yes, Logout
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition duration-200 ${
                  isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;