import { FSMNode, FSMTransition } from '../renderers/FSMRenderer';

export interface FSMState {
  currentNodeId: string;
  inputPosition: number;
  path: string[];
  outputSequence: string[]; // For tracking outputs
}

export const fsmSimulationEngine = {
  getInitialState: (nodes: FSMNode[]): FSMState => {
    const startNode = nodes.find(node => node.isInitial) || 
                     nodes.find(node => node.id === 'q0') || 
                     nodes[0];
    
    return {
      currentNodeId: startNode?.id || '',
      inputPosition: 0,
      path: [startNode?.id || ''],
      outputSequence: startNode?.output ? [startNode.output] : []
    };
  },

  getNextConfiguration: (currentState: FSMState, symbol: string, nodes: FSMNode[]): FSMState | null => {
    const currentNode = nodes.find(node => node.id === currentState.currentNodeId);
    if (!currentNode) return null;

    const transition = currentNode.transitions.find(t => t.input === symbol);
    if (!transition) return null; // No valid transition

    const nextNode = nodes.find(n => n.id === transition.to);
    const newOutputSequence = [...currentState.outputSequence];

    // Add output based on machine type
    if (transition.output) {
      // Mealy machine - output on transition
      newOutputSequence.push(transition.output);
    } else if (nextNode?.output) {
      // Moore machine - output on state
      newOutputSequence.push(nextNode.output);
    }

    return {
      currentNodeId: transition.to,
      inputPosition: currentState.inputPosition + 1,
      path: [...currentState.path, transition.to],
      outputSequence: newOutputSequence
    };
  },

  isAccepting: (state: FSMState, finalStates: Set<string>, nodes: FSMNode[]): boolean => {
    const currentNode = nodes.find(n => n.id === state.currentNodeId);
    return finalStates.has(state.currentNodeId) || (currentNode?.isFinal || false);
  },

  step: (currentState: FSMState, inputString: string, stepIndex: number, nodes: FSMNode[], finalStates: Set<string>) => {
    if (stepIndex >= inputString.length) {
      return {
        newState: currentState,
        accepted: fsmSimulationEngine.isAccepting(currentState, finalStates, nodes),
        finished: true
      };
    }

    const symbol = inputString[stepIndex];
    const newState = fsmSimulationEngine.getNextConfiguration(currentState, symbol, nodes);
    
    if (!newState) {
      // No valid transition - FSM gets stuck
      return {
        newState: currentState,
        accepted: false,
        finished: true
      };
    }

    return {
      newState,
      accepted: false,
      finished: stepIndex === inputString.length - 1
    };
  }
};

export default fsmSimulationEngine;
