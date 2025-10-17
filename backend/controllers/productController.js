const { v4: uuidv4 } = require("uuid");
const { selectAll, selectById, selectByField, insertRecord, updateRecord, deleteRecord } = require("../utils/sqlFunctions");


const mapProductFields = ({ title, description, price, stock, categoryId, imageUrl }) => ({
  title,
  description,
  price,
  stock,
  categoryId: categoryId,
  image_url: imageUrl
});

const getAllProducts = async (req, res) => {
  try {
    const products = await selectAll("products");
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    console.log('Fetching product with ID:', req.params.productId); // Debug log
    
    // Use productId instead of id
    const product = await selectByField("products", "productId", req.params.productId);
    
    if (!product || product.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    res.status(200).json(product[0]); // Return the first product object
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ error: err.message });
  }
};


const getProductsByCategory = async (req, res) => {
  try {
    const products = await selectByField("products", "categoryId", req.params.categoryId);
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { title, description, price, stock, categoryId, imageUrl } = req.body;
    if (!title || !price) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const product = {
      productId: uuidv4(),
      title,
      description: description || '',
      price: parseFloat(price),
      stock: parseInt(stock) || 0,
      categoryId: categoryId || null,
      image_url: imageUrl || ''
    };

    await insertRecord("products", product);
    res.status(201).json({ message: "Product created successfully", product });
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ error: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const productData = mapProductFields(req.body);
    
    await updateRecord("products", productData, { column: "productId", value: productId });
    res.status(200).json({ message: "Product updated successfully" });
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    await deleteRecord("products", "productId", productId);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
};
