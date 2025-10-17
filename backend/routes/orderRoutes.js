const express = require("express");
const router = express.Router();
const {createOrder, getUserOrders,getOrderById,updateOrderStatus,cancelOrder,getAllOrders,getOrderStats,} = require("../controllers/orderController");
const { requireAuth } = require("../middleware/authMiddleware"); 

router.post("/order", requireAuth, createOrder);
router.get("/my", requireAuth, getUserOrders);
router.get("/:orderId", requireAuth, getOrderById);
router.delete("/:orderId/cancel", requireAuth, cancelOrder);

router.get("/admin/all", requireAuth, getAllOrders);
router.get("/admin/stats", requireAuth, getOrderStats);
router.put("/:orderId/status", requireAuth, updateOrderStatus);

module.exports = router;