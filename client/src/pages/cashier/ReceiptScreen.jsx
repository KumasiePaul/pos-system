import { useLocation, useNavigate } from 'react-router-dom';

const ReceiptScreen = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const sale = state?.sale;

  if (!sale) {
    navigate('/cashier/pos');
    return null;
  }

  const handleNewSale = () => {
    navigate('/cashier/pos');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">

        {/* Receipt Header */}
        <div className="text-center p-6 border-b border-dashed border-gray-300">
          <h1 className="text-2xl font-bold text-blue-800">POS System</h1>
          <p className="text-gray-500 text-sm mt-1">Official Receipt</p>
          <p className="text-gray-400 text-xs mt-1">
            {new Date(sale.createdAt).toLocaleString('en-GH', {
              weekday: 'long', year: 'numeric',
              month: 'long', day: 'numeric',
              hour: '2-digit', minute: '2-digit'
            })}
          </p>
        </div>

        {/* Transaction Info */}
        <div className="p-4 border-b border-dashed border-gray-300">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Transaction ID</span>
            <span className="font-mono">{sale._id.slice(-8).toUpperCase()}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Cashier</span>
            <span>{sale.cashier?.name}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Payment Method</span>
            <span className="capitalize">
              {sale.paymentMethod === 'mobile_money' ? 'Mobile Money' : sale.paymentMethod}
            </span>
          </div>
        </div>

        {/* Items */}
        <div className="p-4 border-b border-dashed border-gray-300">
          <p className="text-xs font-semibold text-gray-600 mb-3 uppercase">Items Purchased</p>
          {sale.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center mb-2">
              <div>
                <p className="text-sm font-medium text-gray-800">{item.name}</p>
                <p className="text-xs text-gray-500">
                  {item.quantity} x GH₵ {Number(item.price).toFixed(2)}
                </p>
              </div>
              <p className="text-sm font-semibold text-gray-800">
                GH₵ {Number(item.subtotal).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="p-4 border-b border-dashed border-gray-300 space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span>GH₵ {Number(sale.totalAmount).toFixed(2)}</span>
          </div>
          {sale.discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount</span>
              <span>- GH₵ {Number(sale.discount).toFixed(2)}</span>
            </div>
          )}
          {sale.tax > 0 && (
            <div className="flex justify-between text-sm text-gray-600">
              <span>Tax</span>
              <span>+ GH₵ {Number(sale.tax).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-bold text-gray-800 border-t border-gray-200 pt-2">
            <span>Grand Total</span>
            <span>GH₵ {Number(sale.grandTotal).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Amount Paid</span>
            <span>GH₵ {Number(sale.amountPaid).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm font-semibold text-blue-800">
            <span>Change</span>
            <span>GH₵ {Number(sale.change).toFixed(2)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center p-4 border-b border-dashed border-gray-300">
          <p className="text-xs text-gray-400">Thank you for your purchase!</p>
          <p className="text-xs text-gray-400 mt-1">Please come again 😊</p>
        </div>

        {/* Action Buttons */}
        <div className="p-4 flex gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 bg-gray-200 text-gray-700 py-2 rounded font-medium text-sm hover:bg-gray-300 transition duration-200"
          >
            🖨️ Print Receipt
          </button>
          <button
            onClick={handleNewSale}
            className="flex-1 bg-blue-800 text-white py-2 rounded font-medium text-sm hover:bg-blue-700 transition duration-200"
          >
            + New Sale
          </button>
        </div>

      </div>
    </div>
  );
};

export default ReceiptScreen;