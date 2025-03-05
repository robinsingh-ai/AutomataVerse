import { KonvaEventObject } from 'konva/lib/Node';

// Node Types
export interface Transition {
  targetid: string;
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

// Input Popup Props
export interface InputPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (symbol: string) => void;
}

// Grid Props
export interface GridProps {
  size: number;
  color: string;
  stageProps: StageProps;
}

// Node Canvas Props
export interface NodeCanvasProps {
  nodes: Node[];
  showGrid: boolean;
  stageProps: StageProps;
  nodeMap: NodeMap;
  highlightedTransition: HighlightedTransition;
  selectedNode: Node | null;
  finiteNodes: Set<string>;
  currNode: Node | null;
  showQuestion: boolean;
  handleNodeClick: (node: Node) => void;
  handleDragMove: (e: KonvaEventObject<DragEvent>, nodeId: string) => void;
  handleDragStart?: (e: KonvaEventObject<DragEvent>, nodeId: string) => void;
  handleDragEnd?: (e: KonvaEventObject<DragEvent>, nodeId: string) => void;
  isDraggingNode?: boolean;
  nodeMouseDown?: () => void;
  nodeMouseUp?: () => void;
}

// Guided Tour Props
export interface GuidedTourProps {
  isActive: boolean;
  onComplete: () => void;
  onAddNode: () => void;
  onSetFinite: () => void;
  onRun: () => void;
  selectedNode: Node | null;
  setSelectedNode: (node: Node | null) => void;
}

// Welcome Panel Props
export interface WelcomePanelProps {
  onStartTour: () => void;
  onClose: () => void;
}

// Tour Step Interface
export interface TourStep {
  id: number;
  title: string;
  content: string;
  target: string; // CSS selector or ref for the target element
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: () => void; // Optional action to perform when entering this step
}