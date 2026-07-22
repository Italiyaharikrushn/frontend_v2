import React, { useState } from 'react';
import { Download, Filter, Search } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useGetSellerOrdersQuery, useUpdateOrderStatusMutation } from '../../api/orderApi';
import './AdminStyles.css';

const AdminOrders = () => {
  const [activeTab, setActiveTab] = useState('PENDING');
  const [selectedOrders, setSelectedOrders] = useState([]);
  const { data: orders = [], isLoading } = useGetSellerOrdersQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus({ id: orderId, status: newStatus }).unwrap();
      // The RTK Query optimistic update handles UI state immediately
    } catch (err) {
      console.error('Failed to update status: ', err);
      alert('Error updating order status');
    }
  };

  const filteredOrders = orders.filter(order => order.status === activeTab);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedOrders(filteredOrders.map(o => o.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (id) => {
    if (selectedOrders.includes(id)) {
      setSelectedOrders(selectedOrders.filter(orderId => orderId !== id));
    } else {
      setSelectedOrders([...selectedOrders, id]);
    }
  };

  const handleDownloadLabels = () => {
    if (selectedOrders.length === 0) return;

    // Generate dummy label content
    const labelData = selectedOrders.map(id => {
      const order = orders.find(o => o.id === id);
      const productNames = order.orderItems && order.orderItems.length > 0 ? order.orderItems.map(item => item.productName || 'Product').join(', ') : `Order #${order.orderId || order.id}`;
      return `--- SHIPPING LABEL ---\nOrder: ${productNames}\nCustomer: ${order.customerName}\nAddress: ${order.shippingAddress?.city}, ${order.shippingAddress?.state}\n`;
    }).join('\n\n');

    const blob = new Blob([labelData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shipping_labels_${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setSelectedOrders([]);
  };

  return (
    <div className="admin-page fade-in">
      {/* <div className="admin-header">
        <h1 className="admin-title">Orders Management</h1>
      </div> */}

      <div className="glass-panel admin-panel-card">
        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === 'PENDING' ? 'active' : ''}`}
            onClick={() => { setActiveTab('PENDING'); setSelectedOrders([]); }}
          >
            Pending Orders
          </button>
          <button
            className={`admin-tab ${activeTab === 'READY_TO_SHIP' ? 'active' : ''}`}
            onClick={() => { setActiveTab('READY_TO_SHIP'); setSelectedOrders([]); }}
          >
            Ready to Ship
          </button>
          <button
            className={`admin-tab ${activeTab === 'SHIPPED' ? 'active' : ''}`}
            onClick={() => { setActiveTab('SHIPPED'); setSelectedOrders([]); }}
          >
            Shipped
          </button>
          <button
            className={`admin-tab ${activeTab === 'DELIVERED' ? 'active' : ''}`}
            onClick={() => { setActiveTab('DELIVERED'); setSelectedOrders([]); }}
          >
            Delivered
          </button>
          <button
            className={`admin-tab ${activeTab === 'CANCELLED' ? 'active' : ''}`}
            onClick={() => { setActiveTab('CANCELLED'); setSelectedOrders([]); }}
          >
            Cancelled
          </button>
          <button
            className={`admin-tab ${activeTab === 'RETURNED' ? 'active' : ''}`}
            onClick={() => { setActiveTab('RETURNED'); setSelectedOrders([]); }}
          >
            Returned
          </button>
        </div>

        <div className="admin-search-toolbar">
          <div className="admin-search-wrapper">
            <Search size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            <input type="text" placeholder="Search orders..." />
          </div>
          <Button variant="ghost" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Filter size={18} /> Filter
          </Button>
        </div>

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
                <th>Order Name</th>
                <th>Image</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status (Movable)</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length > 0 ? filteredOrders.map(order => (
                <tr key={order.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => handleSelectOrder(order.id)}
                      style={{ cursor: 'pointer' }}
                    />
                  </td>
                  <td style={{ fontWeight: '500' }}>
                    {order.orderItems && order.orderItems.length > 0
                      ? order.orderItems.map(item => item.productName || 'Product').join(', ')
                      : `Order #${order.orderId || order.id}`}
                  </td>
                  <td>
                    <div className="admin-table-actions">
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
                            <span key={index} style={{ color: 'var(--text-muted)' }}>No Image</span>
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
                  <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td>₹{order.totalAmount}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      style={{
                        padding: '0.55rem 0.7rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border)',
                        background: 'var(--surface)',
                        color: 'var(--text-main)',
                        cursor: 'pointer',
                        minWidth: '140px'
                      }}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="READY_TO_SHIP">Ready to Ship</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                      <option value="RETURNED">Returned</option>
                    </select>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No {activeTab} orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
