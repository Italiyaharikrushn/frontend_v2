/**
 * Centralized Date Utility for the Frontend
 */

export const getCurrentDate = () => {
    return new Date();
};

export const getCurrentYear = () => {
    return new Date().getFullYear();
};

export const getCurrentMonth = () => {
    // Returns 1-12
    return new Date().getMonth() + 1;
};

export const getCurrentDay = () => {
    return new Date().getDate();
};

export const formatToISODate = (date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
};

export const getPreviousMonth = (currentMonth, currentYear) => {
    if (currentMonth === 1) {
        return { month: 12, year: currentYear - 1 };
    }
    return { month: currentMonth - 1, year: currentYear };
};

export const getStartOfDay = (date) => {
    if (!date) return null;
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
};
