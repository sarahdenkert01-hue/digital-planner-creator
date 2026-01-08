import { calculateBlockHash } from './blockHelpers';

/**
 * Render cache for storing rendered page images
 */
class RenderCache {
  constructor(maxSize = 50) {
    this.cache = new Map();
    this.blockHashes = new Map();
    this.maxSize = maxSize;
  }

  /**
   * Get cached render if available and blocks haven't changed
   * @param {string} pageId - Page identifier
   * @param {Array} blocks - Current blocks array
   * @returns {string|null} Cached data URL or null
   */
  get(pageId, blocks) {
    const currentHash = calculateBlockHash(blocks);
    const cachedHash = this.blockHashes.get(pageId);
    
    if (cachedHash !== currentHash) {
      this.invalidate(pageId);
      return null;
    }
    
    return this.cache.get(pageId) || null;
  }

  /**
   * Set cached render
   * @param {string} pageId - Page identifier
   * @param {string} dataUrl - Rendered data URL
   * @param {Array} blocks - Current blocks array
   */
  set(pageId, dataUrl, blocks) {
    // Implement LRU-style eviction
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
      this.blockHashes.delete(firstKey);
    }
    
    this.cache.set(pageId, dataUrl);
    this.blockHashes.set(pageId, calculateBlockHash(blocks));
  }

  /**
   * Invalidate cached render for a page
   * @param {string} pageId - Page identifier
   */
  invalidate(pageId) {
    this.cache.delete(pageId);
    this.blockHashes. delete(pageId);
  }

  /**
   * Clear entire cache
   */
  clear() {
    this.cache.clear();
    this.blockHashes. clear();
  }

  /**
   * Get cache statistics
   * @returns {object} Cache stats
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: this._hitRate || 0
    };
  }
}

export const renderCache = new RenderCache();
