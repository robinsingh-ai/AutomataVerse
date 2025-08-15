import React from 'react';
import { Circle, Group, Text, Arrow, Rect, Line } from 'react-konva';
import { NodeRenderer } from '../../../shared/components/NodeCanvas';

export interface TMNode {
  id: string;
  x: number;
  y: number;
  isFinal: boolean;
  isReject: boolean; // TM can have explicit reject states
  transitions: TMTransition[];
}

export interface TMTransition {
  from: string;
  to: string;
  readSymbol: string;
  writeSymbol: string;
  direction: 'L' | 'R' | 'S'; // Left, Right, Stay
}

const TMRenderer: NodeRenderer<TMNode> = {
  renderNode: (node, isSelected, isHighlighted, onSelect, onDrag) => {
    const radius = 35;
    const fillColor = node.isReject ? '#ffebee' : 
                     isSelected ? '#e3f2fd' : 
                     isHighlighted ? '#fff3e0' : '#fafafa';
    const strokeColor = node.isReject ? '#f44336' :
                       isSelected ? '#2196f3' : 
                       isHighlighted ? '#ff9800' : '#616161';
    
    return (
      <Group
        key={node.id}
        x={node.x}
        y={node.y}
        draggable
        onDragEnd={(e) => onDrag(node.id, { x: e.target.x(), y: e.target.y() })}
        onClick={() => onSelect(node)}
      >
        {/* Tape head indicator (small rectangle above) */}
        <Rect
          x={-6}
          y={-radius - 15}
          width={12}
          height={8}
          fill={strokeColor}
          cornerRadius={2}
        />
        <Line
          points={[0, -radius - 7, 0, -radius + 3]}
          stroke={strokeColor}
          strokeWidth={2}
        />
        
        {/* Main circle */}
        <Circle
          radius={radius}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={isSelected ? 3 : isHighlighted ? 2 : 2}
        />
        
        {/* Final/Accept state indicator */}
        {node.isFinal && (
          <Circle
            radius={radius - 5}
            stroke="#4caf50"
            strokeWidth={3}
            fill="transparent"
          />
        )}
        
        {/* Reject state indicator */}
        {node.isReject && (
          <>
            <Line points={[-15, -15, 15, 15]} stroke="#f44336" strokeWidth={3} />
            <Line points={[-15, 15, 15, -15]} stroke="#f44336" strokeWidth={3} />
          </>
        )}
        
        {/* Node label */}
        <Text
          text={node.id}
          fontSize={16}
          fill={node.isReject ? '#f44336' : '#333'}
          fontWeight="bold"
          x={-node.id.length * 4}
          y={-8}
          align="center"
        />
      </Group>
    );
  },

  renderTransition: (transition, isHighlighted, onClick) => {
    const label = `${transition.readSymbol}→${transition.writeSymbol},${transition.direction}`;
    
    return (
      <Group key={`${transition.from}-${transition.to}-${label}`}>
        <Arrow
          points={[0, 0, 100, 100]}
          pointerLength={14}
          pointerWidth={14}
          fill={isHighlighted ? '#ff9800' : '#2196f3'}
          stroke={isHighlighted ? '#ff9800' : '#2196f3'}
          strokeWidth={3}
          onClick={() => onClick?.(transition)}
        />
        <Text
          text={label}
          fontSize={11}
          fill="#1565c0"
          fontWeight="bold"
          x={25}
          y={30}
          align="center"
        />
      </Group>
    );
  },

  getNodeBounds: (node) => ({
    x: node.x - 35,
    y: node.y - 50, // Account for tape head
    width: 70,
    height: 85
  }),

  getAllTransitions: (nodes) => {
    const transitions: TMTransition[] = [];
    nodes.forEach(node => {
      node.transitions?.forEach(transition => {
        transitions.push(transition);
      });
    });
    return transitions;
  }
};

export default TMRenderer;
