import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
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
          className="text-white hover:text-blue-200 transition duration-200"
        >
          ☰
        </button>
        <h1 className="text-lg font-bold">POS System</h1>
      </div>

      {/* Right — User info and logout */}
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium">{user?.name}</p>
          <p className="text-xs text-blue-200 capitalize">{user?.role}</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-blue-700 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded transition duration-200"
        >
          Logout
        </button>
      </div>

    </div>
  );
};

export default Navbar;