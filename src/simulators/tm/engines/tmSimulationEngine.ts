import { TMNode, TMTransition } from '../renderers/TMRenderer';

export interface TMState {
  currentNodeId: string;
  tape: string[];
  headPosition: number;
  inputPosition: number;
  path: string[];
  tapeHistory: { tape: string[], headPosition: number }[];
}

export const tmSimulationEngine = {
  getInitialState: (nodes: TMNode[], inputString: string = ''): TMState => {
    const startNode = nodes.find(node => node.id === 'q0') || nodes[0];
    const tape = inputString.split('');
    
    // Ensure tape has blank symbols
    if (tape.length === 0) tape.push('□');
    
    return {
      currentNodeId: startNode?.id || '',
      tape: tape,
      headPosition: 0,
      inputPosition: 0,
      path: [startNode?.id || ''],
      tapeHistory: [{ tape: [...tape], headPosition: 0 }]
    };
  },

  getNextConfiguration: (currentState: TMState, nodes: TMNode[]): TMState | null => {
    const currentNode = nodes.find(node => node.id === currentState.currentNodeId);
    if (!currentNode) return null;

    const currentSymbol = currentState.tape[currentState.headPosition] || '□';
    const transition = currentNode.transitions.find(t => t.readSymbol === currentSymbol);
    
    if (!transition) return null; // No valid transition (machine halts)

    const newTape = [...currentState.tape];
    newTape[currentState.headPosition] = transition.writeSymbol;

    let newHeadPosition = currentState.headPosition;
    switch (transition.direction) {
      case 'L':
        newHeadPosition = Math.max(0, newHeadPosition - 1);
        break;
      case 'R':
        newHeadPosition += 1;
        // Extend tape if needed
        while (newTape.length <= newHeadPosition) {
          newTape.push('□');
        }
        break;
      case 'S':
        // Stay in same position
        break;
    }

    return {
      currentNodeId: transition.to,
      tape: newTape,
      headPosition: newHeadPosition,
      inputPosition: currentState.inputPosition + 1,
      path: [...currentState.path, transition.to],
      tapeHistory: [...currentState.tapeHistory, { tape: [...newTape], headPosition: newHeadPosition }]
    };
  },

  isAccepting: (state: TMState, finalStates: Set<string>, nodes: TMNode[]): boolean => {
    const currentNode = nodes.find(n => n.id === state.currentNodeId);
    return finalStates.has(state.currentNodeId) || (currentNode?.isFinal || false);
  },

  isRejecting: (state: TMState, nodes: TMNode[]): boolean => {
    const currentNode = nodes.find(n => n.id === state.currentNodeId);
    return currentNode?.isReject || false;
  },

  step: (currentState: TMState, inputString: string, stepIndex: number, nodes: TMNode[], finalStates: Set<string>) => {
    const newState = tmSimulationEngine.getNextConfiguration(currentState, nodes);
    
    if (!newState) {
      // Machine halts - check if accepting
      return {
        newState: currentState,
        accepted: tmSimulationEngine.isAccepting(currentState, finalStates, nodes),
        finished: true
      };
    }

    const isAccepting = tmSimulationEngine.isAccepting(newState, finalStates, nodes);
    const isRejecting = tmSimulationEngine.isRejecting(newState, nodes);
    
    return {
      newState,
      accepted: isAccepting,
      finished: isAccepting || isRejecting
    };
  }
};

export default tmSimulationEngine;
