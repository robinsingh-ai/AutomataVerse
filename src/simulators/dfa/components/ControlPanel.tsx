'use client';

import { useState } from 'react';
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

  return (
    <div className="fixed z-10">
      <div className={`transition-all duration-300 bg-white shadow-lg rounded-r-lg p-4 ${showPanel ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">DFA Simulator</h2>
          <div className="space-y-2">
            <button
              onClick={onAddNode}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
            >
              Add Node
            </button>
            
            {selectedNode && (
              <button
                onClick={onSetFinite}
                className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-4 rounded"
              >
                Toggle Final State
              </button>
            )}
            
            <div className="pt-4 border-t border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Input String
              </label>
              <input
                type="text"
                placeholder="Enter String"
                value={inputString}
                maxLength={38}
                readOnly={isRunning || isRunningStepWise}
                onChange={(e) => onInputChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex space-x-2 pt-2">
              <button
                onClick={onRun}
                disabled={isRunning}
                className={`flex-1 py-2 px-4 rounded font-semibold ${
                  isRunning 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                Run
              </button>
              <button
                onClick={onStep}
                disabled={isRunning}
                className={`flex-1 py-2 px-4 rounded font-semibold ${
                  isRunning 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                Step
              </button>
              <button
                onClick={onReset}
                className="flex-1 py-2 px-4 rounded font-semibold bg-red-500 hover:bg-red-600 text-white"
              >
                Reset
              </button>
            </div>
            
            <div className="pt-2">
              <label className="flex items-center space-x-2 text-sm">
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
                  ? "bg-green-100 text-green-800" 
                  : "bg-red-100 text-red-800"
              }`}>
                {validationResult}
              </div>
            )}
            
            {isRunningStepWise && inputString && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Current Index: {stepIndex}</p>
                <div className="flex flex-wrap gap-1">
                  {inputString.split('').map((char, index) => (
                    <span
                      key={index}
                      className={`inline-block w-8 h-8 flex items-center justify-center border rounded
                        ${index === stepIndex 
                          ? 'bg-red-500 text-white border-red-600' 
                          : 'bg-white text-black border-gray-300'
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
        className="absolute top-0 -right-10 bg-blue-500 text-white p-2 rounded-r-lg"
      >
        {showPanel ? '◀' : '▶'}
      </button>
    </div>
  );
};

export default ControlPanel;