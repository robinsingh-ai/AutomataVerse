'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer } from 'react-konva';
import dynamic from 'next/dynamic';
import ControlPanel from './components/ControlPanel';
import InputPopup from './components/InputPopup';
import StackPanel from './components/StackPanel';
import { Node, NodeMap, HighlightedTransition, StageProps, PDAState, Stack } from './type';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { useTheme } from '../../app/context/ThemeContext';
import PDAInfoPanel from './components/PDAInfoPanel';
import TestInputPanel from './components/TestInputPanel';
import { 
  deserializePDA,
  encodePDAForURL, 
  validatePDA, 
  getNextConfigurations
} from './utils/pdaSerializer';
import { useSearchParams } from 'next/navigation';
import JsonInputDialog from './components/JsonInputDialog';

// Dynamically import the NodeCanvas component to prevent SSR issues with Konva
const DynamicNodeCanvas = dynamic(() => import('./components/NodeCanvas'), {
  ssr: false,
});

const DynamicGridCanvas = dynamic(() => import('./components/Grid'), {
  ssr: false,
});

interface PushdownAutomataSimulatorProps {
  initialPDA?: string; // Optional JSON string to initialize the PDA
}

const AutomataSimulator: React.FC<PushdownAutomataSimulatorProps> = ({ initialPDA }) => {
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
  const [stack, setStack] = useState<Stack>({ content: [] });
  const [currentConfiguration, setCurrentConfiguration] = useState<PDAState | null>(null);
  
  const stageRef = useRef<Konva.Stage>(null);

  // Function to create an empty stack
  function createEmptyStack(): Stack {
    return { content: ['Z'] }; // Initialize with bottom marker 'Z'
  }

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check for PDA in URL params when component mounts
  useEffect(() => {
    if (isClient) {
      // First check for initialPDA prop
      if (initialPDA) {
        loadPDAFromJSON(initialPDA);
      } 
      // Then check URL params
      else {
        const pdaParam = searchParams.get('pda');
        if (pdaParam) {
          try {
            const decodedPDA = decodeURIComponent(pdaParam);
            loadPDAFromJSON(decodedPDA);
          } catch (error) {
            console.error('Error loading PDA from URL:', error);
          }
        }
      }
    }
  }, [isClient, initialPDA, searchParams]);

  // Update NodeMap whenever nodes changes
  useEffect(() => {
    const map: NodeMap = {};
    nodes.forEach(node => {
      map[node.id] = node;
    });
    setNodeMap(map);
  }, [nodes]);

  /**
   * Loads a PDA from a JSON string
   */
  const loadPDAFromJSON = (jsonString: string): void => {
    try {
      const parsedPDA = deserializePDA(jsonString);
      if (parsedPDA) {
        // Validate the PDA before loading
        const finalStatesSet = new Set<string>(parsedPDA.finalStates);
        const validationResult = validatePDA(parsedPDA.nodes, finalStatesSet);
        
        if (!validationResult.isValid) {
          setValidationResult(validationResult.errorMessage || 'Invalid PDA');
          return;
        }
        
        setNodes(parsedPDA.nodes);
        setFiniteNodes(finalStatesSet);
        
        // Reset simulation state
        resetSimulation();
        setValidationResult('PDA loaded successfully');
      } else {
        setValidationResult('Error: Invalid PDA format');
      }
    } catch (error) {
      console.error('Error loading PDA:', error);
      setValidationResult('Error loading PDA');
    }
  };

  /**
   * Handles the JSON input submission
   */
  const handleJsonInputSubmit = (): void => {
    if (jsonInput.trim()) {
      loadPDAFromJSON(jsonInput);
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

  const handleSymbolInputSubmit = (transitionInfo: string): void => {
    if (!transitionInfo) {
      console.warn("Invalid transition format");
      return;
    }
    
    // Verify transition format: "input,pop,push"
    const parts = transitionInfo.split(',');
    if (parts.length !== 3) {
      console.warn("Invalid transition format. Expected format is 'input,pop,push'");
      return;
    }
    
    if (!targetNode) {
      console.warn("No target node was selected.");
      return;
    }

    if (selectedNode) {
      // Add the transition with the formatted info
      const updatedNodes = [...nodes];
      const nodeIndex = updatedNodes.findIndex(n => n.id === selectedNode.id);
      
      if (nodeIndex !== -1) {
        const transitionIndex = updatedNodes[nodeIndex].transitions.findIndex(
          item => item.targetid === targetNode.id && item.label === transitionInfo
        );
        
        // Create a copy of the node to modify
        const updatedNode = { ...updatedNodes[nodeIndex] };
        
        if (transitionIndex === -1) {
          // Add new transition only if it doesn't exist already
          updatedNode.transitions = [
            ...updatedNode.transitions,
            { targetid: targetNode.id, label: transitionInfo }
          ];
          
          // Replace the node in the array
          updatedNodes[nodeIndex] = updatedNode;
          setNodes(updatedNodes);
        }
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
    
    // Reset stack
    setStack(createEmptyStack());
    setCurrentConfiguration(null);
  };

  // Initialize the PDA simulation
  const initializePDA = (input: string): PDAState => {
    return {
      stateId: 'q0',
      inputString: input,
      inputPosition: 0,
      stack: createEmptyStack(),
      halted: false,
      accepted: false
    };
  };

  // PDA simulation
  const handleRun = async (): Promise<void> => {
    if (isRunning || !nodes.length) return;
    
    // Validate the PDA before running
    const validationResult = validatePDA(nodes, finiteNodes);
    if (!validationResult.isValid) {
      setValidationResult(validationResult.errorMessage || 'Invalid PDA');
      return;
    }
    
    setIsRunning(true);
    if (isRunningStepWise) setIsRunningStepWise(false);
    setShowQuestion(false);
    setSelectedNode(null);
    setHighlightedTransitions([]);
    setValidationResult(null);
    setStepIndex(0);
    
    // Initialize PDA with input
    const initialConfig = initializePDA(inputString);
    setCurrentConfiguration(initialConfig);
    setStack(initialConfig.stack);
    setCurrNodes(new Set([initialConfig.stateId]));
    setHighlightedNodes(new Set([initialConfig.stateId]));
    
    // For visual simulation, we'll do a simple step-by-step approach
    // (the real acceptance test uses a more sophisticated BFS algorithm)
    
    // Maximum step count to prevent infinite loops
    const MAX_STEPS = 100;
    let stepCount = 0;
    
    // Start with initial configuration
    let currentConfig = initialConfig;
    
    // Run the PDA until it halts or reaches max steps
    while (stepCount < MAX_STEPS) {
      await sleep(500); // Delay for animation
      
      // Get next configurations (could be multiple due to non-determinism)
      const nextConfigs = getNextConfigurations(currentConfig, nodes, nodeMap, finiteNodes);
      
      // If no valid transitions exist
      if (nextConfigs.length === 0) {
        // Check if we've reached the end of the input
        if (currentConfig.inputPosition >= currentConfig.inputString.length) {
          if (finiteNodes.has(currentConfig.stateId)) {
            setValidationResult("Input Accepted");
          } else {
            setValidationResult("Input Rejected");
          }
        } else {
          setValidationResult("Input Rejected");
        }
        
        setIsRunning(false);
        return;
      }
      
      // For visualization, we'll take the first possible transition
      // (real acceptance test handles all possibilities)
      const nextConfig = nextConfigs[0];
      
      // Check if we're halted
      if (nextConfig.halted) {
        if (nextConfig.accepted) {
          setValidationResult("Input Accepted");
        } else {
          setValidationResult("Input Rejected");
        }
        
        setIsRunning(false);
        return;
      }
      
      // Highlight the transition
      const currentNode = nodeMap[currentConfig.stateId];
      
      if (currentNode) {
        // Find the transition that was taken
        const transition = currentNode.transitions.find(t => 
          t.targetid === nextConfig.stateId
        );
        
        if (transition) {
          setHighlightedTransitions([{
            d: transition,
            target: currentConfig.stateId
          }]);
        }
      }
      
      // Update the configuration
      currentConfig = nextConfig;
      setCurrentConfiguration(currentConfig);
      setCurrNodes(new Set([currentConfig.stateId]));
      setHighlightedNodes(new Set([currentConfig.stateId]));
      setStack(currentConfig.stack);
      setStepIndex(stepCount + 1);
      
      // If we've consumed all input and reached a final state, we're done
      if (currentConfig.inputPosition >= currentConfig.inputString.length && 
          finiteNodes.has(currentConfig.stateId)) {
        setValidationResult("Input Accepted");
        setIsRunning(false);
        return;
      }
      
      stepCount++;
    }
    
    // Check if we reached MAX_STEPS (potential infinite loop)
    if (stepCount >= MAX_STEPS) {
      setValidationResult("Halting problem: Reached maximum step count");
    }
    
    setIsRunning(false);
  };

  const handleStepWise = async (): Promise<void> => {
    if (selectedNode) setSelectedNode(null);
    
    if (!currentConfiguration) {
      // First step - initialize
      const initialConfig = initializePDA(inputString);
      
      setCurrentConfiguration(initialConfig);
      setCurrNodes(new Set(['q0']));
      setHighlightedNodes(new Set(['q0']));
      setStack(initialConfig.stack);
      return;
    }
    
    // Get next configurations
    const nextConfigs = getNextConfigurations(currentConfiguration, nodes, nodeMap, finiteNodes);
    
    // If no valid transitions exist or we've halted
    if (nextConfigs.length === 0) {
      // Check if we're in a final state and have consumed all input
      if (currentConfiguration.inputPosition >= currentConfiguration.inputString.length && 
          finiteNodes.has(currentConfiguration.stateId)) {
        setValidationResult("Input Accepted");
      } else {
        setValidationResult("Input Rejected");
      }
      
      setIsRunningStepWise(false);
      return;
    }
    
    // For visualization, take the first possible transition
    const nextConfig = nextConfigs[0];
    
    // Check if we've halted
    if (nextConfig.halted) {
      if (nextConfig.accepted) {
        setValidationResult("Input Accepted");
      } else {
        setValidationResult("Input Rejected");
      }
      
      setIsRunningStepWise(false);
      return;
    }
    
    // Highlight the transition
    const currentNode = nodeMap[currentConfiguration.stateId];
    
    if (currentNode) {
      const transition = currentNode.transitions.find(t => 
        t.targetid === nextConfig.stateId
      );
      
      if (transition) {
        setHighlightedTransitions([{
          d: transition,
          target: currentConfiguration.stateId
        }]);
      }
    }
    
    // Update the configuration
    setCurrentConfiguration(nextConfig);
    setCurrNodes(new Set([nextConfig.stateId]));
    setHighlightedNodes(new Set([nextConfig.stateId]));
    setStack(nextConfig.stack);
    setStepIndex(prevStepIndex => prevStepIndex + 1);
  };

  const onStepWiseClick = (): void => {
    if (isRunning || !nodes.length) return;
    
    if (isRunningStepWise) {
      handleStepWise();
    } else {
      // Validate the PDA before running
      const validationResult = validatePDA(nodes, finiteNodes);
      if (!validationResult.isValid) {
        setValidationResult(validationResult.errorMessage || 'Invalid PDA');
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

  // Calculate all input and stack symbols used in the transitions
  const getSymbols = (): { inputSymbols: string[], stackSymbols: string[] } => {
    const inputSymbolsSet = new Set<string>();
    const stackSymbolsSet = new Set<string>(['Z']); // Always include the bottom marker
    
    nodes.forEach(node => {
      node.transitions.forEach(transition => {
        const [inputSym, popSym, pushSym] = transition.label.split(',');
        
        // Add non-epsilon input symbols
        if (inputSym && inputSym !== 'ε') {
          inputSymbolsSet.add(inputSym);
        }
        
        // Add stack symbols (pop and push)
        if (popSym && popSym !== 'ε') {
          stackSymbolsSet.add(popSym);
        }
        
        if (pushSym && pushSym !== 'ε') {
          // Add each character of push string as a stack symbol
          for (const sym of pushSym) {
            stackSymbolsSet.add(sym);
          }
        }
      });
    });
    
    return {
      inputSymbols: Array.from(inputSymbolsSet).sort(),
      stackSymbols: Array.from(stackSymbolsSet).sort()
    };
  };

  /**
   * Generates a shareable URL with the current PDA state
   */
  const sharePDA = (): void => {
    try {
      // Create a URL with the encoded PDA
      const encodedPDA = encodePDAForURL(nodes, finiteNodes);
      const url = `${window.location.origin}/simulator/pda?pda=${encodedPDA}`;
      
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
   * Validates the current PDA and updates the validation result
   */
  const validateCurrentPDA = (): boolean => {
    const result = validatePDA(nodes, finiteNodes);
    if (!result.isValid) {
      setValidationResult(result.errorMessage || 'Invalid PDA');
      return false;
    }
    setValidationResult('Valid PDA');
    return true;
  };

  if (!isClient) {
    return null; // Return null on server side to prevent hydration mismatch
  }

  const { inputSymbols, stackSymbols } = getSymbols();

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
        onValidate={validateCurrentPDA}
        stack={stack}
      />
      
      <PDAInfoPanel 
        states={nodes.map(node => node.id)} 
        initialState={nodes.length > 0 ? nodes[0].id : null}
        finalStates={Array.from(finiteNodes)}
        inputSymbols={inputSymbols}
        stackSymbols={stackSymbols}
        currentState={Array.from(currNodes)[0] || null}
        currentPosition={currentConfiguration ? currentConfiguration.inputPosition : 0}
        inputString={inputString}
      />
      
      <StackPanel 
        stack={stack} 
      />
      
      <TestInputPanel 
        onTestInput={handleTestInput} 
        onSharePDA={sharePDA}
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