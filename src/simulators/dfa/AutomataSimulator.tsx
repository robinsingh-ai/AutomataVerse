'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer } from 'react-konva';
import dynamic from 'next/dynamic';
import ControlPanel from './components/ControlPanel';
import InputPopup from './components/InputPopup';
import DFAInfoPanel from './components/DFAInfoPanel';
import { Node, NodeMap, HighlightedTransition, StageProps, DFAState } from './type';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { useTheme } from '../../app/context/ThemeContext';
import TestInputPanel from './components/TestInputPanel';
import { 
  deserializeDFA, 
  encodeDFAForURL, 
  validateDFA, 
  getNextConfiguration
} from './utils/dfaSerializer';
import { useSearchParams } from 'next/navigation';
import JsonInputDialog from './components/JsonInputDialog';
import { auth } from '../../lib/firebase';
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

interface DFASimulatorProps {
  initialDFA?: string; // Optional JSON string to initialize the DFA
}

const AutomataSimulator: React.FC<DFASimulatorProps> = ({ initialDFA }) => {
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  
  // Authentication state
  const [user] = useAuthState(auth);
  
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
  const [currentConfiguration, setCurrentConfiguration] = useState<DFAState | null>(null);
  
  // Save machine state
  const [showSaveToast, setShowSaveToast] = useState<boolean>(false);
  const [shareUrl, setShareUrl] = useState<string>('');
  
  const stageRef = useRef<Konva.Stage>(null);

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check for DFA in URL params when component mounts
  useEffect(() => {
    if (isClient) {
      // First check for initialDFA prop
      if (initialDFA) {
        loadDFAFromJSON(initialDFA);
      } 
      // Then check URL params
      else {
        const dfaParam = searchParams.get('dfa');
        if (dfaParam) {
          try {
            const decodedDFA = decodeURIComponent(dfaParam);
            loadDFAFromJSON(decodedDFA);
          } catch (error) {
            console.error('Error loading DFA from URL:', error);
          }
        }
      }
    }
  }, [isClient, initialDFA, searchParams]);

  // Update NodeMap whenever nodes changes
  useEffect(() => {
    const map: NodeMap = {};
    nodes.forEach(node => {
      map[node.id] = node;
    });
    setNodeMap(map);
  }, [nodes]);

  /**
   * Loads a DFA from a JSON string
   */
  const loadDFAFromJSON = (jsonString: string): void => {
    try {
      const parsedDFA = deserializeDFA(jsonString);
      if (parsedDFA) {
        // Validate the DFA before loading
        const finalStatesSet = new Set<string>(parsedDFA.finalStates);
        const validationResult = validateDFA(parsedDFA.nodes, finalStatesSet);
        
        if (!validationResult.isValid) {
          setValidationResult(validationResult.errorMessage || 'Invalid DFA');
          return;
        }
        
        setNodes(parsedDFA.nodes);
        setFiniteNodes(finalStatesSet);
        
        // Reset simulation state
        resetSimulation();
        setValidationResult('DFA loaded successfully');
      } else {
        setValidationResult('Error: Invalid DFA format');
      }
    } catch (error) {
      console.error('Error loading DFA:', error);
      setValidationResult('Error loading DFA');
    }
  };

  /**
   * Handles the JSON input submission
   */
  const handleJsonInputSubmit = (): void => {
    if (jsonInput.trim()) {
      loadDFAFromJSON(jsonInput);
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
    
    // Verify transition format is a single input symbol 
    if (transitionInfo.length === 0) {
      console.warn("Transition must be a single input symbol");
      return;
    }
    
    if (!targetNode) {
      console.warn("No target node was selected.");
      return;
    }

    if (selectedNode) {
      // First check if this state already has a transition for this input symbol
      const existingTransition = selectedNode.transitions.find(t => t.label === transitionInfo);
      if (existingTransition) {
        console.warn(`State ${selectedNode.id} already has a transition for input symbol ${transitionInfo}`);
        setValidationResult(`Error: State ${selectedNode.id} already has a transition for input symbol ${transitionInfo}`);
        setIsPopupOpen(false);
        setSelectedNode(null);
        setTargetNode(null);
        return;
      }
      
      // Add the transition
      const updatedNodes = [...nodes];
      const nodeIndex = updatedNodes.findIndex(n => n.id === selectedNode.id);
      
      if (nodeIndex !== -1) {
        // Create a copy of the node to modify
        const updatedNode = { ...updatedNodes[nodeIndex] };
        
        // Add new transition
        updatedNode.transitions = [
          ...updatedNode.transitions,
          { targetid: targetNode.id, label: transitionInfo }
        ];
        
        // Replace the node in the array
        updatedNodes[nodeIndex] = updatedNode;
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
    setCurrentConfiguration(null);
  };

  // Initialize the DFA simulation
  const initializeDFA = (input: string): DFAState => {
    return {
      stateId: 'q0',
      inputString: input,
      inputPosition: 0,
      halted: false,
      accepted: false
    };
  };

  // DFA simulation
  const handleRun = async (): Promise<void> => {
    if (isRunning || !nodes.length) return;
    
    // Validate the DFA before running
    const validationResult = validateDFA(nodes, finiteNodes);
    if (!validationResult.isValid) {
      setValidationResult(validationResult.errorMessage || 'Invalid DFA');
      return;
    }
    
    setIsRunning(true);
    if (isRunningStepWise) setIsRunningStepWise(false);
    setShowQuestion(false);
    setSelectedNode(null);
    setHighlightedTransitions([]);
    setValidationResult(null);
    setStepIndex(0);
    
    // Initialize DFA with input
    const initialConfig = initializeDFA(inputString);
    setCurrentConfiguration(initialConfig);
    setCurrNodes(new Set([initialConfig.stateId]));
    setHighlightedNodes(new Set([initialConfig.stateId]));
    
    // Start with initial configuration
    let currentConfig = initialConfig;
    
    // Run the DFA until it halts or rejects
    while (!currentConfig.halted) {
      await sleep(500); // Delay for animation
      
      // Get next configuration
      const nextConfig = getNextConfiguration(currentConfig, nodes, nodeMap);
      
      // If no valid transition exists
      if (!nextConfig || nextConfig.halted) {
        if (nextConfig && currentConfig.inputPosition >= inputString.length && finiteNodes.has(currentConfig.stateId)) {
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
          t.targetid === nextConfig.stateId && 
          t.label === inputString[currentConfig.inputPosition]
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
      setStepIndex(prevStep => prevStep + 1);
      
      // Check if we've consumed all input
      if (currentConfig.inputPosition >= inputString.length) {
        // If in an accepting state, accept
        if (finiteNodes.has(currentConfig.stateId)) {
          setValidationResult("Input Accepted");
        } else {
          setValidationResult("Input Rejected");
        }
        
        setIsRunning(false);
        return;
      }
    }
    
    setIsRunning(false);
  };

  const handleStepWise = async (): Promise<void> => {
    if (selectedNode) setSelectedNode(null);
    
    if (!currentConfiguration) {
      // First step - initialize
      const initialConfig = initializeDFA(inputString);
      
      setCurrentConfiguration(initialConfig);
      setCurrNodes(new Set(['q0']));
      setHighlightedNodes(new Set(['q0']));
      return;
    }
    
    // Get next configuration
    const nextConfig = getNextConfiguration(currentConfiguration, nodes, nodeMap);
    
    // If no valid transition exists or we've halted
    if (!nextConfig || nextConfig.halted) {
      // Check if we've consumed all input and are in an accepting state
      if (currentConfiguration.inputPosition >= inputString.length && finiteNodes.has(currentConfiguration.stateId)) {
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
        t.targetid === nextConfig.stateId && 
        t.label === inputString[currentConfiguration.inputPosition]
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
    setStepIndex(prevStepIndex => prevStepIndex + 1);
    
    // Check if we've consumed all input
    if (nextConfig.inputPosition >= inputString.length) {
      // If in an accepting state, accept
      if (finiteNodes.has(nextConfig.stateId)) {
        setValidationResult("Input Accepted");
      } else {
        setValidationResult("Input Rejected");
      }
      
      setIsRunningStepWise(false);
      return;
    }
  };

  const onStepWiseClick = (): void => {
    if (isRunning || !nodes.length) return;
    
    if (isRunningStepWise) {
      handleStepWise();
    } else {
      // Validate the DFA before running
      const validationResult = validateDFA(nodes, finiteNodes);
      if (!validationResult.isValid) {
        setValidationResult(validationResult.errorMessage || 'Invalid DFA');
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
    const inputSymbolsSet = new Set<string>();
    
    nodes.forEach(node => {
      node.transitions.forEach(transition => {
        if (transition.label) {
          inputSymbolsSet.add(transition.label);
        }
      });
    });
    
    return Array.from(inputSymbolsSet).sort();
  };

  /**
   * Generates a shareable URL with the current DFA state
   */
  const shareDFA = (): void => {
    try {
      // Create a URL with the encoded DFA
      const encodedDFA = encodeDFAForURL(nodes, finiteNodes);
      const relativePath = `/simulator/dfa?dfa=${encodedDFA}`;
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
        const encodedDFA = encodeDFAForURL(nodes, finiteNodes);
        const relativePath = `/simulator/dfa?dfa=${encodedDFA}`;
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
        machineType: 'Deterministic Finite Automaton (DFA)'
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
   * Validates the current DFA and updates the validation result
   */
  const validateCurrentDFA = (): boolean => {
    const result = validateDFA(nodes, finiteNodes);
    if (!result.isValid) {
      setValidationResult(result.errorMessage || 'Invalid DFA');
      return false;
    }
    setValidationResult('Valid DFA');
    return true;
  };

  if (!isClient) {
    return null; // Return null on server side to prevent hydration mismatch
  }

  const inputSymbols = getInputSymbols();

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
        onValidate={validateCurrentDFA}
        onSave={handleSave}
        isLoggedIn={!!user}
      />
      
      <DFAInfoPanel 
        states={nodes.map(node => node.id)} 
        initialState={nodes.length > 0 ? nodes[0].id : null}
        finalStates={Array.from(finiteNodes)}
        inputSymbols={inputSymbols}
        currentState={Array.from(currNodes)[0] || null}
        currentPosition={currentConfiguration ? currentConfiguration.inputPosition : 0}
        inputString={inputString}
      />
      
      <TestInputPanel 
        onTestInput={handleTestInput} 
        onShareDFA={shareDFA}
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
      
      <SaveMachineToast
        isOpen={showSaveToast}
        onClose={() => setShowSaveToast(false)}
        onSave={handleSaveMachine}
      />
    </div>
  );
};

export default AutomataSimulator;