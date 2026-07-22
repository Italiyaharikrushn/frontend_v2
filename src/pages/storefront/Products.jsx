import React from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingBag } from 'lucide-react';
import Button from '../../components/ui/Button';
import { addItem } from '../../redux/cartSlice';
import { selectIsAuthenticated } from '../../redux/authSlice';
import { useGetProductsQuery } from '../../api/productApi';
import { useAddToBackendCartMutation } from '../../api/orderApi';
import './Products.css';

const Products = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category');
  const searchQuery = queryParams.get('search');
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  const { data: allProducts = [], isLoading } = useGetProductsQuery();
  const [addToBackendCart] = useAddToBackendCartMutation();

  // Filter products locally if needed (assuming backend returns all products)
  const products = allProducts.filter(p => {
    if (category) return p.category?.toLowerCase() === category.toLowerCase() || p.globalCategory?.toLowerCase() === category.toLowerCase();
    if (searchQuery) return p.title?.toLowerCase().includes(searchQuery.toLowerCase());
    return true;
  });

  // Determine title based on category
  let title = 'Our Collection';
  let subtitle = 'Explore our complete collection of exquisite accessories designed to elevate your style.';
  if (searchQuery) {
    title = 'Search Results';
    subtitle = `Showing results for "${searchQuery}"`;
  } else if (category === 'belts') {
    title = 'Traditional Belts';
    subtitle = 'Discover our exclusive collection of traditional belts crafted to perfect your ethnic look.';
  } else if (category === 'purses') {
    title = 'Exquisite Purses';
    subtitle = 'Carry elegance with our handcrafted exquisite purses, perfect for any occasion.';
  }

  const handleAddToCart = async (product) => {
    // 1. Update local Redux state
    dispatch(addItem({
      id: product.id,
      name: product.title,
      price: parseFloat(product.price),
      category: category || 'general',
      image: (product.images && product.images.length > 0) ? product.images[0] : null
    }));

    // 2. If authenticated, persist to backend cart immediately
    if (isAuthenticated) {
      try {
        await addToBackendCart({ productId: product.id, quantity: 1 }).unwrap();
        console.log("Item successfully persisted to database cart");
      } catch (error) {
        console.error("Failed to save item to database cart:", error);
      }
    }
  };

  return (
    <div className="products-page fade-in">
      <div className="products-header">
        <h1 className="products-title">{title}</h1>
        <p className="products-subtitle">{subtitle}</p>
      </div>

      <div className="products-grid">
        {isLoading ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
                <p>Loading collection...</p>
            </div>
        ) : products.length > 0 ? products.map((product) => (
          <div key={product.id} className="product-card glass-panel hover-lift">
            <div className="product-image-container">
              {product.images && product.images.length > 0 ? (
                <img src={product.images[0]} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <ShoppingBag size={48} className="product-placeholder-icon pulse-element" style={{ animationDuration: '4s' }} />
              )}
            </div>
            <div className="product-details">
              <h3 className="product-name">{product.title}</h3>
              <p className="product-price">₹{product.price}</p>
              <div className="product-actions">
                {(() => {
                  const isActive = product.isActive ?? product.active ?? true;
                  return (
                    <Button 
                      fullWidth 
                      variant={isActive ? "primary" : "secondary"} 
                      disabled={!isActive}
                      onClick={() => handleAddToCart(product)}
                    >
                      {isActive ? 'Add to Cart' : 'Unavailable'}
                    </Button>
                  );
                })()}
              </div>
            </div>
          </div>
        )) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
                <p>No products found in this category. Check back later!</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Products;

