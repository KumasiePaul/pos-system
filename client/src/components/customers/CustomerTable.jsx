const CustomerTable = ({ customers, onEdit, onDelete, onUpdatePoints }) => {
  if (customers.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No customers found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-blue-800 text-white">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Address</th>
            <th className="px-4 py-3">Loyalty Points</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer, index) => (
            <tr
              key={customer._id}
              className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
            >
              <td className="px-4 py-3 font-medium text-gray-800">
                {customer.name}
              </td>
              <td className="px-4 py-3 text-gray-600">
                {customer.phone}
              </td>
              <td className="px-4 py-3 text-gray-600">
                {customer.email || '—'}
              </td>
              <td className="px-4 py-3 text-gray-600">
                {customer.address || '—'}
              </td>
              <td className="px-4 py-3">
                <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-medium">
                  ⭐ {customer.loyaltyPoints} pts
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(customer)}
                    className="bg-yellow-400 text-white px-3 py-1 rounded text-xs font-medium hover:bg-yellow-500 transition duration-200"
                  >
                    Edit
                  </button>
                  {onUpdatePoints && (
                    <button
                      onClick={() => onUpdatePoints(customer)}
                      className="bg-green-500 text-white px-3 py-1 rounded text-xs font-medium hover:bg-green-600 transition duration-200"
                    >
                      Points
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(customer._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-xs font-medium hover:bg-red-600 transition duration-200"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable;