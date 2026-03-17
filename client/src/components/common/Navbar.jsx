import { useNavigate } from 'react-router-dom';
import { Menu, Sun, Moon, LogOut, User } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useTheme from '../../hooks/useTheme';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="bg-blue-800 text-white px-6 py-3 flex justify-between items-center shadow-md">

      {/* Left — Menu button and Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="text-white hover:text-blue-200 transition duration-200 p-1 rounded hover:bg-blue-700"
        >
          <Menu size={22} />
        </button>
        <h1 className="text-lg font-bold tracking-wide">POS System</h1>
      </div>

      {/* Right — Theme toggle, User info and logout */}
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
          onClick={handleLogout}
          className="flex items-center gap-2 bg-blue-700 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg transition duration-200"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>

      </div>

    </div>
  );
};

export default Navbar;