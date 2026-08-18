import { useState, useRef } from 'react';
import { useGetProductsQuery, useDeleteProductMutation, useBulkUploadProductsMutation, useUpdateProductMutation } from '../api/productApi';
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
    const [updateProduct] = useUpdateProductMutation();

    const handleUpdateStock = async (product, newStock) => {
        const parsedStock = parseInt(newStock, 10);
        if (isNaN(parsedStock) || parsedStock === product.stock) return;

        try {
            const payload = {
                title: product.title,
                description: product.description,
                sku: product.sku,
                images: product.images || [],
                videos: product.videos || [],
                price: product.price,
                customNamePrice: product.customNamePrice,
                stock: parsedStock,
                isActive: product.isActive ?? product.active ?? true,
                category: product.category || product.globalCategory,
                subCategory: product.subCategory
            };
            await updateProduct({ id: product.id, data: payload }).unwrap();
            pushToast('Stock updated successfully!', 'success');
        } catch (err) {
            console.error('Failed to update stock: ', err);
            pushToast('Failed to update stock.', 'error');
        }
    };

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
        handleUpdateStock,
        fileInputRef
    };
};
