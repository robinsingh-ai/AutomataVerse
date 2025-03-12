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
  onToggleEpsilon,
  allowEpsilon,
  onSave,
  onClearCanvas,
  isLoggedIn,
  isProblemMode
}) => {
  const { theme } = useTheme();
  
  return (
    <DraggablePanel title="NFA Control" defaultPosition={{ x: 20, y: 80 }}>
      <div className="space-y-4">
        {/* Problem Mode Indicator */}
        {isProblemMode && (
          <div className="mb-4 py-2 px-3 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Problem Mode</span>
            </div>
          </div>
        )}
        
        {/* SECTION 1: Basic State Controls */}
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
                  : 'bg-gray-600 hover:bg-gray-700 text-white'
              }`}
            >
              Toggle Final State
            </button>
          )}
          
          <button
            onClick={onToggleEpsilon}
            className={`w-full font-semibold py-2 px-4 rounded ${
              allowEpsilon 
                ? theme === 'dark' 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-green-500 hover:bg-green-600 text-white'
                : theme === 'dark' 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            {allowEpsilon ? 'Disable ε-transitions' : 'Enable ε-transitions'}
          </button>
        </div>
        
        {/* SECTION 2: Simulation Controls */}
        <div className={`pt-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex space-x-2 mb-2">
            <button
              onClick={onRun}
              disabled={isRunning}
              className={`flex-1 py-2 px-4 rounded font-semibold ${
                isRunning 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : theme === 'dark'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
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
                  : theme === 'dark'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              Step
            </button>
            <button
              onClick={onReset}
              className={`flex-1 py-2 px-4 rounded font-semibold ${
                theme === 'dark'
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              Reset
            </button>
          </div>
          
          {/* Only show input string section if not in problem mode */}
          {!isProblemMode && (
            <div className="mt-3">
              <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Input String
              </label>
              <input
                type="text"
                placeholder="Enter String"
                value={inputString}
                maxLength={38}
                readOnly={isRunning || isRunningStepWise}
                onChange={(e) => onInputChange(e.target.value)}
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } ${
                  (isRunning || isRunningStepWise) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              />
            </div>
          )}
          
          {isRunningStepWise && inputString && (
            <div className="mt-2">
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Step: {stepIndex}
              </p>
            </div>
          )}
          
          {validationResult && (
            <div className={`mt-3 p-3 text-center rounded ${
              validationResult.includes("Valid") && !validationResult.includes("Invalid")
                ? theme === 'dark' ? "bg-green-800 text-green-100" : "bg-green-100 text-green-800"
                : validationResult.includes("Accept")
                  ? theme === 'dark' ? "bg-green-800 text-green-100" : "bg-green-100 text-green-800"
                  : validationResult.includes("Reject")
                    ? theme === 'dark' ? "bg-red-800 text-red-100" : "bg-red-100 text-red-800"
                    : theme === 'dark' ? "bg-red-800 text-red-100" : "bg-red-100 text-red-800"
            }`}>
              {validationResult}
            </div>
          )}
        </div>
        
        {/* SECTION 3: Canvas Controls */}
        <div className={`pt-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <button
            onClick={onValidate}
            className={`w-full font-semibold py-2 px-4 rounded mb-2 ${
              theme === 'dark'
                ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                : 'bg-yellow-500 hover:bg-yellow-600 text-white'
            }`}
          >
            Validate NFA
          </button>
          
          <button
            onClick={onClearCanvas}
            className={`w-full font-semibold py-2 px-4 rounded mb-2 ${
              theme === 'dark'
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            Clear Canvas
          </button>
          
          <label className={`flex items-center space-x-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            <input
              type="checkbox"
              checked={showGrid}
              onChange={onToggleGrid}
              className={`rounded focus:ring-blue-500 ${
                theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              }`}
            />
            <span>Show Grid</span>
          </label>
        </div>
        
        {/* SECTION 4: Save/Load Controls - Only shown when not in problem mode */}
        {!isProblemMode && (
          <div className={`pt-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            {onLoadJson && (
              <button
                onClick={onLoadJson}
                className={`w-full font-semibold py-2 px-4 rounded mb-2 ${
                  theme === 'dark'
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-purple-500 hover:bg-purple-600 text-white'
                }`}
              >
                Load NFA from JSON
              </button>
            )}
            
            {isLoggedIn && onSave && (
              <button
                onClick={onSave}
                className={`w-full font-semibold py-2 px-4 rounded ${
                  theme === 'dark'
                    ? 'bg-teal-600 hover:bg-teal-700 text-white'
                    : 'bg-teal-500 hover:bg-teal-600 text-white'
                }`}
              >
                Save NFA
              </button>
            )}
          </div>
        )}
      </div>
    </DraggablePanel>
  );
};

export default ControlPanel;