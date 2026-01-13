import React, { useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';
import ImageBlock from './ImageBlock';
import { CANVAS_CONFIG } from '../../constants';

const { WIDTH, HEIGHT, VIEW_SCALE } = CANVAS_CONFIG;

export default function PlannerCanvas({
  currentPage,
  selectedId,
  onSelectBlock,
  onUpdateBlock,
  onToggleLock,   // ADD THIS
  onDeleteBlock,  // ADD THIS
  stageRef
}) {
  const [bgImg, bgStatus] = useImage(currentPage?. bg ?  `/${currentPage.bg}` : null, 'anonymous');

  // Deselect when clicking stage background
  const handleStageClick = (e) => {
    if (e.target === e.target.getStage()) {
      onSelectBlock(null);
    }
  };

  if (!currentPage) {
    return (
      <div style={{
        flex: 1,
        display:  'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f0f2f5'
      }}>
        <p style={{ color: '#888' }}>No page selected</p>
      </div>
    );
  }

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: '20px',
      overflow: 'auto',
      background: '#f0f2f5'
    }}>
      <div style={{
        width: WIDTH * VIEW_SCALE,
        height:  HEIGHT * VIEW_SCALE,
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        background: 'white',
        position: 'relative',
        borderRadius: '4px'
      }}>
        <div style={{
          transform: `scale(${VIEW_SCALE})`,
          transformOrigin: 'top left',
          width: WIDTH,
          height:  HEIGHT
        }}>
          <Stage
            width={WIDTH}
            height={HEIGHT}
            ref={stageRef}
            onClick={handleStageClick}
            onTap={handleStageClick}
          >
            <Layer>
              {/* White background */}
              <Rect width={WIDTH} height={HEIGHT} fill="white" />
              
              {/* Background image */}
              {bgStatus === 'loaded' && bgImg && (
                <KonvaImage
                  image={bgImg}
                  width={WIDTH}
                  height={HEIGHT}
                />
              )}
              
              {/* All blocks on the page */}
              {currentPage.blocks.map((block) => (
                <ImageBlock
                  key={block.id}
                  block={block}
                  isSelected={block.id === selectedId}
                  onSelect={() => onSelectBlock(block.id)}
                  onChange={onUpdateBlock}
                  onToggleLock={onToggleLock}      // ADD THIS
                  onDelete={onDeleteBlock}         // ADD THIS
                />
              ))}
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  );
}
