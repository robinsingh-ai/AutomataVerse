export interface Problem {
  id: string;
  title: string;
  description: string;
  accept: string[];
  reject: string[];
  tapeMode: '1-tape' | '2-tape' | '3-tape';
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

// Sample TM problems
export const TM_PROBLEMS: Record<string, Problem> = {
  'tm-binary-palindrome': {
    id: 'tm-binary-palindrome',
    title: 'Binary Palindrome',
    description: 'Create a Turing Machine that recognizes binary palindromes (strings that read the same forward and backward, e.g., "1001").',
    accept: ['', '0', '1', '00', '11', '101', '010', '1001', '1111', '10101', '11011'],
    reject: ['10', '01', '100', '001', '1010', '0101', '10011'],
    tapeMode: '1-tape',
    difficulty: 'Medium'
  },
  'tm-a-power-b': {
    id: 'tm-a-power-b',
    title: 'a^n b^n^2',
    description: 'Design a Turing Machine that accepts strings of the form a^n b^(n^2) where n ≥ 1. For example, "abbb" (n=1), "aabbbb" (n=2), "aaabbbbbbbbb" (n=3).',
    accept: ['abbb', 'aabbbbbb', 'aaabbbbbbbbb'],
    reject: ['', 'a', 'b', 'ab', 'abb', 'aabb', 'aabbb', 'aaabbbbbbbbbbb'],
    tapeMode: '2-tape',
    difficulty: 'Hard'
  },
  'tm-equal-ones-zeros': {
    id: 'tm-equal-ones-zeros',
    title: 'Equal 0s and 1s',
    description: 'Build a Turing Machine that accepts binary strings with an equal number of 0s and 1s.',
    accept: ['', '01', '10', '0011', '0101', '1010', '1100', '001011', '010101'],
    reject: ['0', '1', '00', '11', '001', '100', '0001', '1110'],
    tapeMode: '1-tape',
    difficulty: 'Medium'
  },
  'tm-copy-language': {
    id: 'tm-copy-language',
    title: 'Copy Language',
    description: 'Create a Turing Machine that recognizes strings of the form ww, where w is any string over {a, b}.',
    accept: ['', 'aa', 'bb', 'abab', 'baba', 'aabbaa', 'abbaabba'],
    reject: ['a', 'b', 'ab', 'ba', 'aab', 'abb', 'aaba', 'abaa'],
    tapeMode: '1-tape',
    difficulty: 'Hard'
  },
  'tm-divisible-by-three': {
    id: 'tm-divisible-by-three',
    title: 'Binary Divisible by 3',
    description: 'Build a Turing Machine that accepts binary strings (representing numbers) that are divisible by 3.',
    accept: ['0', '11', '110', '1001', '1100', '1111'],
    reject: ['1', '10', '100', '101', '111', '1000', '1010'],
    tapeMode: '1-tape',
    difficulty: 'Medium'
  }
}; 