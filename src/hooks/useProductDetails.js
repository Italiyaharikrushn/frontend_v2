import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useGetProductByIdQuery } from '../api/productApi';
import { selectIsAuthenticated } from '../redux/authSlice';
import { addItem } from '../redux/cartSlice';
import { useToast } from '../components/common/ToastProvider';

export const useProductDetails = ({ propId, isModal }) => {
  const { id: paramId } = useParams();
  const id = propId || paramId;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pushToast } = useToast();

  const { data: product, isLoading, isError } = useGetProductByIdQuery(id);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [pincode, setPincode] = useState('');
  const [phoneModel, setPhoneModel] = useState('');
  const [quantity, setQuantity] = useState(1);

  const [coverType, setCoverType] = useState('standard'); // 'standard' or 'custom_name'
  const [customName, setCustomName] = useState('');

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
    let finalPrice = product.discountPrice ? parseFloat(product.discountPrice) : parseFloat(product.price);
    if (isPhoneCover && coverType === 'custom_name' && product.customNamePrice) {
      finalPrice = product.discountCustomNamePrice 
        ? parseFloat(product.discountCustomNamePrice) 
        : parseFloat(product.customNamePrice);
    }

    dispatch(addItem({
      id: product.id || product._id,
      name: product.title,
      price: finalPrice,
      category: product.category || product.globalCategory || 'general',
      image: (product.images && product.images.length > 0) ? product.images[0] : null,
      phoneModel: isPhoneCover ? phoneModel : undefined,
      coverType: isPhoneCover ? coverType : undefined,
      customName: isPhoneCover && coverType === 'custom_name' ? customName : undefined,
      quantity,
    }));

    pushToast(`${quantity} ${product.title} added to your cart.`, 'success');
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/cart');
  };

  const baseCurrentPrice = product ? (product.discountPrice ? parseFloat(product.discountPrice) : parseFloat(product.price)) : 0;
  const baseOriginalPrice = product ? parseFloat(product.price) || 0 : 0;

  const customNamePriceOriginal = product && product.customNamePrice ? parseFloat(product.customNamePrice) : baseOriginalPrice;
  const customNamePriceCurrent = product && product.discountCustomNamePrice 
    ? parseFloat(product.discountCustomNamePrice) 
    : (product && product.customNamePrice ? parseFloat(product.customNamePrice) : baseCurrentPrice);

  const currentPrice = isPhoneCover && coverType === 'custom_name' ? customNamePriceCurrent : baseCurrentPrice;
  const originalPrice = isPhoneCover && coverType === 'custom_name' ? customNamePriceOriginal : baseOriginalPrice;

  return {
    product, isLoading, isError, pincode, setPincode,
    phoneModel, setPhoneModel, quantity, setQuantity,
    isPhoneCover, currentPrice, originalPrice,
    coverType, setCoverType, customName, setCustomName,
    handleAddToCart, handleBuyNow, navigate
  };
};
