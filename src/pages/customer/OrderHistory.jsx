import React, { useState, useEffect } from 'react';
import { Package, RotateCcw, X } from 'lucide-react';
import Button from '../../components/common/Button';
import { useOrderHistory } from '../../hooks/useOrderHistory';
import Pagination from '../../components/common/Pagination';
import { getCurrentDate } from '../../utils/dateUtils';
import OrderTracking from '../../components/customer/OrderTracking';

const CancellationTimer = ({ deadline }) => {
  const [timeLeft, setTimeLeft] = useState(deadline - getCurrentDate());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(deadline - getCurrentDate());
    }, 1000);
    return () => clearInterval(timer);
  }, [deadline]);

  if (timeLeft <= 0) return null;

  const m = Math.floor(timeLeft / 60000);
  const s = Math.floor((timeLeft % 60000) / 1000);

  return (
    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', marginLeft: '0.5rem' }}>
      ({m}m {s}s left)
    </span>
  );
};

const OrderHistory = () => {
  const {
    orders, isLoading, page, setPage, totalPages, closeReturnModal, submitReturn,
    isReturnModalOpen, returnReason, setReturnReason, returnDetails, setReturnDetails,
    isOrderCancellable, handleCancel, getCancellationDeadline,
    isOrderReturnable, getReturnDeadline, openReturnModal
  } = useOrderHistory();

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
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
                    {`Order #${order.orderId || order.id}`}
                  </h3>
                  {order.orderItems && order.orderItems.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                      {order.orderItems.map(item => (
                        <div key={item.id || Math.random()} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm, 6px)', overflow: 'hidden', backgroundColor: 'var(--surface)', flexShrink: 0 }}>
                            {(item.productImage || (item.product && item.product.images && item.product.images.length > 0)) ? (
                              <img
                                src={item.productImage || item.product.images[0]}
                                alt={item.productName || 'Product'}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.style.display = 'none';
                                }}
                              />
                            ) : (
                              <Package size={24} style={{ margin: '12px auto', display: 'block', color: 'var(--text-muted)' }} />
                            )}
                          </div>
                          <div>
                            <p style={{ margin: 0, fontWeight: '500', fontSize: '0.95rem' }}>{item.productName || 'Product'}</p>
                            <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                              <span>Qty: {item.quantity || 1}</span>
                              {item.phoneModel && <span>Model: {item.phoneModel}</span>}
                              <span>₹{(item.price || item.totalPrice || 0).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Placed on: {new Date(order.orderDate).toLocaleDateString()}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className={`status-badge status-${order.status ? order.status.toLowerCase() : 'pending'}`} style={{ display: 'inline-block', marginBottom: '0.5rem', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', background: 'var(--surface)', border: '1px solid var(--border)' }}>
                    {order.status}
                  </span>
                  <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Total: ₹{order.totalAmount}</p>
                </div>
              </div>
              
              <OrderTracking order={order} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Items: {order.totalItems || (order.orderItems ? order.orderItems.length : 0)}
                </p>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  {isOrderCancellable(order) ? (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Button variant="outline" size="sm" onClick={() => handleCancel(order.id || order.orderId)}>
                        Cancel Order
                      </Button>
                      {getCancellationDeadline(order) && (
                        <CancellationTimer deadline={getCancellationDeadline(order)} />
                      )}
                    </div>
                  ) : isOrderReturnable(order) ? (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Button variant="outline" size="sm" onClick={() => openReturnModal(order.id || order.orderId)}>
                        Return Order
                      </Button>
                      {getReturnDeadline(order) && (
                        <CancellationTimer deadline={getReturnDeadline(order)} />
                      )}
                    </div>
                  ) : (order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && order.status !== 'RETURNED' && order.status !== 'RETURN_REQUESTED' && order.status !== 'RETURN_REJECTED') ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '500' }}>Orders cannot be cancelled after the window has expired.</p>
                  ) : null}

                  {order.status === 'RETURNED' && (
                    <p style={{ color: 'var(--error)', fontWeight: 'bold', fontSize: '0.875rem' }}>Return Processed</p>
                  )}
                  
                  {order.status === 'RETURN_REQUESTED' && (
                    <p style={{ color: 'var(--text-muted)', fontWeight: 'bold', fontSize: '0.875rem' }}>Return Requested</p>
                  )}

                  {order.status === 'RETURN_REJECTED' && (
                    <p style={{ color: 'var(--error)', fontWeight: 'bold', fontSize: '0.875rem' }}>Return Rejected</p>
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

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      {isReturnModalOpen && (
        <div onClick={closeReturnModal} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div onClick={(e) => e.stopPropagation()} className="glass-panel" style={{ padding: '2rem', borderRadius: '8px', width: '90%', maxWidth: '400px' }}>
            <h3 style={{ marginBottom: '1rem' }}>Request Return</h3>
            <label style={{ display: 'block', marginBottom: '1rem' }}>
              Reason:
              <select className="input-field" value={returnReason} onChange={(e) => setReturnReason(e.target.value)} style={{ width: '100%', marginTop: '0.5rem' }}>
                <option value="Changed my mind">Changed my mind</option>
                <option value="Damaged product">Damaged product</option>
                <option value="Wrong item sent">Wrong item sent</option>
                <option value="Not as described">Not as described</option>
              </select>
            </label>
            <label style={{ display: 'block', marginBottom: '1.5rem' }}>
              Additional Details (Optional):
              <textarea className="input-field" value={returnDetails} onChange={(e) => setReturnDetails(e.target.value)} rows="3" style={{ width: '100%', marginTop: '0.5rem' }} />
            </label>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <Button variant="outline" onClick={closeReturnModal}>Cancel</Button>
              <Button variant="primary" onClick={submitReturn}>Submit Request</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
