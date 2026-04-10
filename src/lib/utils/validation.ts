// Validation utilities

export const validateGSTIN = (gstin: string): boolean => {
  const gstinRegex = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/;
  return gstinRegex.test(gstin);
};

export const validatePAN = (pan: string): boolean => {
  const panRegex = /^[A-Z]{5}\d{4}[A-Z]{1}$/;
  return panRegex.test(pan);
};

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePostalCode = (postalCode: string): boolean => {
  const postalCodeRegex = /^\d{6}$/;
  return postalCodeRegex.test(postalCode);
};

export const validateIFSC = (ifsc: string): boolean => {
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return ifscRegex.test(ifsc);
};