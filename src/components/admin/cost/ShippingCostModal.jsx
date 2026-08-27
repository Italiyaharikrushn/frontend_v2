import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useCreateShippingCostMutation, useUpdateShippingCostMutation } from '../../../api/costManagementApi';
import { toast } from 'react-toastify';
import { getCurrentDate, formatToISODate } from '../../../utils/dateUtils';

const ShippingCostModal = ({ cost, onClose }) => {
    const isEdit = !!cost;
    const today = formatToISODate(getCurrentDate());

    const [formData, setFormData] = useState({
        costDate: today,
        description: '',
        amount: ''
    });

    const [createCost, { isLoading: isCreating }] = useCreateShippingCostMutation();
    const [updateCost, { isLoading: isUpdating }] = useUpdateShippingCostMutation();

    useEffect(() => {
        if (cost) {
            setFormData({
                costDate: cost.costDate,
                description: cost.description || '',
                amount: cost.amount || ''
            });
        }
    }, [cost]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.costDate || !formData.description || !formData.amount) {
            toast.error("Please fill in all required fields.");
            return;
        }

        const payload = {
            ...formData,
            amount: parseFloat(formData.amount)
        };

        try {
            if (isEdit) {
                await updateCost({ id: cost.id, data: payload }).unwrap();
                toast.success("Shipping cost updated successfully");
            } else {
                await createCost(payload).unwrap();
                toast.success("Shipping cost created successfully");
            }
            onClose();
        } catch (error) {
            console.error(error);
            toast.error(error?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} shipping cost`);
        }
    };

    return (
        <div className="cost-modal-overlay">
            <div className="cost-modal-content" style={{ maxWidth: '500px' }}>
                <div className="cost-modal-header">
                    <h2>{isEdit ? 'Edit Shipping Cost' : 'Add Shipping Cost'}</h2>
                    <button onClick={onClose} className="cost-btn-cancel" style={{ background: 'none', border: 'none', padding: 0 }}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="cost-form-group">
                        <label>Date <span className="text-error">*</span></label>
                        <input
                            type="date"
                            name="costDate"
                            value={formData.costDate}
                            onChange={handleChange}
                            className="cost-form-input"
                            required
                        />
                    </div>

                    <div className="cost-form-group">
                        <label>Description / Courier <span className="text-error">*</span></label>
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="e.g. FedEx Shipping to customer"
                            className="cost-form-input"
                            required
                        />
                    </div>

                    <div className="cost-form-group">
                        <label>Total Amount (₹) <span className="text-error">*</span></label>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            className="cost-form-input"
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>

                    <div className="cost-form-actions">
                        <button type="button" onClick={onClose} className="cost-btn-cancel">
                            Cancel
                        </button>
                        <button type="submit" className="cost-btn-submit" disabled={isCreating || isUpdating}>
                            {isCreating || isUpdating ? 'Saving...' : 'Save Shipping Cost'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ShippingCostModal;
