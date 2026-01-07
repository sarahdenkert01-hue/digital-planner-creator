import { useState, useCallback } from 'react';

export function useLicenseValidation(validKeys) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [licenseInput, setLicenseInput] = useState("");
  const [error, setError] = useState(null);

  const validateLicense = useCallback((key) => {
    const trimmedKey = key.trim().toUpperCase();
    return validKeys.includes(trimmedKey);
  }, [validKeys]);

  const checkLicense = useCallback(() => {
    if (validateLicense(licenseInput)) {
      setIsUnlocked(true);
      setError(null);
      return true;
    } else {
      setError("Invalid License Key.  Please check your Etsy order for the correct code!");
      return false;
    }
  }, [licenseInput, validateLicense]);

  return {
    isUnlocked,
    licenseInput,
    setLicenseInput,
    checkLicense,
    error
  };
}
