import { Node, FSMState, Transition, MachineType } from '../type';

export interface SerializedFSM {
  nodes: Node[];
  finalStates: string[];
  machineType: MachineType;
}

/**
 * Serializes the FSM (Moore or Mealy) state to a JSON string
 */
export const serializeFSM = (nodes: Node[], finalStates: Set<string>, machineType: MachineType): string => {
  const serialized: SerializedFSM = {
    nodes,
    finalStates: Array.from(finalStates),
    machineType
  };
  
  return JSON.stringify(serialized);
};

/**
 * Validates if a FSM meets all formal requirements
 */
export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export const validateFSM = (nodes: Node[], finalStates: Set<string>, machineType: MachineType): ValidationResult => {
  // 1. Check if there are any states defined
  if (nodes.length === 0) {
    return {
      isValid: false,
      errorMessage: `Error: ${machineType} Machine must have at least one state`
    };
  }

  // 2. Create a set of all state IDs for validation
  const stateIds = new Set(nodes.map(node => node.id));
  
  // 3. Check if all final states exist in the set of states
  for (const finalState of finalStates) {
    if (!stateIds.has(finalState)) {
      return {
        isValid: false,
        errorMessage: `Error: Final state '${finalState}' is not defined in the set of states`
      };
    }
  }

  // 4. Initial state (q0) must exist
  if (!stateIds.has('q0')) {
    return {
      isValid: false,
      errorMessage: "Error: Initial state 'q0' is required"
    };
  }

  // 5. Check if all target states exist
  for (const node of nodes) {
    for (const transition of node.transitions) {
      if (!stateIds.has(transition.targetid)) {
        return {
          isValid: false,
          errorMessage: `Error: Transition from '${node.id}' points to non-existent state '${transition.targetid}'`
        };
      }
    }
  }
  
  // 6. Check for determinism - no duplicate input symbols from a state
  for (const node of nodes) {
    const inputSymbols = new Set<string>();
    
    for (const transition of node.transitions) {
      if (inputSymbols.has(transition.inputSymbol)) {
        return {
          isValid: false,
          errorMessage: `Error: Non-deterministic transition in state '${node.id}' for input '${transition.inputSymbol}'`
        };
      }
      
      inputSymbols.add(transition.inputSymbol);
    }
  }

  // 7. For Moore machines, each state should have an output
  if (machineType === 'Moore') {
    for (const node of nodes) {
      if (node.output === undefined || node.output === null) {
        return {
          isValid: false,
          errorMessage: `Error: State '${node.id}' is missing an output (required for Moore machines)`
        };
      }
    }
  }

  // 8. For Mealy machines, each transition should have an output
  if (machineType === 'Mealy') {
    for (const node of nodes) {
      for (const transition of node.transitions) {
        if (transition.outputSymbol === undefined || transition.outputSymbol === null) {
          return {
            isValid: false,
            errorMessage: `Error: Transition from '${node.id}' with input '${transition.inputSymbol}' is missing an output (required for Mealy machines)`
          };
        }
      }
    }
  }
  
  return { isValid: true };
};

/**
 * Deserializes a JSON string to FSM state
 */
export const deserializeFSM = (json: string): SerializedFSM | null => {
  try {
    const parsed = JSON.parse(json) as SerializedFSM;
    
    // Validate the structure
    if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.finalStates)) {
      console.error('Invalid FSM format: nodes and finalStates must be arrays');
      return null;
    }
    
    // Validate machine type
    if (parsed.machineType !== 'Moore' && parsed.machineType !== 'Mealy') {
      console.error('Invalid machineType:', parsed.machineType);
      // Default to Moore for backwards compatibility
      parsed.machineType = 'Moore';
    }
    
    // Validate each node
    for (const node of parsed.nodes) {
      if (typeof node.id !== 'string' || 
          typeof node.x !== 'number' || 
          typeof node.y !== 'number' || 
          !Array.isArray(node.transitions)) {
        console.error('Invalid node format', node);
        return null;
      }
      
      // Validate transitions
      for (const transition of node.transitions) {
        if (typeof transition.targetid !== 'string' || 
            typeof transition.inputSymbol !== 'string') {
          console.error('Invalid transition format', transition);
          return null;
        }
      }
    }
    
    // Validate finalStates
    for (const stateId of parsed.finalStates) {
      if (typeof stateId !== 'string') {
        console.error('Invalid final state format', stateId);
        return null;
      }
    }
    
    return parsed;
  } catch (error) {
    console.error('Error parsing FSM JSON:', error);
    return null;
  }
};

/**
 * Encodes FSM state for URL
 */
export const encodeFSMForURL = (nodes: Node[], finalStates: Set<string>, machineType: MachineType): string => {
  const serialized = serializeFSM(nodes, finalStates, machineType);
  return encodeURIComponent(serialized);
};

/**
 * Decodes FSM state from URL
 */
export const decodeFSMFromURL = (encodedMachine: string): SerializedFSM | null => {
  try {
    const decodedJson = decodeURIComponent(encodedMachine);
    return deserializeFSM(decodedJson);
  } catch (error) {
    console.error('Error decoding FSM from URL:', error);
    return null;
  }
};

/**
 * Gets the next FSM configuration based on machine type
 */
export const getNextConfiguration = (
  currentConfig: FSMState,
  nodes: Node[],
  nodeMap: Record<string, Node>,
  machineType: MachineType
): FSMState | null => {
  const currentNode = nodeMap[currentConfig.stateId];
  
  if (!currentNode) {
    return null;
  }
  
  // If we've processed all input, machine halts
  if (currentConfig.inputIndex >= currentConfig.currentInput.length) {
    return {
      ...currentConfig,
      halted: true
    };
  }
  
  // Get current input symbol
  const currentSymbol = currentConfig.currentInput[currentConfig.inputIndex];
  
  // Find the valid transition for this input symbol
  const transition = currentNode.transitions.find(t => t.inputSymbol === currentSymbol);
  
  if (!transition) {
    // No transition found for this input, machine halts
    return {
      ...currentConfig,
      halted: true
    };
  }
  
  // Get the target state
  const targetNode = nodeMap[transition.targetid];
  
  if (!targetNode) {
    return null;
  }
  
  // Update output sequence based on machine type
  let newOutputSequence = [...currentConfig.outputSequence];
  
  if (machineType === 'Moore') {
    // In Moore machines, output is tied to the target state
    newOutputSequence.push(targetNode.output || '');
  } else {
    // In Mealy machines, output is tied to the transition
    newOutputSequence.push(transition.outputSymbol || '');
  }
  
  // Move to next input symbol
  return {
    stateId: transition.targetid,
    currentInput: currentConfig.currentInput,
    inputIndex: currentConfig.inputIndex + 1,
    outputSequence: newOutputSequence,
    halted: false
  };
};