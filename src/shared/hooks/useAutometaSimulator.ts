// src/hooks/useAutomataSimulator.ts

import { useState, useCallback, useEffect } from 'react';
import {
  ValidationResult,
  SimulatorEngine,
  Serializer,
  NodeFactory
} from '../interfaces/SimulatorEngine';

export interface AutomataConfig<TNode, TState> {
  simulatorType: 'DFA' | 'NFA' | 'PDA' | 'TM' | 'FSM';
  serializer: Serializer<TNode>;
  simulator: SimulatorEngine<TState>;
  nodeFactory: NodeFactory<TNode>;
}

export function useAutomataSimulator<
  TNode extends { id: string; x: number; y: number },
  TState
>(
  config: AutomataConfig<TNode, TState>,
  initialData?: string,
  problemId?: string
) {
  // Core state
  const [nodes, setNodes] = useState<TNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<TNode | null>(null);
  const [finiteNodes, setFiniteNodes] = useState<Set<string>>(new Set());

  // Input / validation
  const [inputString, setInputString] = useState('');
  const [validationResult, setValidationResult] = useState<string | null>(null);

  // Canvas
  const [stageProps, setStageProps] = useState({
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [showGrid, setShowGrid] = useState(false);

  // Simulation status
  const [isRunning, setIsRunning] = useState(false);
  const [isRunningStepWise, setIsRunningStepWise] = useState(false);
  const [currentConfiguration, setCurrentConfiguration] = useState<TState | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [simulationHistory, setSimulationHistory] = useState<TState[]>([]);

  // Highlights
  const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(new Set());
  const [highlightedTransitions, setHighlightedTransitions] = useState<any[]>([]);

  // Auth / problem mode
  const [isLoggedIn] = useState(false);
  const isProblemMode = Boolean(problemId);

  // Initial load from JSON if provided
  useEffect(() => {
    if (initialData) {
      loadFromJSON(initialData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  // NODE MANAGEMENT
  const handleAddNode = useCallback(() => {
    const nodeId = config.nodeFactory.getNextNodeId(nodes);
    const newNode = config.nodeFactory.createNode(
      nodeId,
      Math.random() * 300 + 100,
      Math.random() * 300 + 100
    );
    setNodes(prev => [...prev, newNode]);
    setSelectedNode(newNode);
  }, [nodes, config.nodeFactory]);

  const handleNodeSelect = useCallback((node: TNode) => {
    setSelectedNode(node);
  }, []);

  const handleNodeDrag = useCallback((nodeId: string, position: { x: number; y: number }) => {
    setNodes(prev =>
      prev.map(node =>
        node.id === nodeId ? { ...node, x: position.x, y: position.y } : node
      )
    );
  }, []);

  const handleSetFinite = useCallback((nodeId?: string) => {
    const targetId = nodeId || selectedNode?.id;
    if (!targetId) return;
    setFiniteNodes(prev => {
      const updated = new Set(prev);
      if (updated.has(targetId)) updated.delete(targetId);
      else updated.add(targetId);
      return updated;
    });
  }, [selectedNode]);

  // CANVAS MANAGEMENT
  const handleCanvasClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const handleToggleGrid = useCallback(() => {
    setShowGrid(prev => !prev);
  }, []);

  const handleClearCanvas = useCallback(() => {
    if (window.confirm('Clear the canvas?')) {
      setNodes([]);
      setSelectedNode(null);
      setFiniteNodes(new Set());
      resetSimulation();
    }
  }, []);

  // SIMULATION CONTROL
  const resetSimulation = useCallback(() => {
    setIsRunning(false);
    setIsRunningStepWise(false);
    setCurrentConfiguration(null);
    setStepIndex(0);
    setSimulationHistory([]);
    setHighlightedNodes(new Set());
    setHighlightedTransitions([]);
  }, []);

  const handleRun = useCallback(() => {
    if (nodes.length === 0) {
      setValidationResult('No states to simulate.');
      return;
    }

    resetSimulation();
    setIsRunning(true);

    try {
      const initialState = config.simulator.getInitialState(nodes);
      let currentState = initialState;
      const history: TState[] = [initialState];

      for (let i = 0; i < inputString.length; i++) {
        const step = config.simulator.step(
          currentState,
          inputString,
          i,
          nodes,
          finiteNodes
        );
        currentState = step.newState;
        history.push(currentState);
        if (step.finished) break;
      }

      const accepted = config.simulator.isAccepting(currentState, finiteNodes, nodes);
      setValidationResult(accepted ? 'Accepted' : 'Rejected');
      setCurrentConfiguration(currentState);
      setSimulationHistory(history);
      setStepIndex(inputString.length);
    } catch (err) {
      console.error(err);
      setValidationResult(`Simulation error: ${String(err)}`);
    } finally {
      setIsRunning(false);
    }
  }, [nodes, inputString, finiteNodes, config.simulator, resetSimulation]);

  const handleStep = useCallback(() => {
    if (nodes.length === 0) return;

    if (!isRunningStepWise) {
      const initialState = config.simulator.getInitialState(nodes);
      setCurrentConfiguration(initialState);
      setSimulationHistory([initialState]);
      setStepIndex(0);
      setIsRunningStepWise(true);
      return;
    }

    if (!currentConfiguration) return;

    const step = config.simulator.step(
      currentConfiguration,
      inputString,
      stepIndex,
      nodes,
      finiteNodes
    );

    setCurrentConfiguration(step.newState);
    setStepIndex(prev => prev + 1);
    setSimulationHistory(prev => [...prev, step.newState]);

    if (step.finished) {
      setValidationResult(step.accepted ? 'Accepted' : 'Rejected');
      setIsRunningStepWise(false);
    }
  }, [
    nodes,
    inputString,
    finiteNodes,
    isRunningStepWise,
    stepIndex,
    currentConfiguration,
    config.simulator
  ]);

  const handleReset = useCallback(() => {
    resetSimulation();
    setValidationResult(null);
  }, [resetSimulation]);

  // VALIDATION
  const handleValidate = useCallback(() => {
    const result: ValidationResult = config.serializer.validate(nodes, finiteNodes);
    setValidationResult(result.isValid ? 'Valid automaton' : result.message);
  }, [nodes, finiteNodes, config.serializer]);

  // SAVE / LOAD
  const loadFromJSON = useCallback((jsonString: string) => {
    try {
      const result = config.serializer.deserialize(jsonString);
      if (result) {
        setNodes(result.nodes);
        setFiniteNodes(new Set(result.finalStates));
        resetSimulation();
        setValidationResult('Loaded successfully');
      } else {
        setValidationResult('Invalid JSON');
      }
    } catch (err) {
      setValidationResult(`Load error: ${String(err)}`);
    }
  }, [config.serializer, resetSimulation]);

  const saveToJSON = useCallback(() => {
    try {
      return config.serializer.serialize(nodes, finiteNodes);
    } catch (err) {
      setValidationResult(`Save error: ${String(err)}`);
      return null;
    }
  }, [nodes, finiteNodes, config.serializer]);

  const handleSave = useCallback(() => {
    const json = saveToJSON();
    if (json) {
      console.log('Saved automaton:', json);
      setValidationResult('Saved successfully');
    }
  }, [saveToJSON]);

  return {
    // State
    nodes,
    setNodes,
    selectedNode,
    setSelectedNode,
    finiteNodes,
    setFiniteNodes,
    inputString,
    setInputString,
    validationResult,
    setValidationResult,
    stageProps,
    setStageProps,
    showGrid,
    isRunning,
    isRunningStepWise,
    currentConfiguration,
    stepIndex,
    simulationHistory,
    highlightedNodes,
    highlightedTransitions,
    isLoggedIn,
    isProblemMode,

    // Handlers
    handleAddNode,
    handleNodeSelect,
    handleNodeDrag,
    handleSetFinite,
    handleCanvasClick,
    handleToggleGrid,
    handleClearCanvas,
    handleRun,
    handleStep,
    handleReset,
    handleValidate,
    loadFromJSON,
    saveToJSON,
    handleSave,
    resetSimulation
  };
}

export default useAutomataSimulator;
