import React, { useState, useRef } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import PlannerCanvas from './components/Canvas/PlannerCanvas';
import ExportProgress from './components/Export/ExportProgress';
import LicenseCheck from './components/Auth/LicenseCheck';
import { createBlock } from './utils/blockHelpers';

export default function App() {
  // License state
  const [isUnlocked, setIsUnlocked] = useState(false);
  
  // Pages state - initialized with first page
  const [pages, setPages] = useState([
    {
      id: 'p1',
      name: 'Planner Start',
      section: 'NONE',
      type: 'NONE',
      blocks: [],
      bg: 'backgroundwithtabs.png'
    }
  ]);
  
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [startDay, setStartDay] = useState('sunday');
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const stageRef = useRef();
  const currentPage = pages[currentPageIndex];
  const selectedBlock = currentPage?.blocks.find(b => b.id === selectedId);

  // Add block to current page
  const addBlock = (fileName, size = 'full') => {
    const newBlock = createBlock(fileName, size);
    setPages(prev => {
      const updated = [...prev];
      updated[currentPageIndex] = {
        ...updated[currentPageIndex],
        blocks: [... updated[currentPageIndex].blocks, newBlock]
      };
      return updated;
    });
    setSelectedId(newBlock.id);
  };

  // Apply starter template
  const applyStarter = (fileName) => {
    if (! window.confirm('Replace all blocks with this template? ')) return;
    const starterBlock = createBlock(fileName, 'full');
    starterBlock.locked = true;
    setPages(prev => {
      const updated = [...prev];
      updated[currentPageIndex] = {
        ...updated[currentPageIndex],
        blocks: [starterBlock]
      };
      return updated;
    });
    setSelectedId(null);
  };

  // Update block
  const updateBlock = (updatedBlock) => {
    setPages(prev => {
      const updated = [...prev];
      updated[currentPageIndex] = {
        ...updated[currentPageIndex],
        blocks: updated[currentPageIndex].blocks.map(b =>
          b.id === updatedBlock.id ? updatedBlock :  b
        )
      };
      return updated;
    });
  };

  // Toggle lock
  const toggleLock = () => {
    if (!selectedId) return;
    setPages(prev => {
      const updated = [... prev];
      updated[currentPageIndex] = {
        ...updated[currentPageIndex],
        blocks:  updated[currentPageIndex].blocks. map(b =>
          b. id === selectedId ? { ...b, locked: !b.locked } : b
        )
      };
      return updated;
    });
  };

  // Delete block
  const deleteBlock = () => {
    if (!selectedId) return;
    setPages(prev => {
      const updated = [... prev];
      updated[currentPageIndex] = {
        ...updated[currentPageIndex],
        blocks: updated[currentPageIndex].blocks.filter(b => b.id !== selectedId)
      };
      return updated;
    });
    setSelectedId(null);
  };

  // Change background
  const changeBackground = (bgFileName, applyToAll = false) => {
    setPages(prev => prev.map((p, idx) => {
      if (applyToAll || idx === currentPageIndex) {
        return { ...p, bg: bgFileName };
      }
      return p;
    }));
  };

  // Add blank page
  const addBlankPage = () => {
    const newPage = {
      id:  Date.now().toString() + Math.random(),
      name: 'New Page',
      section:  'NONE',
      type: 'NONE',
      blocks: [],
      bg: 'backgroundwithtabs.png'
    };
    setPages(prev => [...prev, newPage]);
    setCurrentPageIndex(pages.length);
  };

  // Duplicate page
  const duplicatePage = () => {
    const newPage = JSON.parse(JSON. stringify(currentPage));
    newPage.id = Date.now().toString() + Math.random();
    newPage.name = currentPage.name + ' (Copy)';
    setPages(prev => [... prev, newPage]);
    setCurrentPageIndex(pages.length);
  };

  // Clear page
  const clearPage = () => {
    if (! window.confirm('Clear all blocks? ')) return;
    setPages(prev => {
      const updated = [...prev];
      updated[currentPageIndex] = {
        ... updated[currentPageIndex],
        blocks: updated[currentPageIndex]. blocks.filter(b => b. locked)
      };
      return updated;
    });
  };

  // Apply layout to next page
  const applyLayoutToNext = () => {
    if (currentPageIndex >= pages.length - 1) {
      alert('Add a new page first!');
      return;
    }
    const currentLayout = JSON.parse(JSON.stringify(currentPage.blocks));
    const currentBg = currentPage.bg;
    setPages(prev => prev.map((p, idx) => {
      if (idx === currentPageIndex + 1) {
        return { ...p, blocks: currentLayout, bg: currentBg };
      }
      return p;
    }));
    setCurrentPageIndex(currentPageIndex + 1);
  };

  // Move page
  const movePage = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= pages. length) return;
    
    const currentP = pages[index];
    const targetP = pages[targetIndex];
    
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

  // Rename page
  const renamePage = (index) => {
    const newName = window.prompt('Enter new page name:', pages[index].name);
    if (newName && newName.trim() !== '') {
      setPages(prev => {
        const updated = [... prev];
        updated[index] = { ...updated[index], name: newName.trim() };
        return updated;
      });
    }
  };

  // Export PDF (placeholder)
  const exportPDF = async () => {
    alert('PDF export coming soon!');
  };

  // License check
  if (!isUnlocked) {
    return <LicenseCheck onUnlock={() => setIsUnlocked(true)} />;
  }

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      background: '#f0f2f5',
      overflow: 'hidden'
    }}>
      {isExporting && (
        <ExportProgress progress={progress} onCancel={() => setIsExporting(false)} />
      )}

      <Sidebar
        selectedId={selectedId}
        selectedBlock={selectedBlock}
        currentPage={currentPage}
        pages={pages}
        currentPageIndex={currentPageIndex}
        startDay={startDay}
        isExporting={isExporting}
        onToggleLock={toggleLock}
        onDeleteBlock={deleteBlock}
        onChangeBackground={changeBackground}
        onAddBlankPage={addBlankPage}
        onDuplicatePage={duplicatePage}
        onClearPage={clearPage}
        onApplyLayoutToNext={applyLayoutToNext}
        onMovePage={movePage}
        onRenamePage={renamePage}
        onSetCurrentPage={setCurrentPageIndex}
        onAddBlock={addBlock}
        onApplyStarter={applyStarter}
        onSetStartDay={setStartDay}
        onExportPDF={exportPDF}
      />

      <PlannerCanvas
        currentPage={currentPage}
        selectedId={selectedId}
        onSelectBlock={setSelectedId}
        onUpdateBlock={updateBlock}
        stageRef={stageRef}
      />
    </div>
  );
}
