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
  onValidate
}) => {
  const { theme } = useTheme();
  
  return (
    <DraggablePanel title="NFA Control" defaultPosition={{ x: 20, y: 80 }}>
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
            Add Node
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
            onClick={onLoadJson}
            className={`w-full font-semibold py-2 px-4 rounded ${
              theme === 'dark'
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'bg-purple-500 hover:bg-purple-600 text-white'
            }`}
          >
            Load NFA from JSON
          </button>
          
          <button
            onClick={onValidate}
            className={`w-full font-semibold py-2 px-4 rounded ${
              theme === 'dark'
                ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                : 'bg-yellow-500 hover:bg-yellow-600 text-white'
            }`}
          >
            Validate NFA
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
            validationResult.includes("Valid") 
              ? theme === 'dark' ? "bg-green-800 text-green-100" : "bg-green-100 text-green-800"
              : theme === 'dark' ? "bg-red-800 text-red-100" : "bg-red-100 text-red-800"
          }`}>
            {validationResult}
          </div>
        )}
        
        {isRunningStepWise && inputString && (
          <div className="mt-4">
            <p className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Current Index: {stepIndex}
            </p>
            <div className="flex flex-wrap gap-1">
              {inputString.split('').map((char, index) => (
                <span
                  key={index}
                  className={`inline-block w-8 h-8 flex items-center justify-center border rounded
                    ${index === stepIndex 
                      ? theme === 'dark' 
                        ? 'bg-red-600 text-white border-red-700'
                        : 'bg-red-500 text-white border-red-600'
                      : theme === 'dark'
                        ? 'bg-gray-700 text-white border-gray-600'
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
    </DraggablePanel>
  );
};

export default ControlPanel;