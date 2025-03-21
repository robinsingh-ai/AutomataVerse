'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer } from 'react-konva';
import dynamic from 'next/dynamic';
import ControlPanel from './components/ControlPanel';
import InputPopup from './components/InputPopup';
import NFAInfoPanel from './components/NFAInfoPanel';
import { Node, NodeMap, HighlightedTransition, StageProps, NFAState } from './type';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { useTheme } from '../../app/context/ThemeContext';
import TestInputPanel from './components/TestInputPanel';
import { 
  deserializeNFA, 
  SerializedNFA, 
  serializeNFA, 
  encodeNFAForURL, 
  validateNFA, 
  getNextConfiguration, 
  simulateNFA,
  computeEpsilonClosure,
  batchTestNFA
} from './utils/nfaSerializer';
import { useSearchParams } from 'next/navigation';
import JsonInputDialog from './components/JsonInputDialog';
import { auth } from '../../lib/firebase';
import { saveMachine } from '../../lib/machineService';
import SaveMachineToast from '../../app/components/SaveMachineToast';
import { useAuthState } from 'react-firebase-hooks/auth';
import ProblemPanel from './components/ProblemPanel';

// Dynamically import the NodeCanvas component to prevent SSR issues with Konva
const DynamicNodeCanvas = dynamic(() => import('./components/NodeCanvas'), {
  ssr: false,
});

const DynamicGridCanvas = dynamic(() => import('./components/Grid'), {
  ssr: false,
});

interface NFASimulatorProps {
  initialNFA?: string; // Optional JSON string to initialize the NFA
  problemId?: string; // Optional problem ID for problem panel
}

const AutomataSimulator: React.FC<NFASimulatorProps> = ({ initialNFA, problemId }) => {
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  
  // Authentication state
  const [user] = useAuthState(auth);
  
  // Check if coming from a problem (learning page)
  const isFromProblem = !!problemId;
  
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
  const [currentConfiguration, setCurrentConfiguration] = useState<NFAState | null>(null);
  const [allowEpsilon, setAllowEpsilon] = useState<boolean>(true); // Default to allowing epsilon transitions (ε-NFA)
  
  // Save machine state
  const [showSaveToast, setShowSaveToast] = useState<boolean>(false);
  const [shareUrl, setShareUrl] = useState<string>('');
  
  // Test panel visibility state - hide completely when coming from a problem
  const [testPanelVisible, setTestPanelVisible] = useState<boolean>(!isFromProblem);
  
  const stageRef = useRef<Konva.Stage>(null);

  // Track all active configurations for non-deterministic exploration
  const [activeConfigurations, setActiveConfigurations] = useState<{config: NFAState; path: NFAState[]}[]>([]);
  const [visitedConfigs, setVisitedConfigs] = useState<Set<string>>(new Set());
  
  // Track the accepting path for visualization
  const [acceptingPath, setAcceptingPath] = useState<NFAState[]>([]);
  const [isShowingAcceptingPath, setIsShowingAcceptingPath] = useState<boolean>(false);
  const [acceptingPathStep, setAcceptingPathStep] = useState<number>(0);

  // Define new state for step-by-step visualization
  const [simulationSteps, setSimulationSteps] = useState<SimulationStep[]>([]);
  const [simulationStepIndex, setSimulationStepIndex] = useState<number>(0);
  const [simulationResult, setSimulationResult] = useState<{
    accepted: boolean;
    message: string;
  }>({ accepted: false, message: "" });

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check for NFA in URL params when component mounts
  useEffect(() => {
    if (isClient) {
      // Check if epsilon transitions are enabled in URL params
      const epsilonParam = searchParams.get('allowEpsilon');
      if (epsilonParam === 'true') {
        setAllowEpsilon(true);
      } else if (epsilonParam === 'false') {
        setAllowEpsilon(false);
      }
      
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

  // Update testPanelVisible when problemId changes
  useEffect(() => {
    setTestPanelVisible(!isFromProblem);
  }, [isFromProblem]);

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
        const validationResult = validateNFA(parsedNFA.nodes, finalStatesSet, parsedNFA.allowEpsilon);
        
        if (!validationResult.isValid) {
          setValidationResult(validationResult.errorMessage || 'Invalid NFA');
          return;
        }
        
        setNodes(parsedNFA.nodes);
        setFiniteNodes(finalStatesSet);
        setAllowEpsilon(parsedNFA.allowEpsilon);
        
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

  const handleSymbolInputSubmit = (transitionInfo: string): void => {
    if (!transitionInfo) {
      console.warn("Invalid transition format");
      return;
    }
    
    // Verify transition format for NFA
    if (transitionInfo.length === 0) {
      console.warn("Transition symbol cannot be empty");
      return;
    }
    
    // Check if epsilon transition is allowed
    if (transitionInfo === 'ε' && !allowEpsilon) {
      setValidationResult(`Error: Epsilon transitions are not allowed in regular NFA mode`);
      setIsPopupOpen(false);
      setSelectedNode(null);
      setTargetNode(null);
      return;
    }
    
    if (!targetNode) {
      console.warn("No target node was selected.");
      return;
    }

    if (selectedNode) {
      // Add the transition
      const updatedNodes = [...nodes];
      const nodeIndex = updatedNodes.findIndex(n => n.id === selectedNode.id);
      
      if (nodeIndex !== -1) {
        // Check if this exact transition already exists
        const transitionExists = updatedNodes[nodeIndex].transitions.some(
          t => t.targetid === targetNode.id && t.label === transitionInfo
        );
        
        if (!transitionExists) {
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
        } else {
          console.warn(`Transition already exists`);
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

  const handleToggleEpsilon = (): void => {
    // Check if disabling epsilon would invalidate current NFA
    if (allowEpsilon) {
      // Check if there are any epsilon transitions in the current NFA
      const hasEpsilonTransitions = nodes.some(node => 
        node.transitions.some(transition => transition.label === 'ε')
      );
      
      if (hasEpsilonTransitions) {
        setValidationResult("Warning: NFA contains epsilon transitions. Disabling epsilon will make these transitions invalid.");
      }
    }
    
    setAllowEpsilon(!allowEpsilon);
  };

  const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));
  
  const resetSimulation = (): void => {
    setIsRunning(false);
    setIsRunningStepWise(false);
    setShowQuestion(false);
    setCurrNodes(new Set());
    setHighlightedNodes(new Set());
    setStepIndex(0);
    setHighlightedTransitions([]);
    setCurrentConfiguration(null);
    setValidationResult(null);
    setAcceptingPath([]);
    setIsShowingAcceptingPath(false);
    setAcceptingPathStep(0);
    setActiveConfigurations([]);
    setVisitedConfigs(new Set());
    setSimulationSteps([]);
    setSimulationStepIndex(0);
    setSimulationResult({ accepted: false, message: "" });
  };

  // Add the clearCanvas function here
  // Clear the entire canvas, resetting all nodes and the simulation state
  const clearCanvas = (): void => {
    // First reset the simulation
    resetSimulation();
    
    // Then clear all nodes, nodeMap and other state
    setNodes([]);
    setNodeMap({});
    setSelectedNode(null);
    setFiniteNodes(new Set<string>());
    setInputString('');
    
    // Reset validation
    setValidationResult(null);
    
    // Clear share URL
    setShareUrl('');
  };

  // Initialize the NFA simulation
  const initializeNFA = (input: string): NFAState => {
    let initialStates = new Set<string>(['q0']);
    
    // Compute epsilon closure of initial state if epsilon transitions are allowed
    if (allowEpsilon) {
      initialStates = computeEpsilonClosure(initialStates, nodes, nodeMap);
    }
    
    return {
      stateIds: initialStates,
      inputString: input,
      inputPosition: 0,
      halted: false,
      accepted: false
    };
  };

  // NFA simulation with improved non-determinism handling
  const handleRun = async (): Promise<void> => {
    if (isRunning || !nodes.length) return;
    
    // Validate the NFA before running
    const validationResult = validateNFA(nodes, finiteNodes, allowEpsilon);
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
    setAcceptingPath([]);
    setIsShowingAcceptingPath(false);
    setAcceptingPathStep(0);
    
    // Compute the complete simulation path first
    const { steps, result } = await computeSimulationPath();
    
    // If there are no steps, show the result immediately
    if (steps.length === 0) {
      setValidationResult(result.message);
      setIsRunning(false);
      return;
    }
    
    // Animate through each step with a delay
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      
      // Delay for animation
      await sleep(500);
      
      // Update UI with current step
      setCurrentConfiguration(step.config);
      setCurrNodes(step.config.stateIds);
      setHighlightedNodes(step.config.stateIds);
      setHighlightedTransitions(step.transitions);
      setStepIndex(i);
      
      // Update message based on step type
      if (step.type === 'epsilon') {
        setValidationResult(`Taking ε-transitions (epsilon transitions)`);
      } else {
        const symbolIndex = step.config.inputPosition - 1;
        if (symbolIndex >= 0 && symbolIndex < inputString.length) {
          setValidationResult(`Processing symbol: ${inputString[symbolIndex]}`);
        }
      }
    }
    
    // Show final result
    setValidationResult(result.message);
    setIsRunning(false);
  };

  // Shared function to compute simulation path for both run and step modes
  const computeSimulationPath = async (): Promise<{
    steps: SimulationStep[];
    result: { accepted: boolean; message: string; };
  }> => {
    // Initialize NFA with input
    const initialConfig = initializeNFA(inputString);
    
    // Track the simulation step by step for visualization
    let currentStates = new Set<string>(['q0']);
    const simulationSteps: SimulationStep[] = [];
    
    // Apply initial epsilon closure if allowed
    if (allowEpsilon) {
      // Find initial epsilon transitions
      const epsilonTransitions: HighlightedTransition[] = [];
      nodes.forEach(node => {
        if (node.id === 'q0') {
          node.transitions.forEach(transition => {
            if (transition.label === 'ε') {
              epsilonTransitions.push({
                d: transition,
                target: node.id
              });
            }
          });
        }
      });
      
      // Compute epsilon closure
      currentStates = computeEpsilonClosure(currentStates, nodes, nodeMap);
      
      // Only add a step if there are epsilon transitions
      if (epsilonTransitions.length > 0) {
        simulationSteps.push({
          config: {
            stateIds: currentStates,
            inputString: inputString,
            inputPosition: 0,
            halted: false,
            accepted: false
          },
          transitions: epsilonTransitions,
          type: 'epsilon'
        });
      }
    }
    
    // Simulate the NFA step by step for all input symbols
    for (let i = 0; i < inputString.length; i++) {
      const inputSymbol = inputString[i];
      const nextStates = new Set<string>();
      const symbolTransitions: HighlightedTransition[] = [];
      
      // Process transitions for the current input symbol
      currentStates.forEach(stateId => {
        const node = nodeMap[stateId];
        if (!node) return;
        
        node.transitions.forEach(transition => {
          if (transition.label === inputSymbol) {
            nextStates.add(transition.targetid);
            symbolTransitions.push({
              d: transition,
              target: stateId
            });
          }
        });
      });
      
      // If no transitions were found, the machine rejects
      if (nextStates.size === 0) {
        return {
          steps: simulationSteps,
          result: {
            accepted: false,
            message: "Input Rejected - No valid transitions"
          }
        };
      }
      
      // Apply epsilon closure to next states (if allowed)
      const statesAfterSymbol = new Set(nextStates);
      
      // Add the step for processing input symbol
      simulationSteps.push({
        config: {
          stateIds: statesAfterSymbol,
          inputString: inputString,
          inputPosition: i + 1,
          halted: false,
          accepted: false
        },
        transitions: symbolTransitions,
        type: 'input'
      });
      
      // Check if we've processed all input symbols and are in an accepting state
      const isLastSymbol = i === inputString.length - 1;
      const isInAcceptingState = Array.from(statesAfterSymbol).some(stateId => finiteNodes.has(stateId));
      
      // Only take epsilon transitions if either:
      // 1. We haven't processed all input yet, or
      // 2. We've processed all input but aren't in an accepting state yet
      if (allowEpsilon && (!isLastSymbol || !isInAcceptingState)) {
        // Find all epsilon transitions from the states after processing the symbol
        const epsilonTransitions: HighlightedTransition[] = [];
        let hasEpsilonTransitions = false;
        
        statesAfterSymbol.forEach(stateId => {
          const node = nodeMap[stateId];
          if (!node) return;
          
          node.transitions.forEach(transition => {
            if (transition.label === 'ε') {
              hasEpsilonTransitions = true;
              epsilonTransitions.push({
                d: transition,
                target: stateId
              });
            }
          });
        });
        
        // Compute epsilon closure
        currentStates = computeEpsilonClosure(statesAfterSymbol, nodes, nodeMap);
        
        // Only add a step for epsilon transitions if there are any
        if (hasEpsilonTransitions) {
          simulationSteps.push({
            config: {
              stateIds: currentStates,
              inputString: inputString,
              inputPosition: i + 1,
              halted: false,
              accepted: false
            },
            transitions: epsilonTransitions,
            type: 'epsilon'
          });
        } else {
          // If no epsilon transitions, just use the states after symbol
          currentStates = statesAfterSymbol;
        }
      } else {
        // Without epsilon transitions or when we're already in an accepting state, just use the states after symbol
        currentStates = statesAfterSymbol;
      }
    }
    
    // Check if the final state is accepting
    const isAccepted = Array.from(currentStates).some(stateId => finiteNodes.has(stateId));
    
    return {
      steps: simulationSteps,
      result: {
        accepted: isAccepted,
        message: isAccepted ? "Input Accepted" : "Input Rejected - Not in an accepting state"
      }
    };
  };
  
  // Define type for simulation steps
  type SimulationStep = {
    config: NFAState;
    transitions: HighlightedTransition[];
    type: 'input' | 'epsilon';
  };
  
  // Updated handleStepWise to use pre-computed path
  const handleStepWise = async (): Promise<void> => {
    // Check if we've completed the simulation
    if (simulationStepIndex >= simulationSteps.length) {
      setValidationResult(simulationResult.message);
      setIsRunningStepWise(false);
      return;
    }
    
    // Get the current step
    const currentStep = simulationSteps[simulationStepIndex];
    
    // Update the UI with the current step
    setCurrentConfiguration(currentStep.config);
    setCurrNodes(currentStep.config.stateIds);
    setHighlightedNodes(currentStep.config.stateIds);
    setHighlightedTransitions(currentStep.transitions);
    
    // Update the status message
    if (currentStep.type === 'epsilon') {
      setValidationResult(`Taking ε-transitions (epsilon transitions)`);
    } else {
      const symbolIndex = currentStep.config.inputPosition - 1;
      if (symbolIndex >= 0 && symbolIndex < inputString.length) {
        setValidationResult(`Processing symbol: ${inputString[symbolIndex]}`);
      }
    }
    
    // Move to the next step
    setSimulationStepIndex(simulationStepIndex + 1);
    
    // If this was the last step, show the final result
    if (simulationStepIndex === simulationSteps.length - 1) {
      setValidationResult(simulationResult.message);
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
        // Skip epsilon transitions for input alphabet
        if (transition.label && transition.label !== 'ε') {
          inputSymbolsSet.add(transition.label);
        }
      });
    });
    
    return Array.from(inputSymbolsSet).sort();
  };

  /**
   * Generates a shareable URL with the current NFA state
   */
  const shareNFA = (): void => {
    try {
      // Create a URL with the encoded NFA
      const encodedNFA = encodeNFAForURL(nodes, finiteNodes, allowEpsilon);
      const relativePath = `/simulator/nfa?nfa=${encodedNFA}`;
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
        const encodedNFA = encodeNFAForURL(nodes, finiteNodes, allowEpsilon);
        const relativePath = `/simulator/nfa?nfa=${encodedNFA}`;
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
        machineType: allowEpsilon ? 'Non-deterministic Finite Automaton with ε (ε-NFA)' : 'Non-deterministic Finite Automaton (NFA)'
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
   * Validates the current NFA and updates the validation result
   */
  const validateCurrentNFA = (): boolean => {
    const result = validateNFA(nodes, finiteNodes, allowEpsilon);
    if (!result.isValid) {
      setValidationResult(result.errorMessage || 'Invalid NFA');
      return false;
    }
    setValidationResult('Valid NFA');
    return true;
  };

  const onStepWiseClick = (): void => {
    if (isRunning || !nodes.length) return;
    
    if (isRunningStepWise) {
      handleStepWise();
    } else {
      // Validate the NFA before running
      const validationResult = validateNFA(nodes, finiteNodes, allowEpsilon);
      if (!validationResult.isValid) {
        setValidationResult(validationResult.errorMessage || 'Invalid NFA');
        return;
      }
      
      resetSimulation();
      setIsRunningStepWise(true);
      
      // Precompute the simulation path
      precomputeSimulationPath();
    }
  };
  
  // Precompute the entire simulation path for step-by-step visualization
  const precomputeSimulationPath = async (): Promise<void> => {
    const { steps, result } = await computeSimulationPath();
    
    // Save the results for step-by-step visualization
    setSimulationSteps(steps);
    setSimulationResult(result);
    setSimulationStepIndex(0);
    
    // Trigger the first visualization step
    setTimeout(() => handleStepWise(), 10);
  };

  // Handle batch testing for the Problem Panel
  const handleBatchTest = (acceptStrings: string[], rejectStrings: string[]): {
    passed: boolean;
    acceptResults: { string: string; accepted: boolean; expected: boolean }[];
    rejectResults: { string: string; accepted: boolean; expected: boolean }[];
    summary: string;
  } => {
    // Validate NFA first
    if (!validateCurrentNFA()) {
      return {
        passed: false,
        acceptResults: [],
        rejectResults: [],
        summary: "NFA is not valid. Please fix the errors before testing."
      };
    }
    
    return batchTestNFA(nodes, nodeMap, finiteNodes, allowEpsilon, acceptStrings, rejectStrings);
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
        onValidate={validateCurrentNFA}
        onClearCanvas={clearCanvas}
        onToggleEpsilon={handleToggleEpsilon}
        allowEpsilon={allowEpsilon}
        onSave={handleSave}
        isLoggedIn={!!user}
        isProblemMode={!!problemId}
      />
      
      <NFAInfoPanel 
        states={nodes.map(node => node.id)} 
        initialState={nodes.length > 0 ? 'q0' : null}
        finalStates={Array.from(finiteNodes)}
        inputSymbols={inputSymbols}
        currentStates={Array.from(currNodes)}
        currentPosition={currentConfiguration ? currentConfiguration.inputPosition : 0}
        inputString={inputString}
        allowEpsilon={allowEpsilon}
      />
      
      {testPanelVisible && (
        <TestInputPanel 
          onTestInput={handleTestInput}
          onShareNFA={shareNFA}
        />
      )}
      
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
          allowEpsilon={allowEpsilon}
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
      
      {problemId && (
        <ProblemPanel
          problemId={problemId}
          onTestSolution={handleBatchTest}
        />
      )}
    </div>
  );
};

export default AutomataSimulator;