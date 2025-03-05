'use client';

import { useState, useEffect, useRef } from 'react';
import { InputPopupProps } from '../type';
import { useTheme } from '../../../app/context/ThemeContext';

const InputPopup: React.FC<InputPopupProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  onOutputChange, 
  currentOutput = '',
  isOutputPopup = false,
  isMealyMachine = false
}) => {
  const { theme } = useTheme();
  const [inputSymbol, setInputSymbol] = useState<string>('');
  const [output, setOutput] = useState<string>(currentOutput);
  const [transitionOutput, setTransitionOutput] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setInputSymbol('');
      setOutput(currentOutput);
      setTransitionOutput('');
    }
  }, [isOpen, currentOutput]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isOutputPopup) {
      if (onOutputChange && output.trim()) {
        onOutputChange(output.trim());
      }
    } else {
      if (inputSymbol.trim()) {
        // If this is a Mealy machine transition, we need to provide both input and output
        if (isMealyMachine) {
          onSubmit(inputSymbol.trim(), transitionOutput.trim());
        } else {
          onSubmit(inputSymbol.trim());
        }
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className={`rounded-lg shadow-lg p-6 w-full max-w-md ${
        theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        <h2 className="text-xl font-semibold mb-4">
          {isOutputPopup ? "Enter State Output" : (isMealyMachine ? "Enter Transition Details" : "Enter Transition Input Symbol")}
        </h2>
        <form onSubmit={handleSubmit}>
          {isOutputPopup ? (
            <div className="mb-4">
              <label 
                htmlFor="state-output"
                className={`block text-sm font-medium mb-1 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Output Value
              </label>
              <input
                id="state-output"
                ref={inputRef}
                type="text"
                value={output}
                onChange={(e) => setOutput(e.target.value)}
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="e.g., 0, 1, a, b"
              />
            </div>
          ) : (
            <>
              <div className="mb-4">
                <label 
                  htmlFor="input-symbol"
                  className={`block text-sm font-medium mb-1 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Input Symbol
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
                  placeholder="e.g., a, b, 0, 1"
                />
              </div>
              
              {/* Show output field only for Mealy machines */}
              {isMealyMachine && (
                <div className="mb-4">
                  <label 
                    htmlFor="transition-output"
                    className={`block text-sm font-medium mb-1 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    Output Symbol (for this transition)
                  </label>
                  <input
                    id="transition-output"
                    type="text"
                    value={transitionOutput}
                    onChange={(e) => setTransitionOutput(e.target.value)}
                    className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="e.g., 0, 1, a, b"
                  />
                </div>
              )}
            </>
          )}
          
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