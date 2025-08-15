import { DFANode } from './renderers/DFARenderer';

export const dfaNodeFactory = {
  createNode: (id: string, x: number, y: number): DFANode => ({
    id,
    x,
    y,
    isFinal: false,
    transitions: []
  }),

  getNextNodeId: (existingNodes: DFANode[]): string => {
    const existingIds = new Set(existingNodes.map(node => node.id));
    
    // Try q0, q1, q2, etc.
    for (let i = 0; i < 1000; i++) {
      const id = `q${i}`;
      if (!existingIds.has(id)) {
        return id;
      }
    }
    
    // Fallback to random ID
    return `q${Math.random().toString(36).substr(2, 9)}`;
  }
};

export default dfaNodeFactory;
