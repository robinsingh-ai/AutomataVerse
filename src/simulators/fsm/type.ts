import { KonvaEventObject } from 'konva/lib/Node';

// Machine Type Enum
export type MachineType = 'Moore' | 'Mealy';

// Moore Machine Transition is simpler than TM transition
export interface Transition {
  targetid: string;
  // Input symbol that triggers this transition
  inputSymbol: string;
  // Output for Mealy Machine (undefined for Moore)
  outputSymbol?: string;
}

export interface Node {
  id: string;
  x: number;
  y: number;
  // Output value associated with this state (Moore Machine)
  output: string;
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
  onSetStateOutput?: (node: Node) => void;  // Prop for setting state output
  onMachineTypeChange?: (type: MachineType) => void; // Prop for changing machine type
  onSave?: () => void; // New prop for saving the machine
  inputString: string;
  validationResult: string | null;
  selectedNode: Node | null;
  isRunning: boolean;
  isRunningStepWise: boolean;
  showGrid: boolean;
  stepIndex: number;
  machineType: MachineType; // Current machine type
  isLoggedIn?: boolean; // New prop to check if user is logged in
}

// Input Popup Props for FSM
export interface InputPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (inputSymbol: string, outputSymbol?: string) => void;
  onOutputChange?: (output: string) => void;
  currentOutput?: string;
  isOutputPopup?: boolean;
  isMealyMachine?: boolean;
}

// Grid Props
export interface GridProps {
  size: number;
  color: string;
  stageProps: StageProps;
}

// FSM State - represents the current configuration
export interface FSMState {
  stateId: string;
  currentInput: string;
  inputIndex: number;
  outputSequence: string[];
  halted: boolean;
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