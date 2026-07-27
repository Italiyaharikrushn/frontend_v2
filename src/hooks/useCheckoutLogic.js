import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems, clearCart } from '../redux/cartSlice';
import { useAddAddressMutation, useAddToBackendCartMutation, useCheckoutOrderMutation, useClearBackendCartMutation } from '../api/orderApi';
import { useToast } from '../components/ui/ToastProvider';

export const useCheckoutLogic = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isProcessing, setIsProcessing] = useState(false);
  const { pushToast } = useToast();

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

      await clearBackendCart().unwrap();
      for (const item of cartItems) {
        await addToBackendCart({ productId: item.id, quantity: item.quantity }).unwrap();
      }

      await checkoutOrder(savedAddress.id).unwrap();

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

  return {
    cartItems,
    paymentMethod,
    setPaymentMethod,
    isProcessing,
    subtotal,
    tax,
    shipping,
    total,
    handleSubmit,
    navigate
  };
};
