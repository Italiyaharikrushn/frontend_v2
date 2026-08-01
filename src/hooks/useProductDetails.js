import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useGetProductByIdQuery } from '../api/productApi';
import { useAddToBackendCartMutation } from '../api/orderApi';
import { selectIsAuthenticated } from '../redux/authSlice';
import { addItem } from '../redux/cartSlice';
import { useToast } from '../components/ui/ToastProvider';

export const useProductDetails = ({ propId, isModal }) => {
  const { id: paramId } = useParams();
  const id = propId || paramId;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pushToast } = useToast();

  const { data: product, isLoading, isError } = useGetProductByIdQuery(id);
  const [addToBackendCart, { isLoading: isAdding }] = useAddToBackendCartMutation();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [pincode, setPincode] = useState('');
  const [phoneModel, setPhoneModel] = useState('');
  const [quantity, setQuantity] = useState(1);

  const isPhoneCover = product ? (product.category?.toLowerCase().includes('cover') || product.title?.toLowerCase().includes('cover')) : false;

  useEffect(() => {
    if (isModal) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isModal]);

  const handleAddToCart = async () => {
    dispatch(addItem({
      id: product.id,
      name: product.title,
      price: product.discountPrice ? parseFloat(product.discountPrice) : parseFloat(product.price),
      category: product.category || product.globalCategory || 'general',
      image: (product.images && product.images.length > 0) ? product.images[0] : null,
      phoneModel: isPhoneCover ? phoneModel : undefined,
      quantity,
    }));

    pushToast(`${quantity} ${product.title} added to your cart.`, 'success');

    if (isAuthenticated) {
      try {
        await addToBackendCart({
          productId: product.id,
          quantity: quantity,
          phoneModel: isPhoneCover ? phoneModel : undefined
        }).unwrap();
      } catch (error) {
        console.error('Failed to save item to database cart:', error);
      }
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/cart');
  };

  const currentPrice = product ? (product.discountPrice ? parseFloat(product.discountPrice) : parseFloat(product.price)) : 0;
  const originalPrice = product ? parseFloat(product.price) || 0 : 0;

  return { product, isLoading, isError, isAdding, pincode, setPincode, phoneModel, setPhoneModel, quantity, setQuantity, isPhoneCover, currentPrice, originalPrice, handleAddToCart, handleBuyNow, navigate };
};
