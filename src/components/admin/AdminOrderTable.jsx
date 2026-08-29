import React, { Fragment } from 'react';
import { Download } from 'lucide-react';
import Button from '../common/Button';

const AdminOrderTable = ({ isLoading, filteredOrders, activeTab, selectedOrders, handleSelectAll, handleSelectOrder, handleAcceptSingleOrder, handleDownloadSingleLabel, downloadedLabels }) => {
  return (
    <div className="admin-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th style={{ width: '50px' }}>
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={filteredOrders.length > 0 && selectedOrders.length === filteredOrders.length}
                style={{ cursor: 'pointer' }}
              />
            </th>
            <th>Order Id</th>
            <th>Order Name</th>
            <th>Image</th>
            <th>Customer</th>
            <th>Quantity</th>
            <th>Date</th>
            <th>Total</th>
            <th>Payment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="10" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                Loading orders...
              </td>
            </tr>
          ) : filteredOrders.length > 0 ? filteredOrders.map(order => (
            <Fragment key={order.id}>
              <tr>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order.id)}
                    onChange={() => handleSelectOrder(order.id)}
                    style={{ cursor: 'pointer' }}
                  />
                </td>
                <td style={{ fontWeight: '500' }}>
                  {order.orderId || order.id}
                </td>
                <td style={{ fontWeight: '500' }}>
                  {order.orderItems && order.orderItems.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {order.orderItems.map((item, index) => (
                        <div key={index} style={{ height: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <span>{item.productName || 'Product'}</span>
                          {item.phoneModel && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Model: {item.phoneModel}</span>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    `Order_id No. ${order.orderId || order.id}`
                  )}
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {order.orderItems && order.orderItems.length > 0 ? (
                      order.orderItems.map((item, index) => {
                        const imageUrl = item.product?.images?.[0] || item.imageUrl || null;
                        return imageUrl ? (
                          <img
                            key={index}
                            src={imageUrl}
                            alt={item.productName || 'Product'}
                            style={{
                              width: '50px',
                              height: '50px',
                              objectFit: 'cover',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--border)'
                            }}
                          />
                        ) : (
                          <div key={index} style={{ height: '50px', display: 'flex', alignItems: 'center', color: 'var(--text-muted)' }}>No Image</div>
                        );
                      })
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>No Image</span>
                    )}
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <span style={{ fontWeight: '600' }}>{order.customerName}</span>
                    <small style={{ color: 'var(--text-muted)' }}>{order.customerEmail}</small>
                  </div>
                </td>
                <td style={{ fontWeight: '500' }}>
                  {order.orderItems && order.orderItems.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {order.orderItems.map((item, index) => (
                        <div key={index} style={{ height: '50px', display: 'flex', alignItems: 'center' }}>
                          {item.quantity || 1}
                        </div>
                      ))}
                    </div>
                  ) : (
                    1
                  )}
                </td>
                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                <td>₹{order.totalAmount}</td>
                <td>
                  <span className={`status-badge status-${order.paymentMethod ? order.paymentMethod.toLowerCase() : 'prepaid'}`} style={{ display: 'inline-block', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', background: 'var(--surface)', border: '1px solid var(--border)' }}>
                    {order.paymentMethod}
                  </span>
                  <div style={{ marginTop: '4px', fontSize: '0.75rem', color: order.paymentStatus === 'COMPLETED' ? '#10b981' : order.paymentStatus === 'FAILED' ? '#ef4444' : '#f59e0b', fontWeight: 'bold' }}>
                    {order.paymentStatus || 'PENDING'}
                  </div>
                </td>
                <td>
                  {activeTab === 'PENDING' && (
                    <Button variant="secondary" onClick={() => handleAcceptSingleOrder(order.id)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                      Accept
                    </Button>
                  )}
                  {activeTab === 'READY_TO_SHIP' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                      <Button variant="primary" onClick={() => handleDownloadSingleLabel(order)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', gap: '0.4rem', alignItems: 'center', width: '100%', justifyContent: 'center' }}>
                        <Download size={14} /> Label
                      </Button>
                      {downloadedLabels.includes(order.id) ? (
                        <>
                          <span style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: '500' }}>Downloaded</span>
                        </>
                      ) : (
                        <span style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: '500', opacity: 0.8 }}>Not Downloaded</span>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            </Fragment>
          )) : (
            <tr>
              <td colSpan="10" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                No {activeTab} orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrderTable;
