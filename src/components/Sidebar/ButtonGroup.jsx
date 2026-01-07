import React from 'react';
import LibraryBtn from './LibraryBtn';

/**
 * ButtonGroup - Factory component for rendering groups of library buttons
 * Handles both grid and list layouts
 */
export default function ButtonGroup({ items, onClick, layout = 'grid' }) {
  if (!items || items.length === 0) {
    return null;
  }

  const containerStyle = layout === 'grid' 
    ? {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '8px',
        marginBottom: '15px'
      }
    : {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        marginBottom: '15px'
      };

  return (
    <div style={containerStyle}>
      {items.map(item => (
        <LibraryBtn
          key={item.id}
          label={item.label}
          onClick={() => onClick(item.id)}
        />
      ))}
    </div>
  );
}
