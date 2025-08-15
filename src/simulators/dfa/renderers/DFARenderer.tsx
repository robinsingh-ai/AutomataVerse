// src/simulators/dfa/renderers/DFARenderer.tsx

import React from 'react';
import { Circle, Group, Text, Arrow } from 'react-konva';
import { NodeRenderer } from '../../../shared/components/NodeCanvas';

export interface DFANode {
  id: string;
  x: number;
  y: number;
  isFinal: boolean;
  transitions: DFATransition[];
}

export interface DFATransition {
  from: string;
  to: string;
  symbol: string;
}

const getDistance = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy) || 1;
};

const getAdjustedArrowPoints = (
  from: { x: number; y: number },
  to: { x: number; y: number },
  radius: number
): [number, number, number, number] => {
  const dist = getDistance(from, to);
  const ux = (to.x - from.x) / dist;
  const uy = (to.y - from.y) / dist;

  const startX = from.x + ux * radius;
  const startY = from.y + uy * radius;
  const endX = to.x - ux * radius;
  const endY = to.y - uy * radius;

  return [startX, startY, endX, endY];
};

const DFARenderer: NodeRenderer<DFANode> = {
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
        <Circle
          radius={radius}
          fill={isSelected ? '#e3f2fd' : isHighlighted ? '#fff3e0' : '#f5f5f5'}
          stroke={isSelected ? '#1976d2' : isHighlighted ? '#ff9800' : '#9e9e9e'}
          strokeWidth={isSelected ? 3 : isHighlighted ? 2 : 1}
        />
        {node.isFinal && (
          <Circle
            radius={radius - 5}
            stroke={isSelected ? '#1976d2' : '#9e9e9e'}
            strokeWidth={1}
            fill="transparent"
          />
        )}
        <Text text={node.id} fontSize={16} fill="#333" x={-node.id.length * 4} y={-8} />
      </Group>
    );
  },

  renderTransition: (transition, isHighlighted, onClick) => {
    const fromX = (transition as any).fromX;
    const fromY = (transition as any).fromY;
    const toX = (transition as any).toX;
    const toY = (transition as any).toY;

    let points: number[] = [0, 0, 60, 0];
    const NODE_RADIUS = 30;

    if (
      typeof fromX === 'number' &&
      typeof fromY === 'number' &&
      typeof toX === 'number' &&
      typeof toY === 'number'
    ) {
      const [sx, sy, ex, ey] = getAdjustedArrowPoints(
        { x: fromX, y: fromY },
        { x: toX, y: toY },
        NODE_RADIUS
      );
      points = [sx, sy, ex, ey];
    }

    const midX = (points[0] + points[2]) / 2;
    const midY = (points[1] + points[3]) / 2;

    return (
      <Group
        key={`${transition.from}-${transition.to}-${transition.symbol}`}
        onClick={() => onClick?.(transition)}
      >
        <Arrow
          points={points}
          pointerLength={10}
          pointerWidth={10}
          fill={isHighlighted ? '#ff9800' : '#666'}
          stroke={isHighlighted ? '#ff9800' : '#666'}
          strokeWidth={2}
        />
        <Text
          text={transition.symbol}
          fontSize={14}
          fill="#333"
          x={midX - (transition.symbol?.length || 1) * 3.5}
          y={midY - 16}
        />
      </Group>
    );
  },

  getNodeBounds: (node) => ({
    x: node.x - 30,
    y: node.y - 30,
    width: 60,
    height: 60,
  }),

  getAllTransitions: (nodes) => {
    const transitions: DFATransition[] = [];
    nodes.forEach((node) => {
      node.transitions?.forEach((t) => {
        (t as any).fromX = node.x;
        (t as any).fromY = node.y;
        const toNode = nodes.find((n) => n.id === t.to);
        if (toNode) {
          (t as any).toX = toNode.x;
          (t as any).toY = toNode.y;
        }
        transitions.push(t);
      });
    });
    return transitions;
  },
};

export default DFARenderer;
