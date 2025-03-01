'use client';

import { useState, useEffect, useRef } from 'react';
import { InputPopupProps } from '../type';
import { useTheme } from '../../../app/context/ThemeContext';

const InputPopup: React.FC<InputPopupProps> = ({ isOpen, onClose, onSubmit }) => {
  const { theme } = useTheme();
  const [inputSymbol, setInputSymbol] = useState('');
  const [popSymbol, setPopSymbol] = useState('');
  const [pushSymbol, setPushSymbol] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setInputSymbol('');
      setPopSymbol('');
      setPushSymbol('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Combine all three values into a single CSV string format for transition
    const transitionValue = `${inputSymbol},${popSymbol},${pushSymbol}`;
    onSubmit(transitionValue);
    
    // Reset fields
    setInputSymbol('');
    setPopSymbol('');
    setPushSymbol('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className={`rounded-lg shadow-lg p-6 w-96 ${
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
                Input Symbol (use ε for epsilon/empty)
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
                placeholder="Input Symbol (e.g., a, b, ε)"
              />
            </div>
            
            <div>
              <label 
                htmlFor="pop-symbol" 
                className={`block text-sm font-medium mb-1 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Pop Symbol (use ε for no pop, Z for empty stack)
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
                placeholder="Pop Symbol (e.g., a, Z, ε)"
              />
            </div>
            
            <div>
              <label 
                htmlFor="push-symbol" 
                className={`block text-sm font-medium mb-1 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Push Symbol(s) (use ε for no push, multiple symbols in order)
              </label>
              <input
                id="push-symbol"
                type="text"
                value={pushSymbol}
                onChange={(e) => setPushSymbol(e.target.value)}
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="Push Symbol(s) (e.g., a, abc, ε)"
              />
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