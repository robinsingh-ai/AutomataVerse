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
  computeEpsilonClosure
} from './utils/nfaSerializer';
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

interface NFASimulatorProps {
  initialNFA?: string; // Optional JSON string to initialize the NFA
}

const AutomataSimulator: React.FC<NFASimulatorProps> = ({ initialNFA }) => {
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
  const [currentConfiguration, setCurrentConfiguration] = useState<NFAState | null>(null);
  const [allowEpsilon, setAllowEpsilon] = useState<boolean>(true); // Default to allowing epsilon transitions (ε-NFA)
  
  // Save machine state
  const [showSaveToast, setShowSaveToast] = useState<boolean>(false);
  const [shareUrl, setShareUrl] = useState<string>('');
  
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
    setValidationResult(null);
    setCurrNodes(new Set());
    setHighlightedNodes(new Set());
    setStepIndex(0);
    setHighlightedTransitions([]);
    setCurrentConfiguration(null);
  };

  // Clear the entire canvas, resetting all nodes and the simulation state
  const clearCanvas = (): void => {
    // First reset the simulation
    resetSimulation();
    
    // Then clear all nodes, nodeMap and other state
    setNodes([]);
    setNodeMap({});
    setSelectedNode(null);
    setFiniteNodes(new Set());
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

  // NFA simulation with fixed epsilon transition handling
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
    
    // Initialize NFA with input
    const initialConfig = initializeNFA(inputString);
    setCurrentConfiguration(initialConfig);
    setCurrNodes(initialConfig.stateIds);
    setHighlightedNodes(initialConfig.stateIds);
    
    let currentConfig = initialConfig;
    let simulationStep = 0;
    const MAX_STEPS = 100; // Prevent infinite loops
    
    // For visualizing each step
    while (!currentConfig.halted && simulationStep < MAX_STEPS) {
      await sleep(500); // Delay for animation
      
      // Get the current input symbol
      const inputSymbol = currentConfig.inputPosition < currentConfig.inputString.length
        ? currentConfig.inputString[currentConfig.inputPosition]
        : '';
      
      if (!inputSymbol) {
        // End of input, check if in accepting state
        const isAccepted = Array.from(currentConfig.stateIds).some(stateId => finiteNodes.has(stateId));
        
        setValidationResult(isAccepted ? "Input Accepted" : "Input Rejected");
        setIsRunning(false);
        return;
      }
      
      // Track states before taking transitions
      const currentStates = new Set(currentConfig.stateIds);
      
      // First, check if we can move on the current input symbol
      const nextStatesOnInput = new Set<string>();
      const inputTransitions: HighlightedTransition[] = [];
      
      currentStates.forEach(stateId => {
        const node = nodeMap[stateId];
        if (!node) return;
        
        // Find transitions on the current input symbol
        node.transitions.forEach(transition => {
          if (transition.label === inputSymbol) {
            nextStatesOnInput.add(transition.targetid);
            inputTransitions.push({
              d: transition,
              target: stateId
            });
          }
        });
      });
      
      // If we found transitions on the input symbol
      if (nextStatesOnInput.size > 0) {
        // Compute epsilon closure if needed
        const nextStatesWithEpsilon = allowEpsilon
          ? computeEpsilonClosure(nextStatesOnInput, nodes, nodeMap)
          : nextStatesOnInput;
        
        // Create the next configuration
        const nextConfig: NFAState = {
          stateIds: nextStatesWithEpsilon,
          inputString: currentConfig.inputString,
          inputPosition: currentConfig.inputPosition + 1,
          halted: false,
          accepted: false
        };
        
        // Highlight input transitions
        setHighlightedTransitions(inputTransitions);
        
        // Update state
        currentConfig = nextConfig;
        setCurrentConfiguration(nextConfig);
        setCurrNodes(nextConfig.stateIds);
        setHighlightedNodes(nextConfig.stateIds);
        setStepIndex(simulationStep + 1);
        
        // Check if we reached the end of input
        if (nextConfig.inputPosition >= inputString.length) {
          const isAccepted = Array.from(nextConfig.stateIds).some(stateId => finiteNodes.has(stateId));
          setValidationResult(isAccepted ? "Input Accepted" : "Input Rejected");
          setIsRunning(false);
          return;
        }
        
        simulationStep++;
        continue;
      }
      
      // If no transitions on input and epsilon transitions are allowed
      if (allowEpsilon) {
        const epsilonTransitions: HighlightedTransition[] = [];
        const epsilonStates = new Set<string>();
        
        // Find epsilon transitions from current states
        currentStates.forEach(stateId => {
          const node = nodeMap[stateId];
          if (!node) return;
          
          node.transitions.forEach(transition => {
            if (transition.label === 'ε') {
              epsilonStates.add(transition.targetid);
              epsilonTransitions.push({
                d: transition,
                target: stateId
              });
            }
          });
        });
        
        if (epsilonStates.size > 0) {
          // Compute the complete epsilon closure
          const epsilonClosure = computeEpsilonClosure(epsilonStates, nodes, nodeMap);
          
          // Create the next configuration
          const nextConfig: NFAState = {
            stateIds: epsilonClosure,
            inputString: currentConfig.inputString,
            inputPosition: currentConfig.inputPosition, // Don't advance for epsilon
            halted: false,
            accepted: false
          };
          
          // Highlight epsilon transitions
          setHighlightedTransitions(epsilonTransitions);
          
          // Update state
          currentConfig = nextConfig;
          setCurrentConfiguration(nextConfig);
          setCurrNodes(nextConfig.stateIds);
          setHighlightedNodes(nextConfig.stateIds);
          setStepIndex(simulationStep + 1);
          
          simulationStep++;
          continue;
        }
      }
      
      // If no valid transitions, reject
      setValidationResult("Input Rejected");
      setIsRunning(false);
      return;
    }
    
    // Check if we reached MAX_STEPS (potential infinite loop)
    if (simulationStep >= MAX_STEPS) {
      setValidationResult("Warning: Reached maximum step count. Possible infinite loop.");
    }
    
    setIsRunning(false);
  };

  const handleStepWise = async (): Promise<void> => {
    if (selectedNode) setSelectedNode(null);
    
    if (!currentConfiguration) {
      // First step - initialize
      const initialConfig = initializeNFA(inputString);
      
      setCurrentConfiguration(initialConfig);
      setCurrNodes(initialConfig.stateIds);
      setHighlightedNodes(initialConfig.stateIds);
      return;
    }
    
    // Get the current input symbol
    const inputSymbol = currentConfiguration.inputPosition < currentConfiguration.inputString.length
      ? currentConfiguration.inputString[currentConfiguration.inputPosition]
      : '';
    
    if (!inputSymbol) {
      // End of input, check if in accepting state
      const isAccepted = Array.from(currentConfiguration.stateIds).some(stateId => finiteNodes.has(stateId));
      
      setValidationResult(isAccepted ? "Input Accepted" : "Input Rejected");
      setIsRunningStepWise(false);
      return;
    }
    
    // Track states before taking transitions
    const currentStates = new Set(currentConfiguration.stateIds);
    
    // First, check if we can move on the current input symbol
    const nextStatesOnInput = new Set<string>();
    const inputTransitions: HighlightedTransition[] = [];
    
    currentStates.forEach(stateId => {
      const node = nodeMap[stateId];
      if (!node) return;
      
      // Find transitions on the current input symbol
      node.transitions.forEach(transition => {
        if (transition.label === inputSymbol) {
          nextStatesOnInput.add(transition.targetid);
          inputTransitions.push({
            d: transition,
            target: stateId
          });
        }
      });
    });
    
    // If we found transitions on the input symbol
    if (nextStatesOnInput.size > 0) {
      // Compute epsilon closure if needed
      const nextStatesWithEpsilon = allowEpsilon
        ? computeEpsilonClosure(nextStatesOnInput, nodes, nodeMap)
        : nextStatesOnInput;
      
      // Create the next configuration
      const nextConfig: NFAState = {
        stateIds: nextStatesWithEpsilon,
        inputString: currentConfiguration.inputString,
        inputPosition: currentConfiguration.inputPosition + 1,
        halted: false,
        accepted: false
      };
      
      // Highlight input transitions
      setHighlightedTransitions(inputTransitions);
      
      // Update state
      setCurrentConfiguration(nextConfig);
      setCurrNodes(nextConfig.stateIds);
      setHighlightedNodes(nextConfig.stateIds);
      setStepIndex(prevStepIndex => prevStepIndex + 1);
      
      // Check if we reached the end of input
      if (nextConfig.inputPosition >= inputString.length) {
        const isAccepted = Array.from(nextConfig.stateIds).some(stateId => finiteNodes.has(stateId));
        setValidationResult(isAccepted ? "Input Accepted" : "Input Rejected");
        setIsRunningStepWise(false);
      }
      
      return;
    }
    
    // If no transitions on input and epsilon transitions are allowed
    if (allowEpsilon) {
      const epsilonTransitions: HighlightedTransition[] = [];
      const epsilonStates = new Set<string>();
      
      // Find epsilon transitions from current states
      currentStates.forEach(stateId => {
        const node = nodeMap[stateId];
        if (!node) return;
        
        node.transitions.forEach(transition => {
          if (transition.label === 'ε') {
            epsilonStates.add(transition.targetid);
            epsilonTransitions.push({
              d: transition,
              target: stateId
            });
          }
        });
      });
      
      if (epsilonStates.size > 0) {
        // Compute the complete epsilon closure
        const epsilonClosure = computeEpsilonClosure(epsilonStates, nodes, nodeMap);
        
        // Create the next configuration
        const nextConfig: NFAState = {
          stateIds: epsilonClosure,
          inputString: currentConfiguration.inputString,
          inputPosition: currentConfiguration.inputPosition, // Don't advance for epsilon
          halted: false,
          accepted: false
        };
        
        // Highlight epsilon transitions
        setHighlightedTransitions(epsilonTransitions);
        
        // Update state
        setCurrentConfiguration(nextConfig);
        setCurrNodes(nextConfig.stateIds);
        setHighlightedNodes(nextConfig.stateIds);
        setStepIndex(prevStepIndex => prevStepIndex + 1);
        
        return;
      }
    }
    
    // If no valid transitions, reject
    setValidationResult("Input Rejected");
    setIsRunningStepWise(false);
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
        onToggleEpsilon={handleToggleEpsilon}
        allowEpsilon={allowEpsilon}
        onSave={handleSave}
        onClearCanvas={clearCanvas}
        isLoggedIn={!!user}
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
    </div>
  );
};

export default AutomataSimulator;