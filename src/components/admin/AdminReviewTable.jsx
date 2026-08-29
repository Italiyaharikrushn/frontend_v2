import React from 'react';
import { Trash2 } from 'lucide-react';
import Button from './../common/Button';
import StarRating from './../../components/customer/StarRating';

const AdminReviewTable = ({ reviewsPage, isLoading, handleDelete }) => {
  return (
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
  );
};

export default AdminReviewTable;
