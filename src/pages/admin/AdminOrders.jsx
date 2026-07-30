import React, { useState } from 'react';
import { Download, Filter, Search, ChevronDown, ChevronUp } from 'lucide-react';
import Button from '../../components/ui/Button';
import AdminOrderTable from '../../components/admin/AdminOrderTable';
import AdminOrderTabs from '../../components/admin/AdminOrderTabs';
import { useAdminOrders } from '../../hooks/useAdminOrders';
import '@/styles/css/pages/admin/AdminStyles.css';

const AdminOrders = () => {
  const [isLabelDropdownOpen, setIsLabelDropdownOpen] = useState(false);

  const {
    activeTab,
    setActiveTab,
    labelFilter,
    setLabelFilter,
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
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Filter size={18} /> Filter :
          </div>
          {activeTab === 'READY_TO_SHIP' && (
            <div style={{ position: 'relative' }}>
              <Button variant="secondary" onClick={() => setIsLabelDropdownOpen(!isLabelDropdownOpen)} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-main)', padding: '0.6rem 1rem' }}>
                Label downloaded {isLabelDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </Button>
              {isLabelDropdownOpen && (
                <>
                  <div onClick={() => setIsLabelDropdownOpen(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 40 }} />
                  <div className="glass-panel" style={{ position: 'absolute', top: '100%', left: 0, marginTop: '0.5rem', padding: '1rem', zIndex: 50, borderRadius: 'var(--radius-md)', minWidth: '180px' }}>
                    <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem', cursor: 'pointer', color: 'var(--text-main)' }}>
                      <input type="radio" name="labelFilter" checked={labelFilter === 'YES'} onChange={() => { setLabelFilter('YES'); setIsLabelDropdownOpen(false); }} /> Yes
                    </label>
                    <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem', cursor: 'pointer', color: 'var(--text-main)' }}>
                      <input type="radio" name="labelFilter" checked={labelFilter === 'NO'} onChange={() => { setLabelFilter('NO'); setIsLabelDropdownOpen(false); }} /> No
                    </label>
                    <button onClick={() => { setLabelFilter(''); setIsLabelDropdownOpen(false); }} style={{ color: '#4F46E5', fontWeight: '600', border: 'none', background: 'none', cursor: 'pointer', padding: 0, fontSize: '0.9rem' }}>
                      Clear Filter
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
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
