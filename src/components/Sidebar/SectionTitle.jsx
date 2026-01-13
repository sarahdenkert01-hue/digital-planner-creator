import React from 'react';

export default function SectionTitle({ children }) {
  return (
    <h4 style={{
      fontSize: "12px",
      color: "##fab393",
      textTransform: "uppercase",
      marginTop: "15px",
      marginBottom: "5px"
    }}>
      {children}
    </h4>
  );
}
