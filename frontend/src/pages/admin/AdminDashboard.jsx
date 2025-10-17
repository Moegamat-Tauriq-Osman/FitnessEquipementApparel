import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { productsAPI, categoriesAPI, ordersAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    deliveredOrders: 0,
    totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [productsRes, categoriesRes, ordersStatsRes, allOrdersRes] = await Promise.all([
        productsAPI.getAll(),
        categoriesAPI.getAll(),
        ordersAPI.getOrderStats(),
        ordersAPI.getAllOrders()    
      ]);

      setStats({
        totalProducts: productsRes.data.length,
        totalCategories: categoriesRes.data.length,
        totalOrders: ordersStatsRes.data.totalOrders,
        pendingOrders: ordersStatsRes.data.pendingOrders,
        processingOrders: ordersStatsRes.data.processingOrders,
        deliveredOrders: ordersStatsRes.data.deliveredOrders,
        totalRevenue: ordersStatsRes.data.totalRevenue
      });

      const sortedOrders = allOrdersRes.data
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);
      
      setRecentOrders(sortedOrders);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Fallback to basic data if admin endpoints fail
      const [productsRes, categoriesRes] = await Promise.all([
        productsAPI.getAll(),
        categoriesAPI.getAll()
      ]);

      setStats({
        totalProducts: productsRes.data.length,
        totalCategories: categoriesRes.data.length,
        totalOrders: 0,
        pendingOrders: 0,
        processingOrders: 0,
        deliveredOrders: 0,
        totalRevenue: 0
      });
      setRecentOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-red-800';
      case 'processing': return 'text-yellow-800';
      case 'shipped': return 'text-purple-800';
      case 'delivered': return 'text-green-800';
      default: return 'text-gray-800';
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="text-2xl">🛍️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold">{stats.totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
      
             
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Categories</p>
              <p className="text-2xl font-bold">{stats.totalCategories}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <span className="text-2xl">📦</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold">{stats.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold">{stats.pendingOrders}</p>
            
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Processing</p>
              <p className="text-2xl font-bold">{stats.processingOrders}</p>
            </div>
            <span className="text-blue-500 text-2xl"></span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Delivered</p>
              <p className="text-2xl font-bold">{stats.deliveredOrders}</p>
            </div>
            <span className="text-green-500 text-2xl"></span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-purple-600">R{stats.totalRevenue.toFixed(2)}</p>
            </div>
            <span className="text-purple-500 text-2xl"></span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
        </div>
        <div className="p-6">
          {recentOrders.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No orders found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4">Order ID</th>
                    <th className="text-left py-3 px-4">Customer</th>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Total</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.orderId} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <p className="font-mono text-sm">{order.orderId.slice(0, 8)}...</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm">{order.userName || `User ${order.userId.slice(0, 8)}...`}</p>
                        <p className="text-xs text-gray-500">{order.userEmail || 'No email'}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm">{new Date(order.created_at).toLocaleDateString()}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold">R{order.total}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className={` ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Link
                          to={`/admin/orders/${order.orderId}`}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-4 text-center">
            <Link
              to="/admin/orders"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Orders
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;