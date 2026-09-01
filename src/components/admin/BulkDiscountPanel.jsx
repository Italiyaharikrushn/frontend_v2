import React, { useState, useRef, useEffect } from 'react';
import { Tag, CheckSquare, ImageIcon, ChevronDown } from 'lucide-react';
import Button from '../common/Button';

const BulkDiscountPanel = ({
  products,
  isLoading,
  selectedProductIds,
  discountPercentage,
  setDiscountPercentage,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  isActive,
  setIsActive,
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
        <div className="admin-discount-actions" style={{ alignItems: 'flex-end', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Target Products</span>
            <div className="admin-category-dropdown" ref={dropdownRef} style={{ position: 'relative', width: '220px' }}>
              <div
                className="admin-discount-input"
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: 'var(--surface)' }}
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
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Discount %</span>
            <input
              type="number"
              placeholder="e.g. 15"
              value={discountPercentage}
              onChange={(e) => setDiscountPercentage(e.target.value)}
              className="admin-discount-input"
              style={{ width: '100px' }}
              min="1" max="100"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Start Date</span>
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="admin-discount-input"
              style={{ width: '150px' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>End Date</span>
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="admin-discount-input"
              style={{ width: '150px' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', justifyContent: 'flex-end', paddingBottom: '0.65rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500' }}>
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} style={{ width: '1.1rem', height: '1.1rem', cursor: 'pointer' }} />
              Active
            </label>
          </div>

          <Button onClick={handleApplyDiscount} variant="primary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', height: '42px' }} disabled={isApplying}>
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
                <th>Discount Config</th>
                <th>Status</th>
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
                    {product.configuredDiscountPrice ? `₹${product.configuredDiscountPrice} (${product.discountPercentage || 0}%)` : 'None'}
                  </td>
                  <td>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      background: product.discountStatus === 'ACTIVE' ? 'var(--success-light)' :
                        product.discountStatus === 'SCHEDULED' ? 'var(--warning-light)' :
                          product.discountStatus === 'EXPIRED' ? 'var(--danger-light)' : 'var(--surface-hover)',
                      color: product.discountStatus === 'ACTIVE' ? 'var(--success)' :
                        product.discountStatus === 'SCHEDULED' ? 'var(--warning)' :
                          product.discountStatus === 'EXPIRED' ? 'var(--danger)' : 'var(--text-muted)'
                    }}>
                      {product.discountStatus || 'NONE'}
                    </span>
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
