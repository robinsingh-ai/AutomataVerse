'use client';

import React, { useState } from 'react';
import DraggablePanel from './DraggablePanel';
import { useTheme } from '../../app/context/ThemeContext';

export interface TestResult {
  input: string;
  accepted: boolean;
  output?: string; // For FSM machines
  path?: string[]; // For showing computation path
  error?: string;
}

export interface TestInputPanelProps {
  isVisible?: boolean;
  simulatorType: 'DFA' | 'NFA' | 'PDA' | 'TM' | 'FSM';
  onTestInput: (input: string) => void;
  onShareMachine?: () => void;
  disabled?: boolean;
  title?: string;
  width?: number;
}

const TestInputPanel: React.FC<TestInputPanelProps> = ({
  isVisible = true,
  simulatorType,
  onTestInput,
  onShareMachine,
  disabled = false,
  title,
  width = 250
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [testInput, setTestInput] = useState('');

  const defaultTitle = `Test ${simulatorType}`;

  if (!isVisible) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (testInput.trim() && !disabled) {
      onTestInput(testInput.trim());
      setTestInput('');
    }
  };

  const getPlaceholder = () => {
    switch (simulatorType) {
      case 'DFA':
      case 'NFA':
        return 'Enter input string...';
      case 'PDA':
        return 'Enter input string...';
      case 'TM':
        return 'Enter input for tape...';
      case 'FSM':
        return 'Enter input sequence...';
      default:
        return 'Enter input string...';
    }
  };

  return (
    <DraggablePanel 
      title={title || defaultTitle} 
      defaultPosition={{ x: window.innerWidth - 270, y: 300 }}
      width={width}
    >
      <div className="space-y-3">
        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-2">
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Test Input
              </div>
            </label>
            <input
              type="text"
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              placeholder={getPlaceholder()}
              disabled={disabled}
              className={`w-full px-3 py-2 rounded transition-colors ${
                disabled
                  ? `${isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-100 text-gray-400'} cursor-not-allowed opacity-50`
                  : isDark
                    ? 'bg-gray-800 border-gray-700 focus:border-blue-500 text-white placeholder-gray-400'
                    : 'bg-white border border-gray-300 focus:border-blue-500 text-gray-900 placeholder-gray-500'
              } focus:ring-1 focus:ring-blue-500 focus:outline-none`}
            />
          </div>
          
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!testInput.trim() || disabled}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded transition-colors ${
                !testInput.trim() || disabled
                  ? `${isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-100 text-gray-400'} cursor-not-allowed`
                  : isDark
                    ? 'bg-gray-800 hover:bg-gray-700 text-green-400 hover:text-green-300'
                    : 'bg-white hover:bg-gray-100 text-green-600 hover:text-green-700 border border-gray-300'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Test</span>
            </button>
            
            {onShareMachine && (
              <button
                type="button"
                onClick={onShareMachine}
                disabled={disabled}
                className={`flex items-center justify-center gap-2 py-2 px-4 rounded transition-colors ${
                  disabled
                    ? `${isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-100 text-gray-400'} cursor-not-allowed`
                    : isDark
                      ? 'bg-gray-800 hover:bg-gray-700 text-blue-400 hover:text-blue-300'
                      : 'bg-white hover:bg-gray-100 text-blue-600 hover:text-blue-700 border border-gray-300'
                }`}
                title={`Share ${simulatorType}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span>Share</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </DraggablePanel>
  );
};

export default TestInputPanel;
