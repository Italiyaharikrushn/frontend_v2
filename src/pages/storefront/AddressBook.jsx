import React, { useState } from 'react';
import { MapPin, Plus, Edit2, Trash2, X, Phone, Home, CheckCircle2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import PhoneInput from '../../components/ui/PhoneInput';
import { useGetUserAddressesQuery, useAddAddressMutation, useUpdateAddressMutation, useDeleteAddressMutation } from '../../api/orderApi';
import { useToast } from '../../components/ui/ToastProvider';
import { useAlert } from '../../components/ui/AlertProvider';
import '@/styles/pages/storefront/AddressBook.css';

const initialFormState = {
  id: null,
  fullName: '',
  streetAddress: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'India',
  phoneNumber: '',
};

const AddressBook = () => {
  const { data: addresses = [], isLoading } = useGetUserAddressesQuery();
  const [addAddress, { isLoading: isAdding }] = useAddAddressMutation();
  const [updateAddress, { isLoading: isUpdating }] = useUpdateAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();

  const { pushToast } = useToast();
  const { confirm } = useAlert();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormState);

  const openAddModal = () => {
    if (addresses.length >= 5) {
      pushToast('You have reached the maximum limit of 5 saved addresses.', 'warning');
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
        await updateAddress(formData).unwrap();
        pushToast('Address updated successfully.', 'success');
      } else {
        await addAddress(formData).unwrap();
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
        await deleteAddress(id).unwrap();
        pushToast('Address deleted successfully.', 'success');
      } catch (err) {
        console.error('Failed to delete address:', err);
        pushToast('Failed to delete address.', 'error');
      }
    }
  };

  return (
    <div className="address-book-page fade-in">
      <div className="address-book-header">
        <div>
          <h1 className="address-book-title">
            <MapPin size={28} className="text-primary" /> Saved Addresses
          </h1>
          <p className="address-book-subtitle">
            Manage your delivery addresses for seamless checkout
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span className="address-count-badge">{addresses.length} / 5 Saved</span>
          <Button
            variant="primary"
            onClick={openAddModal}
            disabled={addresses.length >= 5}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Plus size={18} /> Add New Address
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <p>Loading your addresses...</p>
        </div>
      ) : addresses.length > 0 ? (
        <div className="address-grid">
          {addresses.map((addr) => (
            <div key={addr.id} className="address-card glass-panel hover-lift">
              <div>
                <div className="address-card-header">
                  <div className="address-card-name">{addr.fullName}</div>
                  <span style={{ color: 'var(--primary)', opacity: 0.7 }}><Home size={20} /></span>
                </div>
                <div className="address-card-body">
                  <p style={{ margin: 0 }}>{addr.streetAddress}</p>
                  <p style={{ margin: '0.2rem 0' }}>{addr.city}, {addr.state} - {addr.postalCode}</p>
                  <p style={{ margin: 0, fontWeight: '500' }}>{addr.country}</p>
                  <div className="address-card-phone">
                    <Phone size={15} style={{ color: 'var(--text-muted)' }} />
                    <span>{addr.phoneNumber}</span>
                  </div>
                </div>
              </div>

              <div className="address-card-actions">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditModal(addr)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Edit2 size={14} /> Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(addr.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Trash2 size={14} /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem', borderRadius: 'var(--radius-lg)' }}>
          <MapPin size={48} style={{ color: 'var(--text-muted)', opacity: 0.4, margin: '0 auto 1rem' }} />
          <h2 style={{ marginBottom: '0.5rem' }}>No saved addresses yet</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Add an address to enjoy quick and effortless checkouts.
          </p>
          <Button variant="primary" onClick={openAddModal}>
            <Plus size={18} style={{ marginRight: '6px' }} /> Add Your First Address
          </Button>
        </div>
      )}

      {/* Add / Edit Address Modal */}
      {isModalOpen && (
        <div className="address-modal-backdrop" onClick={closeModal}>
          <div className="address-modal-content fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="address-modal-header">
              <h2 className="address-modal-title">
                <MapPin size={20} className="text-primary" />
                {formData.id ? 'Edit Address' : 'Add New Address'}
              </h2>
              <button className="address-modal-close" onClick={closeModal} aria-label="Close">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="address-modal-body">
              <div className="address-form-grid">
                <div className="input-group full-width">
                  <label htmlFor="fullName">Full Name *</label>
                  <input
                    type="text"
                    id="fullName"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Recipient's full name"
                  />
                </div>

                <div className="input-group full-width">
                  <label htmlFor="phoneNumber">Phone Number *</label>
                  <PhoneInput
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(val) => setFormData({ ...formData, phoneNumber: val })}
                    required
                  />
                </div>

                <div className="input-group full-width">
                  <label htmlFor="streetAddress">Street Address / House No. *</label>
                  <input
                    type="text"
                    id="streetAddress"
                    required
                    value={formData.streetAddress}
                    onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                    placeholder="e.g. 124 Park View Lane, Apt 4B"
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="city">City *</label>
                  <input
                    type="text"
                    id="city"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="City"
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="state">State / Province *</label>
                  <input
                    type="text"
                    id="state"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="State"
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="postalCode">Postal / ZIP Code *</label>
                  <input
                    type="text"
                    id="postalCode"
                    required
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    placeholder="Postal Code"
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="country">Country *</label>
                  <select
                    id="country"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  >
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                <Button type="button" variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={isAdding || isUpdating}>
                  {isAdding || isUpdating ? 'Saving...' : formData.id ? 'Save Changes' : 'Save Address'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressBook;
