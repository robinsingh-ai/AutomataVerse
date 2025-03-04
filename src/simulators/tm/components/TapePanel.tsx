'use client';

import React from 'react';
import DraggablePanel from './DraggablePanel';
import { useTheme } from '../../../app/context/ThemeContext';
import { Tape, TapeMode } from '../type';

interface TapePanelProps {
  tapes: Tape[];
  tapeMode: TapeMode;
}

const TapePanel: React.FC<TapePanelProps> = ({ tapes, tapeMode }) => {
  const { theme } = useTheme();
  
  // Function to render a single tape
  const renderTape = (tape: Tape, index: number) => {
    // Get all positions from the tape content
    const positions = Array.from(tape.content.keys());
    
    // Find min and max positions to display
    const minPosition = Math.min(
      tape.headPosition - 5,
      positions.length > 0 ? Math.min(...positions) : 0
    );
    const maxPosition = Math.max(
      tape.headPosition + 5,
      positions.length > 0 ? Math.max(...positions) : 0
    );
    
    // Generate a range of positions to display
    const displayRange = Array.from(
      { length: maxPosition - minPosition + 1 },
      (_, i) => i + minPosition
    );
    
    return (
      <div key={index} className="mb-6">
        <h3 className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          Tape {index + 1}:
        </h3>
        <div className="flex flex-col">
          {/* Tape cells */}
          <div className="flex overflow-x-auto pb-2">
            {displayRange.map(pos => (
              <div
                key={pos}
                className={`flex-shrink-0 w-10 h-10 flex items-center justify-center border 
                  ${pos === tape.headPosition
                    ? `border-2 ${theme === 'dark' ? 'border-red-500' : 'border-red-600'}`
                    : `border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`
                  } ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-white'
                  }`}
              >
                {tape.content.has(pos) ? tape.content.get(pos) : '□'}
              </div>
            ))}
          </div>
          
          {/* Position indicators */}
          <div className="flex overflow-x-auto">
            {displayRange.map(pos => (
              <div
                key={pos}
                className={`flex-shrink-0 w-10 h-6 flex items-center justify-center text-xs
                  ${pos === tape.headPosition
                    ? theme === 'dark' ? 'text-red-400' : 'text-red-600'
                    : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}
              >
                {pos}
              </div>
            ))}
          </div>
          
          {/* Head indicator */}
          <div className="flex overflow-x-auto">
            {displayRange.map(pos => (
              <div
                key={pos}
                className={`flex-shrink-0 w-10 h-6 flex items-center justify-center`}
              >
                {pos === tape.headPosition && (
                  <svg className={`w-6 h-6 ${theme === 'dark' ? 'text-red-500' : 'text-red-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <DraggablePanel title="Turing Machine Tapes" defaultPosition={{ x: window.innerWidth - 340, y: 80 }} width={320}>
      <div className="space-y-2">
        {tapes.map((tape, index) => renderTape(tape, index))}
        
        <div className={`text-xs italic ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          □ represents the blank symbol
        </div>
      </div>
    </DraggablePanel>
  );
};

export default TapePanel;