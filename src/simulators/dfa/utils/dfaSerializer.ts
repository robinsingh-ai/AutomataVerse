import { Node, DFAState } from '../type';

export interface SerializedDFA {
  nodes: Node[];
  finalStates: string[];
}

/**
 * Serializes the DFA state to a JSON string
 */
export const serializeDFA = (nodes: Node[], finalStates: Set<string>): string => {
  const serialized: SerializedDFA = {
    nodes,
    finalStates: Array.from(finalStates)
  };
  
  return JSON.stringify(serialized);
};

/**
 * Validates if a DFA meets all formal requirements
 */
export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export const validateDFA = (nodes: Node[], finalStates: Set<string>): ValidationResult => {
  // 1. Check if there are any states defined
  if (nodes.length === 0) {
    return {
      isValid: false,
      errorMessage: "Error: DFA must have at least one state"
    };
  }

  // 2. Check if there's at least one accepting state
  if (finalStates.size === 0) {
    return {
      isValid: false,
      errorMessage: "Error: DFA must have at least one accepting state"
    };
  }

  // 3. Create a set of all state IDs for validation
  const stateIds = new Set(nodes.map(node => node.id));
  
  // 4. Check if all final states exist in the set of states
  for (const finalState of finalStates) {
    if (!stateIds.has(finalState)) {
      return {
        isValid: false,
        errorMessage: `Error: Final state '${finalState}' is not defined in the set of states`
      };
    }
  }

  // 5. Initial state (q0) must exist
  if (!stateIds.has('q0')) {
    return {
      isValid: false,
      errorMessage: "Error: Initial state 'q0' is required"
    };
  }

  // 6. Check if all target states exist 
  for (const node of nodes) {
    // Get all input symbols from this state's transitions
    const inputSymbols = new Set<string>();
    
    for (const transition of node.transitions) {
      if (!stateIds.has(transition.targetid)) {
        return {
          isValid: false,
          errorMessage: `Error: Transition from '${node.id}' points to non-existent state '${transition.targetid}'`
        };
      }
      
      // Check for determinism - no duplicate input symbols
      if (inputSymbols.has(transition.label)) {
        return {
          isValid: false,
          errorMessage: `Error: Non-deterministic transition in state '${node.id}' for input symbol '${transition.label}'`
        };
      }
      
      // Add this input symbol to the set
      inputSymbols.add(transition.label);
    }
  }
  
  return { isValid: true };
};

/**
 * Deserializes a JSON string to DFA state
 */
export const deserializeDFA = (json: string): SerializedDFA | null => {
  try {
    const parsed = JSON.parse(json) as SerializedDFA;
    
    // Validate the structure
    if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.finalStates)) {
      console.error('Invalid DFA format: nodes and finalStates must be arrays');
      return null;
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
            typeof transition.label !== 'string') {
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
    console.error('Error parsing DFA JSON:', error);
    return null;
  }
};

/**
 * Encodes DFA state for URL
 */
export const encodeDFAForURL = (nodes: Node[], finalStates: Set<string>): string => {
  const serialized = serializeDFA(nodes, finalStates);
  return encodeURIComponent(serialized);
};

/**
 * Decodes DFA state from URL
 */
export const decodeDFAFromURL = (encodedDFA: string): SerializedDFA | null => {
  try {
    const decodedJson = decodeURIComponent(encodedDFA);
    return deserializeDFA(decodedJson);
  } catch (error) {
    console.error('Error decoding DFA from URL:', error);
    return null;
  }
};

/**
 * Gets the next DFA configuration
 */
export const getNextConfiguration = (
  currentConfig: DFAState,
  nodes: Node[],
  nodeMap: Record<string, Node>
): DFAState | null => {
  const currentNode = nodeMap[currentConfig.stateId];
  
  if (!currentNode) {
    return null;
  }
  
  // Check if we've reached the end of the input
  if (currentConfig.inputPosition >= currentConfig.inputString.length) {
    return {
      ...currentConfig,
      halted: true,
      accepted: false // This will be updated later based on whether the state is accepting
    };
  }
  
  // Get the current input symbol
  const inputSymbol = currentConfig.inputString[currentConfig.inputPosition];
  
  // Find the transition for this input symbol
  const transition = currentNode.transitions.find(t => t.label === inputSymbol);
  
  // If no transition exists for this input symbol, the DFA rejects
  if (!transition) {
    return {
      ...currentConfig,
      halted: true,
      accepted: false
    };
  }
  
  // Return the next configuration
  return {
    stateId: transition.targetid,
    inputString: currentConfig.inputString,
    inputPosition: currentConfig.inputPosition + 1,
    halted: false,
    accepted: false
  };
};

/**
 * Determines if a DFA accepts an input string
 */
export const simulateDFA = (
  nodes: Node[],
  nodeMap: Record<string, Node>,
  finalStates: Set<string>,
  inputString: string
): {accepted: boolean, stateId: string | null} => {
  // Start with initial configuration
  let currentConfig: DFAState = {
    stateId: 'q0',
    inputString,
    inputPosition: 0,
    halted: false,
    accepted: false
  };
  
  // Process each input symbol
  while (!currentConfig.halted) {
    const nextConfig = getNextConfiguration(currentConfig, nodes, nodeMap);
    
    if (!nextConfig) {
      return { accepted: false, stateId: null };
    }
    
    currentConfig = nextConfig;
    
    // If we've reached the end of the input, check if we're in an accepting state
    if (currentConfig.inputPosition >= inputString.length) {
      currentConfig.halted = true;
      currentConfig.accepted = finalStates.has(currentConfig.stateId);
      break;
    }
  }
  
  return { 
    accepted: currentConfig.accepted, 
    stateId: currentConfig.stateId 
  };
};

/**
 * Batch tests a DFA against multiple test cases
 * @param nodes The DFA nodes
 * @param nodeMap The node map for quick lookups
 * @param finalStates The set of accepting states
 * @param acceptStrings Array of strings that should be accepted
 * @param rejectStrings Array of strings that should be rejected
 * @returns An object with the test results and details
 */
export const batchTestDFA = (
  nodes: Node[],
  nodeMap: Record<string, Node>,
  finalStates: Set<string>,
  acceptStrings: string[],
  rejectStrings: string[]
): {
  passed: boolean;
  acceptResults: {string: string; accepted: boolean; expected: boolean}[];
  rejectResults: {string: string; accepted: boolean; expected: boolean}[];
  summary: string;
} => {
  const acceptResults = acceptStrings.map(str => {
    const result = simulateDFA(nodes, nodeMap, finalStates, str);
    return {
      string: str,
      accepted: result.accepted,
      expected: true
    };
  });
  
  const rejectResults = rejectStrings.map(str => {
    const result = simulateDFA(nodes, nodeMap, finalStates, str);
    return {
      string: str,
      accepted: result.accepted,
      expected: false
    };
  });
  
  // Check if all tests passed
  const allAcceptPassed = acceptResults.every(result => result.accepted === result.expected);
  const allRejectPassed = rejectResults.every(result => result.accepted === result.expected);
  const passed = allAcceptPassed && allRejectPassed;
  
  // Generate summary
  let summary = passed
    ? `All tests passed! (${acceptStrings.length} accepted, ${rejectStrings.length} rejected)`
    : `Some tests failed.`;
    
  if (!allAcceptPassed) {
    const failedAccept = acceptResults.filter(r => !r.accepted).map(r => r.string);
    summary += ` Failed to accept: ${failedAccept.join(', ')}`;
  }
  
  if (!allRejectPassed) {
    const failedReject = rejectResults.filter(r => r.accepted).map(r => r.string);
    summary += ` Failed to reject: ${failedReject.join(', ')}`;
  }
  
  return {
    passed,
    acceptResults,
    rejectResults,
    summary
  };
};