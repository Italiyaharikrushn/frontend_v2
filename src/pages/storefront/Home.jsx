import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import Button from '../../components/ui/Button';
import SkeletonCard from '../../components/ui/SkeletonCard';
import heroImage from '../../assets/hero-banner.png';
import { useGetProductsQuery } from '../../api/productApi';
import { useGetPublicStoreSettingsQuery } from '../../api/settingsApi';
import ProductDetails from './ProductDetails';
import '@/styles/css/pages/storefront/Home.css';

const Home = () => {
  const { data: products = [], isLoading } = useGetProductsQuery();
  const { data: settings } = useGetPublicStoreSettingsQuery();
  
  let trendingProducts = [];
  if (settings?.isFestivalActive && settings?.festivalName) {
    const festivalKeyword = settings.festivalName.split(/\s+/)[0].toLowerCase();
    const relatedProducts = products.filter(p => {
      const text = `${p.title || ''} ${p.description || ''} ${p.category || ''}`.toLowerCase();
      return text.includes(festivalKeyword);
    });
    trendingProducts = relatedProducts.slice(0, 8);
  }
  
  if (trendingProducts.length === 0) {
    trendingProducts = [...products].slice(0, 8);
  }
  const [quickViewProductId, setQuickViewProductId] = useState(null);

  const renderFestivalBanner = () => {
    if (!settings?.isFestivalActive || !settings?.festivalName) return null;
    if (settings.festivalEndDate && new Date(settings.festivalEndDate) < new Date()) return null;

    return (
      <div className="festival-banner" style={{ background: 'linear-gradient(90deg, var(--primary-dark) 0%, var(--primary) 100%)', color: 'white', padding: '0.75rem', textAlign: 'center', fontWeight: 'bold', letterSpacing: '0.5px' }}>
        🎉 {settings.festivalName} 
        {settings.festivalDiscountPercentage && ` - GET ${settings.festivalDiscountPercentage}% OFF STOREWIDE! `} 🎉
        {settings.festivalEndDate && <span style={{ marginLeft: '1rem', fontWeight: 'normal', fontSize: '0.9em', opacity: 0.9 }}>Ends on {new Date(settings.festivalEndDate).toLocaleDateString()}</span>}
      </div>
    );
  };

  const renderProductCard = (product, isDup = false) => (
    <article key={isDup ? `${product.id}-dup` : product.id} className="feature-card glass-panel hover-lift">
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
        {product.discountPrice ? (
          <p className="feature-price" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>₹{product.discountPrice}</span>
            <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.85em' }}>₹{product.price}</span>
            <span style={{ fontSize: '0.75em', padding: '0.15rem 0.4rem', background: 'var(--success)', color: 'white', borderRadius: '4px', fontWeight: 'bold' }}>
              {Math.round(((parseFloat(product.price) - parseFloat(product.discountPrice)) / parseFloat(product.price)) * 100)}% OFF
            </span>
          </p>
        ) : (
          <p className="feature-price">₹{product.price}</p>
        )}
        <div onClick={() => setQuickViewProductId(product.id)} style={{ marginTop: 'auto' }}>
          <Button variant="secondary" fullWidth>View Details</Button>
        </div>
      </div>
    </article>
  );

  return (
    <div className="home-page">
      {renderFestivalBanner()}
      <section className="hero-section">
        <div className="hero-image-wrapper">
          <img src={heroImage} alt="Traditional Indian Accessories" className="hero-image" />
          <div className="hero-overlay" />
        </div>
        <div className="hero-content">
          <h1 className="hero-title pulse-element">Elegance in Every Detail</h1>
          <p className="hero-subtitle">Discover refined belts and purses crafted to elevate your wardrobe with premium style and comfort.</p>
        </div>
      </section>

      <section className="featured-section">
        <div className="container">
          <h2 className="section-title">Trending Now</h2>
          <div className="marquee-container">
            {isLoading ? (
              <div className="product-grid">
                {Array.from({ length: 4 }).map((_, index) => <SkeletonCard key={index} />)}
              </div>
            ) : trendingProducts.length > 0 ? (
              <div className="marquee-track">
                <div className="marquee-content">
                  {trendingProducts.map((product) => renderProductCard(product, false))}
                </div>
                <div className="marquee-content" aria-hidden="true">
                  {trendingProducts.map((product) => renderProductCard(product, true))}
                </div>
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

