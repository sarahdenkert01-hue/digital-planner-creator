import React from 'react';
import { useLicenseValidation } from '../../hooks/useLicenseValidation';

export default function LicenseCheck({ onUnlock }) {
  const {
    licenseInput,
    setLicenseInput,
    checkLicense,
    error
  } = useLicenseValidation();

  const handleSubmit = () => {
    if (checkLicense()) {
      onUnlock();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div style={{
      display:  'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: `linear-gradient(-45deg, #ffc0b0, #ffedb0, #beffb0, ##b0ffe2),`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '50px',
        borderRadius:  '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        textAlign: 'center',
        maxWidth: '450px',
        width: '90%',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.5)'
      }}>
       <img 
         src="/logo.svg" 
         alt="Logo" 
         style={{
           width:  '150px',
           height: 'auto',
           marginBottom: '20px'
      }}
      />

        <h1 style={{ 
          marginBottom: '10px', 
          fontSize: '28px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip:  'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold'
        }}>
          Therapist Planner Studio
        </h1>
        
        <p style={{ 
          color: '#666', 
          marginBottom: '30px', 
          fontSize: '14px',
          lineHeight: '1.6'
        }}>
          Welcome!  Enter your license key to start creating your custom planner.
        </p>
        
        <input
          type="text"
          placeholder="Enter License Key"
          value={licenseInput}
          onChange={(e) => setLicenseInput(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{
            width: '100%',
            padding: '15px',
            marginBottom: '15px',
            borderRadius: '10px',
            border: '2px solid #e0e0e0',
            fontSize: '16px',
            boxSizing: 'border-box',
            transition:  'border-color 0.3s',
            outline: 'none'
          }}
          onFocus={(e) => e.target.style.borderColor = '#667eea'}
          onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
        />
        
        {error && (
          <p style={{ 
            color: '#ff4d4f', 
            marginBottom: '15px', 
            fontSize: '13px',
            background: '#fff1f0',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #ffccc7'
          }}>
            ⚠️ {error}
          </p>
        )}
        
        <button
          onClick={handleSubmit}
          style={{
            width: '100%',
            padding: '15px',
            background: 'linear-gradient(135deg, #e0eff2 0%, ##abd3db 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'transform 0.2s, box-shadow 0.2s',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
          }}
          onMouseOver={(e) => {
            e.target.style. transform = 'translateY(-2px)';
            e.target.style. boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
          }}
          onMouseOut={(e) => {
            e.target. style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
          }}
        >
          🔓 Unlock Access
        </button>

        <p style={{ 
          fontSize:  '11px', 
          color: '#999', 
          marginTop: '20px',
          lineHeight: '1.5'
        }}>
          Need help? Contact support
        </p>
      </div>
    </div>
  );
}
