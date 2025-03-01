import { Node, PDAState } from '../type';

export interface SerializedPDA {
  nodes: Node[];
  finalStates: string[];
}

/**
 * Serializes the PDA state to a JSON string
 */
export const serializePDA = (nodes: Node[], finalStates: Set<string>): string => {
  const serialized: SerializedPDA = {
    nodes,
    finalStates: Array.from(finalStates)
  };
  
  return JSON.stringify(serialized);
};

/**
 * Validates if a PDA meets all formal requirements
 */
export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export const validatePDA = (nodes: Node[], finalStates: Set<string>): ValidationResult => {
  // 1. Check if there are any states defined
  if (nodes.length === 0) {
    return {
      isValid: false,
      errorMessage: "Error: PDA must have at least one state"
    };
  }

  // 2. Check if there's at least one accepting state
  if (finalStates.size === 0) {
    return {
      isValid: false,
      errorMessage: "Error: PDA must have at least one accepting state"
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
      
      // 6. Validate transition format
      // Each transition should have the format: inputSymbol,popSymbol,pushSymbol
      const parts = transition.label.split(',');
      if (parts.length !== 3) {
        return {
          isValid: false,
          errorMessage: `Error: Invalid transition format '${transition.label}' from state '${node.id}'. 
                         Format should be 'inputSymbol,popSymbol,pushSymbol'`
        };
      }
    }
  }
  
  return { isValid: true };
};

/**
 * Deserializes a JSON string to PDA state
 */
export const deserializePDA = (json: string): SerializedPDA | null => {
  try {
    const parsed = JSON.parse(json) as SerializedPDA;
    
    // Validate the structure
    if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.finalStates)) {
      console.error('Invalid PDA format: nodes and finalStates must be arrays');
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
    console.error('Error parsing PDA JSON:', error);
    return null;
  }
};

/**
 * Encodes PDA state for URL
 */
export const encodePDAForURL = (nodes: Node[], finalStates: Set<string>): string => {
  const serialized = serializePDA(nodes, finalStates);
  return encodeURIComponent(serialized);
};

/**
 * Decodes PDA state from URL
 */
export const decodePDAFromURL = (encodedPDA: string): SerializedPDA | null => {
  try {
    const decodedJson = decodeURIComponent(encodedPDA);
    return deserializePDA(decodedJson);
  } catch (error) {
    console.error('Error decoding PDA from URL:', error);
    return null;
  }
};

/**
 * Checks if a transition can be taken given the current input and stack symbols
 */
export const canTakeTransition = (
  transition: string,
  currentSymbol: string | null,
  stackTop: string | null
): boolean => {
  const [inputSymbol, popSymbol] = transition.split(',');
  
  // Check if the input symbol matches (or is epsilon)
  const inputMatches = inputSymbol === 'ε' || inputSymbol === '' || inputSymbol === currentSymbol;
  
  // Check if the stack symbol matches
  const stackMatches = popSymbol === 'ε' || popSymbol === '' || popSymbol === stackTop;
  
  return inputMatches && stackMatches;
};

/**
 * Applies a transition to the PDA configuration
 */
export const applyTransition = (
  currentState: PDAState,
  transition: string,
  targetStateId: string
): PDAState => {
  const [inputSymbol, popSymbol, pushSymbols] = transition.split(',');
  const newStack = [...currentState.stackContent];
  
  // Perform stack operations
  // 1. Pop the top symbol if needed
  if (popSymbol !== 'ε' && popSymbol !== '') {
    if (newStack.length > 0 && newStack[newStack.length - 1] === popSymbol) {
      newStack.pop();
    }
  }
  
  // 2. Push new symbols to the stack (if any)
  if (pushSymbols !== 'ε' && pushSymbols !== '') {
    // Push symbols in reverse order so the first one ends up on top
    for (let i = pushSymbols.length - 1; i >= 0; i--) {
      newStack.push(pushSymbols[i]);
    }
  }
  
  // 3. Advance input position if an input symbol was consumed
  const newInputPosition = inputSymbol !== 'ε' && inputSymbol !== '' 
    ? currentState.inputPosition + 1 
    : currentState.inputPosition;
  
  return {
    stateId: targetStateId,
    stackContent: newStack,
    inputPosition: newInputPosition
  };
};

/**
 * Get all possible next PDA configurations from a set of current configurations
 */
export const getNextConfigurations = (
  currentConfigs: PDAState[],
  inputString: string,
  nodes: Node[],
  nodeMap: Record<string, Node>,
  epsilonOnly: boolean = false
): PDAState[] => {
  const nextConfigs: PDAState[] = [];
  
  for (const config of currentConfigs) {
    const state = nodeMap[config.stateId];
    const currentSymbol = config.inputPosition < inputString.length 
      ? inputString[config.inputPosition] 
      : null;
    const stackTop = config.stackContent.length > 0 
      ? config.stackContent[config.stackContent.length - 1] 
      : 'Z';  // Z represents the empty stack
    
    if (state) {
      for (const transition of state.transitions) {
        const [inputSymbol] = transition.label.split(',');
        
        // If we're only looking for epsilon transitions, skip non-epsilon transitions
        if (epsilonOnly && inputSymbol !== 'ε') {
          continue;
        }
        
        // If not epsilon-only mode, handle normal transitions
        if (!epsilonOnly && inputSymbol !== 'ε' && currentSymbol === null) {
          continue; // Skip non-epsilon transitions when no input is left
        }
        
        // Check if this transition can be taken
        if (canTakeTransition(transition.label, currentSymbol, stackTop)) {
          // Apply the transition to get a new configuration
          const newConfig = applyTransition(config, transition.label, transition.targetid);
          nextConfigs.push(newConfig);
        }
      }
    }
  }
  
  return nextConfigs;
};
  
