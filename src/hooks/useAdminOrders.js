import { useState } from 'react';
import { useGetSellerOrdersQuery, useUpdateOrderStatusMutation } from '../api/orderApi';
import { useGetPublicStoreSettingsQuery } from '../api/settingsApi';
import { useToast } from './useToast';
import { generatePdfLabels } from '../utils/pdfGenerator';

export const useAdminOrders = () => {
  const { pushToast } = useToast();
  const [activeTab, setActiveTab] = useState('PENDING');
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [downloadedLabels, setDownloadedLabels] = useState(() => {
    const saved = localStorage.getItem('downloadedLabels');
    return saved ? JSON.parse(saved) : [];
  });
  const { data: orders = [], isLoading } = useGetSellerOrdersQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const { data: storeSettings } = useGetPublicStoreSettingsQuery();

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
    generatePdfLabels(selectedOrders, orders, storeSettings);
    
    const updatedDownloaded = [...new Set([...downloadedLabels, ...selectedOrders])];
    setDownloadedLabels(updatedDownloaded);
    localStorage.setItem('downloadedLabels', JSON.stringify(updatedDownloaded));

    setSelectedOrders([]);
  };

  const handleDownloadSingleLabel = (order) => {
    generatePdfLabels([order.id], orders, storeSettings);

    const updatedDownloaded = [...new Set([...downloadedLabels, order.id])];
    setDownloadedLabels(updatedDownloaded);
    localStorage.setItem('downloadedLabels', JSON.stringify(updatedDownloaded));
  };

  const handleAcceptOrders = async () => {
    if (selectedOrders.length === 0) return;

    try {
      await Promise.all(selectedOrders.map(id => updateOrderStatus({ id, status: 'READY_TO_SHIP' }).unwrap()));
      
      const updatedDownloaded = downloadedLabels.filter(id => !selectedOrders.includes(id));
      setDownloadedLabels(updatedDownloaded);
      localStorage.setItem('downloadedLabels', JSON.stringify(updatedDownloaded));

      setSelectedOrders([]);
      pushToast('Selected orders have been accepted.', 'success');
    } catch (err) {
      console.error('Failed to accept orders: ', err);
      pushToast('Error accepting some orders', 'error');
    }
  };

  const handleAcceptSingleOrder = async (orderId) => {
    try {
      await updateOrderStatus({ id: orderId, status: 'READY_TO_SHIP' }).unwrap();
      
      const updatedDownloaded = downloadedLabels.filter(id => id !== orderId);
      setDownloadedLabels(updatedDownloaded);
      localStorage.setItem('downloadedLabels', JSON.stringify(updatedDownloaded));

      pushToast('Order accepted.', 'success');
    } catch (err) {
      console.error('Failed to accept order: ', err);
      pushToast('Error accepting order', 'error');
    }
  };

  return {
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
  };
};
