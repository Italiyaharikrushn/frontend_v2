import React from 'react';
import { Download, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import Button from '../../components/ui/Button';
import AdminOrderTable from '../../components/admin/AdminOrderTable';
import AdminOrderTabs from '../../components/admin/AdminOrderTabs';
import { useAdminOrders } from '../../hooks/useAdminOrders';
import Pagination from '../../components/ui/Pagination';
import '@/styles/pages/admin/AdminStyles.css';
import '@/styles/pages/admin/AdminOrders.css';

const AdminOrders = () => {
  const {
    activeTab,
    setActiveTab,
    labelFilter,
    setLabelFilter,
    isLabelDropdownOpen,
    setIsLabelDropdownOpen,
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
    handleAcceptSingleOrder,
    page,
    setPage,
    totalPages
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

          <div className="admin-search-toolbar-filter">
            <Filter size={18} /> Filter :
          </div>
          {activeTab === 'READY_TO_SHIP' && (
            <div style={{ position: 'relative' }}>
              <Button variant="secondary" onClick={() => setIsLabelDropdownOpen(!isLabelDropdownOpen)} className="label-dropdown-button">
                Label downloaded {isLabelDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </Button>
              {isLabelDropdownOpen && (
                <>
                  <div onClick={() => setIsLabelDropdownOpen(false)} className="label-dropdown-overlay" />
                  <div className="glass-panel label-dropdown-menu">
                    <label className="label-dropdown-item">
                      <input type="radio" name="labelFilter" checked={labelFilter === 'YES'} onChange={() => { setLabelFilter('YES'); setIsLabelDropdownOpen(false); }} /> Yes
                    </label>
                    <label className="label-dropdown-item">
                      <input type="radio" name="labelFilter" checked={labelFilter === 'NO'} onChange={() => { setLabelFilter('NO'); setIsLabelDropdownOpen(false); }} /> No
                    </label>
                    <button onClick={() => { setLabelFilter(''); setIsLabelDropdownOpen(false); }} className="label-dropdown-clear">
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

        <Pagination 
          currentPage={page} 
          totalPages={totalPages} 
          onPageChange={setPage} 
        />

        {selectedOrders.length > 0 && (
          <div className="admin-bulk-actions">
            <span className="admin-bulk-actions-text">{selectedOrders.length} order(s) selected</span>
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
