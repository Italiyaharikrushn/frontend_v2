import React from 'react';
import { useAdminReviews } from '../../hooks/useAdminReviews';
import AdminReviewTable from '../../components/admin/AdminReviewTable';
import Pagination from '../../components/ui/Pagination';
import '@/styles/pages/admin/AdminStyles.css';

const AdminReviews = () => {
  const { page, setPage, reviewsPage, isLoading, handleDelete } = useAdminReviews();

  return (
    <div className="admin-page fade-in admin-full-height-page">
      <div className="glass-panel admin-panel-card admin-full-height-card">
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '600' }}>Customer Reviews</h2>
        
        <AdminReviewTable reviewsPage={reviewsPage} isLoading={isLoading} handleDelete={handleDelete} />

        {reviewsPage?.totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={reviewsPage.totalPages}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
};

export default AdminReviews;
