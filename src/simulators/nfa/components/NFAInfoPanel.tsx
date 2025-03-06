'use client';

import React from 'react';
import DraggablePanel from './DraggablePanel';
import { useTheme } from '../../../app/context/ThemeContext';

interface NFAInfoPanelProps {
  states: string[];
  initialState: string | null;
  finalStates: string[];
  inputSymbols: string[];
  currentStates: string[];
  currentPosition: number;
  inputString: string;
  allowEpsilon: boolean;
}

const NFAInfoPanel: React.FC<NFAInfoPanelProps> = ({
  states,
  initialState,
  finalStates,
  inputSymbols,
  currentStates,
  currentPosition,
  inputString,
  allowEpsilon
}) => {
  const { theme } = useTheme();
  
  return (
    <DraggablePanel title="Nondeterministic Finite Automaton Information" defaultPosition={{ x: 20, y: 380 }} width={320}>
      <div className="space-y-4">
        <div>
          <h3 className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Type:
          </h3>
          <div className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
            {allowEpsilon ? 'ε-NFA (with epsilon transitions)' : 'NFA (without epsilon transitions)'}
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
            {allowEpsilon && ' (+ ε)'}
          </div>
        </div>
        
        {currentStates.length > 0 && (
          <>
            <div>
              <h3 className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Current States:
              </h3>
              <div className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                {currentStates.map((stateId, index) => (
                  <span key={stateId} className={finalStates.includes(stateId) 
                    ? theme === 'dark' ? 'text-green-400' : 'text-green-600' 
                    : ''
                  }>
                    {stateId}{index < currentStates.length - 1 ? ', ' : ''}
                    {finalStates.includes(stateId) && 
                      <span className={`ml-1 text-xs ${theme === 'dark' ? "text-green-300" : "text-green-700"}`}>
                        (Accepting)
                      </span>
                    }
                  </span>
                ))}
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

export default NFAInfoPanel;