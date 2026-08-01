import React from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Shield, Clock, Activity, Droplets, X } from 'lucide-react';
import ProductGallery from '../../components/storefront/ProductGallery';
import { useProductDetails } from '../../hooks/useProductDetails';
import '@/styles/css/pages/storefront/ProductDetails.css';

const ProductDetails = ({ productId: propId, onClose }) => {
  const isModal = !!onClose;
  const { product, isLoading, isError, isAdding, phoneModel, setPhoneModel, quantity, setQuantity, isPhoneCover, currentPrice, originalPrice, handleAddToCart, handleBuyNow, navigate } = useProductDetails({ propId, isModal });

  if (isLoading) {
    return <div className="product-details-container loading"><div className="spinner"></div></div>;
  }

  if (isError || !product) {
    if (isModal) return null;
    return (
      <div className="product-details-container error">
        <h2>Product not found</h2>
        <button className="btn-buy-now" onClick={() => navigate('/products')}>Back to Products</button>
      </div>
    );
  }

  const content = (
    <div className={`product-details-container fade-in ${isModal ? 'modal-mode' : ''}`}>
      <div className="product-details-grid">

        {/* Left Column - Image */}
        <ProductGallery product={product} />

        {/* Right Column - Details */}
        <div className="product-info-section">
          <h1 className="product-title">{product.title?.toUpperCase()}</h1>

          <div className="product-description-container">
            <p className="product-description-text">{product.description}</p>
          </div>

          <div className="product-pricing">
            {product.discountPrice ? (
              <span className="current-price" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                Rs. {currentPrice.toFixed(2)}
                <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.75em' }}>Rs. {originalPrice.toFixed(2)}</span>
                <span style={{ fontSize: '0.75em', padding: '0.25rem 0.5rem', background: 'var(--success)', color: 'white', borderRadius: '4px' }}>
                  {Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}% OFF
                </span>
              </span>
            ) : (
              <span className="current-price">Rs. {currentPrice.toFixed(2)}</span>
            )}
          </div>
          <div className="action-links-container"></div>

          {isPhoneCover && (
            <div className="phone-model-input" style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="phoneModel" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-main)' }}>Phone Model <span style={{ color: 'red' }}>*</span></label>
              <input
                type="text"
                id="phoneModel"
                value={phoneModel}
                onChange={(e) => setPhoneModel(e.target.value)}
                placeholder="e.g. iPhone 17 Pro Max, v25 pro"
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--surface)' }}
              />
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <label style={{ fontWeight: '500', color: 'var(--text-main)' }}>Quantity</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                style={{ width: '40px', height: '40px', background: 'var(--surface)', border: 'none', cursor: quantity <= 1 ? 'not-allowed' : 'pointer', fontSize: '1.2rem', opacity: quantity <= 1 ? 0.5 : 1 }}
              >-</button>
              <input 
                type="number"
                value={quantity === '' ? '' : quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setQuantity(isNaN(val) ? '' : val);
                }}
                onBlur={() => setQuantity(Math.max(1, quantity === '' ? 1 : quantity))}
                style={{ width: '50px', textAlign: 'center', fontWeight: 'bold', border: 'none', background: 'transparent', color: 'var(--text-main)' }}
                className="no-spin-button"
              />
              <button 
                onClick={() => setQuantity(quantity + 1)}
                style={{ width: '40px', height: '40px', background: 'var(--surface)', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
              >+</button>
            </div>
          </div>

          <div className="product-action-buttons">
            <button
              className="btn-add-to-cart"
              onClick={handleAddToCart}
              disabled={!product.active || isAdding || (isPhoneCover && !phoneModel.trim())}
            >
              ADD TO CART
            </button>
            <button
              className="btn-buy-now"
              onClick={handleBuyNow}
              disabled={!product.active || isAdding || (isPhoneCover && !phoneModel.trim())}
            >
              BUY NOW
            </button>
          </div>

          <div className="features-section">
            <div className="features-header">
              <p className="section-label">FEATURES</p>
              <ChevronDown size={20} />
            </div>

            <div className="features-grid">
              <div className="feature-item">
                <Shield className="feature-icon" size={28} strokeWidth={1.5} />
                <span>Durable</span>
              </div>
              <div className="feature-item">
                <Clock className="feature-icon" size={28} strokeWidth={1.5} />
                <span>Quartz Movement</span>
              </div>
              <div className="feature-item">
                <Activity className="feature-icon" size={28} strokeWidth={1.5} />
                <span>Multi-Functional Dial</span>
              </div>
              <div className="feature-item">
                <Droplets className="feature-icon" size={28} strokeWidth={1.5} />
                <span>Water Resistant</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );

  if (isModal) {
    return createPortal(
      <div className="product-modal-backdrop fade-in" onClick={onClose}>
        <div className="product-modal-content" onClick={e => e.stopPropagation()}>
          <button className="product-modal-close" onClick={onClose}><X size={24} /></button>
          {content}
        </div>
      </div>,
      document.body
    );
  }

  return content;
};

export default ProductDetails;
