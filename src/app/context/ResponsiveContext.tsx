'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface ResponsiveContextType {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  screenHeight: number;
  orientation: 'portrait' | 'landscape';
  panelLayout: 'floating' | 'docked' | 'stacked';
  isTouch: boolean;
  setPanelLayout: (layout: 'floating' | 'docked' | 'stacked') => void;
}

const ResponsiveContext = createContext<ResponsiveContextType | undefined>(undefined);

export const useResponsive = () => {
  const context = useContext(ResponsiveContext);
  if (context === undefined) {
    throw new Error('useResponsive must be used within a ResponsiveProvider');
  }
  return context;
};

interface ResponsiveProviderProps {
  children: React.ReactNode;
}

export const ResponsiveProvider: React.FC<ResponsiveProviderProps> = ({ children }) => {
  const [screenWidth, setScreenWidth] = useState(0);
  const [screenHeight, setScreenHeight] = useState(0);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('landscape');
  const [panelLayout, setPanelLayout] = useState<'floating' | 'docked' | 'stacked'>('floating');
  const [isTouch, setIsTouch] = useState(false);

  // Calculate responsive properties
  const isMobile = screenWidth < 768;
  const isTablet = screenWidth >= 768 && screenWidth < 1024;
  const isDesktop = screenWidth >= 1024;

  const updateScreenDimensions = useCallback(() => {
    if (typeof window !== 'undefined') {
      setScreenWidth(window.innerWidth);
      setScreenHeight(window.innerHeight);
      setOrientation(window.innerWidth > window.innerHeight ? 'landscape' : 'portrait');
      
      // Auto-adjust panel layout based on screen size
      if (window.innerWidth < 768) {
        setPanelLayout('stacked');
      } else if (window.innerWidth < 1024) {
        setPanelLayout('docked');
      } else {
        setPanelLayout('floating');
      }
    }
  }, []);

  const detectTouch = useCallback(() => {
    setIsTouch(
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      // @ts-ignore
      navigator.msMaxTouchPoints > 0
    );
  }, []);

  useEffect(() => {
    updateScreenDimensions();
    detectTouch();

    const handleResize = () => {
      updateScreenDimensions();
    };

    const handleOrientationChange = () => {
      // Delay to ensure dimensions are updated after orientation change
      setTimeout(updateScreenDimensions, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [updateScreenDimensions, detectTouch]);

  const value: ResponsiveContextType = {
    isMobile,
    isTablet,
    isDesktop,
    screenWidth,
    screenHeight,
    orientation,
    panelLayout,
    isTouch,
    setPanelLayout,
  };

  return (
    <ResponsiveContext.Provider value={value}>
      {children}
    </ResponsiveContext.Provider>
  );
};
