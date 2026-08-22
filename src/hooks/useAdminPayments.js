import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetSellerPaymentsQuery, useGetSellerPaymentStatsQuery } from '../api/paymentApi';

export const useAdminPayments = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [selectedYear, setSelectedYear] = useState(searchParams.get('year') || '');
  const [selectedMonth, setSelectedMonth] = useState(searchParams.get('month') || '');
  const [selectedDay, setSelectedDay] = useState(searchParams.get('day') || '');
  const size = 20;

  useEffect(() => {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', page);
    if (selectedYear) params.set('year', selectedYear);
    if (selectedMonth) params.set('month', selectedMonth);
    if (selectedDay) params.set('day', selectedDay);
    setSearchParams(params, { replace: true });
  }, [page, selectedYear, selectedMonth, selectedDay, setSearchParams]);

  const queryParams = {
    page: page - 1,
    size,
    ...(selectedYear && { year: parseInt(selectedYear) }),
    ...(selectedMonth && { month: parseInt(selectedMonth) }),
    ...(selectedDay && { day: parseInt(selectedDay) })
  };

  const { data, isLoading, isFetching } = useGetSellerPaymentsQuery(queryParams);
  const { data: statsData, isLoading: isLoadingStats } = useGetSellerPaymentStatsQuery(queryParams);

  const payments = data?.content || [];
  const totalPages = data?.totalPages || 1;

  let dayTitle = "Today's Payments";
  let monthTitle = "This Month";
  let yearTitle = "This Year";

  if (selectedYear) {
    yearTitle = `Year ${selectedYear}`;
    monthTitle = selectedMonth ? new Date(2000, selectedMonth - 1, 1).toLocaleString('default', { month: 'long' }) : 'Selected Year';
    dayTitle = selectedDay ? `${selectedDay} ${new Date(2000, selectedMonth - 1, 1).toLocaleString('default', { month: 'short' })}` : (selectedMonth ? 'Selected Month' : 'Selected Year');
  }

  return {
    page,
    setPage,
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    selectedDay,
    setSelectedDay,
    payments,
    totalPages,
    isLoading,
    isFetching,
    statsData,
    isLoadingStats,
    dayTitle,
    monthTitle,
    yearTitle
  };
};
