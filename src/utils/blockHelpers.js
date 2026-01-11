import { CANVAS_CONFIG } from '../constants';

const { WIDTH, HEIGHT } = CANVAS_CONFIG;

/**
 * Create a new block with the specified file name and size
 * @param {string} fileName - The image file name
 * @param {string} size - Block size:  "full", "half", "quarter", "1/8"
 * @returns {object} New block object
 */
export function createBlock(fileName, size = "full") {
  const id = Date.now().toString() + Math.random();
  const src = `/${fileName}`;
  
  // Base dimensions for different sizes
  const dimensions = {
  full: { width: 1167, height: 1800, x: 248, y: 150 },
  half: { width: 1167, height: 900, x: 253, y:  150 },
  quarter:  { width: 583, height: 900, x:  253, y: 150 },
  "1/8": { width: 583, height: 450, x: 253, y:  150 },
  
  // Headers from your original logic
  header: { width: 450, height: 100, x: 610, y: 100 },           // Month headers (janheader, etc) - centered
  weekheader: { width: 1167, height: 100, x: 253, y: 220 },      // Weekday strips (sunstartheader, monstartheader)
  
  // Cover - full canvas
  cover: { width: 1536, height: 2048, x: 0, y: 0 },
  
  // Calendar - matches your original month bundle logic
  calendar: { width: 1167, height: 1000, x: 253, y:  330 }        // Calendar positioned at GRID_CONFIG position
};
  const { width, height, x, y } = dimensions[size] || dimensions.full;
  
  return {
    id,
    src,
    x,
    y,
    width,
    height,
    locked: false
  };
}

/**
 * Calculate hash for blocks to detect changes
 * @param {Array} blocks - Array of block objects
 * @returns {string} Hash string
 */
export function calculateBlockHash(blocks) {
  if (!blocks || blocks.length === 0) return 'empty';
  
  return blocks
    .map(b => `${b.id}-${b.x}-${b. y}-${b.width}-${b.height}-${b.locked}`)
    .join('|');
}
