'use client';

import React from 'react';
import DraggablePanel from './DraggablePanel';
import { useTheme } from '../../../app/context/ThemeContext';
import { MachineType } from '../type';

interface FSMInfoPanelProps {
  states: string[];
  initialState: string | null;
  finalStates: string[];
  inputAlphabet: string[];
  outputAlphabet: string[];
  currentState: string | null;
  currentStateOutput: string | null;
  machineType: MachineType;
}

const FSMInfoPanel: React.FC<FSMInfoPanelProps> = ({
  states,
  initialState,
  finalStates,
  inputAlphabet,
  outputAlphabet,
  currentState,
  currentStateOutput,
  machineType
}) => {
  const { theme } = useTheme();
  
  return (
    <DraggablePanel title="FSM Information" defaultPosition={{ x: 20, y: 380 }} width={250}>
      <div className="space-y-4">
        <div>
          <h3 className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Machine Type:
          </h3>
          <div className={`p-2 rounded ${theme === 'dark' ? 'bg-blue-800' : 'bg-blue-100'}`}>
            {machineType} Machine
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
            Final States:
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
            {inputAlphabet.length > 0 ? inputAlphabet.join(', ') : 'None'}
          </div>
        </div>
        
        <div>
          <h3 className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Output Alphabet:
          </h3>
          <div className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
            {outputAlphabet.length > 0 ? outputAlphabet.join(', ') : 'None'}
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
                  (Final)
                </span>
              }
            </div>
          </div>
        )}
        
        {machineType === 'Moore' && currentStateOutput && (
          <div>
            <h3 className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Current Output:
            </h3>
            <div className={`p-2 rounded ${theme === 'dark' ? 'bg-blue-800' : 'bg-blue-100'}`}>
              {currentStateOutput}
            </div>
          </div>
        )}
      </div>
    </DraggablePanel>
  );
};

export default FSMInfoPanel;