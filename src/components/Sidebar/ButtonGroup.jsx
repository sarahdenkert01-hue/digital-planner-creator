import React from 'react';
import LibraryBtn from './LibraryBtn';

export default function ButtonGroup({ items, onClick, layout = "column" }) {
  return (
    <div style={{
      display: layout === "column" ? "flex" : "grid",
      flexDirection: layout === "column" ? "column" : undefined,
      gridTemplateColumns: layout === "grid" ? "1fr 1fr" : undefined,
      gap: layout === "grid" ? "4px" : "2px"
    }}>
      {items.map((item) => (
        <LibraryBtn key={item.id} onClick={() => onClick(item.id)}>
          {item.label}
        </LibraryBtn>
      ))}
    </div>
  );
}
