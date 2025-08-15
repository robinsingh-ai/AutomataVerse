import { PDANode } from './renderers/PDARenderer';
import { ValidationResult } from '../../shared/interfaces/SimulatorEngine';

export const pdaSerializer = {
  serialize: (nodes: PDANode[], finalStates: Set<string>): string => {
    const data = {
      type: 'PDA',
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
        hasStack: true
      }
    };
    return JSON.stringify(data, null, 2);
  },

  deserialize: (json: string) => {
    try {
      const data = JSON.parse(json);
      
      if (data.type !== 'PDA') {
        throw new Error('Invalid PDA format');
      }

      const nodes: PDANode[] = data.nodes.map((nodeData: any) => ({
        id: nodeData.id,
        x: nodeData.x || 0,
        y: nodeData.y || 0,
        isFinal: nodeData.isFinal || false,
        transitions: nodeData.transitions || []
      }));

      const finalStates = data.finalStates || [];
      return { nodes, finalStates };
    } catch (error) {
      console.error('PDA deserialization error:', error);
      return null;
    }
  },

  validate: (nodes: PDANode[], finalStates: Set<string>): ValidationResult => {
    const errors: string[] = [];

    if (nodes.length === 0) {
      errors.push('PDA must have at least one state');
    }

    const hasStartState = nodes.some(node => node.id === 'q0');
    if (!hasStartState && nodes.length > 0) {
      errors.push('PDA must have a start state (q0)');
    }

    // Validate transitions
    nodes.forEach(node => {
      node.transitions.forEach(transition => {
        const targetExists = nodes.some(n => n.id === transition.to);
        if (!targetExists) {
          errors.push(`Transition from ${node.id} to ${transition.to} references non-existent state`);
        }

        // Validate PDA transition format
        if (!transition.inputSymbol || !transition.popSymbol || !transition.pushSymbol) {
          errors.push(`Invalid PDA transition format in state ${node.id}`);
        }
      });
    });

    return {
      isValid: errors.length === 0,
      message: errors.length === 0 ? 'Valid PDA' : `Invalid PDA: ${errors[0]}`,
      errors
    };
  }
};

export default pdaSerializer;
