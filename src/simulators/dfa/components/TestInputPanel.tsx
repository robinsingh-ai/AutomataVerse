'use client';

import React, { useState } from 'react';
import DraggablePanel from '../../../shared/components/DraggablePanel';
import { useTheme } from '../../../app/context/ThemeContext';

interface TestInputPanelProps {
  onTestInput: (input: string) => void;
  onShareDFA?: () => void; // Optional prop for sharing DFA
}

const TestInputPanel: React.FC<TestInputPanelProps> = ({
  onTestInput,
  onShareDFA
}) => {
  const { theme } = useTheme();
  const [input, setInput] = useState<string>('');
  const [showCopiedMessage, setShowCopiedMessage] = useState<boolean>(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onTestInput(input.trim());
    }
  };
  
  const handleShare = () => {
    if (onShareDFA) {
      onShareDFA();
      setShowCopiedMessage(true);
      setTimeout(() => setShowCopiedMessage(false), 3000);
    }
  };
  
  return (
    <DraggablePanel title="Test Input" defaultPosition={{ x: 20, y: 600 }} width={250}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label 
            htmlFor="test-input" 
            className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
          >
            Enter a string to check if it&apos;s accepted by the DFA
          </label>
          <input
            id="test-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. abba"
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          />
        </div>
        
        <div className="flex space-x-2">
          <button
            type="submit"
            className={`flex-1 py-2 px-4 rounded font-semibold ${
              theme === 'dark'
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            Test
          </button>
          
          {onShareDFA && (
            <button
              type="button"
              onClick={handleShare}
              className={`flex-1 py-2 px-4 rounded font-semibold ${
                theme === 'dark'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              Share DFA
            </button>
          )}
        </div>
        
        {showCopiedMessage && (
          <div className={`mt-2 p-2 text-sm rounded ${
            theme === 'dark' ? 'bg-green-800 text-green-100' : 'bg-green-100 text-green-800'
          }`}>
            URL copied to clipboard!
          </div>
        )}
      </form>
    </DraggablePanel>
  );
};

export default TestInputPanel;