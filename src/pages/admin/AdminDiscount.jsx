import React from 'react';
import { useGetProductsQuery } from '../../api/productApi';
import { useAdminSettings } from '../../hooks/useAdminSettings';
import { useAdminDiscount } from '../../hooks/useAdminDiscount';
import FestivalSalePanel from '../../components/admin/FestivalSalePanel';
import CategoryDiscountPanel from '../../components/admin/CategoryDiscountPanel';
import BulkDiscountPanel from '../../components/admin/BulkDiscountPanel';
import '@/styles/pages/admin/AdminStyles.css';

const AdminDiscount = () => {
  const { data: products = [], isLoading } = useGetProductsQuery();
  const { formData, setFormData, handleSave, isUpdating } = useAdminSettings();
  
  const discountLogic = useAdminDiscount(products);

  if (isLoading) {
    return (
      <div className="admin-page fade-in">
        <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="admin-page fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="admin-header" style={{ marginBottom: '0' }}>
        <h1 className="admin-title">Discounts & Offers</h1>
      </div>

      <FestivalSalePanel 
        formData={formData} 
        setFormData={setFormData} 
        handleSave={handleSave} 
        isUpdating={isUpdating} 
      />

      <div className="admin-discount-row">
        <CategoryDiscountPanel 
          categoryStats={discountLogic.categoryStats}
          categoryInputs={discountLogic.categoryInputs}
          handleCategoryInputChange={discountLogic.handleCategoryInputChange}
          handleApplyCategoryDiscount={discountLogic.handleApplyCategoryDiscount}
          isApplyingCategory={discountLogic.isApplyingCategory}
        />

        <BulkDiscountPanel 
          products={products}
          isLoading={isLoading}
          selectedProductIds={discountLogic.selectedProductIds}
          discountPercentage={discountLogic.discountPercentage}
          setDiscountPercentage={discountLogic.setDiscountPercentage}
          validForDays={discountLogic.validForDays}
          setValidForDays={discountLogic.setValidForDays}
          handleSelectAll={discountLogic.handleSelectAll}
          handleSelectProduct={discountLogic.handleSelectProduct}
          handleApplyDiscount={discountLogic.handleApplyDiscount}
          isApplying={discountLogic.isApplying}
        />
      </div>
    </div>
  );
};

export default AdminDiscount;
