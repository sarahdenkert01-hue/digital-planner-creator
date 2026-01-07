import React from 'react';
import SectionTitle from './SectionTitle';
import ButtonGroup from './ButtonGroup';

export default function LibrarySection({ title, items, onItemClick, layout = "column" }) {
  return (
    <>
      <SectionTitle>{title}</SectionTitle>
      <ButtonGroup items={items} onClick={onItemClick} layout={layout} />
    </>
  );
}
