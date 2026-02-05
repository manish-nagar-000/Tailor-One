import React, { createContext, useState, useEffect } from "react";

// Create Context
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [appliedOffer, setAppliedOffer] = useState(null);

  // Load cart and offer from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) setCart(JSON.parse(storedCart));

    const storedOffer = localStorage.getItem("appliedOffer");
    if (storedOffer) setAppliedOffer(JSON.parse(storedOffer));
  }, []);

  // Save cart and offer to localStorage whenever changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (appliedOffer) {
      localStorage.setItem("appliedOffer", JSON.stringify(appliedOffer));
    } else {
      localStorage.removeItem("appliedOffer");
    }
  }, [appliedOffer]);

  // Add item (product / service)
  const addItemToCart = (item) => {
    const existing = cart.find((c) => c.id === item.id && c.type === item.type);

    if (existing) {
      setCart(
        cart.map((c) =>
          c.id === item.id && c.type === item.type
            ? { ...c, qty: c.qty + 1 }
            : c
        )
      );
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  // Remove item
  const removeFromCart = (id, type) => {
    setCart(cart.filter((item) => !(item.id === id && item.type === type)));
  };

  // Update quantity
  const updateQty = (id, qty, type) => {
    if (qty < 1) return;
    setCart(
      cart.map((item) =>
        item.id === id && item.type === type ? { ...item, qty } : item
      )
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
    setAppliedOffer(null);
  };

  // Apply an offer
  const applyOffer = (offer) => {
    setAppliedOffer(offer);
  };

  // Total amount before discount
  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  // Final amount after offer
  const finalAmount = appliedOffer
    ? appliedOffer.discountPercent
      ? totalAmount - (totalAmount * appliedOffer.discountPercent) / 100
      : totalAmount - (appliedOffer.discount || 0)
    : totalAmount;

  return (
    <CartContext.Provider
      value={{
        cart,
        addItemToCart,
        removeFromCart,
        updateQty,
        clearCart,
        totalAmount,
        appliedOffer,
        applyOffer,
        finalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
