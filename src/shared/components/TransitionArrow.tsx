import React from 'react';
import { Arrow, Text, Group } from 'react-konva';

interface TransitionArrowProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  label: string;
  isHighlighted?: boolean;
  onClick?: () => void;
  curved?: boolean;
}

const TransitionArrow: React.FC<TransitionArrowProps> = ({
  from,
  to,
  label,
  isHighlighted = false,
  onClick,
  curved = false
}) => {
  // Calculate arrow points
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Adjust for node radius (30px)
  const nodeRadius = 30;
  const startX = from.x + (dx / distance) * nodeRadius;
  const startY = from.y + (dy / distance) * nodeRadius;
  const endX = to.x - (dx / distance) * nodeRadius;
  const endY = to.y - (dy / distance) * nodeRadius;
  
  // Label position (midpoint)
  const labelX = (startX + endX) / 2;
  const labelY = (startY + endY) / 2 - 15;

  return (
    <Group onClick={onClick}>
      <Arrow
        points={[startX, startY, endX, endY]}
        pointerLength={10}
        pointerWidth={10}
        fill={isHighlighted ? '#ff9800' : '#666'}
        stroke={isHighlighted ? '#ff9800' : '#666'}
        strokeWidth={isHighlighted ? 3 : 2}
      />
      <Text
        text={label}
        fontSize={12}
        fill={isHighlighted ? '#ff9800' : '#333'}
        fontWeight={isHighlighted ? 'bold' : 'normal'}
        x={labelX - label.length * 3}
        y={labelY}
      />
    </Group>
  );
};

export default TransitionArrow;
