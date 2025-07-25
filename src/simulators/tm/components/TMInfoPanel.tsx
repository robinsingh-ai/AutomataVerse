'use client';

import React from 'react';
import DraggablePanel from '../../../shared/components/DraggablePanel';
import { useTheme } from '../../../app/context/ThemeContext';
import { TapeMode } from '../type';

interface TMInfoPanelProps {
  states: string[];
  initialState: string | null;
  finalStates: string[];
  inputSymbols: string[];
  tapeSymbols: string[];
  currentState: string | null;
  tapeMode: TapeMode;
}

const TMInfoPanel: React.FC<TMInfoPanelProps> = ({
  states,
  initialState,
  finalStates,
  inputSymbols,
  tapeSymbols,
  currentState,
  tapeMode
}) => {
  const { theme } = useTheme();
  
  return (
    <DraggablePanel title="TM Information" defaultPosition={{ x: 20, y: 380 }} width={250}>
      <div className="space-y-4">
        <div>
          <h3 className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Machine Type:
          </h3>
          <div className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
            {tapeMode}
          </div>
        </div>
        
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
            Accepting States:
          </h3>
          <div className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
            {finalStates.length > 0 ? finalStates.join(', ') : 'None'}
          </div>
        </div>
        
        <div>
          <h3 className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Input Alphabet:
          </h3>
          <div className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
            {inputSymbols.length > 0 ? inputSymbols.join(', ') : 'None'}
          </div>
        </div>
        
        <div>
          <h3 className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Tape Alphabet:
          </h3>
          <div className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
            {tapeSymbols.length > 0 ? tapeSymbols.join(', ') : 'None'}
          </div>
        </div>
        
        {currentState && (
          <div>
            <h3 className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Current State:
            </h3>
            <div className={`p-2 rounded ${
              finalStates.includes(currentState)
                ? theme === 'dark' ? "bg-green-800" : "bg-green-100"
                : theme === 'dark' ? "bg-gray-700" : "bg-gray-100"
            }`}>
              {currentState}
              {finalStates.includes(currentState) && 
                <span className={`ml-2 text-xs ${theme === 'dark' ? "text-green-300" : "text-green-800"}`}>
                  (Accepting)
                </span>
              }
            </div>
          </div>
        )}
      </div>
    </DraggablePanel>
  );
};

export default TMInfoPanel;