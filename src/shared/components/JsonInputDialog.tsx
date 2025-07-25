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
      width={420}
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
        
        <div className={`flex gap-2 justify-end pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <button
            onClick={onClose}
            className={`flex items-center justify-center gap-2 py-2 px-4 rounded transition-colors ${
              isDark
                ? 'bg-gray-800 hover:bg-gray-700 text-red-400 hover:text-red-300'
                : 'bg-white hover:bg-gray-100 text-red-600 hover:text-red-700 border border-gray-300'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Cancel</span>
          </button>
          <button
            onClick={onSubmit}
            disabled={!value.trim()}
            className={`flex items-center justify-center gap-2 py-2 px-4 rounded transition-colors ${
              !value.trim()
                ? `${isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-100 text-gray-400'} cursor-not-allowed`
                : isDark
                  ? 'bg-gray-800 hover:bg-gray-700 text-purple-400 hover:text-purple-300'
                  : 'bg-white hover:bg-gray-100 text-purple-600 hover:text-purple-700 border border-gray-300'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span>Load {simulatorType}</span>
          </button>
        </div>
      </div>
    </DraggablePanel>
  );
};

export default JsonInputDialog;
