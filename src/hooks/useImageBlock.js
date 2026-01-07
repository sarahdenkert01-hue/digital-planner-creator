import { useRef, useEffect } from 'react';
import useImage from 'use-image';

export function useImageBlock(block, isSelected) {
  const [img, status] = useImage(block.src, "anonymous");
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current && status === 'loaded' && ! block.locked) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected, status, block.locked]);

  return {
    img,
    status,
    shapeRef,
    trRef
  };
}
