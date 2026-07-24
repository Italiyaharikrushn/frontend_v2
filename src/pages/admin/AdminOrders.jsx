import React, { useState } from 'react';
import { Download, Filter, Search } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useGetSellerOrdersQuery, useUpdateOrderStatusMutation } from '../../api/orderApi';
import { useGetPublicStoreSettingsQuery } from '../../api/settingsApi';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './AdminStyles.css';

const AdminOrders = () => {
  const [activeTab, setActiveTab] = useState('PENDING');
  const [selectedOrders, setSelectedOrders] = useState([]);
  const { data: orders = [], isLoading } = useGetSellerOrdersQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const { data: storeSettings } = useGetPublicStoreSettingsQuery();

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

  const generatePdfLabels = (orderIdsToPrint) => {
    if (!orderIdsToPrint || orderIdsToPrint.length === 0) return;

    const doc = new jsPDF();
    
    orderIdsToPrint.forEach((id, index) => {
      const order = orders.find(o => o.id === id);
      if (!order) return;

      if (index > 0) doc.addPage();

      // Header
      doc.setFontSize(20);
      doc.text('INVOICE / SHIPPING LABEL', 14, 22);

      // Auto-generated Invoice ID
      doc.setFontSize(10);
      doc.text(`Invoice Number: INV-${order.id}-${new Date().getTime()}`, 14, 30);
      doc.text(`Order Date: ${new Date(order.orderDate).toLocaleDateString()}`, 14, 35);

      // Admin / Store Details
      doc.setFontSize(12);
      doc.text('FROM:', 14, 45);
      doc.setFontSize(10);
      doc.text(`${storeSettings?.storeName || 'Store Name'}`, 14, 50);
      if (storeSettings?.contactEmail) doc.text(`Email: ${storeSettings.contactEmail}`, 14, 55);
      if (storeSettings?.storeAddress) doc.text(`Address: ${storeSettings.storeAddress}`, 14, 60);
      if (storeSettings?.contactPhone) doc.text(`Phone: ${storeSettings.contactPhone}`, 14, 65);

      // Customer Details
      doc.setFontSize(12);
      doc.text('TO (CUSTOMER):', 120, 45);
      doc.setFontSize(10);
      doc.text(`${order.customerName || 'N/A'}`, 120, 50);
      if (order.customerEmail) doc.text(`Email: ${order.customerEmail}`, 120, 55);
      
      const addr = order.shippingAddress;
      let addrY = 60;
      if (addr) {
        if (addr.street) { doc.text(addr.street, 120, addrY); addrY += 5; }
        if (addr.city || addr.state) { doc.text(`${addr.city || ''}, ${addr.state || ''}`, 120, addrY); addrY += 5; }
        if (addr.zipCode) { doc.text(`Zip: ${addr.zipCode}`, 120, addrY); addrY += 5; }
        if (addr.country) { doc.text(addr.country, 120, addrY); }
      }

      // Order Items Table
      const tableColumn = ["Product Name", "Quantity", "Price"];
      const tableRows = [];
      let totalQty = 0;

      if (order.orderItems && order.orderItems.length > 0) {
        order.orderItems.forEach(item => {
          const qty = item.quantity || 1;
          totalQty += qty;
          tableRows.push([
            item.productName || 'Product',
            qty.toString(),
            `Rs. ${item.price || 0}`
          ]);
        });
      } else {
        tableRows.push(['Custom Order', '1', `Rs. ${order.totalAmount}`]);
        totalQty = 1;
      }

      autoTable(doc, {
        startY: Math.max(75, addrY + 5),
        head: [tableColumn],
        body: tableRows,
        theme: 'striped',
        headStyles: { fillColor: [41, 128, 185] },
      });

      // Total
      const finalY = doc.lastAutoTable.finalY || 90;
      doc.setFontSize(12);
      doc.text(`Total Quantity: ${totalQty}`, 14, finalY + 10);
      doc.text(`Total Amount: Rs. ${order.totalAmount}`, 14, finalY + 15);
    });

    doc.save(`shipping_labels_${new Date().getTime()}.pdf`);
    setSelectedOrders([]);
  };

  const handleDownloadLabels = () => generatePdfLabels(selectedOrders);
  const handleDownloadSingleLabel = (order) => generatePdfLabels([order.id]);

  const handleAcceptOrders = async () => {
    if (selectedOrders.length === 0) return;
    
    try {
      await Promise.all(selectedOrders.map(id => updateOrderStatus({ id, status: 'READY_TO_SHIP' }).unwrap()));
      setSelectedOrders([]);
      alert('Selected orders have been accepted and moved to Ready to Ship.');
    } catch (err) {
      console.error('Failed to accept orders: ', err);
      alert('Error accepting some orders');
    }
  };

  const handleAcceptSingleOrder = async (orderId) => {
    try {
      await updateOrderStatus({ id: orderId, status: 'READY_TO_SHIP' }).unwrap();
      // Optional alert
    } catch (err) {
      console.error('Failed to accept order: ', err);
      alert('Error accepting order');
    }
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
                <th>Actions</th>
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
                    {activeTab === 'PENDING' && (
                      <Button variant="secondary" onClick={() => handleAcceptSingleOrder(order.id)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                        Accept
                      </Button>
                    )}
                    {activeTab === 'READY_TO_SHIP' && (
                      <Button variant="secondary" onClick={() => handleDownloadSingleLabel(order)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                        <Download size={14} /> Label
                      </Button>
                    )}
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

        {selectedOrders.length > 0 && (
          <div className="admin-bulk-actions" style={{ padding: '1rem', background: 'var(--surface)', borderTop: '1px solid var(--border)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{selectedOrders.length} order(s) selected</span>
            {activeTab === 'PENDING' && (
              <Button variant="primary" onClick={handleAcceptOrders}>
                Accept Orders
              </Button>
            )}
            {activeTab === 'READY_TO_SHIP' && (
              <Button variant="primary" onClick={handleDownloadLabels} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Download size={18} /> Download Labels
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
