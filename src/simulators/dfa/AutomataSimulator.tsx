'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Image as KonvaImage } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { useTheme } from '../../app/context/ThemeContext';
import ControlPanel from './components/ControlPanel';
import InputPopup from './components/InputPopup';
import DFAInfoPanel from './components/DFAInfoPanel';
import TestInputPanel from './components/TestInputPanel';
import { Node, NodeMap, HighlightedTransition, StageProps } from './type';
import Konva from 'konva';

// Dynamically import the components to prevent SSR issues with Konva
import dynamic from 'next/dynamic';
const DynamicNodeCanvas = dynamic(() => import('./components/NodeCanvas'), {
  ssr: false,
});

const DynamicGridCanvas = dynamic(() => import('./components/Grid'), {
  ssr: false,
});

const AutomataSimulator: React.FC = () => {
  const { theme } = useTheme();
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
  const [stageDragging, setIsStageDragging] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [highlightedTransition, setHighlightedTransition] = useState<HighlightedTransition>({});
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [showQuestion, setShowQuestion] = useState<boolean>(false);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isRunningStepWise, setIsRunningStepWise] = useState<boolean>(false);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [targetNode, setTargetNode] = useState<Node | null>(null);
  const [isClient, setIsClient] = useState(false);
  
  const stageRef = useRef<Konva.Stage>(null);

  // Set isClient to true when component mounts to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
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
    
    if (stepIndex < inputString.length) {
      let found = false;
      for (const transition of currNode.transitions) {
        if (transition.label.split(",").filter(num => num !== "").includes(char)) {
          setHighlightedTransition({d: transition, target: currNode.id});
          const nextNode = getNodeById(transition.targetid);
          if (nextNode) {
            await sleep(200);
            setCurrNode(nextNode);
            found = true;
            setStepIndex(prevStepIndex => prevStepIndex + 1);
            break;
          }
        }
      }
      if (!found) {
        setShowQuestion(true);
        setValidationResult(`No transition for '${char}' at ${currNode.id}`);
        setIsRunningStepWise(false);
        return;
      }
    } else {
      if (finiteNodes.has(currNode.id)) {
        setValidationResult("String is Valid");
      } else {
        setValidationResult("String is invalid");
      }
      setIsRunningStepWise(false);
    }
  };

  const onStepWiseClick = (): void => {
    if (isRunning || isRunningStepWise) return;
    
    if (!nodes.length) return;
    
    setIsRunningStepWise(true);
    setShowQuestion(false);
    setSelectedNode(null);
    setHighlightedTransition({});
    setValidationResult(null);
    setStepIndex(0);
    setCurrNode(nodes[0]);
  };

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>): void => {
    e.evt.preventDefault();
    
    const scaleBy = 1.1;
    const stage = e.target.getStage();
    
    if (stage) {
      const oldScale = stageProps.scale;
      const pointerPosition = stage.getPointerPosition();
      
      if (pointerPosition) {
        const mousePointTo = {
          x: (pointerPosition.x - stageProps.x) / oldScale,
          y: (pointerPosition.y - stageProps.y) / oldScale,
        };
        
        const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
        
        setStageProps({
          ...stageProps,
          scale: newScale,
          x: pointerPosition.x - mousePointTo.x * newScale,
          y: pointerPosition.y - mousePointTo.y * newScale,
        });
      }
    }
  };

  const handleDragMoveScreen = (e: Konva.KonvaEventObject<DragEvent>): void => {
    setStageProps(prev => ({ 
      ...prev, 
      x: e.target.x(), 
      y: e.target.y() 
    }));
  };
  
  const nodeMouseDown = (): void => {
    // When we start dragging a node, disable stage dragging
    setStageProps(prev => ({
      ...prev,
      draggable: false
    }));
  };

  const nodeMouseUp = (): void => {
    // When we finish dragging a node, re-enable stage dragging
    setStageProps(prev => ({
      ...prev,
      draggable: true
    }));
  };

  const handleTestInput = (input: string, speed = 300): void => {
    setInputString(input);
    setTimeout(() => {
      handleRun();
    }, 100);
  };

  // Calculate all input symbols used in the transitions
  const getInputSymbols = (): string[] => {
    const symbolsSet = new Set<string>();
    nodes.forEach(node => {
      node.transitions.forEach(transition => {
        transition.label.split(',').forEach(symbol => {
          if (symbol.trim()) {
            symbolsSet.add(symbol.trim());
          }
        });
      });
    });
    return Array.from(symbolsSet).sort();
  };

  if (!isClient) {
    return null; // Return null on server side to prevent hydration mismatch
  }

  return (
    <div 
      className={`w-full h-full overflow-hidden 
        ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}
    >
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
      
      <DFAInfoPanel 
        states={nodes.map(node => node.id)} 
        initialState={nodes.length > 0 ? nodes[0].id : null}
        finalStates={Array.from(finiteNodes)}
        inputSymbols={getInputSymbols()}
      />
      
      <TestInputPanel onTestInput={handleTestInput} />
      
      {isPopupOpen && (
        <InputPopup
          isOpen={isPopupOpen}
          onSubmit={handleSymbolInputSubmit}
          onClose={handleInputClose}
        />
      )}
      
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        ref={stageRef}
        onWheel={handleWheel}
        draggable={stageProps.draggable}
        onDragMove={handleDragMoveScreen}
        onClick={handleStageClick}
        x={stageProps.x}
        y={stageProps.y}
        scaleX={stageProps.scale}
        scaleY={stageProps.scale}
        className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} ${stageProps.draggable ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
      >
        <Layer>
          {showGrid && (
            <DynamicGridCanvas
              size={20}
              color={theme === 'dark' ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}
              stageProps={stageProps}
            />
          )}
        </Layer>
        
        <Layer>
          {showQuestion && image && (
            <KonvaImage
              image={image}
              x={window.innerWidth / 2 - 50}
              y={window.innerHeight / 2 - 50}
              width={100}
              height={100}
              opacity={0.7}
            />
          )}
          
          <DynamicNodeCanvas
            nodes={nodes}
            showGrid={showGrid}
            stageProps={stageProps}
            nodeMap={nodeMap}
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
    </div>
  );
};

export default AutomataSimulator;