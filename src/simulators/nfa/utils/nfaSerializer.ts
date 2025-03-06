import { Node, NFAState } from '../type';

export interface SerializedNFA {
  nodes: Node[];
  finalStates: string[];
  allowEpsilon: boolean; // Indicates if ε-transitions are allowed
}

/**
 * Serializes the NFA state to a JSON string
 */
export const serializeNFA = (nodes: Node[], finalStates: Set<string>, allowEpsilon: boolean): string => {
  const serialized: SerializedNFA = {
    nodes,
    finalStates: Array.from(finalStates),
    allowEpsilon
  };
  
  return JSON.stringify(serialized);
};

/**
 * Validates if an NFA meets all formal requirements
 */
export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export const validateNFA = (nodes: Node[], finalStates: Set<string>, allowEpsilon: boolean): ValidationResult => {
  // 1. Check if there are any states defined
  if (nodes.length === 0) {
    return {
      isValid: false,
      errorMessage: "Error: NFA must have at least one state"
    };
  }

  // 2. Check if there's at least one accepting state
  if (finalStates.size === 0) {
    return {
      isValid: false,
      errorMessage: "Error: NFA must have at least one accepting state"
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

  // 6. Check if all target states exist and validate epsilon transitions
  for (const node of nodes) {
    for (const transition of node.transitions) {
      // Validate target state exists
      if (!stateIds.has(transition.targetid)) {
        return {
          isValid: false,
          errorMessage: `Error: Transition from '${node.id}' points to non-existent state '${transition.targetid}'`
        };
      }
      
      // Validate epsilon transitions are allowed if used
      if (transition.label === 'ε' && !allowEpsilon) {
        return {
          isValid: false,
          errorMessage: `Error: Epsilon transition used in state '${node.id}' but epsilon transitions are not allowed in this automaton`
        };
      }
    }
  }
  
  return { isValid: true };
};

/**
 * Deserializes a JSON string to NFA state
 */
export const deserializeNFA = (json: string): SerializedNFA | null => {
  try {
    const parsed = JSON.parse(json) as SerializedNFA;
    
    // Validate the structure
    if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.finalStates)) {
      console.error('Invalid NFA format: nodes and finalStates must be arrays');
      return null;
    }
    
    // Set allowEpsilon to false if not defined (for backward compatibility)
    if (parsed.allowEpsilon === undefined) {
      parsed.allowEpsilon = false;
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
    console.error('Error parsing NFA JSON:', error);
    return null;
  }
};

/**
 * Encodes NFA state for URL
 */
export const encodeNFAForURL = (nodes: Node[], finalStates: Set<string>, allowEpsilon: boolean): string => {
  const serialized = serializeNFA(nodes, finalStates, allowEpsilon);
  return encodeURIComponent(serialized);
};

/**
 * Decodes NFA state from URL
 */
export const decodeNFAFromURL = (encodedNFA: string): SerializedNFA | null => {
  try {
    const decodedJson = decodeURIComponent(encodedNFA);
    return deserializeNFA(decodedJson);
  } catch (error) {
    console.error('Error decoding NFA from URL:', error);
    return null;
  }
};

/**
 * Computes the epsilon closure for a given set of states
 * Returns all states reachable through epsilon transitions
 */
export const computeEpsilonClosure = (
  startingStates: Set<string>,
  nodes: Node[],
  nodeMap: Record<string, Node>
): Set<string> => {
  const closure = new Set<string>(startingStates);
  const stateQueue = Array.from(startingStates);
  
  while (stateQueue.length > 0) {
    const currentState = stateQueue.shift()!;
    const currentNode = nodeMap[currentState];
    
    if (!currentNode) continue;
    
    // Find all epsilon transitions from this state
    for (const transition of currentNode.transitions) {
      if (transition.label === 'ε' && !closure.has(transition.targetid)) {
        closure.add(transition.targetid);
        stateQueue.push(transition.targetid);
      }
    }
  }
  
  return closure;
};

/**
 * Gets the next NFA configuration
 */
export const getNextConfiguration = (
  currentConfig: NFAState,
  nodes: Node[],
  nodeMap: Record<string, Node>,
  allowEpsilon: boolean
): NFAState | null => {
  // Check if we've reached the end of the input
  if (currentConfig.inputPosition >= currentConfig.inputString.length) {
    return {
      ...currentConfig,
      halted: true,
      accepted: false // This will be updated based on accepting states
    };
  }
  
  // Get the current input symbol
  const inputSymbol = currentConfig.inputString[currentConfig.inputPosition];
  
  // First try to move on the current input symbol
  const nextStates = new Set<string>();
  
  // For each current state, find transitions on the current input
  currentConfig.stateIds.forEach(stateId => {
    const currentNode = nodeMap[stateId];
    if (!currentNode) return;
    
    // Look for transitions with the current input symbol
    for (const transition of currentNode.transitions) {
      if (transition.label === inputSymbol) {
        nextStates.add(transition.targetid);
      }
    }
  });
  
  // If we found transitions on the current input, compute epsilon closure if needed
  if (nextStates.size > 0) {
    const nextStatesWithEpsilon = allowEpsilon
      ? computeEpsilonClosure(nextStates, nodes, nodeMap)
      : nextStates;
      
    return {
      stateIds: nextStatesWithEpsilon,
      inputString: currentConfig.inputString,
      inputPosition: currentConfig.inputPosition + 1, // Advance input position
      halted: false,
      accepted: false
    };
  }
  
  // If we didn't find any regular transitions and epsilon transitions are allowed,
  // try taking epsilon transitions
  if (allowEpsilon) {
    const epsilonStates = new Set<string>();
    let foundEpsilonTransition = false;
    
    // For each current state, find epsilon transitions
    currentConfig.stateIds.forEach(stateId => {
      const currentNode = nodeMap[stateId];
      if (!currentNode) return;
      
      for (const transition of currentNode.transitions) {
        if (transition.label === 'ε') {
          epsilonStates.add(transition.targetid);
          foundEpsilonTransition = true;
        }
      }
    });
    
    if (foundEpsilonTransition) {
      // Compute the complete epsilon closure
      const epsilonClosure = computeEpsilonClosure(epsilonStates, nodes, nodeMap);
      
      return {
        stateIds: epsilonClosure,
        inputString: currentConfig.inputString,
        inputPosition: currentConfig.inputPosition, // Don't advance input position for epsilon
        halted: false,
        accepted: false
      };
    }
  }
  
  // If no transitions were found, the machine halts
  return {
    ...currentConfig,
    halted: true,
    accepted: false
  };
};

/**
 * Determines if an NFA accepts an input string
 */
export const simulateNFA = (
  nodes: Node[],
  nodeMap: Record<string, Node>,
  finalStates: Set<string>,
  inputString: string,
  allowEpsilon: boolean
): {accepted: boolean, finalStates: Set<string>} => {
  // Start with initial state q0 and compute its epsilon closure if needed
  let currentStates = new Set<string>(['q0']);
  
  if (allowEpsilon) {
    currentStates = computeEpsilonClosure(currentStates, nodes, nodeMap);
  }
  
  // Process each input symbol
  for (let i = 0; i < inputString.length; i++) {
    const inputSymbol = inputString[i];
    const nextStates = new Set<string>();
    
    // Try to move on the current input symbol first
    currentStates.forEach(stateId => {
      const node = nodeMap[stateId];
      if (!node) return;
      
      node.transitions.forEach(transition => {
        if (transition.label === inputSymbol) {
          nextStates.add(transition.targetid);
        }
      });
    });
    
    // If there are no transitions on the current input symbol, try epsilon transitions
    if (nextStates.size === 0 && allowEpsilon) {
      currentStates.forEach(stateId => {
        const node = nodeMap[stateId];
        if (!node) return;
        
        node.transitions.forEach(transition => {
          if (transition.label === 'ε') {
            nextStates.add(transition.targetid);
          }
        });
      });
      
      // If still no transitions, reject
      if (nextStates.size === 0) {
        return { accepted: false, finalStates: new Set() };
      }
      
      // Don't advance the input position for epsilon transitions
      i--;
    } else if (nextStates.size === 0) {
      // If no transitions and no epsilon transitions are available, reject
      return { accepted: false, finalStates: new Set() };
    }
    
    // Apply epsilon closure to next states if needed
    currentStates = allowEpsilon
      ? computeEpsilonClosure(nextStates, nodes, nodeMap)
      : nextStates;
  }
  
  // Check if any current state is an accepting state
  const reachedAcceptingStates = new Set<string>();
  let accepted = false;
  
  currentStates.forEach(stateId => {
    if (finalStates.has(stateId)) {
      accepted = true;
      reachedAcceptingStates.add(stateId);
    }
  });
  
  return {
    accepted,
    finalStates: reachedAcceptingStates
  };
};