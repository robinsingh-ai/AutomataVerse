'use client';

import React from 'react';
import DraggablePanel from './DraggablePanel';
import { useTheme } from '../../../app/context/ThemeContext';

interface PDAInfoPanelProps {
  states: string[];
  initialState: string | null;
  finalStates: string[];
  inputSymbols: string[];
  stackSymbols: string[];
  currentStates: string[];
  stackContent: string[];
}

const PDAInfoPanel: React.FC<PDAInfoPanelProps> = ({
  states,
  initialState,
  finalStates,
  inputSymbols,
  stackSymbols,
  currentStates,
  stackContent
}) => {
  const { theme } = useTheme();
  
  return (
    <DraggablePanel title="PDA Information" defaultPosition={{ x: 20, y: 380 }} width={250}>
      <div className="space-y-4">
        <div>
          <h3 className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            States:
          </h3>
          <div className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
            {states.length > 0 ? states.join(', ') : 'None'}
          </div>
        </div>
        
        <div>
          <h3 className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Initial State:
          </h3>
          <div className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
            {initialState || 'None'}
          </div>
        </div>
        
        <div>
          <h3 className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Final States:
          </h3>
          <div className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
            {finalStates.length > 0 ? finalStates.join(', ') : 'None'}
          </div>
        </div>
        
        <div>
          <h3 className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Input Symbols:
          </h3>
          <div className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
            {inputSymbols.length > 0 ? inputSymbols.join(', ') : 'None'}
          </div>
        </div>
        
        <div>
          <h3 className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Stack Symbols:
          </h3>
          <div className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
            {stackSymbols.length > 0 ? stackSymbols.join(', ') : 'None'}
          </div>
        </div>
        
        {currentStates.length > 0 && (
          <div>
            <h3 className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Current Active States:
            </h3>
            <div className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
              {currentStates.join(', ')}
            </div>
          </div>
        )}
        
        {stackContent.length > 0 && (
          <div>
            <h3 className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Stack Content (top → bottom):
            </h3>
            <div className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} overflow-x-auto`}>
              {stackContent.join(' ')}
            </div>
          </div>
        )}
      </div>
    </DraggablePanel>
  );
};

export default PDAInfoPanel;