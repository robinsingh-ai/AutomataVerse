'use client';

import React from 'react';
import DraggablePanel from '../../../shared/components/DraggablePanel';
import { useTheme } from '../../../app/context/ThemeContext';
import { Stack } from '../type';

interface StackPanelProps {
  stack: Stack;
}

const StackPanel: React.FC<StackPanelProps> = ({ stack }) => {
  const { theme } = useTheme();
  
  return (
    <DraggablePanel title="Stack" defaultPosition={{ x: window.innerWidth - 200, y: 80 }} width={180}>
      <div className="space-y-2">
        <h3 className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          Current Stack (top to bottom):
        </h3>
        <div className="flex flex-col-reverse space-y-reverse space-y-1">
          {stack.content.length > 0 ? (
            stack.content.map((symbol, index) => (
              <div
                key={index}
                className={`p-3 border ${
                  index === 0 
                    ? theme === 'dark' ? 'border-red-500 bg-gray-700' : 'border-red-600 bg-gray-100'
                    : theme === 'dark' ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white'
                } rounded-md flex justify-center items-center font-mono`}
              >
                {symbol}
                {index === 0 && (
                  <span className={`ml-2 text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                    (top)
                  </span>
                )}
                {index === stack.content.length - 1 && (
                  <span className={`ml-2 text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                    (bottom)
                  </span>
                )}
              </div>
            ))
          ) : (
            <div className={`p-3 border ${
              theme === 'dark' ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white'
            } rounded-md flex justify-center items-center font-mono text-gray-500`}>
              Empty stack
            </div>
          )}
        </div>
        
        <div className={`mt-4 text-xs italic ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          Z is the bottom marker of the stack
        </div>
      </div>
    </DraggablePanel>
  );
};

export default StackPanel;