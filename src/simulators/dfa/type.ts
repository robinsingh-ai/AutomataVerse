import { KonvaEventObject } from 'konva/lib/Node';

export interface Transition {
  targetid: string;
  // For DFA, transitions are labeled with input symbols
  // Format: "a" for input symbol 'a'
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
}

// Input Popup Props for DFA
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

// DFA State - represents the current configuration
export interface DFAState {
  stateId: string;
  inputString: string;
  inputPosition: number;
  halted: boolean;
  accepted: boolean;
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