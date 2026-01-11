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

// Month names
export const MONTH_NAMES = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

// Styles
export const STYLES = {
  actionBtn: {
    width: '100%',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    cursor: 'pointer',
    fontSize: '11px',
    background: '#fff'
  },
  smallBtn: {
    padding: '8px',
    fontSize: '11px',
    flex: 1,
    cursor: 'pointer',
    background: '#fff',
    border: '1px solid #ddd',
    borderRadius: '4px'
  },
  exportBtn: {
    padding: '14px',
    background: '#4f46e5',
    color:  'white',
    border:  'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    width: '100%',
    cursor: 'pointer',
    marginTop: '10px',
    fontSize: '12px'
  }
};

// Toggle button style function
export const toggleBtn = (isActive) => ({
  padding: '8px 16px',
  fontSize: '11px',
  cursor: 'pointer',
  background: isActive ?  '#4f46e5' :  '#fff',
  color: isActive ? '#fff' : '#333',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontWeight: isActive ? 'bold' : 'normal',
  flex: 1,
  transition: 'all 0.2s'
});
