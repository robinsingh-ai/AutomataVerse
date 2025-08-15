"use client";
import React, { useRef, useState } from "react";

interface NodeType {
  id: number;
  x: number;
  y: number;
  label: string;
}

export default function NodeCanvas({
  nodes,
  setNodes,
  edges,
  setEdges,
}: {
  nodes: NodeType[];
  setNodes: React.Dispatch<React.SetStateAction<NodeType[]>>;
  edges: { from: number; to: number }[];
  setEdges: React.Dispatch<
    React.SetStateAction<{ from: number; to: number }[]>
  >;
}) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggingNode, setDraggingNode] = useState<number | null>(null);
  const [connectingNode, setConnectingNode] = useState<number | null>(null);

  const addNode = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const newNode: NodeType = {
      id: Date.now(),
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      label: `Q${nodes.length}`,
    };
    setNodes([...nodes, newNode]);
  };

  const startDrag = (id: number) => {
    setDraggingNode(id);
  };

  const onDrag = (e: React.MouseEvent) => {
    if (draggingNode === null || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setNodes((prev) =>
      prev.map((node) =>
        node.id === draggingNode
          ? { ...node, x: e.clientX - rect.left, y: e.clientY - rect.top }
          : node
      )
    );
  };

  const stopDrag = () => {
    setDraggingNode(null);
  };

  const startConnection = (id: number) => {
    setConnectingNode(id);
  };

  const finishConnection = (id: number) => {
    if (connectingNode !== null && connectingNode !== id) {
      setEdges([...edges, { from: connectingNode, to: id }]);
    }
    setConnectingNode(null);
  };

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-[500px] bg-gray-100 border"
      onClick={addNode}
      onMouseMove={onDrag}
      onMouseUp={stopDrag}
    >
      {/* Draw edges */}
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {edges.map((edge, idx) => {
          const fromNode = nodes.find((n) => n.id === edge.from);
          const toNode = nodes.find((n) => n.id === edge.to);
          if (!fromNode || !toNode) return null;
          return (
            <line
              key={idx}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke="black"
              strokeWidth={2}
            />
          );
        })}
      </svg>

      {/* Draw nodes */}
      {nodes.map((node) => (
        <div
          key={node.id}
          className="absolute flex items-center justify-center w-12 h-12 bg-white border-2 border-black rounded-full cursor-pointer"
          style={{ left: node.x - 24, top: node.y - 24 }}
          onMouseDown={(e) => {
            e.stopPropagation();
            startDrag(node.id);
          }}
          onDoubleClick={(e) => {
            e.stopPropagation();
            startConnection(node.id);
          }}
          onMouseUp={(e) => {
            e.stopPropagation();
            finishConnection(node.id);
          }}
        >
          {node.label}
        </div>
      ))}
    </div>
  );
}
