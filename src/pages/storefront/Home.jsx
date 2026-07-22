import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import Button from '../../components/ui/Button';
import heroImage from '../../assets/hero-banner.png';
import { useGetProductsQuery } from '../../api/productApi';
import './Home.css';

const Home = () => {
  const { data: products = [], isLoading } = useGetProductsQuery();
  
  // Get top 4 products for trending section
  const trendingProducts = [...products].slice(0, 4);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-image-wrapper">
          <img src={heroImage} alt="Traditional Indian Accessories" className="hero-image" />
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <h1 className="hero-title pulse-element">Elegance in Every Detail</h1>
          <p className="hero-subtitle">Discover our exclusive collection of traditional belts and exquisite purses designed to perfect your ethnic look.</p>
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

      {/* Featured Categories Placeholder */}
      <section className="featured-section">
        <div className="container">
          <h2 className="section-title">Trending Now</h2>
          <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
            {isLoading ? (
              <p>Loading trending products...</p>
            ) : trendingProducts.length > 0 ? (
              trendingProducts.map(product => (
                <div key={product.id} className="placeholder-product glass-panel hover-lift" style={{ display: 'flex', flexDirection: 'column', borderRadius: 'var(--radius-lg)', overflow: 'hidden', height: '100%' }}>
                  <div style={{ height: '240px', width: '100%', background: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                      />
                    ) : null}
                    <ShoppingBag size={48} className="pulse-element" style={{ color: 'var(--text-muted)', opacity: 0.5, display: (product.images && product.images.length > 0) ? 'none' : 'block' }} />
                  </div>
                  <div style={{ padding: '1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem', color: 'var(--primary-dark)', fontWeight: '600' }}>{product.title}</h3>
                    <p style={{ margin: '0 0 1.5rem', fontWeight: '700', color: 'var(--primary)', fontSize: '1.125rem' }}>₹{product.price}</p>
                    <div style={{ marginTop: 'auto' }}>
                      <Link to={`/products`} style={{ display: 'block' }}>
                        <Button variant="secondary" fullWidth style={{ borderRadius: 'var(--radius-md)' }}>View Collection</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No products available yet. Check back soon!</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

