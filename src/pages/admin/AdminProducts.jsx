import React from 'react';
import { Plus, Upload, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import Button from '../../components/ui/Button';
import AdminProductForm from '../../components/admin/AdminProductForm';
import Pagination from '../../components/ui/Pagination';
import { useAdminProducts } from '../../hooks/useAdminProducts';
import '@/styles/pages/admin/AdminStyles.css';
import '@/styles/pages/admin/AdminProducts.css';

const AdminProducts = () => {
  const { products, totalPages, page, setPage, isLoading, isFormOpen, editingProduct, handleOpenForm, handleCloseForm, handleDelete, handleBulkUploadClick } = useAdminProducts();

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
                        <img src={product.images[0]} alt="product" className="admin-products-img" />
                      ) : (
                        <div className="admin-products-img-placeholder">
                          <ImageIcon size={20} />
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="admin-products-td-title">
                        <span className="admin-products-title">{product.title || 'Untitled'}</span>
                      </div>
                    </td>
                    <td>{product.sku || 'N/A'}</td>
                    <td className="admin-products-price">₹{product.price}</td>
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
                    <td colSpan="7" className="admin-products-empty">No products found in the database.</td>
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
