import React from 'react';
import { Circle, Group, Text, Arrow, Rect } from 'react-konva';
import { NodeRenderer } from '../../../shared/components/NodeCanvas';

export interface FSMNode {
  id: string;
  x: number;
  y: number;
  isFinal: boolean;
  isInitial: boolean;
  output?: string; // For Moore machines
  transitions: FSMTransition[];
}

export interface FSMTransition {
  from: string;
  to: string;
  input: string;
  output?: string; // For Mealy machines
}

const FSMRenderer: NodeRenderer<FSMNode> = {
  renderNode: (node, isSelected, isHighlighted, onSelect, onDrag) => {
    const radius = 32;
    
    return (
      <Group
        key={node.id}
        x={node.x}
        y={node.y}
        draggable
        onDragEnd={(e) => onDrag(node.id, { x: e.target.x(), y: e.target.y() })}
        onClick={() => onSelect(node)}
      >
        {/* Initial state arrow */}
        {node.isInitial && (
          <Group>
            <Arrow
              points={[-60, 0, -radius - 5, 0]}
              pointerLength={8}
              pointerWidth={8}
              fill="#ff9800"
              stroke="#ff9800"
              strokeWidth={2}
            />
            <Text
              text="START"
              fontSize={10}
              fill="#ff9800"
              x={-80}
              y={-5}
              fontWeight="bold"
            />
          </Group>
        )}
        
        {/* Main circle */}
        <Circle
          radius={radius}
          fill={isSelected ? '#e8f5e8' : isHighlighted ? '#fff3e0' : '#fafafa'}
          stroke={isSelected ? '#4caf50' : isHighlighted ? '#ff9800' : '#9e9e9e'}
          strokeWidth={isSelected ? 3 : isHighlighted ? 2 : 1}
        />
        
        {/* Final state indicator */}
        {node.isFinal && (
          <Circle
            radius={radius - 5}
            stroke={isSelected ? '#4caf50' : '#9e9e9e'}
            strokeWidth={2}
            fill="transparent"
          />
        )}
        
        {/* Node label */}
        <Text
          text={node.id}
          fontSize={14}
          fill="#333"
          fontWeight="bold"
          x={-node.id.length * 3.5}
          y={-12}
          align="center"
        />
        
        {/* Output for Moore machine */}
        {node.output && (
          <Text
            text={`/${node.output}`}
            fontSize={11}
            fill="#666"
            x={-node.output.length * 3}
            y={3}
            align="center"
            fontStyle="italic"
          />
        )}
      </Group>
    );
  },

  renderTransition: (transition, isHighlighted, onClick) => {
    const label = transition.output 
      ? `${transition.input}/${transition.output}`  // Mealy
      : transition.input; // Moore or simple FSM
    
    return (
      <Group key={`${transition.from}-${transition.to}-${transition.input}`}>
        <Arrow
          points={[0, 0, 100, 100]}
          pointerLength={10}
          pointerWidth={10}
          fill={isHighlighted ? '#ff9800' : '#4caf50'}
          stroke={isHighlighted ? '#ff9800' : '#4caf50'}
          strokeWidth={2}
          onClick={() => onClick?.(transition)}
        />
        <Text
          text={label}
          fontSize={12}
          fill="#2e7d32"
          fontWeight="bold"
          x={30}
          y={35}
          align="center"
        />
      </Group>
    );
  },

  getNodeBounds: (node) => ({
    x: node.x - 32,
    y: node.y - 32,
    width: 64,
    height: 64
  }),

  getAllTransitions: (nodes) => {
    const transitions: FSMTransition[] = [];
    nodes.forEach(node => {
      node.transitions?.forEach(transition => {
        transitions.push(transition);
      });
    });
    return transitions;
  }
};

export default FSMRenderer;
