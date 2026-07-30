import React from 'react';
import { Package, RotateCcw, X } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useGetCustomerOrdersQuery, useReturnCustomerOrderMutation, useCancelCustomerOrderMutation } from '../../api/orderApi';
import { useToast } from '../../components/ui/ToastProvider';
import { useAlert } from '../../components/ui/AlertProvider';

const OrderHistory = () => {
  const { pushToast } = useToast();
  const { confirm } = useAlert();
  const { data: orders = [], isLoading } = useGetCustomerOrdersQuery();
  const [returnOrder] = useReturnCustomerOrderMutation();
  const [cancelOrder] = useCancelCustomerOrderMutation();

  const handleReturn = async (orderId) => {
    if (await confirm('Are you sure you want to return this order?')) {
      try {
        await returnOrder(orderId).unwrap();
        pushToast('Return request submitted successfully', 'success');
      } catch (err) {
        console.error('Failed to submit return request:', err);
        pushToast('Error submitting return request. Please try again.', 'error');
      }
    }
  };

  const handleCancel = async (orderId) => {
    if (await confirm('Are you sure you want to cancel this order?')) {
      try {
        await cancelOrder(orderId).unwrap();
        pushToast('Order cancelled successfully', 'success');
      } catch (err) {
        console.error('Failed to cancel order:', err);
        pushToast('Error cancelling order. Please try again.', 'error');
      }
    }
  };

  return (
    <div className="fade-in" style={{ padding: '2rem 5%' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>My Orders</h1>
        <p style={{ color: 'var(--text-muted)' }}>View your past orders and manage returns.</p>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <p>Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem', borderRadius: 'var(--radius-lg)' }}>
          <Package size={48} style={{ margin: '0 auto 1rem', opacity: 0.5, color: 'var(--text-muted)' }} />
          <h2>You haven't placed any orders yet.</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Start shopping to see your orders here.</p>
          <Button variant="primary" onClick={() => window.location.href = '/products'}>Shop Now</Button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {orders.map(order => (
            <div key={order.id} className="glass-panel hover-lift" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>
                    {order.orderItems && order.orderItems.length > 0 
                      ? order.orderItems.map(item => item.productName || 'Product').join(', ') 
                      : `Order #${order.orderId || order.id}`}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Placed on: {new Date(order.orderDate).toLocaleDateString()}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className={`status-badge status-${order.status ? order.status.toLowerCase() : 'pending'}`} style={{ display: 'inline-block', marginBottom: '0.5rem', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', background: 'var(--surface)', border: '1px solid var(--border)' }}>
                    {order.status}
                  </span>
                  <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Total: ₹{order.totalAmount}</p>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Items: {order.totalItems || (order.orderItems ? order.orderItems.length : 0)}
                </p>
                
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {(order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && order.status !== 'RETURNED') && (
                    <Button variant="outline" onClick={() => handleCancel(order.id)} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <X size={16} /> Cancel Order
                    </Button>
                  )}
                  
                  {order.status === 'DELIVERED' && (
                    <Button variant="secondary" onClick={() => handleReturn(order.id)} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <RotateCcw size={16} /> Return Order
                    </Button>
                  )}
                  
                  {order.status === 'RETURNED' && (
                    <p style={{ color: 'var(--error)', fontWeight: 'bold', fontSize: '0.875rem' }}>Return Processed</p>
                  )}

                  {order.status === 'CANCELLED' && (
                    <p style={{ color: 'var(--text-muted)', fontWeight: 'bold', fontSize: '0.875rem' }}>Order Cancelled</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
