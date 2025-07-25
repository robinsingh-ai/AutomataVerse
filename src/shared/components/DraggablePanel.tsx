'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTheme } from '../../app/context/ThemeContext';
import { useResponsive } from '../../app/context/ResponsiveContext';

interface DraggablePanelProps {
  children: React.ReactNode;
  title: string;
  defaultPosition?: { x: number; y: number };
  width?: number;
  collapsible?: boolean;
  dockPosition?: 'left' | 'right' | 'top' | 'bottom';
  stackOrder?: number;
}

const DraggablePanel: React.FC<DraggablePanelProps> = ({
  children,
  title,
  defaultPosition = { x: 20, y: 80 },
  width = 250,
  collapsible = true,
  dockPosition = 'left',
  stackOrder = 0
}) => {
  const [position, setPosition] = useState(defaultPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const { theme } = useTheme();
  const { isMobile, isTablet, panelLayout, screenWidth, screenHeight, isTouch } = useResponsive();

  // Calculate responsive dimensions and positioning
  const getResponsiveStyles = useCallback(() => {
    const baseWidth = isMobile ? Math.min(screenWidth - 40, 300) : width;
    const maxHeight = screenHeight - 120;
    
    switch (panelLayout) {
      case 'stacked':
        return {
          position: 'relative' as const,
          width: '100%',
          maxWidth: baseWidth,
          maxHeight,
          top: 'auto',
          left: 'auto',
          transform: 'none',
          margin: '10px auto',
          zIndex: 10 + stackOrder,
        };
      case 'docked':
        const dockStyles = {
          position: 'fixed' as const,
          width: baseWidth,
          maxHeight,
          zIndex: 40 + stackOrder,
        };
        switch (dockPosition) {
          case 'left':
            return { ...dockStyles, left: 10, top: 80 };
          case 'right':
            return { ...dockStyles, right: 10, top: 80 };
          case 'top':
            return { ...dockStyles, top: 10, left: '50%', transform: 'translateX(-50%)' };
          case 'bottom':
            return { ...dockStyles, bottom: 10, left: '50%', transform: 'translateX(-50%)' };
          default:
            return { ...dockStyles, left: 10, top: 80 };
        }
      case 'floating':
      default:
        return {
          position: 'fixed' as const,
          width: baseWidth,
          maxHeight,
          left: position.x,
          top: position.y,
          zIndex: 50 + stackOrder,
        };
    }
  }, [isMobile, panelLayout, screenWidth, screenHeight, width, position, dockPosition, stackOrder]);

  // Handle touch and mouse dragging
  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    // Only allow dragging in floating mode and on header
    if (panelLayout !== 'floating' || !(e.target as HTMLElement).closest('.panel-header')) return;
    
    setIsDragging(true);
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    dragStartRef.current = {
      x: clientX - position.x,
      y: clientY - position.y
    };
  };

  const handlePointerMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging || panelLayout !== 'floating') return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const newX = clientX - dragStartRef.current.x;
    const newY = clientY - dragStartRef.current.y;
    
    // Get panel dimensions
    if (panelRef.current) {
      const panelWidth = panelRef.current.offsetWidth;
      const panelHeight = panelRef.current.offsetHeight;
      
      // Keep panel within viewport bounds with mobile-safe margins
      const margin = isMobile ? 10 : 0;
      const boundedX = Math.max(margin, Math.min(screenWidth - panelWidth - margin, newX));
      const boundedY = Math.max(margin, Math.min(screenHeight - panelHeight - margin, newY));
      
      setPosition({ x: boundedX, y: boundedY });
    }
  }, [isDragging, panelLayout, isMobile, screenWidth, screenHeight]);

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Handle window resize to keep panel in bounds
  const handleWindowResize = useCallback(() => {
    if (panelRef.current && panelLayout === 'floating') {
      const panelWidth = panelRef.current.offsetWidth;
      const panelHeight = panelRef.current.offsetHeight;
      const margin = isMobile ? 10 : 0;
      
      setPosition(prev => ({
        x: Math.min(prev.x, screenWidth - panelWidth - margin),
        y: Math.min(prev.y, screenHeight - panelHeight - margin)
      }));
    }
  }, [panelLayout, isMobile, screenWidth, screenHeight]);

  useEffect(() => {
    const addEventListeners = () => {
      if (isTouch) {
        window.addEventListener('touchmove', handlePointerMove as EventListener, { passive: false });
        window.addEventListener('touchend', handlePointerUp);
      } else {
        window.addEventListener('mousemove', handlePointerMove as EventListener);
        window.addEventListener('mouseup', handlePointerUp);
      }
      window.addEventListener('resize', handleWindowResize);
    };
    
    const removeEventListeners = () => {
      window.removeEventListener('touchmove', handlePointerMove as EventListener);
      window.removeEventListener('touchend', handlePointerUp);
      window.removeEventListener('mousemove', handlePointerMove as EventListener);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('resize', handleWindowResize);
    };
    
    addEventListeners();
    return removeEventListeners;
  }, [isDragging, handlePointerMove, handleWindowResize, isTouch]);

  const responsiveStyles = getResponsiveStyles();
  const canDrag = panelLayout === 'floating' && !isMobile;
  
  return (
    <div 
      ref={panelRef}
      className={`${panelLayout === 'stacked' ? 'relative' : 'fixed'} z-50 
      ${canDrag ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : ''}
      ${theme === 'dark' 
        ? 'bg-gradient-dark-secondary border border-dark-border shadow-dark-lg' 
        : 'bg-gradient-light-primary border border-light-border shadow-lg'
      } 
      ${isMobile ? 'rounded-lg' : 'rounded-xl'} overflow-hidden backdrop-blur-sm 
      transition-all duration-300 ease-out
      ${isDragging ? 'scale-105' : (panelLayout === 'floating' ? 'hover:shadow-xl' : '')}
      ${panelLayout === 'stacked' ? 'mb-4' : ''}
      animate-fade-in glass-panel`}
      style={{ 
        ...responsiveStyles,
        transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        background: theme === 'dark' 
          ? 'linear-gradient(135deg, rgba(26, 29, 35, 0.95) 0%, rgba(37, 42, 50, 0.95) 100%)'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 250, 251, 0.95) 100%)',
      }}
      onMouseDown={handlePointerDown}
      onTouchStart={handlePointerDown}
    >
      <div 
        className={`panel-header flex items-center justify-between px-4 py-3
        ${theme === 'dark' 
          ? 'bg-gradient-dark-tertiary border-b border-dark-border' 
          : 'bg-gradient-light-secondary border-b border-light-border'
        } transition-colors duration-300 ${canDrag ? 'cursor-grab' : ''}`}
      >
        <h3 className={`font-semibold truncate ${isMobile ? 'text-xs' : 'text-sm'}
          ${theme === 'dark' ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
          {title}
        </h3>
        <div className="flex space-x-1">
          {(collapsible || isMobile) && (
            <button 
              onClick={() => isMobile ? setIsCollapsed(!isCollapsed) : setIsMinimized(!isMinimized)}
              className={`p-2 rounded-lg transition-all duration-200 btn-enhanced focus-ring
                ${theme === 'dark'
                  ? 'hover:bg-dark-accent text-dark-text-secondary hover:text-dark-text-primary'
                  : 'hover:bg-light-accent text-light-text-secondary hover:text-light-text-primary'
                }`}
              aria-label={(isMobile ? isCollapsed : isMinimized) ? "Expand" : "Collapse"}
            >
              {(isMobile ? isCollapsed : isMinimized) ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
      
      <div className={`panel-content 
        ${(isMobile ? isCollapsed : isMinimized) ? 'hidden' : 'block'} 
        ${isMobile ? 'p-3' : 'p-4'} 
        ${theme === 'dark' ? 'text-dark-text-secondary' : 'text-light-text-secondary'}
        transition-all duration-300 animate-slide-up
        ${isMobile ? 'max-h-96 overflow-y-auto' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default DraggablePanel;