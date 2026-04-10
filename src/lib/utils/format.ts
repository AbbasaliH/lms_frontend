// Utility functions for formatting

export const formatCurrency = (amount: number | undefined | null): string => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(0);
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatNumber = (value: number | undefined | null): string => {
  if (value === undefined || value === null || isNaN(value)) {
    return '0';
  }
  return new Intl.NumberFormat('en-IN').format(value);
};

export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};

export const formatDateTime = (date: string | Date): string => {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

export const formatPhoneNumber = (phone: string): string => {
  // Format: +91-98765-43210
  if (phone.length === 10) {
    return `+91-${phone.slice(0, 5)}-${phone.slice(5)}`;
  }
  return phone;
};

export const formatPercentage = (value: number | undefined | null): string => {
  if (value === undefined || value === null || isNaN(value)) {
    return '0.0%';
  }
  return `${value.toFixed(1)}%`;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const capitalizeFirst = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const formatEnumValue = (value: string): string => {
  return value
    .split('_')
    .map((word) => capitalizeFirst(word))
    .join(' ');
};