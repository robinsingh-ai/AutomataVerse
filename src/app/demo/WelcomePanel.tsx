'use client';

import React from 'react';
import { useTheme } from '../../app/context/ThemeContext';

interface WelcomePanelProps {
  onStartTour: () => void;
  onClose: () => void;
}

const WelcomePanel: React.FC<WelcomePanelProps> = ({ onStartTour, onClose }) => {
  const { theme } = useTheme();
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-40">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div 
        className={`relative z-50 p-6 rounded-lg shadow-xl max-w-md ${
          theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        }`}
      >
        <h2 className="text-2xl font-bold mb-4">Welcome to the DFA Simulator</h2>
        <p className="mb-6">
          This simulator allows you to create and test Deterministic Finite Automata (DFAs).
          Would you like to take a guided tour to learn how to use the simulator?
        </p>
        
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded ${
              theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
            }`}
          >
            Skip Tour
          </button>
          
          <button
            onClick={onStartTour}
            className={`px-4 py-2 rounded ${
              theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            Start Tour
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePanel;