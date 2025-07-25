'use client';

import React from 'react';
import DraggablePanel from '../../../shared/components/DraggablePanel';
import { useTheme } from '../../../app/context/ThemeContext';
import { MachineType } from '../type';

interface FSMInfoPanelProps {
  symbols: {
    inputAlphabet: string[];
    outputAlphabet: string[];
  };
  nodeCount: number;
  finalStates: string[];
  transitionCount: number;
  machineType: MachineType;
}

const FSMInfoPanel: React.FC<FSMInfoPanelProps> = ({
  symbols,
  nodeCount,
  finalStates,
  transitionCount,
  machineType
}) => {
  const { theme } = useTheme();
  
  return (
    <DraggablePanel title="FSM Information" defaultPosition={{ x: 20, y: 350 }} width={250}>
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
            Count: {nodeCount}
          </div>
        </div>
        
        <div>
          <h3 className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Initial State:
          </h3>
          <div className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
            {nodeCount > 0 ? 'q0' : 'None'}
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
            {symbols.inputAlphabet.length > 0 ? symbols.inputAlphabet.join(', ') : 'None'}
          </div>
        </div>
        
        <div>
          <h3 className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Output Alphabet:
          </h3>
          <div className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
            {symbols.outputAlphabet.length > 0 ? symbols.outputAlphabet.join(', ') : 'None'}
          </div>
        </div>
        
        <div>
          <h3 className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Transitions:
          </h3>
          <div className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
            Count: {transitionCount}
          </div>
        </div>
      </div>
    </DraggablePanel>
  );
};

export default FSMInfoPanel;