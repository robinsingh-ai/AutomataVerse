'use client';

import { ControlPanelProps } from '../type';
import DraggablePanel from '../../../shared/components/DraggablePanel';
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
  isLoggedIn,
  onClearCanvas,
  problemMode,
  tapeMode,
  onTapeModeChange
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <DraggablePanel title="TM Control" defaultPosition={{ x: 20, y: 80 }}>
      <div className="space-y-4">
        {/* Problem Mode Indicator */}
        {problemMode && (
          <div className="mb-4 flex items-center gap-2 py-2 px-3 bg-opacity-10 bg-blue-500 dark:bg-opacity-20 rounded">
            <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className={`font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>Problem Mode</span>
          </div>
        )}
        
        {/* SECTION 1: Basic State Controls */}
        <div className="space-y-2">
          <button
            onClick={onAddNode}
            className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded transition-colors ${
              isDark 
                ? 'bg-gray-800 hover:bg-gray-700 text-white' 
                : 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-300'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add State</span>
          </button>
          
          {selectedNode && (
            <button
              onClick={onSetFinite}
              className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded transition-colors ${
                isDark
                  ? 'bg-gray-800 hover:bg-gray-700 text-white'
                  : 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-300'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Toggle Accepting State</span>
            </button>
          )}
        </div>
        
        {/* Tape Mode Selection - Make this visible in both normal and problem mode */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-gray-50 border border-gray-200'} p-3 rounded`}>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
              Tape Configuration
            </div>
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => onTapeModeChange('1-tape')}
              className={`flex-1 py-1.5 px-3 text-sm rounded transition-colors ${
                tapeMode === '1-tape'
                  ? isDark 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-blue-500 text-white'
                  : isDark
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300'
              }`}
            >
              1-Tape
            </button>
            <button
              onClick={() => onTapeModeChange('2-tape')}
              className={`flex-1 py-1.5 px-3 text-sm rounded transition-colors ${
                tapeMode === '2-tape'
                  ? isDark 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-blue-500 text-white'
                  : isDark
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300'
              }`}
            >
              2-Tape
            </button>
            <button
              onClick={() => onTapeModeChange('3-tape')}
              className={`flex-1 py-1.5 px-3 text-sm rounded transition-colors ${
                tapeMode === '3-tape'
                  ? isDark 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-blue-500 text-white'
                  : isDark
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300'
              }`}
            >
              3-Tape
            </button>
          </div>
        </div>
        
        {/* SECTION 2: Simulation Controls */}
        <div className={`pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex gap-2 mb-3">
            <button
              onClick={onRun}
              disabled={isRunning}
              className={`flex-1 flex items-center justify-center gap-1 py-2 rounded transition-colors ${
                isRunning
                  ? `${isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-100 text-gray-400'} cursor-not-allowed` 
                  : isDark
                    ? 'bg-gray-800 hover:bg-gray-700 text-green-400 hover:text-green-300'
                    : 'bg-white hover:bg-gray-100 text-green-600 hover:text-green-700 border border-gray-300'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Run</span>
            </button>
            <button
              onClick={onStep}
              disabled={isRunning}
              className={`flex-1 flex items-center justify-center gap-1 py-2 rounded transition-colors ${
                isRunning
                  ? `${isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-100 text-gray-400'} cursor-not-allowed`
                  : isDark
                    ? 'bg-gray-800 hover:bg-gray-700 text-blue-400 hover:text-blue-300'
                    : 'bg-white hover:bg-gray-100 text-blue-600 hover:text-blue-700 border border-gray-300'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
              <span>Step</span>
            </button>
            <button
              onClick={onReset}
              className={`flex-1 flex items-center justify-center gap-1 py-2 rounded transition-colors ${
                isDark
                  ? 'bg-gray-800 hover:bg-gray-700 text-red-400 hover:text-red-300'
                  : 'bg-white hover:bg-gray-100 text-red-600 hover:text-red-700 border border-gray-300'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Reset</span>
            </button>
          </div>
          
          {/* Input string section - now visible in all modes */}
          <div className="mt-3">
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Input String
              </div>
            </label>
            <input
              type="text"
              placeholder="Enter String"
              value={inputString}
              onChange={(e) => onInputChange(e.target.value)}
              readOnly={isRunning || isRunningStepWise}
              className={`w-full px-3 py-2 rounded transition-colors ${
                isDark
                  ? 'bg-gray-800 border-gray-700 focus:border-blue-500 text-white'
                  : 'bg-white border border-gray-300 focus:border-blue-500 text-gray-900'
              } ${
                (isRunning || isRunningStepWise) ? 'opacity-50 cursor-not-allowed' : ''
              } focus:ring-1 focus:ring-blue-500 focus:outline-none`}
            />
          </div>
          
          {isRunningStepWise && (
            <div className="mt-2 flex items-center gap-1.5">
              <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Step: {stepIndex}
              </p>
            </div>
          )}
          
          {validationResult && (
            <div className={`mt-3 p-3 rounded ${
              validationResult.includes("Accept") 
                ? isDark ? 'bg-green-900 bg-opacity-30 text-green-100' : 'bg-green-50 text-green-800 border border-green-200'
                : isDark ? 'bg-red-900 bg-opacity-30 text-red-100' : 'bg-red-50 text-red-800 border border-red-200'
            } flex items-start gap-2`}>
              <span className="mt-0.5">
                {validationResult.includes("Accept") ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </span>
              <span>{validationResult}</span>
            </div>
          )}
        </div>
        
        {/* SECTION 3: Canvas Controls */}
        <div className={`pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <button
            onClick={onValidate}
            className={`w-full mb-2 flex items-center justify-center gap-2 py-2 px-4 rounded transition-colors ${
              isDark
                ? 'bg-gray-800 hover:bg-gray-700 text-indigo-400 hover:text-indigo-300'
                : 'bg-white hover:bg-gray-100 text-indigo-600 hover:text-indigo-700 border border-gray-300'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Validate TM</span>
          </button>
          
          <button
            onClick={onClearCanvas}
            className={`w-full mb-2 flex items-center justify-center gap-2 py-2 px-4 rounded transition-colors ${
              isDark
                ? 'bg-gray-800 hover:bg-gray-700 text-red-400 hover:text-red-300'
                : 'bg-white hover:bg-gray-100 text-red-600 hover:text-red-700 border border-gray-300'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Clear Canvas</span>
          </button>
          
          <label className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <input
              type="checkbox"
              checked={showGrid}
              onChange={onToggleGrid}
              className={`rounded focus:ring-blue-500 ${
                isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              }`}
            />
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
              <span>Show Grid</span>
            </div>
          </label>
        </div>
        
        {/* SECTION 4: Save/Load Controls - Only shown when not in problem mode */}
        {!problemMode && (
          <div className={`pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            {onLoadJson && (
              <button
                onClick={onLoadJson}
                className={`w-full mb-2 flex items-center justify-center gap-2 py-2 px-4 rounded transition-colors ${
                  isDark
                    ? 'bg-gray-800 hover:bg-gray-700 text-purple-400 hover:text-purple-300'
                    : 'bg-white hover:bg-gray-100 text-purple-600 hover:text-purple-700 border border-gray-300'
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span>Load TM from JSON</span>
              </button>
            )}
            
            {isLoggedIn && onSave && (
              <button
                onClick={onSave}
                className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded transition-colors ${
                  isDark
                    ? 'bg-gray-800 hover:bg-gray-700 text-teal-400 hover:text-teal-300'
                    : 'bg-white hover:bg-gray-100 text-teal-600 hover:text-teal-700 border border-gray-300'
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                <span>Save Machine</span>
              </button>
            )}
          </div>
        )}
      </div>
    </DraggablePanel>
  );
};

export default ControlPanel;