'use client';



import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Layer, Stage } from 'react-konva';
import SaveMachineToast from '../../app/components/SaveMachineToast';
import { useTheme } from '../../app/context/ThemeContext';
import { auth } from '../../lib/firebase';
import { saveMachine } from '../../lib/machineService';
import ControlPanel from './components/ControlPanel';
import FSMInfoPanel from './components/FSMInfoPanel';
import OutputPanel from './components/OutputPanel';
// Import generic components
import InputPopup from '../../shared/components/InputPopup';
import JsonInputDialog from '../../shared/components/JsonInputDialog';
import ProblemPanel from '../../shared/components/ProblemPanel';
import TestInputPanel from '../../shared/components/TestInputPanel';
import { getFieldsForSimulator, formatTransitionValue } from '../../shared/configs/inputConfigs';
import { FSMState, HighlightedTransition, MachineType, Node, NodeMap, StageProps, Transition } from './type';
import {
  batchTestFSM,
  deserializeFSM,
  encodeFSMForURL,
  getNextConfiguration,
  TestCase,
  testFSM,
  validateFSM
} from './utils/fsmSerializer';

// Dynamically import the NodeCanvas component to prevent SSR issues with Konva
const DynamicNodeCanvas = dynamic(() => import('./components/NodeCanvas'), {
  ssr: false,
});

const DynamicGridCanvas = dynamic(() => import('../../shared/components/Grid'), {
  ssr: false,
});

interface AutomataSimulatorProps {
  initialMachine?: string; // Optional JSON string to initialize the FSM
  problemId?: string; // Optional problem ID to load a specific problem
}

const AutomataSimulator: React.FC<AutomataSimulatorProps> = ({ initialMachine, problemId }) => {
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
  
  // Problem mode state
  const [problem, setProblem] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
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
  
  // Fetch problem data if problemId is provided
  useEffect(() => {
    const fetchProblem = async () => {
      if (!problemId) return;
      
      setIsLoading(true);
      try {
        const response = await fetch(`/api/problems/fsm?id=${problemId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch problem');
        }
        
        const problemData = await response.json();
        setProblem(problemData);
        
        // Set machine type based on problem
        if (problemData.machineType) {
          setMachineType(problemData.machineType);
        }
        
        // If there's an initial node map, load it
        if (problemData.initialNodeMap) {
          loadMachineFromNodeMap(problemData.initialNodeMap);
        }
      } catch (error) {
        console.error('Error fetching problem:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProblem();
  }, [problemId]);
  
  const [stageDragging, setIsStageDragging] = useState<boolean>(false);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [highlightedTransitions, setHighlightedTransitions] = useState<HighlightedTransition[]>([]);
  const [showQuestion, setShowQuestion] = useState<boolean>(false);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isRunningStepWise, setIsRunningStepWise] = useState<boolean>(false);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [isOutputPopupOpen, setIsOutputPopupOpen] = useState<boolean>(false);
  const [targetNode, setTargetNode] = useState<Node | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [jsonInputOpen, setJsonInputOpen] = useState<boolean>(false);
  const [jsonInput, setJsonInput] = useState<string>('');
  const [outputSequence, setOutputSequence] = useState<string[]>([]);
  const [currentConfiguration, setCurrentConfiguration] = useState<FSMState | null>(null);
  const [machineType, setMachineType] = useState<MachineType>('Moore');
  
  // Save machine state
  const [showSaveToast, setShowSaveToast] = useState<boolean>(false);
  const [shareUrl, setShareUrl] = useState<string>('');
  
  const stageRef = useRef<Konva.Stage>(null);

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check for FSM in URL params when component mounts
  useEffect(() => {
    if (isClient) {
      // First check for initialMachine prop
      if (initialMachine) {
        loadMachineFromJSON(initialMachine);
      } 
      // Then check URL params
      else {
        const machineParam = searchParams.get('machine');
        if (machineParam) {
          try {
            const decodedMachine = decodeURIComponent(machineParam);
            loadMachineFromJSON(decodedMachine);
          } catch (error) {
            console.error('Error loading FSM from URL:', error);
          }
        }
      }
    }
  }, [isClient, initialMachine, searchParams]);

  // Update NodeMap whenever nodes changes
  useEffect(() => {
    const map: NodeMap = {};
    nodes.forEach(node => {
      map[node.id] = node;
    });
    setNodeMap(map);
  }, [nodes]);

  /**
   * Loads a FSM from a JSON string
   */
  const loadMachineFromJSON = (jsonString: string): void => {
    try {
      const parsedMachine = deserializeFSM(jsonString);
      if (parsedMachine) {
        // Validate the FSM before loading
        const finalStatesSet = new Set<string>(parsedMachine.finalStates);
        const machineType = parsedMachine.machineType || 'Moore';
        const validationResult = validateFSM(parsedMachine.nodes, finalStatesSet, machineType);
        
        if (!validationResult.isValid) {
          setValidationResult(validationResult.errorMessage || 'Invalid FSM');
          return;
        }
        
        setNodes(parsedMachine.nodes);
        setFiniteNodes(new Set<string>());
        setMachineType(machineType);
        
        // Reset simulation state
        resetSimulation();
        setValidationResult('Machine loaded successfully');
      } else {
        setValidationResult('Error: Invalid machine format');
      }
    } catch (error) {
      console.error('Error loading FSM:', error);
      setValidationResult('Error loading FSM');
    }
  };

  /**
   * Handles the JSON input submission
   */
  const handleJsonInputSubmit = (): void => {
    if (jsonInput.trim()) {
      loadMachineFromJSON(jsonInput);
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
        output: '',  // Default empty output for new state
        transitions: []
      };
      setNodes((prev) => [...prev, newNode]);
      
      // Open output popup for new node if it's a Moore machine
      if (machineType === 'Moore') {
        setSelectedNode(newNode);
        setIsOutputPopupOpen(true);
      }
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

  const handleTransitionSubmit = (values: Record<string, string>): void => {
    const inputSymbol = values.input;
    const outputSymbol = values.output;
    
    if (!inputSymbol) {
      console.warn("Invalid input symbol");
      return;
    }
    
    if (!targetNode) {
      console.warn("No target node was selected.");
      return;
    }

    if (selectedNode) {
      // Add the transition with the input symbol
      const updatedNodes = [...nodes];
      const nodeIndex = updatedNodes.findIndex(n => n.id === selectedNode.id);
      
      if (nodeIndex !== -1) {
        const transitionIndex = updatedNodes[nodeIndex].transitions.findIndex(
          item => item.targetid === targetNode.id && item.inputSymbol === inputSymbol
        );
        
        // Create a copy of the node to modify
        const updatedNode = { ...updatedNodes[nodeIndex] };
        
        if (transitionIndex === -1) {
          // Add new transition only if it doesn't exist already
          const newTransition: Transition = { 
            targetid: targetNode.id, 
            inputSymbol: inputSymbol 
          };
          
          // For Mealy machines, include the output symbol
          if (machineType === 'Mealy' && outputSymbol) {
            newTransition.outputSymbol = outputSymbol;
          }
          
          updatedNode.transitions = [
            ...updatedNode.transitions,
            newTransition
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

  const handleOutputChange = (output: string): void => {
    if (selectedNode) {
      setNodes(prev => 
        prev.map(node => 
          node.id === selectedNode.id 
            ? { ...node, output: output } 
            : node
        )
      );
      setSelectedNode(null);
    }
    setIsOutputPopupOpen(false);
  };

  const handleInputClose = (): void => {
    setIsPopupOpen(false);
    setSelectedNode(null);
    setTargetNode(null);
  };

  const handleOutputClose = (): void => {
    setIsOutputPopupOpen(false);
    setSelectedNode(null);
  };

  const handleNodeClick = (node: Node): void => {
    // Reset running state if clicking during simulation
    if (isRunning) return;
    
    if (!selectedNode) {
      // First click - just select the node
      setSelectedNode(node);
    } else {
      // Second click - create a transition (even if it's to the same node for self-loops)
      setTargetNode(node);
      setIsPopupOpen(true);
    }
  };
  
  // New function to handle setting state output
  const handleSetStateOutput = (node: Node): void => {
    if (isRunning) return;
    setSelectedNode(node);
    setIsOutputPopupOpen(true);
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

  const handleMachineTypeChange = (type: MachineType): void => {
    if (isRunning || isRunningStepWise) return;
    
    // Check if we need to validate/fix anything when switching modes
    if (type === 'Moore') {
      // Make sure all states have outputs
      const needsOutput = nodes.some(node => !node.output);
      if (needsOutput) {
        setValidationResult("Warning: Some states are missing outputs required for Moore machine");
      }
    } else if (type === 'Mealy') {
      // Make sure all transitions have outputs
      const needsTransitionOutputs = nodes.some(node => 
        node.transitions.some(t => !t.outputSymbol)
      );
      if (needsTransitionOutputs) {
        setValidationResult("Warning: Some transitions are missing outputs required for Mealy machine");
      }
    }
    
    setMachineType(type);
    resetSimulation();
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
    setOutputSequence([]);
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
    setFiniteNodes(new Set<string>());
    setInputString('');
    
    // Reset validation
    setValidationResult(null);
    
    // Clear share URL
    setShareUrl('');
  };

  // FSM simulation
  const handleRun = async (): Promise<void> => {
    if (isRunning || !nodes.length) return;
    
    // Validate the FSM before running
    const validationResult = validateFSM(nodes, finiteNodes, machineType);
    if (!validationResult.isValid) {
      setValidationResult(validationResult.errorMessage || 'Invalid FSM');
      return;
    }
    
    setIsRunning(true);
    if (isRunningStepWise) setIsRunningStepWise(false);
    setShowQuestion(false);
    setSelectedNode(null);
    setHighlightedTransitions([]);
    setValidationResult(null);
    setStepIndex(0);
    setOutputSequence([]);
    
    // Start with initial configuration
    const initialState = 'q0';
    const initialOutput = machineType === 'Moore' ? [nodeMap[initialState]?.output || ''] : [];
    
    let currentConfig: FSMState = {
      stateId: initialState,
      currentInput: inputString,
      inputIndex: 0,
      outputSequence: initialOutput,
      halted: false
    };
    
    setCurrentConfiguration(currentConfig);
    setCurrNodes(new Set([currentConfig.stateId]));
    setHighlightedNodes(new Set([currentConfig.stateId]));
    setOutputSequence(currentConfig.outputSequence);
    
    // Maximum step count to prevent infinite loops
    const MAX_STEPS = 1000;
    let stepCount = 0;
    
    // Run the FSM until it halts or reaches max steps
    while (!currentConfig.halted && stepCount < MAX_STEPS && currentConfig.inputIndex < inputString.length) {
      await sleep(500); // Delay for animation
      
      // Get next configuration
      const nextConfig = getNextConfiguration(currentConfig, nodeMap, machineType);
      
      // If no valid transition exists
      if (!nextConfig || nextConfig.halted) {
        if (nextConfig) {
          setCurrNodes(new Set([nextConfig.stateId]));
          setHighlightedNodes(new Set([nextConfig.stateId]));
          setOutputSequence(nextConfig.outputSequence);
        }
        
        break;
      }
      
      // Highlight the transition
      const currentNode = nodeMap[currentConfig.stateId];
      const currentSymbol = inputString[currentConfig.inputIndex];
      
      if (currentNode) {
        const transition = currentNode.transitions.find(t => t.inputSymbol === currentSymbol);
        
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
      setOutputSequence(currentConfig.outputSequence);
      setStepIndex(stepCount + 1);
      
      stepCount++;
    }
    
    // Check if we reached MAX_STEPS (potential infinite loop)
    if (stepCount >= MAX_STEPS) {
      setValidationResult("Warning: Reached maximum step count");
    }
    
    // Check if machine is in a final state
    const lastState = currentConfig.stateId;
    if (finiteNodes.has(lastState)) {
      setValidationResult("Processing complete - ended in a final state");
    } else {
      setValidationResult("Processing complete");
    }
    
    setIsRunning(false);
  };

  const handleStepWise = async (): Promise<void> => {
    if (selectedNode) setSelectedNode(null);
    
    if (!currentConfiguration) {
      // First step - initialize
      const initialState = 'q0';
      const initialOutput = machineType === 'Moore' ? [nodeMap[initialState]?.output || ''] : [];
      
      const initialConfig: FSMState = {
        stateId: initialState,
        currentInput: inputString,
        inputIndex: 0,
        outputSequence: initialOutput,
        halted: false
      };
      
      setCurrentConfiguration(initialConfig);
      setCurrNodes(new Set([initialState]));
      setHighlightedNodes(new Set([initialState]));
      setOutputSequence(initialConfig.outputSequence);
      return;
    }
    
    // Get next configuration
    const nextConfig = getNextConfiguration(currentConfiguration, nodeMap, machineType);
    
    // If no valid transition exists or we've halted
    if (!nextConfig || nextConfig.halted || currentConfiguration.inputIndex >= inputString.length) {
      // Check if machine is in a final state
      const lastState = currentConfiguration.stateId;
      if (finiteNodes.has(lastState)) {
        setValidationResult("Processing complete - ended in a final state");
      } else {
        setValidationResult("Processing complete");
      }
      
      setIsRunningStepWise(false);
      return;
    }
    
    // Highlight the transition
    const currentNode = nodeMap[currentConfiguration.stateId];
    const currentSymbol = inputString[currentConfiguration.inputIndex];
    
    if (currentNode) {
      const transition = currentNode.transitions.find(t => t.inputSymbol === currentSymbol);
      
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
    setOutputSequence(nextConfig.outputSequence);
    setStepIndex(prevStepIndex => prevStepIndex + 1);
  };

  const onStepWiseClick = (): void => {
    if (isRunning || !nodes.length) return;
    
    if (isRunningStepWise) {
      handleStepWise();
    } else {
      // Validate the FSM before running
      const validationResult = validateFSM(nodes, finiteNodes, machineType);
      if (!validationResult.isValid) {
        setValidationResult(validationResult.errorMessage || 'Invalid FSM');
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
  
  // For individual string testing
  const handleSingleTest = (testString: string): string => {
    if (!validateCurrentMachine()) {
      return 'Invalid FSM';
    }
    
    return testFSM(testString, nodeMap, finiteNodes, machineType);
  };

  // Calculate all input and output symbols used in the machine
  const getSymbols = (): { inputAlphabet: string[], outputAlphabet: string[] } => {
    const inputSet = new Set<string>();
    const outputSet = new Set<string>();
    
    nodes.forEach(node => {
      // Add all state outputs to output alphabet (for Moore machines)
      if (node.output) {
        outputSet.add(node.output);
      }
      
      // Add all input symbols to input alphabet
      node.transitions.forEach(transition => {
        if (transition.inputSymbol) {
          inputSet.add(transition.inputSymbol);
        }
        
        // Add transition outputs to output alphabet (for Mealy machines)
        if (transition.outputSymbol) {
          outputSet.add(transition.outputSymbol);
        }
      });
    });
    
    return {
      inputAlphabet: Array.from(inputSet).sort(),
      outputAlphabet: Array.from(outputSet).sort()
    };
  };

  /**
   * Generates a shareable URL with the current FSM state
   */
  const shareMachine = (): void => {
    try {
      // Create a URL with the encoded FSM
      const encodedMachine = encodeFSMForURL(nodes, finiteNodes, machineType);
      const relativePath = `/simulator/fsm?machine=${encodedMachine}`;
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
        const encodedMachine = encodeFSMForURL(nodes, finiteNodes, machineType);
        const relativePath = `/simulator/fsm?machine=${encodedMachine}`;
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
        machineType: machineType === 'Moore' ? 'Moore Machine' : 'Mealy Machine'
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
   * Validates the current FSM and updates the validation result
   */
  const validateCurrentMachine = (): boolean => {
    const result = validateFSM(nodes, finiteNodes, machineType);
    if (!result.isValid) {
      setValidationResult(result.errorMessage || 'Invalid FSM');
      return false;
    }
    setValidationResult('Valid FSM');
    return true;
  };

  // Helper function to load a machine from a NodeMap
  const loadMachineFromNodeMap = (nodeMap: NodeMap): void => {
    setNodeMap(nodeMap);
    const nodesArray = Object.values(nodeMap);
    setNodes(nodesArray);
    
    // Reset the simulator state
    setSelectedNode(null);
    setCurrNodes(new Set());
    setHighlightedNodes(new Set());
    setHighlightedTransitions([]);
    setInputString('');
    setValidationResult(null);
    setStepIndex(0);
    setCurrentConfiguration(null);
    setOutputSequence([]);
    
    // Initialize an empty set for finite nodes - the acceptance states
    // are managed separately through the finiteNodes state
    setFiniteNodes(new Set<string>());
  };

  // Function to test the current FSM against test cases
  const testSolution = (acceptStrings: string[], rejectStrings: string[]): any => {
    if (!validateCurrentMachine()) {
      return {
        passed: false,
        acceptResults: [],
        rejectResults: [],
        summary: 'Invalid FSM'
      };
    }
    
    // For FSM problems, we need to check output sequences, not just acceptance
    if (problem && problem.testStrings) {
      const testResults = problem.testStrings.map((testCase: { input: string; expectedOutput: string }, idx: number) => {
        try {
          // Simulate the FSM to get the output sequence
          const initialState = 'q0';
          let currentStateId = initialState;
          let outputSequence: string[] = [];
          
          // For Moore machines, add initial state output
          if (machineType === 'Moore' && nodeMap[currentStateId]) {
            outputSequence.push(nodeMap[currentStateId].output || '');
          }
          
          // Process each input symbol
          for (let i = 0; i < testCase.input.length; i++) {
            const symbol = testCase.input[i];
            const currentNode = nodeMap[currentStateId];
            
            if (!currentNode) {
              throw new Error(`State ${currentStateId} not found`);
            }
            
            // Find transition for this input symbol
            const transition = currentNode.transitions.find(t => t.inputSymbol === symbol);
            
            if (!transition) {
              throw new Error(`No transition found for symbol '${symbol}' from state ${currentStateId}`);
            }
            
            // For Mealy machines, add transition output
            if (machineType === 'Mealy' && transition.outputSymbol) {
              outputSequence.push(transition.outputSymbol);
            }
            
            // Move to next state
            currentStateId = transition.targetid;
            
            // For Moore machines, add state output after transition
            if (machineType === 'Moore' && nodeMap[currentStateId] && i < testCase.input.length - 1) {
              outputSequence.push(nodeMap[currentStateId].output || '');
            }
          }
          
          // Get the final output
          const actualOutput = outputSequence.join('');
          const expected = testCase.expectedOutput;
          const passed = actualOutput === expected;
          
          return {
            string: testCase.input,
            accepted: passed,
            expected: true,
            actualOutput,
            expectedOutput: expected
          };
        } catch (error) {
          return {
            string: testCase.input,
            accepted: false,
            expected: true,
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
      });
      
      const passedCount = testResults.filter((r: any) => r.accepted).length;
      const totalCount = testResults.length;
      const passed = passedCount === totalCount;
      
      return {
        passed,
        acceptResults: testResults,
        rejectResults: [],
        summary: `${passedCount}/${totalCount} test cases passed`
      };
    }
    
    // Fallback to traditional accept/reject testing for other problem types
    const acceptResults = acceptStrings.map(str => {
      const result = testFSM(str, nodeMap, finiteNodes, machineType);
      const accepted = result === 'Accepted';
      return {
        string: str,
        accepted,
        expected: true
      };
    });
    
    const rejectResults = rejectStrings.map(str => {
      const result = testFSM(str, nodeMap, finiteNodes, machineType);
      const accepted = result === 'Accepted';
      return {
        string: str,
        accepted,
        expected: false
      };
    });
    
    const acceptPassed = acceptResults.every(r => r.accepted === r.expected);
    const rejectPassed = rejectResults.every(r => r.accepted === r.expected);
    const passed = acceptPassed && rejectPassed;
    
    const passedCount = [...acceptResults, ...rejectResults].filter(r => r.accepted === r.expected).length;
    const totalCount = acceptResults.length + rejectResults.length;
    
    return {
      passed,
      acceptResults,
      rejectResults,
      summary: `${passedCount}/${totalCount} tests passed`
    };
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
        onValidate={validateCurrentMachine}
        onSetStateOutput={handleSetStateOutput}
        onMachineTypeChange={handleMachineTypeChange}
        machineType={machineType}
        onSave={handleSave}
        onClearCanvas={clearCanvas}
        isLoggedIn={!!user}
        problemMode={!!problem}
      />
      
      <FSMInfoPanel 
        symbols={getSymbols()}
        nodeCount={nodes.length}
        finalStates={Array.from(finiteNodes)}
        transitionCount={nodes.reduce((count, node) => count + node.transitions.length, 0)}
        machineType={machineType}
      />
      
      <OutputPanel 
        machineType={machineType}
        outputSequence={currentConfiguration?.outputSequence || []}
      />
      
      {!problem && (
        <TestInputPanel 
          onTestInput={handleTestInput} 
          onShareMachine={shareMachine}
          simulatorType="FSM"
        />
      )}
      
      {problem && (
        <ProblemPanel
          problem={problem}
          onTestSolution={testSolution}
          simulatorType="FSM"
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
          
          <Layer id="node-layer">
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
      
      <InputPopup 
        isOpen={isPopupOpen}
        onClose={handleInputClose}
        onSubmit={handleTransitionSubmit}
        title={machineType === 'Mealy' ? "Enter Transition Details" : "Enter Transition Input Symbol"}
        fields={getFieldsForSimulator('FSM', machineType === 'Mealy')}
      />
      
      <InputPopup 
        isOpen={isOutputPopupOpen}
        onClose={handleOutputClose}
        onSubmit={(values) => handleOutputChange(values.output)}
        title="Enter State Output"
        fields={[{
          name: 'output',
          label: 'Output Value',
          placeholder: 'e.g., 0, 1, a, b',
          required: true
        }]}
      />
      
      <JsonInputDialog
        isOpen={jsonInputOpen}
        onClose={() => setJsonInputOpen(false)}
        value={jsonInput}
        onChange={setJsonInput}
        onSubmit={handleJsonInputSubmit}
        simulatorType="FSM"
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