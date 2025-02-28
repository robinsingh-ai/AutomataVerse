'use client';

import { useState, useRef, useEffect } from 'react';
import { ControlPanelProps } from '../type';

const ControlPanel: React.FC<ControlPanelProps> = ({
  onAddNode,
  onSetFinite,
  onRun,
  onStep,
  onInputChange,
  inputString,
  validationResult,
  selectedNode,
  isRunning,
  isRunningStepWise,
  showGrid,
  onToggleGrid,
  stepIndex,
  onReset
}) => {
  const [showPanel, setShowPanel] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Use effect to focus input when panel opens
  useEffect(() => {
    if (showPanel && inputRef.current && !isRunning && !isRunningStepWise) {
      inputRef.current.focus();
    }
  }, [showPanel, isRunning, isRunningStepWise]);

  return (
    <div className="fixed z-10">
      <div className={`transition-all duration-300 bg-white dark:bg-gray-800 shadow-lg rounded-r-lg p-4 max-w-xs ${showPanel ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-white flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            DFA Simulator
          </h2>
          <div className="space-y-3">
            <button
              onClick={onAddNode}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-150 ease-in-out flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Node
            </button>
            
            {selectedNode && (
              <button
                onClick={onSetFinite}
                className="w-full bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded transition duration-150 ease-in-out flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Toggle Final State
              </button>
            )}
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Input String
              </label>
              <input
                ref={inputRef}
                type="text"
                placeholder="Enter String"
                value={inputString}
                maxLength={38}
                readOnly={isRunning || isRunningStepWise}
                onChange={(e) => onInputChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex space-x-2 pt-2">
              <button
                onClick={onRun}
                disabled={isRunning || !inputString.trim()}
                className={`flex-1 py-2 px-4 rounded font-semibold transition duration-150 ease-in-out ${
                  isRunning || !inputString.trim()
                    ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' 
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                <div className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Run
                </div>
              </button>
              <button
                onClick={onStep}
                disabled={isRunning || !inputString.trim()}
                className={`flex-1 py-2 px-4 rounded font-semibold transition duration-150 ease-in-out ${
                  isRunning || !inputString.trim()
                    ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                <div className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                  Step
                </div>
              </button>
              <button
                onClick={onReset}
                className="flex-1 py-2 px-4 rounded font-semibold bg-red-500 hover:bg-red-600 text-white transition duration-150 ease-in-out"
              >
                <div className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset
                </div>
              </button>
            </div>
            
            <div className="pt-2">
              <label className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={showGrid}
                  onChange={onToggleGrid}
                  className="rounded text-blue-500 focus:ring-blue-500"
                />
                <span>Show Grid</span>
              </label>
            </div>
            
            {validationResult && (
              <div className={`mt-4 p-2 rounded ${
                validationResult.includes("Valid") 
                  ? "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400" 
                  : "bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400"
              }`}>
                {validationResult}
              </div>
            )}
            
            {isRunningStepWise && inputString && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Index: {stepIndex}</p>
                <div className="flex flex-wrap gap-1">
                  {inputString.split('').map((char, index) => (
                    <span
                      key={index}
                      className={`inline-block w-8 h-8 flex items-center justify-center border rounded
                        ${index === stepIndex 
                          ? 'bg-blue-500 text-white border-blue-600' 
                          : index < stepIndex
                            ? 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
                            : 'bg-white text-black dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600'
                        }`}
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="absolute top-2 -right-10 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-r-lg shadow-md transition duration-150 ease-in-out"
        aria-label={showPanel ? 'Hide control panel' : 'Show control panel'}
      >
        {showPanel ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default ControlPanel;