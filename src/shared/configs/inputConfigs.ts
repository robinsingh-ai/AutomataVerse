import { InputField } from '../components/InputPopup';

// DFA Transition Fields - Single input symbol
export const DFA_TRANSITION_FIELDS: InputField[] = [
  {
    name: 'symbol',
    label: 'Input Symbol',
    placeholder: 'Enter symbol (a, b, c, ...)',
    required: true,
    type: 'text',
    helpText: 'Single character input symbol for the transition'
  }
];

// NFA Transition Fields - Input symbol with optional epsilon
export const NFA_TRANSITION_FIELDS: InputField[] = [
  {
    name: 'symbol',
    label: 'Input Symbol',
    placeholder: 'Enter symbol or ε for epsilon',
    required: true,
    type: 'text',
    helpText: 'Input symbol or ε (epsilon) for epsilon transitions'
  }
];

// PDA Transition Fields - Input, Stack Pop, Stack Push
export const PDA_TRANSITION_FIELDS: InputField[] = [
  {
    name: 'input',
    label: 'Input Symbol',
    placeholder: 'Enter symbol or ε',
    required: false,
    type: 'text',
    helpText: 'Input symbol to read or ε for epsilon transition'
  },
  {
    name: 'pop',
    label: 'Pop from Stack',
    placeholder: 'Symbol to pop or ε',
    required: false,
    type: 'text',
    helpText: 'Symbol to pop from stack or ε for no pop'
  },
  {
    name: 'push',
    label: 'Push to Stack',
    placeholder: 'Symbol to push or ε',
    required: false,
    type: 'text',
    helpText: 'Symbol to push to stack or ε for no push'
  }
];

// Turing Machine Transition Fields - Read, Write, Move
export const TM_TRANSITION_FIELDS: InputField[] = [
  {
    name: 'read',
    label: 'Read Symbol',
    placeholder: 'Symbol to read',
    required: true,
    type: 'text',
    helpText: 'Symbol to read from the tape'
  },
  {
    name: 'write',
    label: 'Write Symbol',
    placeholder: 'Symbol to write',
    required: true,
    type: 'text',
    helpText: 'Symbol to write to the tape'
  },
  {
    name: 'move',
    label: 'Head Movement',
    placeholder: 'Select direction',
    required: true,
    type: 'select',
    options: ['L', 'R', 'S'],
    helpText: 'L = Left, R = Right, S = Stay'
  }
];

// FSM Transition Fields - Input only (Moore machines)
export const FSM_MOORE_TRANSITION_FIELDS: InputField[] = [
  {
    name: 'input',
    label: 'Input Symbol',
    placeholder: 'Enter input symbol',
    required: true,
    type: 'text',
    helpText: 'Input symbol for the transition'
  }
];

// FSM Transition Fields - Input and Output (Mealy machines)
export const FSM_MEALY_TRANSITION_FIELDS: InputField[] = [
  {
    name: 'input',
    label: 'Input Symbol',
    placeholder: 'Enter input symbol',
    required: true,
    type: 'text',
    helpText: 'Input symbol for the transition'
  },
  {
    name: 'output',
    label: 'Output Symbol',
    placeholder: 'Enter output symbol',
    required: true,
    type: 'text',
    helpText: 'Output symbol for this transition (Mealy machine)'
  }
];

// Helper function to format transition values based on simulator type
export const formatTransitionValue = (
  simulatorType: 'DFA' | 'NFA' | 'PDA' | 'TM' | 'FSM',
  values: Record<string, string>
): string => {
  switch (simulatorType) {
    case 'DFA':
    case 'NFA':
      return values.symbol || '';
    
    case 'PDA':
      const input = values.input || 'ε';
      const pop = values.pop || 'ε';
      const push = values.push || 'ε';
      return `${input},${pop},${push}`;
    
    case 'TM':
      const read = values.read || '';
      const write = values.write || '';
      const move = values.move || 'S';
      return `${read},${write},${move}`;
    
    case 'FSM':
      const inputSym = values.input || '';
      const outputSym = values.output || '';
      return `${inputSym},${outputSym}`;
    
    default:
      return '';
  }
};

// Get field configuration for a simulator type
export const getFieldsForSimulator = (
  simulatorType: 'DFA' | 'NFA' | 'PDA' | 'TM' | 'FSM',
  isMealyMachine?: boolean
): InputField[] => {
  switch (simulatorType) {
    case 'DFA':
      return DFA_TRANSITION_FIELDS;
    case 'NFA':
      return NFA_TRANSITION_FIELDS;
    case 'PDA':
      return PDA_TRANSITION_FIELDS;
    case 'TM':
      return TM_TRANSITION_FIELDS;
    case 'FSM':
      return isMealyMachine ? FSM_MEALY_TRANSITION_FIELDS : FSM_MOORE_TRANSITION_FIELDS;
    default:
      return [];
  }
};
