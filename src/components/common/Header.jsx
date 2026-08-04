import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Menu, Search, X, LogIn, User } from "lucide-react";

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
    setSearchQuery,
  } = useHeader();

  const getAvatarInitial = () => {
    if (userName) return userName.charAt(0).toUpperCase();
    if (userEmail) return userEmail.charAt(0).toUpperCase();
    return "U";
  };

  return (
    <div className="crafty-header-wrapper">
      {/* 1. Main Black Header Bar */}
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

          {/* Search Bar Container (Clean input box without Category Dropdown) */}
          <div className="header-center desktop-only" style={{ position: 'relative' }}>
            <form className="crafty-search-form" onSubmit={handleSearchSubmit}>
              <input
                ref={searchInputRef}
                type="text"
                className="crafty-search-input"
                placeholder="Search for products, brands and more..."
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

          {/* Right Action Icons: Account & Cart */}
          <div className="header-right">
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
          <div className="mobile-search-bar mobile-only">
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

      {/* 3. Sub-Navigation Bar */}
      <div className="subnav-bar desktop-only">
        <div className="subnav-container">
          <nav className="subnav-links">
            <Link to="/" className={`subnav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
            <Link to="/products" className={`subnav-link ${isActive('/products') ? 'active' : ''}`}>Shop</Link>
            <Link to="/contact" className={`subnav-link ${isActive('/contact') ? 'active' : ''}`}>Contact Us</Link>
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar Navigation Drawer */}
      <div
        className={`mobile-nav-backdrop ${isMenuOpen ? "open" : ""}`}
        onClick={closeMenu}
      />

      <div className={`mobile-nav-panel ${isMenuOpen ? "open" : ""}`}>
        <div className="mobile-nav-header">
          <CraftyLogo size={32} />
          <button className="action-btn" onClick={closeMenu}>
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

          {isAuthenticated && (
            <div className="mobile-nav-group">
              <span className="mobile-nav-group-title">My Account</span>
              <Link to="/orders" className={`mobile-nav-link ${isActive('/orders') ? 'active' : ''}`} onClick={closeMenu}>My Orders</Link>
            </div>
          )}

          <Link to="/contact" className={`mobile-nav-link ${isActive('/contact') ? 'active' : ''}`} onClick={closeMenu}>Contact Us</Link>
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
      </div>
    </div>
  );
};

export default Header;

