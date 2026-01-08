import React from 'react';

export default function LibraryBtn({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: "6px",
        background: "#fff",
        border: "1px solid #e2e8f0",
        textAlign: "left",
        cursor: "pointer",
        fontSize:  "11px",
        marginBottom: '2px'
      }}
    >
      {children}
    </button>
  );
}
