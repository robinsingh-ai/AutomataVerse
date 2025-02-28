'use client';

import React from 'react';
import { Circle, Arrow, Text, Shape, Group, Image, Rect } from 'react-konva';
import Grid from './Grid';
import { NodeCanvasProps } from '../type';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';

// Define a type for the points returned by different calculation functions
type ArrowPoints = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};

type CurvedArrowPoints = ArrowPoints & {
  controlX: number;
  controlY: number;
};

const NodeCanvas: React.FC<NodeCanvasProps> = ({
  nodes,
  showGrid,
  stageProps,
  nodeMap,
  highlightedTransition,
  selectedNode,
  finiteNodes,
  currNode,
  showQuestion,
  image,
  handleNodeClick,
  handleDragMove,
  handleDragStart,
  handleDragEnd,
  isDraggingNode,
  nodeMouseDown,
  nodeMouseUp
}) => {
  // Grid is now a separate component

  // Node and transition rendering functions
  const calculateArrowPoints = (sourceX: number, sourceY: number, targetX: number, targetY: number, radius: number) => {
    const angle = Math.atan2(targetY - sourceY, targetX - sourceX);
    const startX = sourceX + radius * Math.cos(angle);
    const startY = sourceY + radius * Math.sin(angle);
    const endX = targetX - (radius + 2) * Math.cos(angle);
    const endY = targetY - (radius + 2) * Math.sin(angle);

    return { startX, startY, endX, endY };
  };

  const calculateCurvedArrowPoints = (
    sourceX: number,
    sourceY: number,
    targetX: number,
    targetY: number,
    radiusFactor: number,
    nodeRadius = 20
  ) => {
    const distance = Math.sqrt(
      Math.pow(targetX - sourceX, 2) + Math.pow(targetY - sourceY, 2)
    );
    const centerX = (sourceX + targetX) / 2;
    const centerY = (sourceY + targetY) / 2;
  
    const angle = Math.atan2(targetY - sourceY, targetX - sourceX);
    const curveOffset = distance / radiusFactor;
  
    const controlX =
      centerX + curveOffset * Math.cos(angle + Math.PI / 2) * -1;
    const controlY =
      centerY + curveOffset * Math.sin(angle + Math.PI / 2) * -1;
  
    const angleToTarget = Math.atan2(targetY - controlY, targetX - controlX);
  
    const endX = targetX - (nodeRadius + 9) * Math.cos(angleToTarget);
    const endY = targetY - (nodeRadius + 9) * Math.sin(angleToTarget);
  
    const angleToSource = Math.atan2(sourceY - controlY, sourceX - controlX);
    const startX = sourceX - (nodeRadius + 9) * Math.cos(angleToSource);
    const startY = sourceY - (nodeRadius + 9) * Math.sin(angleToSource);
  
    return {
      startX,
      startY,
      endX,
      endY,
      controlX,
      controlY,
    };
  };

  const calculateCurveStrength = (x1: number, y1: number, x2: number, y2: number) => {
    const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    return Math.max(6, distance / 60);
  };

  const drawSelfLoop = (x: number, y: number, label: string, index: number) => {
    const radius = 20;
    const loopRadius = 20;
    const angleOffset = Math.PI;
    const startAngle = -Math.PI - angleOffset;
    const endAngle = -Math.PI / 19 + angleOffset;
    const loopX = x;
    const loopY = y - radius - loopRadius;
    const arrowAngle = Math.PI / 18;

    return (
      <Group key={`self-loop-${index}`}>
        <Shape
          sceneFunc={(context: Konva.Context, shape: Konva.Shape) => {
            context.beginPath();
            context.arc(loopX, loopY, loopRadius, startAngle, endAngle, false);
            context.stroke();
            context.closePath();
            context.strokeShape(shape);
          }}
          stroke="black"
          strokeWidth={2}
        />
        <Arrow
          points={[
            loopX + loopRadius * Math.cos(arrowAngle),
            loopY + loopRadius * Math.sin(arrowAngle),
            loopX + loopRadius * Math.cos(arrowAngle + Math.PI / 6),
            loopY + loopRadius * Math.sin(arrowAngle + Math.PI / 6),
          ]}
          stroke="black"
          fill="black"
          pointerLength={10}
          pointerWidth={10}
        />
        <Text
          x={loopX - label.length * 3 - 3}
          y={loopY - loopRadius - 18}
          text={label}
          fontSize={16}
          fill="black"
          align="center"
          verticalAlign="middle"
        />
      </Group>
    );
  };

  // Helper function for curved arrow label position
  const calculateMidpointX = (startX: number, controlX: number, endX: number) => {
    return ((startX + 2 * controlX + endX) / 4 - 3);
  };
  
  const calculateMidpointY = (startY: number, controlY: number, endY: number) => {
    return (startY + 2 * controlY + endY) / 4 - 8;
  };

  return (
    <>
      {/* Grid Background */}
      {showGrid && <Grid size={20} color="#9c9c9c" stageProps={stageProps} />}

      {/* Draw all transitions */}
      {nodes.map((node) => {
        return node.transitions.map((transition, i) => {
          const targetNode = nodeMap[transition.targetid];
          if (!targetNode) return null;

          if (node.id === targetNode.id) {
            // Self-referencing transition (loop)
            const radius = 30;
            const angle = -Math.PI / 4; // 45 degrees upward
            const offsetX = Math.cos(angle) * radius;
            const offsetY = Math.sin(angle) * radius;
            const midX = node.x + offsetX * 2;
            const midY = node.y + offsetY * 2;

            const controlPoints = {
              startX: node.x + offsetX,
              startY: node.y + offsetY,
              endX: node.x + offsetX,
              endY: node.y + offsetY,
              controlX: midX,
              controlY: midY,
            };

            return (
              <Group key={`transition-${node.id}-${targetNode.id}-${i}`}>
                <Shape
                  sceneFunc={(context, shape) => {
                    context.beginPath();
                    context.moveTo(controlPoints.startX, controlPoints.startY);
                    context.quadraticCurveTo(
                      controlPoints.controlX,
                      controlPoints.controlY,
                      controlPoints.endX,
                      controlPoints.endY
                    );
                    context.fillStrokeShape(shape);
                  }}
                  stroke={
                    highlightedTransition.d?.targetid === targetNode.id &&
                    highlightedTransition.target === node.id
                      ? "red"
                      : "black"
                  }
                  strokeWidth={2}
                />
                <Arrow
                  points={[
                    controlPoints.endX,
                    controlPoints.endY,
                    controlPoints.endX - 10,
                    controlPoints.endY - 10,
                  ]}
                  pointerLength={7}
                  pointerWidth={7}
                  fill={
                    highlightedTransition.d?.targetid === targetNode.id &&
                    highlightedTransition.target === node.id
                      ? "red"
                      : "black"
                  }
                  stroke={
                    highlightedTransition.d?.targetid === targetNode.id &&
                    highlightedTransition.target === node.id
                      ? "red"
                      : "black"
                  }
                  strokeWidth={2}
                />
                <Text
                  text={transition.label}
                  x={controlPoints.controlX}
                  y={controlPoints.controlY - 15}
                  fontSize={16}
                  fill={
                    highlightedTransition.d?.targetid === targetNode.id &&
                    highlightedTransition.target === node.id
                      ? "red"
                      : "black"
                  }
                  align="center"
                />
              </Group>
            );
          } else {
            // Regular transition between different nodes
            const points = calculateArrowPoints(
              node.x,
              node.y,
              targetNode.x,
              targetNode.y,
              30 // radius
            );

            // Calculate midpoint for the label
            const midX = (points.startX + points.endX) / 2;
            const midY = (points.startY + points.endY) / 2;

            // Add a little offset to avoid overlapping with the line
            const angle = Math.atan2(
              points.endY - points.startY,
              points.endX - points.startX
            );
            const labelOffsetX = Math.sin(angle) * 15;
            const labelOffsetY = -Math.cos(angle) * 15;

            return (
              <Group key={`transition-${node.id}-${targetNode.id}-${i}`}>
                <Arrow
                  points={[
                    points.startX,
                    points.startY,
                    points.endX,
                    points.endY,
                  ]}
                  pointerLength={7}
                  pointerWidth={7}
                  fill={
                    highlightedTransition.d?.targetid === targetNode.id &&
                    highlightedTransition.target === node.id
                      ? "red"
                      : "black"
                  }
                  stroke={
                    highlightedTransition.d?.targetid === targetNode.id &&
                    highlightedTransition.target === node.id
                      ? "red"
                      : "black"
                  }
                  strokeWidth={2}
                />
                <Text
                  text={transition.label}
                  x={midX + labelOffsetX}
                  y={midY + labelOffsetY}
                  fontSize={16}
                  fill={
                    highlightedTransition.d?.targetid === targetNode.id &&
                    highlightedTransition.target === node.id
                      ? "red"
                      : "black"
                  }
                  align="center"
                />
              </Group>
            );
          }
        });
      })}

      {/* Draw all nodes */}
      {nodes.map((node) => {
        const isInitialNode = nodes.length > 0 && node.id === nodes[0].id;
        const isSelectedNode = selectedNode && node.id === selectedNode.id;
        const isCurrentNode = currNode && node.id === currNode.id;
        const isFinalNode = finiteNodes.has(node.id);

        return (
          <Group key={`node-${node.id}`}>
            {/* Initial node indicator (small arrow pointing to the initial state) */}
            {isInitialNode && (
              <Arrow
                points={[node.x - 60, node.y, node.x - 30, node.y]}
                pointerLength={10}
                pointerWidth={10}
                fill="black"
                stroke="black"
                strokeWidth={2}
              />
            )}

            {/* Final state indicator (double circle for accepting states) */}
            {isFinalNode && (
              <Circle
                x={node.x}
                y={node.y}
                radius={35}
                stroke="black"
                strokeWidth={2}
              />
            )}

            {/* The main circle for the node */}
            <Circle
              x={node.x}
              y={node.y}
              radius={30}
              fill={isCurrentNode ? "lightgreen" : "white"}
              stroke={isSelectedNode ? "blue" : "black"}
              strokeWidth={isSelectedNode ? 3 : 2}
              draggable
              onDragStart={(e) => {
                if (handleDragStart) {
                  handleDragStart(e, node.id);
                } else if (nodeMouseDown) {
                  nodeMouseDown();
                }
              }}
              onDragMove={(e) => handleDragMove(e, node.id)}
              onDragEnd={(e) => {
                if (handleDragEnd) {
                  handleDragEnd(e, node.id);
                } else if (nodeMouseUp) {
                  nodeMouseUp();
                }
              }}
              onClick={() => handleNodeClick(node)}
              onTap={() => handleNodeClick(node)}
            />

            {/* Node label (q0, q1, etc.) */}
            <Text
              text={node.id}
              x={node.x - 10}
              y={node.y - 8}
              fontSize={16}
              fill="black"
              draggable={false}
            />
          </Group>
        );
      })}
    </>
  );
};

export default NodeCanvas;