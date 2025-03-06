'use client';

import React from 'react';
import { useTheme } from '../../../app/context/ThemeContext';

interface JsonInputDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  jsonInput: string;
  setJsonInput: (value: string) => void;
}

const JsonInputDialog: React.FC<JsonInputDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  jsonInput,
  setJsonInput
}) => {
  const { theme } = useTheme();
  
  if (!isOpen) return null;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div 
        className={`w-full max-w-2xl p-6 rounded-lg shadow-lg ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <h2 className={`text-xl font-semibold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Load Nondeterministic Finite Automaton from JSON
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label 
              htmlFor="json-input" 
              className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Paste your NFA JSON here:
            </label>
            <textarea
              id="json-input"
              rows={10}
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              placeholder='{"nodes": [...], "finalStates": [...], "allowEpsilon": true}'
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-md ${
                theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-md ${
                theme === 'dark'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              Load NFA
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JsonInputDialog;