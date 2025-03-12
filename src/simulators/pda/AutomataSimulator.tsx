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
  getNextConfigurations,
  batchTestPDA
} from './utils/pdaSerializer';
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

interface PushdownAutomataSimulatorProps {
  initialPDA?: string; // Optional JSON string to initialize the PDA
  problemId?: string; // Optional problem ID for problem panel
}

const AutomataSimulator: React.FC<PushdownAutomataSimulatorProps> = ({ initialPDA, problemId }) => {
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
  const [stack, setStack] = useState<Stack>({ content: [] });
  const [currentConfiguration, setCurrentConfiguration] = useState<PDAState | null>(null);
  
  // Save machine state
  const [showSaveToast, setShowSaveToast] = useState<boolean>(false);
  const [shareUrl, setShareUrl] = useState<string>('');
  
  const stageRef = useRef<Konva.Stage>(null);

  // Track all active configurations for non-deterministic exploration
  const [activeConfigurations, setActiveConfigurations] = useState<{config: PDAState; path: PDAState[]}[]>([]);
  const [visitedConfigs, setVisitedConfigs] = useState<Set<string>>(new Set());

  // Track the accepting path for visualization
  const [acceptingPath, setAcceptingPath] = useState<PDAState[]>([]);
  const [isShowingAcceptingPath, setIsShowingAcceptingPath] = useState<boolean>(false);
  const [acceptingPathStep, setAcceptingPathStep] = useState<number>(0);

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
    
    // Reset non-deterministic exploration state
    setActiveConfigurations([]);
    setVisitedConfigs(new Set());
    
    // Reset accepting path visualization
    setAcceptingPath([]);
    setIsShowingAcceptingPath(false);
    setAcceptingPathStep(0);
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

  // Handle the Run button for automatic simulation
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
    setAcceptingPath([]);
    setIsShowingAcceptingPath(false);
    setAcceptingPathStep(0);
    
    // Initialize PDA with input
    const initialConfig = initializePDA(inputString);
    setCurrentConfiguration(initialConfig);
    setStack(initialConfig.stack);
    setCurrNodes(new Set([initialConfig.stateId]));
    setHighlightedNodes(new Set([initialConfig.stateId]));
    
    // Queue for BFS, starting with the initial configuration
    const queue: {config: PDAState; path: PDAState[]}[] = [
      {config: initialConfig, path: [initialConfig]}
    ];
    
    // Set to keep track of visited configurations
    const visited = new Set<string>();
    
    // First phase: Find accepting path with BFS
    let foundAcceptingPath = false;
    let acceptingPathFound: PDAState[] = [];
    
    while (queue.length > 0 && !foundAcceptingPath) {
      // Get the next configuration from the queue
      const { config: currentConfig, path } = queue.shift()!;
      
      // Generate a string representation of the configuration to avoid cycles
      const configStr = `${currentConfig.stateId},${currentConfig.inputPosition},${currentConfig.stack.content.join('')}`;
      if (visited.has(configStr)) continue;
      visited.add(configStr);
      
      // Check if we've reached an accepting state
      if (currentConfig.inputPosition >= currentConfig.inputString.length && 
          finiteNodes.has(currentConfig.stateId)) {
        // We found an accepting path!
        foundAcceptingPath = true;
        acceptingPathFound = path;
        break;
      }
      
      // Get all possible next configurations from this point
      const nextConfigs = getNextConfigurations(currentConfig, nodes, nodeMap, finiteNodes);
      
      // Add all next configurations to the queue with their paths
      for (const nextConfig of nextConfigs) {
        if (nextConfig.halted) {
          if (nextConfig.accepted) {
            // Found an accepting configuration!
            foundAcceptingPath = true;
            acceptingPathFound = [...path, nextConfig];
            break;
          }
          continue; // Skip halted non-accepting configurations
        }
        
        queue.push({
          config: nextConfig,
          path: [...path, nextConfig]
        });
      }
    }
    
    // If we found an accepting path, visualize it
    if (foundAcceptingPath) {
      setAcceptingPath(acceptingPathFound);
      setValidationResult("Input Accepted - Visualizing accepting path");
      
      // Second phase: Visualize the accepting path step by step
      setIsShowingAcceptingPath(true);
      
      for (let i = 0; i < acceptingPathFound.length; i++) {
        // Delay for animation
        await sleep(500);
        
        const currentConfig = acceptingPathFound[i];
        
        // Update UI with current configuration
        setCurrentConfiguration(currentConfig);
        setStack(currentConfig.stack);
        setCurrNodes(new Set([currentConfig.stateId]));
        setHighlightedNodes(new Set([currentConfig.stateId]));
        setAcceptingPathStep(i);
        setStepIndex(i);
        
        // Visualize the transition if not the first state
        if (i > 0) {
          const prevConfig = acceptingPathFound[i-1];
          const prevNode = nodeMap[prevConfig.stateId];
          
          if (prevNode) {
            // Find the transition that was taken
            const transition = prevNode.transitions.find(t => 
              t.targetid === currentConfig.stateId
            );
            
            if (transition) {
              setHighlightedTransitions([{
                d: transition,
                target: prevConfig.stateId
              }]);
            }
          }
        }
      }
      
      setValidationResult("Input Accepted");
    } else {
      // If we didn't find an accepting path
      setValidationResult("Input Rejected - No accepting path found");
    }
    
    setIsRunning(false);
  };

  // Handle step-by-step simulation
  const handleStepWise = async (): Promise<void> => {
    if (selectedNode) setSelectedNode(null);
    
    // If we're already showing an accepting path, continue through it
    if (isShowingAcceptingPath) {
      const nextStep = acceptingPathStep + 1;
      
      if (nextStep < acceptingPath.length) {
        const currentConfig = acceptingPath[nextStep];
        const prevConfig = acceptingPath[nextStep - 1];
        
        // Update UI with current configuration
        setCurrentConfiguration(currentConfig);
        setStack(currentConfig.stack);
        setCurrNodes(new Set([currentConfig.stateId]));
        setHighlightedNodes(new Set([currentConfig.stateId]));
        setAcceptingPathStep(nextStep);
        setStepIndex(nextStep);
        
        // Visualize the transition
        const prevNode = nodeMap[prevConfig.stateId];
        
        if (prevNode) {
          const transition = prevNode.transitions.find(t => 
            t.targetid === currentConfig.stateId
          );
          
          if (transition) {
            setHighlightedTransitions([{
              d: transition,
              target: prevConfig.stateId
            }]);
          }
        }
        
        // If we reached the end of the accepting path
        if (nextStep === acceptingPath.length - 1) {
          setValidationResult("Input Accepted");
          setIsRunningStepWise(false);
        }
      } else {
        // We've finished visualizing the accepting path
        setIsShowingAcceptingPath(false);
        setIsRunningStepWise(false);
      }
      
      return;
    }
    
    // Step 1: Initialize if first step
    if (!isRunningStepWise) {
      setIsRunningStepWise(true);
      const initialConfig = initializePDA(inputString);
      setCurrentConfiguration(initialConfig);
      setCurrNodes(new Set(['q0']));
      setHighlightedNodes(new Set(['q0']));
      setStack(initialConfig.stack);
      setStepIndex(0);
      
      // Initialize the active configurations queue with the initial configuration
      setActiveConfigurations([{ config: initialConfig, path: [initialConfig] }]);
      setVisitedConfigs(new Set());
      return;
    }
    
    // If we have no active configurations, we're done
    if (activeConfigurations.length === 0) {
      setValidationResult("Input Rejected - No more paths to explore");
      setIsRunningStepWise(false);
      return;
    }
    
    // Get the next configuration from the queue
    const { config: currentConfig, path } = activeConfigurations[0];
    const newActiveConfigurations = activeConfigurations.slice(1);
    
    // Update the UI with the current configuration
    setCurrentConfiguration(currentConfig);
    setCurrNodes(new Set([currentConfig.stateId]));
    setHighlightedNodes(new Set([currentConfig.stateId]));
    setStack(currentConfig.stack);
    setStepIndex(prevStepIndex => prevStepIndex + 1);
    
    // Check if this configuration is an accepting state
    if (currentConfig.inputPosition >= currentConfig.inputString.length && 
        finiteNodes.has(currentConfig.stateId)) {
      // Found an accepting path! Save it for visualization
      setAcceptingPath(path);
      setIsShowingAcceptingPath(true);
      setAcceptingPathStep(0);
      setValidationResult("Input Accepted - Press Step to see the accepting path");
      return;
    }
    
    // Generate a string representation of the configuration to avoid cycles
    const configStr = `${currentConfig.stateId},${currentConfig.inputPosition},${currentConfig.stack.content.join('')}`;
    const newVisitedConfigs = new Set(visitedConfigs);
    
    // Skip if we've already processed this configuration
    if (visitedConfigs.has(configStr)) {
      setActiveConfigurations(newActiveConfigurations);
      return;
    }
    
    newVisitedConfigs.add(configStr);
    setVisitedConfigs(newVisitedConfigs);
    
    // Get all possible next configurations
    const nextConfigs = getNextConfigurations(currentConfig, nodes, nodeMap, finiteNodes);
    
    // Visualize the transition if we have one
    if (path.length > 1) {
      const prevConfig = path[path.length - 2];
      const prevNode = nodeMap[prevConfig.stateId];
      
      if (prevNode) {
        const transition = prevNode.transitions.find(t => 
          t.targetid === currentConfig.stateId
        );
        
        if (transition) {
          setHighlightedTransitions([{
            d: transition,
            target: prevConfig.stateId
          }]);
        }
      }
    }
    
    // Process each next configuration
    for (const nextConfig of nextConfigs) {
      if (nextConfig.halted) {
        if (nextConfig.accepted) {
          // Found an accepting configuration!
          setAcceptingPath([...path, nextConfig]);
          setIsShowingAcceptingPath(true);
          setAcceptingPathStep(0);
          setValidationResult("Input Accepted - Press Step to see the accepting path");
          return;
        }
        continue; // Skip halted non-accepting configurations
      }
      
      // Add to the queue of active configurations
      newActiveConfigurations.push({
        config: nextConfig,
        path: [...path, nextConfig]
      });
    }
    
    // Update the active configurations
    setActiveConfigurations(newActiveConfigurations);
    
    // If we have no more configurations to explore, we're done
    if (newActiveConfigurations.length === 0) {
      setValidationResult("Input Rejected - No more paths to explore");
      setIsRunningStepWise(false);
    }
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
      const relativePath = `/simulator/pda?pda=${encodedPDA}`;
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
        const encodedPDA = encodePDAForURL(nodes, finiteNodes);
        const relativePath = `/simulator/pda?pda=${encodedPDA}`;
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
        machineType: 'Pushdown Automaton (PDA)'
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

  // Add a function to handle batch testing for problems
  const handleTestSolution = (acceptStrings: string[], rejectStrings: string[]) => {
    // Use the current stack content for testing
    return batchTestPDA(nodes, nodeMap, finiteNodes, acceptStrings, rejectStrings, stack.content);
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
        onReset={resetSimulation}
        onToggleGrid={() => setShowGrid(!showGrid)}
        onLoadJson={problemId ? undefined : toggleJsonInput}
        onValidate={validateCurrentPDA}
        onSave={problemId ? undefined : handleSave}
        onClearCanvas={clearCanvas}
        inputString={inputString}
        validationResult={validationResult}
        selectedNode={selectedNode}
        isRunning={isRunning || isRunningStepWise}
        isRunningStepWise={isRunningStepWise}
        showGrid={showGrid}
        stepIndex={stepIndex}
        stack={stack}
        isLoggedIn={!!user}
        problemMode={!!problemId}
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
      
      {!problemId && (
        <TestInputPanel 
          onTestInput={handleTestInput} 
          onSharePDA={sharePDA}
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
      
      {/* Add the problem panel if a problem ID is provided */}
      {problemId && (
        <ProblemPanel
          problemId={problemId}
          onTestSolution={handleTestSolution}
        />
      )}
      
    </div>
  );
};

export default AutomataSimulator;