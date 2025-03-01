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