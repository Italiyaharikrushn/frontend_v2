import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import DailyPurchaseModal from './DailyPurchaseModal';
import { useGetDailyCostsQuery, useDeleteDailyCostMutation } from '../../../api/costManagementApi';
import { toast } from 'react-toastify';
import Pagination from '../../common/Pagination';

const DailyPurchaseTab = () => {
    const [page, setPage] = useState(1);
    const [size] = useState(10);
    const { data: pageData, isLoading, refetch } = useGetDailyCostsQuery({ page: page - 1, size });
    const [deleteEntry] = useDeleteDailyCostMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState(null);

    const handleOpenModal = (entry = null) => {
        setSelectedEntry(entry);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedEntry(null);
        setIsModalOpen(false);
        refetch();
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this Daily Purchase?")) {
            try {
                await deleteEntry(id).unwrap();
                toast.success("Daily Purchase deleted successfully");
                refetch();
            } catch (error) {
                toast.error("Failed to delete daily purchase");
            }
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0);
    };

    const getPriceDisplay = (entry) => {
        if (entry.unit === 'Kg') return formatCurrency(entry.pricePerKg);
        if (entry.unit === 'Single Unit') return formatCurrency(entry.pricePerSingleUnit);
        if (entry.unit === 'Pair') return formatCurrency(entry.pricePerPair);
        return '-';
    };

    return (
        <div>
            <div className="cost-header-actions" style={{ justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h2 className="text-xl font-semibold">Daily Product Purchases</h2>
                <button
                    onClick={() => handleOpenModal()}
                    className="cost-action-btn"
                >
                    <Plus size={18} />
                    Add Daily Cost
                </button>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Product</th>
                            <th>Unit</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total Cost</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan="7" className="text-center py-4">Loading purchases...</td></tr>
                        ) : pageData?.content && pageData.content.length > 0 ? (
                            pageData.content.map((entry) => (
                                <tr key={entry.id}>
                                    <td>{new Date(entry.costDate).toLocaleDateString()}</td>
                                    <td className="font-medium">{entry.productName}</td>
                                    <td>{entry.unit}</td>
                                    <td>{getPriceDisplay(entry)}</td>
                                    <td>{entry.quantity} {entry.unit}</td>
                                    <td className="font-semibold text-primary">{formatCurrency(entry.totalCost)}</td>
                                    <td>
                                        <div className="admin-table-actions">
                                            <button onClick={() => handleOpenModal(entry)} className="admin-icon-btn" title="Edit">
                                                <Edit size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(entry.id)} className="admin-icon-btn admin-icon-btn-danger" title="Delete">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center py-4 text-gray-500">No daily purchases recorded yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {pageData?.totalPages > 1 && (
                <Pagination
                    currentPage={page}
                    totalPages={pageData.totalPages}
                    onPageChange={setPage}
                />
            )}

            {isModalOpen && (
                <DailyPurchaseModal entry={selectedEntry} onClose={handleCloseModal} />
            )}
        </div>
    );
};

export default DailyPurchaseTab;
