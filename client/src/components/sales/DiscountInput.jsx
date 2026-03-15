const DiscountInput = ({ discount, tax, onDiscountChange, onTaxChange }) => {
  return (
    <div className="border-t border-gray-100 pt-3 mt-3">
      <div className="flex gap-4">

        {/* Discount */}
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Discount (%)
          </label>
          <input
            type="number"
            value={discount}
            onChange={(e) => onDiscountChange(Number(e.target.value))}
            min="0"
            max="100"
            placeholder="0"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Tax */}
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Tax (%)
          </label>
          <input
            type="number"
            value={tax}
            onChange={(e) => onTaxChange(Number(e.target.value))}
            min="0"
            max="100"
            placeholder="0"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

      </div>
    </div>
  );
};

export default DiscountInput;