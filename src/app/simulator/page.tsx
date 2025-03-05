'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '../context/ThemeContext';

export default function SimulatorHomePage() {
  const { theme } = useTheme();
  const [showBanner, setShowBanner] = useState(true);
  const simulators = [
    {
      id: 'dfa',
      name: 'DFA Simulator',
      description: 'Deterministic Finite Automaton simulator for creating and testing finite state machines.',
      path: '/simulator/dfa',
    },
    {
      id: 'fsm',
      name: 'Moore/Mealy Machine Simulator',
      description: 'Moore/Mealy Machine simulator for creating and testing finite state machines.',
      path: '/simulator/fsm',
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
    {
      id: 'tm',
      name: 'TM Simulator',
      description: 'Turing Machine simulator for creating and testing finite state machines.',
      path: '/simulator/tm',
    },

    // Add more simulators here in the future
  ];

  return (
    <div className="container mx-auto px-4 py-8 ">
      {/* Announcement Banner */}
      {showBanner && (
          <div className="bg-green-500 text-white p-3 relative mb-6 mx-4 sm:mx-6 lg:mx-8 rounded">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <span className="font-medium">Update: Added Moore and Mealy Machine Simulators.</span>
              <button 
                onClick={() => setShowBanner(false)}
                className="absolute right-4 top-3 text-white hover:text-gray-200"
                aria-label="Close banner"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
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

          <Link 
            href="/simulator/tm/test/example1" 
            className={`block p-6 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg
              ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'}`}
          >
            <h2 className="text-xl font-semibold mb-2">TM: TripletChecker</h2>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              A TM that accepts a^n b^n c^n language.
            </p>
            <div className="mt-4 flex justify-end">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                ${theme === 'dark' ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>
                Try Example &rarr;
              </span>
            </div>
          </Link>

          <Link 
            href="/simulator/tm/test/example3" 
            className={`block p-6 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg
              ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'}`}
          >
            <h2 className="text-xl font-semibold mb-2">TM: Binary Addition</h2>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              A TM that adds two binary numbers. Try with Input 1010 and 1011 separated by &apos;c&apos;
            </p>
            <div className="mt-4 flex justify-end">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                ${theme === 'dark' ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>
                Try Example &rarr;
              </span>
            </div>
          </Link>

          <Link 
            href="/simulator/fsm/test/example1" 
            className={`block p-6 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg
              ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'}`}
          >
            <h2 className="text-xl font-semibold mb-2">Moore Machine: Detect 101</h2>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              A Moore Machine that detects &apos;101&apos; in a binary string.
            </p>
            <div className="mt-4 flex justify-end">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                ${theme === 'dark' ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800'}`}>
                Try Example &rarr;
              </span>
            </div>
          </Link>

          <Link 
            href="/simulator/fsm/test/example2" 
            className={`block p-6 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg
              ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'}`}
          >
            <h2 className="text-xl font-semibold mb-2">Mealy Machine: Detect 101</h2>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              A Mealy Machine that detects &apos;101&apos; in a binary string.
            </p>
            <div className="mt-4 flex justify-end">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                ${theme === 'dark' ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800'}`}>
                Try Example &rarr;
              </span>
            </div>
          </Link>
        </div>
      </div>
      
    </div>
  );
}