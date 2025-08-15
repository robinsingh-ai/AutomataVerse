import { PDANode } from './renderers/PDARenderer';

export const pdaNodeFactory = {
  createNode: (id: string, x: number, y: number): PDANode => ({
    id,
    x,
    y,
    isFinal: false,
    transitions: []
  }),

  getNextNodeId: (existingNodes: PDANode[]): string => {
    const existingIds = new Set(existingNodes.map(node => node.id));
    
    for (let i = 0; i < 1000; i++) {
      const id = `q${i}`;
      if (!existingIds.has(id)) {
        return id;
      }
    }
    
    return `q${Math.random().toString(36).substr(2, 9)}`;
  }
};

export default pdaNodeFactory;
