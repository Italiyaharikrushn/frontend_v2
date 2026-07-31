import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import Button from '../ui/Button';
import { useCreateProductMutation, useUpdateProductMutation, useGetCategoriesQuery } from '../../api/productApi';
import { useToast } from '../ui/ToastProvider';
import '@/styles/css/pages/admin/AdminStyles.css';

const AdminProductForm = ({ editingProduct, onClose }) => {
  const { pushToast } = useToast();
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const { data: categories = [] } = useGetCategoriesQuery();

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

  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);

  useEffect(() => {
    if (editingProduct) {
      const editCategory = editingProduct.category || editingProduct.globalCategory || '';
      setFormData({
        name: editingProduct.title || '',
        description: editingProduct.description || '',
        sku: editingProduct.sku || '',
        image: (editingProduct.images && editingProduct.images.length > 0) ? editingProduct.images[0] : '',
        imagePreview: (editingProduct.images && editingProduct.images.length > 0) ? editingProduct.images[0] : '',
        category: editCategory,
        subCategory: editingProduct.subCategory || '',
        price: editingProduct.price || '',
        stock: editingProduct.stock || '',
        status: (editingProduct.isActive ?? editingProduct.active ?? true) ? 'Active' : 'Inactive'
      });
      if (editCategory && categories.length > 0 && !categories.includes(editCategory)) {
         // The category exists on the product but is not in the list of available categories
         // We'll just let the dropdown handle it by dynamically adding the current category to the options below
      }
    } else {
      setFormData({ name: '', description: '', sku: '', image: '', imagePreview: '', category: '', subCategory: '', price: '', stock: '', status: 'Active' });
      setIsAddingNewCategory(false);
    }
  }, [editingProduct, categories]);

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
    <div 
      onClick={onClose}
      className="admin-modal-backdrop"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="admin-modal-content admin-product-form-modal" 
        style={{ maxWidth: '800px' }}
      >
        <div className="admin-modal-header">
          <h2 style={{ color: 'var(--text-main)', margin: 0, fontSize: '1.4rem', fontWeight: '800' }}>
            {editingProduct ? 'Edit Product' : 'Create New Product'}
          </h2>
          <button onClick={onClose} className="admin-modal-close" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="admin-modal-body">
        <form onSubmit={handleSubmit} className="admin-form-grid">
          <div className="admin-form-field full">
            <label>Product Name (Title)</label>
            <input type="text" placeholder='Product Name (Title)' required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div className="admin-form-field full">
            <label>Description</label>
            <textarea rows="3" placeholder='Description' value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
          </div>
          <div className="admin-form-field">
            <label>SKU</label>
            <input type="text" placeholder='SKU' value={formData.sku} onChange={e => setFormData({ ...formData, sku: e.target.value })} />
          </div>
          <div className="admin-form-field">
            <label>Category</label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'stretch' }}>
              {!isAddingNewCategory ? (
                <select 
                  value={formData.category} 
                  onChange={e => {
                    if (e.target.value === '___NEW___') {
                      setIsAddingNewCategory(true);
                      setFormData({ ...formData, category: '' });
                    } else {
                      setFormData({ ...formData, category: e.target.value });
                    }
                  }}
                  style={{ flex: 1 }}
                >
                  <option value="">-- Select Category --</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  {editingProduct && formData.category && !categories.includes(formData.category) && (
                    <option value={formData.category}>{formData.category}</option>
                  )}
                  <option value="___NEW___">+ Add New Category</option>
                </select>
              ) : (
                <>
                  <input 
                    type="text" 
                    placeholder="Enter new category name" 
                    value={formData.category} 
                    onChange={e => setFormData({ ...formData, category: e.target.value })} 
                    style={{ flex: 1 }}
                    autoFocus
                  />
                  <Button type="button" variant="secondary" onClick={() => {
                    setIsAddingNewCategory(false);
                    setFormData({ ...formData, category: '' });
                  }} style={{ padding: '0 1rem' }}>
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="admin-form-field">
            <label>Image URL</label>
            <input type="text" placeholder="https://example.com/image.jpg" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value, imagePreview: e.target.value })} />
            {formData.imagePreview && <img src={formData.imagePreview} alt="Preview" style={{ width: '100px', height: '100px', marginTop: '0.5rem', objectFit: 'cover', borderRadius: '8px' }} />}
          </div>
          <div className="admin-form-field">
            <label>Price (₹)</label>
            <input type="number" placeholder='Price (₹)' step="0.01" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
          </div>
          <div className="admin-form-field">
            <label>Stock</label>
            <input type="number" placeholder='Stock' required value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} />
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
      </div>
    </div>
  );
};

export default AdminProductForm;
