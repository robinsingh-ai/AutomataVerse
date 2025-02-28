'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Link from 'next/link';

type Example = {
  id: string;
  title: string;
  description: string;
  image: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
};

const examples: Example[] = [
  {
    id: 'even-a',
    title: 'Even number of "a"s',
    description: 'A DFA that accepts strings with an even number of "a" characters.',
    image: '/examples/even-a.png',
    difficulty: 'Beginner',
    tags: ['DFA', 'Parity', 'Basic']
  },
  {
    id: 'ends-with-ab',
    title: 'Strings ending with "ab"',
    description: 'A DFA that accepts strings that end with the substring "ab".',
    image: '/examples/ends-with-ab.png',
    difficulty: 'Beginner',
    tags: ['DFA', 'Substring', 'Pattern Matching']
  },
  {
    id: 'mod3',
    title: 'Binary numbers divisible by 3',
    description: 'A DFA that accepts binary representations of numbers that are divisible by 3.',
    image: '/examples/mod3.png',
    difficulty: 'Intermediate',
    tags: ['DFA', 'Number Theory', 'Modular Arithmetic']
  },
  {
    id: 'balanced-parentheses',
    title: 'Balanced Parentheses',
    description: 'A pushdown automaton (PDA) that recognizes balanced parentheses expressions.',
    image: '/examples/balanced-parentheses.png',
    difficulty: 'Advanced',
    tags: ['PDA', 'Stack', 'Context-Free']
  },
  {
    id: 'anbn',
    title: 'a^n b^n Language',
    description: 'A PDA that accepts strings of the form a^n b^n (equal number of a\'s followed by b\'s).',
    image: '/examples/anbn.png',
    difficulty: 'Advanced',
    tags: ['PDA', 'Context-Free', 'Counting']
  },
  {
    id: 'email-validator',
    title: 'Email Validator',
    description: 'A complex DFA that validates simplified email address formats.',
    image: '/examples/email.png',
    difficulty: 'Intermediate',
    tags: ['DFA', 'Validation', 'Practical']
  }
];

export default function ExamplesPage() {
  const [filter, setFilter] = useState<string>('all');
  
  const filteredExamples = filter === 'all' 
    ? examples 
    : examples.filter(example => 
        example.difficulty.toLowerCase() === filter.toLowerCase() || 
        example.tags.some(tag => tag.toLowerCase() === filter.toLowerCase())
      );

  return (
    <>
      <Navbar />
      
      <main className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-purple-600 to-blue-700 p-6">
              <h1 className="text-3xl font-bold text-white">Automata Examples</h1>
              <p className="mt-2 text-blue-100">Explore these examples to better understand automata concepts</p>
            </div>
            
            <div className="p-6">
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filter === 'all' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  All Examples
                </button>
                <button
                  onClick={() => setFilter('beginner')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filter === 'beginner' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  Beginner
                </button>
                <button
                  onClick={() => setFilter('intermediate')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filter === 'intermediate' 
                      ? 'bg-yellow-600 text-white' 
                      : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  Intermediate
                </button>
                <button
                  onClick={() => setFilter('advanced')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filter === 'advanced' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  Advanced
                </button>
                <button
                  onClick={() => setFilter('dfa')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filter === 'dfa' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  DFA
                </button>
                <button
                  onClick={() => setFilter('pda')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filter === 'pda' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  PDA
                </button>
              </div>
              
              {filteredExamples.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">No examples match your filter criteria.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredExamples.map((example) => (
                    <div 
                      key={example.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-md transition-transform hover:shadow-lg hover:-translate-y-1"
                    >
                      <div className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <div className="text-gray-400 dark:text-gray-500 text-sm">Example Image</div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold dark:text-white">{example.title}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            example.difficulty === 'Beginner' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                              : example.difficulty === 'Intermediate'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                          }`}>
                            {example.difficulty}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                          {example.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-4">
                          {example.tags.map(tag => (
                            <span 
                              key={tag} 
                              className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded"
                              onClick={() => setFilter(tag.toLowerCase())}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <Link 
                          href={`/simulator?load=${example.id}`}
                          className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded transition-colors"
                        >
                          Load Example
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Understanding These Examples</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Each example demonstrates a different concept in automata theory. Load an example into the simulator to interact with it 
              and see how it processes different input strings. These examples range from beginner concepts to advanced topics in 
              automata theory.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Don't see an example for a specific concept you're interested in? Check back later as we're constantly adding new examples!
            </p>
          </div>
        </div>
      </main>
    </>
  );
} 