// Price, currency, and date formatting utilities
import { COUNTRIES } from './countries';
import i18n from '../i18n';

export const formatCurrency = (amount, currency = 'USD') => {
  if (typeof amount !== 'number') {
    amount = parseFloat(amount) || 0;
  }
  const locale = i18n.language || navigator.language || 'en-US';
  return new Intl.NumberFormat(locale, {
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
  
  const locale = i18n.language || navigator.language || 'en-US';
  return new Intl.DateTimeFormat(locale, defaultOptions).format(date);
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
