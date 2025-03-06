'use client';

import { useState, useEffect, useRef } from 'react';
import { InputPopupProps } from '../type';
import { useTheme } from '../../../app/context/ThemeContext';

const InputPopup: React.FC<InputPopupProps> = ({ isOpen, onClose, onSubmit }) => {
  const { theme } = useTheme();
  const [inputSymbol, setInputSymbol] = useState<string>('');
  const [popSymbol, setPopSymbol] = useState<string>('');
  const [pushSymbols, setPushSymbols] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input field when popup opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format transition string: "input,pop,push"
    const transitionValue = `${inputSymbol},${popSymbol},${pushSymbols}`;
    onSubmit(transitionValue);
    
    // Reset fields
    setInputSymbol('');
    setPopSymbol('');
    setPushSymbols('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className={`rounded-lg shadow-lg p-6 w-full max-w-lg ${
        theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        <h2 className="text-xl font-semibold mb-4">Enter PDA Transition</h2>
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
              <input
                id="input-symbol"
                ref={inputRef}
                type="text"
                value={inputSymbol}
                onChange={(e) => setInputSymbol(e.target.value)}
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="Enter input symbol (use 'ε' for epsilon)"
              />
              <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Use &apos;ε&apos; for epsilon transitions (no input consumed)
              </p>
            </div>
            
            <div>
              <label 
                htmlFor="pop-symbol" 
                className={`block text-sm font-medium mb-1 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Pop Symbol:
              </label>
              <input
                id="pop-symbol"
                type="text"
                value={popSymbol}
                onChange={(e) => setPopSymbol(e.target.value)}
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="Enter pop symbol (use 'ε' for no pop)"
              />
              <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Symbol to pop from the top of the stack (use &apos;ε&apos; for no pop)
              </p>
            </div>
            
            <div>
              <label 
                htmlFor="push-symbols" 
                className={`block text-sm font-medium mb-1 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Push Symbols:
              </label>
              <input
                id="push-symbols"
                type="text"
                value={pushSymbols}
                onChange={(e) => setPushSymbols(e.target.value)}
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="Enter push symbols (e.g. 'AZ', use 'ε' for no push)"
              />
              <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Symbols to push onto the stack (leftmost symbol pushed first, use &apos;ε&apos; for no push)
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