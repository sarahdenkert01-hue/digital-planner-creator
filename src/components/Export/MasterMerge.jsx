import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { TAB_CONFIG, GRID_CONFIG, MONTH_NAMES, MONTH_OFFSETS } from '../../constants';

const CALENDAR_YEAR = 2026;

export default function MasterMerge() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  // Extract metadata from PDF properties
  const extractMetadata = async (pdfDoc) => {
    try {
      const subject = pdfDoc.getSubject();
      if (subject && subject.startsWith('METADATA:')) {
        const jsonStr = subject.substring(9);
        return JSON.parse(jsonStr);
      }
    } catch (err) {
      console.warn('Could not extract metadata:', err);
    }
    return null;
  };

  // Create internal link annotation using pdf-lib
  const createInternalLink = (page, x, y, width, height, targetPageIndex, pdfDoc) => {
    try {
      const pageHeight = page.getHeight();
      const pdfY = pageHeight - y - height;
      
      const pages = pdfDoc.getPages();
      const targetPage = pages[targetPageIndex];
      
      if (!targetPage) {
        console.warn(`Target page ${targetPageIndex} does not exist`);
        return;
      }

      page.node.addAnnot(
        pdfDoc.context.register(
          pdfDoc.context.obj({
            Type: 'Annot',
            Subtype: 'Link',
            Rect: [x, pdfY, x + width, pdfY + height],
            Border: [0, 0, 0],
            C: [0, 0, 0],
            A: {
              Type: 'Action',
              S: 'GoTo',
              D: [targetPage.ref, 'XYZ', null, null, 0]
            }
          })
        )
      );
    } catch (err) {
      console.warn('Failed to create link:', err);
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
      const allPageMetadata = [];
      let hasMetadata = false;

      // PASS 1: Load PDFs, extract metadata, and copy pages
      let globalPageIndex = 0;
      for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
        setProgress(Math.round(((fileIndex + 1) / files.length) * 40));

        const arrayBuffer = await files[fileIndex].arrayBuffer();
        const donorPdf = await PDFDocument.load(arrayBuffer);
        
        // Extract metadata
        const metadata = await extractMetadata(donorPdf);
        
        if (metadata && metadata.pageStructure) {
          hasMetadata = true;
          console.log(`File ${fileIndex + 1}: Found metadata for ${metadata.pageStructure.length} pages`);
        }

        // Copy all pages
        const pageIndices = donorPdf.getPageIndices();
        const copiedPages = await mergedPdf.copyPages(donorPdf, pageIndices);
        
        copiedPages.forEach((page, localIndex) => {
          mergedPdf.addPage(page);
          
          // Store metadata for this page
          if (metadata && metadata.pageStructure && metadata.pageStructure[localIndex]) {
            allPageMetadata.push({
              ...metadata.pageStructure[localIndex],
              globalIndex: globalPageIndex,
              fileIndex
            });
          } else {
            allPageMetadata.push({
              globalIndex: globalPageIndex,
              type: null,
              name: null,
              fileIndex
            });
          }
          
          globalPageIndex++;
        });
      }

      if (!hasMetadata) {
        console.warn('No metadata found in any PDF. Links may not work correctly.');
        alert('⚠️ Warning: PDFs were exported with an older version. Hyperlinks may not work correctly.\n\nPlease re-export your batches for full functionality.');
      }

      // PASS 2: Build lookup tables
      setProgress(50);
      
      const monthPages = {};
      const dayPagesByMonth = {};
      
      allPageMetadata.forEach((meta) => {
        if (!meta.type || !meta.name) return;
        
        // Find month overview pages
        if (meta.type === 'MONTH') {
          const monthMatch = meta.name.match(/(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)/i);
          if (monthMatch) {
            const monthName = monthMatch[0].toUpperCase();
            monthPages[monthName] = meta.globalIndex;
            console.log(`Found ${monthName} overview at page ${meta.globalIndex}`);
          }
        }
        
        // Find day pages
        if (meta.type === 'DAY') {
          const monthMatch = meta.name.match(/(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)/i);
          const dayMatch = meta.name.match(/\b(\d+)\b/);
          
          if (monthMatch && dayMatch) {
            const monthName = monthMatch[0].toUpperCase();
            const dayNum = parseInt(dayMatch[0]);
            
            if (!dayPagesByMonth[monthName]) {
              dayPagesByMonth[monthName] = [];
            }
            
            dayPagesByMonth[monthName][dayNum - 1] = meta.globalIndex;
          }
        }
      });

      console.log('Month pages:', monthPages);
      console.log('Day pages by month:', dayPagesByMonth);

      // PASS 3: Add hyperlinks
      const pages = mergedPdf.getPages();
      const totalPages = pages.length;
      
      for (let i = 0; i < totalPages; i++) {
        setProgress(50 + Math.round(((i + 1) / totalPages) * 50));
        
        const page = pages[i];
        const pageMeta = allPageMetadata[i];
        
        // Add month tab links to every page
        MONTH_NAMES.forEach((month, idx) => {
          const targetPageIndex = monthPages[month.toUpperCase()];
          if (targetPageIndex !== undefined && targetPageIndex !== i) {
            const y = TAB_CONFIG.startY + (idx * TAB_CONFIG.height);
            createInternalLink(
              page,
              TAB_CONFIG.startX,
              y,
              TAB_CONFIG.width,
              TAB_CONFIG.height,
              targetPageIndex,
              mergedPdf
            );
          }
        });
        
        // If this is a month overview page, add calendar grid links
        if (pageMeta && pageMeta.type === 'MONTH') {
          const monthMatch = pageMeta.name.match(/(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)/i);
          if (monthMatch) {
            const monthName = monthMatch[0].toUpperCase();
            const dayPages = dayPagesByMonth[monthName] || [];
            
            console.log(`Adding calendar links for ${monthName} at page ${i}, ${dayPages.filter(p => p !== undefined).length} day links`);
            
            // Calculate calendar grid layout
            const monthOffset = MONTH_OFFSETS[monthName.toLowerCase()];
            if (monthOffset !== undefined) {
              const firstDay = new Date(CALENDAR_YEAR, monthOffset, 1).getDay();
              const daysInMonth = new Date(CALENDAR_YEAR, monthOffset + 1, 0).getDate();
              
              // Assume sunday start (adjust if needed)
              const startDay = "sunday";
              const offset = startDay === "monday" ? (firstDay === 0 ? 6 : firstDay - 1) : firstDay;
              
              for (let day = 1; day <= daysInMonth; day++) {
                const cellIndex = offset + day - 1;
                const row = Math.floor(cellIndex / GRID_CONFIG.cols);
                const col = cellIndex % GRID_CONFIG.cols;
                
                if (row >= GRID_CONFIG.rows) break;
                
                const targetPageIndex = dayPages[day - 1];
                if (targetPageIndex !== undefined && targetPageIndex !== i) {
                  const x = GRID_CONFIG.startX + (col * GRID_CONFIG.cellWidth);
                  const y = GRID_CONFIG.startY + (row * GRID_CONFIG.cellHeight);
                  
                  createInternalLink(
                    page,
                    x,
                    y,
                    GRID_CONFIG.cellWidth,
                    GRID_CONFIG.cellHeight,
                    targetPageIndex,
                    mergedPdf
                  );
                }
              }
            }
          }
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
          borderRadius: '6px'
        }}>
          <div style={{
            fontSize: '12px',
            color: '#166534',
            fontWeight: 'bold',
            marginBottom: '5px'
          }}>
            {progress < 40 ? 'Loading PDFs...' : progress < 50 ? 'Analyzing structure...' : 'Creating links...'} {progress}%
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
              transition: 'width 0.3s'
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
        💡 Tip: Re-export batches with latest version, then merge in order
      </p>
    </div>
  );
}
