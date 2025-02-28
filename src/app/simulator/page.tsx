'use client';

import React, { useState } from 'react';
import AutomataSimulator from '../../simulators/dfa/AutomataSimulator';
import Navbar from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';

export default function SimulatorPage() {
  const [simulatorType, setSimulatorType] = useState<'Automata'>('Automata');
  const { theme, setTheme } = useTheme();

  return (
    <main className={`h-screen w-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Navbar onThemeChange={setTheme} currentTheme={theme} />
      
      <div className="pt-16 flex-grow">
        {simulatorType === 'Automata' && <AutomataSimulator />}
      </div>
    </main>
  );
}