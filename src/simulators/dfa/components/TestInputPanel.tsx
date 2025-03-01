'use client';

import React, { useState } from 'react';
import DraggablePanel from './DraggablePanel';
import { useTheme } from '../../../app/context/ThemeContext';

interface TestInputPanelProps {
  onTestInput: (input: string, speed?: number) => void;
}

const TestInputPanel: React.FC<TestInputPanelProps> = ({ onTestInput }) => {
  const [inputString, setInputString] = useState('');
  const [speed, setSpeed] = useState(300);
  const { theme } = useTheme();
  
  const handleSimulate = () => {
    onTestInput(inputString, speed);
  };
  
  const handleQuickTest = () => {
    onTestInput(inputString, 50);
  };
  
  return (
    <DraggablePanel title="Test Input String" defaultPosition={{ x: window.innerWidth - 320, y: 80 }} width={280}>
      <div className="space-y-4">
        <div>
          <p className={`mb-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Enter a string to check if it&apos;s accepted by the DFA
          </p>
          
          <div className="space-y-3">
            <div>
              <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Input String
              </label>
              <input
                type="text"
                placeholder="e.g. 101010"
                value={inputString}
                onChange={(e) => setInputString(e.target.value)}
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Simulation Speed (ms)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="50"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-full"
                />
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  {speed}
                </span>
              </div>
            </div>
            
            <div className="flex space-x-2 pt-2">
              <button
                onClick={handleQuickTest}
                className={`flex-1 px-4 py-2 rounded font-medium text-white ${
                  theme === 'dark' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                <div className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Quick Test
                </div>
              </button>
              <button
                onClick={handleSimulate}
                className={`flex-1 px-4 py-2 rounded font-medium text-white ${
                  theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                <div className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Simulate
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DraggablePanel>
  );
};

export default TestInputPanel; 