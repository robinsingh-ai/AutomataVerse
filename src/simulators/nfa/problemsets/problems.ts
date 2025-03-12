export interface NFAProblem {
  id: string;
  title: string;
  description: string;
  accept: string[];
  reject: string[];
  difficulty: "Easy" | "Medium" | "Hard";
}

// Collection of NFA practice problems
export const NFA_PROBLEMS: Record<string, NFAProblem> = {
  "nfa-contains-ab": {
    id: "nfa-contains-ab",
    title: 'Strings containing "ab"',
    description:
      'Construct an NFA that recognizes the following language of strings over the alphabet {a,b}: All words that contain the substring "ab".',
    accept: ["ab", "aab", "abb", "abab", "baab", "bab"],
    reject: ["a", "b", "aa", "bb", "ba", "bba"],
    difficulty: "Easy",
  },
  "nfa-starts-a-ends-b": {
    id: "nfa-starts-a-ends-b",
    title: 'Strings starting with "a" and ending with "b"',
    description:
      'Construct an NFA that accepts all strings over the alphabet {a,b} that start with "a" and end with "b".',
    accept: ["ab", "aab", "abb", "abab", "aabbb", "aaabbb"],
    reject: ["a", "b", "ba", "bba", "aba", "aaba"],
    difficulty: "Easy",
  },
  "nfa-even-as-or-even-bs": {
    id: "nfa-even-as-or-even-bs",
    title: 'Strings with an even number of "a"s or an even number of "b"s',
    description:
      'Construct an NFA that accepts strings over the alphabet {a,b} that have an even number of "a"s or an even number of "b"s.',
    accept: ["", "aa", "bb", "aab", "aabb", "abab", "aabbaa", "bbaba"],
    reject: ["ab", "ba", "a", "b", "aaab", "abbb", "aaa"],
    difficulty: "Medium",
  },
  "nfa-end-with-aab": {
    id: "nfa-end-with-aab",
    title: 'Strings ending with "aab"',
    description:
      'Construct an NFA that recognizes all strings over the alphabet {a,b} that end with "aab".',
    accept: ["aab", "aaab", "baab", "aaaab", "bbaab"],
    reject: ["a", "b", "aa", "ab", "ba", "bb", "aba", "abb"],
    difficulty: "Easy",
  },
  "nfa-divisible-by-3": {
    id: "nfa-divisible-by-3",
    title: 'Binary numbers divisible by 3',
    description:
      'Construct an NFA that accepts binary strings (over {0,1}) that represent numbers divisible by 3. For example, "11" is accepted because it represents 3 in decimal.',
    accept: ["", "11", "110", "1001", "1100", "1111"],
    reject: ["1", "10", "100", "101", "111", "1000"],
    difficulty: "Hard",
  },
  "nfa-epsilon-at-least-one-a": {
    id: "nfa-epsilon-at-least-one-a",
    title: 'Strings with at least one "a" (using ε-transitions)',
    description:
      'Construct an NFA with ε-transitions that accepts all strings over the alphabet {a,b} that contain at least one "a".',
    accept: ["a", "aa", "ab", "ba", "aaa", "aba", "bab", "bbb"],
    reject: ["", "b", "bb", "bbb"],
    difficulty: "Medium",
  },
  "nfa-multiple-of-2-or-3": {
    id: "nfa-multiple-of-2-or-3",
    title: 'Binary numbers divisible by 2 or 3',
    description:
      'Construct an NFA that accepts binary strings (over {0,1}) that represent numbers divisible by either 2 or 3.',
    accept: ["0", "10", "11", "100", "110", "1001", "1100"],
    reject: ["1", "101", "111", "1000", "1011"],
    difficulty: "Hard",
  }
}; 