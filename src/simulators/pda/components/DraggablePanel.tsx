'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTheme } from '../../../app/context/ThemeContext';

interface DraggablePanelProps {
  children: React.ReactNode;
  title: string;
  defaultPosition?: { x: number; y: number };
  width?: number;
}

const DraggablePanel: React.FC<DraggablePanelProps> = ({
  children,
  title,
  defaultPosition = { x: 20, y: 80 },
  width = 300
}) => {
  const [position, setPosition] = useState(defaultPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const { theme } = useTheme();

  // Handle dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only start drag on header
    if (!(e.target as HTMLElement).closest('.panel-header')) return;
    
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStartRef.current.x;
    const newY = e.clientY - dragStartRef.current.y;
    
    // Get panel dimensions
    if (panelRef.current) {
      const panelWidth = panelRef.current.offsetWidth;
      
      // Keep panel within viewport bounds
      const boundedX = Math.max(0, Math.min(window.innerWidth - panelWidth, newX));
      const boundedY = Math.max(0, Math.min(window.innerHeight - 40, newY));
      
      setPosition({ x: boundedX, y: boundedY });
    }
  }, [isDragging]);

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle window resize to keep panel in bounds
  const handleWindowResize = useCallback(() => {
    if (panelRef.current) {
      const panelWidth = panelRef.current.offsetWidth;
      
      setPosition(prev => ({
        x: Math.min(prev.x, window.innerWidth - panelWidth),
        y: Math.min(prev.y, window.innerHeight - 40)
      }));
    }
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('resize', handleWindowResize);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [isDragging, handleMouseMove, handleWindowResize]);

  return (
    <div 
      ref={panelRef}
      className={`fixed z-30 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} 
      ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} 
      shadow-lg rounded-lg overflow-hidden`}
      style={{ 
        width: `${width}px`, 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        transition: isDragging ? 'none' : 'all 0.2s ease',
      }}
      onMouseDown={handleMouseDown}
    >
      <div 
        className={`panel-header flex items-center justify-between px-4 py-2 
        ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}
      >
        <h3 className="font-semibold truncate">{title}</h3>
        <div className="flex space-x-2">
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 rounded hover:bg-gray-600 hover:text-white transition-colors"
            aria-label={isMinimized ? "Maximize" : "Minimize"}
          >
            {isMinimized ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      <div className={`panel-content ${isMinimized ? 'hidden' : 'block'} p-4`}>
        {children}
      </div>
    </div>
  );
};

export default DraggablePanel;