import React from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Shield, Clock, Activity, Droplets, X, Heart, ArrowLeft } from 'lucide-react';
import ProductGallery from '../../components/storefront/ProductGallery';
import PhoneModelDropdown from '../../components/storefront/PhoneModelDropdown';
import { useProductDetails } from '../../hooks/useProductDetails';
import { useGetFavoritesQuery, useToggleFavoriteMutation } from '../../api/favoriteApi';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../../redux/authSlice';
import { useToast } from '../../components/ui/ToastProvider';
import { formatCurrency } from '../../utils/formatters';
import '@/styles/pages/storefront/ProductDetails.css';


const ProductDetails = ({ productId: propId, onClose }) => {
  const isModal = !!onClose;
  const { product, isLoading, isError, phoneModel, setPhoneModel, quantity, setQuantity, isPhoneCover, currentPrice, originalPrice, coverType, setCoverType, customName, setCustomName, handleAddToCart, handleBuyNow, navigate } = useProductDetails({ propId, isModal });

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { data: favorites } = useGetFavoritesQuery(undefined, { skip: !isAuthenticated });
  const [toggleFavorite] = useToggleFavoriteMutation();
  const { pushToast } = useToast();

  const isFavorite = favorites?.some(fav => fav.id === propId || fav._id === propId) || false;

  const handleFavoriteClick = async () => {
    if (!isAuthenticated) {
        pushToast('Please login to save favorites', 'warning');
        return;
    }
    try {
        await toggleFavorite(propId).unwrap();
        pushToast(isFavorite ? 'Removed from favorites' : 'Added to favorites', 'success');
    } catch (err) {
        pushToast('Failed to update favorites', 'error');
    }
  };

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
      {!isModal && (
        <button 
          onClick={() => navigate(-1)} 
          className="hover-lift"
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '1.5rem', fontSize: '0.95rem', fontWeight: '600', padding: 0 }}
        >
          <ArrowLeft size={20} /> Back
        </button>
      )}
      <div className="product-details-grid">

        {/* Left Column - Image */}
        <ProductGallery product={product} isFavorite={isFavorite} onFavoriteClick={handleFavoriteClick} />

        {/* Right Column - Details */}
        <div className="product-info-section">
          <div className="title-favorite-row">
            <h1 className="product-title" style={{ flex: 1, paddingRight: '1rem' }}>{product.title?.toUpperCase()}</h1>
            <button 
              onClick={handleFavoriteClick}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              className={`product-details-favorite-btn ${isFavorite ? 'is-active' : ''}`}
            >
              <Heart 
                size={28} 
                fill={isFavorite ? '#ff4b4b' : 'none'} 
                color={isFavorite ? '#ff4b4b' : 'var(--text-muted)'} 
                style={{ transition: 'fill 0.3s ease, color 0.3s ease' }}
              />
            </button>
          </div>

          <div className="product-description-container">
            <p className="product-description-text">{product.description}</p>
          </div>

          <div className="product-pricing">
            {product.discountPrice ? (
              <span className="current-price" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {formatCurrency(currentPrice)}
                <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.75em' }}>{formatCurrency(originalPrice)}</span>
                <span style={{ fontSize: '0.75em', padding: '0.25rem 0.5rem', background: 'var(--success)', color: 'white', borderRadius: '4px' }}>
                  {Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}% OFF
                </span>
              </span>
            ) : (
              <span className="current-price">{formatCurrency(currentPrice)}</span>
            )}
          </div>
          <div className="action-links-container"></div>

          {isPhoneCover && (
            <div className="phone-cover-options-container" style={{ marginBottom: '1.5rem', padding: '1.25rem', background: 'var(--surface-alt)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div className="phone-model-input" style={{ marginBottom: '1.25rem' }}>
                <label htmlFor="phoneModel" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-main)' }}>Select Phone Model <span style={{ color: 'red' }}>*</span></label>
                <PhoneModelDropdown value={phoneModel} onChange={setPhoneModel} />
              </div>

              <div className="cover-variation-input" style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-main)' }}>Select Variation <span style={{ color: 'red' }}>*</span></label>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', background: coverType === 'standard' ? 'rgba(var(--primary-rgb), 0.1)' : 'var(--surface)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: `1px solid ${coverType === 'standard' ? 'var(--primary)' : 'var(--border)'}`, flex: 1, minWidth: 'max-content' }}>
                    <input type="radio" name="coverType" value="standard" checked={coverType === 'standard'} onChange={(e) => setCoverType(e.target.value)} style={{ accentColor: 'var(--primary)' }} />
                    <span style={{ fontWeight: coverType === 'standard' ? '600' : '400', color: coverType === 'standard' ? 'var(--primary)' : 'var(--text-main)' }}>Standard Cover</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', background: coverType === 'custom_name' ? 'rgba(var(--primary-rgb), 0.1)' : 'var(--surface)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: `1px solid ${coverType === 'custom_name' ? 'var(--primary)' : 'var(--border)'}`, flex: 1, minWidth: 'max-content' }}>
                    <input type="radio" name="coverType" value="custom_name" checked={coverType === 'custom_name'} onChange={(e) => setCoverType(e.target.value)} style={{ accentColor: 'var(--primary)' }} />
                    <span style={{ fontWeight: coverType === 'custom_name' ? '600' : '400', color: coverType === 'custom_name' ? 'var(--primary)' : 'var(--text-main)' }}>Cover with Name</span>
                  </label>
                </div>
              </div>

              {coverType === 'custom_name' && (
                <div className="custom-name-input fade-in">
                  <label htmlFor="customName" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-main)' }}>Enter Custom Name <span style={{ color: 'red' }}>*</span></label>
                  <input 
                    type="text" 
                    id="customName" 
                    value={customName} 
                    onChange={(e) => setCustomName(e.target.value)} 
                    placeholder="e.g. PREITY" 
                    style={{ width: '100%', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: '1rem', outline: 'none' }}
                  />
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>This name will be crafted onto your cover exactly as typed.</p>
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <label style={{ fontWeight: '500', color: 'var(--text-main)' }}>Quantity</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                style={{ minWidth: '44px', minHeight: '44px', background: 'var(--surface)', border: 'none', cursor: quantity <= 1 ? 'not-allowed' : 'pointer', fontSize: '1.2rem', opacity: quantity <= 1 ? 0.5 : 1 }}
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
                style={{ minWidth: '44px', minHeight: '44px', background: 'var(--surface)', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
              >+</button>
            </div>
          </div>

          <div className="product-action-buttons">
            <button
              className="btn-add-to-cart"
              onClick={handleAddToCart}
              disabled={!product.active || (isPhoneCover && !phoneModel.trim()) || (isPhoneCover && coverType === 'custom_name' && !customName.trim())}
            >
              ADD TO CART
            </button>
            <button
              className="btn-buy-now"
              onClick={handleBuyNow}
              disabled={!product.active || (isPhoneCover && !phoneModel.trim()) || (isPhoneCover && coverType === 'custom_name' && !customName.trim())}
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
