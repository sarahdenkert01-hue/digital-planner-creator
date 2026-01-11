import { useState } from 'react';

export function useLicenseValidation() {
  const [licenseInput, setLicenseInput] = useState('');
  const [error, setError] = useState(null);

  const checkLicense = () => {
    console.log('🚀 checkLicense function called');
    
    const trimmedKey = licenseInput.trim().toUpperCase();
    console.log('🔑 Trimmed key:', trimmedKey);
    
    // Temporary bypass for testing
    if (trimmedKey === 'TEST123') {
      console.log('✅ Using test bypass key');
      setError(null);
      return true;
    }
    
    // Get and parse environment variable inside the function
    const rawKeys = import.meta.env.VITE_LICENSE_KEYS;
    console.log('🔑 Raw keys from env:', rawKeys);
    console.log('🔑 Type:', typeof rawKeys);
    
    // Build valid keys array with defensive checks
    let validKeys = [];
    
    try {
      if (rawKeys !== undefined && rawKeys !== null && typeof rawKeys === 'string') {
        if (rawKeys.length > 0) {
          validKeys = rawKeys
            .split(',')
            .map(k => k.trim().toUpperCase())
            .filter(k => k.length > 0);
        }
      }
    } catch (err) {
      console.error('❌ Error parsing keys:', err);
    }
    
    console.log('🔑 Valid keys array:', validKeys);
    console.log('🔑 Array length:', validKeys.length);
    console.log('🔑 Is array? ', Array.isArray(validKeys));
    
    // Check if we have any valid keys
    if (! Array.isArray(validKeys) || validKeys.length === 0) {
      console.warn('⚠️ No valid license keys configured');
      setError('License validation not configured.  Using bypass key "TEST123" for now.');
      return false;
    }
    
    // Check if the entered key is valid
    const isValid = validKeys.includes(trimmedKey);
    console.log('🔍 Is valid? ', isValid);
    
    if (isValid) {
      console.log('✅ License valid! ');
      setError(null);
      return true;
    } else {
      console.log('❌ License invalid');
      setError('Invalid license key. Please try again or use TEST123 for testing.');
      return false;
    }
  };

  return {
    licenseInput,
    setLicenseInput,
    checkLicense,
    error
  };
}
