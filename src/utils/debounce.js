/**
 * Create a debounced callback function
 * @param {Function} callback - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function createDebounceCallback(callback, delay = 300) {
  let timeoutId = null;
  
  return function debounced(...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      callback. apply(this, args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * Create a throttled callback function
 * @param {Function} callback - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export function createThrottleCallback(callback, limit = 100) {
  let inThrottle = false;
  
  return function throttled(...args) {
    if (!inThrottle) {
      callback.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}
