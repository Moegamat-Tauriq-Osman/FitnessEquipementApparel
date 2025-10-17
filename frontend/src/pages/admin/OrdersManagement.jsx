import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { ordersAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

 const fetchOrders = async () => {
  try {
    const response = await ordersAPI.getAllOrders();
    setOrders(response.data);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    toast.error('Failed to fetch orders');
    
    try {
      const userOrdersResponse = await ordersAPI.getUserOrders();
      setOrders(userOrdersResponse.data);
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
    }
  } finally {
    setLoading(false);
  }
};

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await ordersAPI.updateStatus(orderId, { status: newStatus });
      toast.success('Order status updated ');
      
      setOrders(orders.map(order => 
        order.orderId === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-800 ';
      case 'processing': return ' text-blue-800 ';
      case 'shipped': return ' text-purple-800';
      case 'delivered': return ' text-green-800 ';
      default: return ' text-gray-800 ';
    }
  };

  const getStatusOptions = (currentStatus) => {
    const allStatuses = ['pending', 'processing', 'shipping', 'delivered'];
    return allStatuses.map(status => (
      <option key={status} value={status}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </option>
    ));
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'all' || order.status === filter;
    const matchesSearch = order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (order.userId && order.userId.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getTotalRevenue = () => {
    return filteredOrders
      .filter(order => order.status === 'delivered')
      .reduce((total, order) => total + parseFloat(order.total || 0), 0);
  };

  const getOrdersCountByStatus = (status) => {
    return orders.filter(order => order.status === status).length;
  };

  if (loading) return <LoadingSpinner />;

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold">{orders.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold">{getOrdersCountByStatus('pending')}</p>
            </div>
            <span className="text-yellow-500 text-2xl"></span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Processing</p>
              <p className="text-2xl font-bold">{getOrdersCountByStatus('processing')}</p>
            </div>
            <span className="text-purple-500 text-2xl"></span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Shipping</p>
              <p className="text-2xl font-bold">{getOrdersCountByStatus('shipping')}</p>
            </div>
            <span className="text-green-500 text-2xl"></span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Delivered</p>
              <p className="text-2xl font-bold">{getOrdersCountByStatus('delivered')}</p>
            </div>
            <span className="text-green-500 text-2xl"></span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg shadow-md mb-6">
        <div className="flex items-center justify-between text-white">
          <div>
            <p className="text-sm opacity-90">Total Revenue (Delivered Orders)</p>
            <p className="text-3xl font-bold">R{getTotalRevenue().toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Status
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipping">Shipping</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Orders
              </label>
              <input
                type="text"
                placeholder="Search order id "
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="text-sm text-gray-600">
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Orders ({filteredOrders.length})
          </h2>
        </div>

        <div className="p-6">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-6xl mb-4">📭</span>
              <p className="text-gray-500 text-lg">No orders found</p>
              <p className="text-gray-400 text-sm mt-2">
                {searchTerm || filter !== 'all' 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'No orders have been placed yet'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Order ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr 
                      key={order.orderId} 
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-mono text-sm font-medium">{order.orderId}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {order.items?.length || 0} items
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-sm text-gray-500">
                            {order.userName || 'No Name'}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-sm">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(order.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-lg font-bold text-gray-800">
                          R{parseFloat(order.total || 0).toFixed(2)}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.orderId, e.target.value)}
                          className={`px-3 py-1 rounded-full text-sm font-medium border-2 focus:ring-2 ${getStatusColor(order.status)}`}
                        >
                          {getStatusOptions(order.status)}
                        </select>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <Link
                            to={`/admin/orders/${order.orderId}`}
                            className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition-colors"
                          >
                            View
                          </Link>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(order.orderId);
                              toast.success('Order ID copied to clipboard');
                            }}
                            className="bg-gray-600 text-white px-3 py-1 rounded-md text-sm hover:bg-gray-700 transition-colors"
                          >
                            Copy ID
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Last updated: {new Date().toLocaleString()}
        </div>
        <button
          onClick={fetchOrders}
          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>
    </AdminLayout>
  );
};

export default OrdersManagement;