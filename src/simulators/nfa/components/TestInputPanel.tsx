'use client';

import React, { useState } from 'react';
import DraggablePanel from './DraggablePanel';
import { useTheme } from '../../../app/context/ThemeContext';

interface TestInputPanelProps {
  onTestInput: (input: string) => void;
  onShareNFA?: () => void; // Optional prop for sharing NFA
  disabled?: boolean; // Optional prop to disable the panel when coming from a problem
}

const TestInputPanel: React.FC<TestInputPanelProps> = ({
  onTestInput,
  onShareNFA,
  disabled = false
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
    if (onShareNFA) {
      onShareNFA();
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
            Enter a string to check if it&apos;s accepted by the NFA
          </label>
          <input
            id="test-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. aaabbb"
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            disabled={disabled}
          />
        </div>
        
        <div className="flex space-x-2">
          <button
            type="submit"
            className={`flex-1 py-2 px-4 rounded font-semibold ${
              theme === 'dark'
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={disabled}
          >
            Test
          </button>
          
          {onShareNFA && (
            <button
              type="button"
              onClick={handleShare}
              className={`flex-1 py-2 px-4 rounded font-semibold ${
                theme === 'dark'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={disabled}
            >
              Share NFA
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