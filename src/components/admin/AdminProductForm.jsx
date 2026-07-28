import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import Button from '../ui/Button';
import { useCreateProductMutation, useUpdateProductMutation } from '../../api/productApi';
import { useToast } from '../ui/ToastProvider';
import '@/styles/css/pages/admin/AdminStyles.css';

const AdminProductForm = ({ editingProduct, onClose }) => {
  const { pushToast } = useToast();
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sku: '',
    image: '',
    imagePreview: '',
    category: '',
    subCategory: '',
    price: '',
    stock: '',
    status: 'Active'
  });

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.title || '',
        description: editingProduct.description || '',
        sku: editingProduct.sku || '',
        image: (editingProduct.images && editingProduct.images.length > 0) ? editingProduct.images[0] : '',
        imagePreview: (editingProduct.images && editingProduct.images.length > 0) ? editingProduct.images[0] : '',
        category: editingProduct.category || editingProduct.globalCategory || '',
        subCategory: editingProduct.subCategory || '',
        price: editingProduct.price || '',
        stock: editingProduct.stock || '',
        status: (editingProduct.isActive ?? editingProduct.active ?? true) ? 'Active' : 'Inactive'
      });
    } else {
      setFormData({ name: '', description: '', sku: '', image: '', imagePreview: '', category: '', subCategory: '', price: '', stock: '', status: 'Active' });
    }
  }, [editingProduct]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.name,
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
        pushToast('Product updated successfully!', 'success');
      } else {
        await createProduct(payload).unwrap();
        pushToast('Product created successfully!', 'success');
      }
      onClose();
    } catch (err) {
      console.error('Failed to save product: ', err);
      pushToast('Error saving product. Check console.', 'error');
    }
  };

  return (
    <div className="glass-panel fade-in admin-panel-card" style={{ marginBottom: '1rem', borderLeft: '4px solid var(--primary)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ color: 'var(--primary-dark)', margin: 0 }}>{editingProduct ? 'Edit Product' : 'Create New Product'}</h2>
        <button onClick={onClose} className="action-btn btn-ghost" style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
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
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Save size={18} /> {editingProduct ? 'Update Product' : 'Save Product'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;
