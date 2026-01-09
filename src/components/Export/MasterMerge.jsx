import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';

export default function MasterMerge() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleMerge = async (files) => {
    if (files.length === 0) {
      alert('Please select at least one PDF file to merge.');
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      // Create new merged PDF
      const mergedPdf = await PDFDocument.create();
      let totalPageOffset = 0; // Track cumulative page count for link updates

      for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
        setProgress(Math.round(((fileIndex + 1) / files.length) * 100));

        const arrayBuffer = await files[fileIndex]. arrayBuffer();
        const donorPdf = await PDFDocument.load(arrayBuffer);
        const pageCount = donorPdf.getPageCount();

        // Copy all pages from this PDF
        const copiedPages = await mergedPdf.copyPages(donorPdf, donorPdf.getPageIndices());
        
        // Add each copied page and update its annotations
        for (let pageIndex = 0; pageIndex < copiedPages.length; pageIndex++) {
          const page = copiedPages[pageIndex];
          mergedPdf.addPage(page);

          // Get the original page to access annotations
          const originalPage = donorPdf.getPage(pageIndex);
          const annotations = originalPage.node. Annots();

          if (annotations) {
            const annotArray = annotations.asArray();
            
            // Process each annotation (link)
            for (let i = 0; i < annotArray.length; i++) {
              const annot = annotArray[i];
              const annotDict = annot.dict;
              
              // Check if it's a link annotation
              const subtype = annotDict.get(donorPdf.context.obj('Subtype'));
              if (subtype && subtype.toString() === '/Link') {
                const dest = annotDict.get(donorPdf.context.obj('Dest'));
                const action = annotDict.get(donorPdf.context.obj('A'));
                
                // Handle explicit destinations
                if (dest && dest.asArray) {
                  const destArray = dest.asArray();
                  if (destArray.length > 0) {
                    const targetPageRef = destArray[0];
                    
                    // Find which page this reference points to
                    for (let targetIdx = 0; targetIdx < pageCount; targetIdx++) {
                      const targetPage = donorPdf.getPage(targetIdx);
                      if (targetPage.ref === targetPageRef) {
                        // Update the destination to point to the new page number
                        const newPageIndex = totalPageOffset + targetIdx;
                        const newPage = mergedPdf.getPage(newPageIndex);
                        destArray[0] = newPage. ref;
                        break;
                      }
                    }
                  }
                }
                
                // Handle action-based links
                if (action) {
                  const actionDict = action.dict || action;
                  const actionDest = actionDict.get(donorPdf.context.obj('D'));
                  
                  if (actionDest && actionDest.asArray) {
                    const destArray = actionDest.asArray();
                    if (destArray.length > 0) {
                      const targetPageRef = destArray[0];
                      
                      for (let targetIdx = 0; targetIdx < pageCount; targetIdx++) {
                        const targetPage = donorPdf.getPage(targetIdx);
                        if (targetPage.ref === targetPageRef) {
                          const newPageIndex = totalPageOffset + targetIdx;
                          const newPage = mergedPdf.getPage(newPageIndex);
                          destArray[0] = newPage.ref;
                          break;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }

        totalPageOffset += pageCount;
      }

      // Save the merged PDF
      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'Complete_Planner_2026_Merged.pdf';
      link. click();

      alert('✅ Success! Your complete planner with working hyperlinks is ready.');

    } catch (error) {
      console.error('Merge error:', error);
      alert('❌ Merge failed:  ' + error.message);
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
        <strong>Hyperlinks will be preserved!</strong>
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
            Merging...  {progress}%
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
