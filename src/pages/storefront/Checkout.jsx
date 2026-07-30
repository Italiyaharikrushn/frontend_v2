import React, { useEffect, useState } from 'react';
import Button from '../../components/ui/Button';
import { useCheckoutLogic } from '../../hooks/useCheckoutLogic';
import { useGetUserAddressesQuery } from '../../api/orderApi';
import CheckoutForm from '../../components/storefront/CheckoutForm';
import CheckoutSummary from '../../components/storefront/CheckoutSummary';
import '@/styles/css/pages/storefront/Checkout.css';
const Checkout = () => {
  const [phone, setPhone] = useState('');
  const { cartItems, paymentMethod, setPaymentMethod, selectedAddressId, setSelectedAddressId, isProcessing, subtotal, tax, shipping, total, handleSubmit, navigate, couponCode, setCouponCode, appliedCouponCode, discountAmount, couponError, validateCoupon } = useCheckoutLogic();
  const { data: addresses = [], isLoading: isLoadingAddresses } = useGetUserAddressesQuery();

  useEffect(() => {
    if (addresses.length >= 5 && selectedAddressId === 'new') {
      setSelectedAddressId(addresses[0]?.id || 'new');
    }
  }, [addresses, selectedAddressId, setSelectedAddressId]);

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page fade-in" style={{ textAlign: 'center', paddingTop: '10vh' }}>
        <h2>Your cart is empty</h2>
        <p style={{ margin: '1rem 0 2rem', color: 'var(--text-muted)' }}>You need items in your cart to checkout.</p>
        <Button onClick={() => navigate('/products')} variant="primary">Return to Shop</Button>
      </div>
    );
  }

  return (
    <div className="checkout-page fade-in">
      <div className="checkout-header">
        <h1 className="checkout-title">Secure Checkout</h1>
      </div>

      <div className="checkout-content">
        <CheckoutForm
          handleSubmit={handleSubmit}
          phone={phone}
          setPhone={setPhone}
          isLoadingAddresses={isLoadingAddresses}
          addresses={addresses}
          selectedAddressId={selectedAddressId}
          setSelectedAddressId={setSelectedAddressId}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
        />

        <CheckoutSummary
          cartItems={cartItems}
          subtotal={subtotal}
          shipping={shipping}
          tax={tax}
          total={total}
          isProcessing={isProcessing}
          couponCode={couponCode}
          setCouponCode={setCouponCode}
          appliedCouponCode={appliedCouponCode}
          discountAmount={discountAmount}
          couponError={couponError}
          validateCoupon={validateCoupon}
        />
      </div>
    </div>
  );
};

export default Checkout;
