import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useCreateDailyCostMutation, useUpdateDailyCostMutation } from '../../../api/costManagementApi';
import { toast } from 'react-toastify';

const DailyPurchaseModal = ({ entry, onClose }) => {
    const [createEntry] = useCreateDailyCostMutation();
    const [updateEntry] = useUpdateDailyCostMutation();

    const [formData, setFormData] = useState({
        costDate: new Date().toISOString().split('T')[0],
        productName: '',
        pricePerKg: '',
        pricePerSingleUnit: '',
        pricePerPair: '',
        unit: 'Kg',
        quantity: '',
        category: '',
        costType: ''
    });

    useEffect(() => {
        if (entry) {
            setFormData({
                costDate: entry.costDate || new Date().toISOString().split('T')[0],
                productName: entry.productName || '',
                pricePerKg: entry.pricePerKg || '',
                pricePerSingleUnit: entry.pricePerSingleUnit || '',
                pricePerPair: entry.pricePerPair || '',
                unit: entry.unit || 'Kg',
                quantity: entry.quantity || '',
                category: entry.category || '',
                costType: entry.costType || ''
            });
        }
    }, [entry]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Calculate total cost dynamically
    const calculateTotal = () => {
        const qty = parseFloat(formData.quantity);
        if (isNaN(qty) || qty <= 0) return 0.00;

        let price = 0;
        if (formData.unit === 'Kg') price = parseFloat(formData.pricePerKg);
        if (formData.unit === 'Single Unit') price = parseInt(formData.pricePerSingleUnit, 10);
        if (formData.unit === 'Pair') price = parseInt(formData.pricePerPair, 10);

        if (isNaN(price) || price <= 0) return 0.00;
        
        return (price * qty).toFixed(2);
    };

    const calculatedTotal = calculateTotal();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.costDate || !formData.productName || !formData.unit || !formData.quantity) {
            toast.error("Please fill all required fields");
            return;
        }

        if (formData.quantity <= 0) {
            toast.error("Quantity must be greater than 0");
            return;
        }

        if (calculatedTotal <= 0) {
            toast.error(`Please enter a valid price for the selected unit (${formData.unit})`);
            return;
        }

        const payload = {
            ...formData,
            quantity: parseFloat(formData.quantity),
            pricePerKg: formData.pricePerKg ? parseFloat(formData.pricePerKg) : null,
            pricePerSingleUnit: formData.pricePerSingleUnit ? parseInt(formData.pricePerSingleUnit, 10) : null,
            pricePerPair: formData.pricePerPair ? parseInt(formData.pricePerPair, 10) : null,
            totalCost: parseFloat(calculatedTotal)
        };

        try {
            if (entry) {
                await updateEntry({ id: entry.id, data: payload }).unwrap();
                toast.success("Daily Purchase updated successfully");
            } else {
                await createEntry(payload).unwrap();
                toast.success("Daily Purchase recorded successfully");
            }
            onClose();
        } catch (error) {
            toast.error(error?.data?.message || "An error occurred");
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="cost-modal-overlay" onClick={handleOverlayClick}>
            <div className="cost-modal-content" style={{ maxWidth: '600px' }}>
                <div className="cost-modal-header">
                    <h3>{entry ? 'Edit Daily Purchase' : 'Add Daily Purchase'}</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div className="cost-form-group" style={{ flex: 1 }}>
                            <label>Date *</label>
                            <input type="date" name="costDate" value={formData.costDate} onChange={handleChange} required className="cost-form-input" />
                        </div>
                        <div className="cost-form-group" style={{ flex: 2 }}>
                            <label>Product Name *</label>
                            <input type="text" name="productName" value={formData.productName} onChange={handleChange} required className="cost-form-input" placeholder="e.g. Rice, Gloves" />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div className="cost-form-group" style={{ flex: 1 }}>
                            <label>Category</label>
                            <input type="text" name="category" value={formData.category} onChange={handleChange} className="cost-form-input" placeholder="e.g. Raw Material, Packaging" />
                        </div>
                        <div className="cost-form-group" style={{ flex: 1 }}>
                            <label>Cost Type</label>
                            <input type="text" name="costType" value={formData.costType} onChange={handleChange} className="cost-form-input" placeholder="e.g. Material, Labour" />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', background: 'var(--surface-alt)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                        <div className="cost-form-group" style={{ flex: 1, margin: 0 }}>
                            <label>Price per Kg</label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '10px', top: '9px', color: 'var(--text-muted)' }}>₹</span>
                                <input type="number" name="pricePerKg" value={formData.pricePerKg} onChange={handleChange} min="0" step="0.01" className="cost-form-input" style={{ paddingLeft: '25px' }} />
                            </div>
                        </div>
                        <div className="cost-form-group" style={{ flex: 1, margin: 0 }}>
                            <label>Price per Unit</label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '10px', top: '9px', color: 'var(--text-muted)' }}>₹</span>
                                <input type="number" name="pricePerSingleUnit" value={formData.pricePerSingleUnit} onChange={handleChange} onKeyDown={(e) => { if (e.key === '.' || e.key === 'e') e.preventDefault(); }} min="0" step="1" className="cost-form-input" style={{ paddingLeft: '25px' }} />
                            </div>
                        </div>
                        <div className="cost-form-group" style={{ flex: 1, margin: 0 }}>
                            <label>Price per Pair</label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '10px', top: '9px', color: 'var(--text-muted)' }}>₹</span>
                                <input type="number" name="pricePerPair" value={formData.pricePerPair} onChange={handleChange} onKeyDown={(e) => { if (e.key === '.' || e.key === 'e') e.preventDefault(); }} min="0" step="1" className="cost-form-input" style={{ paddingLeft: '25px' }} />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div className="cost-form-group" style={{ flex: 1 }}>
                            <label>Unit *</label>
                            <select name="unit" value={formData.unit} onChange={handleChange} required className="cost-form-select">
                                <option value="Kg">Kg</option>
                                <option value="Single Unit">Single Unit</option>
                                <option value="Pair">Pair</option>
                            </select>
                        </div>
                        <div className="cost-form-group" style={{ flex: 1 }}>
                            <label>Quantity Purchased *</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} min="0.01" step="0.01" required className="cost-form-input" style={{ flexGrow: 1 }} />
                                <span style={{ minWidth: '80px', color: 'var(--text-muted)', fontWeight: 500 }}>{formData.unit}</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ background: 'var(--surface-alt)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Total Cost (Auto-calculated):</span>
                        <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>₹{calculatedTotal}</span>
                    </div>

                    <div className="cost-form-actions">
                        <button type="button" onClick={onClose} className="cost-btn-cancel">Cancel</button>
                        <button type="submit" className="cost-btn-submit">{entry ? 'Save Changes' : 'Record Purchase'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DailyPurchaseModal;
