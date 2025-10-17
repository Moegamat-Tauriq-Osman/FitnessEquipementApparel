const express = require("express");
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require("../controllers/cartController");

// Public cart routes - no authentication required
// These routes will work for both guests and authenticated users
router.get("/cart", getCart);                          // GET /cart
router.post("/cart/add", addToCart);                   // POST /cart/add
router.put("/cart/update/:itemId", updateCartItem);    // PUT /cart/update/:itemId
router.delete("/cart/remove/:itemId", removeCartItem); // DELETE /cart/remove/:itemId
router.delete("/cart/clear", clearCart);               // DELETE /cart/clear

module.exports = router;