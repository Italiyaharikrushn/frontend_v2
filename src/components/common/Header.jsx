import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ShoppingCart, Menu, Search, X, Package, LogIn, } from "lucide-react";

import { selectCartTotalQuantity } from "../../redux/cartSlice";
import { selectIsAuthenticated, selectUserName, selectUserEmail, logout, } from "../../redux/authSlice";
import { useGetPublicStoreSettingsQuery } from "../../api/settingsApi";
import CustomerProfileMenu from "./CustomerProfileMenu";
import "@/styles/css/components/Header.css";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const cartQuantity = useSelector(selectCartTotalQuantity);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userName = useSelector(selectUserName);
  const userEmail = useSelector(selectUserEmail);

  const { data: storeSettings } = useGetPublicStoreSettingsQuery();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const searchInputRef = useRef(null);

  const urlSearch = new URLSearchParams(location.search).get("search") || "";

  useEffect(() => {
    if (location.pathname === "/products" && urlSearch) {
      setSearchQuery(urlSearch);
    } else if (location.pathname !== "/products") {
      setSearchQuery("");
      setIsSearchOpen(false); // Close mobile search if navigating away
    }
  }, [location.pathname, urlSearch]);

  const closeMenu = () => setIsMenuOpen(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    setIsSearchOpen(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
    if (location.pathname === "/products") {
      navigate("/products");
    }
    searchInputRef.current?.focus();
  };

  const handleLogout = () => {
    dispatch(logout());
    closeMenu();
    window.location.reload();
  };

  const getAvatarInitial = () => {
    if (userName) return userName.charAt(0).toUpperCase();
    if (userEmail) return userEmail.charAt(0).toUpperCase();
    return "U";
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    if (path === '/contact') return location.pathname === '/contact';
    if (path === '/orders') return location.pathname === '/orders';

    if (path === '/products') {
      return location.pathname === '/products' || location.pathname.startsWith('/product/');
    }
    return false;
  };

  return (
    <>
      <header className="header glass-panel">
        <div className="header-container">

          <div className="header-left">
            <button
              className="mobile-menu-btn mobile-only"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <Link to="/" className="brand-logo" onClick={closeMenu}>
              {storeSettings?.storeName || (
                <>
                  KIYA <span className="brand-subtitle">Accessories</span>
                </>
              )}
            </Link>
          </div>

          <nav className="desktop-nav desktop-only">
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
            <Link to="/products" className={`nav-link ${isActive('/products') ? 'active' : ''}`}>Shop</Link>
            <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>Contact</Link>
          </nav>

          <div className="header-right">
            <div className={`search-container ${isSearchOpen ? "mobile-active" : ""}`}>
              <form
                className={`search-form ${!isSearchOpen ? "mobile-hidden" : ""}`}
                onSubmit={handleSearchSubmit}
              >
                <Search size={18} className="search-icon-static" />
                <input
                  ref={searchInputRef}
                  type="text"
                  className="search-input"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="clear-search-btn"
                    onClick={clearSearch}
                    aria-label="Clear Search"
                  >
                    <X size={16} />
                  </button>
                )}
              </form>

              {!isSearchOpen && (
                <button
                  className="action-btn mobile-only search-trigger"
                  onClick={() => {
                    setIsSearchOpen(true);
                    setTimeout(() => searchInputRef.current?.focus(), 100);
                  }}
                  aria-label="Open Search"
                >
                  <Search size={22} />
                </button>
              )}
            </div>

            {isAuthenticated && (
              <Link className="action-btn desktop-only" to="/orders" aria-label="My Orders">
                <Package size={22} />
              </Link>
            )}

            <Link className="action-btn cart-btn" to="/cart" aria-label="Shopping Cart">
              <ShoppingCart size={22} />
              {cartQuantity > 0 && (
                <span className="cart-badge fade-in">{cartQuantity}</span>
              )}
            </Link>

            <div className="profile-container desktop-only">
              {isAuthenticated ? (
                <CustomerProfileMenu />
              ) : (
                <Link className="action-btn login-btn" to="/login" aria-label="Login">
                  <LogIn size={22} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Navigation */}
      <div
        className={`mobile-nav-backdrop ${isMenuOpen ? "open" : ""}`}
        onClick={closeMenu}
      />

      <div className={`mobile-nav-panel ${isMenuOpen ? "open" : ""}`}>
        <div className="mobile-nav-header">
          <span>Explore</span>
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
          <Link to="/products" className={`mobile-nav-link ${isActive('/products') ? 'active' : ''}`} onClick={closeMenu}>Shop All</Link>

          {isAuthenticated && (
            <div className="mobile-nav-group">
              <span className="mobile-nav-group-title">My Account</span>
              <Link to="/orders" className={`mobile-nav-link ${isActive('/orders') ? 'active' : ''}`} onClick={closeMenu}>Orders</Link>
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
    </>
  );
};

export default Header;
