'use client';

import React from 'react';
import AutomataSimulator from './ AutomataSimulator';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';

export default function DFASimulatorPage() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Navbar onThemeChange={toggleTheme} currentTheme={theme} />
      <div className="w-full h-[calc(100vh-64px)]">
        <AutomataSimulator />
      </div>
    </div>
  );
}