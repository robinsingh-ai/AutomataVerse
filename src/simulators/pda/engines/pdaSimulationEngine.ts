import { PDANode, PDATransition } from '../renderers/PDARenderer';

export interface PDAState {
  currentNodeId: string;
  stack: string[];
  inputPosition: number;
  path: string[];
  stackHistory: string[][];
}

export const pdaSimulationEngine = {
  getInitialState: (nodes: PDANode[]): PDAState => {
    const startNode = nodes.find(node => node.id === 'q0') || nodes[0];
    return {
      currentNodeId: startNode?.id || '',
      stack: ['Z'], // Initialize with bottom-of-stack marker
      inputPosition: 0,
      path: [startNode?.id || ''],
      stackHistory: [['Z']]
    };
  },

  getNextConfiguration: (currentState: PDAState, symbol: string, nodes: PDANode[]): PDAState[] => {
    const configurations: PDAState[] = [];
    const currentNode = nodes.find(node => node.id === currentState.currentNodeId);
    
    if (!currentNode) return configurations;

    // Find all applicable transitions
    currentNode.transitions.forEach(transition => {
      const canTakeTransition = 
        (transition.inputSymbol === symbol || transition.inputSymbol === 'ε') &&
        (transition.popSymbol === 'ε' || 
         (currentState.stack.length > 0 && currentState.stack[currentState.stack.length - 1] === transition.popSymbol));

      if (canTakeTransition) {
        const newStack = [...currentState.stack];
        
        // Pop from stack if required
        if (transition.popSymbol !== 'ε' && newStack.length > 0) {
          newStack.pop();
        }
        
        // Push to stack if required
        if (transition.pushSymbol !== 'ε') {
          newStack.push(transition.pushSymbol);
        }

        configurations.push({
          currentNodeId: transition.to,
          stack: newStack,
          inputPosition: transition.inputSymbol === 'ε' ? currentState.inputPosition : currentState.inputPosition + 1,
          path: [...currentState.path, transition.to],
          stackHistory: [...currentState.stackHistory, newStack]
        });
      }
    });

    return configurations;
  },

  isAccepting: (state: PDAState, finalStates: Set<string>): boolean => {
    // PDA can accept by final state or empty stack
    return finalStates.has(state.currentNodeId) || (state.stack.length === 1 && state.stack[0] === 'Z');
  },

  step: (currentState: PDAState, inputString: string, stepIndex: number, nodes: PDANode[], finalStates: Set<string>) => {
    if (stepIndex >= inputString.length) {
      return {
        newState: currentState,
        accepted: pdaSimulationEngine.isAccepting(currentState, finalStates),
        finished: true
      };
    }

    const symbol = inputString[stepIndex];
    const configurations = pdaSimulationEngine.getNextConfiguration(currentState, symbol, nodes);
    
    // For simulation, take the first valid configuration (in reality, PDA is non-deterministic)
    const newState = configurations[0] || currentState;
    
    return {
      newState,
      accepted: false,
      finished: stepIndex === inputString.length - 1
    };
  }
};

export default pdaSimulationEngine;
