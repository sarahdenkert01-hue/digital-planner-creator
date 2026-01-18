// Canvas configuration
export const CANVAS_CONFIG = {
  WIDTH:  1536,
  HEIGHT:  2048,
  VIEW_SCALE: 0.35,
};

export const GRID_CONFIG = {
  cellWidth:  168,
  cellHeight:  200,
  startX:  253,
  startY:  330,
  rows: 6,
  cols: 7,
};

export const TAB_CONFIG = {
  height:  125,
  width: 59,
  startX: 1477,
  startY:  166,
};

// Re-export library items from separate file
export { LIBRARY_ITEMS } from './libraryItems';

// Month names and offsets
export const MONTH_NAMES = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
export { MONTH_OFFSETS } from './months';

// Button and component styles
export const STYLES = {
  actionBtn: {
    width: '100%',
    padding: '12px',  // Increased from 8px for better touch targets
    borderRadius:  '4px',
    border:  '1px solid #ddd',
    cursor: 'pointer',
    fontSize: '11px',
    background: '#fff',
    minHeight: '44px'  // iOS recommended touch target
  },
  smallBtn: {
    padding: '12px',  // Increased from 8px for better touch targets
    fontSize: '11px',
    flex: 1,
    cursor: 'pointer',
    background: '#fff',
    border: '1px solid #ddd',
    borderRadius: '4px',
    minHeight: '44px',  // Ensure minimum 44px touch target
    minWidth: '44px'
  },
  exportBtn: {
    padding:  '14px',
    background:  '#ffc8b0',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight:  'bold',
    width:  '100%',
    cursor:  'pointer',
    marginTop: '10px',
    fontSize: '12px',
    minHeight: '44px'  // Touch-friendly
  }
};

// Style functions
export const toggleBtn = (isActive) => ({
  padding: '12px 16px',  // Increased from 8px for better touch targets
  fontSize: '11px',
  cursor: 'pointer',
  background: isActive ? '#ffc8b0' : '#fff',
  color: isActive ? '#fff' :  '#333',
  border: '1px solid #fae2d7',
  borderRadius: '4px',
  fontWeight:  isActive ? 'bold' :  'normal',
  flex:  1,
  transition: 'all 0.2s',
  minHeight: '44px'
});

export const moveBtn = {
  background: 'none',
  border: 'none',
  fontSize: '9px',
  cursor: 'pointer',
  opacity: 0.5,
  padding: '0 5px',
  transition:  'opacity 0.2s'
};

export const pageBtn = (active) => ({
  width: '100%',
  padding: '8px',
  textAlign: 'left',
  background: active ? '#fae2d7' :  'transparent',
  color: active ? '#000000' : '#666666',  // Black for active, gray for inactive
  border: 'none',
  fontSize: '11px',
  cursor: 'pointer',
  transition: 'all 0.2s',
  minHeight: '44px'
});
