/**
 * Update blocks for a specific page
 * @param {Array} pages - All pages
 * @param {number} pageIndex - Index of page to update
 * @param {Array} newBlocks - New blocks array
 * @returns {Array} Updated pages array
 */
export function updatePageBlocks(pages, pageIndex, newBlocks) {
  const updated = [...pages];
  updated[pageIndex] = { ...updated[pageIndex], blocks: newBlocks };
  return updated;
}

/**
 * Update name for a specific page
 * @param {Array} pages - All pages
 * @param {number} pageIndex - Index of page to update
 * @param {string} newName - New page name
 * @returns {Array} Updated pages array
 */
export function updatePageName(pages, pageIndex, newName) {
  const updated = [...pages];
  updated[pageIndex] = { ...updated[pageIndex], name: newName };
  return updated;
}

/**
 * Find all month page indices
 * @param {Array} pages - All pages
 * @returns {Object} Map of month names to page indices
 */
export function findMonthPageIndices(pages) {
  const monthPages = {};
  
  pages. forEach((page, index) => {
    if (page.type === "MONTH" || page.name.toUpperCase().includes("OVERVIEW")) {
      const monthMatch = page.name.match(/(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)/i);
      if (monthMatch) {
        monthPages[monthMatch[0].toUpperCase()] = index;
      }
    }
  });
  
  return monthPages;
}

/**
 * Find all day pages for a specific month
 * @param {Array} pages - All pages
 * @param {string} monthSection - Month section (e.g., "JAN")
 * @returns {Array} Array of page indices
 */
export function findDayPagesForMonth(pages, monthSection) {
  return pages
    .map((page, index) => ({ page, index }))
    .filter(({ page }) => page.type === "DAY" && page.section === monthSection)
    .map(({ index }) => index);
}
