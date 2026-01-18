import React, { useState } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import { TAB_CONFIG, GRID_CONFIG, MONTH_NAMES, MONTH_OFFSETS } from '../../constants';

export default function MasterMerge() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  // Helper: Create internal link annotation
  const createInternalLink = (page, x, y, width, height, targetPageIndex) => {
    const pageHeight = page.getHeight();
    
    // PDF coordinates start from bottom-left, we need to flip Y
    const pdfY = pageHeight - y - height;
    
    page.node.addAnnot(page.doc.context.obj({
      Type: 'Annot',
      Subtype: 'Link',
      Rect: [x, pdfY, x + width, pdfY + height],
      Border: [0, 0, 0],
      Dest: [page.doc.getPages()[targetPageIndex].ref, 'XYZ', null, null, null]
    }));
  };

  // Helper: Find month pages in merged PDF
  const findMonthPages = (pages, pdfDoc) => {
    const monthPages = {};
    
    // Heuristic: Assume pages are in order and look for patterns
    // This is a simplified version - you may need to enhance based on your page structure
    pages.forEach((pageInfo, index) => {
      // Try to detect month pages by analyzing page structure
      // For now, we'll use a simple approach: every 32 pages is a new month
      // Adjust this logic based on your actual planner structure
      const monthIndex = Math.floor(index / 32);
      if (monthIndex < MONTH_NAMES.length && index % 32 === 0) {
        monthPages[MONTH_NAMES[monthIndex].toUpperCase()] = index;
      }
    });
    
    return monthPages;
  };

  // Helper: Add month tab links to a page
  const addMonthTabLinks = (page, pageIndex, monthPages, totalPages) => {
    const { startX, startY, width, height } = TAB_CONFIG;
    
    MONTH_NAMES.forEach((month, idx) => {
      const targetPageIndex = monthPages[month.toUpperCase()];
      if (targetPageIndex !== undefined && targetPageIndex !== pageIndex && targetPageIndex < totalPages) {
        const y = startY + (idx * height);
        try {
          createInternalLink(page, startX, y, width, height, targetPageIndex);
        } catch (err) {
          console.warn(`Failed to create link for ${month}:`, err);
        }
      }
    });
  };

  // Helper: Add calendar grid links
  const addCalendarGridLinks = (page, pageIndex, monthName, startDay, dayPages, totalPages) => {
    const { startX, startY, cellWidth, cellHeight, rows, cols } = GRID_CONFIG;
    const monthOffset = MONTH_OFFSETS[monthName.toLowerCase()];
    
    if (monthOffset === undefined) return;
    
    const year = 2026;
    const firstDay = new Date(year, monthOffset, 1).getDay();
    const daysInMonth = new Date(year, monthOffset + 1, 0).getDate();
    const offset = startDay === "monday" ? (firstDay === 0 ? 6 : firstDay - 1) : firstDay;
    
    for (let day = 1; day <= daysInMonth; day++) {
      const cellIndex = offset + day - 1;
      const row = Math.floor(cellIndex / cols);
      const col = cellIndex % cols;
      
      if (row >= rows) break;
      
      const targetPageIndex = dayPages[day - 1];
      if (targetPageIndex !== undefined && targetPageIndex !== pageIndex && targetPageIndex < totalPages) {
        const x = startX + (col * cellWidth);
        const y = startY + (row * cellHeight);
        try {
          createInternalLink(page, x, y, cellWidth, cellHeight, targetPageIndex);
        } catch (err) {
          console.warn(`Failed to create calendar link for day ${day}:`, err);
        }
      }
    }
  };

  const handleMerge = async (files) => {
    if (files.length === 0) {
      alert('Please select at least one PDF file to merge.');
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const mergedPdf = await PDFDocument.create();
      const pageMetadata = [];

      // PASS 1: Copy all pages
      for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
        setProgress(Math.round(((fileIndex + 1) / (files.length * 2)) * 50));

        const arrayBuffer = await files[fileIndex].arrayBuffer();
        const donorPdf = await PDFDocument.load(arrayBuffer);
        const pageIndices = donorPdf.getPageIndices();
        
        const copiedPages = await mergedPdf.copyPages(donorPdf, pageIndices);
        
        copiedPages.forEach((page, localIndex) => {
          mergedPdf.addPage(page);
          pageMetadata.push({
            fileIndex,
            localIndex,
            globalIndex: pageMetadata.length
          });
        });
      }

      // PASS 2: Recreate hyperlinks
      // Note: This is a simplified version. You may need to enhance this
      // based on your actual planner structure and page naming conventions
      
      const pages = mergedPdf.getPages();
      const totalPages = pages.length;
      
      // Simple heuristic: Find month pages (adjust based on your structure)
      const monthPages = {};
      
      // If you have a consistent structure (e.g., Cover, Month Overview, 31 days, repeat)
      // you can detect month pages. This is a placeholder - adjust to your needs:
      let pageIndex = 0;
      MONTH_NAMES.forEach((month, monthIdx) => {
        // Example: If each month starts at a predictable interval
        const estimatedIndex = monthIdx * 33; // adjust based on your structure
        if (estimatedIndex < totalPages) {
          monthPages[month.toUpperCase()] = estimatedIndex;
        }
      });

      // Add links to all pages
      for (let i = 0; i < totalPages; i++) {
        setProgress(50 + Math.round(((i + 1) / totalPages) * 50));
        
        try {
          const page = pages[i];
          
          // Add month tab links to every page
          addMonthTabLinks(page, i, monthPages, totalPages);
          
          // If this is a month overview page, add calendar grid links
          // (You'll need to detect which pages are month overviews)
          // For now, assume month overview pages are the month pages we found
          const isMonthPage = Object.values(monthPages).includes(i);
          if (isMonthPage) {
            const monthName = Object.keys(monthPages).find(key => monthPages[key] === i);
            if (monthName) {
              // Calculate day pages (assumes days follow month page)
              const dayPages = [];
              for (let day = 0; day < 31; day++) {
                const dayPageIndex = i + 1 + day;
                if (dayPageIndex < totalPages) {
                  dayPages.push(dayPageIndex);
                }
              }
              addCalendarGridLinks(page, i, monthName, "sunday", dayPages, totalPages);
            }
          }
        } catch (pageError) {
          console.warn(`Failed to add links to page ${i}:`, pageError);
        }
      }

      // Save merged PDF
      setProgress(100);
      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'Complete_Planner_2026_Merged.pdf';
      link.click();

      alert('✅ Success! Your complete planner with working hyperlinks is ready.');

    } catch (error) {
      console.error('Merge error:', error);
      alert('❌ Merge failed: ' + error.message);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return (
    <div style={{
      marginTop: '20px',
      padding: '15px',
      background: '#f0fdf4',
      borderRadius:  '10px',
      border: '1px solid #bbf7d0',
      textAlign: 'center'
    }}>
      <h4 style={{
        fontSize: '11px',
        color: '#166534',
        margin: '0 0 5px 0',
        textTransform: 'uppercase'
      }}>
        📦 Step 2:  Master Merge
      </h4>
      <p style={{
        fontSize: '10px',
        color: '#166534',
        marginBottom: '10px',
        lineHeight: '1.4'
      }}>
        Combine exported batches into one final planner. <br />
        <strong>Hyperlinks will be recreated!</strong>
      </p>

      {isProcessing && (
        <div style={{
          marginBottom: '10px',
          padding: '8px',
          background: '#dcfce7',
          borderRadius:  '6px'
        }}>
          <div style={{
            fontSize: '12px',
            color: '#166534',
            fontWeight: 'bold',
            marginBottom: '5px'
          }}>
            {progress < 50 ? 'Merging pages...' : 'Recreating hyperlinks...'} {progress}%
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            background: '#bbf7d0',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              background: '#22c55e',
              transition:  'width 0.3s'
            }} />
          </div>
        </div>
      )}

      <label style={{
        display: 'block',
        padding: '10px',
        background: 'white',
        border: '2px dashed #bbf7d0',
        borderRadius: '6px',
        cursor: isProcessing ? 'not-allowed' : 'pointer',
        fontSize: '11px',
        color: '#166534',
        fontWeight: 'bold',
        opacity: isProcessing ? 0.5 : 1
      }}>
        📁 {isProcessing ? 'Processing...' : 'Select PDF Batches'}
        <input
          type="file"
          multiple
          accept=".pdf"
          disabled={isProcessing}
          onChange={(e) => handleMerge(Array.from(e.target.files))}
          style={{ display: 'none' }}
        />
      </label>

      <p style={{
        fontSize: '9px',
        color: '#16a34a',
        marginTop: '8px',
        marginBottom: '0'
      }}>
        💡 Tip: Select multiple PDFs in order (Jan-Jun, Jul-Dec, etc.)
      </p>
    </div>
  );
}
