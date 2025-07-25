'use client';

import React from 'react';
import DraggablePanel from '../../../shared/components/DraggablePanel';
import { useTheme } from '../../../app/context/ThemeContext';

interface StackPanelProps {
  stack: string[];
}

const StackPanel: React.FC<StackPanelProps> = ({ stack }) => {
  const { theme } = useTheme();
  
  return (
    <DraggablePanel title="PDA Stack" defaultPosition={{ x: window.innerWidth - 220, y: 80 }} width={200}>
      <div className="space-y-4">
        <div>
          <h3 className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Stack Content (Top → Bottom):
          </h3>
          <div className="flex flex-col-reverse items-center">
            {stack.length === 0 ? (
              <div className={`w-full p-2 text-center rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                Empty Stack (Z)
              </div>
            ) : (
              stack.map((symbol, index) => (
                <div 
                  key={index}
                  className={`w-full p-2 text-center border ${
                    index === 0 
                      ? `border-2 ${theme === 'dark' ? 'border-blue-500' : 'border-blue-400'}`
                      : `border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`
                  } ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                  } ${
                    index === 0 ? 'font-bold' : ''
                  }`}
                  style={{ 
                    marginBottom: index < stack.length - 1 ? '-1px' : '0',
                    borderTopLeftRadius: index === 0 ? '0.25rem' : '0',
                    borderTopRightRadius: index === 0 ? '0.25rem' : '0',
                    borderBottomLeftRadius: index === stack.length - 1 ? '0.25rem' : '0',
                    borderBottomRightRadius: index === stack.length - 1 ? '0.25rem' : '0'
                  }}
                >
                  {symbol}
                  {index === 0 && <span className="ml-2 text-xs text-blue-500">(Top)</span>}
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className={`text-xs italic ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          Empty stack is represented by symbol Z
        </div>
      </div>
    </DraggablePanel>
  );
};

export default StackPanel;