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
    image: HTMLImageElement | null;
    handleNodeClick: (node: Node) => void;
    handleDragMove: (e: KonvaEventObject<DragEvent>, nodeId: string) => void;
    nodeMouseDown: () => void;
    nodeMouseUp: () => void;
  }