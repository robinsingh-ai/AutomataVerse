import { KonvaEventObject } from 'konva/lib/Node';

// PDA Transition includes stack operations
export interface Transition {
  targetid: string;
  // Format: "inputSymbol,popSymbol,pushSymbol"
  // Empty string or ε for epsilon transitions (no input consumed)
  // Z for empty stack symbol
  // Multiple symbols for pushing to stack are concatenated in order
  label: string;
}

export interface Node {
  id: string;
  x: number;
  y: number;
  transitions: Transition[];
}

export interface NodeMap {
  [key: string]: Node;
}

export interface HighlightedTransition {
  d?: Transition;
  target?: string;
}

// Stage Props
export interface StageProps {
  x: number;
  y: number;
  scale: number;
  draggable: boolean;
}

// Control Panel Props
export interface ControlPanelProps {
  onAddNode: () => void;
  onSetFinite: () => void;
  onRun: () => void;
  onStep: () => void;
  onInputChange: (value: string) => void;
  onReset: () => void;
  onToggleGrid: () => void;
  onLoadJson: () => void;
  onValidate: () => void;
  inputString: string;
  validationResult: string | null;
  selectedNode: Node | null;
  isRunning: boolean;
  isRunningStepWise: boolean;
  showGrid: boolean;
  stepIndex: number;
  stack: string[];
}

// Input Popup Props for PDA
export interface InputPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (transitionInfo: string) => void;
}

// Grid Props
export interface GridProps {
  size: number;
  color: string;
  stageProps: StageProps;
}

// PDA State - represents the current configuration
export interface PDAState {
  stateId: string;
  stackContent: string[];
  inputPosition: number;
}

// Node Canvas Props
export interface NodeCanvasProps {
  nodes: Node[];
  showGrid: boolean;
  stageProps: StageProps;
  nodeMap: NodeMap;
  highlightedTransitions: HighlightedTransition[];
  highlightedNodes: Set<string>;
  selectedNode: Node | null;
  finiteNodes: Set<string>;
  currNodes: Set<string>;
  showQuestion: boolean;
  handleNodeClick: (node: Node) => void;
  handleDragMove: (e: KonvaEventObject<DragEvent>, nodeId: string) => void;
  handleDragStart?: (e: KonvaEventObject<DragEvent>, nodeId: string) => void;
  handleDragEnd?: (e: KonvaEventObject<DragEvent>, nodeId: string) => void;
  isDraggingNode?: boolean;
  nodeMouseDown?: () => void;
  nodeMouseUp?: () => void;
}