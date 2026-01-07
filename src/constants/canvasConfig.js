// Canvas configuration for digital planner
export const CANVAS_CONFIG = {
  WIDTH: 1620,
  HEIGHT: 2160,
  VIEW_SCALE: 0.35,
  GRID_ENABLED: true,
  GRID_SIZE: 20,
  SNAP_TO_GRID: false
};

// Block size presets
export const BLOCK_SIZES = {
  FULL: { width: 1620, height: 2160 },
  HALF: { width: 1620, height: 1080 },
  QUARTER: { width: 810, height: 1080 },
  EIGHTH: { width: 810, height: 540 }
};

// Page types
export const PAGE_TYPES = {
  MONTH: 'MONTH',
  DAY: 'DAY',
  NONE: 'NONE'
};

// Default page configuration
export const DEFAULT_PAGE = {
  id: 'p1',
  name: 'Planner Start',
  section: 'JAN',
  type: 'NONE',
  blocks: [],
  bg: 'backgroundwithtabs.png'
};

// Month tab link configuration for PDF interactivity
export const TAB_CONFIG = {
  startX: 1520,
  startY: 180,
  width: 100,
  height: 180
};

// Calendar grid link configuration for clickable dates
export const GRID_CONFIG = {
  startX: 60,
  startY: 700,
  cellWidth: 220,
  cellHeight: 180,
  rows: 6,
  cols: 7
};

// PDF export configuration
export const PDF_EXPORT_CONFIG = {
  pixelRatio: 2,
  mimeType: 'image/jpeg',
  quality: 0.92,
  compression: 'FAST'
};
