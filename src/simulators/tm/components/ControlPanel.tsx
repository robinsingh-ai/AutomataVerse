'use client';

import { ControlPanelProps, TapeMode } from '../type';
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
  tapeMode,
  onTapeModeChange,
  tapes,
  onSave,
  isLoggedIn,
  onClearCanvas,
  problemMode
}) => {
  const { theme } = useTheme();
  
  return (
    <DraggablePanel title="TM Control" defaultPosition={{ x: 20, y: 80 }}>
      <div className="space-y-4">
        {/* Problem Mode Indicator */}
        {problemMode && (
          <div className="mb-4 py-2 px-3 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Problem Mode</span>
            </div>
          </div>
        )}
        
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
              Toggle Accepting State
            </button>
          )}
          
          {/* Only show Load JSON button if not in problem mode */}
          {onLoadJson && !problemMode && (
            <button
              onClick={onLoadJson}
              className={`w-full font-semibold py-2 px-4 rounded ${
                theme === 'dark'
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-purple-500 hover:bg-purple-600 text-white'
              }`}
            >
              Load TM from JSON
            </button>
          )}
          
          <button
            onClick={onValidate}
            className={`w-full font-semibold py-2 px-4 rounded ${
              theme === 'dark'
                ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                : 'bg-yellow-500 hover:bg-yellow-600 text-white'
            }`}
          >
            Validate TM
          </button>
          
          {/* Only show Save button if not in problem mode and is logged in */}
          {isLoggedIn && onSave && !problemMode && (
            <button
              onClick={onSave}
              className={`w-full font-semibold py-2 px-4 rounded ${
                theme === 'dark'
                  ? 'bg-teal-600 hover:bg-teal-700 text-white'
                  : 'bg-teal-500 hover:bg-teal-600 text-white'
              }`}
            >
              Save Machine
            </button>
          )}
          
          <button
            onClick={onClearCanvas}
            className={`w-full font-semibold py-2 px-4 rounded ${
              theme === 'dark'
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            Clear Canvas
          </button>
        </div>
        
        {/* Tape Mode Selection - always visible */}
        <div className={`pt-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Tape Configuration
          </label>
          <div className="flex space-x-2">
            <button
              onClick={() => onTapeModeChange('1-tape')}
              className={`flex-1 py-1 px-2 text-sm rounded ${
                tapeMode === '1-tape'
                  ? theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                  : theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              1-Tape
            </button>
            <button
              onClick={() => onTapeModeChange('2-tape')}
              className={`flex-1 py-1 px-2 text-sm rounded ${
                tapeMode === '2-tape'
                  ? theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                  : theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              2-Tape
            </button>
            <button
              onClick={() => onTapeModeChange('3-tape')}
              className={`flex-1 py-1 px-2 text-sm rounded ${
                tapeMode === '3-tape'
                  ? theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                  : theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              3-Tape
            </button>
          </div>
        </div>
        
        {/* Only show input string section if not in problem mode */}
        {!problemMode && (
          <div className={`pt-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
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
        
        <div className="flex space-x-2 pt-2">
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
        
        <div className="pt-2">
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
        
        {validationResult && (
          <div className={`mt-4 p-2 rounded ${
            validationResult.includes("Valid") && !validationResult.includes("Invalid")
              ? theme === 'dark' ? "bg-green-800 text-green-100" : "bg-green-100 text-green-800"
              : theme === 'dark' ? "bg-red-800 text-red-100" : "bg-red-100 text-red-800"
          }`}>
            {validationResult}
          </div>
        )}
        
        {isRunningStepWise && inputString && (
          <div className="mt-4">
            <p className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Step: {stepIndex}
            </p>
          </div>
        )}
      </div>
    </DraggablePanel>
  );
};

export default ControlPanel;