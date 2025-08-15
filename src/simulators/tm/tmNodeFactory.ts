import { TMNode } from './renderers/TMRenderer';

export const tmNodeFactory = {
  createNode: (id: string, x: number, y: number): TMNode => ({
    id,
    x,
    y,
    isFinal: false,
    isReject: false,
    transitions: []
  }),

  getNextNodeId: (existingNodes: TMNode[]): string => {
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

export default tmNodeFactory;
