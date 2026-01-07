import React from 'react';

/**
 * SectionTitle - Reusable styled section title component
 */
export default function SectionTitle({ children }) {
  return (
    <div style={{
      fontSize: '14px',
      fontWeight: 'bold',
      marginTop: '20px',
      marginBottom: '10px',
      color: '#333',
      borderBottom: '2px solid #4f46e5',
      paddingBottom: '5px'
    }}>
      {children}
    </div>
  );
}
