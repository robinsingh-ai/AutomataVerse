'use client';

import { useState, useEffect, useRef } from 'react';
import { InputPopupProps } from '../type';
import { useTheme } from '../../../app/context/ThemeContext';

const InputPopup: React.FC<InputPopupProps> = ({ isOpen, onClose, onSubmit, tapeMode }) => {
  const { theme } = useTheme();
  const [tapeOperations, setTapeOperations] = useState<string[]>([]);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Initialize tape operations based on tape mode
  useEffect(() => {
    if (isOpen) {
      // Reset tape operations when the popup opens
      const numTapes = tapeMode === '1-tape' ? 1 : tapeMode === '2-tape' ? 2 : 3;
      const initialTapeOps = Array(numTapes).fill(',,');
      setTapeOperations(initialTapeOps);
      
      // Focus the first input
      if (firstInputRef.current) {
        firstInputRef.current.focus();
      }
    }
  }, [isOpen, tapeMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if all tape operations are complete (have 3 parts)
    const isValid = tapeOperations.every(op => {
      const parts = op.split(',');
      return parts.length === 3 && parts.every(part => part !== undefined);
    });
    
    if (!isValid) {
      alert('Please fill in all fields. Each tape operation must have read symbol, write symbol, and direction (L/R/S).');
      return;
    }
    
    // Join tape operations with semicolons
    const transitionValue = tapeOperations.join(';');
    onSubmit(transitionValue);
  };

  const updateTapeOperation = (index: number, field: 'read' | 'write' | 'direction', value: string): void => {
    // Ensure tapeOperations[index] exists
    if (index >= tapeOperations.length) {
      const newOps = [...tapeOperations];
      while (newOps.length <= index) {
        newOps.push(',,');
      }
      setTapeOperations(newOps);
    }
    
    // Get current parts
    const currentOp = tapeOperations[index] || ',,';
    const parts = currentOp.split(',');
    while (parts.length < 3) {
      parts.push('');
    }
    
    // Update the specific field
    if (field === 'read') parts[0] = value;
    else if (field === 'write') parts[1] = value;
    else if (field === 'direction') parts[2] = value;
    
    // Update the state
    const newOps = [...tapeOperations];
    newOps[index] = parts.join(',');
    setTapeOperations(newOps);
  };

  // Helper function to render a tape operation input
  const renderTapeOperation = (index: number) => {
    // Safely get parts, providing defaults if undefined
    const currentOp = tapeOperations[index] || ',,';
    const parts = currentOp.split(',');
    const readSymbol = parts[0] || '';
    const writeSymbol = parts[1] || '';
    const direction = parts[2] || '';
    
    return (
      <div key={index} className="mb-6 p-4 border rounded-lg bg-opacity-25 bg-gray-100 dark:bg-gray-800">
        <h3 className={`text-sm font-bold mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          Tape {index + 1}
        </h3>
        
        <div className="grid grid-cols-3 gap-3">
          {/* Read Symbol */}
          <div>
            <label 
              htmlFor={`read-symbol-${index}`} 
              className={`block text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Read
            </label>
            <input
              id={`read-symbol-${index}`}
              ref={index === 0 ? firstInputRef : undefined}
              type="text"
              value={readSymbol}
              onChange={(e) => updateTapeOperation(index, 'read', e.target.value)}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              placeholder="e.g., a, b, □"
            />
          </div>
          
          {/* Write Symbol */}
          <div>
            <label 
              htmlFor={`write-symbol-${index}`} 
              className={`block text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Write
            </label>
            <input
              id={`write-symbol-${index}`}
              type="text"
              value={writeSymbol}
              onChange={(e) => updateTapeOperation(index, 'write', e.target.value)}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              placeholder="e.g., a, b, □"
            />
          </div>
          
          {/* Direction */}
          <div>
            <label 
              htmlFor={`direction-${index}`} 
              className={`block text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Move
            </label>
            <select
              id={`direction-${index}`}
              value={direction}
              onChange={(e) => updateTapeOperation(index, 'direction', e.target.value)}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="">Select</option>
              <option value="L">Left (L)</option>
              <option value="R">Right (R)</option>
              <option value="S">Stay (S)</option>
            </select>
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  const numTapes = tapeMode === '1-tape' ? 1 : tapeMode === '2-tape' ? 2 : 3;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className={`rounded-lg shadow-lg p-6 w-full max-w-lg ${
        theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        <h2 className="text-xl font-semibold mb-4">Enter TM Transition</h2>
        <form onSubmit={handleSubmit}>
          <div className="max-h-[70vh] overflow-y-auto pr-2">
            {Array.from({ length: numTapes }).map((_, index) => renderTapeOperation(index))}
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