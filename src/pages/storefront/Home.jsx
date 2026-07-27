import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import Button from '../../components/ui/Button';
import SkeletonCard from '../../components/ui/SkeletonCard';
import heroImage from '../../assets/hero-banner.png';
import { useGetProductsQuery } from '../../api/productApi';
import ProductDetails from './ProductDetails';
import '@/styles/css/pages/storefront/Home.css';

const Home = () => {
  const { data: products = [], isLoading } = useGetProductsQuery();
  const trendingProducts = [...products].slice(0, 4);
  const [quickViewProductId, setQuickViewProductId] = useState(null);

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-image-wrapper">
          <img src={heroImage} alt="Traditional Indian Accessories" className="hero-image" />
          <div className="hero-overlay" />
        </div>
        <div className="hero-content">
          <h1 className="hero-title pulse-element">Elegance in Every Detail</h1>
          <p className="hero-subtitle">Discover refined belts and purses crafted to elevate your wardrobe with premium style and comfort.</p>
          <div className="hero-actions">
            <Link to="/products?category=belts">
              <Button size="lg" variant="primary">Shop Belts</Button>
            </Link>
            <Link to="/products?category=purses">
              <Button size="lg" variant="secondary">Shop Purses</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="featured-section">
        <div className="container">
          <h2 className="section-title">Trending Now</h2>
          <div className="product-grid">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => <SkeletonCard key={index} />)
            ) : trendingProducts.length > 0 ? (
              trendingProducts.map((product) => (
                <article key={product.id} className="feature-card glass-panel hover-lift">
                  <div className="feature-media">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <ShoppingBag size={48} className="pulse-element" style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
                    )}
                  </div>
                  <div className="feature-body">
                    <h3>{product.title}</h3>
                    <p className="feature-meta">Premium collection • Ready to wear</p>
                    <p className="feature-price">₹{product.price}</p>
                    <div onClick={() => setQuickViewProductId(product.id)} style={{ marginTop: 'auto' }}>
                      <Button variant="secondary" fullWidth>View Details</Button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="products-empty" style={{ gridColumn: '1 / -1' }}>
                No products available yet. Check back soon.
              </div>
            )}
          </div>
        </div>
      </section>

      {quickViewProductId && (
        <ProductDetails 
          productId={quickViewProductId} 
          onClose={() => setQuickViewProductId(null)} 
        />
      )}
    </div>
  );
};

export default Home;

