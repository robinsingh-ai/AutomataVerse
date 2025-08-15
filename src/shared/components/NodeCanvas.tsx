// src/shared/components/NodeCanvas.tsx

import React, { useCallback, useRef, useEffect } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node';

export interface NodeRenderer<TNode> {
  renderNode: (
    node: TNode,
    isSelected: boolean,
    isHighlighted: boolean,
    onSelect: (node: TNode) => void,
    onDrag: (nodeId: string, pos: { x: number; y: number }) => void
  ) => React.ReactNode;

  renderTransition: (
    transition: any,
    isHighlighted: boolean,
    onClick?: (transition: any) => void
  ) => React.ReactNode;

  getNodeBounds: (node: TNode) => {
    x: number;
    y: number;
    width: number;
    height: number;
  };

  getAllTransitions: (nodes: TNode[]) => any[];
}

export interface StageProps {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  width: number;
  height: number;
}

export interface NodeCanvasProps<TNode> {
  nodes: TNode[];
  selectedNode: TNode | null;
  highlightedNodes: Set<string>;
  highlightedTransitions: any[];

  onNodeSelect: (node: TNode) => void;
  onNodeDrag: (nodeId: string, position: { x: number; y: number }) => void;
  onCanvasClick: (position: { x: number; y: number }) => void;
  onTransitionClick?: (transition: any) => void;

  renderer: NodeRenderer<TNode>;

  stageProps: StageProps;
  onStagePropsChange: (props: StageProps) => void;

  showGrid?: boolean;
  gridSize?: number;
}

export default function NodeCanvas<
  TNode extends { id: string; x: number; y: number }
>({
  nodes,
  selectedNode,
  highlightedNodes,
  highlightedTransitions,
  onNodeSelect,
  onNodeDrag,
  onCanvasClick,
  onTransitionClick,
  renderer,
  stageProps,
  onStagePropsChange,
  showGrid = false,
  gridSize = 20,
}: NodeCanvasProps<TNode>) {
  const stageRef = useRef<any>(null);

  const handleStageClick = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      const stage = e.target.getStage();
      if (!stage) return;

      const clickedOnEmpty = e.target === stage;
      if (clickedOnEmpty) {
        const pointer = stage.getPointerPosition();
        if (pointer) {
          onCanvasClick(pointer);
        }
      }
    },
    [onCanvasClick]
  );

  const handleWheel = useCallback(
    (e: KonvaEventObject<WheelEvent>) => {
      e.evt.preventDefault();

      const stage = e.target.getStage();
      if (!stage) return;

      const oldScale = stage.scaleX();
      const pointer = stage.getPointerPosition();
      if (!pointer) return;

      const mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
      };

      const direction = e.evt.deltaY > 0 ? 1 : -1;
      const scaleBy = 1.1;
      const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

      onStagePropsChange({
        ...stageProps,
        scaleX: newScale,
        scaleY: newScale,
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      });
    },
    [stageProps, onStagePropsChange]
  );

  const handleStageDragEnd = useCallback(
    (e: KonvaEventObject<DragEvent>) => {
      const node = e.target;
      onStagePropsChange({
        ...stageProps,
        x: node.x(),
        y: node.y(),
      });
    },
    [stageProps, onStagePropsChange]
  );

  const renderGrid = useCallback(() => {
    if (!showGrid) return null;

    const lines: React.ReactNode[] = [];
    const { width, height } = stageProps;

    for (let i = 0; i <= Math.floor(width / gridSize); i++) {
      const x = i * gridSize;
      lines.push(
        <Line key={`v${i}`} points={[x, 0, x, height]} stroke="#ddd" strokeWidth={0.5} />
      );
    }

    for (let j = 0; j <= Math.floor(height / gridSize); j++) {
      const y = j * gridSize;
      lines.push(
        <Line key={`h${j}`} points={[0, y, width, y]} stroke="#ddd" strokeWidth={0.5} />
      );
    }

    return lines;
  }, [showGrid, stageProps, gridSize]);

  useEffect(() => {
    const handleResize = () => {
      onStagePropsChange({
        ...stageProps,
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [stageProps, onStagePropsChange]);

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <Stage
        ref={stageRef}
        width={stageProps.width}
        height={stageProps.height}
        x={stageProps.x}
        y={stageProps.y}
        scaleX={stageProps.scaleX}
        scaleY={stageProps.scaleY}
        draggable
        onWheel={handleWheel}
        onDragEnd={handleStageDragEnd}
        onClick={handleStageClick}
        onTap={handleStageClick}
      >
        <Layer>
          {renderGrid()}

          {renderer.getAllTransitions(nodes).map((transition: any) =>
            renderer.renderTransition(
              transition,
              highlightedTransitions.some(
                (ht: any) =>
                  ht.from === transition.from &&
                  ht.to === transition.to &&
                  ht.symbol === transition.symbol
              ),
              onTransitionClick
            )
          )}

          {nodes.map((node) =>
            renderer.renderNode(
              node,
              (selectedNode as any)?.id === (node as any).id,
              highlightedNodes.has((node as any).id),
              onNodeSelect,
              onNodeDrag
            )
          )}
        </Layer>
      </Stage>
    </div>
  );
}
