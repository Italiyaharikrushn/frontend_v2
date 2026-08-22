import React from 'react';
import { Plus, Upload } from 'lucide-react';
import Button from '../../components/ui/Button';
import AdminProductForm from '../../components/admin/AdminProductForm';
import AdminProductTable from '../../components/admin/AdminProductTable';
import { useAdminProducts } from '../../hooks/useAdminProducts';
import '@/styles/pages/admin/AdminStyles.css';
import '@/styles/pages/admin/AdminProducts.css';

const AdminProducts = () => {
  const {
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
    handleUpdateStock
  } = useAdminProducts();

  return (
    <div className="admin-page fade-in admin-full-height-page">
      <div className="admin-header">
        <h1 className="admin-title">Products Management</h1>
        <div className="admin-actions">
          <Button variant="secondary" onClick={handleBulkUploadClick} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Upload size={18} /> Bulk Upload
          </Button>
          <Button onClick={() => handleOpenForm()} variant="primary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Plus size={18} /> Add Product
          </Button>
        </div>
      </div>

      {isFormOpen && (
        <AdminProductForm
          editingProduct={editingProduct}
          onClose={handleCloseForm}
        />
      )}

      <div className="glass-panel admin-panel-card admin-full-height-card">
        <h2 style={{ marginBottom: '1rem', color: 'var(--primary-dark)', flexShrink: 0 }}>Manage Listings</h2>

        <AdminProductTable
          products={products}
          isLoading={isLoading}
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          handleOpenForm={handleOpenForm}
          handleDelete={handleDelete}
          handleUpdateStock={handleUpdateStock}
        />
      </div>
    </div>
  );
};

export default AdminProducts;
