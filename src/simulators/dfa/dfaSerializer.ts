import { DFANode } from './renderers/DFARenderer';
import { ValidationResult } from '../../shared/interfaces/SimulatorEngine';

export const dfaSerializer = {
  serialize: (nodes: DFANode[], finalStates: Set<string>): string => {
    const data = {
      type: 'DFA',
      nodes: nodes.map(node => ({
        id: node.id,
        x: node.x,
        y: node.y,
        isFinal: finalStates.has(node.id),
        transitions: node.transitions
      })),
      finalStates: Array.from(finalStates),
      metadata: {
        created: new Date().toISOString(),
        version: '1.0'
      }
    };
    return JSON.stringify(data, null, 2);
  },

  deserialize: (json: string) => {
    try {
      const data = JSON.parse(json);
      
      if (data.type !== 'DFA') {
        throw new Error('Invalid DFA format');
      }

      const nodes: DFANode[] = data.nodes.map((nodeData: any) => ({
        id: nodeData.id,
        x: nodeData.x || 0,
        y: nodeData.y || 0,
        isFinal: nodeData.isFinal || false,
        transitions: nodeData.transitions || []
      }));

      const finalStates = data.finalStates || [];

      return { nodes, finalStates };
    } catch (error) {
      console.error('DFA deserialization error:', error);
      return null;
    }
  },

  validate: (nodes: DFANode[], finalStates: Set<string>): ValidationResult => {
    const errors: string[] = [];

    // Check if there's at least one node
    if (nodes.length === 0) {
      errors.push('DFA must have at least one state');
    }

    // Check if there's a start state (q0)
    const hasStartState = nodes.some(node => node.id === 'q0');
    if (!hasStartState && nodes.length > 0) {
      errors.push('DFA must have a start state (q0)');
    }

    // Check if there's at least one final state
    if (finalStates.size === 0) {
      errors.push('DFA should have at least one final state');
    }

    // Validate transitions
    nodes.forEach(node => {
      const symbols = new Set<string>();
      node.transitions.forEach(transition => {
        // Check for duplicate transitions on same symbol
        if (symbols.has(transition.symbol)) {
          errors.push(`State ${node.id} has multiple transitions on symbol '${transition.symbol}'`);
        }
        symbols.add(transition.symbol);

        // Check if target state exists
        const targetExists = nodes.some(n => n.id === transition.to);
        if (!targetExists) {
          errors.push(`Transition from ${node.id} to ${transition.to} references non-existent state`);
        }
      });
    });

    // Check for unreachable states
    const reachableStates = new Set<string>();
    const startState = nodes.find(n => n.id === 'q0');
    if (startState) {
      const queue = [startState.id];
      reachableStates.add(startState.id);
      
      while (queue.length > 0) {
        const currentId = queue.shift()!;
        const currentNode = nodes.find(n => n.id === currentId);
        
        currentNode?.transitions.forEach(transition => {
          if (!reachableStates.has(transition.to)) {
            reachableStates.add(transition.to);
            queue.push(transition.to);
          }
        });
      }
    }

    nodes.forEach(node => {
      if (!reachableStates.has(node.id)) {
        errors.push(`State ${node.id} is unreachable from start state`);
      }
    });

    return {
      isValid: errors.length === 0,
      message: errors.length === 0 ? 'Valid DFA' : `Invalid DFA: ${errors[0]}`,
      errors
    };
  }
};

export default dfaSerializer;
