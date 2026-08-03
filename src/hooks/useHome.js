import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetProductsQuery } from '../api/productApi';
import { useGetPublicStoreSettingsQuery } from '../api/settingsApi';
import { useAddToBackendCartMutation } from '../api/orderApi';
import { addItem } from '../redux/cartSlice';
import { selectIsAuthenticated } from '../redux/authSlice';
import { useToast } from '../components/ui/ToastProvider';

export const useHome = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { pushToast } = useToast();
  const { data = {}, isLoading } = useGetProductsQuery({ page: 0, size: 20 });
  const products = data.content || [];
  const { data: settings } = useGetPublicStoreSettingsQuery();
  const [addToBackendCart] = useAddToBackendCartMutation();

  let trendingProducts = [];
  if (settings?.isFestivalActive && settings?.festivalName) {
    const festivalKeyword = settings.festivalName.split(/\s+/)[0].toLowerCase();
    const relatedProducts = products.filter(p => {
      const text = `${p.title || ''} ${p.description || ''} ${p.category || ''}`.toLowerCase();
      return text.includes(festivalKeyword);
    });
    trendingProducts = relatedProducts.slice(0, 8);
  }
  
  if (trendingProducts.length === 0) {
    trendingProducts = [...products].slice(0, 8);
  }
  const [quickViewProductId, setQuickViewProductId] = useState(null);

  const handleAddToCart = async (e, product) => {
    e.stopPropagation();
    dispatch(addItem({
      id: product.id,
      name: product.title,
      price: product.discountPrice ? parseFloat(product.discountPrice) : parseFloat(product.price),
      category: product.category || 'general',
      image: (product.images && product.images.length > 0) ? product.images[0] : null,
      quantity: 1,
    }));

    pushToast(`${product.title} added to your cart.`, 'success');

    if (isAuthenticated) {
      try {
        await addToBackendCart({ productId: product.id, quantity: 1 }).unwrap();
      } catch (error) {
        console.error('Failed to save item to database cart:', error);
      }
    }
  };

  return {
    products,
    isLoading,
    trendingProducts,
    quickViewProductId,
    setQuickViewProductId,
    handleAddToCart,
  };
};

export default useHome;
