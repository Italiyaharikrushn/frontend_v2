import React, { useState, useEffect } from 'react';
import { useGetSellerOrdersQuery } from '../../api/orderApi';
import Pagination from '../../components/common/Pagination';
import '@/styles/pages/admin/AdminStyles.css';

const AdminDeliveries = () => {
  const [page, setPage] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const { data = {}, isLoading } = useGetSellerOrdersQuery({
    page,
    size: 10,
    status: 'DELIVERED',
    search: debouncedSearch
  });

  const orders = data.content || [];
  const totalPages = data.totalPages || 0;

  // Format the address properly
  const formatAddress = (address) => {
    if (!address) return 'N/A';
    const parts = [
      address.streetAddress,
      address.city,
      address.state,
      address.postalCode,
      address.country
    ].filter(Boolean);
    return parts.join(', ');
  };

  return (
    <div className="admin-page fade-in admin-full-height-page">
      <div className="glass-panel admin-panel-card admin-full-height-card" style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Delivery Tracking</h2>
            <p style={{ color: 'var(--text-muted)' }}>View delivered orders and their details.</p>
          </div>
          <div>
            <input
              type="text"
              placeholder="Search deliveries..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{
                width: '100%',
                maxWidth: '300px',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color, #ccc)',
                backgroundColor: 'var(--bg-main, #fff)',
                color: 'var(--text-main, #000)'
              }}
            />
          </div>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Contact No.</th>
                <th>Order ID</th>
                <th>Delivery Date</th>
                <th>Billing Address</th>
                <th>Product Name</th>
                <th>SKU</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    Loading deliveries...
                  </td>
                </tr>
              ) : orders.length > 0 ? (
                orders.flatMap((order) =>
                  order.orderItems && order.orderItems.length > 0 ? (
                    order.orderItems.map((item, index) => (
                      <tr key={`${order.id}-${index}`}>
                        <td style={{ fontWeight: '500' }}>{order.customerName || 'N/A'}</td>
                        <td>{order.customerPhone || 'N/A'}</td>
                        <td style={{ fontWeight: '500' }}>{order.orderId || order.id}</td>
                        <td>{order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : 'N/A'}</td>
                        <td style={{ maxWidth: '250px', whiteSpace: 'normal' }}>
                          {formatAddress(order.billingAddress)}
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {item.product?.images?.[0] || item.imageUrl ? (
                              <img
                                src={item.product?.images?.[0] || item.imageUrl}
                                alt={item.productName}
                                style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                              />
                            ) : null}
                            <span>{item.productName || 'Product'}</span>
                          </div>
                        </td>
                        <td style={{ fontFamily: 'monospace' }}>{item.sku || 'N/A'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr key={order.id}>
                      <td style={{ fontWeight: '500' }}>{order.customerName || 'N/A'}</td>
                      <td>{order.customerPhone || 'N/A'}</td>
                      <td style={{ fontWeight: '500' }}>{order.orderId || order.id}</td>
                      <td>{order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : 'N/A'}</td>
                      <td style={{ maxWidth: '250px', whiteSpace: 'normal' }}>
                        {formatAddress(order.billingAddress)}
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>No products</td>
                      <td style={{ color: 'var(--text-muted)' }}>N/A</td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No delivered orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div style={{ marginTop: '1rem' }}>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDeliveries;
