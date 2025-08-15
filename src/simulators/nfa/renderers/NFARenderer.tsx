import React from 'react';
import { Circle, Group, Text, Arrow, Path } from 'react-konva';
import { NodeRenderer } from '../../../shared/components/NodeCanvas';

export interface NFANode {
  id: string;
  x: number;
  y: number;
  isFinal: boolean;
  transitions: NFATransition[];
}

export interface NFATransition {
  from: string;
  to: string;
  symbol: string; // Can include 'ε' for epsilon transitions
}

const NFARenderer: NodeRenderer<NFANode> = {
  renderNode: (node, isSelected, isHighlighted, onSelect, onDrag) => {
    const radius = 30;
    
    return (
      <Group
        key={node.id}
        x={node.x}
        y={node.y}
        draggable
        onDragEnd={(e) => onDrag(node.id, { x: e.target.x(), y: e.target.y() })}
        onClick={() => onSelect(node)}
      >
        {/* Main circle with NFA styling */}
        <Circle
          radius={radius}
          fill={isSelected ? '#f3e5f5' : isHighlighted ? '#fce4ec' : '#f9f9f9'}
          stroke={isSelected ? '#9c27b0' : isHighlighted ? '#e91e63' : '#757575'}
          strokeWidth={isSelected ? 3 : isHighlighted ? 2 : 1}
          dash={[5, 5]} // Dashed border to distinguish from DFA
        />
        
        {/* Final state indicator */}
        {node.isFinal && (
          <Circle
            radius={radius - 5}
            stroke={isSelected ? '#9c27b0' : '#757575'}
            strokeWidth={1}
            fill="transparent"
            dash={[5, 5]}
          />
        )}
        
        {/* Node label */}
        <Text
          text={node.id}
          fontSize={16}
          fill="#333"
          x={-node.id.length * 4}
          y={-8}
          align="center"
          fontStyle="italic" // Italic to distinguish from DFA
        />
      </Group>
    );
  },

  renderTransition: (transition, isHighlighted, onClick) => {
    const isEpsilon = transition.symbol === 'ε';
    
    return (
      <Group key={`${transition.from}-${transition.to}-${transition.symbol}`}>
        <Arrow
          points={[0, 0, 100, 100]}
          pointerLength={10}
          pointerWidth={10}
          fill={isHighlighted ? '#e91e63' : isEpsilon ? '#9c27b0' : '#666'}
          stroke={isHighlighted ? '#e91e63' : isEpsilon ? '#9c27b0' : '#666'}
          strokeWidth={isEpsilon ? 3 : 2}
          dash={isEpsilon ? [8, 4] : undefined} // Dashed for epsilon
          onClick={() => onClick?.(transition)}
        />
        <Text
          text={transition.symbol}
          fontSize={14}
          fill={isEpsilon ? '#9c27b0' : '#333'}
          fontWeight={isEpsilon ? 'bold' : 'normal'}
          x={50}
          y={45}
        />
      </Group>
    );
  },

  getNodeBounds: (node) => ({
    x: node.x - 30,
    y: node.y - 30,
    width: 60,
    height: 60
  }),

  getAllTransitions: (nodes) => {
    const transitions: NFATransition[] = [];
    nodes.forEach(node => {
      node.transitions?.forEach(transition => {
        transitions.push(transition);
      });
    });
    return transitions;
  }
};

export default NFARenderer;
