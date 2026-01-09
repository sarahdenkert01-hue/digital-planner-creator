import React, { useState, useRef } from 'react';
import { Stage, Layer, Rect, Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';
import Sidebar from './components/Sidebar/Sidebar';
import ExportProgress from './components/Export/ExportProgress';
import LicenseCheck from './components/Auth/LicenseCheck';
import ImageBlock from './components/Canvas/ImageBlock';
import { createBlock } from './utils/blockHelpers';
import { CANVAS_CONFIG } from './constants';

const { WIDTH, HEIGHT, VIEW_SCALE } = CANVAS_CONFIG;

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
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const stageRef = useRef();
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
      bg: 'backgroundwithtabs. png'
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

  const exportPDF = () => {
    alert('PDF export coming soon!');
  };

  if (!isUnlocked) {
    return <LicenseCheck onUnlock={() => setIsUnlocked(true)} />;
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f0f2f5', overflow: 'hidden' }}>
      {isExporting && <ExportProgress progress={progress} onCancel={() => setIsExporting(false)} />}

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
        onAddMonthBundle={addMonthBundle}
      />

      <div style={{ 
        flex: 1, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'flex-start', 
        padding: '20px', 
        overflow: 'auto',
        background: '#e5e7eb'
      }}>
        <div style={{ 
          width: WIDTH * VIEW_SCALE, 
          height: HEIGHT * VIEW_SCALE, 
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)', 
          background: 'white', 
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{ 
            transform: `scale(${VIEW_SCALE})`, 
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
                    onSelect={() => setSelectedId(block. id)}
                    onChange={updateBlock}
                  />
                ))}
              </Layer>
            </Stage>
          </div>
        </div>
      </div>
    </div>
  );
}
