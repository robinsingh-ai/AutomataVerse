'use client';

import React from 'react';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';

export default function LearnPage() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Navbar onThemeChange={toggleTheme} currentTheme={theme} />
      
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-6">
            <span style={{ color: '#70D9C2' }}>Learn</span> Automata Theory
          </h1>
          
          <div className="space-y-10">
            <section className={`p-6 rounded-lg shadow-md ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-xl font-bold mb-4">What are Automata?</h2>
              <p className="mb-4">
                Automata theory is the study of abstract machines and problems they can solve. These abstract machines, called automata,
                are mathematical models of computing devices that follow predetermined sequences of operations.
              </p>
              <p>
                Automata are used in compiler design, programming language theory, artificial intelligence, and many other areas of computer science.
              </p>
            </section>
            
            <section className={`p-6 rounded-lg shadow-md ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-xl font-bold mb-4">Types of Automata</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: '#70D9C2' }}>Finite Automata (FA)</h3>
                  <p>
                    Finite automata are the simplest type of automata. They have a finite number of states and can remember a finite amount of information.
                    There are two types of finite automata:
                  </p>
                  <ul className="list-disc pl-5 mt-2">
                    <li>Deterministic Finite Automata (DFA) - Each state has exactly one transition for each possible input.</li>
                    <li>Non-deterministic Finite Automata (NFA) - States can have multiple transitions for the same input, or no transitions at all.</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: '#70D9C2' }}>Pushdown Automata (PDA)</h3>
                  <p>
                    Pushdown automata extend finite automata with a stack, which allows them to recognize context-free languages. 
                    The stack provides memory that can grow as needed.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: '#70D9C2' }}>Turing Machines (TM)</h3>
                  <p>
                    Turing machines are the most powerful type of automata. They have an infinite tape that can be read from and written to, 
                    allowing them to recognize all recursively enumerable languages.
                  </p>
                </div>
              </div>
            </section>
            
            <section className={`p-6 rounded-lg shadow-md ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-xl font-bold mb-4">Key Concepts</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: '#70D9C2' }}>States</h3>
                  <p>
                    States represent the "memory" of an automaton. The current state reflects all the relevant information about the input 
                    that has been processed so far.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: '#70D9C2' }}>Transitions</h3>
                  <p>
                    Transitions define how an automaton moves from one state to another when processing input symbols.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: '#70D9C2' }}>Acceptance</h3>
                  <p>
                    An automaton accepts an input string if, after processing all the symbols, it ends in an accepting (final) state.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: '#70D9C2' }}>Language</h3>
                  <p>
                    The language recognized by an automaton is the set of all strings that it accepts.
                  </p>
                </div>
              </div>
            </section>
            
            <section className={`p-6 rounded-lg shadow-md ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-xl font-bold mb-4">Ready to try it out?</h2>
              <p className="mb-4">
                Check out our <a href="/demo" className="text-teal-500 hover:text-teal-600 underline">interactive demo</a> to create and test your own automata.
              </p>
              <p>
                Or jump right into our <a href="/simulator" className="text-teal-500 hover:text-teal-600 underline">full-featured simulators</a> for DFAs, NFAs, PDAs, and Turing Machines.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 