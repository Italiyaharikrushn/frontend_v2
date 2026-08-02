import { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../redux/cartSlice';
import { selectIsAuthenticated } from '../redux/authSlice';
import { useGetProductsQuery } from '../api/productApi';
import { useAddToBackendCartMutation } from '../api/orderApi';
import { useToast } from '../components/ui/ToastProvider';

export const useProducts = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category');
  const searchQuery = queryParams.get('search');
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { pushToast } = useToast();
  const [quickViewProductId, setQuickViewProductId] = useState(null);
  const [quantities, setQuantities] = useState({});

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

  const { data: allProducts = [], isLoading } = useGetProductsQuery();
  const [addToBackendCart] = useAddToBackendCartMutation();

  const dynamicCategories = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return ["All"];

    const catSet = new Set();
    allProducts.forEach(p => {
      if (p.category) {
        const capitalized = p.category.charAt(0).toUpperCase() + p.category.slice(1).toLowerCase();
        catSet.add(capitalized);
      }
    });

    return ["All", ...Array.from(catSet).sort()];
  }, [allProducts]);

  const products = allProducts.filter((p) => {
    if (category) return p.category?.toLowerCase() === category.toLowerCase() || p.globalCategory?.toLowerCase() === category.toLowerCase();
    if (searchQuery) return p.title?.toLowerCase().includes(searchQuery.toLowerCase());
    return true;
  });

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

    if (isAuthenticated) {
      try {
        await addToBackendCart({ productId: product.id, quantity: qty }).unwrap();
      } catch (error) {
        console.error('Failed to save item to database cart:', error);
      }
    }
    
    setQuantities(prev => ({ ...prev, [product.id]: 1 }));
  };

  const handleCategorySelect = (cat) => {
    const params = new URLSearchParams(location.search);
    if (cat === "All") {
      params.delete('category');
    } else {
      params.set('category', cat.toLowerCase());
    }
    navigate({ search: params.toString() });
  };

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
    title,
    subtitle,
    handleAddToCart,
    handleCategorySelect,
  };
};

export default useProducts;
