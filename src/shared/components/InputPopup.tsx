'use client';

import React, { useState, useEffect } from 'react';
import DraggablePanel from './DraggablePanel';
import { useTheme } from '../../app/context/ThemeContext';

export interface InputField {
  name: string;
  label: string;
  placeholder: string;
  required?: boolean;
  type?: 'text' | 'select';
  options?: string[];
  helpText?: string;
}

interface InputPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: Record<string, string>) => void;
  title: string;
  fields: InputField[];
  submitLabel?: string;
  width?: number;
}

const InputPopup: React.FC<InputPopupProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  fields,
  submitLabel = "Add",
  width = 400
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when popup opens/closes
  useEffect(() => {
    if (isOpen) {
      setValues({});
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const newErrors: Record<string, string> = {};
    fields.forEach(field => {
      if (field.required && !values[field.name]?.trim()) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit the form
    onSubmit(values);
    onClose();
  };

  const handleInputChange = (fieldName: string, value: string) => {
    setValues(prev => ({
      ...prev,
      [fieldName]: value
    }));
    
    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }));
    }
  };

  return (
    <DraggablePanel 
      title={title} 
      defaultPosition={{ x: 200, y: 150 }} 
      width={width}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field) => (
          <div key={field.name}>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            
            {field.type === 'select' ? (
              <select
                value={values[field.name] || ''}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                className={`w-full px-3 py-2 rounded border transition-colors ${
                  isDark
                    ? 'bg-gray-800 border-gray-600 text-white focus:border-blue-500'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                } ${errors[field.name] ? 'border-red-500' : ''} focus:ring-1 focus:ring-blue-500 focus:outline-none`}
              >
                <option value="">{field.placeholder}</option>
                {field.options?.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                placeholder={field.placeholder}
                value={values[field.name] || ''}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                className={`w-full px-3 py-2 rounded border transition-colors ${
                  isDark
                    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                } ${errors[field.name] ? 'border-red-500' : ''} focus:ring-1 focus:ring-blue-500 focus:outline-none`}
              />
            )}
            
            {errors[field.name] && (
              <p className="mt-1 text-sm text-red-500">{errors[field.name]}</p>
            )}
            
            {field.helpText && (
              <p className={`mt-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {field.helpText}
              </p>
            )}
          </div>
        ))}
        
        <div className={`flex gap-2 justify-end pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <button
            type="button"
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
            type="submit"
            className={`flex items-center justify-center gap-2 py-2 px-4 rounded transition-colors ${
              isDark
                ? 'bg-gray-800 hover:bg-gray-700 text-green-400 hover:text-green-300'
                : 'bg-white hover:bg-gray-100 text-green-600 hover:text-green-700 border border-gray-300'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>{submitLabel}</span>
          </button>
        </div>
      </form>
    </DraggablePanel>
  );
};

export default InputPopup;
