import { useState, useEffect } from 'react';
import { CANVAS_CONFIG } from '../constants';

// Layout constants
const SIDEBAR_WIDTH = 320;
const DESKTOP_PADDING = 80;
const MOBILE_PADDING = 40;
const TABLET_PADDING = 80;

export function useResponsive() {
  const [viewScale, setViewScale] = useState(0.35);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const updateScale = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Breakpoints
      const mobile = width < 768;
      const tablet = width >= 768 && width < 1024;
      
      setIsMobile(mobile);
      setIsTablet(tablet);
      
      // Calculate scale based on available space
      let availableWidth = width;
      
      if (mobile) {
        // Full width on mobile, stack sidebars
        availableWidth = width - MOBILE_PADDING;
      } else if (tablet) {
        // Reduce sidebar impact on tablets
        availableWidth = width - SIDEBAR_WIDTH - TABLET_PADDING;
      } else {
        // Desktop: account for both sidebars
        availableWidth = width - (SIDEBAR_WIDTH * 2) - DESKTOP_PADDING;
      }
      
      // Calculate scale to fit canvas
      const scaleByWidth = availableWidth / CANVAS_CONFIG.WIDTH;
      const scaleByHeight = (height - 100) / CANVAS_CONFIG.HEIGHT;
      
      // Use smaller scale to ensure it fits
      const newScale = Math.min(scaleByWidth, scaleByHeight, 0.5); // max 0.5
      setViewScale(Math.max(newScale, 0.2)); // min 0.2
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return { viewScale, isMobile, isTablet };
}
