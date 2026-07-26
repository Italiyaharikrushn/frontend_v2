import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronDown, Shield, Clock, Activity, Droplets, ShoppingBag } from 'lucide-react';
import { useGetProductByIdQuery } from '../../api/productApi';
import { useAddToBackendCartMutation } from '../../api/orderApi';
import { selectIsAuthenticated } from '../../redux/authSlice';
import { addItem } from '../../redux/cartSlice';
import { useToast } from '../../components/ui/ToastProvider';
import '@/styles/css/pages/storefront/ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pushToast } = useToast();
  
  const { data: product, isLoading, isError } = useGetProductByIdQuery(id);
  const [addToBackendCart, { isLoading: isAdding }] = useAddToBackendCartMutation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  const [pincode, setPincode] = useState('');

  if (isLoading) {
    return <div className="product-details-container loading"><div className="spinner"></div></div>;
  }

  if (isError || !product) {
    return (
      <div className="product-details-container error">
        <h2>Product not found</h2>
        <button className="btn-buy-now" onClick={() => navigate('/products')}>Back to Products</button>
      </div>
    );
  }

  const handleAddToCart = async () => {
    dispatch(addItem({
      id: product.id,
      name: product.title,
      price: parseFloat(product.price),
      category: product.category || product.globalCategory || 'general',
      image: (product.images && product.images.length > 0) ? product.images[0] : null,
    }));

    pushToast(`${product.title} added to your cart.`, 'success');

    if (isAuthenticated) {
      try {
        await addToBackendCart({ productId: product.id, quantity: 1 }).unwrap();
      } catch (error) {
        console.error('Failed to save item to database cart:', error);
      }
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/cart');
  };

  // Mock calculation for MRP (20% higher than price for display purposes if backend doesn't provide MRP)
  const price = parseFloat(product.price) || 0;
  const mrp = Math.round(price * 1.55); // 55% higher to look like a discount

  return (
    <div className="product-details-container fade-in">
      <div className="product-details-grid">
        
        {/* Left Column - Image */}
        <div className="product-image-section">
          <div className="image-wrapper">
            {product.images && product.images.length > 0 ? (
              <img src={product.images[0]} alt={product.title} className="main-product-image" />
            ) : (
              <div className="product-image-placeholder">
                <ShoppingBag size={64} className="placeholder-icon" />
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="product-info-section">
          <p className="product-brand">
            {product.brand || 'SYLVI'}
            {product.category && (
              <span style={{ marginLeft: '8px', paddingLeft: '8px', borderLeft: '1px solid #ccc', textTransform: 'capitalize' }}>
                Category: {product.category}
              </span>
            )}
          </p>
          <h1 className="product-title">{product.title?.toUpperCase()}</h1>
          
          <div className="product-description-container">
            <p className="product-description-text">{product.description}</p>
          </div>

          <div className="product-pricing">
            <span className="mrp">MRP <s>Rs. {mrp.toFixed(2)}</s></span>
            <span className="current-price">Rs. {price.toFixed(2)}</span>
          </div>
          <p className="tax-info">MRP (Inclusive of all taxes) Shipping calculated at checkout.</p>

          {/* Static Colors Section */}
          <div className="available-colors">
            <p className="section-label">AVAILABLE COLORS</p>
            <div className="color-options">
              <div className="color-option active">
                <div className="color-thumbnail black-watch-thumb">
                    {product.images && product.images.length > 0 ? <img src={product.images[0]} alt="Black" /> : <div className="thumb-placeholder bg-black"></div>}
                </div>
                <span>Black</span>
              </div>
              <div className="color-option">
                <div className="color-thumbnail rosegold-watch-thumb">
                    {product.images && product.images.length > 0 ? <img src={product.images[0]} alt="Rosegold" style={{filter: 'sepia(1) hue-rotate(330deg) saturate(1.5)'}} /> : <div className="thumb-placeholder bg-rosegold"></div>}
                </div>
                <span>Rosegold</span>
              </div>
            </div>
          </div>

          <div className="action-links-container">
            <div className="right-links">
                <span className="action-link">OFFERS</span>
            </div>
          </div>

          <div className="product-action-buttons">
            <button 
                className="btn-add-to-cart" 
                onClick={handleAddToCart}
                disabled={!product.active || isAdding}
            >
                ADD TO CART
            </button>
            <button 
                className="btn-buy-now" 
                onClick={handleBuyNow}
                disabled={!product.active || isAdding}
            >
                BUY NOW
            </button>
          </div>

          <div className="delivery-section">
            <p className="section-label">DELIVERY</p>
            <div className="delivery-input-group">
              <input 
                type="text" 
                placeholder="Enter Pincode" 
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
              <button className="btn-check-pincode">CHECK</button>
            </div>
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
};

export default ProductDetails;
