import React from 'react';
import { pageBtn, moveBtn } from '../../constants';

export default function PageList({ pages, currentPageIndex, onMovePage, onSetCurrentPage, onRenamePage }) {
  return (
    <div style={{
      maxHeight: "250px",
      overflowY: "auto",
      border: '1px solid #eee',
      borderRadius: '4px',
      marginBottom: '15px'
    }}>
      {pages.map((p, idx) => (
        <div
          key={p.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            background: currentPageIndex === idx ? "#f8fafc" : "transparent",
            borderBottom: '1px solid #eee'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', padding: '2px' }}>
            <button onClick={() => onMovePage(idx, -1)} style={moveBtn}>
              ▲
            </button>
            <button onClick={() => onMovePage(idx, 1)} style={moveBtn}>
              ▼
            </button>
          </div>
          <button
            onClick={() => onSetCurrentPage(idx)}
            style={{
              ... pageBtn(currentPageIndex === idx),
              flex: 1,
              border: 'none',
              background: 'none',
              textAlign: 'left',
              cursor: 'pointer'
            }}
          >
            {idx + 1}.  {p.name}
          </button>
          <button
            onClick={(e) => {
              e. stopPropagation();
              onRenamePage(idx);
            }}
            style={{
              padding: '8px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              opacity: 0.6
            }}
          >
            ✏️
          </button>
        </div>
      ))}
    </div>
  );
}
