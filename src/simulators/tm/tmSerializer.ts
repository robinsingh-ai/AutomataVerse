import { TMNode } from './renderers/TMRenderer';
import { ValidationResult } from '../../shared/interfaces/ValidationResult';

export const tmSerializer = {
  serialize: (nodes: TMNode[], finalStates: Set<string>): string => {
    const data = {
      type: 'TM',
      nodes: nodes.map(node => ({
        id: node.id,
        x: node.x,
        y: node.y,
        isFinal: finalStates.has(node.id) || node.isFinal,
        isReject: node.isReject,
        transitions: node.transitions
      })),
      finalStates: Array.from(finalStates),
      metadata: {
        created: new Date().toISOString(),
        version: '1.0',
        hasTape: true
      }
    };
    return JSON.stringify(data, null, 2);
  },

  deserialize: (json: string) => {
    try {
      const data = JSON.parse(json);
      
      if (data.type !== 'TM') {
        throw new Error('Invalid Turing Machine format');
      }

      const nodes: TMNode[] = data.nodes.map((nodeData: any) => ({
        id: nodeData.id,
        x: nodeData.x || 0,
        y: nodeData.y || 0,
        isFinal: nodeData.isFinal || false,
        isReject: nodeData.isReject || false,
        transitions: nodeData.transitions || []
      }));

      const finalStates = data.finalStates || [];
      return { nodes, finalStates };
    } catch (error) {
      console.error('TM deserialization error:', error);
      return null;
    }
  },

  validate: (nodes: TMNode[], finalStates: Set<string>): ValidationResult => {
    const errors: string[] = [];

    if (nodes.length === 0) {
      errors.push('Turing Machine must have at least one state');
    }

    const hasStartState = nodes.some(node => node.id === 'q0');
    if (!hasStartState && nodes.length > 0) {
      errors.push('Turing Machine must have a start state (q0)');
    }

    // Check for accept or reject states
    const hasAcceptState = nodes.some(node => node.isFinal) || finalStates.size > 0;
    const hasRejectState = nodes.some(node => node.isReject);
    
    if (!hasAcceptState && !hasRejectState) {
      errors.push('Turing Machine should have at least one accept or reject state');
    }

    // Validate transitions
    nodes.forEach(node => {
      const readSymbols = new Set<string>();
      
      node.transitions.forEach(transition => {
        const targetExists = nodes.some(n => n.id === transition.to);
        if (!targetExists) {
          errors.push(`Transition from ${node.id} to ${transition.to} references non-existent state`);
        }

        // Check for non-determinism (multiple transitions on same symbol)
        if (readSymbols.has(transition.readSymbol)) {
          errors.push(`State ${node.id} has multiple transitions on symbol '${transition.readSymbol}' (TM must be deterministic)`);
        }
        readSymbols.add(transition.readSymbol);

        // Validate direction
        if (!['L', 'R', 'S'].includes(transition.direction)) {
          errors.push(`Invalid direction '${transition.direction}' in transition from ${node.id}`);
        }
      });
    });

    return {
      isValid: errors.length === 0,
      message: errors.length === 0 ? 'Valid Turing Machine' : `Invalid TM: ${errors[0]}`,
      errors
    };
  }
};

export default tmSerializer;
