// Format number to GH₵ currency
export const formatCurrency = (amount) => {
  if (isNaN(amount)) return 'GH₵ 0.00';
  return `GH₵ ${Number(amount).toLocaleString('en-GH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

// Format number to plain decimal
export const formatDecimal = (amount) => {
  return Number(amount).toFixed(2);
};