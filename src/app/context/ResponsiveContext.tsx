'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface ResponsiveContextType {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isSmallMobile: boolean;
  isLargeMobile: boolean;
  screenWidth: number;
  screenHeight: number;
  orientation: 'portrait' | 'landscape';
  panelLayout: 'floating' | 'docked' | 'stacked';
  isTouch: boolean;
  isLandscape: boolean;
  isPortrait: boolean;
  setPanelLayout: (layout: 'floating' | 'docked' | 'stacked') => void;
  getOptimalPanelLayout: () => 'floating' | 'docked' | 'stacked';
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

  // Enhanced breakpoints for better mobile detection
  const isSmallMobile = screenWidth < 480;
  const isLargeMobile = screenWidth >= 480 && screenWidth < 768;
  const isMobile = screenWidth < 768;
  const isTablet = screenWidth >= 768 && screenWidth < 1024;
  const isDesktop = screenWidth >= 1024;
  const isLandscape = orientation === 'landscape';
  const isPortrait = orientation === 'portrait';

  const updateScreenDimensions = useCallback(() => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setScreenWidth(width);
      setScreenHeight(height);
      setOrientation(width > height ? 'landscape' : 'portrait');

      // Auto-adjust panel layout based on screen size and orientation
      const optimalLayout = getOptimalPanelLayoutForScreen(width, height, width > height);
      setPanelLayout(optimalLayout);
    }
  }, []);

  const getOptimalPanelLayoutForScreen = (width: number, height: number, isLandscape: boolean): 'floating' | 'docked' | 'stacked' => {
    // Small mobile devices (phones)
    if (width < 480) {
      return 'stacked';
    }

    // Large mobile devices (large phones, small tablets)
    if (width < 768) {
      return isLandscape ? 'docked' : 'stacked';
    }

    // Tablets
    if (width < 1024) {
      return 'docked';
    }

    // Desktop
    return 'floating';
  };

  const getOptimalPanelLayout = useCallback((): 'floating' | 'docked' | 'stacked' => {
    return getOptimalPanelLayoutForScreen(screenWidth, screenHeight, isLandscape);
  }, [screenWidth, screenHeight, isLandscape]);

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

    // Add visual viewport API support for better mobile detection
    const handleVisualViewportChange = () => {
      if (window.visualViewport) {
        setScreenWidth(window.visualViewport.width);
        setScreenHeight(window.visualViewport.height);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    // Visual viewport API for better mobile keyboard handling
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleVisualViewportChange);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleVisualViewportChange);
      }
    };
  }, [updateScreenDimensions, detectTouch]);

  const value: ResponsiveContextType = {
    isMobile,
    isTablet,
    isDesktop,
    isSmallMobile,
    isLargeMobile,
    screenWidth,
    screenHeight,
    orientation,
    panelLayout,
    isTouch,
    isLandscape,
    isPortrait,
    setPanelLayout,
    getOptimalPanelLayout,
  };

  return (
    <ResponsiveContext.Provider value={value}>
      {children}
    </ResponsiveContext.Provider>
  );
};
