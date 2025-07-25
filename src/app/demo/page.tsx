'use client';

import React, { Suspense } from 'react';
import AutomataSimulator from './ AutomataSimulator';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';

// Loading component for Suspense fallback
const Loading = () => (
  <div className="flex items-center justify-center w-full h-full">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
  </div>
);

export default function DFASimulatorPage() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <div className={`min-h-screen transition-colors duration-300 mobile-safe-area ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Navbar onThemeChange={toggleTheme} currentTheme={theme} />
      <div className="w-full h-[calc(100vh-64px)] canvas-container">
        <Suspense fallback={<Loading />}>
          <AutomataSimulator />
        </Suspense>
      </div>
    </div>
  );
}
