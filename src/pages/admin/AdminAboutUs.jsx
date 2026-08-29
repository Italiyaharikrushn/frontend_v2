import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Edit, Trash2, Loader, Image as ImageIcon } from 'lucide-react';
import { useGetAllWorksQuery, useCreateWorkMutation, useUpdateWorkMutation, useDeleteWorkMutation } from '../../api/aboutUsApi';
import Button from '../../components/common/Button';

import '@/styles/pages/admin/AdminStyles.css';
import '@/styles/pages/admin/AdminAboutUs.css';

const AdminAboutUs = () => {
  const { data: works = [], isLoading, refetch } = useGetAllWorksQuery();
  const [createWork, { isLoading: isCreating }] = useCreateWorkMutation();
  const [updateWork, { isLoading: isUpdating }] = useUpdateWorkMutation();
  const [deleteWork, { isLoading: isDeleting }] = useDeleteWorkMutation();

  const isSaving = isCreating || isUpdating;

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: null, title: '', content: '', imageUrl: '', type: 'PAST' });
  const [imageFile, setImageFile] = useState(null);

  const handleOpenModal = (work = null) => {
    if (work) {
      setFormData({ ...work });
    } else {
      setFormData({ id: null, title: '', content: '', imageUrl: '', type: 'PAST' });
    }
    setImageFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this?')) return;
    try {
      await deleteWork(id).unwrap();
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      let finalImageUrl = formData.imageUrl;
      
      if (formData.id) {
        await updateWork({ ...formData, imageUrl: finalImageUrl }).unwrap();
      } else {
        await createWork({ ...formData, imageUrl: finalImageUrl }).unwrap();
      }
      setShowModal(false);
    } catch (err) {
      console.error('Failed to save:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="admin-page flex-center" style={{ minHeight: '50vh' }}>
        <Loader className="spin" size={24} color="var(--primary)" />
      </div>
    );
  }

  return (
    <div className="admin-page fade-in admin-about-us-container">
      <div className="admin-header-row">
        <div className="admin-page-title">
          <Briefcase size={24} color="var(--text-main)" />
          <h1>About Us / Works</h1>
        </div>
        <Button variant="primary" onClick={() => handleOpenModal()}>
          <Plus size={18} />
          <span>Add Work</span>
        </Button>
      </div>

      <div className="works-grid">
        {works.length === 0 ? (
          <div className="empty-state">No works found. Add your first work to display on the About Us page!</div>
        ) : (
          works.map(work => (
            <div key={work.id} className="work-card">
              {work.imageUrl ? (
                <div className="work-image" style={{ backgroundImage: `url(${work.imageUrl})` }} />
              ) : (
                <div className="work-image-placeholder"><ImageIcon size={32} /></div>
              )}
              <div className="work-content-box">
                <span className="work-type-badge">{work.type}</span>
                <h3 className="work-title">{work.title}</h3>
                <p className="work-desc">{work.content}</p>
                <div className="work-actions">
                  <button className="btn-icon-edit" onClick={() => handleOpenModal(work)}><Edit size={16}/></button>
                  <button className="btn-icon-delete" onClick={() => handleDelete(work.id)}><Trash2 size={16}/></button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content admin-work-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{formData.id ? 'Edit Work' : 'Add New Work'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSave} className="modal-body">
              <div className="form-group">
                <label>Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Started our journey..." />
              </div>
              <div className="form-group">
                <label>Type / Phase</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                  <option value="PAST">Past</option>
                  <option value="PRESENT">Present</option>
                  <option value="FUTURE">Future</option>
                  <option value="MAIN">Main About Us</option>
                </select>
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input type="text" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} placeholder="https://example.com/image.jpg" />
              </div>
              <div className="form-group">
                <label>Content (Tip)</label>
                <textarea required rows={4} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} placeholder="Describe this milestone..." />
              </div>
              <div className="modal-footer">
                <Button variant="outline" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button variant="primary" type="submit" disabled={isSaving} isLoading={isSaving}>
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAboutUs;
