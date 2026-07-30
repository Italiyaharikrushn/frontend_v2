import React from 'react';
import { Tag, CheckSquare, ImageIcon } from 'lucide-react';
import Button from '../ui/Button';

const BulkDiscountPanel = ({
  products,
  isLoading,
  selectedProductIds,
  discountPercentage,
  setDiscountPercentage,
  validForDays,
  setValidForDays,
  handleSelectAll,
  handleSelectProduct,
  handleApplyDiscount,
  isApplying
}) => {
  return (
    <div className="glass-panel admin-panel-card admin-discount-panel">
      <div className="admin-discount-panel-header">
        <h2 className="admin-discount-panel-title">
          <CheckSquare size={20} /> Bulk Product Discount
        </h2>
        <div className="admin-discount-actions">
          <input 
            type="number" 
            placeholder="% Discount" 
            value={discountPercentage} 
            onChange={(e) => setDiscountPercentage(e.target.value)}
            className="admin-discount-input"
            style={{ width: '120px' }}
            min="1" max="100"
          />
          <input 
            type="number" 
            placeholder="Valid for (Days)" 
            value={validForDays} 
            onChange={(e) => setValidForDays(e.target.value)}
            className="admin-discount-input"
            style={{ width: '140px' }}
            min="1"
          />
          <Button onClick={handleApplyDiscount} variant="primary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }} disabled={isApplying}>
            <Tag size={18} /> Apply Discount
          </Button>
        </div>
      </div>

      {isLoading ? (
        <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading products...</p>
      ) : (
        <div className="admin-table-container admin-discount-scrollable">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll} 
                    checked={products.length > 0 && selectedProductIds.size === products.length}
                    style={{ cursor: 'pointer' }}
                  />
                </th>
                <th>Image</th>
                <th>Product Details</th>
                <th>SKU</th>
                <th>Original Price</th>
                <th>Discount Price</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <input 
                      type="checkbox" 
                      checked={selectedProductIds.has(product.id)} 
                      onChange={() => handleSelectProduct(product.id)}
                      style={{ cursor: 'pointer' }}
                    />
                  </td>
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
                  <td style={{ fontWeight: '500', color: 'var(--success)' }}>
                    {product.discountPrice ? `₹${product.discountPrice}` : 'None'}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BulkDiscountPanel;
