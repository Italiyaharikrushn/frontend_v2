import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, ShieldCheck, Award, Headphones, ShoppingBag, Eye } from 'lucide-react';
import SkeletonCard from '../../components/ui/SkeletonCard';
import { CraftyLogoEmblem } from '../../components/common/CraftyLogo';
import { useHome } from '../../hooks/useHome';
import ProductDetails from './ProductDetails';
import '@/styles/pages/storefront/Home.css';

const FeatureCard = ({ product, onAddToCart, onQuickView }) => {
  const pId = product.id || product._id;
  const price = product.discountPrice ? parseFloat(product.discountPrice) : parseFloat(product.price);
  
  return (
    <div className="feature-card">
      <Link to={product.category ? `/products?category=${encodeURIComponent(product.category.toLowerCase())}` : `/products`} className="feature-media">
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
          <ShoppingBag size={48} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
        )}
      </Link>
      <div className="feature-body">
        <h3>{product.title}</h3>
        <div className="feature-meta">{product.category}</div>
        <div className="feature-price">
          ₹{price}
        </div>
      </div>
    </div>
  );
};
const Home = () => {
  const {
    isLoading,
    trendingProducts,
    quickViewProductId,
    setQuickViewProductId,
    handleAddToCart,
  } = useHome();

  return (
    <div className="home-page">
      {/* 1. HERO SECTION */}
      <section className="crafty-hero-section">
        <div className="crafty-hero-bg-waves" />
        <div className="crafty-hero-container">
          {/* Left Hero Column */}
          <div className="hero-text-col">
            <span className="hero-welcome-badge">WELCOME TO</span>
            <h1 className="hero-brand-title">crafty_kiya</h1>

            {/* Floral Emblem Divider */}
            <div className="hero-ornament-divider">
              <span className="divider-line" />
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#d4af37">
                <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
              </svg>
              <span className="divider-line" />
            </div>

            <p className="hero-tagline">
              Handpicked. Premium. Timeless.<br />Crafted for You.
            </p>

            <Link to="/products" className="hero-shop-btn">
              SHOP NOW
            </Link>
          </div>

          {/* Right Hero Column: Large Emblem Frame */}
          <div className="hero-emblem-col">
            <div className="emblem-gold-frame">
              <CraftyLogoEmblem size={240} />
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST BADGES BAR */}
      <section className="trust-badges-bar">
        <div className="trust-badges-container">
          <div className="trust-badge-item">
            <div className="trust-icon-box">
              <Truck size={28} />
            </div>
            <div className="trust-badge-text">
              <h4>Free Shipping</h4>
              <p>Fast delivery across India</p>
            </div>
          </div>

          <span className="trust-divider" />

          <div className="trust-badge-item">
            <div className="trust-icon-box">
              <ShieldCheck size={28} />
            </div>
            <div className="trust-badge-text">
              <h4>Secure Payment</h4>
              <p>100% secure payments</p>
            </div>
          </div>

          <span className="trust-divider" />

          <div className="trust-badge-item">
            <div className="trust-icon-box">
              <Award size={28} />
            </div>
            <div className="trust-badge-text">
              <h4>Premium Quality</h4>
              <p>Luxury materials & expert finishing</p>
            </div>
          </div>

          <span className="trust-divider" />

          <div className="trust-badge-item">
            <div className="trust-icon-box">
              <Headphones size={28} />
            </div>
            <div className="trust-badge-text">
              <h4>24/7 Support</h4>
              <p>We're here to help</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TRENDING PRODUCTS */}
      <section className="featured-section">
        <div className="container">
          <h2 className="section-title">Trending Collection</h2>

          <div className="trending-row-wrapper">
            {isLoading ? (
              <div className="product-grid">
                {Array.from({ length: 4 }).map((_, index) => <SkeletonCard key={index} />)}
              </div>
            ) : trendingProducts.length > 1 ? (
              /* Multi-card row: Smooth autoplay marquee */
              <div className="marquee-container">
                <div className="marquee-track">
                  <div className="marquee-content">
                    {trendingProducts.map((product) => (
                      <FeatureCard 
                        key={product.id || product._id} 
                        product={product} 
                        onAddToCart={handleAddToCart}
                        onQuickView={setQuickViewProductId}
                      />
                    ))}
                  </div>
                  <div className="marquee-content" aria-hidden="true">
                    {trendingProducts.map((product) => (
                      <FeatureCard 
                        key={`${product.id || product._id}-dup`} 
                        product={product} 
                        onAddToCart={handleAddToCart}
                        onQuickView={setQuickViewProductId}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : trendingProducts.length === 1 ? (
              /* Single card row: Centered without autoplay */
              <div className="single-card-row">
                <FeatureCard 
                  product={trendingProducts[0]} 
                  onAddToCart={handleAddToCart}
                  onQuickView={setQuickViewProductId}
                />
              </div>
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
