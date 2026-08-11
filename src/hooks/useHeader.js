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
import { useGetProductsQuery } from '../api/productApi';

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
    window.location.href = '/';
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    if (path === '/products') {
      return location.pathname === '/products' || location.pathname.startsWith('/product/');
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // --- Fuzzy Search Suggestions Logic ---
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { data: productsData } = useGetProductsQuery({ page: 0, size: 1000 });
  const products = productsData?.content || [];

  const getSuggestions = (query) => {
    if (!query) return [];
    const q = query.toLowerCase();

    // Exact substring matches first
    const exactMatches = products.filter(p => 
      p.title?.toLowerCase().includes(q) || 
      p.category?.toLowerCase().includes(q)
    );
    
    if (exactMatches.length > 0) return exactMatches.slice(0, 5);

    // Fuzzy match (Levenshtein distance)
    const levenshtein = (a, b) => {
      if (a.length === 0) return b.length;
      if (b.length === 0) return a.length;
      const matrix = [];
      for (let i = 0; i <= b.length; i++) matrix[i] = [i];
      for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
      for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
          if (b.charAt(i - 1) === a.charAt(j - 1)) {
            matrix[i][j] = matrix[i - 1][j - 1];
          } else {
            matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
          }
        }
      }
      return matrix[b.length][a.length];
    };

    const fuzzyMatches = products
      .map(p => {
        const title = p.title?.toLowerCase() || '';
        const words = title.split(/\s+/);
        let minDistance = levenshtein(q, title);
        for (const word of words) {
          const d = levenshtein(q, word);
          if (d < minDistance) minDistance = d;
        }
        return { product: p, distance: minDistance };
      })
      .filter(item => item.distance <= 2) // allow up to 2 typos
      .sort((a, b) => a.distance - b.distance)
      .map(item => item.product);

    return fuzzyMatches.slice(0, 5);
  };

  const searchSuggestions = getSuggestions(searchQuery);

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
    searchSuggestions,
    showSuggestions,
    setShowSuggestions,
  };
};

export default useHeader;
