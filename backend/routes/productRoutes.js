const express = require("express");
const router = express.Router();
const {getAllProducts,getProductById,getProductsByCategory,createProduct,updateProduct,deleteProduct,} = require("../controllers/productController");
const { requireAuth } = require("../middleware/authMiddleware");

router.get("/products", getAllProducts);
router.get("/products/:productId", getProductById);
router.get("/products/category/:categoryId", getProductsByCategory);

router.post("/products", requireAuth, createProduct);
router.put("/products/:productId", requireAuth, updateProduct);
router.delete("/products/:productId", requireAuth, deleteProduct);

module.exports = router;