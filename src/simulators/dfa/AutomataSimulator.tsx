'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer } from 'react-konva';
import dynamic from 'next/dynamic';
import ControlPanel from './components/ControlPanel';
import InputPopup from './components/InputPopup';
import { Node, NodeMap, HighlightedTransition, StageProps } from './type';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';

// Dynamically import the NodeCanvas component to prevent SSR issues with Konva
const DynamicNodeCanvas = dynamic(() => import('./components/NodeCanvas'), {
  ssr: false,
});

// Wrapper component to contain the Stage and handle hydration properly
const StageWrap = ({ children, ...props }: React.PropsWithChildren<any>) => {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    return <div className="w-full h-full bg-gray-100 flex items-center justify-center">
      <div className="text-gray-500">Loading simulator...</div>
    </div>;
  }
  
  return children;
};

const AutomataSimulator: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [nodeMap, setNodeMap] = useState<NodeMap>({});
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [finiteNodes, setFiniteNodes] = useState<Set<string>>(new Set());
  const [inputString, setInputString] = useState<string>('');
  const [currNode, setCurrNode] = useState<Node | null>(null);
  const [validationResult, setValidationResult] = useState<string | null>(null);
  const [stageProps, setStageProps] = useState<StageProps>({
    x: 0,
    y: 0,
    scale: 1,
    draggable: true
  });
  const [stageDragging, setIsStageDragging] = useState<boolean>(false);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [highlightedTransition, setHighlightedTransition] = useState<HighlightedTransition>({});
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [showQuestion, setShowQuestion] = useState<boolean>(false);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isRunningStepWise, setIsRunningStepWise] = useState<boolean>(false);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [targetNode, setTargetNode] = useState<Node | null>(null);
  // Server-client hydration check
  const [isBrowser, setIsBrowser] = useState(false);
  
  const stageRef = useRef<Konva.Stage>(null);

  // Handle browser-side initialization
  useEffect(() => {
    setIsBrowser(true);
  }, []);

  // Load the question mark image
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const img = new window.Image();
      img.src = '/q3.png'; // Assuming the image is in the public folder
      img.onload = () => {
        setImage(img);
      };
    }
  }, []);

  // Update NodeMap whenever nodes changes
  useEffect(() => {
    const map: NodeMap = {};
    nodes.forEach(node => {
      map[node.id] = node;
    });
    setNodeMap(map);
  }, [nodes]);

  // Clear highlighted transition after a short delay
  useEffect(() => {
    let timerId: NodeJS.Timeout | null = null;
    if (highlightedTransition.d) {
      if (timerId) clearTimeout(timerId);
      timerId = setTimeout(() => {
        setHighlightedTransition({});
      }, 400);
    }
    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [highlightedTransition]);

  const handleAddNode = (): void => {
    // Calculate position in the center of the visible area
    if (typeof window !== 'undefined') {
      const stageWidth = window.innerWidth / stageProps.scale;
      const stageHeight = window.innerHeight / stageProps.scale;
      const x = (stageWidth / 2 - stageProps.x) / stageProps.scale;
      const y = (stageHeight / 2 - stageProps.y) / stageProps.scale;
      
      const newNode: Node = {
        id: `q${nodes.length}`,
        x: x,
        y: y,
        transitions: []
      };
      setNodes((prev) => [...prev, newNode]);
    }
  };

  const handleDragMove = (e: KonvaEventObject<DragEvent>, nodeId: string): void => {
    // In Konva, we can access the position directly from the KonvaNode
    const konvaNode = e.target;
    const x = konvaNode.x();
    const y = konvaNode.y();
    
    setNodes((prev) =>
      prev.map((n) => (n.id === nodeId ? { ...n, x, y } : n))
    );
  };

  const handleSymbolInputSubmit = (symbol: string): void => {
    if (!symbol) {
      console.warn("No transition symbol provided.");
      return;
    }
    if (!targetNode) {
      console.warn("No source node was selected.");
      return;
    }

    if (selectedNode) {
      const index = selectedNode.transitions.findIndex(item => item.targetid === targetNode.id);
      setNodes((prevNodes) =>
        prevNodes.map((n) =>
          n.id === selectedNode.id
            ? {
              ...n,
              transitions: index !== -1
                ? n.transitions.map((t, i) =>
                  i === index
                    ? { ...t, label: `${t.label},${symbol}` }
                    : t
                )
                : [
                  ...n.transitions,
                  { targetid: targetNode.id, label: symbol },
                ],
            }
            : n
        )
      );
      setSelectedNode(null);
      setTargetNode(null);
    }
    setIsPopupOpen(false);
  };

  const handleInputClose = (): void => {
    setIsPopupOpen(false);
    setSelectedNode(null);
    setTargetNode(null);
  };

  const handleNodeClick = (node: Node): void => {
    // Reset running state if clicking during simulation
    if (isRunning) return;
    
    resetSimulation();

    if (!selectedNode) {
      setSelectedNode(node);
    } else {
      setTargetNode(node);
      setIsPopupOpen(true);
    }
  };

  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>): void => {
    if (e.target === e.target.getStage()) {
      setSelectedNode(null);
    }
  };

  const handleSetFinite = (): void => {
    if (selectedNode) {
      setFiniteNodes((prev) => {
        const newFiniteNodes = new Set(prev);
        if (newFiniteNodes.has(selectedNode.id)) {
          newFiniteNodes.delete(selectedNode.id);
        } else {
          newFiniteNodes.add(selectedNode.id);
        }
        return newFiniteNodes;
      });
    }
  };

  const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));
  
  const getNodeById = (id: string): Node | undefined => nodeMap[id];

  const resetSimulation = (): void => {
    setIsRunning(false);
    setIsRunningStepWise(false);
    setShowQuestion(false);
    setValidationResult(null);
    setCurrNode(null);
    setStepIndex(0);
    setHighlightedTransition({});
  };

  const handleRun = async (): Promise<void> => {
    if (isRunning || !nodes.length) return;
    
    setIsRunning(true);
    if (isRunningStepWise) setIsRunningStepWise(false);
    setShowQuestion(false);
    setSelectedNode(null);
    setHighlightedTransition({});
    setValidationResult(null);
    setStepIndex(0);
    
    let mcurrNode = nodes[0];
    setCurrNode(mcurrNode);

    for (const char of inputString) {
      await sleep(1000);
      let found = false;
      for (const transition of mcurrNode.transitions) {
        if (transition.label.split(",").filter(num => num !== "").includes(char)) {
          setHighlightedTransition({d: transition, target: mcurrNode.id});
          const nextNode = getNodeById(transition.targetid);
          if (nextNode) {
            mcurrNode = nextNode;
            await sleep(200);
            setCurrNode(mcurrNode);
            found = true;
            break;
          }
        }
      }
      if (!found) {
        setShowQuestion(true);
        setValidationResult(`No transition for '${char}' at ${mcurrNode.id}`);
        setIsRunning(false);
        return;
      }
      setStepIndex(prevStepIndex => prevStepIndex + 1);
    }
    
    if (finiteNodes.has(mcurrNode.id)) {
      setValidationResult("String is Valid");
    } else {
      setValidationResult("String is invalid");
    }
    setIsRunning(false);
  };

  const handleStepWise = async (): Promise<void> => {
    if (selectedNode) setSelectedNode(null);
    
    if (!inputString || !nodes.length || !currNode) return;
    
    const char = inputString[stepIndex];
    let found = false;
    let mcurrNode = currNode;

    if (inputString) {
      for (const transition of mcurrNode.transitions) {
        if (transition.label.split(",").filter(num => num !== "").includes(char)) {
          setHighlightedTransition({d: transition, target: mcurrNode.id});
          const nextNode = getNodeById(transition.targetid);
          if (nextNode) {
            mcurrNode = nextNode;
            await sleep(200);
            setCurrNode(mcurrNode);
            found = true;
            break;
          }
        }
      }
    
      if (!found) {
        setIsRunningStepWise(false);
        setShowQuestion(true);
        setValidationResult(`No transition for '${char}' at ${mcurrNode.id}`);
        return;
      }
    }
   
    // Step wise finished
    if (stepIndex === inputString.length - 1 || !inputString) {
      setIsRunningStepWise(false);
      if (finiteNodes.has(mcurrNode.id)) {
        setValidationResult("String is Valid");
      } else {
        setValidationResult("String is invalid");
      }
    }
    setStepIndex(prevStepIndex => prevStepIndex + 1);
  };

  const onStepWiseClick = (): void => {
    if (isRunning || !nodes.length) return;
    
    if (isRunningStepWise) {
      handleStepWise();
    } else {
      resetSimulation();
      setCurrNode(nodes[0]);
      setIsRunningStepWise(true);
    }
  };

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>): void => {
    e.evt.preventDefault();

    const scaleBy = 1.1;
    const stage = e.target.getStage();
    const oldScale = stageProps.scale;
    const pointer = stage?.getPointerPosition();
    if (!pointer) return;

    // Calculate new scale
    let newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

    // Adjust position to zoom into the pointer position
    const mousePointTo = {
      x: (pointer.x - stageProps.x) / oldScale,
      y: (pointer.y - stageProps.y) / oldScale,
    };

    // Limits
    newScale = Math.min(Math.max(newScale, 0.5), 4.0);

    setStageProps((prev) => ({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
      scale: newScale,
      draggable: prev.draggable
    }));
  };

  const handleDragMoveScreen = (e: Konva.KonvaEventObject<DragEvent>): void => {
    const stage = e.target.getStage();
    setStageProps((prev) => ({
      ...prev,
      x: stage?.x() || prev.x,
      y: stage?.y() || prev.y,
    }));
  };

  const nodeMouseDown = (): void => {
    setStageProps((prev) => ({
      ...prev,
      draggable: false
    }));
  };
  
  const nodeMouseUp = (): void => {
    setStageProps((prev) => ({
      ...prev,
      draggable: true
    }));
  };

  return (
    <div className="w-full h-full relative">
      <ControlPanel
        onAddNode={handleAddNode}
        onSetFinite={handleSetFinite}
        onRun={handleRun}
        onStep={onStepWiseClick}
        onInputChange={setInputString}
        inputString={inputString}
        validationResult={validationResult}
        selectedNode={selectedNode}
        isRunning={isRunning}
        isRunningStepWise={isRunningStepWise}
        showGrid={showGrid}
        onToggleGrid={() => setShowGrid(!showGrid)}
        stepIndex={stepIndex}
        onReset={resetSimulation}
      />
      
      {isPopupOpen && targetNode && (
        <InputPopup
          node={targetNode}
          onClose={handleInputClose}
          onSubmit={handleSymbolInputSubmit}
        />
      )}
      
      {isBrowser ? (
        <StageWrap>
          <Stage
            ref={stageRef}
            width={window.innerWidth}
            height={window.innerHeight}
            x={stageProps.x}
            y={stageProps.y}
            scaleX={stageProps.scale}
            scaleY={stageProps.scale}
            draggable={stageProps.draggable}
            onWheel={handleWheel}
            onClick={handleStageClick}
            onMouseDown={nodeMouseDown}
            onMouseUp={nodeMouseUp}
            onDragMove={handleDragMoveScreen}
            className="bg-white"
          >
            <Layer>
              <DynamicNodeCanvas
                nodes={nodes}
                nodeMap={nodeMap}
                showGrid={showGrid}
                stageProps={stageProps}
                highlightedTransition={highlightedTransition}
                selectedNode={selectedNode}
                finiteNodes={finiteNodes}
                currNode={currNode}
                showQuestion={showQuestion}
                image={image}
                handleNodeClick={handleNodeClick}
                handleDragMove={handleDragMove}
                nodeMouseDown={nodeMouseDown}
                nodeMouseUp={nodeMouseUp}
              />
            </Layer>
          </Stage>
        </StageWrap>
      ) : (
        <div className="w-full h-screen flex items-center justify-center bg-gray-100">
          <div className="text-lg text-gray-600">Initializing simulator...</div>
        </div>
      )}
    </div>
  );
};

export default AutomataSimulator;