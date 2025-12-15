// context/CartContext.jsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { calculateTourPrice } from "@/utils/priceCalculations";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });

  // Load from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("tourCart");
    const savedUserInfo = localStorage.getItem("tourUserInfo");

    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error);
      }
    }

    if (savedUserInfo) {
      try {
        setUserInfo(JSON.parse(savedUserInfo));
      } catch (error) {
        console.error("Error parsing user info from localStorage:", error);
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("tourCart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("tourUserInfo", JSON.stringify(userInfo));
  }, [userInfo]);

  // Calculate total price
  const cartTotal = cart.reduce((total, item) => total + item.calculatedPrice, 0);

  // Calculate item count
  const cartItemCount = cart.length;

  // Add tour to cart
  const addToCart = (tour, userSelections) => {
    const existingItemIndex = cart.findIndex((item) => item.tourId === tour.id);

    if (existingItemIndex >= 0) {
      // Update existing item
      const updatedCart = [...cart];
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        ...userSelections,
        calculatedPrice: calculatePrice(tour, userSelections.guests),
        lastUpdated: new Date().toISOString(),
      };
      setCart(updatedCart);
    } else {
      // Add new item
      const newItem = {
        id: crypto.randomUUID(),
        tourId: tour.id,
        slug: tour.basicInfo.slug,
        title: tour.basicInfo.title,
        image: tour.media.coverImage,
        date: userSelections.date,
        guests: userSelections.guests,
        groupPrices: tour.pricing.groupPrices,
        calculatedPrice: calculatePrice(tour, userSelections.guests),
        availability: {
          startDates: tour.availability.startDates,
        },
        addedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };
      setCart([...cart, newItem]);
    }
  };

  // Helper: Calculate price based on group size
  const calculatePrice = (tour, guests) =>
    calculateTourPrice(tour, guests, tour.pricing.groupPrices);

  // Remove from cart
  const removeFromCart = (itemId) => {
    setCart(cart.filter((item) => item.id !== itemId));
  };

  // Update cart item
  const updateCartItem = (itemId, updates) => {
    setCart(
      cart.map((item) =>
        item.id === itemId
          ? {
              ...item,
              ...updates,
              calculatedPrice: calculateUpdatedPrice(item, updates.guests),
              lastUpdated: new Date().toISOString(),
            }
          : item
      )
    );
  };

  const calculateUpdatedPrice = (item, newGuests) =>
    calculateTourPrice(item, newGuests, item.groupPrices);

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Update user info
  const updateUserInfo = (info) => {
    setUserInfo((prev) => ({ ...prev, ...info }));
  };

  // Get cart summary
  const getCartSummary = () => {
    return {
      totalItems: cart.length,
      totalPrice: cartTotal,
      items: cart,
      userInfo,
    };
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        userInfo,
        cartTotal,
        cartItemCount,
        addToCart,
        removeFromCart,
        updateCartItem,
        updateUserInfo,
        clearCart,
        getCartSummary,
        calculatePrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
