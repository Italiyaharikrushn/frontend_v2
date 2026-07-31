import React from 'react';
import { Tag } from 'lucide-react';
import Button from '../ui/Button';

const CategoryDiscountPanel = ({ 
  categoryStats, 
  categoryInputs, 
  handleCategoryInputChange, 
  handleApplyCategoryDiscount, 
  isApplyingCategory 
}) => {
  return (
    <div className="glass-panel admin-panel-card admin-discount-panel with-gap">
      <h2 className="admin-discount-panel-title">
        <span className="admin-section-icon"><Tag size={18} /></span> Apply Category Discount
      </h2>
      <div className="admin-table-container admin-discount-scrollable">
        <table className="admin-table admin-category-discount-table">
          <thead>
            <tr>
              <th>Category Name</th>
              <th>Total Products</th>
              <th style={{ minWidth: '100px' }}>% Discount</th>
              <th style={{ minWidth: '120px' }}>Valid for (Days)</th>
              <th style={{ minWidth: '100px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {categoryStats.length > 0 ? categoryStats.map((stat) => (
              <tr key={stat.category}>
                <td style={{ fontWeight: '600' }}>{stat.category}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{stat.count} {stat.count === 1 ? 'Product' : 'Products'}</td>
                <td>
                  <input 
                    type="number" 
                    placeholder="%" 
                    value={categoryInputs[stat.category]?.discountPercentage || ''} 
                    onChange={(e) => handleCategoryInputChange(stat.category, 'discountPercentage', e.target.value)}
                    className="admin-category-input"
                    min="1" max="100"
                  />
                </td>
                <td>
                  <input 
                    type="number" 
                    placeholder="Days" 
                    value={categoryInputs[stat.category]?.validForDays || ''} 
                    onChange={(e) => handleCategoryInputChange(stat.category, 'validForDays', e.target.value)}
                    className="admin-category-input"
                    min="1"
                  />
                </td>
                <td>
                  <Button 
                    onClick={() => handleApplyCategoryDiscount(stat.category)} 
                    variant="primary" 
                    style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center', padding: '0.45rem 0.9rem', whiteSpace: 'nowrap' }} 
                    disabled={isApplyingCategory}
                  >
                    <Tag size={15} /> Apply
                  </Button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No categories found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryDiscountPanel;
