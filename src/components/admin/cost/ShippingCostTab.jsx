import React, { useState } from 'react';
import { Plus, Search, Truck, Edit, Trash2 } from 'lucide-react';
import { useGetShippingCostsQuery, useDeleteShippingCostMutation } from '../../../api/costManagementApi';
import ShippingCostModal from './ShippingCostModal';
import { toast } from 'react-toastify';

const ShippingCostTab = () => {
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCost, setSelectedCost] = useState(null);

    const { data: costsData, isLoading } = useGetShippingCostsQuery({ page, size });
    const [deleteCost] = useDeleteShippingCostMutation();

    const handleOpenModal = (cost = null) => {
        setSelectedCost(cost);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedCost(null);
        setIsModalOpen(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this shipping cost?")) {
            try {
                await deleteCost(id).unwrap();
                toast.success("Shipping cost deleted successfully");
            } catch (error) {
                toast.error("Failed to delete shipping cost");
            }
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0);
    };

    return (
        <div className="daily-cost-tab">
            <div className="cost-header-actions" style={{ justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                    <Truck className="w-5 h-5 text-primary" />
                    Shipping Costs
                </h2>
                <button
                    onClick={() => handleOpenModal()}
                    className="cost-action-btn"
                >
                    <Plus size={18} />
                    Add Shipping Cost
                </button>
            </div>

            <div className="admin-table-container">
                {isLoading ? (
                    <div className="text-center py-8">Loading shipping costs...</div>
                ) : (
                    <>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Description / Courier</th>
                                    <th>Total Cost</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {costsData?.content?.length > 0 ? (
                                    costsData.content.map(cost => (
                                        <tr key={cost.id}>
                                            <td>{new Date(cost.costDate).toLocaleDateString()}</td>
                                            <td>{cost.description}</td>
                                            <td className="font-semibold text-primary">{formatCurrency(cost.amount)}</td>
                                            <td>
                                                <div style={{ justifyContent: 'flex-end' }}>
                                                    <button onClick={() => handleOpenModal(cost)} className="admin-icon-btn" title="Edit">
                                                        <Edit size={16} />
                                                    </button>
                                                    <button onClick={() => handleDelete(cost.id)} className="admin-icon-btn admin-icon-btn-danger" title="Delete">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-4 text-gray-500">No shipping costs found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {costsData?.totalPages > 1 && (
                            <div className="admin-pagination">
                                <button
                                    onClick={() => setPage(p => Math.max(0, p - 1))}
                                    disabled={page === 0}
                                    className="admin-pagination-btn"
                                >
                                    Previous
                                </button>
                                <span className="admin-pagination-info">
                                    Page {page + 1} of {costsData.totalPages}
                                </span>
                                <button
                                    onClick={() => setPage(p => p + 1)}
                                    disabled={page >= costsData.totalPages - 1}
                                    className="admin-pagination-btn"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {isModalOpen && (
                <ShippingCostModal
                    cost={selectedCost}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default ShippingCostTab;
