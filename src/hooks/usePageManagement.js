import { useState, useCallback } from 'react';
import { updatePageBlocks, updatePageName } from '../utils/pageHelpers';

export function usePageManagement(initialPages = []) {
  const [pages, setPages] = useState(initialPages);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const addPage = useCallback((page) => {
    setPages(prev => [...prev, page]);
    setCurrentPageIndex(pages.length);
  }, [pages.length]);

  const updateBlocks = useCallback((pageIndex, newBlocks) => {
    setPages(prev => updatePageBlocks(prev, pageIndex, newBlocks));
  }, []);

  const renamePage = useCallback((pageIndex, newName) => {
    setPages(prev => updatePageName(prev, pageIndex, newName));
  }, []);

  const duplicatePage = useCallback((pageIndex) => {
    const pageToDuplicate = pages[pageIndex];
    const newPage = {
      ...JSON.parse(JSON.stringify(pageToDuplicate)),
      id: Date.now().toString() + Math.random(),
      name: `${pageToDuplicate.name} (Copy)`
    };
    addPage(newPage);
  }, [pages, addPage]);

  const movePage = useCallback((fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= pages.length) return;

    setPages(prev => {
      const newPages = [...prev];
      [newPages[fromIndex], newPages[toIndex]] = [newPages[toIndex], newPages[fromIndex]];
      return newPages;
    });
    setCurrentPageIndex(toIndex);
  }, [pages.length]);

  return {
    pages,
    currentPageIndex,
    setCurrentPageIndex,
    addPage,
    updateBlocks,
    renamePage,
    duplicatePage,
    movePage
  };
}
