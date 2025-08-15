import { NFANode } from './renderers/NFARenderer';
import { ValidationResult } from '../../shared/interfaces/ValidationResult';

export const nfaSerializer = {
  serialize: (nodes: NFANode[], finalStates: Set<string>): string => {
    const data = {
      type: 'NFA',
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
        version: '1.0',
        supportsEpsilon: true
      }
    };
    return JSON.stringify(data, null, 2);
  },

  deserialize: (json: string) => {
    try {
      const data = JSON.parse(json);
      
      if (data.type !== 'NFA') {
        throw new Error('Invalid NFA format');
      }

      const nodes: NFANode[] = data.nodes.map((nodeData: any) => ({
        id: nodeData.id,
        x: nodeData.x || 0,
        y: nodeData.y || 0,
        isFinal: nodeData.isFinal || false,
        transitions: nodeData.transitions || []
      }));

      const finalStates = data.finalStates || [];
      return { nodes, finalStates };
    } catch (error) {
      console.error('NFA deserialization error:', error);
      return null;
    }
  },

  validate: (nodes: NFANode[], finalStates: Set<string>): ValidationResult => {
    const errors: string[] = [];

    if (nodes.length === 0) {
      errors.push('NFA must have at least one state');
    }

    const hasStartState = nodes.some(node => node.id === 'q0');
    if (!hasStartState && nodes.length > 0) {
      errors.push('NFA must have a start state (q0)');
    }

    if (finalStates.size === 0) {
      errors.push('NFA should have at least one final state');
    }

    // Validate transitions
    nodes.forEach(node => {
      node.transitions.forEach(transition => {
        const targetExists = nodes.some(n => n.id === transition.to);
        if (!targetExists) {
          errors.push(`Transition from ${node.id} to ${transition.to} references non-existent state`);
        }
        
        // Validate epsilon symbol
        if (transition.symbol !== 'ε' && !/^[a-zA-Z0-9]$/.test(transition.symbol)) {
          errors.push(`Invalid symbol '${transition.symbol}' in transition from ${node.id}`);
        }
      });
    });

    return {
      isValid: errors.length === 0,
      message: errors.length === 0 ? 'Valid NFA' : `Invalid NFA: ${errors[0]}`,
      errors
    };
  }
};

export default nfaSerializer;
