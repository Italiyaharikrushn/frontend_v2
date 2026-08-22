import { useState } from 'react';
import { useGetAllReviewsAdminQuery, useDeleteReviewAdminMutation } from '../api/reviewApi';
import { useToast } from '../components/ui/ToastProvider';

export const useAdminReviews = () => {
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

  return {
    page,
    setPage,
    reviewsPage,
    isLoading,
    handleDelete
  };
};
