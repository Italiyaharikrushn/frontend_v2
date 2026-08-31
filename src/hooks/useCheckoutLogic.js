import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems, clearCart } from '../redux/cartSlice';
import { useAddToBackendCartMutation, useCheckoutOrderMutation, useClearBackendCartMutation, useCreateRazorpayOrderMutation } from '../api/orderApi';
import { useGetShippingAddressesQuery, useGetBillingAddressesQuery, useAddShippingAddressMutation, useAddBillingAddressMutation } from '../api/addressApi';
import { useValidateCouponMutation } from '../api/couponApi';
import { useGetStorePolicyQuery } from '../api/policyApi';
import { useToast } from '../components/common/ToastProvider';
import { useGetProductsByIdsMutation } from '../api/productApi';

export const useCheckoutLogic = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const rawCartItems = useSelector(selectCartItems);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [selectedAddressId, setSelectedAddressId] = useState('new');
  const [isProcessing, setIsProcessing] = useState(false);
  const [phone, setPhone] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingAddressId, setPendingAddressId] = useState(null);
  const [showPaymentSection, setShowPaymentSection] = useState(false);
  const isSubmittingRef = useRef(false);

  const { data: shippingAddresses = [], isLoading: isLoadingShippingAddresses } = useGetShippingAddressesQuery();
  const { data: billingAddresses = [], isLoading: isLoadingBillingAddresses } = useGetBillingAddressesQuery();
  const isLoadingAddresses = isLoadingShippingAddresses || isLoadingBillingAddresses;
  const { data: storePolicy } = useGetStorePolicyQuery();

  useEffect(() => {
    if (shippingAddresses.length > 0 && selectedAddressId === 'new' && shippingAddresses.length >= 5) {
      setSelectedAddressId(shippingAddresses[0]?.id || 'new');
    }
  }, [shippingAddresses, selectedAddressId]);

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

  const [addShippingAddress] = useAddShippingAddressMutation();
  const [addBillingAddress] = useAddBillingAddressMutation();
  const [addToBackendCart] = useAddToBackendCartMutation();
  const [clearBackendCart] = useClearBackendCartMutation();
  const [checkoutOrder] = useCheckoutOrderMutation();
  const [validateCouponApi] = useValidateCouponMutation();
  const [createRazorpayOrderApi] = useCreateRazorpayOrderMutation();

  const shippingCharge = storePolicy?.shippingCharge != null ? Number(storePolicy.shippingCharge) : 0;
  const taxPercentage = storePolicy?.taxPercentage != null ? Number(storePolicy.taxPercentage) : 0;

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const taxAmount = (discountedSubtotal * taxPercentage) / 100;
  const total = discountedSubtotal + shippingCharge + taxAmount;

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

  const [isBillingSameAsShipping, setIsBillingSameAsShipping] = useState(true);
  const [selectedBillingAddressId, setSelectedBillingAddressId] = useState('new');
  const [pendingBillingAddressId, setPendingBillingAddressId] = useState(null);
  const [billingPhone, setBillingPhone] = useState('');

  useEffect(() => {
    if (billingAddresses.length > 0 && selectedBillingAddressId === 'new' && billingAddresses.length >= 5) {
      setSelectedBillingAddressId(billingAddresses[0]?.id || 'new');
    }
  }, [billingAddresses, selectedBillingAddressId]);

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
      let finalBillingAddressId = null;

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

        const savedAddress = await addShippingAddress(addressPayload).unwrap();
        if (!savedAddress || !savedAddress.id) {
          throw new Error('Failed to save shipping address properly.');
        }
        finalAddressId = savedAddress.id;
      } else {
        finalAddressId = selectedAddressId;
      }
      setPendingAddressId(finalAddressId);

      if (!isBillingSameAsShipping) {
        if (selectedBillingAddressId === 'new') {
          const rawBillPhone = e.target.billingPhone?.value || billingPhone || '';
          const addressPayload = {
            fullName: `${e.target.billingFirstName?.value || ''} ${e.target.billingLastName?.value || ''}`.trim(),
            streetAddress: e.target.billingAddress?.value || '',
            city: e.target.billingCity?.value || '',
            state: e.target.billingState?.value || '',
            postalCode: e.target.billingZip?.value || '',
            country: e.target.billingCountry?.value || 'India',
            phoneNumber: rawBillPhone.trim(),
          };
          const savedBillingAddress = await addBillingAddress(addressPayload).unwrap();
          if (!savedBillingAddress || !savedBillingAddress.id) {
            throw new Error('Failed to save billing address properly.');
          }
          finalBillingAddressId = savedBillingAddress.id;
        } else {
          finalBillingAddressId = selectedBillingAddressId;
        }
        setPendingBillingAddressId(finalBillingAddressId);
      }

      isSubmittingRef.current = false;
      await finalizeOrder(finalAddressId, finalBillingAddressId);
    } catch (error) {
      console.error('Checkout failed:', error);
      const msg = error?.data?.message || error?.message || 'Checkout failed. Please check your details.';
      pushToast(msg, 'error');
      setIsProcessing(false);
      isSubmittingRef.current = false;
    }
  };

  const finalizeOrder = async (addressIdToUse, billingAddressIdToUse) => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsProcessing(true);
    try {
      const addrId = addressIdToUse || pendingAddressId;
      const billAddrId = !isBillingSameAsShipping ? (billingAddressIdToUse || pendingBillingAddressId) : null;

      if (paymentMethod === 'razorpay') {
        const rzpResponse = await createRazorpayOrderApi({ addressId: addrId, couponCode: appliedCouponCode }).unwrap();

        if (rzpResponse.razorpayOrderId && rzpResponse.razorpayOrderId.startsWith('mock_order_')) {
          try {
            await checkoutOrder({
              addressId: addrId,
              billingAddressId: billAddrId,
              couponCode: appliedCouponCode,
              paymentMethod: 'razorpay',
              razorpayPaymentId: "mock_pay_" + Date.now(),
              razorpayOrderId: rzpResponse.razorpayOrderId,
              razorpaySignature: "mock_sig_12345"
            }).unwrap();
            dispatch(clearCart());
            pushToast('Payment successful (Mocked for testing).', 'success');
            navigate('/');
          } catch (err) {
            pushToast(err?.data?.message || 'Mock payment verification failed.', 'error');
          }
          setIsProcessing(false);
          setShowPaymentModal(false);
          isSubmittingRef.current = false;
          return;
        }

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY,
          amount: Math.round((rzpResponse.totalAmount || total) * 100),
          currency: "INR",
          name: "Kiya Ecommerce",
          description: "Order Payment",
          order_id: rzpResponse.razorpayOrderId,
          handler: async function (response) {
            try {
              await checkoutOrder({
                addressId: addrId,
                billingAddressId: billAddrId,
                couponCode: appliedCouponCode,
                paymentMethod: 'razorpay',
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature
              }).unwrap();
              dispatch(clearCart());
              pushToast('Payment successful and order placed.', 'success');
              navigate('/');
            } catch (err) {
              pushToast(err?.data?.message || 'Payment verification failed.', 'error');
            }
          },
          prefill: {
            name: rzpResponse.customerName,
            email: rzpResponse.customerEmail,
            contact: rzpResponse.customerPhone
          },
          theme: {
            color: "var(--primary)"
          },
          modal: {
            ondismiss: function () {
              pushToast('Payment window closed. Please try again.', 'error');
            }
          }
        };
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          pushToast(response.error.description || 'Payment failed. Please try again.', 'error');
        });
        rzp.open();
        setIsProcessing(false);
        setShowPaymentModal(false);
        isSubmittingRef.current = false;
      } else {
        await checkoutOrder({ addressId: addrId, billingAddressId: billAddrId, couponCode: appliedCouponCode, paymentMethod }).unwrap();
        setIsProcessing(false);
        setShowPaymentModal(false);
        dispatch(clearCart());
        pushToast('Order placed successfully. Thank you for shopping with us.', 'success');
        navigate('/');
      }
    } catch (error) {
      console.error('Checkout failed:', error);
      const msg = error?.data?.message || error?.message || 'Checkout failed. Please try again or check your connection.';
      pushToast(msg, 'error');
      setIsProcessing(false);
      setShowPaymentModal(false);
      isSubmittingRef.current = false;
    }
  };

  return {
    cartItems, paymentMethod, setPaymentMethod, selectedAddressId, setSelectedAddressId,
    isProcessing, subtotal, shippingCharge, taxPercentage, taxAmount, total, handleSubmit, navigate, couponCode, setCouponCode,
    appliedCouponCode, discountAmount, couponError, validateCoupon, phone, setPhone,
    shippingAddresses, billingAddresses, isLoadingAddresses, showPaymentModal, setShowPaymentModal, finalizeOrder,
    showPaymentSection, storePolicy,
    isBillingSameAsShipping, setIsBillingSameAsShipping, selectedBillingAddressId, setSelectedBillingAddressId,
    billingPhone, setBillingPhone
  };
};
