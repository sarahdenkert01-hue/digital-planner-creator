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
    full: { width: 1167, height: 1800, x: 225, y: 125 },
    half: { width: 1167, height: 900, x: 225, y:  125 },
    quarter:  { width: 583, height: 900, x:  225, y: 125 },
    "1/8": { width: 583, height: 450, x: 225, y:  125 },
    header: { width: 1167, height: 250, x: 225, y:  125 },
    cover: { width: 1620, height: 2160, x: 0, y:  0 },
    weekheader: { width: 1085, height: 120, x: 254, y:  600 },
    calendar: { width: 1085, height: 750, x: 254, y: 740 }
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
