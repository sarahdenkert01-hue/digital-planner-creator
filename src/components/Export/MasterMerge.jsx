import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';

export default function MasterMerge() {
  const [mergeProgress, setMergeProgress] = useState(null);

  const handleMasterMerge = async (files) => {
    if (files.length === 0) return;
    
    setMergeProgress(10);
    
    try {
      const mergedPdf = await PDFDocument.create();
      
      for (let i = 0; i < files.length; i++) {
        const arrayBuffer = await files[i].arrayBuffer();
        const donorPdf = await PDFDocument.load(arrayBuffer);
        const pagesToCopy = await mergedPdf.copyPages(donorPdf, donorPdf.getPageIndices());
        pagesToCopy.forEach(page => mergedPdf.addPage(page));
        setMergeProgress(Math.round(((i + 1) / files.length) * 100));
      }
      
      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = "Final_Complete_Planner_2026.pdf";
      link.click();
      
      alert("Success! Your master planner is ready.");
    } catch (err) {
      console.error(err);
      alert("Error merging PDFs.");
    }
    
    setMergeProgress(null);
  };

  return (
    <div style={{
      marginTop: '20px',
      padding: '15px',
      background: '#f0fdf4',
      borderRadius: '10px',
      border: '1px solid #bbf7d0',
      textAlign: 'center'
    }}>
      <h4 style={{
        fontSize: '11px',
        color: '#166534',
        margin: '0 0 5px 0',
        textTransform: 'uppercase'
      }}>
        📦 Step 2: Master Merge
      </h4>
      <p style={{
        fontSize: '10px',
        color: '#166534',
        marginBottom: '10px'
      }}>
        Combine exported batches into one final planner. 
      </p>
      {mergeProgress !== null ?  (
        <div style={{
          padding: '10px',
          background: 'white',
          borderRadius: '6px'
        }}>
          <p style={{ fontSize: '11px', color: '#166534', marginBottom: '8px' }}>
            Merging...  {mergeProgress}%
          </p>
          <div style={{
            width: '100%',
            height: '6px',
            background: '#e5e7eb',
            borderRadius: '3px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${mergeProgress}%`,
              height: '100%',
              background:  '#10b981',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      ) : (
        <label style={{
          display: 'block',
          padding: '10px',
          background: 'white',
          border: '2px dashed #bbf7d0',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '11px',
          color: '#166534',
          fontWeight: 'bold'
        }}>
          📁 Select PDF Batches
          <input
            type="file"
            multiple
            accept=".pdf"
            onChange={(e) => handleMasterMerge(Array.from(e.target.files))}
            style={{ display: 'none' }}
          />
        </label>
      )}
    </div>
  );
}
