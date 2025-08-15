import { DFANode, DFATransition } from '../../dfa/renderers/DFARenderer';
export interface DFAState {
  currentNodeId: string;
  inputPosition: number;
  path: string[];
}

export const dfaSimulationEngine = {
  getInitialState: (nodes: DFANode[]): DFAState => {
    const startNode = nodes.find(node => node.id === 'q0') || nodes[0];
    return {
      currentNodeId: startNode?.id || '',
      inputPosition: 0,
      path: [startNode?.id || '']
    };
  },

  getNextConfiguration: (currentState: DFAState, symbol: string): DFAState => {
    // Find the current node
    const currentNode = nodes.find(node => node.id === currentState.currentNodeId);
    if (!currentNode) return currentState;

    // Find transition for the symbol
    const transition = currentNode.transitions.find(t => t.symbol === symbol);
    if (!transition) {
      // No valid transition - stay in current state or go to error state
      return currentState;
    }

    return {
      currentNodeId: transition.to,
      inputPosition: currentState.inputPosition + 1,
      path: [...currentState.path, transition.to]
    };
  },

  isAccepting: (state: DFAState, finalStates: Set<string>): boolean => {
    return finalStates.has(state.currentNodeId);
  },

  step: (currentState: DFAState, inputString: string, stepIndex: number) => {
    if (stepIndex >= inputString.length) {
      return {
        newState: currentState,
        accepted: dfaSimulationEngine.isAccepting(currentState, new Set()), // You'd pass actual final states
        finished: true
      };
    }

    const symbol = inputString[stepIndex];
    const newState = dfaSimulationEngine.getNextConfiguration(currentState, symbol);
    
    return {
      newState,
      accepted: false, // Only check at the end
      finished: stepIndex === inputString.length - 1
    };
  }
};

let nodes: DFANode[] = []; // This would be passed in or accessed differently

export default dfaSimulationEngine;
