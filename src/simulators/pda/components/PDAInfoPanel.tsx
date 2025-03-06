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
  currentState: string | null;
  currentPosition: number;
  inputString: string;
}

const PDAInfoPanel: React.FC<PDAInfoPanelProps> = ({
  states,
  initialState,
  finalStates,
  inputSymbols,
  stackSymbols,
  currentState,
  currentPosition,
  inputString
}) => {
  const { theme } = useTheme();
  
  return (
    <DraggablePanel title="Pushdown Automaton Information" defaultPosition={{ x: 20, y: 380 }} width={280}>
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
            {inputSymbols.length > 0 ? inputSymbols.join(', ') : 'None'}{inputSymbols.length > 0 && ', ε'}
          </div>
        </div>
        
        <div>
          <h3 className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Stack Alphabet:
          </h3>
          <div className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
            {stackSymbols.length > 0 ? stackSymbols.join(', ') : 'None'}{stackSymbols.length > 0 && ', ε'}
          </div>
        </div>
        
        {currentState && (
          <>
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
            
            <div>
              <h3 className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Input Position:
              </h3>
              <div className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} font-mono`}>
                {inputString && (
                  <>
                    {inputString.substring(0, currentPosition)}
                    <span className={`${theme === 'dark' ? 'text-red-400' : 'text-red-600'} font-bold`}>
                      {inputString[currentPosition] || ''}
                    </span>
                    {inputString.substring(currentPosition + 1)}
                  </>
                )}
                {!inputString && 'No input string'}
              </div>
            </div>
          </>
        )}
      </div>
    </DraggablePanel>
  );
};

export default PDAInfoPanel;