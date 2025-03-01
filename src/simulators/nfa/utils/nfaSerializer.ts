import { Node } from '../type';

export interface SerializedNFA {
  nodes: Node[];
  finalStates: string[];
}

/**
 * Serializes the NFA state to a JSON string
 */
export const serializeNFA = (nodes: Node[], finalStates: Set<string>): string => {
  const serialized: SerializedNFA = {
    nodes,
    finalStates: Array.from(finalStates)
  };
  
  return JSON.stringify(serialized);
};

/**
 * Validates if an NFA meets all formal requirements
 * Returns an error message if invalid, or null if valid
 * NFAs have less strict validation compared to DFAs
 */
export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export const validateNFA = (nodes: Node[], finalStates: Set<string>): ValidationResult => {
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
  
  // 6. Collect all input symbols used in transitions
  const alphabet = new Set<string>();
  nodes.forEach(node => {
    node.transitions.forEach(transition => {
      transition.label.split(',').forEach(symbol => {
        if (symbol.trim() && symbol.trim() !== 'ε') {
          alphabet.add(symbol.trim());
        }
      });
    });
  });
  
  // NFA doesn't require all states to have transitions for all symbols
  // NFA doesn't require determinism (one state per symbol)
  
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
export const encodeNFAForURL = (nodes: Node[], finalStates: Set<string>): string => {
  const serialized = serializeNFA(nodes, finalStates);
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
 * Compute ε-closure for a set of states
 * Returns all states reachable from the given states via ε-transitions
 */
export const computeEpsilonClosure = (
  startStates: Set<string>,
  nodes: Node[],
  nodeMap: Record<string, Node>
): Set<string> => {
  const closure = new Set<string>([...startStates]);
  const queue = [...startStates];
  
  // BFS to find all states reachable via ε-transitions
  while (queue.length > 0) {
    const stateId = queue.shift()!;
    const state = nodeMap[stateId];
    
    if (state) {
      for (const transition of state.transitions) {
        if (transition.label.includes('ε')) {
          const targetId = transition.targetid;
          
          if (!closure.has(targetId)) {
            closure.add(targetId);
            queue.push(targetId);
          }
        }
      }
    }
  }
  
  return closure;
};

/**
 * Find all transitions from the current states on the given symbol
 */
export const getNextStates = (
  currentStates: Set<string>,
  symbol: string,
  nodes: Node[],
  nodeMap: Record<string, Node>
): Set<string> => {
  const nextStates = new Set<string>();
  
  for (const stateId of currentStates) {
    const state = nodeMap[stateId];
    
    if (state) {
      for (const transition of state.transitions) {
        const labels = transition.label.split(',').map(l => l.trim());
        
        if (labels.includes(symbol)) {
          nextStates.add(transition.targetid);
        }
      }
    }
  }
  
  return nextStates;
};