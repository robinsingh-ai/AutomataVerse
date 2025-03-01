'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '../context/ThemeContext';

export default function SimulatorHomePage() {
  const { theme } = useTheme();

  const simulators = [
    {
      id: 'dfa',
      name: 'DFA Simulator',
      description: 'Deterministic Finite Automaton simulator for creating and testing finite state machines.',
      path: '/simulator/dfa',
    },
    {
      id: 'nfa',
      name: 'NFA Simulator',
      description: 'Non-deterministic Finite Automaton simulator for creating and testing finite state machines.',
      path: '/simulator/nfa',
    },
    {
      id: 'pda',
      name: 'PDA Simulator',
      description: 'Pushdown Automaton simulator for creating and testing finite state machines.',
      path: '/simulator/pda',
    },

    // Add more simulators here in the future
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Automata Simulators</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {simulators.map((simulator) => (
          <Link 
            href={simulator.path} 
            key={simulator.id}
            className={`block p-6 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg
              ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'}`}
          >
            <h2 className="text-xl font-semibold mb-2">{simulator.name}</h2>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {simulator.description}
            </p>
            <div className="mt-4 flex justify-end">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                ${theme === 'dark' ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>
                Open &rarr;
              </span>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Sample Automata</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link 
            href="/simulator/dfa/test" 
            className={`block p-6 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg
              ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'}`}
          >
            <h2 className="text-xl font-semibold mb-2">DFA: Even 0s and 1s</h2>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              A DFA that accepts strings with an even number of both 0s and 1s.
            </p>
            <div className="mt-4 flex justify-end">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                ${theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'}`}>
                Try Example &rarr;
              </span>
            </div>
          </Link>
          
          <Link 
            href="/simulator/nfa/test" 
            className={`block p-6 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg
              ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'}`}
          >
            <h2 className="text-xl font-semibold mb-2">NFA: Strings ending with &apos;ab&apos;</h2>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              An NFA that accepts strings that end with the pattern &apos;ab&apos;.
            </p>
            <div className="mt-4 flex justify-end">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                ${theme === 'dark' ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800'}`}>
                Try Example &rarr;
              </span>
            </div>
          </Link>

          <Link 
            href="/simulator/pda/test/example1" 
            className={`block p-6 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg
              ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'}`}
          >
            <h2 className="text-xl font-semibold mb-2">PDA: a^n b^n</h2>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              A PDA that accepts strings with an equal number of a&apos;s and b&apos;s.
            </p>
            <div className="mt-4 flex justify-end">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                ${theme === 'dark' ? 'bg-orange-900 text-orange-200' : 'bg-orange-100 text-orange-800'}`}>
                Try Example &rarr;
              </span>
            </div>
          </Link>

          <Link 
            href="/simulator/pda/test/example2" 
            className={`block p-6 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg
              ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'}`}
          >
            <h2 className="text-xl font-semibold mb-2">PDA: Balanced Parentheses</h2> 
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              A PDA that accepts strings with balanced parentheses.
            </p>
            <div className="mt-4 flex justify-end">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                ${theme === 'dark' ? 'bg-orange-900 text-orange-200' : 'bg-orange-100 text-orange-800'}`}>
                Try Example &rarr;
              </span>
            </div>
          </Link>
        </div>
      </div>
      
    </div>
  );
}