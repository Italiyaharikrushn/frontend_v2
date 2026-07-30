import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems, clearCart } from '../redux/cartSlice';
import { useAddAddressMutation, useAddToBackendCartMutation, useCheckoutOrderMutation, useClearBackendCartMutation } from '../api/orderApi';
import { useToast } from '../components/ui/ToastProvider';
import { useGetProductsQuery } from '../api/productApi';

export const useCheckoutLogic = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const rawCartItems = useSelector(selectCartItems);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [selectedAddressId, setSelectedAddressId] = useState('new');
  const [isProcessing, setIsProcessing] = useState(false);
  const { pushToast } = useToast();

  const { data: allProducts = [] } = useGetProductsQuery();

  const cartItems = useMemo(() => {
    return rawCartItems.map(item => {
      const product = allProducts.find(p => p.id === item.id);
      if (product) {
        const latestPrice = product.discountPrice ? parseFloat(product.discountPrice) : parseFloat(product.price);
        return { ...item, price: latestPrice };
      }
      return item;
    });
  }, [rawCartItems, allProducts]);

  const [addAddress] = useAddAddressMutation();
  const [addToBackendCart] = useAddToBackendCartMutation();
  const [clearBackendCart] = useClearBackendCartMutation();
  const [checkoutOrder] = useCheckoutOrderMutation();

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const shipping = 15.00;
  const total = subtotal + tax + shipping;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      let finalAddressId;

      if (selectedAddressId === 'new') {
        const addressPayload = {
          fullName: `${e.target.firstName.value} ${e.target.lastName.value}`,
          streetAddress: e.target.address.value,
          city: e.target.city.value,
          state: e.target.state.value,
          postalCode: e.target.zip.value,
          country: e.target.country.value,
          phoneNumber: e.target.phone.value,
        };

        const savedAddress = await addAddress(addressPayload).unwrap();
        if (!savedAddress || !savedAddress.id) {
          throw new Error('Failed to save address properly.');
        }
        finalAddressId = savedAddress.id;
      } else {
        finalAddressId = selectedAddressId;
      }

      await clearBackendCart().unwrap();
      for (const item of cartItems) {
        await addToBackendCart({ productId: item.id, quantity: item.quantity, phoneModel: item.phoneModel }).unwrap();
      }

      await checkoutOrder(finalAddressId).unwrap();

      setIsProcessing(false);
      dispatch(clearCart());
      pushToast('Order placed successfully. Thank you for shopping with us.', 'success');
      navigate('/');
    } catch (error) {
      console.error('Checkout failed:', error);
      pushToast('Checkout failed. Please try again or check your connection.', 'error');
      setIsProcessing(false);
    }
  };

  return { cartItems, paymentMethod, setPaymentMethod, selectedAddressId, setSelectedAddressId, isProcessing, subtotal, tax, shipping, total, handleSubmit, navigate };
};
