// src/shared/interfaces/SimulatorEngine.ts

export interface ValidationResult {
  isValid: boolean;
  message: string;
  errors: string[];
}

export interface SimulatorEngine<TState> {
  getInitialState: (nodes: any[]) => TState;
  // Deterministic: return TState
  // Non-deterministic: return TState[]
  // Never return null
  getNextConfiguration: (currentState: TState, symbol: string, nodes: any[]) => TState | TState[];
  isAccepting: (state: TState, finalStates: Set<string>, nodes?: any[]) => boolean;
  step: (
    currentState: TState,
    inputString: string,
    stepIndex: number,
    nodes: any[],
    finalStates: Set<string>
  ) => { newState: TState; accepted: boolean; finished: boolean };
}

export interface Serializer<TNode> {
  serialize: (nodes: TNode[], finalStates: Set<string>) => string;
  deserialize: (json: string) => { nodes: TNode[]; finalStates: string[] } | null;
  validate: (nodes: TNode[], finalStates: Set<string>) => ValidationResult;
}

export interface NodeFactory<TNode> {
  createNode: (id: string, x: number, y: number) => TNode;
  getNextNodeId: (existingNodes: TNode[]) => string;
}
