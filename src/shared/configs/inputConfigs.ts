export interface InputField {
  name: string;
  label: string;
  placeholder: string;
  required?: boolean;
  type?: 'text' | 'select';
  options?: string[];
}

export const DFA_TRANSITION_FIELDS: InputField[] = [
  { 
    name: 'symbol', 
    label: 'Symbol', 
    placeholder: 'Enter symbol (a, b, c, ...)', 
    required: true 
  }
];

export const NFA_TRANSITION_FIELDS: InputField[] = [
  { 
    name: 'symbol', 
    label: 'Symbol', 
    placeholder: 'Enter symbol or ε', 
    required: true 
  }
];

export const PDA_TRANSITION_FIELDS: InputField[] = [
  { 
    name: 'inputSymbol', 
    label: 'Input Symbol', 
    placeholder: 'Enter symbol or ε' 
  },
  { 
    name: 'popSymbol', 
    label: 'Pop from Stack', 
    placeholder: 'Symbol to pop or ε' 
  },
  { 
    name: 'pushSymbol', 
    label: 'Push to Stack', 
    placeholder: 'Symbol to push or ε' 
  }
];

export const TM_TRANSITION_FIELDS: InputField[] = [
  { 
    name: 'readSymbol', 
    label: 'Read Symbol', 
    placeholder: 'Symbol to read', 
    required: true 
  },
  { 
    name: 'writeSymbol', 
    label: 'Write Symbol', 
    placeholder: 'Symbol to write', 
    required: true 
  },
  {
    name: 'direction',
    label: 'Head Movement',
    type: 'select',
    options: ['L', 'R', 'S'],
    required: true,
    placeholder: ""
  }
];

export const FSM_TRANSITION_FIELDS: InputField[] = [
  { 
    name: 'input', 
    label: 'Input', 
    placeholder: 'Input symbol', 
    required: true 
  },
  { 
    name: 'output', 
    label: 'Output (Mealy)', 
    placeholder: 'Output symbol (optional)' 
  }
];
