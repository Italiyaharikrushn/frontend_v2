import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { selectCartTotalQuantity } from '../redux/cartSlice';
import { 
  selectIsAuthenticated, 
  selectUserName, 
  selectUserEmail, 
  logout 
} from '../redux/authSlice';

export const useHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const cartQuantity = useSelector(selectCartTotalQuantity);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userName = useSelector(selectUserName);
  const userEmail = useSelector(selectUserEmail);

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
      setIsSearchOpen(false);
    }
  }, [location.pathname, urlSearch]);

  const closeMenu = () => setIsMenuOpen(false);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val === "" && location.pathname === "/products") {
      navigate("/products");
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      navigate('/products?search=' + encodeURIComponent(query));
      setIsMenuOpen(false);
      setIsSearchOpen(false);
    } else if (location.pathname === "/products") {
      navigate('/products');
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    if (location.pathname === '/products') {
      navigate('/products');
    }
    searchInputRef.current?.focus();
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
    navigate('/');
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    if (path === '/products') {
      return location.pathname === '/products' || location.pathname.startsWith('/product/');
    }
    return false;
  };

  return {
    cartQuantity,
    isAuthenticated,
    userName,
    userEmail,
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    isMenuOpen,
    setIsMenuOpen,
    searchInputRef,
    closeMenu,
    handleSearchSubmit,
    handleSearchChange,
    handleClearSearch,
    handleLogout,
    isActive,
  };
};

export default useHeader;
