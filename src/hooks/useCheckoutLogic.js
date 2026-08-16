import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems, clearCart } from '../redux/cartSlice';
import { useAddAddressMutation, useAddToBackendCartMutation, useCheckoutOrderMutation, useClearBackendCartMutation, useGetUserAddressesQuery } from '../api/orderApi';
import { useValidateCouponMutation } from '../api/couponApi';
import { useGetStorePolicyQuery } from '../api/policyApi';
import { useToast } from '../components/ui/ToastProvider';
import { useGetProductsByIdsMutation } from '../api/productApi';

export const useCheckoutLogic = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const rawCartItems = useSelector(selectCartItems);
  const [paymentMethod, setPaymentMethod] = useState('gpay');
  const [selectedAddressId, setSelectedAddressId] = useState('new');
  const [isProcessing, setIsProcessing] = useState(false);
  const [phone, setPhone] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingAddressId, setPendingAddressId] = useState(null);
  const [showPaymentSection, setShowPaymentSection] = useState(false);
  const isSubmittingRef = useRef(false);

  const { data: addresses = [], isLoading: isLoadingAddresses } = useGetUserAddressesQuery();
  const { data: storePolicy } = useGetStorePolicyQuery();

  useEffect(() => {
    if (addresses.length >= 5 && selectedAddressId === 'new') {
      setSelectedAddressId(addresses[0]?.id || 'new');
    }
  }, [addresses, selectedAddressId]);

  const [couponCode, setCouponCode] = useState('');
  const [appliedCouponCode, setAppliedCouponCode] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const { pushToast } = useToast();

  const [getProductsByIds, { data: allProducts = [] }] = useGetProductsByIdsMutation();

  useEffect(() => {
    if (rawCartItems.length > 0) {
      const ids = rawCartItems.map(item => item.id);
      getProductsByIds(ids);
    }
  }, [rawCartItems, getProductsByIds]);

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
  const [validateCouponApi] = useValidateCouponMutation();

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal - discountAmount;

  const validateCoupon = async () => {
    setCouponError('');
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code.');
      return;
    }
    try {
      const res = await validateCouponApi({ code: couponCode, cartTotal: subtotal }).unwrap();
      setDiscountAmount(res.discountAmount);
      setAppliedCouponCode(couponCode);
      pushToast('Coupon applied successfully!', 'success');
    } catch (err) {
      setDiscountAmount(0);
      setAppliedCouponCode(null);
      setCouponError(err?.data?.error || 'Failed to apply coupon.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmittingRef.current) return;

    if (!showPaymentSection) {
      setShowPaymentSection(true);
      setTimeout(() => {
        const el = document.getElementById('payment-method-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }

    isSubmittingRef.current = true;
    setIsProcessing(true);

    try {
      let finalAddressId;

      if (selectedAddressId === 'new') {
        const rawPhone = e.target.phone?.value || phone || '';
        const addressPayload = {
          fullName: `${e.target.firstName?.value || ''} ${e.target.lastName?.value || ''}`.trim(),
          streetAddress: e.target.address?.value || '',
          city: e.target.city?.value || '',
          state: e.target.state?.value || '',
          postalCode: e.target.zip?.value || '',
          country: e.target.country?.value || 'India',
          phoneNumber: rawPhone.trim(),
        };

        const savedAddress = await addAddress(addressPayload).unwrap();
        if (!savedAddress || !savedAddress.id) {
          throw new Error('Failed to save address properly.');
        }
        finalAddressId = savedAddress.id;
      } else {
        finalAddressId = selectedAddressId;
      }
      setPendingAddressId(finalAddressId);

      if (['gpay', 'paytm', 'phonepe'].includes(paymentMethod)) {
        setIsProcessing(false);
        setShowPaymentModal(true);
        isSubmittingRef.current = false;
        return;
      }

      isSubmittingRef.current = false;
      await finalizeOrder(finalAddressId);
    } catch (error) {
      console.error('Checkout failed:', error);
      const msg = error?.data?.message || error?.message || 'Checkout failed. Please check your details.';
      pushToast(msg, 'error');
      setIsProcessing(false);
      isSubmittingRef.current = false;
    }
  };

  const finalizeOrder = async (addressIdToUse) => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsProcessing(true);
    try {
      const addrId = addressIdToUse || pendingAddressId;
      await checkoutOrder({ addressId: addrId, couponCode: appliedCouponCode, paymentMethod }).unwrap();
      setIsProcessing(false);
      setShowPaymentModal(false);
      dispatch(clearCart());
      pushToast('Order placed successfully. Thank you for shopping with us.', 'success');
      navigate('/');
    } catch (error) {
      console.error('Checkout failed:', error);
      const msg = error?.data?.message || error?.message || 'Checkout failed. Please try again or check your connection.';
      pushToast(msg, 'error');
      setIsProcessing(false);
      setShowPaymentModal(false);
      isSubmittingRef.current = false;
    }
  };

  return { cartItems, paymentMethod, setPaymentMethod, selectedAddressId, setSelectedAddressId, isProcessing, subtotal, total, handleSubmit, navigate, couponCode, setCouponCode, appliedCouponCode, discountAmount, couponError, validateCoupon, phone, setPhone, addresses, isLoadingAddresses, showPaymentModal, setShowPaymentModal, finalizeOrder, showPaymentSection, storePolicy };
};
