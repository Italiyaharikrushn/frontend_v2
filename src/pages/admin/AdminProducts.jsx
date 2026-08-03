import React, { useState, useRef } from 'react';
import { Plus, Upload, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useGetProductsQuery, useDeleteProductMutation, useBulkUploadProductsMutation } from '../../api/productApi';
import AdminProductForm from '../../components/admin/AdminProductForm';
import { useToast } from '../../components/ui/ToastProvider';
import { useAlert } from '../../components/ui/AlertProvider';
import Pagination from '../../components/ui/Pagination';
import '@/styles/pages/admin/AdminStyles.css';

const AdminProducts = () => {
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
        await bulkUpload(file).unwrap();
        pushToast('Bulk upload successful!', 'success');
      } catch (err) {
        console.error('Bulk upload failed', err);
        pushToast(err.data?.message || 'Bulk upload failed.', 'error');
      }
    }
  };

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

        {isLoading ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading products...</p>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product Details</th>
                  <th>SKU</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? products.map((product, idx) => (
                  <tr key={product.id || idx}>
                    <td>
                      {product.images && product.images.length > 0 ? (
                        <img src={product.images[0]} alt="product" style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border)' }} />
                      ) : (
                        <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                          <ImageIcon size={20} />
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{product.title || 'Untitled'}</span>
                      </div>
                    </td>
                    <td>{product.sku || 'N/A'}</td>
                    <td style={{ fontWeight: '500' }}>₹{product.price}</td>
                    <td>{product.stock}</td>
                    <td>
                      <span className={`status-badge ${(product.isActive ?? product.active ?? true) ? 'status-active' : 'status-inactive'}`}>
                        {(product.isActive ?? product.active ?? true) ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="admin-table-actions">
                        <button onClick={() => handleOpenForm(product)} className="admin-icon-btn" title="Edit"><Edit size={16} /></button>
                        <button onClick={() => handleDelete(product.id)} className="admin-icon-btn admin-icon-btn-danger" title="Delete"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No products found in the database.</td>
                  </tr>
                )}
              </tbody>
            </table>
            
            <Pagination 
              currentPage={page} 
              totalPages={totalPages} 
              onPageChange={setPage} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
