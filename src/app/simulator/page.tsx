'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';

// Logo component for simulator types
const SimulatorLogo = ({ id, theme }: { id: string; theme: string }) => {
  // Color mapping for each simulator type
  const colorMap: Record<string, { bg: string; text: string; darkBg: string; darkText: string }> = {
    dfa: { bg: 'bg-green-100', text: 'text-green-800', darkBg: 'bg-green-900', darkText: 'text-green-200' },
    nfa: { bg: 'bg-purple-100', text: 'text-purple-800', darkBg: 'bg-purple-900', darkText: 'text-purple-200' },
    pda: { bg: 'bg-orange-100', text: 'text-orange-800', darkBg: 'bg-orange-900', darkText: 'text-orange-200' },
    tm: { bg: 'bg-blue-100', text: 'text-blue-800', darkBg: 'bg-blue-900', darkText: 'text-blue-200' },
    fsm: { bg: 'bg-yellow-100', text: 'text-yellow-800', darkBg: 'bg-yellow-900', darkText: 'text-yellow-200' },
  };
  
  const colors = colorMap[id] || { bg: 'bg-gray-100', text: 'text-gray-800', darkBg: 'bg-gray-800', darkText: 'text-gray-200' };
  
  // Map simulator IDs to their display names in the logo
  const logoTextMap: Record<string, string> = {
    dfa: 'DFA',
    nfa: 'NFA',
    pda: 'PDA',
    tm: 'TM',
    fsm: 'FSM',
  };
  
  return (
    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${theme === 'dark' ? colors.darkBg : colors.bg}`}>
      <span className={`text-xl font-bold ${theme === 'dark' ? colors.darkText : colors.text}`}>
        {logoTextMap[id] || id.toUpperCase()}
      </span>
    </div>
  );
};

export default function SimulatorHomePage() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const [showBanner, setShowBanner] = useState(true);
  const [activeTab, setActiveTab] = useState('simulators'); // 'simulators' or 'examples'
  
  const simulators = [
    {
      id: 'dfa',
      name: 'DFA Simulator',
      description: 'Deterministic Finite Automaton simulator for creating and testing finite state machines.',
      path: '/simulator/dfa',
    },
    {
      id: 'fsm',
      name: 'Moore/Mealy Machine',
      description: 'Moore/Mealy Machine simulator for creating and testing finite state machines with outputs.',
      path: '/simulator/fsm',
    },
    {
      id: 'nfa',
      name: 'NFA Simulator',
      description: 'Non-deterministic Finite Automaton simulator with support for epsilon transitions.',
      path: '/simulator/nfa',
    },
    {
      id: 'pda',
      name: 'PDA Simulator',
      description: 'Pushdown Automaton simulator with stack operations for context-free languages.',
      path: '/simulator/pda',
    },
    {
      id: 'tm',
      name: 'TM Simulator',
      description: 'Turing Machine simulator with tape manipulation for the most powerful computation model.',
      path: '/simulator/tm',
    },
  ];

  const examples = [
    {
      id: 'dfa-example',
      simulatorId: 'dfa',
      name: 'Even 0s and 1s',
      description: 'A DFA that accepts strings with an even number of both 0s and 1s.',
      path: '/simulator/dfa/test',
    },
    {
      id: 'nfa-example',
      simulatorId: 'nfa',
      name: 'Strings ending with "ab"',
      description: 'An NFA that accepts strings that end with the pattern "ab".',
      path: '/simulator/nfa/test',
    },
    {
      id: 'pda-example1',
      simulatorId: 'pda',
      name: 'a^n b^n',
      description: 'A PDA that accepts strings with an equal number of a\'s and b\'s.',
      path: '/simulator/pda/test/example1',
    },
    {
      id: 'pda-example2',
      simulatorId: 'pda',
      name: 'Balanced Parentheses',
      description: 'A PDA that accepts strings with balanced parentheses.',
      path: '/simulator/pda/test/example2',
    },
    {
      id: 'tm-example1',
      simulatorId: 'tm',
      name: 'TM: TripletChecker',
      description: 'A TM that accepts a^n b^n c^n language.',
      path: '/simulator/tm/test/example1',
    },
    {
      id: 'tm-example2',
      simulatorId: 'tm',
      name: 'TM: Binary Addition',
      description: 'A TM that adds two binary numbers. Try with Input 1010 and 1011 separated by \'c\'.',
      path: '/simulator/tm/test/example3',
    },
    {
      id: 'fsm-example1',
      simulatorId: 'fsm',
      name: 'Moore Machine: Detect 101',
      description: 'A Moore Machine that detects \'101\' in a binary string.',
      path: '/simulator/fsm/test/example1',
    },
    {
      id: 'fsm-example2',
      simulatorId: 'fsm',
      name: 'Mealy Machine: Detect 101',
      description: 'A Mealy Machine that detects \'101\' in a binary string.',
      path: '/simulator/fsm/test/example2',
    },
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Navbar onThemeChange={toggleTheme} currentTheme={theme} />
      
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Explore <span className="text-teal-500">Automata</span> Simulators
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 opacity-75">
            Interact with powerful simulation tools for various types of automata. Design, test, and visualize computational models.
          </p>
          
          {/* Announcement Banner */}
          {showBanner && (
            <div className={`max-w-3xl mx-auto p-4 rounded-lg ${isDark ? 'bg-green-900/30 text-green-200' : 'bg-green-100 text-green-800'} relative`}>
              <span className="font-medium">Update: Added Moore and Mealy Machine Simulators.</span>
              <button 
                onClick={() => setShowBanner(false)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 hover:opacity-70 transition-opacity"
                aria-label="Close banner"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </div>
        
        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className={`inline-flex rounded-lg p-1 ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
            <button
              onClick={() => setActiveTab('simulators')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'simulators' 
                  ? isDark 
                    ? 'bg-gray-700 text-white' 
                    : 'bg-white text-gray-900 shadow'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Simulators
            </button>
            <button
              onClick={() => setActiveTab('examples')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'examples'
                  ? isDark 
                    ? 'bg-gray-700 text-white' 
                    : 'bg-white text-gray-900 shadow'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Examples
            </button>
          </div>
        </div>
        
        {/* Simulators Grid */}
        {activeTab === 'simulators' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {simulators.map((simulator) => (
              <div 
                key={simulator.id}
                className={`rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${
                  isDark ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <div className={`h-3 ${
                  isDark 
                    ? simulator.id === 'dfa' ? 'bg-green-700' 
                    : simulator.id === 'nfa' ? 'bg-purple-700'
                    : simulator.id === 'pda' ? 'bg-orange-700'
                    : simulator.id === 'tm' ? 'bg-blue-700'
                    : 'bg-yellow-700'
                    : simulator.id === 'dfa' ? 'bg-green-500' 
                    : simulator.id === 'nfa' ? 'bg-purple-500'
                    : simulator.id === 'pda' ? 'bg-orange-500'
                    : simulator.id === 'tm' ? 'bg-blue-500'
                    : 'bg-yellow-500'
                }`}></div>
                
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <SimulatorLogo id={simulator.id} theme={theme} />
                    <div className="ml-4">
                      <h2 className="text-xl font-bold">{simulator.name}</h2>
                      <div className={`text-xs font-medium rounded-full px-2 py-1 inline-block mt-1 ${
                        isDark 
                          ? simulator.id === 'dfa' ? 'bg-green-900/30 text-green-200' 
                          : simulator.id === 'nfa' ? 'bg-purple-900/30 text-purple-200'
                          : simulator.id === 'pda' ? 'bg-orange-900/30 text-orange-200'
                          : simulator.id === 'tm' ? 'bg-blue-900/30 text-blue-200'
                          : 'bg-yellow-900/30 text-yellow-200'
                          : simulator.id === 'dfa' ? 'bg-green-100 text-green-800' 
                          : simulator.id === 'nfa' ? 'bg-purple-100 text-purple-800'
                          : simulator.id === 'pda' ? 'bg-orange-100 text-orange-800'
                          : simulator.id === 'tm' ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {simulator.id.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  
                  <p className={`mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {simulator.description}
                  </p>
                  
                  <Link 
                    href={simulator.path}
                    className={`inline-block w-full text-center py-3 px-6 rounded-lg font-medium transition-colors ${
                      isDark 
                        ? simulator.id === 'dfa' ? 'bg-green-700 hover:bg-green-600 text-white' 
                        : simulator.id === 'nfa' ? 'bg-purple-700 hover:bg-purple-600 text-white'
                        : simulator.id === 'pda' ? 'bg-orange-700 hover:bg-orange-600 text-white'
                        : simulator.id === 'tm' ? 'bg-blue-700 hover:bg-blue-600 text-white'
                        : 'bg-yellow-700 hover:bg-yellow-600 text-white'
                        : simulator.id === 'dfa' ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : simulator.id === 'nfa' ? 'bg-purple-600 hover:bg-purple-700 text-white'
                        : simulator.id === 'pda' ? 'bg-orange-600 hover:bg-orange-700 text-white'
                        : simulator.id === 'tm' ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                    }`}
                  >
                    Open Simulator
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Examples Grid */}
        {activeTab === 'examples' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {examples.map((example) => (
              <Link 
                href={example.path} 
                key={example.id}
                className={`group rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${
                  isDark ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start mb-4">
                    <div className="mr-4 mt-1">
                      <SimulatorLogo id={example.simulatorId} theme={theme} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold mb-2">{example.name}</h2>
                      <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {example.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <span className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors group-hover:scale-105 transform ${
                      isDark 
                        ? example.simulatorId === 'dfa' ? 'bg-green-900/30 text-green-200' 
                        : example.simulatorId === 'nfa' ? 'bg-purple-900/30 text-purple-200'
                        : example.simulatorId === 'pda' ? 'bg-orange-900/30 text-orange-200'
                        : example.simulatorId === 'tm' ? 'bg-blue-900/30 text-blue-200'
                        : 'bg-yellow-900/30 text-yellow-200'
                        : example.simulatorId === 'dfa' ? 'bg-green-100 text-green-800' 
                        : example.simulatorId === 'nfa' ? 'bg-purple-100 text-purple-800'
                        : example.simulatorId === 'pda' ? 'bg-orange-100 text-orange-800'
                        : example.simulatorId === 'tm' ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      Try Example 
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        {/* Simulators Overview */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-3">Computational Models Hierarchy</h2>
          <p className={`max-w-2xl mx-auto mb-12 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Explore the hierarchy of automata from simple to Turing-complete models
          </p>
          
          <div className={`relative max-w-4xl mx-auto p-8 rounded-xl ${
            isDark ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
              {/* Connecting lines */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`w-[80%] h-px ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                <div className={`h-[70%] w-px ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              </div>
              
              {/* DFA */}
              <div className="relative z-10 flex flex-col items-center">
                <SimulatorLogo id="dfa" theme={theme} />
                <h3 className="mt-3 font-semibold">DFA</h3>
                <p className={`mt-1 text-xs text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Regular Languages
                </p>
                <Link 
                  href="/simulator/dfa"
                  className={`mt-2 text-xs font-medium ${
                    isDark ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'
                  }`}
                >
                  Open DFA
                </Link>
              </div>
              
              {/* NFA */}
              <div className="relative z-10 flex flex-col items-center">
                <SimulatorLogo id="nfa" theme={theme} />
                <h3 className="mt-3 font-semibold">NFA</h3>
                <p className={`mt-1 text-xs text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Regular Languages
                </p>
                <Link 
                  href="/simulator/nfa"
                  className={`mt-2 text-xs font-medium ${
                    isDark ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'
                  }`}
                >
                  Open NFA
                </Link>
              </div>
              
              {/* FSM */}
              <div className="relative z-10 flex flex-col items-center">
                <SimulatorLogo id="fsm" theme={theme} />
                <h3 className="mt-3 font-semibold">FSM</h3>
                <p className={`mt-1 text-xs text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Moore/Mealy Machines
                </p>
                <Link 
                  href="/simulator/fsm"
                  className={`mt-2 text-xs font-medium ${
                    isDark ? 'text-yellow-400 hover:text-yellow-300' : 'text-yellow-600 hover:text-yellow-700'
                  }`}
                >
                  Open FSM
                </Link>
              </div>
              
              {/* PDA */}
              <div className="relative z-10 flex flex-col items-center">
                <SimulatorLogo id="pda" theme={theme} />
                <h3 className="mt-3 font-semibold">PDA</h3>
                <p className={`mt-1 text-xs text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Context-Free Languages
                </p>
                <Link 
                  href="/simulator/pda"
                  className={`mt-2 text-xs font-medium ${
                    isDark ? 'text-orange-400 hover:text-orange-300' : 'text-orange-600 hover:text-orange-700'
                  }`}
                >
                  Open PDA
                </Link>
              </div>
              
              {/* TM */}
              <div className="relative z-10 flex flex-col items-center">
                <SimulatorLogo id="tm" theme={theme} />
                <h3 className="mt-3 font-semibold">TM</h3>
                <p className={`mt-1 text-xs text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Recursively Enumerable
                </p>
                <Link 
                  href="/simulator/tm"
                  className={`mt-2 text-xs font-medium ${
                    isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                  }`}
                >
                  Open TM
                </Link>
              </div>
            </div>
            
            <div className={`mt-8 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <p>Increasing expressive power →</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}