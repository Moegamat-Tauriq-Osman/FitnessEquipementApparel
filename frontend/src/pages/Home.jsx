import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoriesAPI, productsAPI } from '../services/api';
import ProductCard from '../components/common/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentAd, setCurrentAd] = useState(0);

  // South African fitness advertisements data
  const advertisements = [
    {
      id: 1,
      title: "Virgin Active South Africa",
      description: "Get 20% off your membership when you sign up through our platform!",
      cta: "Join Now",
      link: "https://www.virginactive.co.za",
      bgColor: "bg-red-600",
      textColor: "text-white",
      image: "/api/placeholder/800/200",
      discount: "20% OFF"
    },
    {
      id: 2,
      title: "Planet Fitness Gyms",
      description: "No contract, R99 p/m. Over 50 locations across South Africa.",
      cta: "Find a Gym",
      link: "https://www.planetfitness.co.za",
      bgColor: "bg-purple-600",
      textColor: "text-white",
      image: "/api/placeholder/800/200",
      discount: "R99 p/m"
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          productsAPI.getAll(),
          categoriesAPI.getAll()
        ]);
        
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const recentProducts = productsResponse.data
          .filter(product => {
            if (!product.created_at) return false;
            
            const productDate = new Date(product.created_at);
            return productDate >= oneWeekAgo;
          })
          .sort((a, b) => {
            const dateA = new Date(a.created_at || 0);
            const dateB = new Date(b.created_at || 0);
            return dateB - dateA;
          })
          .slice(0, 8);
        
        if (recentProducts.length < 8) {
          const remainingCount = 8 - recentProducts.length;
          const otherProducts = productsResponse.data
            .filter(product => !recentProducts.includes(product))
            .sort(() => 0.5 - Math.random())
            .slice(0, remainingCount);
          
          setFeaturedProducts([...recentProducts, ...otherProducts]);
        } else {
          setFeaturedProducts(recentProducts);
        }
        
        setCategories(categoriesResponse.data.slice(0, 6));
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % advertisements.length);
    }, 5000); 

    return () => clearInterval(interval);
  }, [advertisements.length]);

  const nextAd = () => {
    setCurrentAd((prev) => (prev + 1) % advertisements.length);
  };

  const prevAd = () => {
    setCurrentAd((prev) => (prev - 1 + advertisements.length) % advertisements.length);
  };

  const goToAd = (index) => {
    setCurrentAd(index);
  };

  if (loading) return <LoadingSpinner />;

  const currentAdData = advertisements[currentAd];

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Welcome to Fitness Equipment & Apparel</h1>
          <p className="text-xl mb-8">Shop for all your fitness needs in one shop</p>
          <Link
            to="/products"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </section>

      <section className="py-8 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="absolute top-4 left-4 z-10">
              <span className="bg-yellow-400 text-gray-800 text-xs font-bold px-3 py-1 rounded-full">
                Advertisments
              </span>
            </div>
            
            <button 
              onClick={prevAd}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button 
              onClick={nextAd}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div className={`${currentAdData.bgColor} ${currentAdData.textColor} p-8 md:p-12`}>
              <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between">
                <div className="flex-1 text-center md:text-left mb-6 md:mb-0">
                  <span className="inline-block bg-white/20 text-sm font-semibold px-3 py-1 rounded-full mb-4">
                    {currentAdData.discount}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">{currentAdData.title}</h3>
                  <p className="text-lg opacity-90 mb-6">{currentAdData.description}</p>
                  <a 
                    href={currentAdData.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
                  >
                    {currentAdData.cta}
                  </a>
                </div>
                <div className="flex-1 flex justify-center">
                  
                </div>
              </div>
            </div>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
              {advertisements.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToAd(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentAd ? 'bg-white scale-125' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>

          
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Link
                key={category.categoryId}
                to={`/products/category/${category.categoryId}`}
                className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow"
              >
                <h3 className="font-semibold text-lg">{category.name}</h3>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/categories"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              View All Categories
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">New Arrivals</h2>
          <p className="text-gray-600 text-center mb-8">
            Check out our latest products
          </p>
          {featuredProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">No new products this week. Check back soon!</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.productId} product={product} />
                ))}
              </div>
              <div className="text-center mt-8">
                <Link
                  to="/products"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  View All Products
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;