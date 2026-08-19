import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Save } from 'lucide-react';
import Button from '../ui/Button';
import { useCreateProductMutation, useUpdateProductMutation, useGetCategoriesQuery, useDecodeUrlMutation } from '../../api/productApi';
import { useToast } from '../ui/ToastProvider';
import '@/styles/pages/admin/AdminStyles.css';

const AdminProductForm = ({ editingProduct, onClose }) => {
  const { pushToast } = useToast();
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const { data: categories = [] } = useGetCategoriesQuery();
  const [decodeUrl, { isLoading: isDecoding }] = useDecodeUrlMutation();
  const lastDecodedUrl = useRef('');
  const lastDecodedVideoUrl = useRef('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sku: '',
    images: [],
    video: '',
    videoPreview: '',
    category: '',
    subCategory: '',
    price: '',
    customNamePrice: '',
    stock: '',
    status: 'Active'
  });

  const [videoError, setVideoError] = useState('');
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [draftImage, setDraftImage] = useState('');
  const [draftImagePreview, setDraftImagePreview] = useState('');

  useEffect(() => {
    if (editingProduct) {
      const editCategory = editingProduct.category || editingProduct.globalCategory || '';
      setFormData({
        name: editingProduct.title || '',
        description: editingProduct.description || '',
        sku: editingProduct.sku || '',
        images: editingProduct.images || [],
        video: (editingProduct.videos && editingProduct.videos.length > 0) ? editingProduct.videos[0] : '',
        videoPreview: (editingProduct.videos && editingProduct.videos.length > 0) ? editingProduct.videos[0] : '',
        category: editCategory,
        subCategory: editingProduct.subCategory || '',
        price: editingProduct.price || '',
        customNamePrice: editingProduct.customNamePrice || '',
        stock: editingProduct.stock || '',
        status: (editingProduct.isActive ?? editingProduct.active ?? true) ? 'Active' : 'Inactive'
      });
      if (editCategory && categories.length > 0 && !categories.includes(editCategory)) {
        // The category exists on the product but is not in the list of available categories
        // We'll just let the dropdown handle it by dynamically adding the current category to the options below
      }
    } else {
      setFormData({ name: '', description: '', sku: '', images: [], video: '', videoPreview: '', category: '', subCategory: '', price: '', customNamePrice: '', stock: '', status: 'Active' });
      setIsAddingNewCategory(false);
      setVideoError('');
      setDraftImage('');
      setDraftImagePreview('');
      lastDecodedUrl.current = '';
      lastDecodedVideoUrl.current = '';
    }
  }, [editingProduct, categories]);

  useEffect(() => {
    const handler = setTimeout(async () => {
      const currentUrl = draftImage ? draftImage.trim() : '';
      if (!currentUrl || currentUrl === lastDecodedUrl.current) return;
      if (!currentUrl.startsWith('http')) return;

      try {
        const res = await decodeUrl(currentUrl).unwrap();
        if (res.image) {
          const finalUrl = res.image;
          lastDecodedUrl.current = currentUrl;
          setDraftImagePreview(finalUrl);
        } else if (res.original) {
          lastDecodedUrl.current = currentUrl;
          setDraftImagePreview(res.original);
        } else {
          lastDecodedUrl.current = currentUrl;
          setDraftImagePreview(currentUrl);
        }
      } catch (e) {
        lastDecodedUrl.current = currentUrl;
        setDraftImagePreview(currentUrl);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [draftImage, decodeUrl]);

  const handleAddImageToGallery = () => {
    const finalImageUrl = (draftImagePreview || draftImage || '').trim();
    if (finalImageUrl) {
      setFormData(prev => ({ ...prev, images: [...prev.images, finalImageUrl] }));
      setDraftImage('');
      setDraftImagePreview('');
      lastDecodedUrl.current = '';
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== indexToRemove) }));
  };

  useEffect(() => {
    const handler = setTimeout(async () => {
      const currentUrl = formData.video ? formData.video.trim() : '';
      if (!currentUrl) {
        setVideoError('');
        return;
      }
      if (currentUrl === lastDecodedVideoUrl.current) return;
      if (!currentUrl.startsWith('http')) return;

      setVideoError('');
      try {
        const res = await decodeUrl(currentUrl).unwrap();
        if (res.video) {
          const finalUrl = res.video;
          lastDecodedVideoUrl.current = currentUrl;
          setFormData(prev => ({ ...prev, video: currentUrl, videoPreview: finalUrl }));
        } else if (res.original) {
          lastDecodedVideoUrl.current = currentUrl;
          setFormData(prev => ({ ...prev, videoPreview: res.original }));
        } else {
          lastDecodedVideoUrl.current = currentUrl;
          setFormData(prev => ({ ...prev, videoPreview: currentUrl }));
        }
      } catch (e) {
        lastDecodedVideoUrl.current = currentUrl;
        setFormData(prev => ({ ...prev, videoPreview: currentUrl }));
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [formData.video, decodeUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.name,
        description: formData.description,
        sku: formData.sku,
        images: [...formData.images, ...(draftImagePreview ? [draftImagePreview] : (!isDecoding && draftImage ? [draftImage] : []))],
        videos: formData.video ? [formData.video] : [],
        price: parseFloat(formData.price),
        customNamePrice: formData.customNamePrice ? parseFloat(formData.customNamePrice) : null,
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
      if (err?.status === 401) {
        pushToast('Session expired or unauthorized. Please log in again as Admin.', 'error');
      } else if (err?.data?.message) {
        pushToast(err.data.message, 'error');
      } else {
        pushToast('Error saving product. Check console.', 'error');
      }
    }
  };

  return createPortal(
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
            <div className="admin-form-field full">
              <label>Product Images</label>

              {/* Gallery Grid */}
              {formData.images.length > 0 && (
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem', padding: '1rem', background: 'var(--surface-alt)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  {formData.images.map((imgUrl, index) => (
                    <div key={index} style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--surface)' }}>
                      <img
                        src={imgUrl}
                        alt={`Product ${index + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23999" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>'; }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        aria-label="Remove image"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Image Input */}
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'stretch' }}>
                <input type="text" placeholder="https://example.com/image.jpg or Google Photos/Drive link" value={draftImage} onChange={e => { setDraftImage(e.target.value); setDraftImagePreview(e.target.value); }} style={{ flex: 1 }} />
                <Button type="button" variant="primary" onClick={handleAddImageToGallery} disabled={!draftImage && !draftImagePreview} style={{ padding: '0 1rem', whiteSpace: 'nowrap' }}>
                  Add
                </Button>
              </div>
              {isDecoding && draftImage !== lastDecodedUrl.current && <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'block' }}>Loading preview...</span>}
              {draftImagePreview && !isDecoding && (
                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <img
                    src={draftImagePreview}
                    alt="Draft Preview"
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border)' }}
                    onError={(e) => { e.target.style.opacity = '0.5'; }}
                  />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Preview loaded. Click "Add" to add to gallery.</span>
                </div>
              )}
            </div>
            <div className="admin-form-field full">
              <label>Video URL</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'stretch' }}>
                <input type="text" placeholder="https://example.com/video.mp4 or Google Photos link" value={formData.video} onChange={e => setFormData({ ...formData, video: e.target.value, videoPreview: e.target.value })} style={{ flex: 1 }} />
              </div>
              {isDecoding && formData.video !== lastDecodedVideoUrl.current && <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'block' }}>Loading preview...</span>}
              {videoError && <span style={{ fontSize: '0.85rem', color: 'var(--error)', marginTop: '0.2rem', display: 'block', fontWeight: '500' }}>{videoError}</span>}
              {formData.videoPreview && !isDecoding && (
                <div style={{ marginTop: '0.5rem' }}>
                  <video src={formData.videoPreview} controls style={{ width: '200px', height: '150px', objectFit: 'cover', borderRadius: '8px' }} />
                </div>
              )}
            </div>
            <div className="admin-form-field">
              <label>Price (₹)</label>
              <input type="number" placeholder='Price (₹)' step="0.01" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
            </div>
            {formData.category && formData.category.toLowerCase().includes('cover') && (
              <div className="admin-form-field">
                <label>Custom Name Price (₹)</label>
                <input type="number" placeholder='Price with Name (₹)' step="0.01" value={formData.customNamePrice} onChange={e => setFormData({ ...formData, customNamePrice: e.target.value })} />
              </div>
            )}
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
    </div>,
    document.body
  );
};

export default AdminProductForm;
