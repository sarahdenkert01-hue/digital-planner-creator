import React, { useRef, useEffect } from 'react';
import { Image, Transformer } from 'react-konva';
import useImage from 'use-image';

const ImageBlock = React.memo(({ block, isSelected, onSelect, onChange }) => {
  const [img, status] = useImage(block.src, "anonymous");
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current && status === 'loaded' && ! block.locked) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected, status, block.locked]);

  if (status === 'failed') return null;

  return (
    <React.Fragment>
      <Image
        image={img}
        id={block.id}
        x={block.x}
        y={block.y}
        width={block.width}
        height={block.height}
        draggable={! block.locked}
        ref={shapeRef}
        onClick={onSelect}
        onDragEnd={(e) => onChange({ ...block, x: e.target.x(), y: e.target.y() })}
        onTransformEnd={() => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...block,
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math. max(5, node.height() * scaleY),
          });
        }}
        opacity={block.locked ? 0.9 : 1}
      />
      {isSelected && status === 'loaded' && ! block.locked && (
        <Transformer ref={trRef} keepRatio={true} />
      )}
    </React.Fragment>
  );
});

ImageBlock.displayName = 'ImageBlock';

export default ImageBlock;
