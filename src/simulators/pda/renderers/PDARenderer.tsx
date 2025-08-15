import React from 'react';
import { Circle, Group, Text, Arrow, Rect } from 'react-konva';
import { NodeRenderer } from '../../../shared/components/NodeCanvas';

export interface PDANode {
  id: string;
  x: number;
  y: number;
  isFinal: boolean;
  transitions: PDATransition[];
}

export interface PDATransition {
  from: string;
  to: string;
  inputSymbol: string; // Input symbol (can be ε)
  popSymbol: string;   // Symbol to pop from stack (can be ε)
  pushSymbol: string;  // Symbol to push to stack (can be ε)
}

const PDARenderer: NodeRenderer<PDANode> = {
  renderNode: (node, isSelected, isHighlighted, onSelect, onDrag) => {
    const radius = 35; // Slightly larger for PDA
    
    return (
      <Group
        key={node.id}
        x={node.x}
        y={node.y}
        draggable
        onDragEnd={(e) => onDrag(node.id, { x: e.target.x(), y: e.target.y() })}
        onClick={() => onSelect(node)}
      >
        {/* Stack representation (small rectangle) */}
        <Rect
          x={radius + 5}
          y={-10}
          width={8}
          height={20}
          fill={isSelected ? '#4caf50' : '#81c784'}
          stroke="#2e7d32"
          strokeWidth={1}
        />
        
        {/* Main circle */}
        <Circle
          radius={radius}
          fill={isSelected ? '#e8f5e8' : isHighlighted ? '#fff3e0' : '#f1f8e9'}
          stroke={isSelected ? '#4caf50' : isHighlighted ? '#ff9800' : '#8bc34a'}
          strokeWidth={isSelected ? 3 : isHighlighted ? 2 : 2}
        />
        
        {/* Final state indicator */}
        {node.isFinal && (
          <Circle
            radius={radius - 5}
            stroke={isSelected ? '#4caf50' : '#8bc34a'}
            strokeWidth={2}
            fill="transparent"
          />
        )}
        
        {/* Node label */}
        <Text
          text={node.id}
          fontSize={16}
          fill="#1b5e20"
          fontWeight="bold"
          x={-node.id.length * 4}
          y={-8}
          align="center"
        />
      </Group>
    );
  },

  renderTransition: (transition, isHighlighted, onClick) => {
    const label = `${transition.inputSymbol},${transition.popSymbol}→${transition.pushSymbol}`;
    
    return (
      <Group key={`${transition.from}-${transition.to}-${label}`}>
        <Arrow
          points={[0, 0, 100, 100]}
          pointerLength={12}
          pointerWidth={12}
          fill={isHighlighted ? '#ff9800' : '#4caf50'}
          stroke={isHighlighted ? '#ff9800' : '#4caf50'}
          strokeWidth={3}
          onClick={() => onClick?.(transition)}
        />
        {/* Multi-line transition label */}
        <Text
          text={label}
          fontSize={12}
          fill="#1b5e20"
          fontWeight="bold"
          x={30}
          y={35}
          align="center"
        />
      </Group>
    );
  },

  getNodeBounds: (node) => ({
    x: node.x - 35,
    y: node.y - 35,
    width: 70,
    height: 70
  }),

  getAllTransitions: (nodes) => {
    const transitions: PDATransition[] = [];
    nodes.forEach(node => {
      node.transitions?.forEach(transition => {
        transitions.push(transition);
      });
    });
    return transitions;
  }
};

export default PDARenderer;
