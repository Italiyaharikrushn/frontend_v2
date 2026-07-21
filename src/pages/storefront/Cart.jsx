import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingBag, Trash2, Minus, Plus, ArrowRight } from 'lucide-react';
import Button from '../../components/ui/Button';
import { selectCartItems, updateQuantity, removeItem } from '../../redux/cartSlice';
import './Cart.css';

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);

  const handleQuantity = (id, change) => {
    dispatch(updateQuantity({ id, change }));
  };

  const handleRemove = (id) => {
    dispatch(removeItem(id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="cart-page fade-in">
      <div className="cart-header">
        <h1 className="cart-title">Your Cart</h1>
      </div>

      {cartItems.length > 0 ? (
        <div className="cart-content">
          <div className="cart-items-container">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item glass-panel hover-lift" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flex: '1 1 min-content' }}>
                  <div className="cart-item-image">
                    {item.image || (item.images && item.images.length > 0) ? (
                      <img 
                        src={item.image || item.images[0]} 
                        alt={item.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }}
                        onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} 
                      />
                    ) : null}
                    <ShoppingBag 
                        size={48} 
                        className="cart-item-icon pulse-element" 
                        style={{ animationDuration: '4s', display: (item.image || (item.images && item.images.length > 0)) ? 'none' : 'block' }} 
                    />
                  </div>
                  <div className="cart-item-details">
                    <h3 className="cart-item-title">{item.name || item.title}</h3>
                    <p className="cart-item-price">₹{(item.price || 0).toFixed(2)}</p>
                  
                  <div className="cart-item-quantity">
                    <button className="quantity-btn" onClick={() => handleQuantity(item.id, -1)}>
                      <Minus size={16} />
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button className="quantity-btn" onClick={() => handleQuantity(item.id, 1)}>
                      <Plus size={16} />
                    </button>
                  </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: 'auto' }}>
                  <button className="remove-btn btn-ghost" onClick={() => handleRemove(item.id)} title="Remove item">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary glass-panel">
            <h3 className="summary-title">Order Summary</h3>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Estimated Tax (8%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

            <div className="summary-actions">
              <Link to="/checkout" style={{ display: 'block', width: '100%' }}>
                <Button fullWidth variant="primary" size="lg">
                  Proceed to Checkout
                  <ArrowRight size={20} style={{ marginLeft: '8px', verticalAlign: 'middle' }} />
                </Button>
              </Link>
              <Link to="/products" style={{ display: 'block', width: '100%' }}>
                <Button fullWidth variant="secondary">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-cart-message glass-panel fade-in">
          <h2>Your cart is empty</h2>
          <p style={{ marginTop: '1rem', marginBottom: '2rem', color: 'var(--text-muted)' }}>Looks like you haven't added anything to your cart yet.</p>
          <Link to="/products">
            <Button variant="primary" size="lg">Start Shopping</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
