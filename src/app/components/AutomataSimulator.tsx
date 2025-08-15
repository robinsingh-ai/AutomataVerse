"use client";
import React, { useState } from "react";
import NodeCanvas from "./NodeCanvas";

export default function AutomataSimulator() {
  const [nodes, setNodes] = useState<
    { id: number; x: number; y: number; label: string }[]
  >([]);
  const [edges, setEdges] = useState<{ from: number; to: number }[]>([]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Automata Simulator</h1>
      <p className="text-sm mb-2">
        Click on canvas to add nodes, double-click a node to start a
        connection, and click another node to finish.
      </p>
      <NodeCanvas
        nodes={nodes}
        setNodes={setNodes}
        edges={edges}
        setEdges={setEdges}
      />
    </div>
  );
}
