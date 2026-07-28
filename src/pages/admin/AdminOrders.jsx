import React from 'react';
import { Download, Filter, Search } from 'lucide-react';
import Button from '../../components/ui/Button';
import AdminOrderTable from '../../components/admin/AdminOrderTable';
import AdminOrderTabs from '../../components/admin/AdminOrderTabs';
import { useAdminOrders } from '../../hooks/useAdminOrders';
import '@/styles/css/pages/admin/AdminStyles.css';

const AdminOrders = () => {
  const {
    activeTab,
    setActiveTab,
    selectedOrders,
    setSelectedOrders,
    downloadedLabels,
    isLoading,
    filteredOrders,
    handleSelectAll,
    handleSelectOrder,
    handleDownloadLabels,
    handleDownloadSingleLabel,
    handleAcceptOrders,
    handleAcceptSingleOrder
  } = useAdminOrders();

  return (
    <div className="admin-page fade-in admin-full-height-page">
      <div className="glass-panel admin-panel-card admin-full-height-card">
        <AdminOrderTabs 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          setSelectedOrders={setSelectedOrders} 
        />

        <div className="admin-search-toolbar">
          <div className="admin-search-wrapper">
            <Search size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            <input type="text" placeholder="Search orders..." />
          </div>
          <Button variant="ghost" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Filter size={18} /> Filter
          </Button>
        </div>

        <AdminOrderTable
          isLoading={isLoading}
          filteredOrders={filteredOrders}
          activeTab={activeTab}
          selectedOrders={selectedOrders}
          handleSelectAll={handleSelectAll}
          handleSelectOrder={handleSelectOrder}
          handleAcceptSingleOrder={handleAcceptSingleOrder}
          handleDownloadSingleLabel={handleDownloadSingleLabel}
          downloadedLabels={downloadedLabels}
        />

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
