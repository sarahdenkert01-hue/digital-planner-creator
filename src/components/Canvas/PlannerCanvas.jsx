import React, { useState, useRef, useMemo, useCallback } from "react";
import { Stage, Layer, Rect, Image } from "react-konva";
import useImage from "use-image";
import { CANVAS_CONFIG } from '../../constants';
import ImageBlock from './ImageBlock';
import Sidebar from '../Sidebar/Sidebar';
import ExportProgress from '../Export/ExportProgress';
import { createBlock } from '../../utils/blockHelpers';
import { updatePageBlocks, updatePageName } from '../../utils/pageHelpers';
import { renderCache } from '../../utils/renderCache';
import { usePDFExport } from '../../hooks/usePDFExport';

const { WIDTH, HEIGHT, VIEW_SCALE } = CANVAS_CONFIG;

export default function PlannerCanvas() {
  const [pages, setPages] = useState([{
    id: "p1",
    name: "Planner Start",
    section: "JAN",
    type: "NONE",
    blocks: [],
    bg: "backgroundwithtabs.png"
  }]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [startDay, setStartDay] = useState("sunday");

  const stageRef = useRef();
  const lastRenderedPageRef = useRef(null);
  const currentPage = useMemo(() => pages[currentPageIndex], [pages, currentPageIndex]);
  const selectedBlock = useMemo(() => currentPage.blocks. find(b => b.id === selectedId), [currentPage.blocks, selectedId]);
  const [bgImg, bgStatus] = useImage(`/${currentPage.bg}`, "anonymous");

  const { exportProgress, isExporting, exportSmartPDF, cancelExport } = usePDFExport({
    pages,
    stageRef,
    lastRenderedPageRef,
    setCurrentPageIndex,
    startDay
  });

  const addBlock = useCallback((fileName, size = "full") => {
    const newBlock = createBlock(fileName, size);
    setPages(prev => updatePageBlocks(prev, currentPageIndex, [... prev[currentPageIndex]. blocks, newBlock]));
    setSelectedId(newBlock.id);
  }, [currentPageIndex]);

  const changeBackground = useCallback((bgFileName, applyToAll = false) => {
    setPages(prev => prev.map((p, idx) => 
      (applyToAll || idx === currentPageIndex) ? { ...p, bg: bgFileName } : p
    ));
  }, [currentPageIndex]);

  const renamePage = useCallback((index) => {
    const newName = window.prompt("Enter new page name:", pages[index].name);
    if (newName && newName.trim() !== "") {
      setPages(prev => updatePageName(prev, index, newName. trim()));
    }
  }, [pages]);

  const movePage = useCallback((index, direction) => {
    setPages(prev => {
      const newPages = [...prev];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= newPages.length) return prev;
      
      const currentP = newPages[index];
      const targetP = newPages[targetIndex];
      
      if ((currentP.type === "DAY" || targetP.type === "DAY") && currentP.section !== targetP.section) {
        alert("Daily pages must stay within their month bundle.");
        return prev;
      }
      
      [newPages[index], newPages[targetIndex]] = [newPages[targetIndex], newPages[index]];
      setCurrentPageIndex(targetIndex);
      return newPages;
    });
  }, []);

  const applyStarter = useCallback((fileName) => {
    if (! window.confirm("Apply template? ")) return;
    const starterBlock = {
      id: Date.now().toString() + Math.random(),
      src: `/${fileName}`,
      x: 225,
      y: 125,
      width: 1167,
      height: 1800,
      locked: true
    };
    setPages(prev => updatePageBlocks(prev, currentPageIndex, [starterBlock]));
  }, [currentPageIndex]);

  const applyLayoutToNextPage = useCallback(() => {
    if (currentPageIndex >= pages.length - 1) {
      alert("Add a new page first!");
      return;
    }
    const currentLayout = JSON.parse(JSON.stringify(currentPage. blocks));
    const currentBg = currentPage.bg;
    setPages(prev => prev.map((p, idx) => 
      idx === currentPageIndex + 1 ? { ...p, blocks: currentLayout, bg: currentBg } : p
    ));
    setCurrentPageIndex(currentPageIndex + 1);
  }, [currentPageIndex, currentPage, pages. length]);

  const addBlankPage = useCallback(() => {
    setPages(prev => [...prev, {
      id: Date.now().toString() + Math.random(),
      name: "New Page",
      section: "NONE",
      type: "NONE",
      blocks: [],
      bg: "backgroundwithtabs.png"
    }]);
    setCurrentPageIndex(pages.length);
  }, [pages.length]);

  const duplicatePage = useCallback(() => {
    const newPage = JSON.parse(JSON.stringify(currentPage));
    newPage.id = Date.now().toString() + Math.random();
    newPage.name = currentPage.name + " (Copy)";
    setPages(prev => [...prev, newPage]);
    setCurrentPageIndex(pages.length);
  }, [currentPage, pages.length]);

  const deleteBlock = useCallback(() => {
    if (! selectedId) return;
    setPages(prev => updatePageBlocks(
      prev, 
      currentPageIndex, 
      prev[currentPageIndex].blocks.filter(b => b.id !== selectedId)
    ));
    setSelectedId(null);
  }, [selectedId, currentPageIndex]);

  const clearPage = useCallback(() => {
    if (!window.confirm("Clear all? ")) return;
    setPages(prev => updatePageBlocks(
      prev,
      currentPageIndex,
      prev[currentPageIndex].blocks. filter(b => b.locked)
    ));
  }, [currentPageIndex]);

  const toggleLock = useCallback(() => {
    if (!selectedId) return;
    setPages(prev => {
      const updated = [... prev];
      updated[currentPageIndex].blocks = updated[currentPageIndex].blocks.map(b =>
        b.id === selectedId ? { ...b, locked: ! b.locked } : b
      );
      return updated;
    });
  }, [selectedId, currentPageIndex]);

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f0f2f5", overflow: "hidden" }}>
      {exportProgress !== null && (
        <ExportProgress progress={exportProgress} onCancel={cancelExport} />
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
        onApplyLayoutToNext={applyLayoutToNextPage}
        onMovePage={movePage}
        onRenamePage={renamePage}
        onSetCurrentPage={setCurrentPageIndex}
        onAddBlock={addBlock}
        onApplyStarter={applyStarter}
        onSetStartDay={setStartDay}
        onExportPDF={exportSmartPDF}
      />

      <div style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "20px",
        overflow: "auto"
      }}>
        <div style={{
          width: WIDTH * VIEW_SCALE,
          height: HEIGHT * VIEW_SCALE,
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          background: "white",
          position: "relative"
        }}>
          <div style={{
            transform: `scale(${VIEW_SCALE})`,
            transformOrigin: "top left",
            width: WIDTH,
            height: HEIGHT
          }}>
            <Stage width={WIDTH} height={HEIGHT} ref={stageRef}>
              <Layer>
                <Rect width={WIDTH} height={HEIGHT} fill="white" />
                {bgStatus === 'loaded' && <Image image={bgImg} width={WIDTH} height={HEIGHT} />}
                {currentPage.blocks.map((block) => (
                  <ImageBlock
                    key={block.id}
                    block={block}
                    isSelected={block.id === selectedId}
                    onSelect={() => setSelectedId(block.id)}
                    onChange={(newAttrs) => {
                      setPages(prev => {
                        const n = [...prev];
                        n[currentPageIndex]. blocks = n[currentPageIndex]. blocks.map(b =>
                          b.id === block.id ? newAttrs : b
                        );
                        return n;
                      });
                      renderCache. invalidate(currentPage.id);
                    }}
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
