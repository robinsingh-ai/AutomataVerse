export interface DFAProblem {
  id: string;
  title: string;
  description: string;
  accept: string[];
  reject: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

// Collection of DFA practice problems
export const DFA_PROBLEMS: Record<string, DFAProblem> = {
  'dfa-endswith-ab': {
    id: 'dfa-endswith-ab',
    title: 'Strings ending with "ab"',
    description: 'Construct a DFA that recognizes the following language of strings over the alphabet {a,b}: All words that end with an "ab".',
    accept: ['ab', 'aab', 'bab', 'ababab', 'bbab'],
    reject: ['a', 'b', 'ba', 'aba', 'abb', 'bba'],
    difficulty: 'Easy'
  },
  'dfa-startswith-aa': {
    id: 'dfa-startswith-aa',
    title: 'Strings starting with "aa"',
    description: 'Construct a DFA that accepts all strings over the alphabet {a,b} that start with "aa".',
    accept: ['aa', 'aaa', 'aab', 'aaba', 'aabb', 'aabbb'],
    reject: ['a', 'ab', 'ba', 'baa', 'bab', 'bba'],
    difficulty: 'Easy'
  },
  'dfa-contains-aab': {
    id: 'dfa-contains-aab',
    title: 'Strings containing "aab"',
    description: 'Construct a DFA that accepts all strings over the alphabet {a,b} that contain the substring "aab".',
    accept: ['aab', 'aaab', 'aabb', 'baab', 'aabaab'],
    reject: ['a', 'b', 'aa', 'ab', 'aba', 'baa', 'bba'],
    difficulty: 'Medium'
  },
  'dfa-even-as-odd-bs': {
    id: 'dfa-even-as-odd-bs',
    title: 'Strings with even a\'s and odd b\'s',
    description: 'Construct a DFA that accepts strings over the alphabet {a,b} that have an even number of a\'s and an odd number of b\'s.',
    accept: ['b', 'bbb', 'aab', 'aabbb', 'ababbbb', 'aaaabbb'],
    reject: ['', 'a', 'aa', 'bb', 'aabb', 'ba', 'abab', 'aaa'],
    difficulty: 'Medium'
  },
  'dfa-divisible-by-3': {
    id: 'dfa-divisible-by-3',
    title: 'Binary numbers divisible by 3',
    description: 'Construct a DFA that accepts binary strings (0s and 1s) that represent numbers divisible by 3. The string is read from left to right, with the leftmost bit being the most significant.',
    accept: ['0', '11', '110', '1001', '1100'],
    reject: ['1', '10', '100', '101', '111', '1000'],
    difficulty: 'Hard'
  }
}; 