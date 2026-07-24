import React, { useState, useRef } from 'react';
import { Plus, Upload, Edit, Trash2, X, Save, Image as ImageIcon } from 'lucide-react';
import Button from '../../components/ui/Button';
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useBulkUploadProductsMutation
} from '../../api/productApi';
import './AdminStyles.css';

const AdminProducts = () => {
  const { data: products = [], isLoading } = useGetProductsQuery();
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sku: '',
    image: '',
    imagePreview: '',
    category: '', // Treat as global category for simple dummy backend mapping
    subCategory: '',
    price: '',
    stock: '',
    status: 'Active'
  });

  const handleOpenForm = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.title || '',
        description: product.description || '',
        sku: product.sku || '',
        image: (product.images && product.images.length > 0) ? product.images[0] : '',
        imagePreview: (product.images && product.images.length > 0) ? product.images[0] : '',
        category: product.category || product.globalCategory || '',
        subCategory: product.subCategory || '',
        price: product.price || '',
        stock: product.stock || '',
        status: (product.isActive ?? product.active ?? true) ? 'Active' : 'Inactive'
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', description: '', sku: '', image: '', imagePreview: '', category: '', subCategory: '', price: '', stock: '', status: 'Active' });
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.name, // Mapping name to title for backend ProductRequest
        description: formData.description,
        sku: formData.sku,
        images: formData.image ? [formData.image] : [],
        videos: [],
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
        isActive: formData.status === 'Active',
        category: formData.category
      };

      if (editingProduct) {
        await updateProduct({ id: editingProduct.id, data: payload }).unwrap();
        alert('Product updated successfully!');
      } else {
        await createProduct(payload).unwrap();
        alert('Product created successfully!');
      }
      handleCloseForm();
    } catch (err) {
      console.error('Failed to save product: ', err);
      alert('Error saving product. Check console.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id).unwrap();
        alert('Product deleted successfully!');
      } catch (err) {
        console.error('Failed to delete: ', err);
        alert('Failed to delete product.');
      }
    }
  };

  const fileInputRef = useRef(null);
  const [bulkUpload] = useBulkUploadProductsMutation();

  const handleBulkUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        await bulkUpload(file).unwrap();
        alert('Bulk upload successful!');
      } catch (err) {
        console.error('Bulk upload failed', err);
        alert('Bulk upload failed. Check console.');
      }
      e.target.value = null; // reset input
    }
  };

  return (
    <div className="admin-page fade-in">
      <div className="admin-header">
        <h1 className="admin-title">Products Management</h1>
        <div className="admin-actions">
          <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept=".xlsx, .xls, .csv" onChange={handleBulkUpload} />
          <Button variant="secondary" onClick={() => fileInputRef.current?.click()} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Upload size={18} /> Bulk Upload
          </Button>
          <Button onClick={() => handleOpenForm()} variant="primary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Plus size={18} /> Add Product
          </Button>
        </div>
      </div>

      {isFormOpen && (
        <div className="glass-panel fade-in admin-panel-card" style={{ marginBottom: '1rem', borderLeft: '4px solid var(--primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ color: 'var(--primary-dark)', margin: 0 }}>{editingProduct ? 'Edit Product' : 'Create New Product'}</h2>
            <button onClick={handleCloseForm} className="action-btn btn-ghost" style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
          </div>

          <form onSubmit={handleSubmit} className="admin-form-grid">
            <div className="admin-form-field full">
              <label>Product Name (Title)</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="admin-form-field full">
              <label>Description</label>
              <textarea rows="3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
            </div>
            <div className="admin-form-field">
              <label>SKU</label>
              <input type="text" value={formData.sku} onChange={e => setFormData({ ...formData, sku: e.target.value })} />
            </div>
            <div className="admin-form-field">
              <label>Category</label>
              <input type="text" placeholder="e.g. belts, purses" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
            </div>
            <div className="admin-form-field">
              <label>Image URL</label>
              <input type="text" placeholder="https://example.com/image.jpg" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value, imagePreview: e.target.value })} />
              {formData.imagePreview && <img src={formData.imagePreview} alt="Preview" style={{ width: '100px', height: '100px', marginTop: '0.5rem', objectFit: 'cover', borderRadius: '8px' }} />}
            </div>
            <div className="admin-form-field">
              <label>Price (₹)</label>
              <input type="number" step="0.01" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
            </div>
            <div className="admin-form-field">
              <label>Stock</label>
              <input type="number" required value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} />
            </div>
            <div className="admin-form-field full">
              <label>Status</label>
              <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="admin-form-actions full">
              <Button type="button" variant="secondary" onClick={handleCloseForm}>Cancel</Button>
              <Button type="submit" variant="primary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Save size={18} /> {editingProduct ? 'Update Product' : 'Save Product'}
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-panel admin-panel-card">
        <h2 style={{ marginBottom: '1rem', color: 'var(--primary-dark)' }}>Manage Listings</h2>

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
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {product.id} {product.category ? `• ${product.category}` : ''}</span>
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
                        <button onClick={() => handleOpenForm(product)} className="action-btn btn-ghost" style={{ padding: '0.25rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--primary)' }} title="Edit"><Edit size={16} /></button>
                        <button onClick={() => handleDelete(product.id)} className="action-btn btn-ghost" style={{ padding: '0.25rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--error)' }} title="Delete"><Trash2 size={16} /></button>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;

