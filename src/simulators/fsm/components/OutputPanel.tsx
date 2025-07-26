'use client';

import React from 'react';
import DraggablePanel from '../../../shared/components/DraggablePanel';
import { useTheme } from '../../../app/context/ThemeContext';
import { MachineType } from '../type';

interface OutputPanelProps {
  machineType: MachineType;
  outputSequence: string[];
  inputString?: string;
  currentIndex?: number;
}

const OutputPanel: React.FC<OutputPanelProps> = ({ 
  machineType,
  outputSequence, 
  inputString = '',
  currentIndex = 0
}) => {
  const { theme } = useTheme();
  
  return (
    <DraggablePanel 
      title={`Output (${machineType} Machine)`} 
      defaultPosition={{ x: typeof window !== 'undefined' ? window.innerWidth - 270 : 800, y: 80 }} 
      width={220}
    >
      <div className="space-y-4">
        {/* Input string display - only show if inputString is provided */}
        {inputString && (
          <div>
            <h3 className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Input String:
            </h3>
            <div className="flex overflow-x-auto mb-1">
              {inputString.split('').map((symbol, index) => (
                <div
                  key={index}
                  className={`flex-shrink-0 w-10 h-10 flex items-center justify-center border
                    ${index === currentIndex 
                      ? `border-2 ${theme === 'dark' ? 'border-red-500' : 'border-red-600'}`
                      : `border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`
                    } ${
                      index < currentIndex
                        ? `${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`
                        : `${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`
                    }`}
                >
                  {symbol}
                </div>
              ))}
            </div>
            
            {/* Position indicators */}
            <div className="flex overflow-x-auto">
              {inputString.split('').map((_, index) => (
                <div
                  key={index}
                  className={`flex-shrink-0 w-10 h-6 flex items-center justify-center text-xs
                    ${index === currentIndex
                      ? theme === 'dark' ? 'text-red-400' : 'text-red-600'
                      : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}
                >
                  {index}
                </div>
              ))}
            </div>
            
            {/* Current position indicator */}
            <div className="flex overflow-x-auto">
              {inputString.split('').map((_, index) => (
                <div
                  key={index}
                  className={`flex-shrink-0 w-10 h-6 flex items-center justify-center`}
                >
                  {index === currentIndex && (
                    <svg className={`w-6 h-6 ${theme === 'dark' ? 'text-red-500' : 'text-red-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Output sequence display */}
        <div>
          <h3 className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Output Sequence:
          </h3>
          {outputSequence.length > 0 ? (
            <>
              <div className="flex overflow-x-auto">
                {outputSequence.map((output, index) => (
                  <div
                    key={index}
                    className={`flex-shrink-0 w-10 h-10 flex items-center justify-center border
                      ${index === outputSequence.length - 1 
                        ? `border-2 ${theme === 'dark' ? 'border-green-500' : 'border-green-600'}`
                        : `border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`
                      } ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}
                  >
                    {output}
                  </div>
                ))}
              </div>
              
              {/* Position indicators */}
              <div className="flex overflow-x-auto">
                {outputSequence.map((_, index) => (
                  <div
                    key={index}
                    className={`flex-shrink-0 w-10 h-6 flex items-center justify-center text-xs
                      ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
                  >
                    {index}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className={`p-3 rounded text-center ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
              No output sequence yet. Run the machine to generate output.
            </div>
          )}
        </div>
      </div>
    </DraggablePanel>
  );
};

export default OutputPanel;