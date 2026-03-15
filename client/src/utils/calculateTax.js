// Calculate tax amount
export const calculateTax = (total, taxPercent) => {
  if (!taxPercent || taxPercent <= 0) return 0;
  return (total * taxPercent) / 100;
};

// Get total after tax
export const totalAfterTax = (total, taxPercent) => {
  return total + calculateTax(total, taxPercent);
};