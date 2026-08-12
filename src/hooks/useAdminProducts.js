import { useState, useRef } from 'react';
import { useGetProductsQuery, useDeleteProductMutation, useBulkUploadProductsMutation } from '../api/productApi';
import { useToast } from '../components/ui/ToastProvider';
import { useAlert } from '../components/ui/AlertProvider';

export const useAdminProducts = () => {
    const { pushToast } = useToast();
    const { confirm, bulkUploadPrompt } = useAlert();
    const [page, setPage] = useState(0);
    const size = 10;
    
    const { data = {}, isLoading } = useGetProductsQuery({ page, size });
    const products = data.content || [];
    const totalPages = data.totalPages || 0;

    const [deleteProduct] = useDeleteProductMutation();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const handleOpenForm = (product = null) => {
        setEditingProduct(product);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingProduct(null);
    };

    const handleDelete = async (id) => {
        if (await confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(id).unwrap();
                pushToast('Product deleted successfully!', 'success');
            } catch (err) {
                console.error('Failed to delete: ', err);
                pushToast('Failed to delete product.', 'error');
            }
        }
    };

    const fileInputRef = useRef(null);
    const [bulkUpload] = useBulkUploadProductsMutation();

    const handleBulkUploadClick = async () => {
        const file = await bulkUploadPrompt('Upload your product CSV/Excel file.');
        if (file) {
            try {
                const res = await bulkUpload(file).unwrap();
                pushToast(res?.message || 'The file was successfully uploaded.', 'success');
            } catch (err) {
                console.error('Bulk upload failed', err);
                pushToast(err.data?.message || 'Bulk upload failed.', 'error');
            }
        }
    };

    return {
        products,
        totalPages,
        page,
        setPage,
        isLoading,
        isFormOpen,
        editingProduct,
        handleOpenForm,
        handleCloseForm,
        handleDelete,
        handleBulkUploadClick,
        fileInputRef
    };
};
