import React, { useState, useRef, useEffect } from 'react';
import { Tag, CheckSquare, ImageIcon, ChevronDown } from 'lucide-react';
import Button from '../common/Button';

const BulkDiscountPanel = ({
  products,
  isLoading,
  selectedProductIds,
  discountPercentage,
  setDiscountPercentage,
  validForDays,
  setValidForDays,
  categoryStats,
  selectedCategories,
  setSelectedCategories,
  handleSelectAll,
  handleSelectProduct,
  handleApplyDiscount,
  isApplying
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategoryToggle = (category) => {
    const newSelected = new Set(selectedCategories);
    if (newSelected.has(category)) {
      newSelected.delete(category);
    } else {
      newSelected.add(category);
    }
    setSelectedCategories(newSelected);
  };

  return (
    <div className="glass-panel admin-panel-card admin-discount-panel">
      <div className="admin-discount-panel-header">
        <h2 className="admin-discount-panel-title">
          <CheckSquare size={20} /> Bulk Product Discount
        </h2>
        <div className="admin-discount-actions">
          <div className="admin-category-dropdown" ref={dropdownRef} style={{ position: 'relative', width: '220px' }}>
            <div
              className="admin-discount-input"
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: 'var(--surface)', padding: '0.65rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {selectedCategories.size === 0 ? 'Specific Products' : `${selectedCategories.size} Categories Selected`}
              </span>
              <ChevronDown size={16} />
            </div>
            {isDropdownOpen && (
              <div style={{ position: 'absolute', top: '100%', left: 0, width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', marginTop: '0.25rem', zIndex: 999, maxHeight: '200px', overflowY: 'auto', boxShadow: 'var(--shadow-md)' }}>
                {categoryStats && categoryStats.map((stat) => (
                  <label key={stat.category} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', cursor: 'pointer', borderBottom: '1px solid var(--border)', margin: 0 }}>
                    <input
                      type="checkbox"
                      checked={selectedCategories.has(stat.category)}
                      onChange={() => handleCategoryToggle(stat.category)}
                      style={{ cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '0.9rem' }}>{stat.category}</span>
                  </label>
                ))}
                {categoryStats.length === 0 && (
                  <div style={{ padding: '0.5rem 0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>No categories found</div>
                )}
              </div>
            )}
          </div>
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
