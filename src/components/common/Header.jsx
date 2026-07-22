import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, User, Menu, Search, X, Package, LogIn, LogOut } from 'lucide-react';
import { selectCartTotalQuantity } from '../../redux/cartSlice';
import { selectIsAuthenticated, selectUserRole, logout } from '../../redux/authSlice';
import { useGetPublicStoreSettingsQuery } from '../../api/settingsApi';
import './Header.css';

const Header = () => {
  const cartQuantity = useSelector(selectCartTotalQuantity);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);
  const dispatch = useDispatch();
  const { data: storeSettings } = useGetPublicStoreSettingsQuery();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    window.location.reload();
    window.location.href = '/';
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="header glass-panel">
      <div className="header-container">
        {/* Mobile Menu */}
        <button className="mobile-menu-btn btn-ghost">
          <Menu size={24} />
        </button>

        {/* Logo */}
        <Link to="/" className="brand-logo">
          {storeSettings?.storeName ? (
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{storeSettings.storeName}</span>
          ) : (
            <>KIYA<span className="brand-subtitle">Accessories</span></>
          )}
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/products" className="nav-link">Shop</Link>
          <Link to="/products?category=belts" className="nav-link">Belts</Link>
          <Link to="/products?category=purses" className="nav-link">Purses</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
        </nav>

        {/* Actions */}
        <div className="header-actions">
          {isSearchOpen ? (
            <form className="search-form fade-in" onSubmit={handleSearchSubmit}>
              <input
                type="text"
                className="search-input"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button type="button" className="action-btn btn-ghost" onClick={() => setIsSearchOpen(false)}>
                <X size={20} />
              </button>
            </form>
          ) : (
            <button className="action-btn btn-ghost" onClick={() => setIsSearchOpen(true)}>
              <Search size={20} />
            </button>
          )}

          {isAuthenticated && (
            <Link to="/orders" className="action-btn btn-ghost" title="My Orders">
              <Package size={20} />
            </Link>
          )}

          <Link to="/cart" className="action-btn cart-btn btn-ghost" title="Cart">
            <ShoppingCart size={20} />
            {cartQuantity > 0 && <span className="cart-badge">{cartQuantity}</span>}
          </Link>

          {isAuthenticated ? (
            <button className="action-btn btn-ghost" title="Logout" onClick={handleLogout}>
              <LogOut size={20} />
            </button>
          ) : (
            <Link to="/login" className="action-btn btn-ghost" title="Login">
              <LogIn size={20} />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
