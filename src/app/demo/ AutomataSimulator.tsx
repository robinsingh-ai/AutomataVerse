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
import DFAInfoPanel from './components/DFAInfoPanel';
import TestInputPanel from './components/TestInputPanel';
import { deserializeDFA, SerializedDFA, serializeDFA, encodeDFAForURL, validateDFA } from './components/dfaSerializer';
import { useSearchParams } from 'next/navigation';
import JsonInputDialog from './components/JsonInputDialog';
import WelcomePanel from './WelcomePanel';
import GuidedTour from './GuidedTour';
import { Arrow } from 'react-konva';

// Dynamically import the NodeCanvas component to prevent SSR issues with Konva
const DynamicNodeCanvas = dynamic(() => import('./components/NodeCanvas'), {
  ssr: false,
});

const DynamicGridCanvas = dynamic(() => import('./components/Grid'), {
  ssr: false,
});

interface AutomataSimulatorProps {
  initialDFA?: string; // Optional JSON string to initialize the DFA
}

const AutomataSimulator: React.FC<AutomataSimulatorProps> = ({ initialDFA }) => {
  const { theme } = useTheme();
  const searchParams = useSearchParams();
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
  const [showQuestion, setShowQuestion] = useState<boolean>(false);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isRunningStepWise, setIsRunningStepWise] = useState<boolean>(false);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [targetNode, setTargetNode] = useState<Node | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [jsonInputOpen, setJsonInputOpen] = useState<boolean>(false);
  const [jsonInput, setJsonInput] = useState<string>('');
  
  // New state for the guided tour - simplified
  const [showWelcomePanel, setShowWelcomePanel] = useState<boolean>(true);
  const [isTourActive, setIsTourActive] = useState<boolean>(false);
  
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
      // Validate the DFA before running
      const validationResult = validateDFA(nodes, finiteNodes);
      if (!validationResult.isValid) {
        setValidationResult(validationResult.errorMessage || 'Invalid DFA');
        return;
      }
      
      resetSimulation();
      setCurrNode(nodes[0]);
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
          if (symbol.trim()) {
            symbolsSet.add(symbol.trim());
          }
        });
      });
    });
    return Array.from(symbolsSet).sort();
  };

  /**
   * Generates a shareable URL with the current DFA state
   */
  const shareDFA = (): void => {
    try {
      // Create a URL with the encoded DFA
      const encodedDFA = encodeDFAForURL(nodes, finiteNodes);
      const url = `${window.location.origin}/simulator/dfa?dfa=${encodedDFA}`;
      
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
   * Validates the current DFA and updates the validation result
   */
  const validateCurrentDFA = (): boolean => {
    const result = validateDFA(nodes, finiteNodes);
    if (!result.isValid) {
      setValidationResult(result.errorMessage || 'Invalid DFA');
      return false;
    }
    return true;
  };

  /**
   * Handles starting the guided tour - simplified
   */
  const handleStartTour = (): void => {
    // Reset the simulator state
    setNodes([]);
    setFiniteNodes(new Set());
    setInputString('');
    setSelectedNode(null);
    setTargetNode(null);
    resetSimulation();
    
    // Start the tour
    setIsTourActive(true);
    setShowWelcomePanel(false);
  };

  /**
   * Handles completing the guided tour
   */
  const handleCompleteTour = (): void => {
    setIsTourActive(false);
  };

  /**
   * Handles closing the welcome panel without starting the tour
   */
  const handleCloseWelcomePanel = (): void => {
    setShowWelcomePanel(false);
  };

  if (!isClient) {
    return null; // Return null on server side to prevent hydration mismatch
  }

  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* AutomataSimulator content */}
      <div className="w-full h-full relative">
        {showWelcomePanel && (
          <WelcomePanel onStartTour={handleStartTour} onClose={handleCloseWelcomePanel} />
        )}
        
        <GuidedTour isActive={isTourActive} onComplete={handleCompleteTour} />
        
        {stageRef && (
          <Stage
            ref={stageRef}
            width={window.innerWidth}
            height={window.innerHeight - 64} // Subtract navbar height
            draggable={stageProps.draggable && !selectedNode}
            x={stageProps.x}
            y={stageProps.y}
            scaleX={stageProps.scale}
            scaleY={stageProps.scale}
            onDragMove={handleDragMoveScreen}
            onWheel={handleWheel}
            onClick={handleStageClick}
          >
            <Layer>
              {showGrid && (
                <DynamicGridCanvas
                  stageProps={stageProps}
                  color={theme === "dark" ? "#3a3a3a" : "#f0f0f0"}
                  size={20}
                />
              )}
              
              {nodes.length > 0 && (
                <Arrow
                  x={0}
                  y={0}
                  points={[
                    nodes[0].x - 100 * (1 / stageProps.scale),
                    nodes[0].y,
                    nodes[0].x - 50 * (1 / stageProps.scale),
                    nodes[0].y,
                  ]}
                  stroke={theme === "dark" ? "white" : "black"}
                  fill={theme === "dark" ? "white" : "black"}
                  strokeWidth={2 * (1 / stageProps.scale)}
                  pointerLength={10 * (1 / stageProps.scale)}
                  pointerWidth={10 * (1 / stageProps.scale)}
                />
              )}
              
              <DynamicNodeCanvas
                nodes={nodes}
                nodeMap={nodeMap}
                finiteNodes={finiteNodes}
                selectedNode={selectedNode}
                highlightedTransition={highlightedTransition}
                showGrid={showGrid}
                stageProps={stageProps}
                currNode={currNode}
                showQuestion={showQuestion}
                handleNodeClick={handleNodeClick}
                handleDragMove={handleDragMove}
                nodeMouseDown={nodeMouseDown}
                nodeMouseUp={nodeMouseUp}
              />
            </Layer>
          </Stage>
        )}
      </div>
      
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
        onStartTour={handleStartTour}
      />
      
      <DFAInfoPanel 
        states={nodes.map(node => node.id)} 
        initialState={nodes.length > 0 ? nodes[0].id : null}
        finalStates={Array.from(finiteNodes)}
        inputSymbols={getInputSymbols()}
      />
      
      <TestInputPanel 
        onTestInput={handleTestInput} 
        onShareDFA={shareDFA}
      />
      
      {isPopupOpen && (
        <InputPopup
          isOpen={isPopupOpen}
          onClose={handleInputClose}
          onSubmit={handleSymbolInputSubmit}
        />
      )}
      
      {jsonInputOpen && (
        <JsonInputDialog
          isOpen={jsonInputOpen}
          onClose={() => setJsonInputOpen(false)}
          onSubmit={handleJsonInputSubmit}
          jsonInput={jsonInput}
          setJsonInput={setJsonInput}
        />
      )}
    </div>
  );
};

export default AutomataSimulator;