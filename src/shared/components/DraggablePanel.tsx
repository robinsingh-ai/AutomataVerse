'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTheme } from '../../app/context/ThemeContext';

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
  width = 250
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
      className={`fixed z-50 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
      ${theme === 'dark' 
        ? 'bg-gradient-dark-secondary border border-dark-border shadow-dark-lg' 
        : 'bg-gradient-light-primary border border-light-border shadow-lg'
      } 
      rounded-xl overflow-hidden backdrop-blur-sm transition-all duration-300 ease-out
      ${isDragging ? 'scale-105' : 'hover:shadow-xl'}
      animate-fade-in glass-panel`}
      style={{ 
        width: `${width}px`, 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        background: theme === 'dark' 
          ? 'linear-gradient(135deg, rgba(26, 29, 35, 0.95) 0%, rgba(37, 42, 50, 0.95) 100%)'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 250, 251, 0.95) 100%)',
      }}
      onMouseDown={handleMouseDown}
    >
      <div 
        className={`panel-header flex items-center justify-between px-4 py-3
        ${theme === 'dark' 
          ? 'bg-gradient-dark-tertiary border-b border-dark-border' 
          : 'bg-gradient-light-secondary border-b border-light-border'
        } transition-colors duration-300`}
      >
        <h3 className={`font-semibold truncate text-sm
          ${theme === 'dark' ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
          {title}
        </h3>
        <div className="flex space-x-1">
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className={`p-2 rounded-lg transition-all duration-200 btn-enhanced focus-ring
              ${theme === 'dark'
                ? 'hover:bg-dark-accent text-dark-text-secondary hover:text-dark-text-primary'
                : 'hover:bg-light-accent text-light-text-secondary hover:text-light-text-primary'
              }`}
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
      
      <div className={`panel-content ${isMinimized ? 'hidden' : 'block'} p-4 
        ${theme === 'dark' ? 'text-dark-text-secondary' : 'text-light-text-secondary'}
        transition-all duration-300 animate-slide-up`}>
        {children}
      </div>
    </div>
  );
};

export default DraggablePanel;