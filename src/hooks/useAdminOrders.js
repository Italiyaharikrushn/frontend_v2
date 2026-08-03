import { useState } from 'react';
import { useGetSellerOrdersQuery, useUpdateOrderStatusMutation, useMarkLabelsDownloadedMutation } from '../api/orderApi';
import { useGetPublicStoreSettingsQuery } from '../api/settingsApi';
import { useToast } from './useToast';
import { generatePdfLabels } from '../utils/pdfGenerator';

export const useAdminOrders = () => {
  const { pushToast } = useToast();
  const [activeTab, setActiveTab] = useState('PENDING');
  const [labelFilter, setLabelFilter] = useState('');

  const [selectedOrders, setSelectedOrders] = useState([]);
  const [page, setPage] = useState(0);
  const size = 10;
  
  const { data = {}, isLoading } = useGetSellerOrdersQuery({ page, size, status: activeTab });
  const orders = data.content || [];
  const totalPages = data.totalPages || 0;
  
  const downloadedLabels = orders.filter(o => o.labelDownloaded).map(o => o.id);

  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [markLabelsDownloaded] = useMarkLabelsDownloadedMutation();
  const { data: storeSettings } = useGetPublicStoreSettingsQuery();

  const filteredOrders = orders.filter(order => {
    if (labelFilter === 'YES') {
      if (!downloadedLabels.includes(order.id)) return false;
    }
    if (labelFilter === 'NO') {
      if (downloadedLabels.includes(order.id)) return false;
    }

    return true;
  });

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

  const handleDownloadLabels = async () => {
    generatePdfLabels(selectedOrders, orders, storeSettings);
    
    try {
      await markLabelsDownloaded(selectedOrders).unwrap();
    } catch (err) {
      console.error('Failed to mark labels as downloaded:', err);
    }

    setSelectedOrders([]);
  };

  const handleDownloadSingleLabel = async (order) => {
    generatePdfLabels([order.id], orders, storeSettings);

    try {
      await markLabelsDownloaded([order.id]).unwrap();
    } catch (err) {
      console.error('Failed to mark label as downloaded:', err);
    }
  };

  const handleAcceptOrders = async () => {
    if (selectedOrders.length === 0) return;

    try {
      await Promise.all(selectedOrders.map(id => updateOrderStatus({ id, status: 'READY_TO_SHIP' }).unwrap()));
      
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
      
      pushToast('Order accepted.', 'success');
    } catch (err) {
      console.error('Failed to accept order: ', err);
      pushToast('Error accepting order', 'error');
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(0);
    setSelectedOrders([]);
  };

  return {
    activeTab,
    setActiveTab: handleTabChange,
    labelFilter,
    setLabelFilter,
    selectedOrders,
    setSelectedOrders,
    downloadedLabels,
    isLoading,
    filteredOrders,
    page,
    setPage,
    totalPages,
    handleSelectAll,
    handleSelectOrder,
    handleDownloadLabels,
    handleDownloadSingleLabel,
    handleAcceptOrders,
    handleAcceptSingleOrder
  };
};
