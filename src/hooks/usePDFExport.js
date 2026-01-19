import { useState, useCallback, useRef } from 'react';
import jsPDF from 'jspdf';
import { CANVAS_CONFIG } from '../constants';
import {
  PDF_EXPORT_CONFIG,
  addMonthTabLinks,
  addCalendarGridLinks,
  clearMonthCache,
  createOptimizedExportFlow,
  getMonthNameFromPage
} from '../utils/pdfHelpers';
import { renderCache } from '../utils/renderCache';

const { WIDTH, HEIGHT } = CANVAS_CONFIG;

export function usePDFExport({ pages, stageRef, lastRenderedPageRef, setCurrentPageIndex, startDay }) {
  const [exportProgress, setExportProgress] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const exportCancelRef = useRef(false);

  const cancelExport = useCallback(() => {
    exportCancelRef.current = true;
    setExportProgress(null);
    setIsExporting(false);
  }, []);

  const exportSmartPDF = useCallback(async () => {
    if (isExporting) return;

    setIsExporting(true);
    setExportProgress(0);
    exportCancelRef.current = false;
    clearMonthCache();
    renderCache.clear();

    const pdf = new jsPDF("p", "pt", [WIDTH, HEIGHT]);
    const exportFlow = createOptimizedExportFlow(pages.length);
    let addedPages = 0;

    try {
      for await (const { dataUrl, index } of exportFlow.renderPages(
        async (idx) => {
          // Check cache with block validation
          let cachedUrl = renderCache.get(pages[idx].id, pages[idx].blocks);

          if (cachedUrl) {
            return cachedUrl;
          }

          // Only switch page if necessary
          if (lastRenderedPageRef.current !== pages[idx].id) {
            setCurrentPageIndex(idx);
            lastRenderedPageRef.current = pages[idx].id;
            // Minimal render delay
            await new Promise(r => setTimeout(r, 300));
          }

          // Render canvas
          const rendered = stageRef.current.toDataURL({
            pixelRatio: PDF_EXPORT_CONFIG.pixelRatio,
            mimeType: PDF_EXPORT_CONFIG.mimeType,
            quality: PDF_EXPORT_CONFIG. quality
          });

          // Cache with block hash
          renderCache.set(pages[idx].id, rendered, pages[idx].blocks);
          return rendered;
        },
        (percent) => {
          if (!  exportCancelRef.current) {
            setExportProgress(percent);
          }
        },
        () => exportCancelRef.current
      )) {
        if (exportCancelRef.current) break;

        // Add page to PDF
        if (addedPages > 0) pdf. addPage([WIDTH, HEIGHT], "p");
        pdf.addImage(dataUrl, "JPEG", 0, 0, WIDTH, HEIGHT, undefined, PDF_EXPORT_CONFIG.compression);

        // Add interactive links
        addMonthTabLinks(pdf, pages, index);

        const page = pages[index];
        if (page.type === "MONTH" || page.name.toUpperCase().includes("OVERVIEW")) {
          const mName = getMonthNameFromPage(page);
          if (mName) {
            addCalendarGridLinks(pdf, pages, index, startDay, mName);
          }
        }

        addedPages++;
        setExportProgress(Math.round(((index + 1) / pages.length) * 100));
      }

      if (!exportCancelRef.current) {
        // Add metadata to PDF document properties
        const metadata = {
          creator: 'Digital Planner Creator',
          version: '2.0',
          pageStructure: pages.map((p, idx) => ({
            index: idx,
            type: p.type,
            name: p.name
          }))
        };
        
        // Store in PDF subject field (we'll parse this during merge)
        pdf.setProperties({
          title: 'Therapist Planner Batch',
          subject: `METADATA:${JSON.stringify(metadata)}`,
          creator: 'Digital Planner Creator',
          keywords: 'planner, therapist, digital'
        });
        
        pdf.save("Therapist_Planner_Batch.pdf");
        alert("✅ Export complete! PDF ready to download.");
      }
    } catch (err) {
      console.error("Export error:", err);
      alert("❌ Error during export. Please try again.");
    } finally {
      setExportProgress(null);
      setIsExporting(false);
      lastRenderedPageRef.current = null;
    }
  }, [pages, startDay, isExporting, stageRef, lastRenderedPageRef, setCurrentPageIndex]);

  return {
    exportProgress,
    isExporting,
    exportSmartPDF,
    cancelExport
  };
}
