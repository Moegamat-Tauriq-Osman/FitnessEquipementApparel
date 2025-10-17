const { v4: uuidv4 } = require("uuid");
const { selectAll, selectById, insertRecord, updateRecord, deleteRecord } = require("../utils/sqlFunctions");

const getAllCategories = async (req, res) => {
  try {
    const categories = await selectAll("categories");
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await selectById("categories", "categoryId", req.params.categoryId);
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Category name is required" });
    
    const category = { 
      categoryId: uuidv4(), 
      name
      
    };
    
    await insertRecord("categories", category);
    res.status(201).json({ message: "Category created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    await updateRecord("categories", req.body, { column: "categoryId", value: req.params.categoryId });
    res.status(200).json({ message: "Category updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    await deleteRecord("categories", "categoryId", req.params.categoryId);
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};