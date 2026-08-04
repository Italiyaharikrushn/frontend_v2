import React from 'react';
import { useAdminCoupons } from '../../hooks/useAdminCoupons';
import Button from '../../components/ui/Button';
import { Ticket, PlusCircle, Edit, Trash2, CheckCircle, XCircle, X } from 'lucide-react';

const AdminCoupons = () => {
    const { coupons, isLoading, isEditing, setIsEditing, formData, setFormData, resetForm, handleEdit, handleSubmit, handleDelete } = useAdminCoupons();
    if (isLoading) return <div className="admin-page"><div className="loading-state">Loading coupons...</div></div>;

    return (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
            <div className="admin-header" style={{ marginBottom: 0, paddingBottom: 0, borderBottom: 'none' }}>
                <div style={{ flex: 1 }}></div>
                {!isEditing && (
                    <div className="admin-actions">
                        <Button variant="primary" onClick={() => setIsEditing(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <PlusCircle size={18} /> New Coupon
                        </Button>
                    </div>
                )}
            </div>

            <div className="admin-full-height-card glass-panel" style={{ padding: '0' }}>
                <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)' }}>
                    <h2 className="form-card-title" style={{ margin: 0, padding: 0, border: 'none' }}>Existing Coupons</h2>
                </div>
                <div className="admin-table-container" style={{ margin: 0 }}>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Details</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {coupons.map(coupon => (
                                <tr key={coupon.id}>
                                    <td style={{ fontWeight: '600' }}>{coupon.code}</td>
                                    <td>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span>{coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}% off` : `₹${coupon.discountValue} off`}</span>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                Exp: {new Date(coupon.expiryDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${coupon.isActive ? 'status-active' : 'status-inactive'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                            {coupon.isActive ? <><CheckCircle size={14} /> Active</> : <><XCircle size={14} /> Inactive</>}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="admin-table-actions">
                                            <button className="admin-icon-btn" onClick={() => handleEdit(coupon)} aria-label="Edit" title="Edit">
                                                <Edit size={16} />
                                            </button>
                                            <button className="admin-icon-btn admin-icon-btn-danger" onClick={() => handleDelete(coupon.id)} aria-label="Delete" title="Delete">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {coupons.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem' }}>
                                        <Ticket size={44} style={{ margin: '0 auto 1rem', color: 'var(--text-muted)', opacity: 0.4 }} />
                                        <p style={{ color: 'var(--text-muted)' }}>No coupons found. Create one to get started!</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isEditing && (
                <div className="admin-modal-backdrop" onClick={resetForm}>
                    <div className="admin-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2 className="form-card-title" style={{ margin: 0, padding: 0, border: 'none' }}>
                                {formData.id ? 'Edit Coupon' : 'Create New Coupon'}
                            </h2>
                            <button className="admin-modal-close" onClick={resetForm}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="admin-modal-body">
                            <form onSubmit={handleSubmit}>
                                <div className="admin-form-grid">
                                    <div className="admin-form-field full">
                                        <label>Coupon Code</label>
                                        <input required type="text" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })} placeholder="e.g. SUMMER20" />
                                    </div>
                                    <div className="admin-form-field">
                                        <label>Discount Type</label>
                                        <select value={formData.discountType} onChange={e => setFormData({ ...formData, discountType: e.target.value })}>
                                            <option value="PERCENTAGE">Percentage (%)</option>
                                            <option value="FIXED_AMOUNT">Fixed Amount (₹)</option>
                                        </select>
                                    </div>
                                    <div className="admin-form-field">
                                        <label>Discount Value</label>
                                        <input required type="number" min="0" step="0.01" value={formData.discountValue} onChange={e => setFormData({ ...formData, discountValue: e.target.value })} />
                                    </div>
                                    <div className="admin-form-field">
                                        <label>Expiry Date</label>
                                        <input required type="date" value={formData.expiryDate ? formData.expiryDate.split('T')[0] : ''} onChange={e => setFormData({ ...formData, expiryDate: e.target.value })} />
                                    </div>
                                    <div className="admin-form-field full" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem', padding: '1rem', background: 'rgba(0,0,0,0.02)', borderRadius: 'var(--radius-md)' }}>
                                        <input type="checkbox" id="isActive" checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} style={{ width: 'auto', minHeight: 'auto', transform: 'scale(1.2)' }} />
                                        <label htmlFor="isActive" style={{ cursor: 'pointer', margin: 0, fontWeight: 'bold' }}>Coupon is Active</label>
                                    </div>
                                </div>
                                <div className="admin-form-actions" style={{ marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                                    <Button type="button" variant="secondary" onClick={resetForm}>Cancel</Button>
                                    <Button type="submit" variant="primary">{formData.id ? 'Save Changes' : 'Create Coupon'}</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default AdminCoupons;
