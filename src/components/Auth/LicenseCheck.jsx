import React, { useState } from 'react';

const rawKeys = import.meta.env.VITE_LICENSE_KEYS || "";
const VALID_KEYS = rawKeys.split(",").map(k => k.trim().toUpperCase());

export default function LicenseCheck({ onUnlock }) {
  const [licenseInput, setLicenseInput] = useState("");

  const checkLicense = () => {
    if (VALID_KEYS.includes(licenseInput.trim().toUpperCase())) {
      onUnlock();
    } else {
      alert("Invalid License Key.  Please check your Etsy order for the correct code!");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      checkLicense();
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: '#f0f2f5',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '15px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '400px'
      }}>
        <h1 style={{ marginBottom: '20px', color: '#333' }}>Therapist Planner Studio</h1>
        <p style={{ marginBottom: '20px', color: '#666', fontSize: '14px' }}>
          Enter your license key to unlock the planner builder
        </p>
        <input
          type="text"
          placeholder="License Key"
          value={licenseInput}
          onChange={(e) => setLicenseInput(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '15px',
            borderRadius: '8px',
            border: '2px solid #ddd',
            fontSize: '14px'
          }}
        />
        <button
          onClick={checkLicense}
          style={{
            width: '100%',
            padding: '12px',
            background: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          Unlock Access
        </button>
      </div>
    </div>
  );
}
