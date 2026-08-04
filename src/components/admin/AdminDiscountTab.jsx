import React, { useState } from 'react';
import Pagination from '../../components/ui/Pagination';
import { useGetProductsQuery } from '../../api/productApi';
import { useAdminFestival } from '../../hooks/useAdminFestival';
import { useAdminDiscount } from '../../hooks/useAdminDiscount';
import FestivalSalePanel from '../../components/admin/FestivalSalePanel';
import BulkDiscountPanel from '../../components/admin/BulkDiscountPanel';
import '@/styles/pages/admin/AdminStyles.css';

const AdminDiscount = () => {
  const [page, setPage] = useState(0);
  const size = 10;
  const { data = {}, isLoading } = useGetProductsQuery({ page, size });
  const products = data.content || [];
  const totalPages = data.totalPages || 0;
  const { formData, setFormData, handleSave, isUpdating } = useAdminFestival();
  
  const discountLogic = useAdminDiscount(products);

  if (isLoading) {
    return (
      <div className="admin-page fade-in">
        <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      <FestivalSalePanel 
        formData={formData} 
        setFormData={setFormData} 
        handleSave={handleSave} 
        isUpdating={isUpdating} 
      />

      <div className="admin-discount-row">
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <BulkDiscountPanel 
            products={products}
            isLoading={isLoading}
            selectedProductIds={discountLogic.selectedProductIds}
            discountPercentage={discountLogic.discountPercentage}
            setDiscountPercentage={discountLogic.setDiscountPercentage}
            validForDays={discountLogic.validForDays}
            setValidForDays={discountLogic.setValidForDays}
            categoryStats={discountLogic.categoryStats}
            selectedCategories={discountLogic.selectedCategories}
            setSelectedCategories={discountLogic.setSelectedCategories}
            handleSelectAll={discountLogic.handleSelectAll}
            handleSelectProduct={discountLogic.handleSelectProduct}
            handleApplyDiscount={discountLogic.handleApplyDiscount}
            isApplying={discountLogic.isApplying || discountLogic.isApplyingCategory}
          />
          <Pagination 
            currentPage={page} 
            totalPages={totalPages} 
            onPageChange={setPage} 
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDiscount;
