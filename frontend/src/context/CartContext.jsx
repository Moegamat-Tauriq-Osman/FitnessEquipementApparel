import React, { createContext, useState, useContext, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const { isAuthenticated, user } = useAuth();

  // Load cart from appropriate source
  const loadCart = async () => {
    try {
      if (isAuthenticated && user) {
        // Load from server for authenticated users
        const response = await cartAPI.get();
        const serverCart = response.data || [];
        setCart(serverCart);
        setCartCount(serverCart.length);
        
        // Check if we have guest cart items to merge
        const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
        if (guestCart.length > 0) {
          console.log('Found guest cart items to merge:', guestCart.length);
          await mergeGuestCart(guestCart, serverCart);
        }
      } else {
        // Load from localStorage for guests
        const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
        setCart(guestCart);
        setCartCount(guestCart.length);
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
      // Fallback to guest cart
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      setCart(guestCart);
      setCartCount(guestCart.length);
    }
  };

  // Merge guest cart with user cart after login
  const mergeGuestCart = async (guestCart, serverCart) => {
    try {
      let mergedItems = [...serverCart];
      let hasNewItems = false;

      for (const guestItem of guestCart) {
        const existingItem = serverCart.find(item => 
          item.productId === guestItem.productId
        );

        if (existingItem) {
          // Update quantity if item exists - with stock validation
          const availableStock = existingItem.product?.stock || 0;
          const newQuantity = Math.min(existingItem.quantity + guestItem.quantity, availableStock);
          
          if (newQuantity > 0) {
            await cartAPI.update(existingItem.cartItemId, { quantity: newQuantity });
          }
        } else {
          // Add new item to server cart - with stock validation
          const availableStock = guestItem.product?.stock || 0;
          const quantity = Math.min(guestItem.quantity, availableStock);
          
          if (quantity > 0) {
            hasNewItems = true;
            await cartAPI.add({
              productId: guestItem.productId,
              quantity: quantity,
            });
          }
        }
      }

      // Clear guest cart after successful merge
      localStorage.removeItem('guestCart');
      
      // Reload cart from server if we added new items
      if (hasNewItems) {
        const response = await cartAPI.get();
        setCart(response.data || []);
        setCartCount(response.data?.length || 0);
      }
      
      console.log('Guest cart merged successfully');
    } catch (error) {
      console.error('Failed to merge guest cart:', error);
    }
  };

  useEffect(() => {
    loadCart();
  }, [isAuthenticated, user]);

  // Guest cart management
  const updateGuestCart = (newCart) => {
    localStorage.setItem('guestCart', JSON.stringify(newCart));
    setCart(newCart);
    setCartCount(newCart.length);
  };

  const addToGuestCart = (product, quantity = 1) => {
    const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
    const existingItemIndex = guestCart.findIndex(item => item.productId === product.productId);
    
    // Check available stock
    const availableStock = product.stock || 0;
    const currentQuantity = existingItemIndex > -1 ? guestCart[existingItemIndex].quantity : 0;
    const newQuantity = Math.min(currentQuantity + quantity, availableStock);
    
    // If no stock available or quantity would be zero, return error
    if (availableStock === 0) {
      return { success: false, error: 'Product is out of stock' };
    }
    
    if (newQuantity <= 0) {
      return { success: false, error: 'Cannot add item with zero quantity' };
    }

    const cartItem = {
      cartItemId: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      productId: product.productId,
      product,
      quantity: newQuantity
    };

    if (existingItemIndex > -1) {
      guestCart[existingItemIndex].quantity = newQuantity;
    } else {
      guestCart.push(cartItem);
    }
    
    updateGuestCart(guestCart);
    return { 
      success: true, 
      guest: true,
      message: newQuantity < (currentQuantity + quantity) ? 
        `Added ${newQuantity} items (only ${availableStock} available in stock)` : 
        'Item added to cart'
    };
  };

  const addToCart = async (product, quantity = 1) => {
    try {
      console.log('Adding to cart - Product:', product.productId, 'Quantity:', quantity, 'Stock:', product.stock);
      
      // Check if product has sufficient stock
      const availableStock = product.stock || 0;
      if (availableStock === 0) {
        return { 
          success: false, 
          error: 'This product is currently out of stock' 
        };
      }
      
      if (quantity > availableStock) {
        return { 
          success: false, 
          error: `Only ${availableStock} items available in stock. You requested ${quantity}.` 
        };
      }

      if (isAuthenticated && user) {
        try {
          await cartAPI.add({
            productId: product.productId,
            quantity: quantity,
          });
          
          // Refresh cart from server
          const response = await cartAPI.get();
          setCart(response.data || []);
          setCartCount(response.data?.length || 0);
          return { success: true, guest: false };
        } catch (apiError) {
          console.error('API call failed, falling back to guest cart:', apiError);
          const result = addToGuestCart(product, quantity);
          return { 
            ...result, 
            error: result.error || 'Failed to sync with server. Item added to local cart.',
            guest: true 
          };
        }
      } else {
        return addToGuestCart(product, quantity);
      }
    } catch (error) {
      console.error('Unexpected error in addToCart:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to add item to cart'
      };
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      if (isAuthenticated && user) {
        await cartAPI.remove(cartItemId);
        const response = await cartAPI.get();
        setCart(response.data || []);
        setCartCount(response.data?.length || 0);
      } else {
        const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
        const updatedCart = guestCart.filter(item => item.cartItemId !== cartItemId);
        updateGuestCart(updatedCart);
      }
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      // Fallback to guest cart removal
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      const updatedCart = guestCart.filter(item => item.cartItemId !== cartItemId);
      updateGuestCart(updatedCart);
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    try {
      // Find the item in cart to check stock
      const cartItem = cart.find(item => item.cartItemId === cartItemId);
      if (!cartItem) {
        console.error('Cart item not found:', cartItemId);
        return { success: false, error: 'Cart item not found' };
      }

      // Validate new quantity against available stock
      const availableStock = cartItem.product?.stock || 0;
      
      if (newQuantity > availableStock) {
        return { 
          success: false, 
          error: `Only ${availableStock} items available in stock` 
        };
      }

      if (newQuantity < 1) {
        // Remove item if quantity is 0
        await removeFromCart(cartItemId);
        return { success: true };
      }

      if (isAuthenticated && user) {
        try {
          await cartAPI.update(cartItemId, { quantity: newQuantity });
          const response = await cartAPI.get();
          setCart(response.data || []);
          return { success: true };
        } catch (error) {
          console.error('API update failed, using guest cart:', error);
          // Fallback to guest cart update
          const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
          const item = guestCart.find(item => item.cartItemId === cartItemId);
          if (item) {
            item.quantity = newQuantity;
            localStorage.setItem('guestCart', JSON.stringify(guestCart));
            setCart(guestCart);
          }
          return { success: true };
        }
      } else {
        const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
        const item = guestCart.find(item => item.cartItemId === cartItemId);
        if (item) {
          item.quantity = newQuantity;
          localStorage.setItem('guestCart', JSON.stringify(guestCart));
          setCart(guestCart);
        }
        return { success: true };
      }
    } catch (error) {
      console.error('Failed to update cart:', error);
      return { success: false, error: 'Failed to update quantity' };
    }
  };

  const clearCart = async () => {
    try {
      if (isAuthenticated && user) {
        try {
          await cartAPI.clear();
        } catch (error) {
          console.error('API clear failed, clearing guest cart:', error);
        }
      }
      localStorage.removeItem('guestCart');
      setCart([]);
      setCartCount(0);
    } catch (error) {
      console.error('Failed to clear cart:', error);
      localStorage.removeItem('guestCart');
      setCart([]);
      setCartCount(0);
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity;
    }, 0);
  };

  // Helper function to get max available quantity for a product
  const getMaxAvailableQuantity = (productId) => {
    const product = cart.find(item => item.productId === productId)?.product;
    return product?.stock || 0;
  };

  // Helper function to check if a product is in stock
  const isProductInStock = (productId) => {
    const product = cart.find(item => item.productId === productId)?.product;
    return (product?.stock || 0) > 0;
  };

  const value = {
    cart,
    cartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getMaxAvailableQuantity,
    isProductInStock,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};