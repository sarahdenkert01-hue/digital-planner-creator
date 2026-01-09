import { useState } from 'react';

export function usePageManagement() {
  const [pages, setPages] = useState([
    {
      id: 'p1',
      name: 'Planner Start',
      section: 'NONE',
      type: 'NONE',
      blocks: [],
      bg: 'backgroundwithtabs. png'
    }
  ]);
  
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const addBlankPage = () => {
    const newPage = {
      id: Date.now().toString() + Math.random(),
      name: 'New Page',
      section: 'NONE',
      type: 'NONE',
      blocks:  [],
      bg: 'backgroundwithtabs.png'
    };
    setPages(prev => [...prev, newPage]);
    setCurrentPageIndex(pages.length);
  };

  const duplicatePage = () => {
    const currentPage = pages[currentPageIndex];
    const newPage = JSON.parse(JSON.stringify(currentPage));
    newPage.id = Date.now().toString() + Math.random();
    newPage.name = currentPage.name + ' (Copy)';
    setPages(prev => [...prev, newPage]);
    setCurrentPageIndex(pages.length);
  };

  const clearPage = () => {
    if (! window.confirm('Clear all blocks from this page?')) return;
    
    setPages(prev => {
      const updated = [...prev];
      updated[currentPageIndex] = {
        ...updated[currentPageIndex],
        blocks: updated[currentPageIndex].blocks.filter(b => b.locked)
      };
      return updated;
    });
  };

  const renamePage = (index) => {
    const newName = window.prompt('Enter new page name:', pages[index].name);
    if (newName && newName. trim() !== '') {
      setPages(prev => {
        const updated = [...prev];
        updated[index] = { ...updated[index], name: newName. trim() };
        return updated;
      });
    }
  };

  const movePage = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= pages.length) return;
    
    const currentP = pages[index];
    const targetP = pages[targetIndex];
    
    // Prevent moving daily pages out of their month
    if (currentP.type === 'DAY' || targetP.type === 'DAY') {
      if (currentP.section !== targetP.section) {
        alert('Daily pages must stay within their month bundle.');
        return;
      }
    }
    
    setPages(prev => {
      const updated = [...prev];
      [updated[index], updated[targetIndex]] = [updated[targetIndex], updated[index]];
      return updated;
    });
    setCurrentPageIndex(targetIndex);
  };

  const changeBackground = (bgFileName, applyToAll = false) => {
    setPages(prev => prev.map((p, idx) => {
      if (applyToAll || idx === currentPageIndex) {
        return { ...p, bg: bgFileName };
      }
      return p;
    }));
  };

  const applyLayoutToNext = () => {
    if (currentPageIndex >= pages.length - 1) {
      alert('Add a new page first!');
      return;
    }
    
    const currentLayout = JSON.parse(JSON.stringify(pages[currentPageIndex]. blocks));
    const currentBg = pages[currentPageIndex]. bg;
    
    setPages(prev => prev.map((p, idx) => {
      if (idx === currentPageIndex + 1) {
        return { ...p, blocks: currentLayout, bg: currentBg };
      }
      return p;
    }));
    setCurrentPageIndex(currentPageIndex + 1);
  };

  return {
    pages,
    setPages,  // ← Add this export
    currentPageIndex,
    setCurrentPageIndex,
    addBlankPage,
    duplicatePage,
    clearPage,
    renamePage,
    movePage,
    changeBackground,
    applyLayoutToNext
  };
}
