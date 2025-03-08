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
  stack,
  onSave,
  isLoggedIn,
  onClearCanvas
}) => {
  const { theme } = useTheme();
  
  return (
    <DraggablePanel title="PDA Control" defaultPosition={{ x: 20, y: 80 }}>
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
                  : 'bg-gray-600 hover:bg-gray-700 text-white'
              }`}
            >
              Toggle Accepting State
            </button>
          )}
          
          <button
            onClick={onLoadJson}
            className={`w-full font-semibold py-2 px-4 rounded ${
              theme === 'dark'
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'bg-purple-500 hover:bg-purple-600 text-white'
            }`}
          >
            Load PDA from JSON
          </button>
          
          <button
            onClick={onValidate}
            className={`w-full font-semibold py-2 px-4 rounded ${
              theme === 'dark'
                ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                : 'bg-yellow-500 hover:bg-yellow-600 text-white'
            }`}
          >
            Validate PDA
          </button>
          
          {isLoggedIn && onSave && (
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
              : validationResult.includes("Accept")
                ? theme === 'dark' ? "bg-green-800 text-green-100" : "bg-green-100 text-green-800"
                : validationResult.includes("Reject")
                  ? theme === 'dark' ? "bg-red-800 text-red-100" : "bg-red-100 text-red-800"
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