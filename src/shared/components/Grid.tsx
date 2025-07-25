'use client';

import React from 'react';
import { Line } from 'react-konva';

// Grid component props interface
interface GridProps {
  size: number;
  color: string;
  stageProps: {
    x: number;
    y: number;
    scale: number;
    draggable: boolean;
  };
}

const Grid: React.FC<GridProps> = ({ size, color, stageProps }) => {
  const lines = [];
  const stageWidth = typeof window !== 'undefined' ? window.innerWidth / stageProps.scale : 0;
  const stageHeight = typeof window !== 'undefined' ? window.innerHeight / stageProps.scale : 0;
  const startX = -stageProps.x / stageProps.scale;
  const startY = -stageProps.y / stageProps.scale;
  const endX = startX + stageWidth;
  const endY = startY + stageHeight;

  // Vertical lines
  for (let i = Math.floor(startX / size) * size; i < endX; i += size) {
    lines.push(
      <Line 
        key={`v${i}`} 
        points={[i, startY, i, endY]} 
        stroke={color} 
        strokeWidth={0.5}
        perfectDrawEnabled={false} 
        listening={false}
        shadowForStrokeEnabled={false}
      />
    );
  }
  
  // Horizontal lines
  for (let j = Math.floor(startY / size) * size; j < endY; j += size) {
    lines.push(
      <Line 
        key={`h${j}`} 
        points={[startX, j, endX, j]} 
        stroke={color} 
        strokeWidth={0.5}
        perfectDrawEnabled={false}
        listening={false}
        shadowForStrokeEnabled={false}
      />
    );
  }
  
  return <>{lines}</>;
};

export default Grid;