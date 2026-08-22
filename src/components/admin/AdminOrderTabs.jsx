import React from 'react';

const TABS = [
  { id: 'PENDING', label: 'Pending Orders' },
  { id: 'READY_TO_SHIP', label: 'Ready to Ship' },
  { id: 'SHIPPED', label: 'Shipped' },
  { id: 'DELIVERED', label: 'Delivered' },
  { id: 'CANCELLED', label: 'Cancelled' }
];

const AdminOrderTabs = ({ activeTab, setActiveTab, setSelectedOrders, tabCounts }) => {
  return (
    <div className="admin-tabs">
      {TABS.map(tab => (
        <button
          key={tab.id}
          className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => { setActiveTab(tab.id); setSelectedOrders([]); }}
        >
          {tab.label}  {tabCounts && tabCounts[tab.id] !== undefined ? `(${tabCounts[tab.id]})` : ''}
        </button>
      ))}
    </div>
  );
};

export default AdminOrderTabs;


