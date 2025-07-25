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
  width = 350
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [testInput, setTestInput] = useState('');
  const [testHistory, setTestHistory] = useState<string[]>([]);

  const defaultTitle = `Test ${simulatorType} Input`;

  if (!isVisible) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (testInput.trim() && !disabled) {
      onTestInput(testInput.trim());
      
      // Add to history (avoid duplicates)
      setTestHistory(prev => {
        const newHistory = [testInput.trim(), ...prev.filter(item => item !== testInput.trim())];
        return newHistory.slice(0, 10); // Keep only last 10 entries
      });
      
      setTestInput('');
    }
  };

  const handleHistoryClick = (input: string) => {
    setTestInput(input);
  };

  const clearHistory = () => {
    setTestHistory([]);
  };

  const getPlaceholder = () => {
    switch (simulatorType) {
      case 'DFA':
      case 'NFA':
        return 'Enter input string (e.g., "aabb")';
      case 'PDA':
        return 'Enter input string (e.g., "aabb" for a^nb^n)';
      case 'TM':
        return 'Enter input string for tape';
      case 'FSM':
        return 'Enter input sequence (e.g., "101")';
      default:
        return 'Enter input string';
    }
  };

  const getHelpText = () => {
    switch (simulatorType) {
      case 'DFA':
        return 'Test strings to see if they are accepted by your DFA';
      case 'NFA':
        return 'Test strings to see if they are accepted by your NFA (supports ε-transitions)';
      case 'PDA':
        return 'Test strings to see if they are accepted by your PDA (uses stack)';
      case 'TM':
        return 'Test strings on your Turing Machine tape';
      case 'FSM':
        return 'Test input sequences to see the output of your FSM';
      default:
        return 'Test input strings on your automaton';
    }
  };

  return (
    <DraggablePanel 
      title={title || defaultTitle} 
      defaultPosition={{ x: 20, y: 400 }} 
      width={width}
    >
      <div className="space-y-4">
        {/* Help Text */}
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {getHelpText()}
        </p>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Test Input
            </label>
            <input
              type="text"
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              placeholder={getPlaceholder()}
              disabled={disabled}
              className={`w-full px-3 py-2 rounded border transition-colors ${
                disabled
                  ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-50'
                  : isDark
                    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
              } focus:ring-1 focus:ring-blue-500 focus:outline-none`}
            />
          </div>
          
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!testInput.trim() || disabled}
              className={`flex-1 py-2 px-4 rounded font-medium transition-colors ${
                !testInput.trim() || disabled
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Test Input
            </button>
            
            {onShareMachine && (
              <button
                type="button"
                onClick={onShareMachine}
                disabled={disabled}
                className={`px-3 py-2 rounded transition-colors ${
                  disabled
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : isDark
                      ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                title={`Share ${simulatorType}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            )}
          </div>
        </form>

        {/* Test History */}
        {testHistory.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Recent Tests
              </h4>
              <button
                onClick={clearHistory}
                className={`text-xs ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
              >
                Clear
              </button>
            </div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {testHistory.map((input, index) => (
                <button
                  key={index}
                  onClick={() => handleHistoryClick(input)}
                  disabled={disabled}
                  className={`w-full text-left px-2 py-1 rounded text-sm transition-colors ${
                    disabled
                      ? 'cursor-not-allowed opacity-50'
                      : isDark
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  "{input}"
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick Test Buttons */}
        <div>
          <h4 className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Quick Tests
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {getQuickTests().map((test, index) => (
              <button
                key={index}
                onClick={() => !disabled && onTestInput(test)}
                disabled={disabled}
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  disabled
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : isDark
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                "{test}"
              </button>
            ))}
          </div>
        </div>
      </div>
    </DraggablePanel>
  );

  function getQuickTests(): string[] {
    switch (simulatorType) {
      case 'DFA':
      case 'NFA':
        return ['', 'a', 'b', 'ab', 'ba', 'aa', 'bb', 'aab'];
      case 'PDA':
        return ['', 'ab', 'aabb', 'aaabbb', 'abab'];
      case 'TM':
        return ['', '0', '1', '01', '10', '101', '010'];
      case 'FSM':
        return ['', '0', '1', '01', '10', '101', '010', '001'];
      default:
        return ['', 'a', 'b', 'ab'];
    }
  }
};

export default TestInputPanel;
