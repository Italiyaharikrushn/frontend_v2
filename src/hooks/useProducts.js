import { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../redux/cartSlice';
import { selectIsAuthenticated } from '../redux/authSlice';
import { useGetProductsQuery, useGetCategoriesQuery } from '../api/productApi';
import { useToast } from '../components/ui/ToastProvider';

export const useProducts = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  const category = queryParams.get('category');
  const searchQuery = queryParams.get('search');
  const minPrice = queryParams.get('minPrice') || '';
  const maxPrice = queryParams.get('maxPrice') || '';
  const inStock = true; // Always true for customers
  const sortBy = queryParams.get('sortBy') || '';
  const sortDir = queryParams.get('sortDir') || '';

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { pushToast } = useToast();
  
  const [quickViewProductId, setQuickViewProductId] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [page, setPage] = useState(0);
  const size = 12;

  const [localMinPrice, setLocalMinPrice] = useState(minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice);

  useEffect(() => {
    setLocalMinPrice(minPrice);
    setLocalMaxPrice(maxPrice);
  }, [minPrice, maxPrice]);

  const handleProductClick = (productId) => {
    if (window.innerWidth <= 768) {
      navigate(`/product/${productId}`);
    } else {
      setQuickViewProductId(productId);
    }
  };

  useEffect(() => { 
    setPage(0); 
  }, [category, searchQuery, minPrice, maxPrice, inStock, sortBy, sortDir]);

  const handleQuantityChange = (id, delta) => {
    setQuantities(prev => {
      const current = prev[id] || 1;
      const next = Math.max(1, (current === '' ? 1 : current) + delta);
      return { ...prev, [id]: next };
    });
  };

  const handleQuantityInputChange = (id, value) => {
    const cleanValue = value.replace(/-/g, '');
    const val = parseInt(cleanValue, 10);
    setQuantities(prev => ({
      ...prev,
      [id]: isNaN(val) ? '' : (val === 0 ? 1 : val)
    }));
  };

  const handleQuantityBlur = (id) => {
    setQuantities(prev => {
      const current = prev[id];
      if (current === '' || current < 1) {
        return { ...prev, [id]: 1 };
      }
      return prev;
    });
  };

  const { data = {}, isLoading } = useGetProductsQuery({
    page,
    size,
    category: category || '',
    search: searchQuery || '',
    minPrice,
    maxPrice,
    inStock,
    sortBy,
    sortDir
  });
  
  const products = data.content || [];
  const totalPages = data.totalPages || 0;

  const { data: categories = [] } = useGetCategoriesQuery(true);

  const dynamicCategories = useMemo(() => {
    if (!categories || categories.length === 0) return ["All"];
    const catSet = new Set();
    categories.forEach(c => {
      if (c) {
        const capitalized = c.charAt(0).toUpperCase() + c.slice(1).toLowerCase();
        catSet.add(capitalized);
      }
    });
    return ["All", ...Array.from(catSet).sort()];
  }, [categories]);

  let title = 'Our Collection';
  let subtitle = 'Explore our complete collection of exquisite accessories designed to elevate your style.';
  if (searchQuery) {
    title = 'Search Results';
    subtitle = `Showing results for "${searchQuery}"`;
  } else if (category) {
    title = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
    subtitle = `Explore our exclusive collection of ${title.toLowerCase()}.`;
  }

  const handleAddToCart = async (product) => {
    const qty = quantities[product.id] || 1;
    dispatch(addItem({
      id: product.id,
      name: product.title,
      price: product.discountPrice ? parseFloat(product.discountPrice) : parseFloat(product.price),
      category: category || 'general',
      image: (product.images && product.images.length > 0) ? product.images[0] : null,
      quantity: qty,
    }));
    pushToast(`${qty} ${product.title} added to your cart.`, 'success');
    setQuantities(prev => ({ ...prev, [product.id]: 1 }));
  };

  const applyFilters = (filters) => {
    const params = new URLSearchParams(location.search);
    
    if (filters.category !== undefined) {
      if (filters.category === "All") {
        params.delete('category');
      } else {
        params.set('category', filters.category.toLowerCase());
      }
    }
    
    if (filters.minPrice !== undefined) {
      if (filters.minPrice) params.set('minPrice', filters.minPrice); else params.delete('minPrice');
    }
    if (filters.maxPrice !== undefined) {
      if (filters.maxPrice) params.set('maxPrice', filters.maxPrice); else params.delete('maxPrice');
    }
    if (filters.sortBy !== undefined) {
      if (filters.sortBy) {
        params.set('sortBy', filters.sortBy);
        params.set('sortDir', filters.sortDir || 'asc');
      } else {
        params.delete('sortBy');
        params.delete('sortDir');
      }
    }
    setPage(0);
    navigate({ search: params.toString() });
  };

  const handleCategorySelect = (cat) => {
    applyFilters({ category: cat });
  };

  const clearFilters = () => {
    setLocalMinPrice('');
    setLocalMaxPrice('');
    navigate({ search: '' });
  };

  const hasActiveFilters = Boolean(category || searchQuery || minPrice || maxPrice || sortBy);

  return {
    category,
    searchQuery,
    quickViewProductId,
    setQuickViewProductId,
    quantities,
    handleQuantityChange,
    handleQuantityInputChange,
    handleQuantityBlur,
    isLoading,
    dynamicCategories,
    products,
    page,
    setPage,
    totalPages,
    title,
    subtitle,
    handleAddToCart,
    handleCategorySelect,
    handleProductClick,
    
    // New Filter props
    minPrice,
    maxPrice,
    inStock,
    sortBy,
    sortDir,
    localMinPrice,
    setLocalMinPrice,
    localMaxPrice,
    setLocalMaxPrice,
    applyFilters,
    clearFilters,
    hasActiveFilters
  };
};

export default useProducts;
