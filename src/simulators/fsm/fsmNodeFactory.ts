import { FSMNode } from './renderers/FSMRenderer';

export const fsmNodeFactory = {
  createNode: (id: string, x: number, y: number): FSMNode => ({
    id,
    x,
    y,
    isFinal: false,
    isInitial: id === 'q0', // First state is initial by default
    transitions: []
  }),

  getNextNodeId: (existingNodes: FSMNode[]): string => {
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

export default fsmNodeFactory;
