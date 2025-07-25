'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../app/context/ThemeContext';

export interface ExportOption {
  format: 'png' | 'svg';
  label: string;
  description: string;
  icon: React.ReactNode;
}

interface ExportDropdownProps {
  onExport: (format: 'png' | 'svg') => void;
  disabled?: boolean;
  className?: string;
}

const ExportDropdown: React.FC<ExportDropdownProps> = ({
  onExport,
  disabled = false,
  className = ''
}) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const exportOptions: ExportOption[] = [
    {
      format: 'png',
      label: 'Export as PNG',
      description: 'High-quality raster image',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      format: 'svg',
      label: 'Export as SVG',
      description: 'Scalable vector graphics',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleExport = (format: 'png' | 'svg') => {
    onExport(format);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Main Export Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all duration-300 btn-enhanced focus-ring card-hover ${
          disabled
            ? theme === 'dark'
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : theme === 'dark'
              ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white shadow-dark-md hover:shadow-dark-lg'
              : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white shadow-md hover:shadow-lg'
        }`}
        aria-label="Export diagram"
        aria-expanded={isOpen}
        aria-haspopup={true}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Export
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={`absolute top-full left-0 right-0 mt-2 rounded-xl shadow-xl backdrop-blur-sm transition-all duration-200 z-50 animate-fade-in ${
          theme === 'dark'
            ? 'bg-gradient-dark-secondary border border-dark-border'
            : 'bg-gradient-light-primary border border-light-border'
        }`}>
          <div className="p-2">
            {exportOptions.map((option) => (
              <button
                key={option.format}
                onClick={() => handleExport(option.format)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 btn-enhanced focus-ring ${
                  theme === 'dark'
                    ? 'hover:bg-dark-accent text-dark-text-secondary hover:text-dark-text-primary'
                    : 'hover:bg-light-accent text-light-text-secondary hover:text-light-text-primary'
                }`}
              >
                <div className={`flex-shrink-0 ${
                  theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                }`}>
                  {option.icon}
                </div>
                <div className="flex-1 text-left">
                  <div className={`font-medium text-sm ${
                    theme === 'dark' ? 'text-dark-text-primary' : 'text-light-text-primary'
                  }`}>
                    {option.label}
                  </div>
                  <div className={`text-xs ${
                    theme === 'dark' ? 'text-dark-text-tertiary' : 'text-light-text-tertiary'
                  }`}>
                    {option.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          {/* Export Settings Info */}
          <div className={`px-3 py-2 border-t text-xs ${
            theme === 'dark'
              ? 'border-dark-border text-dark-text-tertiary'
              : 'border-light-border text-light-text-tertiary'
          }`}>
            💡 Includes grid background and all labels
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportDropdown;
