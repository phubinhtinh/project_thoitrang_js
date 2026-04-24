import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      setTotalPrice(0);
      setCartCount(0);
      return;
    }
    try {
      setLoading(true);
      const res = await cartAPI.getCart();
      setCartItems(res.data.items || []);
      setTotalPrice(res.data.totalPrice || 0);
      setCartCount((res.data.items || []).reduce((sum, item) => sum + item.quantity, 0));
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productVariantId, quantity = 1) => {
    await cartAPI.addItem({ productVariantId, quantity });
    await fetchCart();
  };

  const updateQuantity = async (cartItemId, quantity) => {
    await cartAPI.updateItem(cartItemId, { quantity });
    await fetchCart();
  };

  const removeItem = async (cartItemId) => {
    await cartAPI.removeItem(cartItemId);
    await fetchCart();
  };

  return (
    <CartContext.Provider value={{ cartItems, totalPrice, cartCount, loading, fetchCart, addToCart, updateQuantity, removeItem }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
