'use client';

import { useState, useEffect, useRef } from 'react';
import { InputPopupProps } from '../type';
import { useTheme } from '../../../app/context/ThemeContext';

const InputPopup: React.FC<InputPopupProps> = ({ isOpen, onClose, onSubmit, allowEpsilon }) => {
  const { theme } = useTheme();
  const [inputSymbol, setInputSymbol] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input field when popup opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    if (!inputSymbol) {
      alert('Please enter a symbol.');
      return;
    }
    
    // Check if epsilon transition is allowed
    if (inputSymbol === 'ε' && !allowEpsilon) {
      alert('Epsilon transitions are not allowed in regular NFA mode.');
      return;
    }
    
    onSubmit(inputSymbol);
    
    // Reset field
    setInputSymbol('');
  };

  const handleEpsilonClick = () => {
    if (allowEpsilon) {
      setInputSymbol('ε');
    } else {
      alert('Epsilon transitions are not allowed in regular NFA mode.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className={`rounded-lg shadow-lg p-6 w-full max-w-lg ${
        theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        <h2 className="text-xl font-semibold mb-4">Enter NFA Transition</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label 
                htmlFor="input-symbol" 
                className={`block text-sm font-medium mb-1 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Input Symbol:
              </label>
              <div className="flex space-x-2">
                <input
                  id="input-symbol"
                  ref={inputRef}
                  type="text"
                  value={inputSymbol}
                  onChange={(e) => setInputSymbol(e.target.value)}
                  className={`flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Enter input symbol"
                  maxLength={1}
                />
                {allowEpsilon && (
                  <button
                    type="button"
                    onClick={handleEpsilonClick}
                    className={`px-4 py-2 rounded ${
                      theme === 'dark'
                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                        : 'bg-purple-500 hover:bg-purple-600 text-white'
                    }`}
                  >
                    ε (Epsilon)
                  </button>
                )}
              </div>
              <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                For a single input symbol. {allowEpsilon ? "You can use 'ε' for epsilon transitions." : ""}
              </p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded ${
                theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded ${
                theme === 'dark'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InputPopup;