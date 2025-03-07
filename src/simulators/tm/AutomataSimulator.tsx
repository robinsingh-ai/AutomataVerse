'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer } from 'react-konva';
import dynamic from 'next/dynamic';
import ControlPanel from './components/ControlPanel';
import InputPopup from './components/InputPopup';
import TapePanel from './components/TapePanel';
import { Node, NodeMap, HighlightedTransition, StageProps, TMState, Tape, TapeMode } from './type';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { useTheme } from '../../app/context/ThemeContext';
import TMInfoPanel from './components/TMInfoPanel';
import TestInputPanel from './components/TestInputPanel';
import { 
  deserializeTM, 
  SerializedTM, 
  serializeTM, 
  encodeTMForURL, 
  validateTM, 
  getNextConfiguration, 
  applyTransition, 
  canTakeTransition 
} from './utils/tmSerializer';
import { useSearchParams } from 'next/navigation';
import JsonInputDialog from './components/JsonInputDialog';
import { auth, getCurrentUser } from '../../lib/firebase';
import { saveMachine } from '../../lib/machineService';
import SaveMachineToast from '../../app/components/SaveMachineToast';
import { useAuthState } from 'react-firebase-hooks/auth';

// Dynamically import the NodeCanvas component to prevent SSR issues with Konva
const DynamicNodeCanvas = dynamic(() => import('./components/NodeCanvas'), {
  ssr: false,
});

const DynamicGridCanvas = dynamic(() => import('./components/Grid'), {
  ssr: false,
});

interface TuringMachineSimulatorProps {
  initialTM?: string; // Optional JSON string to initialize the TM
}

const AutomataSimulator: React.FC<TuringMachineSimulatorProps> = ({ initialTM }) => {
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
  const [tapes, setTapes] = useState<Tape[]>([createEmptyTape()]);
  const [tapeMode, setTapeMode] = useState<TapeMode>('1-tape');
  const [currentConfiguration, setCurrentConfiguration] = useState<TMState | null>(null);
  
  const stageRef = useRef<Konva.Stage>(null);

  // Authentication state
  const [user] = useAuthState(auth);
  
  // Save machine state
  const [showSaveToast, setShowSaveToast] = useState<boolean>(false);
  const [shareUrl, setShareUrl] = useState<string>('');

  // Initialize stage props with window dimensions after component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setStageProps(prev => ({
        ...prev,
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      }));
    }
  }, []);

  // Function to create an empty tape
  function createEmptyTape(): Tape {
    return {
      content: new Map<number, string>(),
      headPosition: 0
    };
  }

  // Initialize tapes based on selected mode
  useEffect(() => {
    const numTapes = tapeMode === '1-tape' ? 1 : tapeMode === '2-tape' ? 2 : 3;
    
    // Ensure we have the correct number of tapes
    if (tapes.length !== numTapes) {
      const newTapes: Tape[] = [];
      
      // Keep existing tapes or create new ones
      for (let i = 0; i < numTapes; i++) {
        newTapes.push(i < tapes.length ? tapes[i] : createEmptyTape());
      }
      
      setTapes(newTapes);
    }
  }, [tapeMode, tapes.length]);

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check for TM in URL params when component mounts
  useEffect(() => {
    if (isClient) {
      // First check for initialTM prop
      if (initialTM) {
        loadTMFromJSON(initialTM);
      } 
      // Then check URL params
      else {
        const tmParam = searchParams.get('tm');
        if (tmParam) {
          try {
            const decodedTM = decodeURIComponent(tmParam);
            loadTMFromJSON(decodedTM);
          } catch (error) {
            console.error('Error loading TM from URL:', error);
          }
        }
      }
    }
  }, [isClient, initialTM, searchParams]);

  // Update NodeMap whenever nodes changes
  useEffect(() => {
    const map: NodeMap = {};
    nodes.forEach(node => {
      map[node.id] = node;
    });
    setNodeMap(map);
  }, [nodes]);

  /**
   * Loads a TM from a JSON string
   */
  const loadTMFromJSON = (jsonString: string): void => {
    try {
      const parsedTM = deserializeTM(jsonString);
      if (parsedTM) {
        // Validate the TM before loading
        const finalStatesSet = new Set<string>(parsedTM.finalStates);
        const validationResult = validateTM(parsedTM.nodes, finalStatesSet, parsedTM.tapeMode || '1-tape');
        
        if (!validationResult.isValid) {
          setValidationResult(validationResult.errorMessage || 'Invalid TM');
          return;
        }
        
        setNodes(parsedTM.nodes);
        setFiniteNodes(finalStatesSet);
        if (parsedTM.tapeMode) {
          setTapeMode(parsedTM.tapeMode);
        }
        
        // Reset simulation state
        resetSimulation();
        setValidationResult('TM loaded successfully');
      } else {
        setValidationResult('Error: Invalid TM format');
      }
    } catch (error) {
      console.error('Error loading TM:', error);
      setValidationResult('Error loading TM');
    }
  };

  /**
   * Handles the JSON input submission
   */
  const handleJsonInputSubmit = (): void => {
    if (jsonInput.trim()) {
      loadTMFromJSON(jsonInput);
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
    
    // For multi-tape TM, verify each tape transition part has 3 components
    const tapeParts = transitionInfo.split(';');
    
    if (tapeParts.length !== (tapeMode === '1-tape' ? 1 : tapeMode === '2-tape' ? 2 : 3)) {
      console.warn(`Expected ${tapeMode} transitions, got ${tapeParts.length}`);
      return;
    }
    
    for (const tapePart of tapeParts) {
      const components = tapePart.split(',');
      if (components.length !== 3) {
        console.warn(`Invalid transition format: ${tapePart}. Expected format is "read,write,direction"`);
        return;
      }
      
      // Validate direction
      const direction = components[2];
      if (direction !== 'L' && direction !== 'R' && direction !== 'S') {
        console.warn(`Invalid direction: ${direction}. Must be 'L', 'R', or 'S'`);
        return;
      }
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
    
    // Reset tapes
    const numTapes = tapeMode === '1-tape' ? 1 : tapeMode === '2-tape' ? 2 : 3;
    const newTapes: Tape[] = [];
    
    for (let i = 0; i < numTapes; i++) {
      newTapes.push(createEmptyTape());
    }
    
    setTapes(newTapes);
    setCurrentConfiguration(null);
  };

  // Initialize tapes with input string for simulation
  const initializeTapes = (input: string): Tape[] => {
    const numTapes = tapeMode === '1-tape' ? 1 : tapeMode === '2-tape' ? 2 : 3;
    const newTapes: Tape[] = [];
    
    // Initialize first tape with input
    const firstTape: Tape = {
      content: new Map<number, string>(),
      headPosition: 0
    };
    
    // Place input on first tape
    for (let i = 0; i < input.length; i++) {
      firstTape.content.set(i, input[i]);
    }
    
    newTapes.push(firstTape);
    
    // Initialize other tapes as empty
    for (let i = 1; i < numTapes; i++) {
      newTapes.push(createEmptyTape());
    }
    
    return newTapes;
  };

  // TM simulation
  const handleRun = async (): Promise<void> => {
    if (isRunning || !nodes.length) return;
    
    // Validate the TM before running
    const validationResult = validateTM(nodes, finiteNodes, tapeMode);
    if (!validationResult.isValid) {
      setValidationResult(validationResult.errorMessage || 'Invalid TM');
      return;
    }
    
    setIsRunning(true);
    if (isRunningStepWise) setIsRunningStepWise(false);
    setShowQuestion(false);
    setSelectedNode(null);
    setHighlightedTransitions([]);
    setValidationResult(null);
    setStepIndex(0);
    
    // Initialize tapes with input
    const initialTapes = initializeTapes(inputString);
    setTapes(initialTapes);
    
    // Start with initial configuration
    let currentConfig: TMState = {
      stateId: 'q0',
      tapes: initialTapes,
      halted: false,
      accepted: false
    };
    
    setCurrentConfiguration(currentConfig);
    setCurrNodes(new Set([currentConfig.stateId]));
    
    // Maximum step count to prevent infinite loops
    const MAX_STEPS = 1000;
    let stepCount = 0;
    
    // Run the TM until it halts or reaches max steps
    while (!currentConfig.halted && stepCount < MAX_STEPS) {
      await sleep(500); // Delay for animation
      
      // Get next configuration
      const nextConfig = getNextConfiguration(currentConfig, nodes, nodeMap);
      
      // If no valid transition exists
      if (!nextConfig || nextConfig.halted) {
        if (nextConfig && finiteNodes.has(nextConfig.stateId)) {
          setValidationResult("Input Accepted");
          setCurrNodes(new Set([nextConfig.stateId]));
          setTapes(nextConfig.tapes);
        } else {
          setValidationResult("Input Rejected");
        }
        
        if (nextConfig) {
          setTapes(nextConfig.tapes);
        }
        
        setIsRunning(false);
        return;
      }
      
      // Highlight the transition
      const currentNode = nodeMap[currentConfig.stateId];
      
      if (currentNode) {
        const transition = currentNode.transitions.find(t => {
          const nextState = getNextConfiguration(currentConfig, nodes, nodeMap, t);
          return nextState && nextState.stateId === nextConfig.stateId;
        });
        
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
      setTapes(currentConfig.tapes);
      setStepIndex(stepCount + 1);
      
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
      const initialTapes = initializeTapes(inputString);
      
      const initialConfig: TMState = {
        stateId: 'q0',
        tapes: initialTapes,
        halted: false,
        accepted: false
      };
      
      setCurrentConfiguration(initialConfig);
      setCurrNodes(new Set([initialConfig.stateId]));
      setTapes(initialTapes);
      return;
    }
    
    // Get next configuration
    const nextConfig = getNextConfiguration(currentConfiguration, nodes, nodeMap);
    
    // If no valid transition exists or we've halted
    if (!nextConfig || nextConfig.halted) {
      if (nextConfig && finiteNodes.has(nextConfig.stateId)) {
        setValidationResult("Input Accepted");
        setCurrNodes(new Set([nextConfig.stateId]));
        setTapes(nextConfig.tapes);
      } else {
        setValidationResult("Input Rejected");
      }
      
      if (nextConfig) {
        setTapes(nextConfig.tapes);
      }
      
      setIsRunningStepWise(false);
      return;
    }
    
    // Highlight the transition
    const currentNode = nodeMap[currentConfiguration.stateId];
    
    if (currentNode) {
      const transition = currentNode.transitions.find(t => {
        const nextState = getNextConfiguration(currentConfiguration, nodes, nodeMap, t);
        return nextState && nextState.stateId === nextConfig.stateId;
      });
      
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
    setTapes(nextConfig.tapes);
    setStepIndex(prevStepIndex => prevStepIndex + 1);
  };

  const onStepWiseClick = (): void => {
    if (isRunning || !nodes.length) return;
    
    if (isRunningStepWise) {
      handleStepWise();
    } else {
      // Validate the TM before running
      const validationResult = validateTM(nodes, finiteNodes, tapeMode);
      if (!validationResult.isValid) {
        setValidationResult(validationResult.errorMessage || 'Invalid TM');
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

  const handleTapeModeChange = (mode: TapeMode): void => {
    if (isRunning || isRunningStepWise) return; // Don't allow changes during simulation
    setTapeMode(mode);
    resetSimulation();
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

  // Calculate all input and tape symbols used in the transitions
  const getSymbols = (): { inputSymbols: string[], tapeSymbols: string[] } => {
    const inputSymbolsSet = new Set<string>();
    const tapeSymbolsSet = new Set<string>(['□']); // Always include the blank symbol
    
    nodes.forEach(node => {
      node.transitions.forEach(transition => {
        const tapeParts = transition.label.split(';');
        
        for (const tapePart of tapeParts) {
          const [readSym, writeSym] = tapePart.split(',');
          
          // Add non-blank read symbols to input alphabet
          if (readSym && readSym !== '□') {
            inputSymbolsSet.add(readSym);
          }
          
          // Add all symbols (read and write) to tape alphabet
          if (readSym) {
            tapeSymbolsSet.add(readSym);
          }
          
          if (writeSym) {
            tapeSymbolsSet.add(writeSym);
          }
        }
      });
    });
    
    return {
      inputSymbols: Array.from(inputSymbolsSet).sort(),
      tapeSymbols: Array.from(tapeSymbolsSet).sort()
    };
  };

  /**
   * Generates a shareable URL with the current TM state
   */
  const shareTM = (): void => {
    try {
      // Create a URL with the encoded TM
      const encodedTM = encodeTMForURL(nodes, finiteNodes, tapeMode);
      const relativePath = `/simulator/tm?tm=${encodedTM}`;
      const fullUrl = `${window.location.origin}${relativePath}`;
      
      // Store the relative path for saving
      setShareUrl(relativePath);
      
      // Copy full URL to clipboard
      navigator.clipboard.writeText(fullUrl)
        .catch(err => {
          console.error('Failed to copy URL to clipboard:', err);
        });
    } catch (error) {
      console.error('Error generating shareable URL:', error);
    }
  };

  /**
   * Open the save dialog
   */
  const handleSave = (): void => {
    // Generate the share URL if it doesn't exist
    if (!shareUrl) {
      try {
        const encodedTM = encodeTMForURL(nodes, finiteNodes, tapeMode);
        const relativePath = `/simulator/tm?tm=${encodedTM}`;
        setShareUrl(relativePath);
      } catch (error) {
        console.error('Error generating URL for saving:', error);
        return;
      }
    }
    
    // Show the save toast
    setShowSaveToast(true);
  };

  /**
   * Save the machine to Firebase
   */
  const handleSaveMachine = async (title: string, description: string): Promise<void> => {
    if (!user) {
      alert('You must be logged in to save a machine');
      return;
    }
    
    try {
      // Save the machine to Firebase
      await saveMachine({
        userId: user.uid,
        title,
        description,
        machineUrl: shareUrl,
        machineType: `Turing Machine (${tapeMode})`
      });
      
      // Close the save toast
      setShowSaveToast(false);
      
      // Show success message
      alert('Machine saved successfully!');
    } catch (error) {
      console.error('Error saving machine:', error);
      alert('Failed to save machine. Please try again.');
    }
  };

  /**
   * Validates the current TM and updates the validation result
   */
  const validateCurrentTM = (): boolean => {
    const result = validateTM(nodes, finiteNodes, tapeMode);
    if (!result.isValid) {
      setValidationResult(result.errorMessage || 'Invalid TM');
      return false;
    }
    setValidationResult('Valid TM');
    return true;
  };

  if (!isClient) {
    return null; // Return null on server side to prevent hydration mismatch
  }

  const { inputSymbols, tapeSymbols } = getSymbols();

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
        onValidate={validateCurrentTM}
        tapeMode={tapeMode}
        onTapeModeChange={handleTapeModeChange}
        tapes={tapes}
        onSave={handleSave}
        isLoggedIn={!!user}
      />
      
      <TMInfoPanel 
        states={nodes.map(node => node.id)} 
        initialState={nodes.length > 0 ? nodes[0].id : null}
        finalStates={Array.from(finiteNodes)}
        inputSymbols={inputSymbols}
        tapeSymbols={tapeSymbols}
        currentState={Array.from(currNodes).join(', ')}
        tapeMode={tapeMode}
      />
      
      <TapePanel 
        tapes={tapes} 
        tapeMode={tapeMode}
      />
      
      <TestInputPanel 
        onTestInput={handleTestInput} 
        onShareTM={shareTM}
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
          tapeMode={tapeMode}
        />
      )}
      
      <JsonInputDialog
        isOpen={jsonInputOpen}
        onClose={() => setJsonInputOpen(false)}
        onSubmit={handleJsonInputSubmit}
        jsonInput={jsonInput}
        setJsonInput={setJsonInput}
      />
      
      {/* Save machine toast/modal */}
      <SaveMachineToast
        isOpen={showSaveToast}
        onClose={() => setShowSaveToast(false)}
        onSave={handleSaveMachine}
      />
    </div>
  );
};

export default AutomataSimulator;