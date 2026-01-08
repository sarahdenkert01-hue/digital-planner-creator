import { TAB_CONFIG, GRID_CONFIG, MONTH_NAMES, MONTH_OFFSETS } from '../constants';
import { findMonthPageIndices, findDayPagesForMonth } from './pageHelpers';

export const PDF_EXPORT_CONFIG = {
  pixelRatio: 2,
  mimeType: 'image/jpeg',
  quality: 0.92,
  compression: 'FAST'
};

// Month page cache
const monthPageCache = {};

/**
 * Clear month page cache
 */
export function clearMonthCache() {
  Object.keys(monthPageCache).forEach(key => delete monthPageCache[key]);
}

/**
 * Get month name from page
 * @param {object} page - Page object
 * @returns {string|null} Month name or null
 */
export function getMonthNameFromPage(page) {
  const monthMatch = page.name.match(/(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)/i);
  return monthMatch ? monthMatch[0]. toUpperCase() : null;
}

/**
 * Add month tab links to PDF
 * @param {object} pdf - jsPDF instance
 * @param {Array} pages - All pages
 * @param {number} currentIndex - Current page index
 */
export function addMonthTabLinks(pdf, pages, currentIndex) {
  const { startX, startY, width, height } = TAB_CONFIG;
  
  if (! monthPageCache. indices) {
    monthPageCache. indices = findMonthPageIndices(pages);
  }
  
  MONTH_NAMES.forEach((month, idx) => {
    const targetPageIndex = monthPageCache.indices[month. toUpperCase()];
    if (targetPageIndex !== undefined && targetPageIndex !== currentIndex) {
      const y = startY + (idx * height);
      pdf.link(startX, y, width, height, { pageNumber: targetPageIndex + 1 });
    }
  });
}

/**
 * Add calendar grid links to PDF
 * @param {object} pdf - jsPDF instance
 * @param {Array} pages - All pages
 * @param {number} currentIndex - Current page index
 * @param {string} startDay - "sunday" or "monday"
 * @param {string} monthName - Month name (e.g., "JAN")
 */
export function addCalendarGridLinks(pdf, pages, currentIndex, startDay, monthName) {
  const { startX, startY, cellWidth, cellHeight, rows, cols } = GRID_CONFIG;
  const monthOffset = MONTH_OFFSETS[monthName.toLowerCase()];
  
  if (monthOffset === undefined) return;
  
  const cacheKey = `${monthName}-${startDay}`;
  if (! monthPageCache[cacheKey]) {
    monthPageCache[cacheKey] = findDayPagesForMonth(pages, monthName);
  }
  
  const dayPages = monthPageCache[cacheKey];
  if (dayPages.length === 0) return;
  
  // Calendar generation logic
  const year = 2026;
  const firstDay = new Date(year, monthOffset, 1).getDay();
  const daysInMonth = new Date(year, monthOffset + 1, 0).getDate();
  const offset = startDay === "monday" ? (firstDay === 0 ? 6 : firstDay - 1) : firstDay;
  
  for (let day = 1; day <= daysInMonth; day++) {
    const cellIndex = offset + day - 1;
    const row = Math.floor(cellIndex / cols);
    const col = cellIndex % cols;
    
    if (row >= rows) break;
    
    const targetPageIndex = dayPages[day - 1];
    if (targetPageIndex !== undefined && targetPageIndex !== currentIndex) {
      const x = startX + (col * cellWidth);
      const y = startY + (row * cellHeight);
      pdf.link(x, y, cellWidth, cellHeight, { pageNumber: targetPageIndex + 1 });
    }
  }
}

/**
 * Create optimized export flow with generator-based rendering
 * @param {number} totalPages - Total number of pages
 * @returns {object} Export flow controller
 */
export function createOptimizedExportFlow(totalPages) {
  return {
    async *renderPages(renderFn, progressFn, cancelCheckFn) {
      for (let i = 0; i < totalPages; i++) {
        if (cancelCheckFn()) break;
        
        const dataUrl = await renderFn(i);
        progressFn(Math.round(((i + 1) / totalPages) * 100));
        
        yield { dataUrl, index: i };
      }
    }
  };
}
