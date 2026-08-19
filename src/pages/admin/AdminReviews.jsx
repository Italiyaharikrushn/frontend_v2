import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useGetAllReviewsAdminQuery, useDeleteReviewAdminMutation } from '../../api/reviewApi';
import { useToast } from '../../components/ui/ToastProvider';
import Pagination from '../../components/ui/Pagination';
import Button from '../../components/ui/Button';
import StarRating from '../../components/storefront/StarRating';
import '@/styles/pages/admin/AdminStyles.css';

const AdminReviews = () => {
  const [page, setPage] = useState(0);
  const size = 10;
  
  const { data: reviewsPage, isLoading } = useGetAllReviewsAdminQuery({ page, size });
  const [deleteReview] = useDeleteReviewAdminMutation();
  const { pushToast } = useToast();

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review? This action cannot be undone.")) return;
    
    try {
      await deleteReview(reviewId).unwrap();
      pushToast("Review deleted successfully", "success");
    } catch (err) {
      pushToast(err?.data?.message || "Failed to delete review", "error");
    }
  };

  return (
    <div className="admin-page fade-in admin-full-height-page">
      <div className="glass-panel admin-panel-card admin-full-height-card">
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '600' }}>Customer Reviews</h2>
        
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Customer</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Loading reviews...</td></tr>
              ) : reviewsPage?.content?.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No reviews found.</td></tr>
              ) : (
                reviewsPage?.content?.map(review => (
                  <tr key={review.id}>
                    <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {review.productTitle || 'Unknown Product'}
                    </td>
                    <td>{review.userName || review.userEmail || 'Anonymous'}</td>
                    <td>
                      <StarRating rating={review.rating} showCount={false} size={14} />
                    </td>
                    <td style={{ maxWidth: '300px' }}>
                      <div style={{ maxHeight: '3em', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {review.comment}
                      </div>
                    </td>
                    <td>{new Date(review.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Button variant="danger" onClick={() => handleDelete(review.id)} style={{ padding: '0.4rem', minWidth: 'auto' }}>
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

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
