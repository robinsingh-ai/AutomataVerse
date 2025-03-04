'use client';

import React, { useState, useEffect } from 'react';
import { Circle, Arrow, Text, Shape, Group, Rect } from 'react-konva';
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
  highlightedTransitions,
  highlightedNodes,
  selectedNode,
  finiteNodes,
  currNodes,
  showQuestion,
  handleNodeClick,
  handleDragMove,
  nodeMouseDown,
  nodeMouseUp
}) => {
  // Add animation state
  const [animationProgress, setAnimationProgress] = useState<number>(0);
  // Add state to toggle transition label visibility
  const [showAllLabels, setShowAllLabels] = useState<boolean>(false);
  // Track hovered transitions for selective label display
  const [hoveredTransition, setHoveredTransition] = useState<{ sourceId: string, targetId: string } | null>(null);

  // Animation effect for highlighted transitions
  useEffect(() => {
    if (highlightedTransitions.length === 0) return;
    
    let animationFrameId: number;
    let progress = 0;
    
    const animate = () => {
      progress += 0.02; // Speed of animation
      if (progress > 1) progress = 0;
      
      setAnimationProgress(progress);
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [highlightedTransitions]);

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

  // Format transition label for better display
  const formatTransitionLabel = (label: string): string => {
    // Check if it's a multi-tape transition
    if (label.includes(';')) {
      // Format multi-tape transitions more compactly
      const tapeOps = label.split(';');
      return tapeOps.map((op, idx) => {
        const [read, write, move] = op.split(',');
        return `T${idx+1}:${read}→${write},${move}`;
      }).join(' | ');
    } else {
      // Format single-tape transition
      const [read, write, move] = label.split(',');
      return `${read}→${write},${move}`;
    }
  };

  // Get all transitions between two states
  const getTransitionsBetweenStates = (sourceId: string, targetId: string): string[] => {
    const source = nodeMap[sourceId];
    if (!source) return [];
    
    const transitions = source.transitions.filter(t => t.targetid === targetId);
    if (transitions.length === 0) return [];
    
    // Return formatted labels
    return transitions.map(t => formatTransitionLabel(t.label));
  };

  // Function to check if transition should be visible
  const isTransitionLabelVisible = (sourceId: string, targetId: string): boolean => {
    // Always show highlighted transitions
    if (highlightedTransitions.some(
      ht => ht.target === sourceId && ht.d?.targetid === targetId
    )) {
      return true;
    }
    
    // Always show transitions from/to selected node
    if (selectedNode && (selectedNode.id === sourceId || selectedNode.id === targetId)) {
      return true;
    }
    
    // Show transitions that are being hovered
    if (hoveredTransition && 
        hoveredTransition.sourceId === sourceId && 
        hoveredTransition.targetId === targetId) {
      return true;
    }
    
    // Toggle for showing all labels
    return showAllLabels;
  };

  // Function to draw animated edges
  const drawAnimatedEdge = (
    points: ArrowPoints | CurvedArrowPoints, 
    isCurved: boolean,
    label: string,
    progress: number, 
    color: string = "red"
  ) => {
    return (
      <Group perfectDrawEnabled={false}>
        {/* Base line - dotted */}
        {isCurved ? (
          <Shape
            sceneFunc={(context: Konva.Context) => {
              context.beginPath();
              context.moveTo(points.startX, points.startY);
              context.quadraticCurveTo(
                (points as CurvedArrowPoints).controlX, 
                (points as CurvedArrowPoints).controlY, 
                points.endX, 
                points.endY
              );
              
              // Set up dotted line
              context.setLineDash([5, 3]);
              context.strokeStyle = color;
              context.lineWidth = 2;
              context.stroke();
              context.setLineDash([]);
              
              // Draw arrowhead
              const arrowSize = 15;
              const angleToCenter = Math.atan2(
                points.endY - (points as CurvedArrowPoints).controlY, 
                points.endX - (points as CurvedArrowPoints).controlX
              );
              
              context.beginPath();
              context.moveTo(points.endX, points.endY);
              context.lineTo(
                points.endX - arrowSize * Math.cos(angleToCenter + Math.PI / 6),
                points.endY - arrowSize * Math.sin(angleToCenter + Math.PI / 6)
              );
              context.lineTo(
                points.endX - arrowSize * Math.cos(angleToCenter - Math.PI / 6),
                points.endY - arrowSize * Math.sin(angleToCenter - Math.PI / 6)
              );
              context.closePath();
              context.fillStyle = color;
              context.fill();
            }}
            perfectDrawEnabled={false}
          />
        ) : (
          <Shape
            sceneFunc={(context: Konva.Context) => {
              context.beginPath();
              context.moveTo(points.startX, points.startY);
              context.lineTo(points.endX, points.endY);
              
              // Set up dotted line
              context.setLineDash([5, 3]);
              context.strokeStyle = color;
              context.lineWidth = 2;
              context.stroke();
              context.setLineDash([]);
              
              // Draw arrowhead
              const arrowSize = 15;
              const angle = Math.atan2(
                points.endY - points.startY, 
                points.endX - points.startX
              );
              
              context.beginPath();
              context.moveTo(points.endX, points.endY);
              context.lineTo(
                points.endX - arrowSize * Math.cos(angle + Math.PI / 6),
                points.endY - arrowSize * Math.sin(angle + Math.PI / 6)
              );
              context.lineTo(
                points.endX - arrowSize * Math.cos(angle - Math.PI / 6),
                points.endY - arrowSize * Math.sin(angle - Math.PI / 6)
              );
              context.closePath();
              context.fillStyle = color;
              context.fill();
            }}
            perfectDrawEnabled={false}
          />
        )}
        
        {/* Animated particle moving along the edge */}
        {(() => {
          // Calculate position along the path based on progress
          let x, y;
          
          if (isCurved) {
            // Quadratic Bezier curve formula
            const t = progress;
            const p0x = points.startX;
            const p0y = points.startY;
            const p1x = (points as CurvedArrowPoints).controlX;
            const p1y = (points as CurvedArrowPoints).controlY;
            const p2x = points.endX;
            const p2y = points.endY;
            
            // B(t) = (1-t)²P₀ + 2(1-t)tP₁ + t²P₂
            const mt = 1 - t;
            x = mt * mt * p0x + 2 * mt * t * p1x + t * t * p2x;
            y = mt * mt * p0y + 2 * mt * t * p1y + t * t * p2y;
          } else {
            // Linear interpolation for straight lines
            x = points.startX + (points.endX - points.startX) * progress;
            y = points.startY + (points.endY - points.startY) * progress;
          }
          
          return (
            <Circle
              x={x}
              y={y}
              radius={5}
              fill={color}
              shadowBlur={10}
              shadowColor={color}
              shadowOpacity={0.6}
              perfectDrawEnabled={false}
            />
          );
        })()}
      </Group>
    );
  };

  // Helper functions for label positions
  const calculateMidpointX = (startX: number, controlX: number, endX: number) => {
    return ((startX + 2 * controlX + endX) / 4 - 3);
  };
  
  const calculateMidpointY = (startY: number, controlY: number, endY: number) => {
    return (startY + 2 * controlY + endY) / 4 - 8;
  };

  const isTransitionHighlighted = (sourceId: string, targetId: string): boolean => {
    return highlightedTransitions.some(
      ht => ht.target === sourceId && ht.d?.targetid === targetId
    );
  };

  // Split the labels into multiple lines if too many
  const formatLabelsForDisplay = (labels: string[]): string[] => {
    // For multi-tape TMs, we might need to break labels into multiple lines
    // if there are more than 2 transitions between the same states
    if (labels.length <= 2) return labels;
    
    // Group labels into batches of 2 for better display
    const result: string[] = [];
    for (let i = 0; i < labels.length; i += 2) {
      if (i + 1 < labels.length) {
        result.push(`${labels[i]} | ${labels[i+1]}`);
      } else {
        result.push(labels[i]);
      }
    }
    return result;
  };

  // Draw self-loop with improved label positioning
  const drawSelfLoop = (x: number, y: number, nodeId: string, index: number, isHighlighted: boolean) => {
    const radius = 20;
    const loopRadius = 20;
    const angleOffset = Math.PI;
    const startAngle = -Math.PI - angleOffset;
    const endAngle = -Math.PI / 19 + angleOffset;
    const loopX = x;
    const loopY = y - radius - loopRadius;
    const arrowAngle = Math.PI / 18;

    // Get all self-loop transitions for this node
    const node = nodeMap[nodeId];
    if (!node) return null;
    
    const selfTransitions = node.transitions.filter(t => t.targetid === nodeId);
    if (selfTransitions.length === 0) return null;
    
    // Format each transition label
    const labels = selfTransitions.map(t => formatTransitionLabel(t.label));
    
    // If there are too many labels, show a counter instead
    const showCounter = labels.length > 4 && !isHighlighted && !isTransitionLabelVisible(nodeId, nodeId);
    
    // Calculate dimensions for the label background
    const lineHeight = 16;
    const totalHeight = showCounter ? lineHeight : labels.length * lineHeight;
    const maxLabelWidth = showCounter ? 60 : Math.max(...labels.map(label => label.length * 6)) + 10;
    
    return (
      <Group key={`self-loop-${index}`} perfectDrawEnabled={false}
        onMouseEnter={() => setHoveredTransition({ sourceId: nodeId, targetId: nodeId })}
        onMouseLeave={() => setHoveredTransition(null)}
      >
        {/* Draw animated or regular loop based on highlight state */}
        {isHighlighted ? (
          <Shape
            sceneFunc={(context: Konva.Context) => {
              context.beginPath();
              context.arc(loopX, loopY, loopRadius, startAngle, endAngle, false);
              // Set up dotted line for animation
              context.setLineDash([5, 3]);
              context.strokeStyle = "red";
              context.lineWidth = 2;
              context.stroke();
              context.setLineDash([]);
              context.closePath();
            }}
            perfectDrawEnabled={false}
          />
        ) : (
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
            perfectDrawEnabled={false}
          />
        )}
        
        {/* Arrow for the self loop */}
        <Arrow
          points={[
            loopX + loopRadius * Math.cos(arrowAngle),
            loopY + loopRadius * Math.sin(arrowAngle),
            loopX + loopRadius * Math.cos(arrowAngle + Math.PI / 6),
            loopY + loopRadius * Math.sin(arrowAngle + Math.PI / 6),
          ]}
          stroke={isHighlighted ? "red" : "black"}
          fill={isHighlighted ? "red" : "black"}
          pointerLength={10}
          pointerWidth={10}
          perfectDrawEnabled={false}
        />
        
        {/* Animated particle for highlighted loops */}
        {isHighlighted && (
          <Circle
            x={loopX + loopRadius * Math.cos(startAngle + (endAngle - startAngle) * animationProgress)}
            y={loopY + loopRadius * Math.sin(startAngle + (endAngle - startAngle) * animationProgress)}
            radius={5}
            fill="red"
            shadowBlur={10}
            shadowColor="red"
            shadowOpacity={0.6}
            perfectDrawEnabled={false}
          />
        )}
        
        {/* Show either a counter or the actual labels */}
        {showCounter ? (
          <>
            {/* Background for counter */}
            <Rect
              x={loopX - 30}
              y={loopY - loopRadius - 25}
              width={60}
              height={20}
              fill="white"
              opacity={0.9}
              cornerRadius={4}
              perfectDrawEnabled={false}
            />
            
            {/* Counter text */}
            <Text
              x={loopX - 30}
              y={loopY - loopRadius - 22}
              width={60}
              text={`${labels.length} transitions`}
              fontSize={12}
              fill="black"
              align="center"
              verticalAlign="middle"
              perfectDrawEnabled={false}
            />
          </>
        ) : (
          isTransitionLabelVisible(nodeId, nodeId) && (
            <>
              {/* Background for labels */}
              <Rect
                x={loopX - maxLabelWidth / 2}
                y={loopY - loopRadius - totalHeight - 10}
                width={maxLabelWidth}
                height={totalHeight + 6}
                fill="white"
                opacity={0.9}
                cornerRadius={4}
                perfectDrawEnabled={false}
              />
              
              {/* Render each transition label */}
              {labels.map((label, i) => (
                <Text
                  key={i}
                  x={loopX - label.length * 3}
                  y={loopY - loopRadius - totalHeight + i * lineHeight - 5}
                  text={label}
                  fontSize={14}
                  fill="black"
                  align="center"
                  verticalAlign="middle"
                  perfectDrawEnabled={false}
                />
              ))}
            </>
          )
        )}
      </Group>
    );
  };

  // Toggle function for showing all labels
  const toggleShowAllLabels = () => {
    setShowAllLabels(!showAllLabels);
  };

  return (
    <>
      {/* Button to toggle all labels */}
      <Group x={20} y={20}>
        <Rect
          width={120}
          height={30}
          fill={showAllLabels ? "#4CAF50" : "#2196F3"}
          cornerRadius={5}
          shadowBlur={3}
          shadowColor="black"
          shadowOpacity={0.3}
          onClick={toggleShowAllLabels}
        />
        <Text
          x={10}
          y={7}
          text={showAllLabels ? "Hide Labels" : "Show All Labels"}
          fontSize={14}
          fill="white"
          width={100}
          align="center"
          onClick={toggleShowAllLabels}
        />
      </Group>
      
      {/* Draw all transitions */}
      {nodes.map((node, index) => {
        // Group transitions by target for cleaner rendering
        const processedTargets = new Set<string>();
        
        return node.transitions.map((transition, tindex) => {
          const target = nodeMap[transition.targetid];
          if (!target) return null;
          
          // If we already processed this target for this node, skip
          // (we'll handle all transitions to the same target together)
          if (transition.targetid !== node.id && processedTargets.has(transition.targetid)) {
            return null;
          }
          
          // Mark this target as processed
          processedTargets.add(transition.targetid);
          
          const sourceId = node.id;
          const targetId = target.id;
          
          // Self-loop
          if (sourceId === targetId) {
            return drawSelfLoop(node.x, node.y, sourceId, index, isTransitionHighlighted(sourceId, targetId));
          } 
          // Regular transition
          else {
            const isReverse = nodes.some(
              (n) => n.id === targetId && 
              n.transitions.some((t) => t.targetid === sourceId)
            );
            
            const points = isReverse
              ? calculateCurvedArrowPoints(
                  node.x,
                  node.y,
                  target.x,
                  target.y,
                  calculateCurveStrength(
                    node.x,
                    node.y,
                    target.x,
                    target.y
                  ),
                  20
                )
              : calculateArrowPoints(
                  node.x,
                  node.y,
                  target.x,
                  target.y,
                  30
                );
            
            // Get all transition labels between these nodes
            const transitionLabels = getTransitionsBetweenStates(sourceId, targetId);
            
            // Check if we should show labels for this transition
            const showLabels = isTransitionLabelVisible(sourceId, targetId);
            
            // Format labels for display
            const displayLabels = formatLabelsForDisplay(transitionLabels);
            
            // Show counter instead of labels if there are too many
            const showCounter = transitionLabels.length > 4 && !isTransitionHighlighted(sourceId, targetId) && !showLabels;
            
            return (
              <Group 
                key={`${sourceId}-${targetId}-${tindex}`} 
                perfectDrawEnabled={false}
                onMouseEnter={() => setHoveredTransition({ sourceId, targetId })}
                onMouseLeave={() => setHoveredTransition(null)}
              >
                {/* Draw regular or animated arrow based on highlight state */}
                {isTransitionHighlighted(sourceId, targetId) ? (
                  drawAnimatedEdge(
                    points, 
                    isReverse, 
                    transition.label, 
                    animationProgress,
                    "red"
                  )
                ) : (
                  isReverse ? (
                    <>
                      <Shape
                        sceneFunc={(context: Konva.Context, _shape: Konva.Shape) => {
                          context.beginPath();
                          context.moveTo(points.startX, points.startY);
                          context.quadraticCurveTo(
                            (points as CurvedArrowPoints).controlX, 
                            (points as CurvedArrowPoints).controlY, 
                            points.endX, 
                            points.endY
                          );
                          context.stroke();
                          context.strokeShape(_shape);
                        }}
                        stroke="black"
                        strokeWidth={2}
                        perfectDrawEnabled={false}
                      />
                      <Shape
                        sceneFunc={(context: Konva.Context) => {
                          context.beginPath();
                          const arrowSize = 15;
                          const angleToCenter = Math.atan2(
                            target.y - points.endY, 
                            target.x - points.endX
                          );
                          context.moveTo(points.endX, points.endY);
                          context.lineTo(
                            points.endX - arrowSize * Math.cos(angleToCenter + Math.PI / 6),
                            points.endY - arrowSize * Math.sin(angleToCenter + Math.PI / 6)
                          );
                          context.lineTo(
                            points.endX - arrowSize * Math.cos(angleToCenter - Math.PI / 6),
                            points.endY - arrowSize * Math.sin(angleToCenter - Math.PI / 6)
                          );
                          context.closePath();
                          context.fillStyle = "black";
                          context.fill();
                        }}
                        perfectDrawEnabled={false}
                      />
                    </>
                  ) : (
                    <Arrow
                      points={[
                        points.startX, 
                        points.startY, 
                        points.endX, 
                        points.endY
                      ]}
                      stroke="black"
                      fill="black"
                      pointerLength={10}
                      pointerWidth={10}
                      perfectDrawEnabled={false}
                    />
                  )
                )}
                
                {/* Show either counter or labels */}
                {showCounter ? (
                  // Show transition count
                  <Group perfectDrawEnabled={false}>
                    <Rect
                      x={(points.startX + points.endX) / 2 - 30}
                      y={(points.startY + points.endY) / 2 - 10}
                      width={60}
                      height={20}
                      fill="white"
                      opacity={0.9}
                      cornerRadius={4}
                      perfectDrawEnabled={false}
                    />
                    <Text
                      x={(points.startX + points.endX) / 2 - 30}
                      y={(points.startY + points.endY) / 2 - 7}
                      width={60}
                      text={`${transitionLabels.length} transitions`}
                      fontSize={12}
                      fill="black"
                      align="center"
                      verticalAlign="middle"
                      perfectDrawEnabled={false}
                    />
                  </Group>
                ) : (
                  // Show detailed transition labels
                  showLabels && (
                    <Group perfectDrawEnabled={false}>
                      {(() => {
                        // Calculate dimensions for the labels
                        const lineHeight = 18;
                        const totalHeight = displayLabels.length * lineHeight;
                        
                        // Find the longest label to size the background properly
                        const maxLength = Math.max(...displayLabels.map(lbl => lbl.length));
                        const boxWidth = maxLength * 7 + 10;
                        
                        // Calculate base position for the label
                        const baseX = isReverse 
                          ? calculateMidpointX(points.startX, (points as CurvedArrowPoints).controlX, points.endX) - 
                            (maxLength * 3.2) - 3
                          : (points.startX + points.endX - (maxLength * 6.5)) / 2 - 4;
                        
                        const baseY = isReverse 
                          ? calculateMidpointY(points.startY, (points as CurvedArrowPoints).controlY, points.endY) - 
                            totalHeight / 2
                          : (points.startY + points.endY) / 2 - totalHeight / 2;
                        
                        return (
                          <>
                            {/* Background */}
                            <Rect
                              x={baseX}
                              y={baseY - 5}
                              width={boxWidth}
                              height={totalHeight + 10}
                              fill="white"
                              opacity={0.9}
                              cornerRadius={4}
                              perfectDrawEnabled={false}
                            />
                            
                            {/* Render each label */}
                            {displayLabels.map((label, i) => (
                              <Text
                                key={i}
                                x={baseX + boxWidth / 2 - (label.length * 5) / 2}
                                y={baseY + i * lineHeight}
                                text={label}
                                fontSize={14}
                                fill="black"
                                align="center"
                                verticalAlign="middle"
                                perfectDrawEnabled={false}
                              />
                            ))}
                          </>
                        );
                      })()}
                    </Group>
                  )
                )}
              </Group>
            );
          }
        });
      })}

      {/* Draw all nodes */}
      {nodes.map((node) => (
        <Group 
          key={node.id}
          x={node.x}
          y={node.y}
          draggable
          onTap={() => handleNodeClick(node)}
          onClick={() => handleNodeClick(node)}
          onMouseDown={nodeMouseDown}
          onMouseUp={nodeMouseUp}
          onDragMove={(e: KonvaEventObject<DragEvent>) => {
            // Pass the Konva event directly to handleDragMove
            handleDragMove(e, node.id);
          }}
          perfectDrawEnabled={false}
          shadowForStrokeEnabled={false}
          className="react-konva-drag"
        >
          {showQuestion && currNodes.has(node.id) && (
            <Group>
              <Circle
                radius={15}
                fill="#fff"
                stroke="#70DAC2"
                strokeWidth={2}
                x={38}
                y={12}
              />
              <Text
                text="?"
                fontSize={20}
                fontStyle="bold"
                fill="#70DAC2"
                x={32}
                y={2}
                align="center"
                verticalAlign="middle"
              />
            </Group>
          )}
          
          {/* Start arrow for first state */}
          {node.id === 'q0' && (
            <Arrow
              points={[-70, 0, -32, 0]}
              stroke={currNodes.has(node.id) ? "red" : "black"}
              fill={currNodes.has(node.id) ? "red" : "black"}
              pointerLength={10}
              pointerWidth={10}
              perfectDrawEnabled={false}
            />
          )}
          
          {/* Node circle */}
          <Circle
            x={0}
            y={0}
            radius={30}
            fill={
              selectedNode 
                ? (selectedNode.id === node.id ? "rgba(207, 207, 255, 1.0)" : "white") 
                : (currNodes.has(node.id)
                    ? (finiteNodes.has(node.id) ? "#32CD32" : "red") 
                    : "white")
            }
            stroke={
              selectedNode 
                ? (selectedNode.id === node.id ? "rgba(89, 89, 255, 1.0)" : "black") 
                : (highlightedNodes.has(node.id) ? "orange" : "black")
            }
            strokeWidth={selectedNode 
              ? (selectedNode.id === node.id ? 2 : 1) 
              : (highlightedNodes.has(node.id) ? 3 : 1)
            }
            perfectDrawEnabled={false}
          />
          
          {/* Final state double circle */}
          {finiteNodes.has(node.id) && (
            <Circle
              x={0}
              y={0}
              radius={25}
              stroke={highlightedNodes.has(node.id) ? "orange" : "black"}
              strokeWidth={highlightedNodes.has(node.id) ? 2 : 1}
              fill="transparent"
              perfectDrawEnabled={false}
            />
          )}
          
          {/* Node label */}
          <Text
            x={0 - node.id.length * 5 + 10}
            y={-7}
            text={node.id}
            fill={currNodes.has(node.id) ? "white" : "black"}
            fontSize={16}
            align="center"
            verticalAlign="middle"
            offsetX={8}
            perfectDrawEnabled={false}
          />
        </Group>
      ))}
    </>
  );
};

export default NodeCanvas;