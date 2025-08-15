import { NFANode, NFATransition } from '../renderers/NFARenderer';

export interface NFAState {
  currentNodeIds: Set<string>; // NFA can be in multiple states
  inputPosition: number;
  path: string[][];
  epsilonClosure: Set<string>;
}

export const nfaSimulationEngine = {
  getEpsilonClosure: (nodeId: string, nodes: NFANode[]): Set<string> => {
    const closure = new Set<string>([nodeId]);
    const stack = [nodeId];
    
    while (stack.length > 0) {
      const currentId = stack.pop()!;
      const currentNode = nodes.find(n => n.id === currentId);
      
      currentNode?.transitions
        .filter(t => t.symbol === 'ε')
        .forEach(t => {
          if (!closure.has(t.to)) {
            closure.add(t.to);
            stack.push(t.to);
          }
        });
    }
    
    return closure;
  },

  getInitialState: (nodes: NFANode[]): NFAState => {
    const startNode = nodes.find(node => node.id === 'q0') || nodes[0];
    const epsilonClosure = startNode 
      ? nfaSimulationEngine.getEpsilonClosure(startNode.id, nodes)
      : new Set<string>();
    
    return {
      currentNodeIds: epsilonClosure,
      inputPosition: 0,
      path: [Array.from(epsilonClosure)],
      epsilonClosure
    };
  },

  getNextConfiguration: (currentState: NFAState, symbol: string, nodes: NFANode[]): NFAState => {
    const nextStates = new Set<string>();
    
    // For each current state, find all transitions on the symbol
    currentState.currentNodeIds.forEach(nodeId => {
      const node = nodes.find(n => n.id === nodeId);
      node?.transitions
        .filter(t => t.symbol === symbol)
        .forEach(t => {
          // Add epsilon closure of target state
          const closure = nfaSimulationEngine.getEpsilonClosure(t.to, nodes);
          closure.forEach(s => nextStates.add(s));
        });
    });
    
    return {
      currentNodeIds: nextStates,
      inputPosition: currentState.inputPosition + 1,
      path: [...currentState.path, Array.from(nextStates)],
      epsilonClosure: nextStates
    };
  },

  isAccepting: (state: NFAState, finalStates: Set<string>): boolean => {
    // NFA accepts if any current state is a final state
    return Array.from(state.currentNodeIds).some(id => finalStates.has(id));
  },

  step: (currentState: NFAState, inputString: string, stepIndex: number, nodes: NFANode[], finalStates: Set<string>) => {
    if (stepIndex >= inputString.length) {
      return {
        newState: currentState,
        accepted: nfaSimulationEngine.isAccepting(currentState, finalStates),
        finished: true
      };
    }

    const symbol = inputString[stepIndex];
    const newState = nfaSimulationEngine.getNextConfiguration(currentState, symbol, nodes);
    
    return {
      newState,
      accepted: false,
      finished: stepIndex === inputString.length - 1
    };
  }
};

export default nfaSimulationEngine;
