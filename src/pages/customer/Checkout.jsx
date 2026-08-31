import React from 'react';
import Button from '../../components/common/Button';
import { useCheckoutLogic } from '../../hooks/useCheckoutLogic';
import CheckoutForm from '../../components/customer/CheckoutForm';
import CheckoutSummary from '../../components/customer/CheckoutSummary';
import PaymentModal from '../../components/customer/PaymentModal';
import '@/styles/pages/customer/Checkout.css';

const Checkout = () => {
  const {
    cartItems, paymentMethod, setPaymentMethod, selectedAddressId, setSelectedAddressId,
    isProcessing, subtotal, shippingCharge, taxPercentage, taxAmount, total, handleSubmit, navigate, couponCode, setCouponCode,
    appliedCouponCode, discountAmount, couponError, validateCoupon, phone, setPhone,
    shippingAddresses, billingAddresses, isLoadingAddresses, showPaymentModal, setShowPaymentModal, finalizeOrder, showPaymentSection, storePolicy,
    isBillingSameAsShipping, setIsBillingSameAsShipping, selectedBillingAddressId, setSelectedBillingAddressId,
    billingPhone, setBillingPhone
  } = useCheckoutLogic();

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
          shippingAddresses={shippingAddresses}
          billingAddresses={billingAddresses}
          selectedAddressId={selectedAddressId}
          setSelectedAddressId={setSelectedAddressId}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          showPaymentSection={showPaymentSection}
          isBillingSameAsShipping={isBillingSameAsShipping}
          setIsBillingSameAsShipping={setIsBillingSameAsShipping}
          selectedBillingAddressId={selectedBillingAddressId}
          setSelectedBillingAddressId={setSelectedBillingAddressId}
          billingPhone={billingPhone}
          setBillingPhone={setBillingPhone}
        />

        <CheckoutSummary
          cartItems={cartItems}
          subtotal={subtotal}
          shippingCharge={shippingCharge}
          taxPercentage={taxPercentage}
          taxAmount={taxAmount}
          total={total}
          isProcessing={isProcessing}
          couponCode={couponCode}
          setCouponCode={setCouponCode}
          appliedCouponCode={appliedCouponCode}
          discountAmount={discountAmount}
          couponError={couponError}
          validateCoupon={validateCoupon}
          showPaymentSection={showPaymentSection}
          storePolicy={storePolicy}
        />

        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          paymentMethod={paymentMethod}
          total={total}
          onConfirm={() => finalizeOrder()}
        />
      </div>
    </div>
  );
};

export default Checkout;
