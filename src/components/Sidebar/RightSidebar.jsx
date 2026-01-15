import React from 'react';
import PageList from './PageList';
import SectionTitle from './SectionTitle';
import { STYLES } from '../../constants';

export default function RightSidebar({
  pages,
  currentPageIndex,
  isMobile,
  onAddBlankPage,
  onDuplicatePage,
  onClearPage,
  onApplyLayoutToNext,
  onMovePage,
  onSetCurrentPage,
  onRenamePage
}) {
  return (
    <div style={{
      width: isMobile ? '100vw' : "320px",
      maxWidth: isMobile ? '100%' : '320px',
      background: "white",
      padding: isMobile ? '15px' : "20px",
      overflowY: "auto",
      borderLeft: isMobile ? 'none' : "1px solid #ddd",
      position: isMobile ? 'fixed' : 'relative',
      top: isMobile ? 0 : 'auto',
      right: isMobile ? 0 : 'auto',
      zIndex: isMobile ? 999 : 'auto',
      height: isMobile ? '100vh' : 'auto',
      boxShadow: isMobile ? '-2px 0 8px rgba(0,0,0,0.1)' : 'none'
    }}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>
        Page Management
      </h2>
      
      <p style={{ fontSize: '10px', color: '#666', marginBottom:  '8px', lineHeight: '1.4' }}>
        Use the buttons below to manage your planner pages. Once a new page is added, click on it below to rename it. Click and drag to rearrange. Note: Do not rearrange pages within a monthly spread. 
      </p>
      
      {/* Page Management Buttons */}
      <div style={{ display: 'flex', gap: '5px', marginBottom: '5px' }}>
        <button onClick={onAddBlankPage} style={STYLES.smallBtn}>
          ➕ Add
        </button>
        <button onClick={onDuplicatePage} style={STYLES.smallBtn}>
          👯 Copy
        </button>
        <button onClick={onClearPage} style={{ ...STYLES.smallBtn, color: '#ff4d4f' }}>
          🧹 Clear
        </button>
      </div>
      <button
        onClick={onApplyLayoutToNext}
        style={{
          width: '100%',
          padding: '10px',
          background: '#ffc8b0',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontWeight: 'bold',
          marginBottom: '10px',
          cursor: 'pointer'
        }}
      >
        Apply Layout to Next →
      </button>

      {/* Page List */}
      <PageList
        pages={pages}
        currentPageIndex={currentPageIndex}
        onMovePage={onMovePage}
        onSetCurrentPage={onSetCurrentPage}
        onRenamePage={onRenamePage}
      />
    </div>
  );
}
