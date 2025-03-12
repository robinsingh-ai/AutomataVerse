import { Node, PDAState, Stack } from '../type';

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

  // 5. Initial state (q0) must exist
  if (!stateIds.has('q0')) {
    return {
      isValid: false,
      errorMessage: "Error: Initial state 'q0' is required"
    };
  }

  // 6. Check if all target states exist and transition format is valid
  for (const node of nodes) {
    for (const transition of node.transitions) {
      if (!stateIds.has(transition.targetid)) {
        return {
          isValid: false,
          errorMessage: `Error: Transition from '${node.id}' points to non-existent state '${transition.targetid}'`
        };
      }
      
      // Validate transition format for PDA: "input,pop,push"
      const parts = transition.label.split(',');
      const [transInput, popSymbol] = parts;
      
      if (transInput === 'ε' || popSymbol === 'ε') {
        continue;
      }
      
      if (parts.length !== 3) {
        return {
          isValid: false,
          errorMessage: `Error: Invalid transition format '${transition.label}' from state '${node.id}'. 
                       Format should be 'input,pop,push'`
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
 * Checks if a transition can be taken given the current input and stack
 */
export const canTakeTransition = (
  transition: Transition,
  inputSymbol: string,
  stack: Stack
): boolean => {
  const [transInput, popSymbol] = transition.label.split(',');
  
  // Check if input matches (or if it's an epsilon transition)
  const inputMatches = transInput === 'ε' || transInput === inputSymbol;
  
  // Check if the stack has the required symbol to pop
  const stackMatches = stack.content.length > 0 && (
    // If popSymbol is ε, we don't need to pop anything
    popSymbol === 'ε' || stack.content[stack.content.length - 1] === popSymbol
  );
  
  return inputMatches && stackMatches;
};

/**
 * Applies a transition to the stack
 */
export const applyStackTransition = (
  stack: Stack,
  operation: string
): Stack => {
  const [, popSymbol, pushSymbols] = operation.split(',');
  const newStack: Stack = {
    content: [...stack.content]
  };
  
  // Pop the symbol if it's not epsilon
  if (popSymbol !== 'ε' && newStack.content.length > 0) {
    newStack.content.pop();
  }
  
  // Push new symbols (if any) - in reverse order since stack is LIFO
  if (pushSymbols !== 'ε') {
    for (let i = pushSymbols.length - 1; i >= 0; i--) {
      newStack.content.push(pushSymbols[i]);
    }
  }
  
  return newStack;
};

/**
 * Applies a transition to the PDA configuration
 */
export const applyTransition = (
  currentState: PDAState,
  transition: Transition
): PDAState => {
  const [inputSymbol] = transition.label.split(',');
  
  // Create new stack by applying the transition
  const newStack = applyStackTransition(currentState.stack, transition.label);
  
  // Advance input position only if not an epsilon transition
  const newPosition = 
    inputSymbol === 'ε' 
      ? currentState.inputPosition 
      : currentState.inputPosition + 1;
  
  return {
    stateId: transition.targetid,
    inputString: currentState.inputString,
    inputPosition: newPosition,
    stack: newStack,
    halted: false,
    accepted: false
  };
};

/**
 * Gets the next PDA configuration
 * Returns all possible next configurations (for non-deterministic PDAs)
 */
export const getNextConfigurations = (
  currentConfig: PDAState,
  nodes: Node[],
  nodeMap: Record<string, Node>,
  finalStates: Set<string>
): PDAState[] => {
  const currentNode = nodeMap[currentConfig.stateId];
  
  if (!currentNode) {
    return [];
  }
  
  const configs: PDAState[] = [];
  const inputSymbol = currentConfig.inputPosition < currentConfig.inputString.length
    ? currentConfig.inputString[currentConfig.inputPosition]
    : '';
  
  // Check all possible transitions
  for (const transition of currentNode.transitions) {
    const [transInput, popSymbol] = transition.label.split(',');
    
    // First check epsilon transitions
    if (transInput === 'ε') {
      if (popSymbol === 'ε' || 
          (currentConfig.stack.content.length > 0 && 
           currentConfig.stack.content[currentConfig.stack.content.length - 1] === popSymbol)) {
        configs.push(applyTransition(currentConfig, transition));
      }
    }
    // Then check transitions that match the current input symbol
    else if (transInput === inputSymbol) {
      if (popSymbol === 'ε' || 
          (currentConfig.stack.content.length > 0 && 
           currentConfig.stack.content[currentConfig.stack.content.length - 1] === popSymbol)) {
        configs.push(applyTransition(currentConfig, transition));
      }
    }
  }
  
  // If no transitions possible and we're at the end of input
  if (configs.length === 0 && currentConfig.inputPosition >= currentConfig.inputString.length) {
    // Return a halted configuration - accepted if in a final state
    return [{
      ...currentConfig,
      halted: true,
      accepted: finalStates.has(currentConfig.stateId)
    }];
  }
  
  return configs;
};

/**
 * Determines if a PDA accepts an input string
 * Uses BFS to handle nondeterminism
 */
export const simulatePDA = (
  nodes: Node[],
  nodeMap: Record<string, Node>,
  finalStates: Set<string>,
  inputString: string,
  initialStack: string[] = ['Z']  // Default initial stack with bottom marker Z
): {accepted: boolean, stateId: string | null} => {
  // Start with initial configuration
  const initialConfig: PDAState = {
    stateId: 'q0',
    inputString,
    inputPosition: 0,
    stack: { content: initialStack },
    halted: false,
    accepted: false
  };
  
  // Queue for BFS
  const queue: PDAState[] = [initialConfig];
  // Set to keep track of visited configurations to avoid cycles
  const visited = new Set<string>();
  
  while (queue.length > 0) {
    const currentConfig = queue.shift()!;
    
    // Generate a string representation of the configuration for checking cycles
    const configStr = `${currentConfig.stateId},${currentConfig.inputPosition},${currentConfig.stack.content.join('')}`;
    
    // Skip if we've already visited this configuration
    if (visited.has(configStr)) continue;
    visited.add(configStr);
    
    // Check if we've consumed all input and are in an accepting state
    if (currentConfig.inputPosition >= inputString.length && finalStates.has(currentConfig.stateId)) {
      return { accepted: true, stateId: currentConfig.stateId };
    }
    
    // Get all possible next configurations
    const nextConfigs = getNextConfigurations(currentConfig, nodes, nodeMap, finalStates);
    queue.push(...nextConfigs);
  }
  
  // If we've exhausted all possibilities without accepting
  return { accepted: false, stateId: null };
};

export interface Transition {
  targetid: string;
  label: string;
}

/**
 * Batch tests a PDA against multiple input strings
 * Returns detailed results for both accept and reject test cases
 */
export const batchTestPDA = (
  nodes: Node[],
  nodeMap: Record<string, Node>,
  finalStates: Set<string>,
  acceptStrings: string[],
  rejectStrings: string[],
  initialStack: string[] = ['Z']
): {
  passed: boolean;
  acceptResults: {string: string; accepted: boolean; expected: boolean}[];
  rejectResults: {string: string; accepted: boolean; expected: boolean}[];
  summary: string;
} => {
  const acceptResults = acceptStrings.map(str => {
    const result = simulatePDA(nodes, nodeMap, finalStates, str, initialStack);
    return {
      string: str,
      accepted: result.accepted,
      expected: true
    };
  });
  
  const rejectResults = rejectStrings.map(str => {
    const result = simulatePDA(nodes, nodeMap, finalStates, str, initialStack);
    return {
      string: str,
      accepted: result.accepted,
      expected: false
    };
  });
  
  // Check if all tests passed
  const allAcceptPassed = acceptResults.every(r => r.accepted);
  const allRejectPassed = rejectResults.every(r => !r.accepted);
  const passed = allAcceptPassed && allRejectPassed;
  
  // Generate summary
  let summary = '';
  if (passed) {
    summary = `All tests passed! Your PDA correctly accepts and rejects all test strings.`;
  } else {
    const acceptFailed = acceptResults.filter(r => !r.accepted).length;
    const rejectFailed = rejectResults.filter(r => r.accepted).length;
    summary = `Tests failed: ${acceptFailed + rejectFailed} out of ${acceptStrings.length + rejectStrings.length} tests failed.`;
    
    if (acceptFailed > 0) {
      summary += ` ${acceptFailed} strings that should be accepted were rejected.`;
    }
    
    if (rejectFailed > 0) {
      summary += ` ${rejectFailed} strings that should be rejected were accepted.`;
    }
  }
  
  return {
    passed,
    acceptResults,
    rejectResults,
    summary
  };
};