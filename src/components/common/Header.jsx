import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { ShoppingCart, Menu, Search, X, LogIn, User, Heart } from "lucide-react";
import CraftyLogo from "./CraftyLogo";
import CustomerProfileMenu from "./CustomerProfileMenu";
import { useHeader } from "../../hooks/useHeader";
import "@/styles/components/Header.css";

const Header = () => {
  const {
    cartQuantity,
    isAuthenticated,
    userName,
    userEmail,
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    isMenuOpen,
    setIsMenuOpen,
    searchInputRef,
    closeMenu,
    handleSearchSubmit,
    handleSearchChange,
    handleClearSearch,
    handleLogout,
    isActive,
    searchSuggestions,
    showSuggestions,
    setShowSuggestions,
  } = useHeader();

  const getAvatarInitial = () => {
    if (userName) return userName.charAt(0).toUpperCase();
    if (userEmail) return userEmail.charAt(0).toUpperCase();
    return "U";
  };

  const mobileSearchRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSearchOpen && mobileSearchRef.current && !mobileSearchRef.current.contains(event.target)) {
        if (!event.target.closest('.search-trigger')) {
          setIsSearchOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSearchOpen, setIsSearchOpen]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <div className="crafty-header-wrapper">
      {/* 1. Main Header Bar */}
      <header className="main-header">
        <div className="main-header-container">
          <div className="header-left">
            <button
              className="mobile-menu-btn"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <Link to="/" className="brand-logo-link" onClick={closeMenu}>
              <CraftyLogo size={40} />
            </Link>
          </div>

          {/* Center Navigation Tabs (Desktop) */}
          <div className="header-center desktop-only">
            <nav className="main-nav-links">
              <Link to="/" className={`main-nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
              <Link to="/products" className={`main-nav-link ${isActive('/products') ? 'active' : ''}`}>Shop</Link>
              <Link to="/about-us" className={`main-nav-link ${isActive('/about-us') ? 'active' : ''}`}>About Us</Link>
              <Link to="/contact" className={`main-nav-link ${isActive('/contact') ? 'active' : ''}`}>Contact Us</Link>
            </nav>
          </div>

          {/* Right Action Icons: Search, Account & Cart */}
          <div className="header-right">
            {/* Desktop Search Bar */}
            <div className="desktop-search-container desktop-only" style={{ position: 'relative' }}>
              <form className="crafty-search-form" onSubmit={handleSearchSubmit}>
                <input
                  ref={searchInputRef}
                  type="text"
                  className="crafty-search-input"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                />

                {searchQuery && (
                  <button
                    type="button"
                    className="clear-search-btn"
                    onClick={handleClearSearch}
                    aria-label="Clear Search"
                  >
                    <X size={16} />
                  </button>
                )}

                <button type="submit" className="crafty-search-btn" aria-label="Search">
                  <Search size={18} />
                </button>
              </form>

              {/* Desktop Suggestions Dropdown */}
              {showSuggestions && searchSuggestions && searchSuggestions.length > 0 && (
                <div className="search-suggestions-dropdown">
                  {searchSuggestions.map(product => (
                    <Link
                      to={`/products${product.category ? `?category=${encodeURIComponent(product.category.toLowerCase())}` : ''}`}
                      key={product.id}
                      className="suggestion-item"
                      onClick={() => {
                        setShowSuggestions(false);
                      }}
                    >
                      <span className="suggestion-title">{product.title}</span>
                      <span className="suggestion-category">{product.category}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <button
              className="action-btn mobile-only search-trigger"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Open Search"
            >
              <Search size={22} />
            </button>

            {/* Account / User Menu */}
            <div className="profile-container desktop-only">
              {isAuthenticated ? (
                <CustomerProfileMenu />
              ) : (
                <Link to="/login" className="crafty-action-item" aria-label="Account">
                  <User size={22} className="action-icon" />
                </Link>
              )}
            </div>

            {/* Favorites */}
            {isAuthenticated && (
              <Link to="/favorites" className={`crafty-action-item cart-action desktop-only ${isActive('/favorites') ? 'active' : ''}`} aria-label="Favorites">
                <div className="cart-icon-wrapper">
                  <Heart size={22} className="action-icon" fill={isActive('/favorites') ? 'currentColor' : 'none'} />
                </div>
              </Link>
            )}

            {/* Shopping Cart */}
            <Link to="/cart" className="crafty-action-item cart-action" aria-label="Shopping Cart">
              <div className="cart-icon-wrapper">
                <ShoppingCart size={22} className="action-icon" />
                <span className="crafty-cart-badge">{cartQuantity}</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar Expansion */}
        {isSearchOpen && (
          <div className="mobile-search-bar mobile-only" ref={mobileSearchRef}>
            <div style={{ position: 'relative', width: '100%' }}>
              <form onSubmit={handleSearchSubmit} className="mobile-search-form">
                <input
                  type="text"
                  className="mobile-search-input"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  autoFocus
                />
                {searchQuery && (
                  <button type="button" className="close-search-btn" onClick={handleClearSearch} aria-label="Clear Search">
                    <X size={18} />
                  </button>
                )}
                <button type="submit" className="crafty-search-btn">
                  <Search size={18} />
                </button>
              </form>

              {/* Mobile Suggestions Dropdown */}
              {showSuggestions && searchSuggestions && searchSuggestions.length > 0 && (
                <div className="search-suggestions-dropdown mobile-suggestions">
                  {searchSuggestions.map(product => (
                    <Link
                      to={`/products${product.category ? `?category=${encodeURIComponent(product.category.toLowerCase())}` : ''}`}
                      key={product.id}
                      className="suggestion-item"
                      onClick={() => {
                        setShowSuggestions(false);
                        setIsSearchOpen(false);
                      }}
                    >
                      <span className="suggestion-title">{product.title}</span>
                      <span className="suggestion-category">{product.category}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </header>



      {/* 3. Mobile Sidebar Navigation Drawer Rendered via Portal to Body */}
      {createPortal(
        <>
          <div
            className={`mobile-nav-backdrop ${isMenuOpen ? "open" : ""}`}
            onClick={closeMenu}
          />

          <aside className={`mobile-nav-panel ${isMenuOpen ? "open" : ""}`}>
            <div className="mobile-nav-header">
              <CraftyLogo size={32} />
              <button className="action-btn" onClick={closeMenu} aria-label="Close menu">
                <X size={24} />
              </button>
            </div>

            <div className="mobile-profile-card">
              <div className="mobile-profile-avatar">{getAvatarInitial()}</div>
              <div className="mobile-profile-info">
                <h4>{isAuthenticated ? userName || "Customer" : "Welcome"}</h4>
                <p>{isAuthenticated ? userEmail : "Sign in to continue"}</p>
              </div>
            </div>

            <nav className="mobile-nav-links">
              <Link to="/" className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`} onClick={closeMenu}>Home</Link>
              <Link to="/products" className={`mobile-nav-link ${isActive('/products') ? 'active' : ''}`} onClick={closeMenu}>Shop</Link>
              <Link to="/about-us" className={`mobile-nav-link ${isActive('/about-us') ? 'active' : ''}`} onClick={closeMenu}>About Us</Link>

              {isAuthenticated && (
                <div className="mobile-nav-group">
                  <div className="mobile-nav-group-title">My Account</div>
                  <Link to="/orders" className={`mobile-nav-link ${isActive('/orders') ? 'active' : ''}`} onClick={closeMenu}>My Orders</Link>
                  <Link to="/favorites" className={`mobile-nav-link ${isActive('/favorites') ? 'active' : ''}`} onClick={closeMenu}>My Favorites</Link>
                  <Link to="/addresses" className={`mobile-nav-link ${isActive('/addresses') ? 'active' : ''}`} onClick={closeMenu}>Saved Addresses</Link>
                  <Link to="/messages" className={`mobile-nav-link ${isActive('/messages') ? 'active' : ''}`} onClick={closeMenu}>Support Messages</Link>
                  <Link to="/profile" className={`mobile-nav-link ${isActive('/profile') ? 'active' : ''}`} onClick={closeMenu}>Account Settings</Link>
                </div>
              )}

              <Link to="/contact" className={`mobile-nav-link ${isActive('/contact') ? 'active' : ''}`} onClick={closeMenu}>Contact Us</Link>
              <Link to="/policies/return-and-refund" className={`mobile-nav-link ${isActive('/policies/return-and-refund') ? 'active' : ''}`} onClick={closeMenu}>Return Policy</Link>
            </nav>

            <div className="mobile-nav-footer">
              {isAuthenticated ? (
                <button className="mobile-logout-btn" onClick={handleLogout}>
                  <LogIn size={18} /> Logout
                </button>
              ) : (
                <Link className="mobile-logout-btn" to="/login" onClick={closeMenu}>
                  <LogIn size={18} /> Login
                </Link>
              )}
            </div>
          </aside>
        </>,
        document.body
      )}
    </div>
  );
};

export default Header;
