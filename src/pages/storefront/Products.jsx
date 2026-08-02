import React from 'react';
import { ShoppingBag } from 'lucide-react';
import Button from '../../components/ui/Button';
import SkeletonCard from '../../components/ui/SkeletonCard';
import { useProducts } from '../../hooks/useProducts';
import '@/styles/pages/storefront/Products.css';
import ProductDetails from './ProductDetails';

const Products = () => {
  const {
    category,
    searchQuery,
    quickViewProductId,
    setQuickViewProductId,
    quantities,
    handleQuantityChange,
    handleQuantityInputChange,
    handleQuantityBlur,
    isLoading,
    dynamicCategories,
    products,
    title,
    subtitle,
    handleAddToCart,
    handleCategorySelect,
  } = useProducts();

  return (
    <div className="products-page fade-in">
      <div className="products-header">
        <h1 className="products-title">{title}</h1>
        <p className="products-subtitle">{subtitle}</p>
      </div>

      <div className="category-tabs">
        {dynamicCategories.map((cat) => {
          const isActive = category
            ? category.toLowerCase() === cat.toLowerCase()
            : cat === "All";

          return (
            <button
              key={cat}
              className={`category-tab ${isActive ? 'active' : ''}`}
              onClick={() => handleCategorySelect(cat)}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <div className="products-grid">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)
        ) : products.length > 0 ? products.map((product) => {
          const isActive = product.isActive ?? product.active ?? true;
          const isPhoneCover = product.category?.toLowerCase().includes('cover') || product.title?.toLowerCase().includes('cover');
          return (
            <div key={product.id} className="product-card glass-panel hover-lift">
              <div onClick={() => setQuickViewProductId(product.id)} className="product-image-container" style={{ display: 'block', cursor: 'pointer' }}>
                {product.images && product.images.length > 0 ? (
                  <img src={product.images[0]} alt={product.title} />
                ) : (
                  <ShoppingBag size={48} className="product-placeholder-icon pulse-element" style={{ animationDuration: '4s' }} />
                )}
              </div>
              <div className="product-details">
                <div onClick={() => setQuickViewProductId(product.id)} style={{ cursor: 'pointer', color: 'inherit' }}>
                  <h3 className="product-name">{product.title}</h3>
                </div>
                {product.discountPrice ? (
                  <p className="product-price" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>₹{product.discountPrice}</span>
                    <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.85em' }}>₹{product.price}</span>
                    <span style={{ fontSize: '0.75em', padding: '0.15rem 0.4rem', background: 'var(--success)', color: 'white', borderRadius: '4px', fontWeight: 'bold' }}>
                      {Math.round(((parseFloat(product.price) - parseFloat(product.discountPrice)) / parseFloat(product.price)) * 100)}% OFF
                    </span>
                  </p>
                ) : (
                  <p className="product-price">₹{product.price}</p>
                )}
                <div className="product-actions">
                  {isPhoneCover ? (
                    <Button
                      fullWidth
                      variant={isActive ? 'primary' : 'secondary'}
                      disabled={!isActive}
                      onClick={() => setQuickViewProductId(product.id)}
                    >
                      {isActive ? 'Select Model' : 'Unavailable'}
                    </Button>
                  ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'stretch', gap: '0.5rem', width: '100%' }}>
                      {isActive && (
                        <div style={{ flex: '1 1 80px', display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--surface)', overflow: 'hidden' }}>
                          <button 
                            onClick={() => handleQuantityChange(product.id, -1)}
                            disabled={(quantities[product.id] || 1) <= 1}
                            style={{ flex: 1, minHeight: '32px', minWidth: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'transparent', cursor: (quantities[product.id] || 1) <= 1 ? 'not-allowed' : 'pointer', opacity: (quantities[product.id] || 1) <= 1 ? 0.5 : 1 }}
                          >-</button>
                          <input 
                            type="number"
                            value={quantities[product.id] === undefined ? 1 : quantities[product.id]}
                            onChange={(e) => handleQuantityInputChange(product.id, e.target.value)}
                            onBlur={() => handleQuantityBlur(product.id)}
                            style={{ fontWeight: 'bold', fontSize: '0.9rem', width: '2.5rem', height: '100%', textAlign: 'center', border: 'none', padding: '0', background: 'transparent', color: 'var(--text-main)' }}
                            className="no-spin-button"
                          />
                          <button 
                            onClick={() => handleQuantityChange(product.id, 1)}
                            style={{ flex: 1, minHeight: '32px', minWidth: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'transparent', cursor: 'pointer' }}
                          >+</button>
                        </div>
                      )}
                      <Button
                        style={{ flex: '2 1 120px', padding: '0.4rem 0.5rem', fontSize: '0.9rem' }}
                        variant={isActive ? 'primary' : 'secondary'}
                        disabled={!isActive}
                        onClick={() => handleAddToCart(product)}
                      >
                        {isActive ? 'Add to Cart' : 'Unavailable'}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        }) : (
          <div className="products-empty" style={{ gridColumn: '1 / -1' }}>
            No products found for this selection. Please try another search or browse the full catalog.
          </div>
        )}
      </div>

      {quickViewProductId && (
        <ProductDetails 
          productId={quickViewProductId} 
          onClose={() => setQuickViewProductId(null)} 
        />
      )}
    </div>
  );
};

export default Products;

