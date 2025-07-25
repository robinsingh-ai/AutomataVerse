'use client';

import React from 'react';
import DraggablePanel from './DraggablePanel';
import { useTheme } from '../../app/context/ThemeContext';

interface JsonInputDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  value: string;
  onChange: (value: string) => void;
  simulatorType: 'DFA' | 'NFA' | 'PDA' | 'TM' | 'FSM';
  placeholder?: string;
  title?: string;
}

const JsonInputDialog: React.FC<JsonInputDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  value,
  onChange,
  simulatorType,
  placeholder,
  title
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (!isOpen) return null;

  const defaultPlaceholder = `Enter ${simulatorType} JSON configuration...`;
  const defaultTitle = `Load ${simulatorType} from JSON`;

  return (
    <DraggablePanel 
      title={title || defaultTitle} 
      defaultPosition={{ x: 100, y: 100 }} 
      width={500}
    >
      <div className="space-y-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            JSON Configuration
          </label>
          <textarea
            placeholder={placeholder || defaultPlaceholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full h-64 p-3 rounded border resize-none font-mono text-sm ${
              isDark
                ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
            } focus:ring-1 focus:ring-blue-500 focus:outline-none`}
          />
          <p className={`mt-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Paste your {simulatorType} configuration in JSON format
          </p>
        </div>
        
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              isDark
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={!value.trim()}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              !value.trim()
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Load {simulatorType}
          </button>
        </div>
      </div>
    </DraggablePanel>
  );
};

export default JsonInputDialog;
