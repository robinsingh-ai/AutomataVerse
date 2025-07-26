'use client';

import React, { useEffect, useState } from 'react';
import { useResponsive } from '../../app/context/ResponsiveContext';
import { useTheme } from '../../app/context/ThemeContext';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  mainContent: React.ReactNode;
  mobilePanelPriority?: 'high' | 'medium' | 'low';
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  mainContent,
  mobilePanelPriority = 'medium'
}) => {
  const {
    isMobile,
    isTablet,
    isSmallMobile,
    panelLayout,
    setPanelLayout,
    screenWidth,
    isLandscape,
    getOptimalPanelLayout
  } = useResponsive();
  const { theme } = useTheme();
  const [showLayoutSelector, setShowLayoutSelector] = useState(false);
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);

  // Auto-hide layout selector on mobile
  useEffect(() => {
    if (isMobile) {
      setShowLayoutSelector(false);
    }
  }, [isMobile]);

  // Auto-optimize layout based on screen size
  useEffect(() => {
    const optimalLayout = getOptimalPanelLayout();
    if (panelLayout !== optimalLayout) {
      setPanelLayout(optimalLayout);
    }
  }, [screenWidth, isLandscape, getOptimalPanelLayout, panelLayout, setPanelLayout]);

  const layoutOptions = [
    { key: 'floating', label: 'Floating', icon: '🪟' },
    { key: 'docked', label: 'Docked', icon: '📌' },
    { key: 'stacked', label: 'Stacked', icon: '📚' },
  ];

  const getLayoutStyles = () => {
    switch (panelLayout) {
      case 'stacked':
        return {
          container: 'flex flex-col lg:flex-row min-h-screen',
          sidebar: `${isMobile ? 'w-full' : 'w-80'} ${isMobile ? '' : 'lg:h-screen'} overflow-y-auto bg-opacity-50 backdrop-blur-sm`,
          main: 'flex-1 relative',
          panels: 'p-4 space-y-4',
        };
      case 'docked':
        return {
          container: 'relative min-h-screen',
          sidebar: '',
          main: 'w-full h-full',
          panels: '',
        };
      case 'floating':
      default:
        return {
          container: 'relative min-h-screen',
          sidebar: '',
          main: 'w-full h-full',
          panels: '',
        };
    }
  };

  const styles = getLayoutStyles();

  return (
    <div className={styles.container}>
      {/* Layout Selector (Desktop only) */}
      {!isMobile && (
        <div className="fixed top-20 right-4 z-60">
          <button
            onClick={() => setShowLayoutSelector(!showLayoutSelector)}
            className={`p-3 rounded-xl transition-all duration-300 btn-enhanced focus-ring
              ${theme === 'dark'
                ? 'bg-gradient-dark-secondary border border-dark-border text-dark-text-primary hover:bg-dark-accent'
                : 'bg-gradient-light-primary border border-light-border text-light-text-primary hover:bg-light-accent'
              } shadow-lg hover:shadow-xl backdrop-blur-sm`}
            aria-label="Layout Options"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>

          {showLayoutSelector && (
            <div className={`absolute top-full right-0 mt-2 p-2 rounded-xl shadow-xl backdrop-blur-sm
              ${theme === 'dark'
                ? 'bg-gradient-dark-secondary border border-dark-border'
                : 'bg-gradient-light-primary border border-light-border'
              } animate-fade-in`}>
              {layoutOptions.map((option) => (
                <button
                  key={option.key}
                  onClick={() => {
                    setPanelLayout(option.key as any);
                    setShowLayoutSelector(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200
                    ${panelLayout === option.key
                      ? (theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                      : (theme === 'dark'
                        ? 'hover:bg-dark-accent text-dark-text-secondary hover:text-dark-text-primary'
                        : 'hover:bg-light-accent text-light-text-secondary hover:text-light-text-primary'
                      )
                    }`}
                >
                  <span className="text-lg">{option.icon}</span>
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Stacked Layout Sidebar */}
      {panelLayout === 'stacked' && (
        <div className={`${styles.sidebar} ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50/50'}`}>
          <div className={styles.panels}>
            {children}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className={`${styles.main} ${isMobile ? 'mobile-canvas-container' : ''}`}>
        {mainContent}

        {/* Floating and Docked panels render over main content */}
        {panelLayout !== 'stacked' && children}
      </div>

      {/* Mobile Panel Management */}
      {isMobile && (
        <>
          {/* Mobile Panel Toggle (Bottom of screen) */}
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-60">
            <button
              onClick={() => setMobilePanelOpen(!mobilePanelOpen)}
              className={`px-6 py-3 rounded-full transition-all duration-300 btn-enhanced focus-ring touch-target
                ${theme === 'dark'
                  ? 'bg-gradient-dark-secondary border border-dark-border text-dark-text-primary'
                  : 'bg-gradient-light-primary border border-light-border text-light-text-primary'
                } shadow-lg backdrop-blur-sm`}
              aria-label="Toggle panels"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>

          {/* Mobile Panel Stack */}
          {mobilePanelOpen && (
            <div className="mobile-panel-stack">
              <div className={`${theme === 'dark' ? 'bg-gray-900/95' : 'bg-white/95'} p-4 mobile-safe-area`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Controls & Panels
                  </h3>
                  <button
                    onClick={() => setMobilePanelOpen(false)}
                    className={`p-2 rounded-lg transition-colors touch-target
                      ${theme === 'dark'
                        ? 'hover:bg-gray-800 text-gray-400 hover:text-white'
                        : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                      }`}
                    aria-label="Close panels"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-4 max-h-60vh overflow-y-auto mobile-scroll-container">
                  {children}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Mobile-specific overlay for panel interactions */}
      {isMobile && mobilePanelOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setMobilePanelOpen(false)}
        />
      )}
    </div>
  );
};

export default ResponsiveLayout;
