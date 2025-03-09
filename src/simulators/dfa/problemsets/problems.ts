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
  },
  'dfa-ends-with-aba': {
    id: 'dfa-ends-with-aba',
    title: 'Strings ending with "aba"',
    description: 'Construct a DFA that recognizes the language of all strings over the alphabet {a,b} that end with "aba".',
    accept: ['aba', 'aaba', 'baba', 'ababa', 'bbaba', 'bababa'],
    reject: ['a', 'b', 'ab', 'ba', 'abb', 'bab', 'abab', 'abaa'],
    difficulty: 'Easy'
  },
  'dfa-no-consecutive-as': {
    id: 'dfa-no-consecutive-as',
    title: 'Strings with no consecutive a\'s',
    description: 'Construct a DFA that accepts all strings over the alphabet {a,b} that do not contain two consecutive a\'s.',
    accept: ['', 'a', 'b', 'ab', 'ba', 'aba', 'bab', 'babab', 'bbbbbb'],
    reject: ['aa', 'aab', 'baa', 'baab', 'abaa', 'aabbaa'],
    difficulty: 'Medium'
  },
  'dfa-alternating-ab': {
    id: 'dfa-alternating-ab',
    title: 'Alternating a\'s and b\'s',
    description: 'Construct a DFA that accepts all strings over the alphabet {a,b} where a\'s and b\'s alternate (the empty string is accepted).',
    accept: ['', 'a', 'b', 'ab', 'ba', 'aba', 'bab', 'ababa', 'babab'],
    reject: ['aa', 'bb', 'aab', 'abb', 'baa', 'bba', 'ababb'],
    difficulty: 'Medium'
  },
  'dfa-no-substring-abba': {
    id: 'dfa-no-substring-abba',
    title: 'Strings without substring "abba"',
    description: 'Construct a DFA that accepts all strings over the alphabet {a,b} that do not contain the substring "abba".',
    accept: ['', 'a', 'b', 'ab', 'ba', 'abb', 'bba', 'abab', 'babb', 'aabbb'],
    reject: ['abba', 'abbab', 'babba', 'aabbaa', 'ababba'],
    difficulty: 'Hard'
  },
  
  
}; 