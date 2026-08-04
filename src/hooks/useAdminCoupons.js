import { useState } from 'react';
import { useGetCouponsQuery, useCreateCouponMutation, useUpdateCouponMutation, useDeleteCouponMutation } from '../api/orderApi';
import { useToast } from '../components/ui/ToastProvider';
import { useAlert } from '../components/ui/AlertProvider';

export const useAdminCoupons = () => {
    const { data: coupons = [], isLoading } = useGetCouponsQuery();
    const [createCoupon] = useCreateCouponMutation();
    const [updateCoupon] = useUpdateCouponMutation();
    const [deleteCoupon] = useDeleteCouponMutation();
    const { pushToast } = useToast();
    const { confirm } = useAlert();

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        discountType: 'PERCENTAGE',
        discountValue: 0,
        expiryDate: '',
        isActive: true
    });

    const resetForm = () => {
        setFormData({ code: '', discountType: 'PERCENTAGE', discountValue: 0, expiryDate: '', isActive: true });
        setIsEditing(false);
    };

    const handleEdit = (coupon) => {
        setFormData(coupon);
        setIsEditing(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing && formData.id) {
                const payload = {
                    ...formData,
                    expiryDate: formData.expiryDate.includes('T') ? formData.expiryDate : formData.expiryDate + 'T23:59:59'
                };
                await updateCoupon(payload).unwrap();
                pushToast('Coupon updated', 'success');
            } else {
                const payload = {
                    ...formData,
                    expiryDate: formData.expiryDate.includes('T') ? formData.expiryDate : formData.expiryDate + 'T23:59:59'
                };
                await createCoupon(payload).unwrap();
                pushToast('Coupon created', 'success');
            }
            resetForm();
        } catch (err) {
            const errorMsg = err?.data?.message || err?.data?.error || err?.error || 'Failed to save coupon';
            pushToast(errorMsg, 'error');
        }
    };

    const handleDelete = async (id) => {
        if (await confirm("Delete this coupon?")) {
            try {
                await deleteCoupon(id).unwrap();
                pushToast('Coupon deleted', 'success');
            } catch (err) {
                pushToast('Failed to delete', 'error');
            }
        }
    };

    return {
        coupons,
        isLoading,
        isEditing,
        setIsEditing,
        formData,
        setFormData,
        resetForm,
        handleEdit,
        handleSubmit,
        handleDelete
    };
};
