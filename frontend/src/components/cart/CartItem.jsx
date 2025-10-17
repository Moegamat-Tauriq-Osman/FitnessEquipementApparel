import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCart();

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(item.cartItemId, newQuantity);
  };

  const handleRemove = () => {
    removeFromCart(item.cartItemId);
  };

  return (
    <div className="flex items-center space-x-4 p-6 border-b">
      <Link to={`/product/${item.productId}`}>
        <img
          src={item.product?.image_url || '/api/placeholder/80/80'}
          alt={item.product?.title}
          className="w-20 h-20 object-cover rounded"
        />
      </Link>
      
      <div className="flex-1">
        <Link to={`/product/${item.productId}`} className="hover:text-blue-600">
          <h3 className="font-semibold text-lg">{item.product?.title}</h3>
        </Link>
        <p className="text-gray-600">R{item.product?.price}</p>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
        >
          -
        </button>
        <span className="w-12 text-center">{item.quantity}</span>
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
        >
          +
        </button>
      </div>

      <div className="text-right">
        <p className="font-semibold">R{(item.product?.price * item.quantity).toFixed(2)}</p>
        <button
          onClick={handleRemove}
          className="text-red-600 hover:text-red-800 text-sm mt-1"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;