const express = require("express");
const router = express.Router();
const {getAllCategories,getCategoryById,createCategory,updateCategory,deleteCategory,} = require("../controllers/categoryController");
const { authMiddleware } = require("../middleware/authMiddleware"); 

router.get("/categories", getAllCategories);
router.get("/categories/:categoryId", getCategoryById);

router.post("/categories", authMiddleware, createCategory);
router.put("/categories/:categoryId", authMiddleware, updateCategory);
router.delete("/categories/:categoryId", authMiddleware, deleteCategory);

module.exports = router;