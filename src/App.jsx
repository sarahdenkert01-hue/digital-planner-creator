import React, { useState, useRef } from 'react';
import { Stage, Layer, Rect, Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';
import Sidebar from './components/Sidebar/Sidebar';
import RightSidebar from './components/Sidebar/RightSidebar';
import ExportProgress from './components/Export/ExportProgress';
import LicenseCheck from './components/Auth/LicenseCheck';
import ImageBlock from './components/Canvas/ImageBlock';
import { createBlock } from './utils/blockHelpers';
import { CANVAS_CONFIG } from './constants';
import { useResponsive } from './hooks/useResponsive';
import { usePDFExport } from './hooks/usePDFExport';

const { WIDTH, HEIGHT } = CANVAS_CONFIG;

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
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
  const [showLeftSidebar, setShowLeftSidebar] = useState(false);
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  
  const { viewScale, isMobile, isTablet } = useResponsive();
  
  const stageRef = useRef();
  const lastRenderedPageRef = useRef(null);

  const { 
    exportProgress, 
    isExporting, 
    exportSmartPDF, 
    cancelExport 
  } = usePDFExport({ 
    pages, 
    stageRef, 
    lastRenderedPageRef, 
    setCurrentPageIndex, 
    startDay 
  });

  const currentPage = pages[currentPageIndex] || pages[0];
  const selectedBlock = currentPage?. blocks?.find(b => b. id === selectedId);
  
  const [bgImg, bgStatus] = useImage(currentPage?.bg ?  `/${currentPage.bg}` : null, 'anonymous');

  const addBlock = (fileName, size = 'full') => {
    const newBlock = createBlock(fileName, size);
    setPages(prev => {
      const updated = [...prev];
      updated[currentPageIndex] = {
        ...updated[currentPageIndex],
        blocks: [... (updated[currentPageIndex].blocks || []), newBlock]
      };
      return updated;
    });
    setSelectedId(newBlock.id);
  };

  const applyStarter = (fileName) => {
    if (!window.confirm('Replace all blocks? ')) return;
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

  const updateBlock = (updatedBlock) => {
    setPages(prev => {
      const updated = [...prev];
      updated[currentPageIndex] = {
        ...updated[currentPageIndex],
        blocks:  (updated[currentPageIndex].blocks || []).map(b =>
          b.id === updatedBlock.id ? updatedBlock : b
        )
      };
      return updated;
    });
  };

  const toggleLock = () => {
    if (!selectedId) return;
    setPages(prev => {
      const updated = [...prev];
      updated[currentPageIndex] = {
        ...updated[currentPageIndex],
        blocks: (updated[currentPageIndex].blocks || []).map(b =>
          b.id === selectedId ? { ...b, locked: !b. locked } : b
        )
      };
      return updated;
    });
  };

  const deleteBlock = () => {
    if (!selectedId) return;
    setPages(prev => {
      const updated = [...prev];
      updated[currentPageIndex] = {
        ...updated[currentPageIndex],
        blocks: (updated[currentPageIndex].blocks || []).filter(b => b.id !== selectedId)
      };
      return updated;
    });
    setSelectedId(null);
  };

  const changeBackground = (bgFileName, applyToAll = false) => {
    setPages(prev => prev.map((p, idx) => {
      if (applyToAll || idx === currentPageIndex) {
        return { ... p, bg: bgFileName };
      }
      return p;
    }));
  };

  const addBlankPage = () => {
   const newPage = {
     id:  Date.now().toString() + Math.random(),
     name: 'New Page',
     section: 'NONE',
     type: 'NONE',
     blocks: [],
     bg: currentPage.bg  // ✅ Inherits from current page
   };
   setPages(prev => [...prev, newPage]);
   setCurrentPageIndex(pages.length);
 };

  const duplicatePage = () => {
    const newPage = JSON.parse(JSON.stringify(currentPage));
    newPage.id = Date.now().toString() + Math.random();
    newPage.name = currentPage.name + ' (Copy)';
    setPages(prev => [...prev, newPage]);
    setCurrentPageIndex(pages.length);
  };

  const clearPage = () => {
    if (! window.confirm('Clear all blocks?')) return;
    setPages(prev => {
      const updated = [...prev];
      updated[currentPageIndex] = {
        ...updated[currentPageIndex],
        blocks: (updated[currentPageIndex].blocks || []).filter(b => b.locked)
      };
      return updated;
    });
  };

  const applyLayoutToNext = () => {
    if (currentPageIndex >= pages.length - 1) {
      alert('Add a new page first!');
      return;
    }
    const currentLayout = JSON.parse(JSON.stringify(currentPage. blocks || []));
    const currentBg = currentPage.bg;
    setPages(prev => prev.map((p, idx) => {
      if (idx === currentPageIndex + 1) {
        return { ...p, blocks: currentLayout, bg: currentBg };
      }
      return p;
    }));
    setCurrentPageIndex(currentPageIndex + 1);
  };

  const movePage = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= pages.length) return;
    
    setPages(prev => {
      const updated = [...prev];
      [updated[index], updated[targetIndex]] = [updated[targetIndex], updated[index]];
      return updated;
    });
    setCurrentPageIndex(targetIndex);
  };

  const renamePage = (index) => {
    const newName = window.prompt('Enter new page name:', pages[index].name);
    if (newName && newName. trim()) {
      setPages(prev => {
        const updated = [...prev];
        updated[index] = { ...updated[index], name: newName.trim() };
        return updated;
      });
    }
  };

  // ✅ ADD MONTH BUNDLE FUNCTION
  const addMonthBundle = (month) => {
    console.log('Adding month bundle for:', month); // Debug log
    
    const currentBg = currentPage.bg;
    const timestamp = Date.now();
    const bundle = [];
    
    // Month overview page
    const calendarFileName = `${month.toLowerCase()}${startDay}start.svg`;
    const headerFileName = `${month.toLowerCase()}header.svg`;
    
    bundle.push({
      id: `m-${month}-${timestamp}`,
      name: `${month} Overview`,
      section: month,
      type: 'MONTH',
      bg: currentBg,
      blocks: [
        createBlock(calendarFileName, 'calendar'),
        createBlock(headerFileName, 'header')
      ]
    });
    
    // Weekly pages
    for (let w = 1; w <= 5; w++) {
      bundle.push({
        id: `w-${month}-${w}-${timestamp}`,
        name: `${month} Week ${w}`,
        section: month,
        type: 'WEEK',
        bg: currentBg,
        blocks: []
      });
    }
    
    // Daily pages
    for (let d = 1; d <= 31; d++) {
      bundle.push({
        id: `d-${month}-${d}-${timestamp}`,
        name: `${month} Day ${d}`,
        section: month,
        type:  'DAY',
        bg: currentBg,
        blocks: []
      });
    }
    
    console.log('Bundle created:', bundle. length, 'pages'); // Debug log
    setPages(prev => [...prev, ...bundle]);
    alert(`Added ${bundle.length} pages for ${month}!`);
  };

      if (!isUnlocked) {
      return <LicenseCheck onUnlock={() => {
        console.log('🎊 onUnlock called in App.jsx! ');
        console.log('🎊 Setting isUnlocked to true');
        setIsUnlocked(true);
        console.log('🎊 isUnlocked state should now be true');
      }} />;
    }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: isMobile ? 'column' : 'row',
      height: '100vh', 
      background: '#f0f2f5', 
      overflow: 'hidden' 
    }}>
      {isExporting && <ExportProgress progress={exportProgress} onCancel={cancelExport} />}

      {/* Sidebar - collapsible on mobile */}
      {(() => {
        const shouldShowLeftSidebar = !isMobile || showLeftSidebar;
        return shouldShowLeftSidebar && (
          <Sidebar
            selectedId={selectedId}
            selectedBlock={selectedBlock}
            currentPage={currentPage}
            startDay={startDay}
            isExporting={isExporting}
            isMobile={isMobile}
            onToggleLock={toggleLock}
            onDeleteBlock={deleteBlock}
            onChangeBackground={changeBackground}
            onAddBlock={addBlock}
            onApplyStarter={applyStarter}
            onSetStartDay={setStartDay}
            onExportPDF={exportSmartPDF}
            onAddMonthBundle={addMonthBundle}
          />
        );
      })()}

      {/* Canvas with dynamic scale */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: isMobile ? 'flex-start' : 'center',
        padding: isMobile ? '10px' : '20px', 
        overflow: 'auto',
        background: '#e5e7eb',
        position: 'relative'
      }}>
        {isMobile && (
          <button
            onClick={() => setShowLeftSidebar(!showLeftSidebar)}
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              zIndex: 1000,
              padding: '10px 15px',
              background: '#ffc8b0',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              color: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              minHeight: '44px',
              minWidth: '44px'
            }}
          >
            {showLeftSidebar ? '✕' : '☰'} Menu
          </button>
        )}
        
        <div style={{ 
          width: WIDTH * viewScale, 
          height: HEIGHT * viewScale, 
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)', 
          background: 'white', 
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{ 
            transform: `scale(${viewScale})`, 
            transformOrigin: 'top left', 
            width: WIDTH, 
            height: HEIGHT 
          }}>
            <Stage
              width={WIDTH}
              height={HEIGHT}
              ref={stageRef}
              onClick={(e) => {
                if (e.target === e.target.getStage()) {
                  setSelectedId(null);
                }
              }}
            >
              <Layer>
                <Rect width={WIDTH} height={HEIGHT} fill="white" />
                {bgStatus === 'loaded' && bgImg && (
                  <KonvaImage image={bgImg} width={WIDTH} height={HEIGHT} />
                )}
                {currentPage && currentPage.blocks && currentPage.blocks.map((block) => (
                  <ImageBlock
                    key={block.id}
                    block={block}
                    isSelected={block.id === selectedId}
                    onSelect={() => setSelectedId(block.id)}
                    onChange={updateBlock}
                    onToggleLock={toggleLock}      
                    onDelete={deleteBlock}
                  />
                ))}
              </Layer>
            </Stage>
          </div>
        </div>
      </div>

      {/* Right Sidebar - collapsible on mobile/tablet */}
      {(() => {
        const isDesktop = !isMobile && !isTablet;
        const shouldShowRightSidebar = isDesktop || showRightSidebar;
        return shouldShowRightSidebar && (
          <RightSidebar
            pages={pages}
            currentPageIndex={currentPageIndex}
            isMobile={isMobile}
            onAddBlankPage={addBlankPage}
            onDuplicatePage={duplicatePage}
            onClearPage={clearPage}
            onApplyLayoutToNext={applyLayoutToNext}
            onMovePage={movePage}
            onSetCurrentPage={setCurrentPageIndex}
            onRenamePage={renamePage}
          />
        );
      })()}
      
      {(isMobile || isTablet) && (
        <button
          onClick={() => setShowRightSidebar(!showRightSidebar)}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
            padding: '15px 20px',
            background: '#ffc8b0',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            color: 'white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            minHeight: '44px',
            minWidth: '44px'
          }}
        >
          📄 Pages
        </button>
      )}
    </div>
  );
}
