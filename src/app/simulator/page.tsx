'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '../../components/Navbar';

// Import with dynamic to avoid hydration issues
const DynamicAutomataSimulator = dynamic(
  () => import('../../simulators/dfa/AutomataSimulator'),
  { ssr: false }
);

export default function SimulatorPage() {
  const [simulatorType, setSimulatorType] = useState<'Automata'>('Automata');

  return (
    <>
      <Navbar />
      
      <main className="flex flex-col min-h-screen pt-16">
        <div className="bg-gray-800 text-white py-3 px-6 flex justify-center shadow-md">
          <div className="flex space-x-1 bg-gray-700 rounded-lg p-1">
            <button
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                simulatorType === 'Automata'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
              onClick={() => setSimulatorType('Automata')}
            >
              Automata Simulator
            </button>
          </div>
        </div>
        
        <div className="flex-grow w-full">
          {simulatorType === 'Automata' && <DynamicAutomataSimulator />}
        </div>
      </main>
    </>
  );
}