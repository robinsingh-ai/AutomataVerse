import { Node } from '../type';

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
 * Returns an error message if invalid, or null if valid
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

  // 5. Collect all input symbols used in transitions
  const alphabet = new Set<string>();
  nodes.forEach(node => {
    node.transitions.forEach(transition => {
      transition.label.split(',').forEach(symbol => {
        if (symbol.trim()) {
          alphabet.add(symbol.trim());
        }
      });
    });
  });

  // 6. Check for determinism - each (state, symbol) pair should have exactly one target
  const transitionMap = new Map<string, Set<string>>();
  
  for (const node of nodes) {
    // First, check if all target states exist
    for (const transition of node.transitions) {
      if (!stateIds.has(transition.targetid)) {
        return {
          isValid: false,
          errorMessage: `Error: Transition from '${node.id}' points to non-existent state '${transition.targetid}'`
        };
      }
      
      // Then check for determinism
      const symbols = transition.label.split(',').filter(s => s.trim());
      for (const symbol of symbols) {
        const key = `${node.id},${symbol}`;
        if (!transitionMap.has(key)) {
          transitionMap.set(key, new Set<string>());
        }
        transitionMap.get(key)?.add(transition.targetid);
      }
    }
  }
  
  // Check if any (state, symbol) pair leads to multiple states (non-determinism)
  for (const [key, targets] of transitionMap.entries()) {
    if (targets.size > 1) {
      const [state, symbol] = key.split(',');
      return {
        isValid: false,
        errorMessage: `Error: Non-deterministic transition detected - state '${state}' has multiple transitions for input '${symbol}'`
      };
    }
  }
  
  // 7. Check if all states have transitions for all symbols in the alphabet
  // We keep this commented out during the guided tour to allow partially built DFAs
  /*
  for (const node of nodes) {
    const stateTransitions = new Set<string>();
    node.transitions.forEach(transition => {
      transition.label.split(',').forEach(symbol => {
        if (symbol.trim()) {
          stateTransitions.add(symbol.trim());
        }
      });
    });
    
    for (const symbol of alphabet) {
      if (!stateTransitions.has(symbol)) {
        return {
          isValid: false,
          errorMessage: `Error: Missing transition - state '${node.id}' has no transition for input '${symbol}'`
        };
      }
    }
  }
  */
  
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