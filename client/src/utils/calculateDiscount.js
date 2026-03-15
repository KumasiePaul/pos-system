// Apply discount percentage to a total
export const applyDiscount = (total, discountPercent) => {
  if (!discountPercent || discountPercent <= 0) return 0;
  return (total * discountPercent) / 100;
};

// Get total after discount
export const totalAfterDiscount = (total, discountPercent) => {
  return total - applyDiscount(total, discountPercent);
};