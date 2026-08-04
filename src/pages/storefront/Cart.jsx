import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, Minus, Plus, ArrowRight } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useCartPage } from '../../hooks/useCartPage';
import '@/styles/pages/storefront/Cart.css';

const Cart = () => {
  const { cartItems, isLoading, subtotal, handleQuantity, handleSetQuantity, handleRemove } = useCartPage();
  const total = subtotal;

  return (
    <div className="cart-page fade-in">
      <div className="cart-header">
        <h1 className="cart-title">Your Cart</h1>
      </div>

      {cartItems.length > 0 ? (
        <div className="cart-content">
          <div className="cart-items-container">
            {cartItems.map((item) => (
              <div key={item.cartItemId || item.id} className="cart-item glass-panel hover-lift">
                <div className="cart-item-image">
                  {item.image || (item.images && item.images.length > 0) ? (
                    <img
                      src={item.image || item.images[0]}
                      alt={item.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <ShoppingBag size={48} className="cart-item-icon pulse-element" style={{ animationDuration: '4s' }} />
                  )}
                </div>
                <div className="cart-item-details">
                  <h3 className="cart-item-title">{item.name || item.title}</h3>
                  {item.phoneModel && <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Model: {item.phoneModel}</span>}
                  <p className="cart-item-price">₹{(item.price || 0).toFixed(2)}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                    <div className="cart-item-quantity" style={{ marginTop: 0 }}>
                      <button className="quantity-btn" onClick={() => handleQuantity(item.id, item.cartItemId, -1)} aria-label={`Decrease quantity for ${item.name || item.title}`}>
                        <Minus size={16} />
                      </button>
                      <input 
                        type="number"
                        className="quantity-value no-spin-button"
                        value={item.quantity === '' ? '' : item.quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          handleSetQuantity(item.id, item.cartItemId, isNaN(val) ? '' : val);
                        }}
                        onBlur={() => {
                          if (item.quantity === '' || item.quantity < 1) {
                            handleSetQuantity(item.id, item.cartItemId, 1);
                          }
                        }}
                        style={{ width: '40px', height: '36px', textAlign: 'center', fontWeight: 'bold', border: 'none', background: 'transparent', color: 'var(--text-main)', outline: 'none', padding: '0', margin: '0' }}
                      />
                      <button className="quantity-btn" onClick={() => handleQuantity(item.id, item.cartItemId, 1)} aria-label={`Increase quantity for ${item.name || item.title}`}>
                        <Plus size={16} />
                      </button>
                    </div>
                    <button className="remove-btn btn-ghost" onClick={() => handleRemove(item.id, item.cartItemId)} title="Remove item" aria-label={`Remove ${item.name || item.title}`} style={{ alignSelf: 'center' }}>
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary glass-panel">
            <h3 className="summary-title">Order Summary</h3>
            <div className="summary-row"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
            <div className="summary-row total"><span>Total</span><span>₹{total.toFixed(2)}</span></div>

            <div className="summary-actions">
              <Link to="/checkout" style={{ display: 'block', width: '100%' }}>
                <Button fullWidth variant="primary" size="lg">
                  Proceed to Checkout
                  <ArrowRight size={20} style={{ marginLeft: '8px', verticalAlign: 'middle' }} />
                </Button>
              </Link>
              <Link to="/products" style={{ display: 'block', width: '100%' }}>
                <Button fullWidth variant="secondary">Continue Shopping</Button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-cart-message glass-panel fade-in">
          <h2>Your cart is empty</h2>
          <p style={{ marginTop: '1rem', marginBottom: '2rem', color: 'var(--text-muted)' }}>Looks like you haven't added anything yet. Start exploring our curated collection.</p>
          <Link to="/products">
            <Button variant="primary" size="lg">Start Shopping</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
