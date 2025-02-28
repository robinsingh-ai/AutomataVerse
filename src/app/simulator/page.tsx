'use client';

import React, { useState } from 'react';
import AutomataSimulator from '../../simulators/dfa/AutomataSimulator';

export default function SimulatorPage() {
  const [simulatorType, setSimulatorType] = useState<  'Automata'>('Automata');

  return (
    <main className="h-screen w-screen flex flex-col">
      <div className="bg-gray-900 text-white py-3 px-6 flex justify-center shadow-md">
        <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
         
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
      <div className="flex-grow">
      
  
        {simulatorType === 'Automata' && <AutomataSimulator />}
      </div>
    </main>
  );
}