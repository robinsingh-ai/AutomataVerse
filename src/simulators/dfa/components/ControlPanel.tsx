'use client';

import { ControlPanelProps } from '../type';
import DraggablePanel from './DraggablePanel';
import { useTheme } from '../../../app/context/ThemeContext';

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
  onReset,
  onLoadJson,
  onValidate,
  onSave,
  onClearCanvas,
  isLoggedIn,
  isProblemMode
}) => {
  const { theme } = useTheme();
  
  return (
    <DraggablePanel title="DFA Control" defaultPosition={{ x: 20, y: 80 }}>
      <div className="space-y-4">
        <div className="space-y-2">
          <button
            onClick={onAddNode}
            className={`w-full font-semibold py-2 px-4 rounded ${
              theme === 'dark' 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            Add State
          </button>
          
          {selectedNode && (
            <button
              onClick={onSetFinite}
              className={`w-full font-semibold py-2 px-4 rounded ${
                theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-800 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              }`}
            >
              Toggle Accepting State
            </button>
          )}
          
          <div className="flex space-x-2">
            <button
              onClick={onRun}
              disabled={isRunning}
              className={`flex-1 font-semibold py-2 px-4 rounded ${
                isRunning
                  ? theme === 'dark'
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : theme === 'dark'
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              Run
            </button>
            
            <button
              onClick={onStep}
              disabled={isRunning && !isRunningStepWise}
              className={`flex-1 font-semibold py-2 px-4 rounded ${
                isRunning && !isRunningStepWise
                  ? theme === 'dark'
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : theme === 'dark'
                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                  : 'bg-yellow-500 hover:bg-yellow-600 text-white'
              }`}
            >
              Step
            </button>
            
            <button
              onClick={onReset}
              className={`flex-1 font-semibold py-2 px-4 rounded ${
                theme === 'dark'
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              Reset
            </button>
          </div>
          
          <button
            onClick={onClearCanvas}
            className={`w-full font-semibold py-2 px-4 rounded ${
              theme === 'dark'
                ? 'bg-red-700 hover:bg-red-800 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            Clear Canvas
          </button>
          
          <button
            onClick={() => onToggleGrid()}
            className={`w-full font-semibold py-2 px-4 rounded ${
              theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-800 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
            }`}
          >
            {showGrid ? 'Hide Grid' : 'Show Grid'}
          </button>
          
          <button
            onClick={onValidate}
            className={`w-full font-semibold py-2 px-4 rounded ${
              theme === 'dark'
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                : 'bg-indigo-500 hover:bg-indigo-600 text-white'
            }`}
          >
            Validate DFA
          </button>
          
          {/* Only show load/save buttons in regular mode */}
          {!isProblemMode && (
            <>
              {onLoadJson && (
                <button
                  onClick={onLoadJson}
                  className={`w-full font-semibold py-2 px-4 rounded ${
                    theme === 'dark'
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'bg-purple-500 hover:bg-purple-600 text-white'
                  }`}
                >
                  Load DFA from JSON
                </button>
              )}
              
              {onSave && isLoggedIn && (
                <button
                  onClick={onSave}
                  className={`w-full font-semibold py-2 px-4 rounded ${
                    theme === 'dark'
                      ? 'bg-teal-600 hover:bg-teal-700 text-white'
                      : 'bg-teal-500 hover:bg-teal-600 text-white'
                  }`}
                >
                  Save DFA
                </button>
              )}
            </>
          )}
        </div>
        
        <div className="space-y-2">
          <div
            className={`text-sm font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            Input String:
          </div>
          
          <input
            type="text"
            value={inputString}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Enter input string..."
            className={`w-full px-3 py-2 border rounded ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          />
          
          {stepIndex > 0 && (
            <div
              className={`text-sm font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Step: {stepIndex}
            </div>
          )}
        </div>
        
        {validationResult && (
          <div
            className={`p-3 text-center rounded ${
              validationResult === 'Input Accepted'
                ? theme === 'dark'
                  ? 'bg-green-900 text-green-100'
                  : 'bg-green-100 text-green-800'
                : validationResult === 'Input Rejected'
                ? theme === 'dark'
                  ? 'bg-red-900 text-red-100'
                  : 'bg-red-100 text-red-800'
                : theme === 'dark'
                ? 'bg-yellow-900 text-yellow-100'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {validationResult}
          </div>
        )}
        
        {isProblemMode && (
          <div className={`p-3 text-center rounded ${theme === 'dark' ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-800'}`}>
            <span className="font-medium">Practice Mode</span>
            <p className="text-sm mt-1">You're working on a DFA practice problem.</p>
          </div>
        )}
      </div>
    </DraggablePanel>
  );
};

export default ControlPanel;