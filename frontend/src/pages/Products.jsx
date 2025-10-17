import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../services/api';
import ProductCard from '../components/common/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const Products = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categoryId || '');
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('price-low');
    const [priceRange, setPriceRange] = useState([0, 1000]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [categoriesResponse, productsResponse] = await Promise.all([
          categoriesAPI.getAll(),
          productsAPI.getAll()
        ]);

        setCategories(categoriesResponse.data);
        setProducts(productsResponse.data);
        
        if (categoryId) {
          setSelectedCategory(categoryId);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]); 

  const filteredAndSortedProducts = React.useMemo(() => {
    let filtered = products;

    if (selectedCategory) {
      filtered = filtered.filter(product => product.categoryId === selectedCategory);
    }

    filtered = filtered.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        default:
          return a.price - b.price; 
      }
    });
  }, [products, selectedCategory, sortBy, priceRange]);

  useEffect(() => {
    if (categoryId) {
      setSelectedCategory(categoryId);
    } else {
      setSelectedCategory('');
    }
  }, [categoryId]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId) {
      window.history.pushState({}, '', `/products/category/${categoryId}`);
    } else {
      window.history.pushState({}, '', '/products');
    }
  };

  const handleAddToCart = (product) => {
    toast.success(`${product.title} added to cart!`, {
      duration: 3000,
      position: 'bottom-right',
      icon: '🛒',
      style: {
        background: '',
        color: 'white',
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <nav className="mb-8">
          <Link to="/" className="text-blue-600 hover:text-blue-800">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-500">Products</span>
          {selectedCategory && (
            <>
              <span className="mx-2">/</span>
              <span className="text-gray-500">
                {categories.find(c => c.categoryId === selectedCategory)?.name}
              </span>
            </>
          )}
        </nav>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="font-bold text-lg mb-4">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleCategoryChange('')}
                  className={`block w-full text-left px-3 py-2 rounded-md ${
                    !selectedCategory ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                  }`}
                >
                  All Categories
                  <span className="text-gray-500 text-sm ml-2">
                    ({products.length})
                  </span>
                </button>
                {categories.map((category) => {
                  const categoryProductsCount = products.filter(
                    product => product.categoryId === category.categoryId
                  ).length;
                  
                  return (
                    <button
                      key={category.categoryId}
                      onClick={() => handleCategoryChange(category.categoryId)}
                      className={`block w-full text-left px-3 py-2 rounded-md ${
                        selectedCategory === category.categoryId ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                      }`}
                    >
                      {category.name}
                      <span className="text-gray-500 text-sm ml-2">
                        ({categoryProductsCount})
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Price Range</label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="1500"
                    step="10"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>R{priceRange[0]}</span>
                    <span>R{priceRange[1]}</span>
                  </div>
                </div>
              </div>

              <h3 className="font-bold text-lg mt-6 mb-4">Sort By Price</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">
                {selectedCategory 
                  ? categories.find(c => c.categoryId === selectedCategory)?.name || 'Products'
                  : 'All Products'
                }
              </h1>
              <span className="text-gray-600">
                {filteredAndSortedProducts.length} product{filteredAndSortedProducts.length !== 1 ? 's' : ''}
              </span>
            </div>

            {loading ? (
              <LoadingSpinner />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedProducts.map((product) => (
                  <ProductCard 
                    key={product.productId} 
                    product={product} 
                  />
                ))}
              </div>
            )}

            {!loading && filteredAndSortedProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  {selectedCategory 
                    ? `No products found in ${categories.find(c => c.categoryId === selectedCategory)?.name || 'this category'}.`
                    : 'No products found.'
                  }
                </p>
                {selectedCategory && (
                  <Link
                    to="/products"
                    className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View All Products
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;