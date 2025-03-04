import { Node, TMState, Tape, TapeMode, Direction, Transition } from '../type';

export interface SerializedTM {
  nodes: Node[];
  finalStates: string[];
  tapeMode: TapeMode;
}

/**
 * Serializes the TM state to a JSON string
 */
export const serializeTM = (nodes: Node[], finalStates: Set<string>, tapeMode: TapeMode): string => {
  const serialized: SerializedTM = {
    nodes,
    finalStates: Array.from(finalStates),
    tapeMode
  };
  
  return JSON.stringify(serialized);
};

/**
 * Validates if a TM meets all formal requirements
 */
export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export const validateTM = (nodes: Node[], finalStates: Set<string>, tapeMode: TapeMode): ValidationResult => {
  // 1. Check if there are any states defined
  if (nodes.length === 0) {
    return {
      isValid: false,
      errorMessage: "Error: TM must have at least one state"
    };
  }

  // 2. Check if there's at least one accepting state
  if (finalStates.size === 0) {
    return {
      isValid: false,
      errorMessage: "Error: TM must have at least one accepting state"
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

  // 6. Check if all target states exist and transition format is valid
  const numTapes = tapeMode === '1-tape' ? 1 : tapeMode === '2-tape' ? 2 : 3;
  
  for (const node of nodes) {
    for (const transition of node.transitions) {
      if (!stateIds.has(transition.targetid)) {
        return {
          isValid: false,
          errorMessage: `Error: Transition from '${node.id}' points to non-existent state '${transition.targetid}'`
        };
      }
      
      // Validate transition format for multi-tape TM
      const tapeParts = transition.label.split(';');
      
      if (tapeParts.length !== numTapes) {
        return {
          isValid: false,
          errorMessage: `Error: Transition from '${node.id}' has ${tapeParts.length} tape operations, but ${tapeMode} requires ${numTapes}`
        };
      }
      
      for (const tapePart of tapeParts) {
        const parts = tapePart.split(',');
        
        if (parts.length !== 3) {
          return {
            isValid: false,
            errorMessage: `Error: Invalid transition format '${tapePart}' from state '${node.id}'. 
                         Format should be 'read,write,direction'`
          };
        }
        
        // Validate direction
        const direction = parts[2];
        if (direction !== 'L' && direction !== 'R' && direction !== 'S') {
          return {
            isValid: false,
            errorMessage: `Error: Invalid direction '${direction}' in transition from '${node.id}'. Must be 'L', 'R', or 'S'`
          };
        }
      }
    }
  }
  
  // 7. Check for determinism - no duplicate (state, symbol) combinations
  for (const node of nodes) {
    const readCombinations = new Map<string, boolean>();
    
    for (const transition of node.transitions) {
      const readSymbols = transition.label.split(';').map(part => part.split(',')[0]).join(';');
      
      if (readCombinations.has(readSymbols)) {
        return {
          isValid: false,
          errorMessage: `Error: Non-deterministic transition in state '${node.id}' for symbols '${readSymbols}'`
        };
      }
      
      readCombinations.set(readSymbols, true);
    }
  }
  
  return { isValid: true };
};

/**
 * Deserializes a JSON string to TM state
 */
export const deserializeTM = (json: string): SerializedTM | null => {
  try {
    const parsed = JSON.parse(json) as SerializedTM;
    
    // Validate the structure
    if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.finalStates)) {
      console.error('Invalid TM format: nodes and finalStates must be arrays');
      return null;
    }
    
    // Validate tapeMode if present
    if (parsed.tapeMode && 
        parsed.tapeMode !== '1-tape' && 
        parsed.tapeMode !== '2-tape' && 
        parsed.tapeMode !== '3-tape') {
      console.error('Invalid tapeMode:', parsed.tapeMode);
      return null;
    }
    
    // Default to 1-tape if not specified
    if (!parsed.tapeMode) {
      parsed.tapeMode = '1-tape';
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
    console.error('Error parsing TM JSON:', error);
    return null;
  }
};

/**
 * Encodes TM state for URL
 */
export const encodeTMForURL = (nodes: Node[], finalStates: Set<string>, tapeMode: TapeMode): string => {
  const serialized = serializeTM(nodes, finalStates, tapeMode);
  return encodeURIComponent(serialized);
};

/**
 * Decodes TM state from URL
 */
export const decodeTMFromURL = (encodedTM: string): SerializedTM | null => {
  try {
    const decodedJson = decodeURIComponent(encodedTM);
    return deserializeTM(decodedJson);
  } catch (error) {
    console.error('Error decoding TM from URL:', error);
    return null;
  }
};

/**
 * Gets the symbol at the current head position on a tape
 */
export const getCurrentSymbol = (tape: Tape): string => {
  return tape.content.get(tape.headPosition) || '□'; // Return blank symbol if nothing at position
};

/**
 * Checks if a transition can be taken given the current tape contents
 */
export const canTakeTransition = (
  transition: string,
  tapes: Tape[]
): boolean => {
  const tapeOperations = transition.split(';');
  
  if (tapeOperations.length !== tapes.length) {
    return false;
  }
  
  for (let i = 0; i < tapes.length; i++) {
    const [readSymbol] = tapeOperations[i].split(',');
    const currentSymbol = getCurrentSymbol(tapes[i]);
    
    if (readSymbol !== currentSymbol) {
      return false;
    }
  }
  
  return true;
};

/**
 * Applies a transition to a tape
 */
export const applyTapeTransition = (
  tape: Tape,
  operation: string
): Tape => {
  const [_, writeSymbol, moveDirection] = operation.split(',');
  const newTape: Tape = {
    content: new Map(tape.content),
    headPosition: tape.headPosition
  };
  
  // Write the symbol
  if (writeSymbol === '□') {
    // If writing blank, remove the symbol (if any)
    newTape.content.delete(tape.headPosition);
  } else {
    newTape.content.set(tape.headPosition, writeSymbol);
  }
  
  // Move the head
  if (moveDirection === 'L') {
    newTape.headPosition--;
  } else if (moveDirection === 'R') {
    newTape.headPosition++;
  }
  // For 'S', don't move the head
  
  return newTape;
};

/**
 * Applies a transition to the TM configuration
 */
export const applyTransition = (
  currentState: TMState,
  transition: string,
  targetStateId: string
): TMState => {
  const tapeOperations = transition.split(';');
  const newTapes: Tape[] = [];
  
  // Apply operation to each tape
  for (let i = 0; i < currentState.tapes.length; i++) {
    newTapes.push(applyTapeTransition(currentState.tapes[i], tapeOperations[i]));
  }
  
  return {
    stateId: targetStateId,
    tapes: newTapes,
    halted: false,
    accepted: false
  };
};

/**
 * Gets the next TM configuration
 */
export const getNextConfiguration = (
  currentConfig: TMState,
  nodes: Node[],
  nodeMap: Record<string, Node>,
  specificTransition?: Transition
): TMState | null => {
  const currentNode = nodeMap[currentConfig.stateId];
  
  if (!currentNode) {
    return null;
  }
  
  // If a specific transition is provided, use it
  if (specificTransition) {
    if (canTakeTransition(specificTransition.label, currentConfig.tapes)) {
      return applyTransition(
        currentConfig,
        specificTransition.label,
        specificTransition.targetid
      );
    }
    return null;
  }
  
  // Find the valid transition
  for (const transition of currentNode.transitions) {
    if (canTakeTransition(transition.label, currentConfig.tapes)) {
      return applyTransition(
        currentConfig,
        transition.label,
        transition.targetid
      );
    }
  }
  
  // No valid transition found, machine halts
  return {
    ...currentConfig,
    halted: true,
    accepted: false
  };
};