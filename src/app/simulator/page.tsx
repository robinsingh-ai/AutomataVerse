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
    </div>
  );
}