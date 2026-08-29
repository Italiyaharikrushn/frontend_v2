import React, { useState } from 'react';
import { Edit, Trash2, Image as ImageIcon, Save } from 'lucide-react';
import Pagination from './../common/Pagination';

const InlineStockEditor = ({ product, onSave }) => {
  const [stock, setStock] = useState(product.stock);
  const [isChanged, setIsChanged] = useState(false);

  const handleChange = (e) => {
    setStock(e.target.value);
    setIsChanged(parseInt(e.target.value, 10) !== product.stock && !isNaN(parseInt(e.target.value, 10)));
  };

  const handleSave = () => {
    if (isChanged) {
      onSave(product, stock);
      setIsChanged(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <input
        type="number"
        value={stock}
        onChange={handleChange}
        className="admin-form-field"
        style={{ padding: '0.25rem 0.5rem', width: '70px', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--surface-alt)', color: 'var(--text-main)', fontSize: '0.9rem' }}
      />
      {isChanged && (
        <button
          onClick={handleSave}
          style={{ background: 'var(--success)', color: 'white', border: 'none', borderRadius: '4px', padding: '0.35rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title="Save Stock"
        >
          <Save size={14} />
        </button>
      )}
    </div>
  );
};

const AdminProductTable = ({ products, isLoading, page, setPage, totalPages, handleOpenForm, handleDelete, handleUpdateStock }) => {
  if (isLoading) {
    return <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading products...</p>;
  }

  return (
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
              <td style={{ width: '120px' }}>
                <InlineStockEditor product={product} onSave={handleUpdateStock} />
              </td>
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
  );
};

export default AdminProductTable;
