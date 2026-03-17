import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const UnauthorizedPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (user?.role === 'admin') navigate('/admin/dashboard');
    else if (user?.role === 'manager') navigate('/manager/dashboard');
    else navigate('/cashier/pos');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md w-full">
        <p className="text-6xl mb-4">⛔</p>
        <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
        <p className="text-gray-500 text-sm mb-6">
          You don't have permission to access this page.
          Please contact your administrator if you think this is a mistake.
        </p>
        <button
          onClick={handleGoBack}
          className="bg-blue-800 text-white px-6 py-2 rounded font-medium hover:bg-blue-700 transition duration-200"
        >
          Go Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;