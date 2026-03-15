import { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);

  // Add item to cart
  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item._id === product._id);
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.price }
          : item
      ));
    } else {
      setCartItems([...cartItems, {
        ...product,
        quantity: 1,
        subtotal: product.price
      }]);
    }
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item._id !== productId));
  };

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(cartItems.map(item =>
      item._id === productId
        ? { ...item, quantity, subtotal: quantity * item.price }
        : item
    ));
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    setDiscount(0);
    setTax(0);
  };

  // Calculate total
  const getTotal = () => {
    return cartItems.reduce((total, item) => total + item.subtotal, 0);
  };

  // Calculate grand total
  const getGrandTotal = () => {
    const total = getTotal();
    const discountAmount = (total * discount) / 100;
    const taxAmount = (total * tax) / 100;
    return total - discountAmount + taxAmount;
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      discount,
      tax,
      setDiscount,
      setTax,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotal,
      getGrandTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};