import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  loading: false,
  error: null,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'CART_LOADING':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'CART_SUCCESS':
      return {
        ...state,
        items: action.payload.items || [],
        totalItems: action.payload.totalItems || 0,
        totalPrice: action.payload.totalPrice || 0,
        loading: false,
        error: null,
      };
    case 'CART_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'CART_CLEAR':
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalPrice: 0,
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated, user } = useAuth();

  // Load cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadCart();
    } else {
      dispatch({ type: 'CART_CLEAR' });
    }
  }, [isAuthenticated, user]);

  const loadCart = async () => {
    if (!user?.id) return;

    try {
      dispatch({ type: 'CART_LOADING' });
      const response = await cartAPI.getCart(user.id);
      const cart = response.data.data.cart;

      dispatch({
        type: 'CART_SUCCESS',
        payload: {
          items: cart.items,
          totalItems: cart.totalItems,
          totalPrice: cart.totalPrice,
        },
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to load cart';
      dispatch({ type: 'CART_ERROR', payload: errorMessage });
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      dispatch({ type: 'CART_LOADING' });
      const response = await cartAPI.addToCart(productId, quantity);
      const cart = response.data.data.cart;

      dispatch({
        type: 'CART_SUCCESS',
        payload: {
          items: cart.items,
          totalItems: cart.totalItems,
          totalPrice: cart.totalPrice,
        },
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add item to cart';
      dispatch({ type: 'CART_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      dispatch({ type: 'CART_LOADING' });
      const response = await cartAPI.updateCartItem(productId, quantity);
      const cart = response.data.data.cart;

      dispatch({
        type: 'CART_SUCCESS',
        payload: {
          items: cart.items,
          totalItems: cart.totalItems,
          totalPrice: cart.totalPrice,
        },
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update cart item';
      dispatch({ type: 'CART_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      dispatch({ type: 'CART_LOADING' });
      const response = await cartAPI.removeFromCart(productId);
      const cart = response.data.data.cart;

      dispatch({
        type: 'CART_SUCCESS',
        payload: {
          items: cart.items,
          totalItems: cart.totalItems,
          totalPrice: cart.totalPrice,
        },
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to remove item from cart';
      dispatch({ type: 'CART_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const clearCart = async () => {
    try {
      dispatch({ type: 'CART_LOADING' });
      await cartAPI.clearCart();

      dispatch({
        type: 'CART_SUCCESS',
        payload: {
          items: [],
          totalItems: 0,
          totalPrice: 0,
        },
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to clear cart';
      dispatch({ type: 'CART_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const value = {
    ...state,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    loadCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
