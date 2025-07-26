'use client';

import { useResponsive } from '../../../app/context/ResponsiveContext';
import { useTheme } from '../../../app/context/ThemeContext';
import DraggablePanel from '../../../shared/components/DraggablePanel';
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
  onReset,
  onLoadJson,
  onValidate,
  onSave,
  onClearCanvas,
  isLoggedIn,
  isProblemMode
}) => {
  const { theme } = useTheme();
  const { isMobile, isSmallMobile } = useResponsive();

  const isDark = theme === 'dark';

  return (
    <DraggablePanel
      title="DFA Control"
      defaultPosition={{ x: 20, y: 130 }}
      mobilePriority="high"
    >
      <div className="space-y-3">
        {/* Problem Mode Indicator */}
        {isProblemMode && (
          <div className="mb-3 flex items-center gap-2 py-1.5 px-2 bg-opacity-10 bg-blue-500 dark:bg-opacity-20 rounded text-sm">
            <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className={`font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>Problem Mode</span>
          </div>
        )}

        {/* SECTION 1: Basic State Controls */}
        <div className="space-y-2">
          <button
            onClick={onAddNode}
            className={`w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded transition-colors text-sm touch-target mobile-control-btn ${isDark
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
              className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded transition-colors touch-target mobile-control-btn ${isDark
                  ? 'bg-gray-800 hover:bg-gray-700 text-white'
                  : 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-300'
                }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className={isSmallMobile ? 'text-xs' : 'text-sm'}>Toggle Accepting State</span>
            </button>
          )}
        </div>

        {/* SECTION 2: Simulation Controls */}
        <div className={`pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className={`${isMobile ? 'grid grid-cols-2 gap-2' : 'flex gap-2'} mb-3`}>
            <button
              onClick={onRun}
              disabled={isRunning}
              className={`${isMobile ? 'col-span-1' : 'flex-1'} flex items-center justify-center gap-1 py-2 rounded transition-colors touch-target mobile-control-btn ${isRunning
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
              <span className={isSmallMobile ? 'text-xs' : 'text-sm'}>Run</span>
            </button>

            <button
              onClick={onStep}
              disabled={isRunningStepWise}
              className={`${isMobile ? 'col-span-1' : 'flex-1'} flex items-center justify-center gap-1 py-2 rounded transition-colors touch-target mobile-control-btn ${isRunningStepWise
                  ? `${isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-100 text-gray-400'} cursor-not-allowed`
                  : isDark
                    ? 'bg-gray-800 hover:bg-gray-700 text-blue-400 hover:text-blue-300'
                    : 'bg-white hover:bg-gray-100 text-blue-600 hover:text-blue-700 border border-gray-300'
                }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className={isSmallMobile ? 'text-xs' : 'text-sm'}>Step</span>
            </button>
          </div>

          {/* Input String Field */}
          <div className="mb-3">
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Input String
            </label>
            <input
              type="text"
              value={inputString}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder="Enter input string..."
              className={`w-full px-3 py-2 rounded border transition-colors mobile-input ${isDark
                  ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                } focus:outline-none focus:ring-1 focus:ring-blue-500`}
            />
          </div>

          {/* Validation Result */}
          {validationResult && (
            <div className={`p-2 rounded text-sm mb-3 ${validationResult.includes('accepted')
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
              {validationResult}
            </div>
          )}

          {/* Step Counter */}
          {isRunningStepWise && (
            <div className={`text-sm mb-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Step: {stepIndex}
            </div>
          )}
        </div>

        {/* SECTION 3: Utility Controls */}
        <div className={`pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className={`${isMobile ? 'grid grid-cols-2 gap-2' : 'flex flex-wrap gap-2'}`}>
            <button
              onClick={onReset}
              className={`${isMobile ? 'col-span-1' : 'flex-1'} flex items-center justify-center gap-1 py-2 px-3 rounded transition-colors touch-target mobile-control-btn ${isDark
                  ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400 hover:text-yellow-300'
                  : 'bg-white hover:bg-gray-100 text-yellow-600 hover:text-yellow-700 border border-gray-300'
                }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className={isSmallMobile ? 'text-xs' : 'text-sm'}>Reset</span>
            </button>

            <button
              onClick={onToggleGrid}
              className={`${isMobile ? 'col-span-1' : 'flex-1'} flex items-center justify-center gap-1 py-2 px-3 rounded transition-colors touch-target mobile-control-btn ${showGrid
                  ? (isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                  : isDark
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                    : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300'
                }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span className={isSmallMobile ? 'text-xs' : 'text-sm'}>Grid</span>
            </button>

            <button
              onClick={onValidate}
              className={`${isMobile ? 'col-span-1' : 'flex-1'} flex items-center justify-center gap-1 py-2 px-3 rounded transition-colors touch-target mobile-control-btn ${isDark
                  ? 'bg-gray-800 hover:bg-gray-700 text-purple-400 hover:text-purple-300'
                  : 'bg-white hover:bg-gray-100 text-purple-600 hover:text-purple-700 border border-gray-300'
                }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className={isSmallMobile ? 'text-xs' : 'text-sm'}>Validate</span>
            </button>

            <button
              onClick={onClearCanvas}
              className={`${isMobile ? 'col-span-1' : 'flex-1'} flex items-center justify-center gap-1 py-2 px-3 rounded transition-colors touch-target mobile-control-btn ${isDark
                  ? 'bg-gray-800 hover:bg-gray-700 text-red-400 hover:text-red-300'
                  : 'bg-white hover:bg-gray-100 text-red-600 hover:text-red-700 border border-gray-300'
                }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span className={isSmallMobile ? 'text-xs' : 'text-sm'}>Clear</span>
            </button>
          </div>
        </div>

        {/* SECTION 4: Advanced Controls (Collapsible on Mobile) */}
        <div className={`pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className={`${isMobile ? 'grid grid-cols-1 gap-2' : 'flex flex-wrap gap-2'}`}>
            <button
              onClick={onLoadJson}
              className={`${isMobile ? 'w-full' : 'flex-1'} flex items-center justify-center gap-1 py-2 px-3 rounded transition-colors touch-target mobile-control-btn ${isDark
                  ? 'bg-gray-800 hover:bg-gray-700 text-cyan-400 hover:text-cyan-300'
                  : 'bg-white hover:bg-gray-100 text-cyan-600 hover:text-cyan-700 border border-gray-300'
                }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              <span className={isSmallMobile ? 'text-xs' : 'text-sm'}>Load JSON</span>
            </button>

            {isLoggedIn && (
              <button
                onClick={onSave}
                className={`${isMobile ? 'w-full' : 'flex-1'} flex items-center justify-center gap-1 py-2 px-3 rounded transition-colors touch-target mobile-control-btn ${isDark
                    ? 'bg-gray-800 hover:bg-gray-700 text-green-400 hover:text-green-300'
                    : 'bg-white hover:bg-gray-100 text-green-600 hover:text-green-700 border border-gray-300'
                  }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                <span className={isSmallMobile ? 'text-xs' : 'text-sm'}>Save</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </DraggablePanel>
  );
};

export default ControlPanel;