'use client';

import React from 'react';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';

export default function SimulatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme, setTheme } = useTheme();

  return (
    <main className={`h-screen w-screen flex flex-col overflow-y-auto ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Navbar onThemeChange={setTheme} currentTheme={theme} />
      <div className="pt-16 flex-grow">
        {children}
      </div>
    </main>
  );
} 