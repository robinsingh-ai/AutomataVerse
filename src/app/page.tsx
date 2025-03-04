'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from './context/ThemeContext';
import Navbar from './components/Navbar';

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const themeColor = '#70D9C2';

  return (
    <div className={`overflow-auto ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Fixed Header */}
      <Navbar onThemeChange={toggleTheme} currentTheme={theme} />
      
      {/* Floating Feedback Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <a 
          href="https://docs.google.com/forms/d/e/1FAIpQLSdmNyVJTWUU7G5W7Zxu6jX9NPHWoz4g82x67UEvc-y-0SaXkw/viewform?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-full shadow-lg text-white transition-all duration-300 hover:scale-105"
          style={{ backgroundColor: themeColor }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          Feedback
        </a>
      </div>
      
      {/* Hero Section */}
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 flex flex-wrap lg:flex-nowrap items-center">
          <div className="w-full lg:w-1/2 lg:pr-8">
            <div className={`mb-8 inline-block px-3 py-1 rounded-full text-sm font-semibold ${
              isDark ? 'bg-opacity-20 bg-teal-600 text-teal-200' : 'bg-teal-100 text-teal-800'
            }`} style={{ backgroundColor: isDark ? 'rgba(112, 217, 194, 0.2)' : 'rgba(112, 217, 194, 0.2)' }}>
              Interactive Automata Simulation
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Dive into the world of <span style={{ color: themeColor }}>Automata Theory</span> for free!
            </h1>
            <p className={`text-lg mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              From simple finite automata to complex Turing machines, plot state diagrams, 
              test input strings, and explore the foundations of theoretical computer science.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/simulator" 
                className="px-8 py-3 text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                style={{ backgroundColor: themeColor }}>
                Launch Simulator
              </Link>
              <Link href="/getting-started" 
                className={`px-8 py-3 rounded-lg font-medium border transition-colors ${
                  isDark ? 'bg-gray-800 text-white hover:bg-gray-700 border-gray-700' : 'bg-white text-gray-800 hover:bg-gray-100 border-gray-300'
                }`}>
                Learn More
              </Link>
            </div>
          </div>
          <div className="w-full lg:w-1/2 mt-12 lg:mt-0">
            <div className={`relative rounded-xl overflow-hidden shadow-xl ${
              isDark ? 'bg-gray-800' : 'bg-white'
            } p-4`}>
              {/* Automata State Diagram Visualization */}
              <style jsx>{`
                @keyframes pulse {
                  0% { transform: scale(1); opacity: 1; }
                  50% { transform: scale(1.03); opacity: 0.9; }
                  100% { transform: scale(1); opacity: 1; }
                }
                @keyframes dash {
                  to { stroke-dashoffset: 0; }
                }
                @keyframes fadeIn {
                  from { opacity: 0; }
                  to { opacity: 1; }
                }
                @keyframes glow {
                  0% { filter: drop-shadow(0 0 2px rgba(112, 217, 194, 0.3)); }
                  50% { filter: drop-shadow(0 0 5px rgba(112, 217, 194, 0.5)); }
                  100% { filter: drop-shadow(0 0 2px rgba(112, 217, 194, 0.3)); }
                }
                .animate-pulse-slow {
                  animation: pulse 3s infinite ease-in-out;
                }
                .animate-dash {
                  animation: dash 1.5s ease-in-out forwards;
                }
                .animate-fade-in {
                  animation: fadeIn 1s ease-out forwards;
                }
                .animate-glow {
                  animation: glow 3s infinite ease-in-out;
                }
                .svg-container {
                  transform: translateZ(0);
                  backface-visibility: hidden;
                }
              `}</style>
              <div className="svg-container">
                <svg viewBox="0 0 600 400" className="w-full h-auto">
                  {/* Background Grid */}
                  <defs>
                    <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke={isDark ? "#2a374a" : "#f0f0f0"} strokeWidth="1"/>
                    </pattern>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <linearGradient id="stateGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={isDark ? "#2d3748" : "#ffffff"} />
                      <stop offset="100%" stopColor={isDark ? "#1a202c" : "#f9fafb"} />
                    </linearGradient>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill={themeColor} />
                    </marker>
                    <marker id="startArrow" markerWidth="12" markerHeight="12" refX="6" refY="6" orient="auto">
                      <circle cx="6" cy="6" r="2" fill={themeColor} />
                      <path d="M 6 2 L 10 6 L 6 10" fill="none" stroke={themeColor} strokeWidth="2" />
                    </marker>
                  </defs>
                  
                  {/* Background */}
                  <rect width="100%" height="100%" fill={`url(#grid)`} className="animate-fade-in" style={{ animationDelay: '0.2s' }} />
                  
                  {/* State Circles */}
                  <g className="animate-pulse-slow" style={{ animationDelay: '0.2s' }}>
                    {/* Start State q0 */}
                    <circle cx="150" cy="200" r="40" fill="url(#stateGradient)" stroke={themeColor} strokeWidth="3" />
                    <text x="150" y="200" fontSize="18" fontWeight="bold" fill={isDark ? "#fff" : "#000"} textAnchor="middle" dominantBaseline="middle">q₀</text>
                    <circle cx="150" cy="200" r="46" fill="none" stroke={themeColor} strokeWidth="2" strokeDasharray="5,5" className="animate-glow" />
                  </g>
                  
                  <g className="animate-pulse-slow" style={{ animationDelay: '0.5s' }}>
                    {/* Middle State q1 */}
                    <circle cx="300" cy="200" r="40" fill="url(#stateGradient)" stroke={themeColor} strokeWidth="3" />
                    <text x="300" y="200" fontSize="18" fontWeight="bold" fill={isDark ? "#fff" : "#000"} textAnchor="middle" dominantBaseline="middle">q₁</text>
                  </g>
                  
                  <g className="animate-pulse-slow" style={{ animationDelay: '0.8s' }}>
                    {/* Accept State q2 */}
                    <circle cx="450" cy="200" r="40" fill="url(#stateGradient)" stroke={themeColor} strokeWidth="3" />
                    <circle cx="450" cy="200" r="34" fill="none" stroke={themeColor} strokeWidth="2" className="animate-glow" />
                    <text x="450" y="200" fontSize="18" fontWeight="bold" fill={isDark ? "#fff" : "#000"} textAnchor="middle" dominantBaseline="middle">q₂</text>
                  </g>
                  
                  {/* Start Arrow */}
                  <path 
                    d="M 80 200 L 100 200" 
                    stroke={themeColor} 
                    strokeWidth="2.5"
                    markerEnd="url(#arrowhead)"
                    className="animate-dash"
                    style={{ strokeDasharray: 40, strokeDashoffset: 40, animationDelay: '0.3s' }}
                  />
                  <text x="80" y="190" fontSize="14" fill={isDark ? "#fff" : "#000"} textAnchor="middle" className="animate-fade-in" style={{ animationDelay: '0.9s' }}>start</text>
                  
                  {/* Transition: q0 to q1 with '0' */}
                  <path 
                    d="M 190 200 L 250 200" 
                    stroke={themeColor} 
                    strokeWidth="2.5" 
                    markerEnd="url(#arrowhead)"
                    className="animate-dash"
                    style={{ strokeDasharray: 60, strokeDashoffset: 60, animationDelay: '1s' }}
                  />
                  <text x="220" y="190" fontSize="16" fill={isDark ? "#fff" : "#000"} textAnchor="middle" className="animate-fade-in" style={{ animationDelay: '1.4s' }}>0</text>
                  
                  {/* Transition: q1 to q2 with '1' */}
                  <path 
                    d="M 340 200 L 400 200" 
                    stroke={themeColor} 
                    strokeWidth="2.5" 
                    markerEnd="url(#arrowhead)"
                    className="animate-dash"
                    style={{ strokeDasharray: 60, strokeDashoffset: 60, animationDelay: '1.3s' }}
                  />
                  <text x="370" y="190" fontSize="16" fill={isDark ? "#fff" : "#000"} textAnchor="middle" className="animate-fade-in" style={{ animationDelay: '1.6s' }}>1</text>
                  
                  {/* Loop transitions */}
                  {/* q0 to q1 with '1' - Curved Bottom */}
                  <path 
                    d="M 150 240 Q 150 300 230 300 Q 310 300 300 240" 
                    stroke={themeColor} 
                    strokeWidth="2.5" 
                    markerEnd="url(#arrowhead)"
                    fill="none"
                    className="animate-dash"
                    style={{ strokeDasharray: 250, strokeDashoffset: 250, animationDelay: '1.6s' }}
                  />
                  <text x="230" y="320" fontSize="16" fill={isDark ? "#fff" : "#000"} textAnchor="middle" className="animate-fade-in" style={{ animationDelay: '2.1s' }}>1</text>
                  
                  {/* q1 to q0 with '0' - Curved Top */}
                  <path 
                    d="M 300 160 Q 300 100 220 100 Q 140 100 150 160" 
                    stroke={themeColor} 
                    strokeWidth="2.5" 
                    markerEnd="url(#arrowhead)"
                    fill="none"
                    className="animate-dash"
                    style={{ strokeDasharray: 250, strokeDashoffset: 250, animationDelay: '1.9s' }}
                  />
                  <text x="230" y="80" fontSize="16" fill={isDark ? "#fff" : "#000"} textAnchor="middle" className="animate-fade-in" style={{ animationDelay: '2.4s' }}>0</text>
                  
                  {/* q2 self-loop with '0,1' */}
                  <path 
                    d="M 480 180 C 530 180 530 220 480 220" 
                    stroke={themeColor} 
                    strokeWidth="2.5" 
                    markerEnd="url(#arrowhead)"
                    fill="none"
                    className="animate-dash"
                    style={{ strokeDasharray: 120, strokeDashoffset: 120, animationDelay: '2.2s' }}
                  />
                  <text x="520" y="200" fontSize="16" fill={isDark ? "#fff" : "#000"} textAnchor="middle" className="animate-fade-in" style={{ animationDelay: '2.8s' }}>0,1</text>
                  
                  {/* Animated elements showing automata types */}
                  <g className="animate-fade-in" style={{ animationDelay: '3s', opacity: 0 }}>
                    {/* Stack visualization for PDA */}
                    <rect x="520" y="240" width="30" height="80" fill="none" stroke={themeColor} strokeWidth="1.5" strokeDasharray="4,4" rx="2" />
                    <rect x="525" y="290" width="20" height="15" fill={isDark ? 'rgba(112, 217, 194, 0.3)' : 'rgba(112, 217, 194, 0.2)'} stroke={themeColor} strokeWidth="1" rx="1" />
                    <rect x="525" y="275" width="20" height="15" fill={isDark ? 'rgba(112, 217, 194, 0.3)' : 'rgba(112, 217, 194, 0.2)'} stroke={themeColor} strokeWidth="1" rx="1" />
                    <rect x="525" y="260" width="20" height="15" fill={isDark ? 'rgba(112, 217, 194, 0.3)' : 'rgba(112, 217, 194, 0.2)'} stroke={themeColor} strokeWidth="1" rx="1" />
                    <text x="535" y="235" fontSize="10" fill={isDark ? "#fff" : "#000"} textAnchor="middle" className="animate-fade-in" style={{ animationDelay: '3.2s' }}>Stack</text>
                  </g>
                  
                  <g className="animate-fade-in" style={{ animationDelay: '3.3s', opacity: 0 }}>
                    {/* Tape visualization for Turing Machine */}
                    <rect x="70" y="310" width="200" height="30" fill="none" stroke={themeColor} strokeWidth="1.5" rx="2" />
                    <line x1="100" y1="310" x2="100" y2="340" stroke={themeColor} strokeWidth="1" />
                    <line x1="130" y1="310" x2="130" y2="340" stroke={themeColor} strokeWidth="1" />
                    <line x1="160" y1="310" x2="160" y2="340" stroke={themeColor} strokeWidth="1" />
                    <line x1="190" y1="310" x2="190" y2="340" stroke={themeColor} strokeWidth="1" />
                    <line x1="220" y1="310" x2="220" y2="340" stroke={themeColor} strokeWidth="1" />
                    <line x1="250" y1="310" x2="250" y2="340" stroke={themeColor} strokeWidth="1" />
                    <text x="85" y="328" fontSize="12" fill={isDark ? "#fff" : "#000"} textAnchor="middle">0</text>
                    <text x="115" y="328" fontSize="12" fill={isDark ? "#fff" : "#000"} textAnchor="middle">1</text>
                    <text x="145" y="328" fontSize="12" fill={isDark ? "#fff" : "#000"} textAnchor="middle">0</text>
                    <text x="175" y="328" fontSize="12" fill={isDark ? "#fff" : "#000"} textAnchor="middle">1</text>
                    <text x="205" y="328" fontSize="12" fill={isDark ? "#fff" : "#000"} textAnchor="middle">_</text>
                    <text x="235" y="328" fontSize="12" fill={isDark ? "#fff" : "#000"} textAnchor="middle">_</text>
                    <polygon points="145,300 160,310 145,320" fill={themeColor} className="animate-pulse-slow" />
                    <text x="170" y="300" fontSize="10" fill={isDark ? "#fff" : "#000"} textAnchor="middle" className="animate-fade-in" style={{ animationDelay: '3.5s' }}>Tape</text>
                  </g>
                  
                  {/* Type of Automaton Labels */}
                  <g className="animate-fade-in" style={{ animationDelay: '3.7s', opacity: 0 }}>
                    <rect x="300" y="80" width="100" height="25" rx="12.5" fill={isDark ? 'rgba(112, 217, 194, 0.2)' : 'rgba(112, 217, 194, 0.2)'} stroke={themeColor} strokeWidth="1" />
                    <text x="350" y="97" fontSize="12" fill={isDark ? "#fff" : "#000"} textAnchor="middle">DFA</text>
                    
                    <rect x="300" y="110" width="100" height="25" rx="12.5" fill="none" stroke={themeColor} strokeWidth="1" strokeDasharray="3,3" />
                    <text x="350" y="127" fontSize="12" fill={isDark ? "#fff" : "#000"} textAnchor="middle" opacity="0.7">NFA</text>
                    
                    <rect x="410" y="80" width="100" height="25" rx="12.5" fill="none" stroke={themeColor} strokeWidth="1" strokeDasharray="3,3" />
                    <text x="460" y="97" fontSize="12" fill={isDark ? "#fff" : "#000"} textAnchor="middle" opacity="0.7">PDA</text>
                    
                    <rect x="410" y="110" width="100" height="25" rx="12.5" fill="none" stroke={themeColor} strokeWidth="1" strokeDasharray="3,3" />
                    <text x="460" y="127" fontSize="12" fill={isDark ? "#fff" : "#000"} textAnchor="middle" opacity="0.7">TM</text>
                  </g>
                </svg>
              </div>
              <div className={`mt-4 p-3 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <p className="text-sm font-mono">DFA that accepts binary strings ending with "01"</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className={`py-16 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Explore Automata Theory</h2>
            <p className={`text-lg max-w-2xl mx-auto mb-12 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Discover and learn about different types of automata with interactive visualizations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature Card 1 */}
            <div className={`rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'} p-6 shadow-md transition-transform duration-300 hover:scale-105`}>
              <div className="flex items-center justify-center h-12 w-12 rounded-md text-white mb-4" style={{ backgroundColor: themeColor }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Finite Automata</h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Create and simulate DFAs and NFAs with an intuitive visual editor
              </p>
            </div>
            
            {/* Feature Card 2 */}
            <div className={`rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'} p-6 shadow-md transition-transform duration-300 hover:scale-105`}>
              <div className="flex items-center justify-center h-12 w-12 rounded-md text-white mb-4" style={{ backgroundColor: themeColor }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Pushdown Automata</h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Model context-free languages with stack-based computation
              </p>
            </div>
            
            {/* Feature Card 3 */}
            <div className={`rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'} p-6 shadow-md transition-transform duration-300 hover:scale-105`}>
              <div className="flex items-center justify-center h-12 w-12 rounded-md text-white mb-4" style={{ backgroundColor: themeColor }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Turing Machines</h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Explore the most powerful computational model with tape-based simulation
              </p>
            </div>
            
            {/* Feature Card 4 */}
            <div className={`rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'} p-6 shadow-md transition-transform duration-300 hover:scale-105`}>
              <div className="flex items-center justify-center h-12 w-12 rounded-md text-white mb-4" style={{ backgroundColor: themeColor }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Learning Resources</h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Comprehensive tutorials and examples to understand automata theory
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`rounded-xl overflow-hidden shadow-xl bg-gradient-to-r ${isDark ? 'from-gray-800 to-gray-700' : 'from-teal-50 to-white'}`}>
            <div className="px-6 py-12 md:py-20 md:px-12 relative overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10" style={{ background: `radial-gradient(circle, ${themeColor} 2px, transparent 2px)`, backgroundSize: '30px 30px' }}></div>
              
              <div className="text-center relative z-10">
                <h2 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Ready to explore automata theory?</h2>
                <p className={`text-xl mb-8 max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Start building and simulating automata with our interactive tools
                </p>
                <Link href="/simulator" 
                  className="inline-block px-8 py-4 rounded-lg font-medium text-white transform transition-transform hover:scale-105 hover:shadow-lg"
                  style={{ backgroundColor: themeColor }}>
                  Get Started Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className={`py-12 ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <span className="text-xl font-medium">
                  <span style={{ color: '#70DAC2' }}>Automata</span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Verse</span>
                </span>
              </div>
              <p className="mt-2 text-sm font-medium">
                Copyright © 2025 CircuitVerse, All rights reserved.
              </p>
              <p className="mt-1 text-sm font-medium">
                Developed by <a 
                  href="https://robinsingh.xyz" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-semibold hover:text-teal-500 transition-colors"
                  style={{ color: themeColor }}
                >
                  Robin
                </a>
              </p>
            </div>
            <div className="flex flex-wrap gap-8">
              <div>
                <h3 className="font-semibold mb-3">Simulators</h3>
                <ul className="space-y-2">
                  <li><Link href="/simulator/dfa" className="hover:text-teal-500 transition-colors">DFA</Link></li>
                  <li><Link href="/simulator/nfa" className="hover:text-teal-500 transition-colors">NFA</Link></li>
                  <li><Link href="/simulator/pda" className="hover:text-teal-500 transition-colors">PDA</Link></li>
                  <li><Link href="/simulator/tm" className="hover:text-teal-500 transition-colors">Turing Machine</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Resources</h3>
                <ul className="space-y-2">
                  <li><Link href="/getting-started" className="hover:text-teal-500 transition-colors">Getting Started</Link></li>
                  <li><Link href="/features" className="hover:text-teal-500 transition-colors">Features</Link></li>
                  <li><Link href="/blog" className="hover:text-teal-500 transition-colors">Blog</Link></li>
                  <li><Link href="/about" className="hover:text-teal-500 transition-colors">About</Link></li>
                  <li>
                    <a 
                      href="https://docs.google.com/forms/d/e/1FAIpQLSdmNyVJTWUU7G5W7Zxu6jX9NPHWoz4g82x67UEvc-y-0SaXkw/viewform?usp=sharing"
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="hover:text-teal-500 transition-colors"
                    >
                      Feedback
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
      
      
    </div>
  );
}