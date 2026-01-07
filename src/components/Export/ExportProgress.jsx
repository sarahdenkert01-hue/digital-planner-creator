import React from 'react';
import { STYLES } from '../../constants';

/**
 * ExportProgress - Progress overlay with cancel functionality
 * Shows during PDF export operations
 */
export default function ExportProgress({ progress, onCancel }) {
  if (progress === null) {
    return null;
  }

  return (
    <div style={STYLES.overlayStyle}>
      <div style={STYLES.progressCard}>
        <h3 style={{ marginBottom: '20px', fontSize: '18px', color: '#333' }}>
          Exporting PDF...
        </h3>
        <div style={{
          width: '100%',
          height: '20px',
          background: '#e2e8f0',
          borderRadius: '10px',
          overflow: 'hidden',
          marginBottom: '15px'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            background: '#4f46e5',
            transition: 'width 0.3s ease'
          }} />
        </div>
        <p style={{ marginBottom: '20px', color: '#666', fontSize: '14px' }}>
          {Math.round(progress)}% Complete
        </p>
        <button
          onClick={onCancel}
          style={{
            ...STYLES.actionBtn,
            background: '#ef4444'
          }}
        >
          Cancel Export
        </button>
      </div>
    </div>
  );
}
