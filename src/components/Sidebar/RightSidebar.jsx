import React from 'react';
import PageList from './PageList';
import SectionTitle from './SectionTitle';
import { STYLES } from '../../constants';

export default function RightSidebar({
  pages,
  currentPageIndex,
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
      width: "320px",
      background: "white",
      padding: "20px",
      overflowY: "auto",
      borderLeft: "1px solid #ddd"
    }}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>
        Page Management
      </h2>

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
