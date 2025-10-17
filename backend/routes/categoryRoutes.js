const express = require("express");
const router = express.Router();
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { authMiddleware } = require("../middleware/authMiddleware"); // Use named import

// Public routes
router.get("/categories", getAllCategories);
router.get("/categories/:categoryId", getCategoryById);

// Admin-only routes (require authentication)
router.post("/categories", authMiddleware, createCategory);
router.put("/categories/:categoryId", authMiddleware, updateCategory);
router.delete("/categories/:categoryId", authMiddleware, deleteCategory);

module.exports = router;