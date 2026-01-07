import React from 'react';
import { STYLES } from '../../constants';

export default function ExportProgress({ progress, onCancel }) {
  return (
    <div style={STYLES.overlayStyle}>
      <div style={STYLES.progressCard}>
        <h3>Processing {progress}%</h3>
        <div style={{
          width: '100%',
          height: '8px',
          background: '#e5e7eb',
          borderRadius: '4px',
          marginTop: '15px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            background: '#4f46e5',
            transition: 'width 0.3s ease'
          }} />
        </div>
        <button
          onClick={onCancel}
          style={{
            marginTop: '15px',
            padding: '8px 16px',
            background: '#ff4d4f',
            color: 'white',
            border: 'none',
            borderRadius:  '4px',
            cursor:  'pointer'
          }}
        >
          Cancel Export
        </button>
      </div>
    </div>
  );
}
