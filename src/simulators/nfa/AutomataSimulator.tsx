'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer } from 'react-konva';
import dynamic from 'next/dynamic';
import ControlPanel from './components/ControlPanel';
import InputPopup from './components/InputPopup';
import { Node, NodeMap, HighlightedTransition, StageProps } from './type';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { useTheme } from '../../app/context/ThemeContext';
import NFAInfoPanel from './components/NFAInfoPanel';
import TestInputPanel from './components/TestInputPanel';
import { deserializeNFA, SerializedNFA, serializeNFA, encodeNFAForURL, validateNFA, computeEpsilonClosure, getNextStates } from './utils/nfaSerializer';
import { useSearchParams } from 'next/navigation';
import JsonInputDialog from './components/JsonInputDialog';

// Dynamically import the NodeCanvas component to prevent SSR issues with Konva
const DynamicNodeCanvas = dynamic(() => import('./components/NodeCanvas'), {
  ssr: false,
});

const DynamicGridCanvas = dynamic(() => import('./components/Grid'), {
  ssr: false,
});

interface AutomataSimulatorProps {
  initialNFA?: string; // Optional JSON string to initialize the NFA
}

const AutomataSimulator: React.FC<AutomataSimulatorProps> = ({ initialNFA }) => {
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [nodeMap, setNodeMap] = useState<NodeMap>({});
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [finiteNodes, setFiniteNodes] = useState<Set<string>>(new Set());
  const [inputString, setInputString] = useState<string>('');
  const [currNodes, setCurrNodes] = useState<Set<string>>(new Set());
  const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(new Set());
  const [validationResult, setValidationResult] = useState<string | null>(null);
  const [stageProps, setStageProps] = useState<StageProps>({
    x: 0,
    y: 0,
    scale: 1,
    draggable: true
  });
  const [stageDragging, setIsStageDragging] = useState<boolean>(false);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [highlightedTransitions, setHighlightedTransitions] = useState<HighlightedTransition[]>([]);
  const [showQuestion, setShowQuestion] = useState<boolean>(false);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isRunningStepWise, setIsRunningStepWise] = useState<boolean>(false);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [targetNode, setTargetNode] = useState<Node | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [jsonInputOpen, setJsonInputOpen] = useState<boolean>(false);
  const [jsonInput, setJsonInput] = useState<string>('');
  
  const stageRef = useRef<Konva.Stage>(null);

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check for NFA in URL params when component mounts
  useEffect(() => {
    if (isClient) {
      // First check for initialNFA prop
      if (initialNFA) {
        loadNFAFromJSON(initialNFA);
      } 
      // Then check URL params
      else {
        const nfaParam = searchParams.get('nfa');
        if (nfaParam) {
          try {
            const decodedNFA = decodeURIComponent(nfaParam);
            loadNFAFromJSON(decodedNFA);
          } catch (error) {
            console.error('Error loading NFA from URL:', error);
          }
        }
      }
    }
  }, [isClient, initialNFA, searchParams]);

  // Update NodeMap whenever nodes changes
  useEffect(() => {
    const map: NodeMap = {};
    nodes.forEach(node => {
      map[node.id] = node;
    });
    setNodeMap(map);
  }, [nodes]);

  /**
   * Loads an NFA from a JSON string
   */
  const loadNFAFromJSON = (jsonString: string): void => {
    try {
      const parsedNFA = deserializeNFA(jsonString);
      if (parsedNFA) {
        // Validate the NFA before loading
        const finalStatesSet = new Set<string>(parsedNFA.finalStates);
        const validationResult = validateNFA(parsedNFA.nodes, finalStatesSet);
        
        if (!validationResult.isValid) {
          setValidationResult(validationResult.errorMessage || 'Invalid NFA');
          return;
        }
        
        setNodes(parsedNFA.nodes);
        setFiniteNodes(finalStatesSet);
        
        // Reset simulation state
        resetSimulation();
        setValidationResult('NFA loaded successfully');
      } else {
        setValidationResult('Error: Invalid NFA format');
      }
    } catch (error) {
      console.error('Error loading NFA:', error);
      setValidationResult('Error loading NFA');
    }
  };

  /**
   * Handles the JSON input submission
   */
  const handleJsonInputSubmit = (): void => {
    if (jsonInput.trim()) {
      loadNFAFromJSON(jsonInput);
    }
    setJsonInputOpen(false);
    setJsonInput('');
  };

  /**
   * Toggles the JSON input dialog
   */
  const toggleJsonInput = (): void => {
    setJsonInputOpen(!jsonInputOpen);
  };

  // Clear highlighted transitions after a short delay
  useEffect(() => {
    let timerId: NodeJS.Timeout | null = null;
    if (highlightedTransitions.length > 0) {
      if (timerId) clearTimeout(timerId);
      timerId = setTimeout(() => {
        setHighlightedTransitions([]);
      }, 400);
    }
    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [highlightedTransitions]);

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
      // No need to check for determinism in NFA
      // Simply add the transition
      const symbolsToAdd = symbol.split(',').filter(s => s.trim());
      
      // Create a copy of the current nodes
      const updatedNodes = [...nodes];
      const nodeIndex = updatedNodes.findIndex(n => n.id === selectedNode.id);
      
      if (nodeIndex !== -1) {
        const transitionIndex = updatedNodes[nodeIndex].transitions.findIndex(
          item => item.targetid === targetNode.id
        );
        
        // Create a copy of the node to modify
        const updatedNode = { ...updatedNodes[nodeIndex] };
        
        if (transitionIndex !== -1) {
          // Update existing transition
          const updatedTransitions = [...updatedNode.transitions];
          const existingLabels = updatedTransitions[transitionIndex].label.split(',').filter(s => s.trim());
          const newLabels = [...new Set([...existingLabels, ...symbolsToAdd])]; // Remove duplicates
          
          updatedTransitions[transitionIndex] = {
            ...updatedTransitions[transitionIndex],
            label: newLabels.join(',')
          };
          
          updatedNode.transitions = updatedTransitions;
        } else {
          // Add new transition
          updatedNode.transitions = [
            ...updatedNode.transitions,
            { targetid: targetNode.id, label: symbol }
          ];
        }
        
        // Replace the node in the array
        updatedNodes[nodeIndex] = updatedNode;
        
        // No need for complex validation in NFA
        setNodes(updatedNodes);
      }
      
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
  
  const resetSimulation = (): void => {
    setIsRunning(false);
    setIsRunningStepWise(false);
    setShowQuestion(false);
    setValidationResult(null);
    setCurrNodes(new Set());
    setHighlightedNodes(new Set());
    setStepIndex(0);
    setHighlightedTransitions([]);
  };

  // NFA simulation
  const handleRun = async (): Promise<void> => {
    if (isRunning || !nodes.length) return;
    
    // Validate the NFA before running
    const validationResult = validateNFA(nodes, finiteNodes);
    if (!validationResult.isValid) {
      setValidationResult(validationResult.errorMessage || 'Invalid NFA');
      return;
    }
    
    setIsRunning(true);
    if (isRunningStepWise) setIsRunningStepWise(false);
    setShowQuestion(false);
    setSelectedNode(null);
    setHighlightedTransitions([]);
    setValidationResult(null);
    setStepIndex(0);
    
    // Start with initial state and compute ε-closure
    let currentStates = new Set<string>(['q0']);
    currentStates = computeEpsilonClosure(currentStates, nodes, nodeMap);
    setCurrNodes(currentStates);
    setHighlightedNodes(currentStates);
    
    // Process each input symbol
    for (let i = 0; i < inputString.length; i++) {
      await sleep(1000);
      const char = inputString[i];
      
      // Get next states based on current states and input symbol
      const nextStates = getNextStates(currentStates, char, nodes, nodeMap);
      
      // Highlight transitions
      const newHighlightedTransitions: HighlightedTransition[] = [];
      
      currentStates.forEach(stateId => {
        const state = nodeMap[stateId];
        if (state) {
          state.transitions.forEach(transition => {
            if (transition.label.split(',').some(label => label.trim() === char) && 
                nextStates.has(transition.targetid)) {
              newHighlightedTransitions.push({
                d: transition,
                target: stateId
              });
            }
          });
        }
      });
      
      setHighlightedTransitions(newHighlightedTransitions);
      
      if (nextStates.size === 0) {
        setShowQuestion(true);
        setValidationResult(`No transition for '${char}' from current states`);
        setIsRunning(false);
        return;
      }
      
      // Compute ε-closure of next states
      const nextWithEpsilon = computeEpsilonClosure(nextStates, nodes, nodeMap);
      
      await sleep(200);
      currentStates = nextWithEpsilon;
      setCurrNodes(currentStates);
      setHighlightedNodes(currentStates);
      setStepIndex(i + 1);
    }
    
    // Check if any final state is in current states
    const hasAcceptingState = Array.from(currentStates).some(stateId => finiteNodes.has(stateId));
    
    if (hasAcceptingState) {
      setValidationResult("String is Valid");
    } else {
      setValidationResult("String is invalid");
    }
    
    setIsRunning(false);
  };

  const handleStepWise = async (): Promise<void> => {
    if (selectedNode) setSelectedNode(null);
    
    if (!inputString || !nodes.length) return;
    
    const char = inputString[stepIndex];
    let currentStates = currNodes;
    
    if (currentStates.size === 0) {
      // First step - start with initial state and compute ε-closure
      currentStates = new Set<string>(['q0']);
      currentStates = computeEpsilonClosure(currentStates, nodes, nodeMap);
      setCurrNodes(currentStates);
      setHighlightedNodes(currentStates);
      return;
    }
    
    // Get next states based on current states and input symbol
    const nextStates = getNextStates(currentStates, char, nodes, nodeMap);
    
    // Highlight transitions
    const newHighlightedTransitions: HighlightedTransition[] = [];
    
    currentStates.forEach(stateId => {
      const state = nodeMap[stateId];
      if (state) {
        state.transitions.forEach(transition => {
          if (transition.label.split(',').some(label => label.trim() === char) && 
              nextStates.has(transition.targetid)) {
            newHighlightedTransitions.push({
              d: transition,
              target: stateId
            });
          }
        });
      }
    });
    
    setHighlightedTransitions(newHighlightedTransitions);
    
    if (nextStates.size === 0) {
      setIsRunningStepWise(false);
      setShowQuestion(true);
      setValidationResult(`No transition for '${char}' from current states`);
      return;
    }
    
    // Compute ε-closure of next states
    const nextWithEpsilon = computeEpsilonClosure(nextStates, nodes, nodeMap);
    
    await sleep(200);
    setCurrNodes(nextWithEpsilon);
    setHighlightedNodes(nextWithEpsilon);
    
    // Step wise finished
    if (stepIndex === inputString.length - 1 || !inputString) {
      setIsRunningStepWise(false);
      
      // Check if any final state is in current states
      const hasAcceptingState = Array.from(nextWithEpsilon).some(stateId => finiteNodes.has(stateId));
      
      if (hasAcceptingState) {
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
      // Validate the NFA before running
      const validationResult = validateNFA(nodes, finiteNodes);
      if (!validationResult.isValid) {
        setValidationResult(validationResult.errorMessage || 'Invalid NFA');
        return;
      }
      
      resetSimulation();
      setIsRunningStepWise(true);
      
      // Call handleStepWise after a short delay to allow state to update
      setTimeout(() => {
        handleStepWise();
      }, 100);
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

  const handleTestInput = (input: string): void => {
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
          if (symbol.trim() && symbol.trim() !== 'ε') {
            symbolsSet.add(symbol.trim());
          }
        });
      });
    });
    return Array.from(symbolsSet).sort();
  };

  /**
   * Generates a shareable URL with the current NFA state
   */
  const shareNFA = (): void => {
    try {
      // Create a URL with the encoded NFA
      const encodedNFA = encodeNFAForURL(nodes, finiteNodes);
      const url = `${window.location.origin}/simulator/nfa?nfa=${encodedNFA}`;
      
      // Copy to clipboard
      navigator.clipboard.writeText(url)
        .catch(err => {
          console.error('Failed to copy URL to clipboard:', err);
        });
    } catch (error) {
      console.error('Error generating shareable URL:', error);
    }
  };

  /**
   * Validates the current NFA and updates the validation result
   */
  const validateCurrentNFA = (): boolean => {
    const result = validateNFA(nodes, finiteNodes);
    if (!result.isValid) {
      setValidationResult(result.errorMessage || 'Invalid NFA');
      return false;
    }
    setValidationResult('Valid NFA');
    return true;
  };

  if (!isClient) {
    return null; // Return null on server side to prevent hydration mismatch
  }

  return (
    <div 
      className={`w-full h-full overflow-hidden relative
        ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}
      style={{
        cursor: stageProps.draggable && stageDragging ? 'grabbing' : stageProps.draggable ? 'grab' : 'default'
      }}
    >
      <ControlPanel
        onAddNode={handleAddNode}
        onSetFinite={handleSetFinite}
        onRun={handleRun}
        onStep={onStepWiseClick}
        onInputChange={(val) => setInputString(val)}
        inputString={inputString}
        validationResult={validationResult}
        selectedNode={selectedNode}
        isRunning={isRunning}
        isRunningStepWise={isRunningStepWise}
        showGrid={showGrid}
        onToggleGrid={() => setShowGrid(!showGrid)}
        stepIndex={stepIndex}
        onReset={resetSimulation}
        onLoadJson={toggleJsonInput}
        onValidate={validateCurrentNFA}
      />
      
      <NFAInfoPanel 
        states={nodes.map(node => node.id)} 
        initialState={nodes.length > 0 ? nodes[0].id : null}
        finalStates={Array.from(finiteNodes)}
        inputSymbols={getInputSymbols()}
        currentStates={Array.from(currNodes)}
      />
      
      <TestInputPanel 
        onTestInput={handleTestInput} 
        onShareNFA={shareNFA}
      />
      
      <div 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          overflow: 'hidden',
          touchAction: 'none'
        }}
      >
        <Stage
          ref={stageRef}
          width={window.innerWidth}
          height={window.innerHeight}
          className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}
          x={stageProps.x}
          y={stageProps.y}
          draggable={stageProps.draggable}
          onClick={handleStageClick}
          onDragMove={handleDragMoveScreen}
          onWheel={handleWheel}
          onPointerDown={(event) => { 
            if (event.evt.button === 1) setIsStageDragging(true); 
          }}
          onPointerUp={(event) => { 
            if (event.evt.button === 1) setIsStageDragging(false); 
          }}
          onTouchStart={() => setIsStageDragging(true)}
          onTouchEnd={() => setIsStageDragging(false)}
          scaleX={stageProps.scale}
          scaleY={stageProps.scale}
        >
          <Layer id="grid-layer" perfectDrawEnabled={false}>
            {showGrid && (
              <DynamicGridCanvas
                size={20}
                color={theme === 'dark' ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}
                stageProps={stageProps}
              />
            )}
          </Layer>
          
          <Layer id="node-layer" perfectDrawEnabled={false}>
            <DynamicNodeCanvas
              nodes={nodes}
              showGrid={showGrid}
              stageProps={stageProps}
              nodeMap={nodeMap}
              highlightedTransitions={highlightedTransitions}
              highlightedNodes={highlightedNodes}
              selectedNode={selectedNode}
              finiteNodes={finiteNodes}
              currNodes={currNodes}
              showQuestion={showQuestion}
              handleNodeClick={handleNodeClick}
              handleDragMove={handleDragMove}
              nodeMouseDown={nodeMouseDown}
              nodeMouseUp={nodeMouseUp}
            />
          </Layer>
        </Stage>
      </div>
      
      {isPopupOpen && (
        <InputPopup
          isOpen={isPopupOpen}
          onClose={handleInputClose}
          onSubmit={handleSymbolInputSubmit}
        />
      )}
      
      <JsonInputDialog
        isOpen={jsonInputOpen}
        onClose={() => setJsonInputOpen(false)}
        onSubmit={handleJsonInputSubmit}
        jsonInput={jsonInput}
        setJsonInput={setJsonInput}
      />
    </div>
  );
};

export default AutomataSimulator;