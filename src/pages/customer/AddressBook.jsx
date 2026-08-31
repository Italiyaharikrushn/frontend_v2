import React, { useState } from 'react';
import { MapPin, Plus, Truck, CreditCard } from 'lucide-react';
import Button from '../../components/common/Button';
import AddressCard from '../../components/address/AddressCard';
import AddressForm from '../../components/address/AddressForm';
import {
  useGetShippingAddressesQuery, useAddShippingAddressMutation, useUpdateShippingAddressMutation, useDeleteShippingAddressMutation, useSetDefaultShippingAddressMutation,
  useGetBillingAddressesQuery, useAddBillingAddressMutation, useUpdateBillingAddressMutation, useDeleteBillingAddressMutation, useSetDefaultBillingAddressMutation
} from '../../api/addressApi';
import { useToast } from '../../components/common/ToastProvider';
import { useAlert } from '../../components/common/AlertProvider';
import '@/styles/pages/customer/AddressBook.css';

const initialFormState = {
  id: null,
  fullName: '',
  streetAddress: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'India',
  phoneNumber: '',
  isDefault: false
};

const AddressBook = () => {
  const [activeTab, setActiveTab] = useState('shipping');
  const isShipping = activeTab === 'shipping';

  const { data: shippingAddresses = [], isLoading: isShippingLoading } = useGetShippingAddressesQuery();
  const { data: billingAddresses = [], isLoading: isBillingLoading } = useGetBillingAddressesQuery();

  const [addShippingAddress, { isLoading: isAddingShipping }] = useAddShippingAddressMutation();
  const [updateShippingAddress, { isLoading: isUpdatingShipping }] = useUpdateShippingAddressMutation();
  const [deleteShippingAddress] = useDeleteShippingAddressMutation();
  const [setDefaultShippingAddress] = useSetDefaultShippingAddressMutation();

  const [addBillingAddress, { isLoading: isAddingBilling }] = useAddBillingAddressMutation();
  const [updateBillingAddress, { isLoading: isUpdatingBilling }] = useUpdateBillingAddressMutation();
  const [deleteBillingAddress] = useDeleteBillingAddressMutation();
  const [setDefaultBillingAddress] = useSetDefaultBillingAddressMutation();

  const { pushToast } = useToast();
  const { confirm } = useAlert();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormState);

  const currentAddresses = isShipping ? shippingAddresses : billingAddresses;
  const isLoading = isShipping ? isShippingLoading : isBillingLoading;

  const openAddModal = () => {
    if (currentAddresses.length >= 5) {
      pushToast(`You have reached the maximum limit of 5 saved ${isShipping ? 'shipping' : 'billing'} addresses.`, 'warning');
      return;
    }
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const openEditModal = (address) => {
    setFormData({
      id: address.id,
      fullName: address.fullName || '',
      streetAddress: address.streetAddress || '',
      city: address.city || '',
      state: address.state || '',
      postalCode: address.postalCode || '',
      country: address.country || 'India',
      phoneNumber: address.phoneNumber || '',
      isDefault: address.isDefault || false
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData(initialFormState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.phoneNumber || formData.phoneNumber.trim().length < 8) {
      pushToast('Please enter a valid phone number with country code.', 'error');
      return;
    }

    try {
      if (formData.id) {
        if (isShipping) await updateShippingAddress(formData).unwrap();
        else await updateBillingAddress(formData).unwrap();
        pushToast('Address updated successfully.', 'success');
      } else {
        if (isShipping) await addShippingAddress(formData).unwrap();
        else await addBillingAddress(formData).unwrap();
        pushToast('Address added successfully.', 'success');
      }
      closeModal();
    } catch (err) {
      console.error('Failed to save address:', err);
      const errMsg = err?.data?.message || err?.data?.error || 'Failed to save address.';
      pushToast(errMsg, 'error');
    }
  };

  const handleDelete = async (id) => {
    const shouldDelete = await confirm('Are you sure you want to delete this address?');
    if (shouldDelete) {
      try {
        if (isShipping) await deleteShippingAddress(id).unwrap();
        else await deleteBillingAddress(id).unwrap();
        pushToast('Address deleted successfully.', 'success');
      } catch (err) {
        console.error('Failed to delete address:', err);
        pushToast('Failed to delete address.', 'error');
      }
    }
  };

  const handleSetDefault = async (id) => {
    try {
      if (isShipping) await setDefaultShippingAddress(id).unwrap();
      else await setDefaultBillingAddress(id).unwrap();
      pushToast('Default address updated.', 'success');
    } catch (err) {
      pushToast('Failed to update default address.', 'error');
    }
  };

  return (
    <>
      <div className="address-book-page fade-in">
        <div className="address-book-header">
          <div>
            <h1 className="address-book-title">
              <MapPin size={28} className="text-primary" /> Saved Addresses
            </h1>
            <p className="address-book-subtitle">
              Manage your delivery and billing addresses for seamless checkout
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className="address-count-badge">{currentAddresses.length} / 5 Saved</span>
            <Button
              variant="primary"
              onClick={openAddModal}
              disabled={currentAddresses.length >= 5}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Plus size={18} /> Add New {isShipping ? 'Shipping' : 'Billing'} Address
            </Button>
          </div>
        </div>

        <div className="address-tabs" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
          <button
            className={`tab-btn ${activeTab === 'shipping' ? 'active' : ''}`}
            onClick={() => setActiveTab('shipping')}
            style={{ padding: '0.75rem 1.5rem', background: 'none', border: 'none', borderBottom: activeTab === 'shipping' ? '2px solid var(--primary)' : '2px solid transparent', color: activeTab === 'shipping' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: activeTab === 'shipping' ? '600' : '400', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}
          >
            <Truck size={18} /> Shipping Addresses
          </button>
          <button
            className={`tab-btn ${activeTab === 'billing' ? 'active' : ''}`}
            onClick={() => setActiveTab('billing')}
            style={{ padding: '0.75rem 1.5rem', background: 'none', border: 'none', borderBottom: activeTab === 'billing' ? '2px solid var(--primary)' : '2px solid transparent', color: activeTab === 'billing' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: activeTab === 'billing' ? '600' : '400', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}
          >
            <CreditCard size={18} /> Billing Addresses
          </button>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <p>Loading your addresses...</p>
          </div>
        ) : currentAddresses.length > 0 ? (
          <div className="address-grid">
            {currentAddresses.map((addr) => (
              <AddressCard
                key={addr.id}
                address={addr}
                onEdit={openEditModal}
                onDelete={handleDelete}
                onSetDefault={handleSetDefault}
              />
            ))}
          </div>
        ) : (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem', borderRadius: 'var(--radius-lg)' }}>
            <MapPin size={48} style={{ color: 'var(--text-muted)', opacity: 0.4, margin: '0 auto 1rem' }} />
            <h2 style={{ marginBottom: '0.5rem' }}>No saved {isShipping ? 'shipping' : 'billing'} addresses</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Add an address to enjoy quick and effortless checkouts.
            </p>
            <Button variant="primary" onClick={openAddModal}>
              <Plus size={18} style={{ marginRight: '6px' }} /> Add Your First {isShipping ? 'Shipping' : 'Billing'} Address
            </Button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <AddressForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          isSaving={isAddingShipping || isUpdatingShipping || isAddingBilling || isUpdatingBilling}
          type={isShipping ? 'Shipping' : 'Billing'}
        />
      )}
    </>
  );
};

export default AddressBook;
