import React from 'react';

export default function SectionTitle({ children }) {
  return (
    <h4 style={{
      fontSize: "10px",
      color: "#888",
      textTransform: "uppercase",
      marginTop: "15px",
      marginBottom: "5px"
    }}>
      {children}
    </h4>
  );
}
