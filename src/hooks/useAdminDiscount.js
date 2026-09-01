import { useState, useMemo } from 'react';
import { useApplyDiscountMutation, useApplyCategoryDiscountMutation } from '../api/productApi';
import { useToast } from '../components/common/ToastProvider';

export const useAdminDiscount = (products) => {
  const { pushToast } = useToast();

  const [applyDiscount, { isLoading: isApplying }] = useApplyDiscountMutation();
  const [applyCategoryDiscount, { isLoading: isApplyingCategory }] = useApplyCategoryDiscountMutation();

  const [selectedProductIds, setSelectedProductIds] = useState(new Set());
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [categoryInputs, setCategoryInputs] = useState({});
  const [selectedCategories, setSelectedCategories] = useState(new Set());

  const categoryStats = useMemo(() => {
    const stats = {};
    if (products && products.length > 0) {
      products.forEach(p => {
        if (p.category) {
          if (!stats[p.category]) stats[p.category] = 0;
          stats[p.category]++;
        }
      });
    }
    return Object.entries(stats).map(([category, count]) => ({ category, count }));
  }, [products]);

  const handleCategoryInputChange = (category, field, value) => {
    setCategoryInputs(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProductIds(new Set(products.map(p => p.id)));
    } else {
      setSelectedProductIds(new Set());
    }
  };

  const handleSelectProduct = (id) => {
    const newSelected = new Set(selectedProductIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedProductIds(newSelected);
  };

  const handleApplyDiscount = async () => {
    const percentage = parseFloat(discountPercentage);
    if (isNaN(percentage) || percentage <= 0 || percentage > 100) {
      pushToast('Please enter a valid discount percentage (1-100).', 'error');
      return;
    }

    if (selectedCategories.size > 0) {
      try {
        await Promise.all(
          Array.from(selectedCategories).map(category =>
            applyCategoryDiscount({
              category: category,
              discountPercentage: percentage,
              startDate: startDate ? new Date(startDate).toISOString() : null,
              endDate: endDate ? new Date(endDate).toISOString() : null,
              isActive: isActive
            }).unwrap()
          )
        );
        pushToast(`Discount applied successfully to selected categories`, 'success');
        setDiscountPercentage('');
        setStartDate('');
        setEndDate('');
        setIsActive(true);
        setSelectedCategories(new Set());
      } catch (err) {
        console.error('Failed to apply category discounts:', err);
        pushToast('Failed to apply category discounts.', 'error');
      }
    } else {
      if (selectedProductIds.size === 0) {
        pushToast('Please select at least one product or a category.', 'error');
        return;
      }
      try {
        await applyDiscount({
          productIds: Array.from(selectedProductIds),
          discountPercentage: percentage,
          startDate: startDate ? new Date(startDate).toISOString() : null,
          endDate: endDate ? new Date(endDate).toISOString() : null,
          isActive: isActive
        }).unwrap();
        pushToast('Discount applied successfully!', 'success');
        setSelectedProductIds(new Set());
        setDiscountPercentage('');
        setStartDate('');
        setEndDate('');
        setIsActive(true);
      } catch (err) {
        console.error('Failed to apply discount:', err);
        pushToast('Failed to apply discount.', 'error');
      }
    }
  };

  const handleApplyCategoryDiscount = async (category) => {
    const inputs = categoryInputs[category] || {};
    const percentage = parseFloat(inputs.discountPercentage);
    if (isNaN(percentage) || percentage <= 0 || percentage > 100) {
      pushToast(`Please enter a valid discount percentage for ${category} (1-100).`, 'error');
      return;
    }

    try {
      await applyCategoryDiscount({
        category: category,
        discountPercentage: percentage,
        startDate: inputs.startDate ? new Date(inputs.startDate).toISOString() : null,
        endDate: inputs.endDate ? new Date(inputs.endDate).toISOString() : null,
        isActive: inputs.isActive !== undefined ? inputs.isActive : true
      }).unwrap();
      pushToast(`Discount applied successfully to category: ${category}`, 'success');
      setCategoryInputs(prev => ({
        ...prev,
        [category]: { discountPercentage: '', startDate: '', endDate: '', isActive: true }
      }));
    } catch (err) {
      console.error('Failed to apply category discount:', err);
      pushToast('Failed to apply category discount.', 'error');
    }
  };

  return {
    selectedProductIds,
    discountPercentage,
    setDiscountPercentage,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    isActive,
    setIsActive,
    selectedCategories,
    setSelectedCategories,
    categoryInputs,
    categoryStats,
    isApplying,
    isApplyingCategory,
    handleCategoryInputChange,
    handleSelectAll,
    handleSelectProduct,
    handleApplyDiscount,
    handleApplyCategoryDiscount
  };
};
