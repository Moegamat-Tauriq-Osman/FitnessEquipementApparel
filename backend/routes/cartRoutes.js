const express = require("express");
const router = express.Router();
const {getCart,addToCart,updateCartItem,removeCartItem,clearCart,} = require("../controllers/cartController");

router.get("/cart", getCart);                          
router.post("/cart/add", addToCart);                   
router.put("/cart/update/:itemId", updateCartItem);   
router.delete("/cart/remove/:itemId", removeCartItem); 
router.delete("/cart/clear", clearCart);              

module.exports = router;