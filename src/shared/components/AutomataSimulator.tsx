// Add to imports in each simulator
import TransitionArrow from './TransitionArrow';

import React, { useState } from "react";
import ControlPanel from "./ControlPanel";
import NodeCanvas from "./NodeCanvas";
import DFAControlPanel from "./DFAControlPanel";

const AutomataSimulator = () => {
  const [nodes, setNodes] = useState([]);
  const [currentState, setCurrentState] = useState(null);
  const [inputString, setInputString] = useState("");
  const [stepIndex, setStepIndex] = useState(0);

  // Dummy renderer functions for now
  const renderer = {
    renderNode: (node) => {
      const { x = 100, y = 100, label = "Node" } = node;
      return (
        <circle
          cx={x}
          cy={y}
          r="30"
          fill={currentState === label ? "#ffcc00" : "#4f83cc"}
          stroke="#333"
          strokeWidth="2"
        >
          <title>{label}</title>
        </circle>
      );
    },

    renderTransition: (transition) => {
      const { fromX = 100, fromY = 100, toX = 200, toY = 200 } = transition;
      return (
        <line
          x1={fromX}
          y1={fromY}
          x2={toX}
          y2={toY}
          stroke="#555"
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
        />
      );
    },
  };

  // DFA control functions
  const handleStart = () => {
    if (nodes.length > 0) {
      setCurrentState(nodes[0].label || null);
      setStepIndex(0);
    }
  };

  const handleStep = () => {
    if (stepIndex < inputString.length) {
      // Example logic: go to next node
      const nextNode = nodes[(stepIndex + 1) % nodes.length];
      setCurrentState(nextNode?.label || null);
      setStepIndex(stepIndex + 1);
    }
  };

  const handleReset = () => {
    setCurrentState(null);
    setStepIndex(0);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Left Side - Control Panels */}
      <div style={{ width: "250px", borderRight: "1px solid #ccc" }}>
        <ControlPanel nodes={nodes} setNodes={setNodes} />
        <DFAControlPanel
          inputString={inputString}
          setInputString={setInputString}
          onStart={handleStart}
          onStep={handleStep}
          onReset={handleReset}
        />
      </div>

      {/* Right Side - Node Canvas */}
      <div style={{ flex: 1, position: "relative" }}>
        <svg width="100%" height="100%">
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="10"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#555" />
            </marker>
          </defs>
        </svg>
        <NodeCanvas nodes={nodes} renderer={renderer} />
      </div>
    </div>
  );
};

export default AutomataSimulator;
