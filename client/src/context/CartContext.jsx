import { createContext, useContext, useState, useEffect } from "react";
import { getCart } from "../api/cartApi";
import { useAuth } from "./AuthContext";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const { user } = useAuth();

  const refreshCartCount = async () => {
    if (!user) {
      setCartCount(0);
      return;
    }
    try {
      const res = await getCart();
      const count = res.data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      setCartCount(count);
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    refreshCartCount();
  }, [user]);

  return (
    <CartContext.Provider value={{ cartCount, refreshCartCount }}>
      {children}
    </CartContext.Provider>
  );
};