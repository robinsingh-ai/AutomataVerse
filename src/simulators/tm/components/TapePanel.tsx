'use client';

import React from 'react';
import DraggablePanel from '../../../shared/components/DraggablePanel';
import { useTheme } from '../../../app/context/ThemeContext';
import { Tape, TapeMode } from '../type';

interface TapePanelProps {
  tape: Tape;
  index: number;
  tapeMode: TapeMode;
  isRunning: boolean;
}

const TapePanel: React.FC<TapePanelProps> = ({ tape, index, tapeMode, isRunning }) => {
  const { theme } = useTheme();
  
  // Function to render a single tape
  const renderTape = () => {
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
    
    // Create an array of positions to display
    const displayPositions = [];
    for (let i = minPosition; i <= maxPosition; i++) {
      displayPositions.push(i);
    }
    
    return (
      <div className={`${
        isRunning && index === 0 ? 'border-2 border-green-500 dark:border-green-600' : ''
      }`}>
        <div className={`mb-2 text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          {tapeMode === '1-tape' ? 'Tape' : `Tape ${index + 1}`}
        </div>
        
        <div className="overflow-x-auto">
          <div className="flex min-w-full">
            {displayPositions.map((position) => (
              <div 
                key={position}
                className={`w-10 h-10 flex items-center justify-center border ${
                  position === tape.headPosition
                    ? theme === 'dark'
                      ? 'bg-blue-700 text-white border-blue-500'
                      : 'bg-blue-100 border-blue-500'
                    : theme === 'dark'
                      ? 'bg-gray-700 border-gray-600'
                      : 'bg-white border-gray-200'
                }`}
              >
                {tape.content.get(position) || '□'}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <DraggablePanel 
      title={`Tape #${index + 1}`} 
      defaultPosition={{ 
        x: window.innerWidth - 340, 
        y: 80 + (index * 240) 
      }} 
      width={320}
    >
      <div className="space-y-2">
        {renderTape()}
        
        <div className={`text-xs italic ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          □ represents the blank symbol
        </div>
      </div>
    </DraggablePanel>
  );
};

export default TapePanel;