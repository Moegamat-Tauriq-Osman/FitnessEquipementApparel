import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const OrderSuccess = ({ order }) => {
  const { clearCart } = useCart();

  React.useEffect(() => {clearCart();}, [clearCart]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">

          <div className="bg-green-50 px-6 py-8 text-center border-b">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-green-800 mb-2">Order Successful!</h1>
            <p className="text-green-600 text-lg">
              Thank you for your purchase.
            </p>
          </div>

          <div className="p-6">
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h2 className="text-xl font-bold mb-4 text-center">Order Details</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Number:</span>
                  <span className="font-semibold">#{order.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date:</span>
                  <span className="font-semibold">
                    {new Date(order.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-semibold text-green-600 capitalize">{order.status}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-lg font-bold">Total Amount:</span>
                  <span className="text-lg font-bold">R{order.total?.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
              >
                Continue Shopping
              </Link>
              <Link
                to={`/orders/${order.orderId}`}
                className="bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors text-center"
              >
                View Order Details
              </Link>
            </div>
          </div>
        </div>
      
      </div>
    </div>
  );
};

export default OrderSuccess;