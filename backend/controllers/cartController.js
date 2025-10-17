const { v4: uuidv4 } = require("uuid");
const { selectByField, insertRecord, updateRecord, deleteRecord, checkRecordExists } = require("../utils/sqlFunctions");

const getCart = async (req, res) => {
  try {
    console.log('GET CART - User:', req.user ? req.user.userId : 'Guest');
    
    if (req.user && req.user.userId) {
      // User is authenticated - get cart from database
      let cart = await selectByField("carts", "userId", req.user.userId);
      
      if (!cart || cart.length === 0) {
        const newCart = {
          cartId: uuidv4(),
          userId: req.user.userId
        };
        await insertRecord("carts", newCart);
        return res.status(200).json([]);
      }
      
      const cartItems = await selectByField("cart_items", "cartId", cart[0].cartId);
      
      const cartWithProducts = await Promise.all(
        (cartItems || []).map(async (item) => {
          const product = await selectByField("products", "productId", item.productId);
          return {
            ...item,
            product: product && product.length > 0 ? product[0] : null
          };
        })
      );
      
      return res.status(200).json(cartWithProducts);
    }
    
    // Guest user - return empty array (frontend will handle localStorage)
    res.status(200).json([]);
  } catch (err) {
    console.error('Error in getCart:', err);
    res.status(200).json([]);
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    console.log('ADD TO CART - User:', req.user ? req.user.userId : 'Guest', 'Product:', productId, 'Quantity:', quantity);
    
    // Check if product exists
    const product = await selectByField("products", "productId", productId);
    if (!product || product.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    if (req.user && req.user.userId) {
      // Authenticated user - add to database
      let cart = await selectByField("carts", "userId", req.user.userId);
      
      if (!cart || cart.length === 0) {
        const newCart = {
          cartId: uuidv4(),
          userId: req.user.userId
        };
        await insertRecord("carts", newCart);
        cart = [newCart];
      }
      
      const existingItems = await selectByField("cart_items", "cartId", cart[0].cartId);
      const itemExists = existingItems.find(item => item.productId === productId);
      
      if (itemExists) {
        const newQuantity = (itemExists.quantity || 0) + (quantity || 1);
        await updateRecord("cart_items", { quantity: newQuantity }, { column: "cartItemId", value: itemExists.cartItemId });
        return res.status(200).json({ message: "Cart item quantity updated" });
      } else {
        const cartItem = {
          cartItemId: uuidv4(),
          cartId: cart[0].cartId,
          productId,
          quantity: quantity || 1
        };
        
        await insertRecord("cart_items", cartItem);
        return res.status(201).json({ message: "Item added to cart" });
      }
    }
    
    // Guest user - return success (frontend handles localStorage)
    res.status(201).json({ 
      message: "Item added to guest cart", 
      guest: true
    });
  } catch (err) {
    console.error('Error in addToCart:', err);
    res.status(500).json({ error: err.message });
  }
};

// Update other cart methods similarly...
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;
    
    if (quantity < 1) {
      return res.status(400).json({ error: "Quantity must be at least 1" });
    }
    
    if (req.user) {
      await updateRecord("cart_items", { quantity }, { column: "cartItemId", value: itemId });
      return res.status(200).json({ message: "Cart item updated" });
    }
    
    res.status(200).json({ message: "Guest cart item updated", guest: true });
  } catch (err) {
    console.error('Error in updateCartItem:', err);
    res.status(500).json({ error: err.message });
  }
};

const removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    
    if (req.user) {
      await deleteRecord("cart_items", "cartItemId", itemId);
      return res.status(200).json({ message: "Cart item removed" });
    }
    
    res.status(200).json({ message: "Guest cart item removed", guest: true });
  } catch (err) {
    console.error('Error in removeCartItem:', err);
    res.status(500).json({ error: err.message });
  }
};

const clearCart = async (req, res) => {
  try {
    if (req.user) {
      const cart = await selectByField("carts", "userId", req.user.userId);
      if (cart && cart.length > 0) {
        await deleteRecord("cart_items", "cartId", cart[0].cartId);
      }
      return res.status(200).json({ message: "Cart cleared" });
    }
    
    res.status(200).json({ message: "Guest cart cleared", guest: true });
  } catch (err) {
    console.error('Error in clearCart:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };