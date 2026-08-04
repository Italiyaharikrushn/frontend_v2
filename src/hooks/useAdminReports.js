export const useAdminReports = () => {
    // Static data for now, could be fetched from API later
    const salesData = [
        { month: 'Jan', offline: 4000, online: 2400 },
        { month: 'Feb', offline: 3000, online: 1398 },
        { month: 'Mar', offline: 2000, online: 9800 },
        { month: 'Apr', offline: 2780, online: 3908 },
        { month: 'May', offline: 1890, online: 4800 },
        { month: 'Jun', offline: 2390, online: 3800 },
    ];

    return {
        salesData
    };
};
