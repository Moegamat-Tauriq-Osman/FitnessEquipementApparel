// controllers/orderController.js
const { v4: uuidv4 } = require("uuid");
const { selectById, selectByField, insertRecord, updateRecord, deleteRecord } = require("../utils/sqlFunctions");

const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress } = req.body;
    const orderId = uuidv4();
    
    console.log('Creating order with items:', items);
    console.log('Shipping address:', shippingAddress);

    // First, check if all items have sufficient stock
    for (const item of items) {
      const product = await selectByField("products", "productId", item.productId);
      if (!product || product.length === 0) {
        return res.status(404).json({ error: `Product ${item.productId} not found` });
      }
      
      if (product[0].stock < item.quantity) {
        return res.status(400).json({ 
          error: `Insufficient stock for ${product[0].title}. Available: ${product[0].stock}, Requested: ${item.quantity}` 
        });
      }
    }

    // Create order with shipping address
    await insertRecord("orders", { 
      orderId: orderId, 
      userId: req.user.userId, 
      total: totalAmount, 
      status: "pending",
      shipping_address: JSON.stringify(shippingAddress) // Store shipping address
    });

    // Create order items and update stock
    for (const item of items) {
      // Create order item
      await insertRecord("order_items", {
        orderItemId: uuidv4(),
        orderId: orderId,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      });

      // Update product stock
      const product = await selectByField("products", "productId", item.productId);
      const newStock = product[0].stock - item.quantity;
      
      await updateRecord(
        "products", 
        { stock: newStock }, 
        { column: "productId", value: item.productId }
      );
      
      console.log(`Updated stock for product ${item.productId}: ${product[0].stock} -> ${newStock}`);
    }

    res.status(201).json({ message: "Order created", orderId });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: err.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await selectByField("orders", "userId", req.user.userId);
    
    // Get order items for each order
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const orderItems = await selectByField("order_items", "orderId", order.orderId);
        
        // Get product details for each order item
        const itemsWithProducts = await Promise.all(
          orderItems.map(async (item) => {
            const product = await selectByField("products", "productId", item.productId);
            return {
              ...item,
              product: product && product.length > 0 ? product[0] : null
            };
          })
        );

        // Parse shipping address if it exists
        let shippingAddress = null;
        if (order.shipping_address) {
          try {
            shippingAddress = typeof order.shipping_address === 'string' 
              ? JSON.parse(order.shipping_address) 
              : order.shipping_address;
          } catch (parseError) {
            console.error('Error parsing shipping address:', parseError);
          }
        }
        
        return {
          ...order,
          items: itemsWithProducts,
          shippingAddress: shippingAddress
        };
      })
    );
    
    res.status(200).json(ordersWithItems);
  } catch (err) {
    console.error('Error fetching user orders:', err);
    res.status(500).json({ error: err.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    console.log('Fetching order with ID:', req.params.orderId);
    
    // Get the order
    const orders = await selectByField("orders", "orderId", req.params.orderId);
    if (!orders || orders.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const order = orders[0];

    // Check if the order belongs to the authenticated user
    if (order.userId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Access denied" });
    }

    // Get user details
    const users = await selectByField("users", "userId", order.userId);
    const user = users && users.length > 0 ? users[0] : null;

    // Get order items
    const orderItems = await selectByField("order_items", "orderId", req.params.orderId);
    console.log('Order items found:', orderItems.length);

    // Get product details for each order item
    const itemsWithProducts = await Promise.all(
      orderItems.map(async (item) => {
        console.log('Fetching product for item:', item.productId);
        const products = await selectByField("products", "productId", item.productId);
        const product = products && products.length > 0 ? products[0] : null;
        
        console.log('Product found:', product ? product.title : 'No product found');
        
        return {
          ...item,
          product: product
        };
      })
    );

    // Parse shipping address if it exists
    let shippingAddress = null;
    if (order.shipping_address) {
      try {
        shippingAddress = typeof order.shipping_address === 'string' 
          ? JSON.parse(order.shipping_address) 
          : order.shipping_address;
      } catch (parseError) {
        console.error('Error parsing shipping address:', parseError);
      }
    }

    const orderWithItems = {
      ...order,
      items: itemsWithProducts,
      user: user ? {
        name: user.name,
        email: user.email,
        phone: user.phone
      } : null,
      shippingAddress: shippingAddress
    };

    console.log('Final order data with items:', orderWithItems);
    res.status(200).json(orderWithItems);
  } catch (err) {
    console.error('Error fetching order:', err);
    res.status(500).json({ error: err.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await updateRecord("orders", { status }, { column: "orderId", value: req.params.orderId });
    res.status(200).json({ message: "Order status updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    // Get the order first
    const orders = await selectByField("orders", "orderId", orderId);
    if (!orders || orders.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const order = orders[0];

    // Check if the order belongs to the authenticated user
    if (order.userId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Access denied" });
    }

    // Check if order can be cancelled (only pending or processing)
    if (order.status !== 'pending' && order.status !== 'processing') {
      return res.status(400).json({ 
        error: `Order cannot be cancelled. Current status: ${order.status}` 
      });
    }

    // Restore product stock first
    const orderItems = await selectByField("order_items", "orderId", orderId);
    
    for (const item of orderItems) {
      const products = await selectByField("products", "productId", item.productId);
      if (products && products.length > 0) {
        const product = products[0];
        const newStock = product.stock + item.quantity;
        
        await updateRecord(
          "products", 
          { stock: newStock }, 
          { column: "productId", value: item.productId }
        );
        
        console.log(`Restored stock for product ${item.productId}: ${product.stock} -> ${newStock}`);
      }
    }

    // Delete order items first (due to foreign key constraints)
    await deleteRecord("order_items", "orderId", orderId);
    
    // Then delete the order
    await deleteRecord("orders", "orderId", orderId);

    res.status(200).json({ message: "Order cancelled and deleted successfully" });
  } catch (err) {
    console.error('Error cancelling order:', err);
    res.status(500).json({ error: err.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const { selectAll } = require("../utils/sqlFunctions");
    const orders = await selectAll("orders");
    
    // Get order items and user info for each order
    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        const orderItems = await selectByField("order_items", "orderId", order.orderId);
        const users = await selectByField("users", "userId", order.userId);
        const user = users && users.length > 0 ? users[0] : null;
        
        // Parse shipping address
        let shippingAddress = null;
        if (order.shipping_address) {
          try {
            shippingAddress = typeof order.shipping_address === 'string' 
              ? JSON.parse(order.shipping_address) 
              : order.shipping_address;
          } catch (parseError) {
            console.error('Error parsing shipping address:', parseError);
          }
        }

        // Get product details for each order item
        const itemsWithProducts = await Promise.all(
          orderItems.map(async (item) => {
            const product = await selectByField("products", "productId", item.productId);
            return {
              ...item,
              product: product && product.length > 0 ? product[0] : null
            };
          })
        );
        
        return {
          ...order,
          items: itemsWithProducts,
          userEmail: user ? user.email : null,
          userName: user ? user.name : null,
          userPhone: user ? user.phone : null,
          shippingAddress: shippingAddress
        };
      })
    );
    
    res.status(200).json(ordersWithDetails);
  } catch (err) {
    console.error('Error fetching all orders:', err);
    res.status(500).json({ error: err.message });
  }
};

const getOrderStats = async (req, res) => {
  try {
    const { selectAll } = require("../utils/sqlFunctions");
    const orders = await selectAll("orders");
    
    const stats = {
      totalOrders: orders.length,
      pendingOrders: orders.filter(order => order.status === 'pending').length,
      processingOrders: orders.filter(order => order.status === 'processing').length,
      shippedOrders: orders.filter(order => order.status === 'shipped').length,
      deliveredOrders: orders.filter(order => order.status === 'delivered').length,
      totalRevenue: orders
        .filter(order => order.status === 'delivered')
        .reduce((total, order) => total + parseFloat(order.total || 0), 0)
    };
    
    res.status(200).json(stats);
  } catch (err) {
    console.error('Error fetching order stats:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { 
  createOrder, 
  getUserOrders, 
  getOrderById, 
  updateOrderStatus, 
  cancelOrder,
  getAllOrders, 
  getOrderStats 
};