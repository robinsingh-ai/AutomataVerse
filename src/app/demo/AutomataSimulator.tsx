'use client';

import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Layer, Stage } from 'react-konva';
import SaveMachineToast from '../components/SaveMachineToast';
import { useTheme } from '../context/ThemeContext';
import { auth } from '../../lib/firebase';
import { saveMachine } from '../../lib/machineService';
// Import shared components
import InputPopup from '../../shared/components/InputPopup';
import JsonInputDialog from '../../shared/components/JsonInputDialog';
import TestInputPanel from '../../shared/components/TestInputPanel';
import { getFieldsForSimulator } from '../../shared/configs/inputConfigs';
// Import local components
import ControlPanel from './components/ControlPanel';
import DFAInfoPanel from './components/DFAInfoPanel';
import { Node, NodeMap, HighlightedTransition, StageProps } from './type';
import {
  deserializeDFA,
  encodeDFAForURL,
  validateDFA,
  DFAState,
  testDFA,
  batchTestDFA
} from './components/dfaSerializer';
import WelcomePanel from './WelcomePanel';
import GuidedTour from './GuidedTour';

// Dynamically import the NodeCanvas component to prevent SSR issues with Konva
const DynamicNodeCanvas = dynamic(() => import('./components/NodeCanvas'), {
  ssr: false,
});

const DynamicGridCanvas = dynamic(() => import('../../shared/components/Grid'), {
  ssr: false,
});

interface AutomataSimulatorProps {
  initialDFA?: string; // Optional JSON string to initialize the DFA
}

const AutomataSimulator: React.FC<AutomataSimulatorProps> = ({ initialDFA }) => {
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
  
  // Demo-specific state for the guided tour
  const [showWelcomePanel, setShowWelcomePanel] = useState<boolean>(true);
  const [isTourActive, setIsTourActive] = useState<boolean>(false);
  
  const stageRef = useRef<Konva.Stage>(null);

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);
  
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

  // Check for DFA in URL params when component mounts
  useEffect(() => {
    if (isClient) {
      // First check for initialDFA prop
      if (initialDFA) {
        loadDFAFromJSON(initialDFA);
        setShowWelcomePanel(false); // Skip welcome panel if DFA is provided
      } 
      // Then check URL params safely using try-catch
      else if (searchParams) {
        try {
          const dfaParam = searchParams.get('dfa');
          if (dfaParam) {
            try {
              const decodedDFA = decodeURIComponent(dfaParam);
              loadDFAFromJSON(decodedDFA);
              setShowWelcomePanel(false); // Skip welcome panel if DFA is in URL
            } catch (error) {
              console.error('Error loading DFA from URL:', error);
            }
          }
        } catch (error) {
          // Handle potential searchParams errors silently
          console.error('Error accessing searchParams:', error);
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

  const handleTransitionSubmit = (data: Record<string, string>): void => {
    const symbol = data.symbol;
    if (!symbol) {
      console.warn("No transition symbol provided.");
      return;
    }
    if (!targetNode) {
      console.warn("No source node was selected.");
      return;
    }

    if (selectedNode) {
      // Check if adding this transition would make the DFA non-deterministic
      const symbolsToAdd = symbol.split(',').filter(s => s.trim());
      
      // Create a temporary copy of nodes with the new transition
      const updatedNodes = [...nodes];
      const nodeIndex = updatedNodes.findIndex(n => n.id === selectedNode.id);
      
      if (nodeIndex !== -1) {
        // Create a map of existing symbols to their target states for this node
        const existingSymbolMap = new Map<string, string>();
        updatedNodes[nodeIndex].transitions.forEach(transition => {
          transition.label.split(',').filter(s => s.trim()).forEach(sym => {
            existingSymbolMap.set(sym, transition.targetid);
          });
        });
        
        // Check for conflicts (same symbol going to different states)
        const conflictingSymbols: string[] = [];
        symbolsToAdd.forEach(newSymbol => {
          if (existingSymbolMap.has(newSymbol) && existingSymbolMap.get(newSymbol) !== targetNode.id) {
            conflictingSymbols.push(newSymbol);
          }
        });
        
        if (conflictingSymbols.length > 0) {
          setValidationResult(`Error: Symbol(s) '${conflictingSymbols.join(', ')}' already have transitions to different states. In a DFA, each input symbol can only transition to one state.`);
          setIsPopupOpen(false);
          return;
        }
        
        // Remove symbols that are being redirected from their original transitions
        const nodeCopy = { ...updatedNodes[nodeIndex] };
        const updatedTransitions = nodeCopy.transitions.map(transition => {
          const transSymbols = transition.label.split(',').filter(s => s.trim());
          const remainingSymbols = transSymbols.filter(sym => 
            !symbolsToAdd.includes(sym) || transition.targetid === targetNode.id
          );
          
          return {
            ...transition,
            label: remainingSymbols.join(',')
          };
        }).filter(t => t.label !== ''); // Remove empty transitions
        
        // Find if there's already a transition to the target node
        const targetTransitionIndex = updatedTransitions.findIndex(
          t => t.targetid === targetNode.id
        );
        
        if (targetTransitionIndex !== -1) {
          // Add symbols to existing transition
          const existingSymbols = updatedTransitions[targetTransitionIndex].label.split(',').filter(s => s.trim());
          const mergedSymbols = [...new Set([...existingSymbols, ...symbolsToAdd])]; // Remove duplicates
          
          updatedTransitions[targetTransitionIndex] = {
            ...updatedTransitions[targetTransitionIndex],
            label: mergedSymbols.join(',')
          };
        } else {
          // Create new transition
          updatedTransitions.push({
            targetid: targetNode.id,
            label: symbolsToAdd.join(',')
          });
        }
        
        // Update the node with the new transitions
        nodeCopy.transitions = updatedTransitions;
        updatedNodes[nodeIndex] = nodeCopy;
        
        // Final validation check
        const validationResult = validateDFA(updatedNodes, finiteNodes);
        if (!validationResult.isValid) {
          setValidationResult(validationResult.errorMessage || 'Invalid DFA');
          setIsPopupOpen(false);
          return;
        }
        
        // If all checks pass, update the nodes state
        setNodes(updatedNodes);
        setValidationResult('Transition added successfully');
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
      setSelectedNode(null);
    }
  };

  const resetSimulation = (): void => {
    setIsRunning(false);
    setIsRunningStepWise(false);
    setStepIndex(0);
    setCurrNodes(new Set());
    setHighlightedNodes(new Set());
    setHighlightedTransitions([]);
    setCurrentConfiguration(null);
    setValidationResult(null);
  };

  const handleRun = (): void => {
    if (isRunning) return;
    
    // Validate DFA before running
    const validation = validateDFA(nodes, finiteNodes);
    if (!validation.isValid) {
      setValidationResult(validation.errorMessage || 'Invalid DFA');
      return;
    }

    const result = testDFA(nodes, nodeMap, finiteNodes, inputString);
    setValidationResult(result.accepted ? 'String Accepted' : 'String Rejected');
    setIsRunning(false);
  };

  const handleStep = (): void => {
    // Validate DFA before running
    const validation = validateDFA(nodes, finiteNodes);
    if (!validation.isValid) {
      setValidationResult(validation.errorMessage || 'Invalid DFA');
      return;
    }

    if (!isRunningStepWise) {
      setIsRunningStepWise(true);
      setStepIndex(0);
      if (nodes.length > 0) {
        setCurrNodes(new Set([nodes[0].id]));
        setHighlightedNodes(new Set([nodes[0].id]));
      }
      return;
    }

    if (stepIndex < inputString.length) {
      const currentChar = inputString[stepIndex];
      const currentNode = nodes.find(n => currNodes.has(n.id));
      
      if (currentNode) {
        const transition = currentNode.transitions.find(t => 
          t.label.split(',').map(s => s.trim()).includes(currentChar)
        );
        
        if (transition) {
          setCurrNodes(new Set([transition.targetid]));
          setHighlightedNodes(new Set([transition.targetid]));
        }
      }
      
      setStepIndex(stepIndex + 1);
    } else {
      // Check if in accepting state
      const isAccepted = Array.from(currNodes).some(nodeId => finiteNodes.has(nodeId));
      setValidationResult(isAccepted ? 'String Accepted' : 'String Rejected');
      setIsRunningStepWise(false);
    }
  };

  const handleTestInput = (testInput: string): void => {
    const oldInputString = inputString;
    setInputString(testInput);
    
    // Validate DFA before running
    const validation = validateDFA(nodes, finiteNodes);
    if (!validation.isValid) {
      setValidationResult(validation.errorMessage || 'Invalid DFA');
      return;
    }

    const result = testDFA(nodes, nodeMap, finiteNodes, testInput);
    setValidationResult(result.accepted ? 'String Accepted' : 'String Rejected');
    
    // Restore original input string
    setTimeout(() => setInputString(oldInputString), 100);
  };

  const nodeMouseDown = (event: KonvaEventObject<MouseEvent>): void => {
    if (event.evt.button === 0) { // Left click only
      handleNodeClick(event.target.getParent() as any);
    }
  };

  const nodeMouseUp = (): void => {
    // Optional: Handle mouse up events if needed
  };

  const handleDragMoveScreen = (e: KonvaEventObject<DragEvent>): void => {
    setStageProps({
      ...stageProps,
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  const handleWheel = (e: KonvaEventObject<WheelEvent>): void => {
    e.evt.preventDefault();
    
    const scaleBy = 1.02;
    const stage = e.target.getStage();
    if (!stage) return;
    
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    let direction = e.evt.deltaY > 0 ? 1 : -1;
    if (e.evt.ctrlKey) {
      direction = -direction;
    }

    const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    setStageProps({
      x: newPos.x,
      y: newPos.y,
      scale: newScale,
      draggable: stageProps.draggable
    });
  };

  const clearCanvas = (): void => {
    setNodes([]);
    setFiniteNodes(new Set());
    setSelectedNode(null);
    resetSimulation();
    setValidationResult(null);
  };

  const getInputSymbols = (): string[] => {
    const inputSymbolsSet = new Set<string>();
    
    nodes.forEach(node => {
      node.transitions.forEach(transition => {
        transition.label.split(',').forEach(symbol => {
          const trimmedSymbol = symbol.trim();
          if (trimmedSymbol && trimmedSymbol !== 'ε') {
            inputSymbolsSet.add(trimmedSymbol);
          }
        });
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
      const relativePath = `/demo?dfa=${encodedDFA}`;
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
        const relativePath = `/demo?dfa=${encodedDFA}`;
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
        machineType: 'Deterministic Finite Automaton (DFA) - Demo'
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

  // Demo-specific functions for guided tour
  const handleStartTour = (): void => {
    setShowWelcomePanel(false);
    setIsTourActive(true);
  };

  const handleCloseTour = (): void => {
    setIsTourActive(false);
  };

  const handleCloseWelcome = (): void => {
    setShowWelcomePanel(false);
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
        onStep={handleStep}
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
        onClearCanvas={clearCanvas}
        isLoggedIn={!!user}
        isProblemMode={false}
        onStartTour={handleStartTour}
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
        simulatorType="DFA"
        onTestInput={handleTestInput} 
        onShareMachine={shareDFA}
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
          height={window.innerHeight - 64}
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
          onSubmit={handleTransitionSubmit}
          title="Add Transition"
          fields={getFieldsForSimulator('DFA')}
        />
      )}
      
      <JsonInputDialog
        isOpen={jsonInputOpen}
        onClose={() => setJsonInputOpen(false)}
        onSubmit={handleJsonInputSubmit}
        value={jsonInput}
        onChange={setJsonInput}
        simulatorType="DFA"
      />
      
      <SaveMachineToast
        isOpen={showSaveToast}
        onClose={() => setShowSaveToast(false)}
        onSave={handleSaveMachine}
      />

      {/* Demo-specific components */}
      {showWelcomePanel && (
        <WelcomePanel
          onStartTour={handleStartTour}
          onClose={handleCloseWelcome}
        />
      )}

      <GuidedTour
        isActive={isTourActive}
        onComplete={handleCloseTour}
      />
    </div>
  );
};

export default AutomataSimulator;
