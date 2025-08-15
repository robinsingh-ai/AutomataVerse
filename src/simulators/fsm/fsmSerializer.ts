import { FSMNode } from './renderers/FSMRenderer';
import { ValidationResult } from '../../shared/interfaces/SimulatorEngine';

export const fsmSerializer = {
  serialize: (nodes: FSMNode[], finalStates: Set<string>): string => {
    const data = {
      type: 'FSM',
      nodes: nodes.map(node => ({
        id: node.id,
        x: node.x,
        y: node.y,
        isFinal: finalStates.has(node.id) || node.isFinal,
        isInitial: node.isInitial,
        output: node.output,
        transitions: node.transitions
      })),
      finalStates: Array.from(finalStates),
      metadata: {
        created: new Date().toISOString(),
        version: '1.0',
        type: 'FSM'
      }
    };
    return JSON.stringify(data, null, 2);
  },

  deserialize: (json: string) => {
    try {
      const data = JSON.parse(json);
      
      if (data.type !== 'FSM') {
        throw new Error('Invalid FSM format');
      }

      const nodes: FSMNode[] = data.nodes.map((nodeData: any) => ({
        id: nodeData.id,
        x: nodeData.x || 0,
        y: nodeData.y || 0,
        isFinal: nodeData.isFinal || false,
        isInitial: nodeData.isInitial || false,
        output: nodeData.output,
        transitions: nodeData.transitions || []
      }));

      const finalStates = data.finalStates || [];
      return { nodes, finalStates };
    } catch (error) {
      console.error('FSM deserialization error:', error);
      return null;
    }
  },

  validate: (nodes: FSMNode[], finalStates: Set<string>): ValidationResult => {
    const errors: string[] = [];

    if (nodes.length === 0) {
      errors.push('FSM must have at least one state');
    }

    const initialStates = nodes.filter(node => node.isInitial);
    if (initialStates.length === 0) {
      errors.push('FSM must have exactly one initial state');
    } else if (initialStates.length > 1) {
      errors.push('FSM must have exactly one initial state (found multiple)');
    }

    // Check machine type consistency
    const hasStateOutputs = nodes.some(node => node.output);
    const hasTransitionOutputs = nodes.some(node => 
      node.transitions.some(t => t.output)
    );

    if (hasStateOutputs && hasTransitionOutputs) {
      errors.push('FSM cannot be both Moore (state outputs) and Mealy (transition outputs)');
    }

    // Validate transitions
    nodes.forEach(node => {
      const inputSymbols = new Set<string>();
      
      node.transitions.forEach(transition => {
        const targetExists = nodes.some(n => n.id === transition.to);
        if (!targetExists) {
          errors.push(`Transition from ${node.id} to ${transition.to} references non-existent state`);
        }

        // Check for non-determinism
        if (inputSymbols.has(transition.input)) {
          errors.push(`State ${node.id} has multiple transitions on input '${transition.input}' (FSM must be deterministic)`);
        }
        inputSymbols.add(transition.input);
      });
    });

    return {
      isValid: errors.length === 0,
      message: errors.length === 0 ? 'Valid FSM' : `Invalid FSM: ${errors[0]}`,
      errors
    };
  }
};

export default fsmSerializer;
