import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 text-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <div>
            <h3 className="text-base font-semibold mb-2">Fitness Equipment & Apparel</h3>
            <p className="text-gray-400 leading-snug">
              Shop for all your fitness needs in one place.
            </p>
          </div>

          <div>
            <h4 className="text-base font-semibold mb-2">Quick Links</h4>
            <ul className="space-y-1">
              <li><Link to="/products" className="text-gray-400 hover:text-white">Products</Link></li>
              <li><Link to="/categories" className="text-gray-400 hover:text-white">Categories</Link></li>
              <li><Link to="/meal" className="text-gray-400 hover:text-white">Free Resources</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-semibold mb-2">Customer Service</h4>
            <ul className="space-y-1">
              <li><Link to="/support" className="text-gray-400 hover:text-white">Contact Us</Link></li>
              <li><Link to="/troubleshoot" className="text-gray-400 hover:text-white">Troubleshooting</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-semibold mb-2">Account</h4>
            <ul className="space-y-1">
              <li><Link to="/login" className="text-gray-400 hover:text-white">Login</Link></li>
              <li><Link to="/register" className="text-gray-400 hover:text-white">Register</Link></li>
              <li><Link to="/orders" className="text-gray-400 hover:text-white">My Orders</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-6 pt-4 text-center text-gray-500 text-xs">
          <p>&copy; 2025 Fitness Equipment & Apparel. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
