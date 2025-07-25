'use client';

import React, { useEffect, useState } from 'react';
import { useResponsive } from '../../app/context/ResponsiveContext';
import { useTheme } from '../../app/context/ThemeContext';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  mainContent: React.ReactNode;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ children, mainContent }) => {
  const { isMobile, isTablet, panelLayout, setPanelLayout, screenWidth } = useResponsive();
  const { theme } = useTheme();
  const [showLayoutSelector, setShowLayoutSelector] = useState(false);

  // Auto-hide layout selector on mobile
  useEffect(() => {
    if (isMobile) {
      setShowLayoutSelector(false);
    }
  }, [isMobile]);

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
      <div className={styles.main}>
        {mainContent}
        
        {/* Floating and Docked panels render over main content */}
        {panelLayout !== 'stacked' && children}
      </div>

      {/* Mobile Panel Toggle (Bottom of screen) */}
      {isMobile && panelLayout === 'stacked' && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-60">
          <button
            onClick={() => {
              const sidebar = document.querySelector('[data-mobile-sidebar]') as HTMLElement;
              if (sidebar) {
                sidebar.classList.toggle('translate-y-full');
              }
            }}
            className={`px-6 py-3 rounded-full transition-all duration-300 btn-enhanced focus-ring
              ${theme === 'dark'
                ? 'bg-gradient-dark-secondary border border-dark-border text-dark-text-primary'
                : 'bg-gradient-light-primary border border-light-border text-light-text-primary'
              } shadow-lg backdrop-blur-sm`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default ResponsiveLayout;
