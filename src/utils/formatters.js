// Price, currency, and date formatting utilities
import { COUNTRIES } from './countries';

export const formatCurrency = (amount, currency = 'USD') => {
  if (typeof amount !== 'number') {
    amount = parseFloat(amount) || 0;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatDate = (dateString, options = {}) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  };
  
  return new Intl.DateTimeFormat('en-US', defaultOptions).format(date);
};

export const formatPhoneNumber = (phone) => {
  if (!phone) return phone;
  const sortedCountries = [...COUNTRIES].sort((a, b) => b.code.length - a.code.length);
  const code = sortedCountries.find(c => phone.startsWith(c.code))?.code;
  if (code) {
    const number = phone.replace(code, '').trim();
    return `${code} ${number}`;
  }
  return phone;
};
