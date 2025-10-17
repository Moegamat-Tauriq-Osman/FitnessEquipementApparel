import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product, onAddToCart }) => {
  const { addToCart } = useCart();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const result = await addToCart(product, 1);
    
    if (result.success) {
      // Show success notification
      toast.success(`${product.title} added to cart!`, {
        duration: 3000,
        position: 'bottom-right',
        style: {
          background: '#333333',
          color: 'white',
        },
      });

      if (result.guest) {
        console.log('Added to guest cart');
      } else {
        console.log('Added to user cart');
      }
      
      if (result.error) {
        // Show warning about fallback
        console.warn(result.error);
      }

      // Call the parent's onAddToCart callback if provided
      if (onAddToCart) {
        onAddToCart(product);
      }
    } else {
      // Show error notification
      toast.error(`Failed to add ${product.title} to cart`, {
        duration: 4000,
        position: 'bottom-right',
        style: {
          background: '#EF4444',
          color: 'white',
        },
      });
      console.error('Failed to add to cart:', result.error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={`/product/${product.productId}`}>
        <img
          src={product.image_url || '/api/placeholder/300/200'}
          alt={product.title}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.title}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-blue-600">R{product.price}</span>
            <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>
        </div>
      </Link>
      <div className="px-4 pb-4">
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
            product.stock > 0
              ? 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;