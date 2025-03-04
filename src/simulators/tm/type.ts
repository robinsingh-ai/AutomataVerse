import { KonvaEventObject } from 'konva/lib/Node';

// Direction for head movement
export type Direction = 'L' | 'R' | 'S';

// TM Transition includes read/write operations and direction for each tape
export interface Transition {
  targetid: string;
  // Format for single tape: "readSymbol,writeSymbol,direction"
  // Format for multi-tape: "r1,w1,d1;r2,w2,d2;r3,w3,d3"
  // □ for blank symbol
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
  tapeMode: TapeMode;
  onTapeModeChange: (mode: TapeMode) => void;
  tapes: Tape[];
}

// Input Popup Props for TM
export interface InputPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (transitionInfo: string) => void;
  tapeMode: TapeMode;
}

// Grid Props
export interface GridProps {
  size: number;
  color: string;
  stageProps: StageProps;
}

// Tape Mode Enum
export type TapeMode = '1-tape' | '2-tape' | '3-tape';

// Tape representation
export interface Tape {
  content: Map<number, string>;
  headPosition: number;
}

// TM State - represents the current configuration
export interface TMState {
  stateId: string;
  tapes: Tape[];
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