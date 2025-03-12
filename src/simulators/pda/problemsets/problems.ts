export interface PDAProblem {
  id: string;
  title: string;
  description: string;
  accept: string[];
  reject: string[];
  difficulty: "Easy" | "Medium" | "Hard";
}

// Collection of PDA practice problems
export const PDA_PROBLEMS: Record<string, PDAProblem> = {
  "pda-palindromes": {
    id: "pda-palindromes",
    title: 'Palindromes',
    description:
      'Construct a PDA that recognizes palindromes over the alphabet {a,b}. A palindrome reads the same forwards and backwards (e.g., "abba", "aba").',
    accept: ["", "a", "b", "aa", "bb", "aba", "bab", "abba", "baab", "ababa"],
    reject: ["ab", "ba", "aab", "abb", "baa", "bba", "aabba"],
    difficulty: "Medium",
  },
  "pda-equal-as-bs": {
    id: "pda-equal-as-bs",
    title: 'Equal number of a\'s and b\'s',
    description:
      'Construct a PDA that accepts strings over the alphabet {a,b} that have an equal number of a\'s and b\'s.',
    accept: ["", "ab", "ba", "aabb", "abab", "baba", "baab", "aaabbb"],
    reject: ["a", "b", "aa", "bb", "aab", "abb", "aaabb"],
    difficulty: "Easy",
  },
  "pda-a-power-n-b-power-n": {
    id: "pda-a-power-n-b-power-n",
    title: 'a^n b^n',
    description:
      'Construct a PDA that accepts strings of the form a^n b^n, where n ≥ 0. That is, n a\'s followed by exactly n b\'s.',
    accept: ["", "ab", "aabb", "aaabbb", "aaaabbbb"],
    reject: ["a", "b", "ba", "aab", "abb", "abab", "baba"],
    difficulty: "Easy",
  },
  "pda-a-power-n-b-power-2n": {
    id: "pda-a-power-n-b-power-2n",
    title: 'a^n b^2n',
    description:
      'Construct a PDA that accepts strings of the form a^n b^2n, where n ≥ 0. That is, n a\'s followed by exactly 2n b\'s.',
    accept: ["", "abb", "aabbbb", "aaabbbbbb"],
    reject: ["a", "b", "ab", "ba", "aab", "abb", "abbb", "aabbb"],
    difficulty: "Medium",
  },
  "pda-ww": {
    id: "pda-ww",
    title: 'Strings of the form ww',
    description:
      'Construct a PDA that accepts strings of the form ww, where w is any string over the alphabet {a,b}. That is, the string consists of some string w followed by the exact same string w.',
    accept: ["", "aa", "bb", "abab", "baba", "aabbaa", "abbaabba"],
    reject: ["a", "b", "ab", "ba", "aab", "abb", "aba", "bab"],
    difficulty: "Hard",
  },
  "pda-not-palindromes": {
    id: "pda-not-palindromes",
    title: 'Non-palindromes',
    description:
      'Construct a PDA that recognizes strings over the alphabet {a,b} that are NOT palindromes.',
    accept: ["ab", "ba", "aab", "abb", "baa", "bba", "aabba"],
    reject: ["", "a", "b", "aa", "bb", "aba", "bab", "abba", "baab"],
    difficulty: "Hard",
  },
  "pda-a-power-i-b-power-j-i-greater-j": {
    id: "pda-a-power-i-b-power-j-i-greater-j",
    title: 'a^i b^j where i > j',
    description:
      'Construct a PDA that accepts strings of the form a^i b^j, where i > j ≥ 0. That is, i a\'s followed by j b\'s, where i is greater than j.',
    accept: ["a", "aa", "aaa", "aab", "aaab", "aaaabb"],
    reject: ["", "b", "ab", "abb", "aabb", "aaabbb"],
    difficulty: "Medium",
  }
}; 