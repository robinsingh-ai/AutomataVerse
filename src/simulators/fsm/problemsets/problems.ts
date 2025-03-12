import { NodeMap, MachineType } from '../type';

export interface Problem {
  id: string;
  title: string;
  description: string;
  machineType: MachineType;
  testStrings: {
    input: string;
    expectedOutput: string;
  }[];
  initialNodeMap?: NodeMap;
  difficulty: 'easy' | 'medium' | 'hard';
  solution?: NodeMap;
}

const fsmProblems: Problem[] = [
  // Moore Machine Problem
  {
    id: 'moore-binary-divisible-by-3',
    title: 'Binary Counter (Moore Machine)',
    description: 
      'Design a Moore machine that outputs the remainder when a binary number is divided by 3. ' +
      'The machine should read the binary digits from left to right. ' +
      'For each state, specify its output value (0, 1, or 2) which represents the remainder when divided by 3. ' +
      'For example, the binary number 1101 (13 in decimal) divided by 3 gives a remainder of 1, so the output should be 1.',
    machineType: 'Moore',
    testStrings: [
      { input: '0', expectedOutput: '0' },
      { input: '1', expectedOutput: '1' },
      { input: '10', expectedOutput: '1' },
      { input: '11', expectedOutput: '0' },
      { input: '100', expectedOutput: '1' },
      { input: '101', expectedOutput: '2' },
      { input: '110', expectedOutput: '0' },
      { input: '111', expectedOutput: '1' },
      { input: '1000', expectedOutput: '2' },
      { input: '1001', expectedOutput: '0' },
      { input: '1010', expectedOutput: '1' }
    ],
    difficulty: 'medium'
  },
  
  // Mealy Machine Problem
  {
    id: 'mealy-zero-detector',
    title: 'Zero Detector (Mealy Machine)',
    description: 
      'Design a Mealy machine that outputs 1 whenever the input sequence contains two consecutive 0s, and outputs 0 otherwise. ' +
      'For example, with the input sequence "10100", the machine should output "00010", as the third and fourth positions have consecutive zeros. ' +
      'The machine must output a value for each input symbol it processes.',
    machineType: 'Mealy',
    testStrings: [
      { input: '1010', expectedOutput: '0000' },
      { input: '1100', expectedOutput: '0010' },
      { input: '0101', expectedOutput: '0000' },
      { input: '0011', expectedOutput: '0100' },
      { input: '00000', expectedOutput: '01111' },
      { input: '10001', expectedOutput: '00000' },
      { input: '00100', expectedOutput: '01000' },
      { input: '11001100', expectedOutput: '00010010' }
    ],
    difficulty: 'easy'
  }
];

export default fsmProblems; 